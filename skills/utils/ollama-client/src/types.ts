/**
 * Types pour Ollama Client
 */

export interface OllamaConfig {
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  defaultModel: string;
}

export interface ModelInfo {
  name: string;
  modifiedAt: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameterSize: string;
    quantizationLevel: string;
  };
}

export interface GenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  options?: GenerateOptions;
  stream?: boolean;
  raw?: boolean;
  keepAlive?: string | number;
}

export interface GenerateOptions {
  temperature?: number;
  topP?: number;
  topK?: number;
  minP?: number;
  typicalP?: number;
  repeatLastN?: number;
  repeatPenalty?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  mirostat?: number;
  mirostatTau?: number;
  mirostatEta?: number;
  penalizeNewline?: boolean;
  stop?: string[];
  numCtx?: number;
  numPredict?: number;
  numGpu?: number;
  numThread?: number;
  seed?: number;
}

export interface GenerateResponse {
  model: string;
  createdAt: string;
  response: string;
  done: boolean;
  context?: number[];
  totalDuration?: number;
  loadDuration?: number;
  promptEvalCount?: number;
  promptEvalDuration?: number;
  evalCount?: number;
  evalDuration?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  images?: string[];
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export interface ToolCall {
  function: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  options?: GenerateOptions;
  stream?: boolean;
  tools?: Tool[];
  keepAlive?: string | number;
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export interface ChatResponse {
  model: string;
  createdAt: string;
  message: ChatMessage;
  done: boolean;
  totalDuration?: number;
  loadDuration?: number;
  promptEvalCount?: number;
  promptEvalDuration?: number;
  evalCount?: number;
  evalDuration?: number;
}

export interface EmbeddingRequest {
  model: string;
  prompt: string | string[];
  options?: GenerateOptions;
  keepAlive?: string | number;
}

export interface EmbeddingResponse {
  embedding: number[] | number[][];
}

export interface BatchRequest {
  requests: GenerateRequest[];
  concurrency: number;
  onProgress?: (completed: number, total: number) => void;
}

export interface BatchResponse {
  results: (GenerateResponse | Error)[];
  errors: number;
  totalDuration: number;
}

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  context?: string;
  glossary?: Record<string, string>;
  model?: string;
}

export interface TranslationResult {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  model: string;
  duration: number;
  tokensUsed?: number;
}