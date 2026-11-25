/**
 * Tests pour client.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaClient, createClient } from './client.js';
import { DEFAULT_OLLAMA_CONFIG } from './config.js';

describe('OllamaClient', () => {
  let client: OllamaClient;
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    client = createClient({ baseUrl: 'http://test:11434', timeout: 5000 });
  });

  describe('createClient', () => {
    it('crée client avec config par défaut', () => {
      const c = createClient();
      expect(c.getConfig().baseUrl).toBe(DEFAULT_OLLAMA_CONFIG.baseUrl);
      expect(c.getConfig().defaultModel).toBe(DEFAULT_OLLAMA_CONFIG.defaultModel);
    });

    it('merge config utilisateur', () => {
      const c = createClient({ baseUrl: 'http://custom:11434', timeout: 30000 });
      expect(c.getConfig().baseUrl).toBe('http://custom:11434');
      expect(c.getConfig().timeout).toBe(30000);
    });
  });

  describe('generate', () => {
    it('envoie requête generate', async () => {
      const mockResponse: any = {
        model: 'test',
        createdAt: '2024-01-01',
        response: 'Hello world',
        done: true,
        totalDuration: 100,
        evalCount: 10,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.generate({ model: 'test', prompt: 'Hello' });
      expect(result.response).toBe('Hello world');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test:11434/api/generate',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('gère erreur HTTP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(client.generate({ model: 'test', prompt: 'Hello' })).rejects.toThrow('Ollama API error 500');
    });
  });

  describe('chat', () => {
    it('envoie requête chat', async () => {
      const mockResponse: any = {
        model: 'test',
        createdAt: '2024-01-01',
        message: { role: 'assistant', content: 'Hi there' },
        done: true,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.chat({
        model: 'test',
        messages: [{ role: 'user', content: 'Hello' }],
      });
      expect(result.message.content).toBe('Hi there');
    });
  });

  describe('embeddings', () => {
    it('génère embeddings', async () => {
      const mockResponse: any = { embedding: [0.1, 0.2, 0.3] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.embeddings({ model: 'test', prompt: 'Hello' });
      expect(result.embedding).toEqual([0.1, 0.2, 0.3]);
    });
  });

  describe('listModels', () => {
    it('liste modèles', async () => {
      const mockResponse: any = {
        models: [
          { name: 'model1', modifiedAt: '2024-01-01', size: 1000, digest: 'abc', details: { format: 'gguf', family: 'llama', families: ['llama'], parameterSize: '7B', quantizationLevel: 'Q4' } },
        ],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const models = await client.listModels();
      expect(models.length).toBe(1);
      expect(models[0].name).toBe('model1');
    });
  });

  describe('batchGenerate', () => {
    it('traite plusieurs requêtes avec concurrence', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'test', response: '1', done: true, totalDuration: 10, evalCount: 5 }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'test', response: '2', done: true, totalDuration: 10, evalCount: 5 }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'test', response: '3', done: true, totalDuration: 10, evalCount: 5 }) });

      const results = await client.batchGenerate({
        requests: [
          { model: 'test', prompt: '1' },
          { model: 'test', prompt: '2' },
          { model: 'test', prompt: '3' },
        ],
        concurrency: 2,
      });

      expect(results.results.length).toBe(3);
      expect(results.errors).toBe(0);
    });
  });

  describe('healthCheck', () => {
    it('retourne true si accessible', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ models: [] }) });
      const healthy = await client.healthCheck();
      expect(healthy).toBe(true);
    });

    it('retourne false si erreur', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));
      const healthy = await client.healthCheck();
      expect(healthy).toBe(false);
    });
  });

  describe('translate', () => {
    it('traduit avec glossaire', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ model: 'test', response: 'Hello world', done: true, totalDuration: 100, evalCount: 20 }),
      });

      const result = await client.translate({
        text: 'Bonjour monde',
        sourceLang: 'fr',
        targetLang: 'en',
        glossary: { 'Bonjour': 'Hello' },
      });

      expect(result.translatedText).toBe('Hello world');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('abort', () => {
    it('annule requête en cours', () => {
      expect(() => client.abort()).not.toThrow();
    });
  });
});