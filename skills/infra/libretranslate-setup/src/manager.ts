/**
 * Manager LibreTranslate - Orchestre Docker Compose CLI + Health checks
 */
import { execSync, spawn } from 'child_process';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { createDockerCompose, writeDockerCompose } from './docker-compose.js';
import { checkHealth, waitForHealthy } from './health.js';
import type { LibreTranslateConfig, ServiceStatus } from './types.js';
import { resolve } from 'path';

export class LibreTranslateManager {
  private config: LibreTranslateConfig;
  private composePath: string;

  constructor(config: Partial<LibreTranslateConfig> = {}, composePath = 'docker-compose.libretranslate.yml') {
    this.config = {
      port: 5000,
      host: 'localhost',
      languages: ['en', 'fr', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'],
      threads: 4,
      updateInterval: 86400,
      memoryLimit: '4G',
      cpuLimit: '2',
      dataVolume: 'libretranslate_data',
      ...config,
    };
    this.composePath = resolve(composePath);
  }

  async deploy(): Promise<ServiceStatus> {
    const spinner = ora('Déploiement LibreTranslate...').start();

    try {
      // 1. Générer docker-compose.yml
      writeDockerCompose(this.config, this.composePath);
      spinner.info(`docker-compose généré: ${this.composePath}`);

      // 2. Pull + Start via docker-compose CLI
      spinner.info('Téléchargement et démarrage...');
      execSync(`docker-compose -f "${this.composePath}" up -d --pull always`, { stdio: 'inherit' });

      // 3. Attendre health check
      spinner.info('Attente health check...');
      const status = await waitForHealthy(`http://${this.config.host}:${this.config.port}`);

      if (status.healthy) {
        spinner.succeed('LibreTranslate déployé et sain !');
        console.log(chalk.cyan(`URL: ${status.url}`));
        console.log(chalk.cyan(`Langues: ${status.languages?.join(', ')}`));
      } else {
        spinner.fail('Health check échoué');
        console.error(chalk.red(status.error));
      }

      return status;
    } catch (error) {
      spinner.fail('Erreur déploiement');
      throw error;
    }
  }

  async stop(): Promise<void> {
    const spinner = ora('Arrêt LibreTranslate...').start();
    try {
      execSync(`docker-compose -f "${this.composePath}" stop`, { stdio: 'inherit' });
      spinner.succeed('Container arrêté');
    } catch (error) {
      spinner.warn('Container déjà arrêté ou inexistant');
    }
  }

  async remove(): Promise<void> {
    const spinner = ora('Suppression LibreTranslate...').start();
    try {
      execSync(`docker-compose -f "${this.composePath}" down -v`, { stdio: 'inherit' });
      spinner.succeed('Container et volumes supprimés');
    } catch (error) {
      spinner.warn('Container déjà supprimé');
    }
  }

  async status(): Promise<ServiceStatus> {
    return checkHealth(`http://${this.config.host}:${this.config.port}`);
  }

  async logs(follow = false): Promise<void> {
    try {
      const args = ['-f', this.composePath, 'logs'];
      if (follow) args.push('-f');
      args.push('--tail', '100');
      
      const child = spawn('docker-compose', args, { stdio: 'inherit' });
      await new Promise((resolve, reject) => {
        child.on('exit', resolve);
        child.on('error', reject);
      });
    } catch (error) {
      console.error(chalk.red('Erreur logs:'), error);
    }
  }
}

export async function createLibreTranslateProvider(baseUrl = 'http://localhost:5000') {
  // Factory pour intégration avec blog-translation
  const status = await checkHealth(baseUrl);
  if (!status.healthy) {
    throw new Error(`LibreTranslate non disponible à ${baseUrl}`);
  }
  return {
    name: 'libretranslate' as const,
    baseUrl,
    async translate(text: string, sourceLang: string, targetLang: string) {
      const response = await axios.post(`${baseUrl}/translate`, {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      });
      return response.data.translatedText;
    },
    async isAvailable() {
      return (await checkHealth(baseUrl)).healthy;
    },
    async getSupportedLanguages() {
      const response = await axios.get(`${baseUrl}/languages`);
      return response.data.map((l: any) => l.code);
    },
  };
}