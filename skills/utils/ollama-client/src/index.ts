/**
 * Ollama Client - Point d'entrée principal
 */
export * from './types.js';
export * from './config.js';
export * from './client.js';
export { createClient, OllamaClient } from './client.js';
export { DEFAULT_OLLAMA_CONFIG, MODEL_PRESETS, TRANSLATION_SYSTEM_PROMPT, mergeConfig } from './config.js';