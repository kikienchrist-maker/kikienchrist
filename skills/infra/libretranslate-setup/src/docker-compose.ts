/**
 * Génération docker-compose.yml pour LibreTranslate
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { LibreTranslateConfig } from './types.js';

export function createDockerCompose(config: Partial<LibreTranslateConfig> = {}): string {
  const cfg = {
    port: config.port || 5000,
    host: config.host || 'localhost',
    // Exclure zh/hi (modèles gros) pour tenir en mémoire
    languages: config.languages || ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru'],
    threads: config.threads || 2,
    updateInterval: config.updateInterval || 86400,
    memoryLimit: config.memoryLimit || '6G',
    cpuLimit: config.cpuLimit || '2',
    dataVolume: config.dataVolume || 'libretranslate_data',
  };

  const langStr = cfg.languages.join(',');

  return `version: '3.8'

services:
  libretranslate:
    image: libretranslate/libretranslate:latest
    container_name: kikienchrist-libretranslate
    restart: unless-stopped
    user: "root"
    ports:
      - "${cfg.port}:5000"
    environment:
      - LT_LOAD_ONLY=${langStr}
      - LT_THREADS=${cfg.threads}
      - LT_UPDATE_INTERVAL=${cfg.updateInterval}
    volumes:
      - ${cfg.dataVolume}:/home/libretranslate/.local/share
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 180s
    deploy:
      resources:
        limits:
          memory: ${cfg.memoryLimit}
          cpus: '${cfg.cpuLimit}'

volumes:
  ${cfg.dataVolume}:
    driver: local
`;
}

export function writeDockerCompose(config: Partial<LibreTranslateConfig> = {}, outputPath = 'docker-compose.libretranslate.yml'): void {
  const content = createDockerCompose(config);
  writeFileSync(outputPath, content, 'utf-8');
}