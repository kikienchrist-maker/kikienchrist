/**
 * Types pour LibreTranslate Setup
 */
export interface LibreTranslateConfig {
  port: number;
  host: string;
  languages: string[];
  threads: number;
  updateInterval: number;
  memoryLimit: string;
  cpuLimit: string;
  dataVolume: string;
}

export interface ServiceStatus {
  running: boolean;
  healthy: boolean;
  url: string;
  version?: string;
  languages?: string[];
  error?: string;
}

export const DEFAULT_CONFIG: LibreTranslateConfig = {
  port: 5000,
  host: 'localhost',
  languages: ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'],
  threads: 4,
  updateInterval: 86400,
  memoryLimit: '4G',
  cpuLimit: '2',
  dataVolume: 'libretranslate_data',
};