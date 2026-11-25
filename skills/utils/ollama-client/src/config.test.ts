/**
 * Tests pour config.ts
 */
import { describe, it, expect } from 'vitest';
import { DEFAULT_OLLAMA_CONFIG, MODEL_PRESETS, mergeConfig, TRANSLATION_SYSTEM_PROMPT } from './config.js';

describe('config', () => {
  describe('DEFAULT_OLLAMA_CONFIG', () => {
    it('a valeurs par défaut correctes', () => {
      expect(DEFAULT_OLLAMA_CONFIG.baseUrl).toBe('http://localhost:11434');
      expect(DEFAULT_OLLAMA_CONFIG.timeout).toBe(120000);
      expect(DEFAULT_OLLAMA_CONFIG.maxRetries).toBe(3);
      expect(DEFAULT_OLLAMA_CONFIG.retryDelay).toBe(1000);
      expect(DEFAULT_OLLAMA_CONFIG.defaultModel).toBe('qwen2.5:1.5b');
    });
  });

  describe('MODEL_PRESETS', () => {
    it('contient modèles recommandés', () => {
      expect(MODEL_PRESETS['qwen2.5:1.5b']).toBeDefined();
      expect(MODEL_PRESETS['qwen2.5:3b']).toBeDefined();
      expect(MODEL_PRESETS['llama3.2:1b']).toBeDefined();
      expect(MODEL_PRESETS['mistral:7b']).toBeDefined();
    });

    it('chaque preset a propriétés requises', () => {
      for (const preset of Object.values(MODEL_PRESETS)) {
        expect(preset.name).toBeDefined();
        expect(preset.size).toBeDefined();
        expect(preset.speed).toBeDefined();
        expect(preset.quality).toBeDefined();
      }
    });
  });

  describe('mergeConfig', () => {
    it('merge config utilisateur', () => {
      const merged = mergeConfig({ baseUrl: 'http://custom:11434', timeout: 60000 });
      expect(merged.baseUrl).toBe('http://custom:11434');
      expect(merged.timeout).toBe(60000);
      expect(merged.maxRetries).toBe(DEFAULT_OLLAMA_CONFIG.maxRetries);
    });
  });

  describe('TRANSLATION_SYSTEM_PROMPT', () => {
    it('contient règles de traduction', () => {
      expect(TRANSLATION_SYSTEM_PROMPT).toContain('traducteur professionnel');
      expect(TRANSLATION_SYSTEM_PROMPT).toContain('GLOSSAIRE OBLIGATOIRE');
      expect(TRANSLATION_SYSTEM_PROMPT).toContain('Dieu');
      expect(TRANSLATION_SYSTEM_PROMPT).toContain('Jésus');
    });
  });
});