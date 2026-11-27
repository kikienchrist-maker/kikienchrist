/**
 * Factory pour créer les providers de traduction
 */
import type { TranslationProvider, ProviderName, TranslationConfig } from '../types.js';
import { OllamaProvider } from './ollama-provider.js';
import { LibreTranslateProvider } from './libretranslate-provider.js';
import { DeepLProvider } from './deepl-provider.js';

export function createProvider(name: ProviderName, config: TranslationConfig): TranslationProvider {
  switch (name) {
    case 'ollama':
      return new OllamaProvider(
        config.ollama.baseUrl,
        config.ollama.defaultModel,
        config.ollama.timeoutMs
      );
    case 'libretranslate':
      return new LibreTranslateProvider(
        config.libretranslate.baseUrl,
        config.libretranslate.apiKey
      );
    case 'deepl':
      if (!config.deepl.apiKey) {
        throw new Error('DeepL API key requise');
      }
      return new DeepLProvider(config.deepl.apiKey, config.deepl.apiUrl);
    default:
      throw new Error(`Provider inconnu: ${name}`);
  }
}

export function createOllamaProvider(baseUrl = 'http://localhost:11434', model = 'qwen2.5:0.5b', timeoutMs = 180000): OllamaProvider {
  return new OllamaProvider(baseUrl, model, timeoutMs);
}

export function getProviderNames(): ProviderName[] {
  return ['ollama', 'libretranslate', 'deepl'];
}