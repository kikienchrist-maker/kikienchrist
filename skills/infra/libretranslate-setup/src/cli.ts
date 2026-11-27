#!/usr/bin/env node
/**
 * CLI LibreTranslate Setup
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { LibreTranslateManager } from './manager.js';
import { writeDockerCompose } from './docker-compose.js';
import { checkHealth } from './health.js';
import type { LibreTranslateConfig } from './types.js';

const program = new Command();

program
  .name('libretranslate-setup')
  .description('Déployer et gérer LibreTranslate self-hosted (Docker)')
  .version('1.0.0');

program
  .command('deploy')
  .description('Déployer LibreTranslate via Docker Compose')
  .option('-p, --port <number>', 'Port', '5000')
  .option('--host <host>', 'Host', 'localhost')
  .option('--languages <langs>', 'Langues (comma-separated)', 'en,fr,es,pt,it,de,nl,pl,ar,ru,zh,hi')
  .option('--threads <number>', 'Threads', '4')
  .option('--memory <limit>', 'Memory limit', '4G')
  .option('--cpus <limit>', 'CPU limit', '2')
  .option('-f, --compose-file <file>', 'docker-compose output file', 'docker-compose.libretranslate.yml')
  .action(async (options) => {
    const config: Partial<LibreTranslateConfig> = {
      port: parseInt(options.port),
      host: options.host,
      languages: options.languages.split(',').map((l: string) => l.trim()),
      threads: parseInt(options.threads),
      memoryLimit: options.memory,
      cpuLimit: options.cpus,
    };

    const manager = new LibreTranslateManager(config, options.composeFile);
    await manager.deploy();
  });

program
  .command('status')
  .description('Vérifier le statut de LibreTranslate')
  .option('-u, --url <url>', 'Base URL', 'http://localhost:5000')
  .action(async (options) => {
    const status = await checkHealth(options.url);
    if (status.healthy) {
      console.log(chalk.green('✅ LibreTranslate en ligne'));
      console.log(chalk.cyan(`URL: ${status.url}`));
      console.log(chalk.cyan(`Langues: ${status.languages?.join(', ')}`));
    } else {
      console.log(chalk.red('❌ LibreTranslate hors ligne'));
      console.log(chalk.red(`Erreur: ${status.error}`));
      process.exit(1);
    }
  });

program
  .command('stop')
  .description('Arrêter le container LibreTranslate')
  .action(async () => {
    const manager = new LibreTranslateManager();
    await manager.stop();
  });

program
  .command('remove')
  .description('Supprimer le container et volumes LibreTranslate')
  .action(async () => {
    const manager = new LibreTranslateManager();
    await manager.remove();
  });

program
  .command('logs')
  .description('Afficher les logs du container')
  .option('-f, --follow', 'Suivre les logs', false)
  .action(async (options) => {
    const manager = new LibreTranslateManager();
    await manager.logs(options.follow);
  });

program
  .command('generate-compose')
  .description('Générer seulement le fichier docker-compose.yml')
  .option('-p, --port <number>', 'Port', '5000')
  .option('--languages <langs>', 'Langues', 'en,fr,es,pt,it,de,nl,pl,ar,ru,zh,hi')
  .option('-o, --output <file>', 'Fichier de sortie', 'docker-compose.libretranslate.yml')
  .action(async (options) => {
    const config: Partial<LibreTranslateConfig> = {
      port: parseInt(options.port),
      languages: options.languages.split(',').map((l: string) => l.trim()),
    };
    writeDockerCompose(config, options.output);
    console.log(chalk.green(`✅ docker-compose généré: ${options.output}`));
  });

program.parse();