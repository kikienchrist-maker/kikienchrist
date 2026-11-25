#!/usr/bin/env node
/**
 * CLI pour SEO Audit & Fix
 * Usage: seo-audit [options]
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { runSEOAudit } from './index.js';

const program = new Command();

program
  .name('seo-audit')
  .description('Audit SEO complet + auto-fix pour sites Astro statiques (Lighthouse, Meta, Schema.org, Hreflang, Contenu)')
  .version('1.0.0');

program
  .option('-u, --url <url>', 'URL de base du site à auditer', 'https://kikienchrist.vercel.app')
  .option('--urls <urls>', 'URLs spécifiques à auditer (séparées par virgule)')
  .option('--lighthouse', 'Exécuter audits Lighthouse (plus lent)', false)
  .option('--lighthouse-preset <preset>', 'Preset Lighthouse', 'mobile')
  .option('-o, --output-dir <dir>', 'Dossier de sortie pour rapports', './seo-audit-report')
  .option('--performance <n>', 'Seuil performance Lighthouse', '90')
  .option('--accessibility <n>', 'Seuil accessibilité Lighthouse', '95')
  .option('--best-practices <n>', 'Seuil bonnes pratiques Lighthouse', '90')
  .option('--seo <n>', 'Seuil SEO Lighthouse', '90')
  .option('--concurrency <n>', 'Concurrence max requêtes', '5')
  .option('--timeout <ms>', 'Timeout requêtes HTTP', '15000')
  .option('--no-reports', 'Ne pas générer de rapports fichiers', false)
  .option('-v, --verbose', 'Logs détaillés', false)
  .action(async (options) => {
    const spinner = ora('Initialisation SEO Audit...').start();
    
    const urls = options.urls ? options.urls.split(',').map((u: string) => u.trim()) : undefined;
    
    spinner.succeed('Configuration chargée');
    console.log(chalk.cyan('URL de base:'), options.url);
    console.log(chalk.cyan('URLs spécifiques:'), urls ? urls.length : 'auto-découverte (sitemap/crawl)');
    console.log(chalk.cyan('Lighthouse:'), options.lighthouse ? `oui (${options.lighthousePreset})` : 'non');
    console.log(chalk.cyan('Seuils LH:'), `P≥${options.performance} A≥${options.accessibility} BP≥${options.bestPractices} SEO≥${options.seo}`);
    console.log(chalk.cyan('Concurrence:'), options.concurrency);
    console.log(chalk.cyan('Dossier sortie:'), options.outputDir);
    console.log();

    try {
      const report = await runSEOAudit({
        baseUrl: options.url,
        urls,
        runLighthouse: options.lighthouse,
        outputDir: options.outputDir,
        thresholds: {
          performance: parseInt(options.performance),
          accessibility: parseInt(options.accessibility),
          bestPractices: parseInt(options.bestPractices),
          seo: parseInt(options.seo),
        },
      });

      console.log();
      console.log(chalk.bold('=== RÉSUMÉ AUDIT ==='));
      console.log(chalk.green(`✅ Pages auditées: ${report.summary.auditedPages}/${report.summary.totalPages}`));
      console.log(chalk.red(`❌ Pages en erreur: ${report.summary.failedPages}`));
      console.log(chalk.blue(`📊 Score moyen: ${report.summary.averageScore}/100`));
      console.log(chalk.yellow(`🔧 Pages auto-fixables: ${report.summary.pagesNeedingFix}`));
      console.log();
      
      console.log(chalk.bold('Scores Lighthouse moyens:'));
      console.log(`  Performance:      ${report.summary.lighthouseAverages.performance}`);
      console.log(`  Accessibilité:    ${report.summary.lighthouseAverages.accessibility}`);
      console.log(`  Bonnes pratiques: ${report.summary.lighthouseAverages.bestPractices}`);
      console.log(`  SEO:              ${report.summary.lighthouseAverages.seo}`);
      console.log();
      
      console.log(chalk.bold('Top 5 problèmes:'));
      for (const item of report.summary.topIssues.slice(0, 5)) {
        const color = item.issue.type === 'error' ? chalk.red : item.issue.type === 'warning' ? chalk.yellow : chalk.blue;
        console.log(`  ${color(`[${item.issue.type.toUpperCase()}]`)} ${item.issue.category}: ${item.issue.message} (${item.count} pages)`);
      }
      console.log();
      
      console.log(chalk.bold('Distribution scores:'));
      for (const [range, count] of Object.entries(report.summary.scoreDistribution)) {
        console.log(`  ${range}: ${count} pages`);
      }
      console.log();
      
      console.log(chalk.green(`📁 Rapports générés dans: ${options.outputDir}/`));
      console.log(`   - report.html (interactif)`);
      console.log(`   - report.json (complet)`);
      console.log(`   - summary.json (pour CI/CD)`);
      console.log(`   - report.md (documentation)`);
      console.log(`   - fixes-plan.md (plan de correction)`);
      
      // Exit code selon résultat
      if (report.summary.failedPages > 0 || report.summary.averageScore < 70) {
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Erreur fatale:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv);