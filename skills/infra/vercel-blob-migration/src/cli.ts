/**
 * CLI pour Vercel Blob Migration
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { resolve } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import type { BlobMigrationConfig, IMGBBMappingEntry, OptimizedImageConfig } from './types.js';
import { ImageMigrator } from './migration.js';
import { updateFrontmatterImages, generateMappingReport } from './frontmatter.js';
import { generateOptimizedImageComponent, writeOptimizedImageComponent } from './optimized-image.js';

const program = new Command();

program
  .name('blob-migrate')
  .description('Migration images vers Vercel Blob: upload IMGBB/local, mise à jour frontmatter, OptimizedImage.astro')
  .version('1.0.0');

program
  .command('imgbb')
  .description('Migrer images depuis IMGBB vers Vercel Blob')
  .requiredOption('-m, --mapping <file>', 'Fichier JSON mapping (localPath -> imgbbUrl)')
  .option('-t, --token <token>', 'Vercel Blob RW Token (vercel_blob_rw_...)', '')
  .option('--oidc-token <token>', 'Vercel OIDC Token (depuis vercel link)', '')
  .option('--store-id <id>', 'Vercel Blob Store ID', '')
  .option('--public-url <url>', 'URL publique custom (ex: https://cdn.example.com)', '')
  .option('--prefix <prefix>', 'Préfixe chemin Blob', 'images/')
  .option('-c, --concurrency <n>', 'Concurrence uploads', '3')
  .option('--dry-run', 'Simulation sans upload', false)
  .option('-o, --output <file>', 'Fichier rapport mapping', 'blob-mapping-report.json')
  .option('--update-frontmatter <dir>', 'Mettre à jour frontmatter dans ce dossier', '')
  .action(async (options) => {
    const spinner = ora('Migration IMGBB → Vercel Blob...').start();
    
    try {
      const token = options.token || process.env.BLOB_READ_WRITE_TOKEN;
      const oidcToken = options.oidcToken || process.env.VERCEL_OIDC_TOKEN;
      if (!token && !oidcToken) throw new Error('Token Vercel Blob requis (--token, --oidc-token, BLOB_READ_WRITE_TOKEN ou VERCEL_OIDC_TOKEN)');
      
      const config: BlobMigrationConfig = {
        token,
        oidcToken,
        storeId: options.storeId,
        publicUrl: options.publicUrl,
        prefix: options.prefix,
        concurrency: parseInt(options.concurrency),
        dryRun: options.dryRun,
      };
      
      // Charger mapping
      const mappings: IMGBBMappingEntry[] = JSON.parse(readFileSync(resolve(options.mapping), 'utf-8'));
      spinner.info(`Chargé ${mappings.length} mappings`);
      
      const migrator = new ImageMigrator(config);
      const result = await migrator.migrateFromIMGBB(mappings);
      
      // Sauver rapport
      migrator.saveMappingReport(resolve(options.output));
      
      // Mise à jour frontmatter
      if (options.updateFrontmatter) {
        spinner.info('Mise à jour frontmatter...');
        const fmResult = updateFrontmatterImages(resolve(options.updateFrontmatter), result.mappings);
        spinner.info(`Frontmatter mis à jour: ${fmResult.updated} fichiers`);
        if (fmResult.errors.length > 0) {
          console.warn(chalk.yellow('Erreurs frontmatter:'), fmResult.errors);
        }
      }
      
      spinner.succeed('Migration terminée');
      
      console.log(chalk.bold('\n=== STATISTIQUES ==='));
      console.log(`Total: ${result.stats.total}`);
      console.log(`Uploadés: ${result.stats.uploaded}`);
      console.log(`Ignorés: ${result.stats.skipped}`);
      console.log(chalk.red(`Échoués: ${result.stats.failed}`));
      console.log(`Taille totale: ${(result.stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Durée: ${result.stats.duration}ms`);
      
      if (result.errors.length > 0) {
        console.log(chalk.red('\n=== ERREURS ==='));
        for (const err of result.errors) {
          console.log(chalk.red(`  ${err.originalUrl}: ${err.error}`));
        }
      }
      
      console.log(chalk.green(`\nRapport sauvé: ${resolve(options.output)}`));
      
    } catch (error) {
      spinner.fail('Erreur migration');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('local')
  .description('Migrer images locales vers Vercel Blob')
  .requiredOption('-s, --source <dir>', 'Dossier source images')
  .option('-t, --token <token>', 'Vercel Blob RW Token (vercel_blob_rw_...)', '')
  .option('--oidc-token <token>', 'Vercel OIDC Token (depuis vercel link)', '')
  .option('--store-id <id>', 'Store ID', '')
  .option('--public-url <url>', 'URL publique custom', '')
  .option('--prefix <prefix>', 'Préfixe chemin Blob', 'images/')
  .option('-p, --pattern <glob>', 'Pattern fichiers', '**/*.{jpg,jpeg,png,webp,avif,svg}')
  .option('-c, --concurrency <n>', 'Concurrence', '3')
  .option('--dry-run', 'Simulation', false)
  .option('-o, --output <file>', 'Rapport', 'blob-mapping-report.json')
  .option('--update-frontmatter <dir>', 'MAJ frontmatter', '')
  .action(async (options) => {
    const spinner = ora('Migration images locales → Vercel Blob...').start();
    
    try {
      const token = options.token || process.env.BLOB_READ_WRITE_TOKEN;
      const oidcToken = options.oidcToken || process.env.VERCEL_OIDC_TOKEN;
      if (!token && !oidcToken) throw new Error('Token Vercel Blob requis (--token, --oidc-token, BLOB_READ_WRITE_TOKEN ou VERCEL_OIDC_TOKEN)');
      
      const config: BlobMigrationConfig = {
        token,
        oidcToken,
        storeId: options.storeId,
        publicUrl: options.publicUrl,
        prefix: options.prefix,
        concurrency: parseInt(options.concurrency),
        dryRun: options.dryRun,
      };
      
      const migrator = new ImageMigrator(config);
      const result = await migrator.migrateLocalFiles(resolve(options.source), options.pattern);
      
      migrator.saveMappingReport(resolve(options.output));
      
      if (options.updateFrontmatter) {
        const fmResult = updateFrontmatterImages(resolve(options.updateFrontmatter), result.mappings);
        console.log(`Frontmatter mis à jour: ${fmResult.updated} fichiers`);
      }
      
      spinner.succeed('Migration terminée');
      console.log(chalk.bold('\n=== STATISTIQUES ==='));
      console.log(`Total: ${result.stats.total}`);
      console.log(`Uploadés: ${result.stats.uploaded}`);
      console.log(`Ignorés: ${result.stats.skipped}`);
      console.log(chalk.red(`Échoués: ${result.stats.failed}`));
      
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('frontmatter')
  .description('Mettre à jour frontmatter avec mapping existant')
  .requiredOption('-m, --mapping <file>', 'Fichier rapport mapping JSON')
  .requiredOption('-d, --dir <dir>', 'Dossier contenu')
  .option('--dry-run', 'Simulation', false)
  .option('--backup', 'Créer backup .bak', false)
  .action(async (options) => {
    const spinner = ora('Mise à jour frontmatter...').start();
    
    try {
      const report = JSON.parse(readFileSync(resolve(options.mapping), 'utf-8'));
      const mappings = report.mappings || [];
      
      const result = updateFrontmatterImages(resolve(options.dir), mappings, { 
        dryRun: options.dryRun, 
        backup: options.backup 
      });
      
      spinner.succeed(`Frontmatter mis à jour: ${result.updated} fichiers`);
      if (result.errors.length > 0) {
        console.warn(chalk.yellow('Erreurs:'), result.errors);
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('optimized-image')
  .description('Générer composant OptimizedImage.astro')
  .option('-o, --output <file>', 'Fichier sortie', 'src/components/OptimizedImage.astro')
  .option('--blob-url <url>', 'Base URL Vercel Blob', '')
  .option('--widths <list>', 'Largeurs srcset (comma)', '400,800,1200,1600,2000')
  .option('--quality <n>', 'Qualité', '80')
  .option('--format <fmt>', 'Format par défaut', 'webp')
  .action(async (options) => {
    const spinner = ora('Génération OptimizedImage.astro...').start();
    
    try {
      const config: OptimizedImageConfig = {
        outputPath: resolve(options.output),
        blobBaseUrl: options.blobUrl,
        defaultWidths: options.widths.split(',').map((w: string) => parseInt(w.trim())),
        defaultQuality: parseInt(options.quality),
        defaultFormat: options.format as any,
      };
      
      writeOptimizedImageComponent(config);
      
      spinner.succeed(`OptimizedImage.astro généré: ${resolve(options.output)}`);
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('full')
  .description('Migration complète: IMGBB + local + frontmatter + OptimizedImage')
  .requiredOption('-m, --mapping <file>', 'Mapping IMGBB JSON')
  .requiredOption('-s, --source <dir>', 'Dossier images locales')
  .requiredOption('-d, --content-dir <dir>', 'Dossier contenu (frontmatter)')
  .option('-t, --token <token>', 'Vercel Blob RW Token (vercel_blob_rw_...)', '')
  .option('--oidc-token <token>', 'Vercel OIDC Token (depuis vercel link)', '')
  .option('--store-id <id>', 'Store ID', '')
  .option('--public-url <url>', 'URL publique', '')
  .option('--prefix <prefix>', 'Préfixe Blob', 'images/')
  .option('-c, --concurrency <n>', 'Concurrence', '3')
  .option('--dry-run', 'Simulation', false)
  .option('-o, --output <file>', 'Rapport', 'blob-mapping-report.json')
  .action(async (options) => {
    const spinner = ora('Migration complète Vercel Blob...').start();
    
    try {
      const token = options.token || process.env.BLOB_READ_WRITE_TOKEN;
      const oidcToken = options.oidcToken || process.env.VERCEL_OIDC_TOKEN;
      if (!token && !oidcToken) throw new Error('Token Vercel Blob requis (--token, --oidc-token, BLOB_READ_WRITE_TOKEN ou VERCEL_OIDC_TOKEN)');
      
      const config: BlobMigrationConfig = {
        token,
        oidcToken,
        storeId: options.storeId,
        publicUrl: options.publicUrl,
        prefix: options.prefix,
        concurrency: parseInt(options.concurrency),
        dryRun: options.dryRun,
      };
      
      // 1. IMGBB
      const imgbbMappings: IMGBBMappingEntry[] = JSON.parse(readFileSync(resolve(options.mapping), 'utf-8'));
      spinner.info(`IMGBB: ${imgbbMappings.length} mappings`);
      
      const migrator = new ImageMigrator(config);
      await migrator.migrateFromIMGBB(imgbbMappings);
      
      // 2. Local
      spinner.info('Images locales...');
      await migrator.migrateLocalFiles(resolve(options.source));
      
      const result = {
        success: migrator.getErrors().length === 0,
        mappings: Array.from(migrator.getMappings().values()),
        errors: migrator.getErrors(),
        stats: {
          total: migrator.getMappings().size + migrator.getErrors().length,
          uploaded: migrator.getMappings().size,
          skipped: 0,
          failed: migrator.getErrors().length,
          totalSize: Array.from(migrator.getMappings().values()).reduce((sum, m) => sum + (m.size || 0), 0),
          duration: 0,
        },
      };
      
      // 3. Frontmatter
      spinner.info('Mise à jour frontmatter...');
      const fmResult = updateFrontmatterImages(resolve(options.contentDir), result.mappings);
      spinner.info(`Frontmatter: ${fmResult.updated} fichiers`);
      
      // 4. OptimizedImage.astro
      spinner.info('Génération OptimizedImage.astro...');
      writeOptimizedImageComponent({
        outputPath: resolve('src/components/OptimizedImage.astro'),
        blobBaseUrl: options.publicUrl || '',
      });
      
      // 5. Rapport
      migrator.saveMappingReport(resolve(options.output));
      
      spinner.succeed('Migration complète terminée !');
      console.log(chalk.bold('\n=== RÉSUMÉ ==='));
      console.log(`Images migrées: ${result.stats.uploaded}`);
      console.log(`Échecs: ${result.stats.failed}`);
      console.log(`Frontmatter mis à jour: ${fmResult.updated}`);
      console.log(`OptimizedImage.astro généré`);
      console.log(`Rapport: ${resolve(options.output)}`);
      
    } catch (error) {
      spinner.fail('Erreur migration complète');
      console.error(error);
      process.exit(1);
    }
  });

program.parse();