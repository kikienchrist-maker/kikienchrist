/**
 * LibreTranslate Setup - Point d'entrée principal
 */
export { LibreTranslateManager } from './manager.js';
export { createDockerCompose, writeDockerCompose } from './docker-compose.js';
export { checkHealth, waitForHealthy } from './health.js';
export type { LibreTranslateConfig, ServiceStatus } from './types.js';