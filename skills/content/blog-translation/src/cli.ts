#!/usr/bin/env node
/**
 * CLI pour Blog Translation
 * Usage: blog-translation [options]
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { translateArticles, type LangCode, type BatchTranslationResult } from './index.js';

const program = new Command();

program
  .name('blog-translation')
  .description('Pipeline de traduction d\'articles blog multilingues')
  .version('1.0.0');

program
  .option('-s, --source-dir <dir>', 'Dossier source des articles', 'src/content/blog')
  .option('-t, --target-langs <langs>', 'Langues cibles (séparées par virgule)', 'en,es,pt,it,de,nl,pl,ar,ru,zh,hi')
  .option('-p, --provider <name>', 'Provider de traduction', 'ollama')
  .option('-m, --model <model>', 'Modèle Ollama', 'qwen2.5:1.5b')
  .option('-c, --concurrency <n>', 'Nombre de traductions parallèles', '2')
  .option('--dry-run', 'Simulation sans écriture', false)
  .option('-o, --output-dir <dir>', 'Dossier de sortie', 'src/content/blog')
  .option('--verbose', 'Logs détaillés', false)
  .action(async (options) => {
    const spinner = ora('Initialisation...').start();
    
    const targetLangs = options.targetLangs.split(',').map((l: string) => l.trim()) as LangCode[];
    
    spinner.succeed('Configuration chargée');
    console.log(chalk.cyan('Source:'), options.sourceDir);
    console.log(chalk.cyan('Langues cibles:'), targetLangs.join(', '));
    console.log(chalk.cyan('Provider:'), options.provider);
    if (options.provider === 'ollama') console.log(chalk.cyan('Modèle:'), options.model);
    console.log(chalk.cyan('Concurrence:'), options.concurrency);
    console.log(chalk.cyan('Dry-run:'), options.dryRun);
    console.log();

    try {
      const result: BatchTranslationResult = await translateArticles({
        sourceDir: options.sourceDir,
        targetLangs,
        provider: options.provider as any,
        model: options.model,
        concurrency: parseInt(options.concurrency),
        dryRun: options.dryRun,
        outputDir: options.outputDir,
      });

      console.log();
      console.log(chalk.bold('=== RÉSUMÉ ==='));
      console.log(chalk.green(`✅ Succès: ${result.summary.success}`));
      console.log(chalk.red(`❌ Échecs: ${result.summary.failed}`));
      console.log(chalk.blue(`⏱️  Durée totale: ${(result.summary.totalDurationMs / 1000).toFixed(1)}s`));
      console.log();
      
      console.log(chalk.bold('Par provider:'));
      for (const [provider, stats] of Object.entries(result.summary.byProvider)) {
        console.log(`  ${provider}: ${chalk.green(stats.success)} ✅ / ${chalk.red(stats.failed)} ❌`);
      }
      
      console.log();
      console.log(chalk.bold('Par langue:'));
      for (const [lang, stats] of Object.entries(result.summary.byLang)) {
        console.log(`  ${lang}: ${chalk.green(stats.success)} ✅ / ${chalk.red(stats.failed)} ❌`);
      }

      if (result.summary.failed > 0) {
        console.log();
        console.log(chalk.yellow('Échecs détaillés:'));
        for (const r of result.results.filter(r => !r.success)) {
          console.log(chalk.red(`  [${r.job.targetLang}] ${r.job.article.translationKey}: ${r.error}`));
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Erreur fatale:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv);