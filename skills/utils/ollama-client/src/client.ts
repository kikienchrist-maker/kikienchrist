/**
 * Client Ollama principal
 */
import type {
  OllamaConfig,
  GenerateRequest,
  GenerateResponse,
  ChatRequest,
  ChatResponse,
  ChatMessage,
  EmbeddingRequest,
  EmbeddingResponse,
  ModelInfo,
  BatchRequest,
  BatchResponse,
  GenerateOptions,
} from './types.js';
import { mergeConfig, DEFAULT_OLLAMA_CONFIG } from './config.js';

export class OllamaClient {
  private config: OllamaConfig;
  private abortController: AbortController | null = null;

  constructor(config?: Partial<OllamaConfig>) {
    this.config = mergeConfig(config || {});
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit,
    retries = this.config.maxRetries
  ): Promise<T> {
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => this.abortController?.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error ${response.status}: ${errorText}`);
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.config.timeout}ms`);
      }

      if (retries > 0 && this.isRetryableError(error)) {
        await this.sleep(this.config.retryDelay);
        return this.fetchWithRetry<T>(endpoint, options, retries - 1);
      }

      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) return true;
    if (error instanceof Error && error.message.includes('timeout')) return true;
    if (error instanceof Error && error.message.includes('503')) return true;
    if (error instanceof Error && error.message.includes('502')) return true;
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    return this.fetchWithRetry<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: request.model || this.config.defaultModel,
        prompt: request.prompt,
        system: request.system,
        template: request.template,
        context: request.context,
        options: request.options,
        stream: request.stream ?? false,
        raw: request.raw,
        keepAlive: request.keepAlive,
      }),
    });
  }

  async *generateStream(request: GenerateRequest): AsyncGenerator<GenerateResponse> {
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => this.abortController?.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        signal: this.abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: request.model || this.config.defaultModel,
          prompt: request.prompt,
          system: request.system,
          template: request.template,
          context: request.context,
          options: request.options,
          stream: true,
          raw: request.raw,
          keepAlive: request.keepAlive,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              yield JSON.parse(line) as GenerateResponse;
            } catch {
              // Ignore parse errors for incomplete lines
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        try {
          yield JSON.parse(buffer) as GenerateResponse;
        } catch {
          // Ignore
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Stream timeout after ${this.config.timeout}ms`);
      }
      throw error;
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.fetchWithRetry<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        model: request.model || this.config.defaultModel,
        messages: request.messages,
        options: request.options,
        stream: request.stream ?? false,
        tools: request.tools,
        keepAlive: request.keepAlive,
      }),
    });
  }

  async *chatStream(request: ChatRequest): AsyncGenerator<ChatResponse> {
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => this.abortController?.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        signal: this.abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: request.model || this.config.defaultModel,
          messages: request.messages,
          options: request.options,
          stream: true,
          tools: request.tools,
          keepAlive: request.keepAlive,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              yield JSON.parse(line) as ChatResponse;
            } catch {
              // Ignore
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          yield JSON.parse(buffer) as ChatResponse;
        } catch {
          // Ignore
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Stream timeout after ${this.config.timeout}ms`);
      }
      throw error;
    }
  }

  async embeddings(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.fetchWithRetry<EmbeddingResponse>('/api/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        model: request.model || this.config.defaultModel,
        prompt: request.prompt,
        options: request.options,
        keepAlive: request.keepAlive,
      }),
    });
  }

  async listModels(): Promise<ModelInfo[]> {
    const response = await this.fetchWithRetry<{ models: ModelInfo[] }>('/api/tags', {
      method: 'GET',
    });
    return response.models;
  }

  async pullModel(name: string, stream = false): Promise<void> {
    if (stream) {
      const response = await fetch(`${this.config.baseUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stream: true }),
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          console.log(decoder.decode(value, { stream: true }));
        }
      }
    } else {
      await this.fetchWithRetry('/api/pull', {
        method: 'POST',
        body: JSON.stringify({ name, stream: false }),
      });
    }
  }

  async deleteModel(name: string): Promise<void> {
    await this.fetchWithRetry('/api/delete', {
      method: 'DELETE',
      body: JSON.stringify({ name }),
    });
  }

  async batchGenerate(request: BatchRequest): Promise<BatchResponse> {
    const { requests, concurrency, onProgress } = request;
    const results: (GenerateResponse | Error)[] = [];
    let completed = 0;
    let errors = 0;
    const startTime = Date.now();

    // Process in batches of `concurrency`
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const promises = batch.map(async (req, idx) => {
        try {
          const result = await this.generate(req);
          return result;
        } catch (error) {
          return error as Error;
        }
      });

      const batchResults = await Promise.all(promises);
      
      for (const result of batchResults) {
        results.push(result);
        if (result instanceof Error) errors++;
        completed++;
        onProgress?.(completed, requests.length);
      }
    }

    return {
      results,
      errors,
      totalDuration: Date.now() - startTime,
    };
  }

  async translate(request: {
    text: string;
    sourceLang: string;
    targetLang: string;
    context?: string;
    glossary?: Record<string, string>;
    model?: string;
    options?: GenerateOptions;
  }): Promise<{
    translatedText: string;
    duration: number;
    tokensUsed?: number;
  }> {
    const startTime = Date.now();
    
    const glossaryText = request.glossary 
      ? `\nGLOSSAIRE:\n${Object.entries(request.glossary).map(([k, v]) => `${k} -> ${v}`).join('\n')}`
      : '';
    
    const contextText = request.context ? `\nCONTEXTE: ${request.context}` : '';
    
    const prompt = `Traduis du ${request.sourceLang} vers ${request.targetLang}:${contextText}${glossaryText}

TEXTE:
${request.text}`;

    const response = await this.generate({
      model: request.model || this.config.defaultModel,
      prompt,
      system: DEFAULT_OLLAMA_CONFIG.defaultModel.includes('qwen') 
        ? 'Tu es un traducteur professionnel. Réponds uniquement avec la traduction.' 
        : undefined,
      options: {
        temperature: 0.1,
        topP: 0.9,
        numPredict: 2048,
        ...request.options,
      },
    });

    return {
      translatedText: response.response.trim(),
      duration: Date.now() - startTime,
      tokensUsed: response.evalCount,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchWithRetry('/api/tags', { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }

  getConfig(): OllamaConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<OllamaConfig>): void {
    this.config = mergeConfig(config);
  }

  abort(): void {
    this.abortController?.abort();
  }
}

export function createClient(config?: Partial<OllamaConfig>): OllamaClient {
  return new OllamaClient(config);
}