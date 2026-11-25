/**
 * CLI pour i18n Management
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { resolve, join } from 'path';
import type { I18nConfig, LangCode } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS, SUPPORTED_LANGS, LANG_NAMES } from './config.js';
import { loadJsonFile, saveJsonFile } from './utils.js';
import { validateTranslationsFile, validateSplitFile, validateConsistency } from './validators.js';
import { syncMasterToSplit, syncSplitToMaster, fullSync } from './sync.js';
import { generateMiddlewareCode, generateEdgeMiddlewareCode } from './middleware.js';
import { analyzeRoutes, generateAstroI18nConfig } from './routes.js';
import { extractTranslationKeys, updateTranslationsWithExtracted } from './extract.js';

const program = new Command();

program
  .name('i18n-manage')
  .description('Gestion centralisée i18n pour 11 langues (translations.json, split files, middleware, routes)')
  .version('1.0.0');

program
  .command('validate')
  .description('Valide translations.json et fichiers split')
  .option('-c, --config <path>', 'Chemin config', '')
  .option('--fix', 'Tente de corriger automatiquement', false)
  .action(async (options) => {
    const config = loadConfig(options.config);
    const spinner = ora('Validation i18n...').start();
    
    try {
      const masterPath = resolve(config.basePath, config.translationsFile);
      const i18nDir = resolve(config.basePath, config.i18nDir);
      
      // Charger master
      const masterFile = loadJsonFile<any>(masterPath);
      if (!masterFile) {
        spinner.fail(`Master introuvable: ${masterPath}`);
        process.exit(1);
      }
      
      // Valider master
      const masterValidation = validateTranslationsFile(masterFile, config);
      
      // Charger et valider splits
      const splitFiles: Record<LangCode, any> = {} as Record<LangCode, any>;
      for (const lang of UI_LANGS) {
        const splitPath = join(i18nDir, `${lang}.json`);
        splitFiles[lang] = loadJsonFile(splitPath);
      }
      
      const splitValidations: Record<string, any> = {};
      // Typer correctement masterKeys
      const masterEntries = masterFile.entries as Array<{ key: string; values: Record<string, string> }>;
      const masterKeys = new Set<string>(masterEntries.map(e => e.key));
      for (const lang of UI_LANGS) {
        if (splitFiles[lang]) {
          splitValidations[lang] = validateSplitFile(lang as LangCode, splitFiles[lang], masterKeys);
        }
      }
      
      // Cohérence
      const consistency = validateConsistency(masterFile, splitFiles, config);
      
      spinner.succeed('Validation terminée');
      
      // Afficher résultats
      console.log(chalk.bold('\n=== MASTER (translations.json) ==='));
      console.log(`  Clés totales: ${masterValidation.stats.totalKeys}`);
      console.log(`  Complètement traduites: ${masterValidation.stats.translatedKeys}`);
      console.log(`  Valide: ${masterValidation.valid ? chalk.green('OUI') : chalk.red('NON')}`);
      if (masterValidation.errors.length) console.log(chalk.red('  Erreurs:'), masterValidation.errors);
      if (masterValidation.warnings.length) console.log(chalk.yellow('  Avertissements:'), masterValidation.warnings);
      
      console.log(chalk.bold('\n=== FICHIERS SPLIT ==='));
      for (const lang of UI_LANGS) {
        const v = splitValidations[lang];
        if (!v) {
          console.log(chalk.red(`  ${lang}: MANQUANT`));
          continue;
        }
        const pct = Math.round((v.stats.translatedKeys / v.stats.totalKeys) * 100);
        console.log(`  ${lang} (${LANG_NAMES[lang]}): ${v.stats.translatedKeys}/${v.stats.totalKeys} (${pct}%) ${v.valid ? chalk.green('✓') : chalk.red('✗')}`);
        if (v.warnings.length) console.log(chalk.yellow(`    ${v.warnings.join(', ')}`));
      }
      
      console.log(chalk.bold('\n=== COHÉRENCE ==='));
      console.log(`  Valide: ${consistency.valid ? chalk.green('OUI') : chalk.red('NON')}`);
      if (consistency.errors.length) console.log(chalk.red('  Erreurs:'), consistency.errors);
      if (consistency.warnings.length) console.log(chalk.yellow('  Avertissements:'), consistency.warnings);
      
      if (options.fix && !consistency.valid) {
        const fixSpinner = ora('Correction automatique...').start();
        const result = fullSync(config);
        fixSpinner.succeed('Correction terminée');
        console.log(chalk.green(`  Master->Split: +${result.masterToSplit.added.length} ~${result.masterToSplit.updated.length} -${result.masterToSplit.removed.length}`));
        console.log(chalk.green(`  Split->Master: +${result.splitToMaster.added.length} ~${result.splitToMaster.updated.length} -${result.splitToMaster.removed.length}`));
      }
      
    } catch (error) {
      spinner.fail('Erreur validation');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('Synchronise translations.json <-> fichiers split')
  .option('-c, --config <path>', 'Chemin config', '')
  .option('--direction <dir>', 'Direction: master-to-split, split-to-master, both', 'both')
  .action(async (options) => {
    const config = loadConfig(options.config);
    const spinner = ora('Synchronisation i18n...').start();
    
    try {
      let result;
      if (options.direction === 'master-to-split') {
        const masterPath = resolve(config.basePath, config.translationsFile);
        const i18nDir = resolve(config.basePath, config.i18nDir);
        const masterFile = loadJsonFile<any>(masterPath);
        if (!masterFile) throw new Error('Master introuvable');
        result = { masterToSplit: syncMasterToSplit(masterFile, i18nDir, config), splitToMaster: { synced: true, added: [], removed: [], updated: [], errors: [] } };
      } else if (options.direction === 'split-to-master') {
        const masterPath = resolve(config.basePath, config.translationsFile);
        const i18nDir = resolve(config.basePath, config.i18nDir);
        const masterFile = loadJsonFile<any>(masterPath);
        if (!masterFile) throw new Error('Master introuvable');
        result = { masterToSplit: { synced: true, added: [], removed: [], updated: [], errors: [] }, splitToMaster: syncSplitToMaster(i18nDir, masterFile, config) };
      } else {
        result = fullSync(config);
      }
      
      spinner.succeed('Synchronisation terminée');
      
      console.log(chalk.bold('\n=== MASTER -> SPLIT ==='));
      console.log(chalk.green(`  Ajoutées: ${result.masterToSplit.added.length}`));
      console.log(chalk.blue(`  Mises à jour: ${result.masterToSplit.updated.length}`));
      console.log(chalk.yellow(`  Supprimées: ${result.masterToSplit.removed.length}`));
      if (result.masterToSplit.errors.length) console.log(chalk.red('  Erreurs:'), result.masterToSplit.errors);
      
      console.log(chalk.bold('\n=== SPLIT -> MASTER ==='));
      console.log(chalk.green(`  Ajoutées: ${result.splitToMaster.added.length}`));
      console.log(chalk.blue(`  Mises à jour: ${result.splitToMaster.updated.length}`));
      console.log(chalk.yellow(`  Supprimées: ${result.splitToMaster.removed.length}`));
      if (result.splitToMaster.errors.length) console.log(chalk.red('  Erreurs:'), result.splitToMaster.errors);
      
    } catch (error) {
      spinner.fail('Erreur synchronisation');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('middleware')
  .description('Génère le middleware i18n')
  .option('-c, --config <path>', 'Chemin config', '')
  .option('-o, --output <path>', 'Fichier de sortie', 'src/middleware.ts')
  .option('--edge', 'Génère pour Edge (Vercel/Netlify)', false)
  .action(async (options) => {
    const config = loadConfig(options.config);
    const spinner = ora('Génération middleware...').start();
    
    try {
      const code = options.edge 
        ? generateEdgeMiddlewareCode()
        : generateMiddlewareCode();
      
      const outputPath = resolve(config.basePath, options.output);
      saveJsonFile(outputPath, code); // réutilise saveJsonFile pour écrire
      
      spinner.succeed(`Middleware généré: ${outputPath}`);
      console.log(chalk.gray('\n--- Début du fichier ---'));
      console.log(code.slice(0, 500) + '...');
      console.log(chalk.gray('--- Fin (tronqué) ---'));
    } catch (error) {
      spinner.fail('Erreur génération');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('routes')
  .description('Analyse les routes Astro pour i18n')
  .option('-c, --config <path>', 'Chemin config', '')
  .option('--output <path>', 'Fichier rapport JSON', '')
  .action(async (options) => {
    const config = loadConfig(options.config);
    const spinner = ora('Analyse routes...').start();
    
    try {
      const analysis = analyzeRoutes(config);
      spinner.succeed('Analyse terminée');
      
      console.log(chalk.bold('\n=== ANALYSE ROUTES ==='));
      console.log(`  Total routes: ${analysis.totalRoutes}`);
      console.log(`  Routes avec langue: ${analysis.langRoutes}`);
      console.log(`  Routes statiques: ${analysis.staticRoutes}`);
      console.log(`  Routes dynamiques [lang]: ${analysis.dynamicRoutes}`);
      
      console.log(chalk.bold('\n=== TRADUCTIONS MANQUANTES ==='));
      for (const [lang, paths] of Object.entries(analysis.missingTranslations)) {
        if (paths.length > 0) {
          console.log(chalk.yellow(`  ${lang}: ${paths.length} routes`));
          for (const p of paths.slice(0, 10)) console.log(`    ${p}`);
          if (paths.length > 10) console.log(`    ... et ${paths.length - 10} autres`);
        }
      }
      
      if (options.output) {
        const outputPath = resolve(config.basePath, options.output);
        saveJsonFile(outputPath, analysis);
        console.log(chalk.green(`\nRapport sauvé: ${outputPath}`));
      }
    } catch (error) {
      spinner.fail('Erreur analyse');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('extract')
  .description('Extrait les clés de traduction depuis le code source')
  .option('-c, --config <path>', 'Chemin config', '')
  .option('-s, --src <dir>', 'Dossier source', 'src')
  .option('--update-master', 'Met à jour translations.json', false)
  .option('-o, --output <path>', 'Fichier rapport JSON', '')
  .action(async (options) => {
    const config = loadConfig(options.config);
    const spinner = ora('Extraction clés...').start();
    
    try {
      const result = extractTranslationKeys(options.src, config);
      spinner.succeed(`Extraction terminée: ${result.keysFound} clés dans ${result.filesScanned} fichiers`);
      
      console.log(chalk.bold('\n=== CLÉS TROUVÉES ==='));
      for (const [file, keys] of Object.entries(result.byFile)) {
        console.log(chalk.cyan(`  ${file}: ${keys.length} clés`));
        for (const k of keys.slice(0, 5)) console.log(`    ${k}`);
        if (keys.length > 5) console.log(`    ... et ${keys.length - 5} autres`);
      }
      
      if (options.updateMaster) {
        const masterPath = resolve(config.basePath, config.translationsFile);
        const masterFile = loadJsonFile<any>(masterPath) || { version: '1.0.0', updatedAt: new Date().toISOString(), entries: [] };
        const { added, updated } = updateTranslationsWithExtracted(masterFile, result);
        saveJsonFile(masterPath, masterFile);
        console.log(chalk.green(`\nMaster mis à jour: +${added} nouvelles, ~${updated} mises à jour`));
      }
      
      if (options.output) {
        const outputPath = resolve(config.basePath, options.output);
        saveJsonFile(outputPath, result);
        console.log(chalk.green(`\nRapport sauvé: ${outputPath}`));
      }
    } catch (error) {
      spinner.fail('Erreur extraction');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Affiche statistiques complètes i18n')
  .option('-c, --config <path>', 'Chemin config', '')
  .action(async (options) => {
    const config = loadConfig(options.config);
    const spinner = ora('Calcul statistiques...').start();
    
    try {
      const masterPath = resolve(config.basePath, config.translationsFile);
      const i18nDir = resolve(config.basePath, config.i18nDir);
      
      const masterFile = loadJsonFile<any>(masterPath);
      if (!masterFile) throw new Error('Master introuvable');
      
      const masterValidation = validateTranslationsFile(masterFile, config);
      
      // Typer correctement masterKeys
      const masterEntries = masterFile.entries as Array<{ key: string; values: Record<string, string> }>;
      const masterKeys = new Set<string>(masterEntries.map(e => e.key));
      
      const splitStats: Record<string, any> = {};
      for (const lang of UI_LANGS) {
        const splitPath = join(i18nDir, `${lang}.json`);
        const splitFile = loadJsonFile<any>(splitPath);
        if (splitFile) {
          splitStats[lang] = validateSplitFile(lang as LangCode, splitFile, masterKeys);
        }
      }
      
      spinner.succeed('Statistiques calculées');
      
      console.log(chalk.bold('\n=== STATISTIQUES I18N ==='));
      console.log(`Langues supportées: ${SUPPORTED_LANGS.filter(l => l !== 'x-default').join(', ')}`);
      console.log(`Langue par défaut: ${config.defaultLang}`);
      console.log(`\nMaster: ${masterValidation.stats.totalKeys} clés`);
      console.log(`  Complètement traduites: ${masterValidation.stats.translatedKeys} (${Math.round(masterValidation.stats.translatedKeys/masterValidation.stats.totalKeys*100)}%)`);
      
      console.log(chalk.bold('\nPar langue:'));
      for (const lang of UI_LANGS) {
        const v = splitStats[lang];
        if (!v) {
          console.log(chalk.red(`  ${lang}: FICHIER MANQUANT`));
          continue;
        }
        const pct = v.stats.totalKeys > 0 ? Math.round(v.stats.translatedKeys / v.stats.totalKeys * 100) : 0;
        const missing = v.stats.totalKeys - v.stats.translatedKeys;
        console.log(`  ${lang} (${LANG_NAMES[lang]}): ${v.stats.translatedKeys}/${v.stats.totalKeys} (${pct}%) - ${missing} manquantes`);
      }
      
      const analysis = analyzeRoutes(config);
      console.log(chalk.bold('\nRoutes:'));
      console.log(`  Total: ${analysis.totalRoutes}`);
      console.log(`  Avec [lang]: ${analysis.dynamicRoutes}`);
      console.log(`  Manquantes par langue:`);
      for (const [lang, paths] of Object.entries(analysis.missingTranslations)) {
        console.log(`    ${lang}: ${paths.length}`);
      }
      
    } catch (error) {
      spinner.fail('Erreur stats');
      console.error(error);
      process.exit(1);
    }
  });

function loadConfig(configPath: string): I18nConfig {
  if (configPath) {
    const resolved = resolve(configPath);
    // Si c'est un répertoire, utiliser config par défaut avec basePath
    try {
      const stat = require('fs').statSync(resolved);
      if (stat.isDirectory()) {
        return { ...DEFAULT_I18N_CONFIG, basePath: resolved };
      }
      // Si c'est un fichier, charger la config
      const loaded = loadJsonFile<I18nConfig>(resolved);
      if (loaded) return { ...DEFAULT_I18N_CONFIG, ...loaded };
    } catch {
      // Ignorer erreurs, utiliser config par défaut
    }
  }
  return DEFAULT_I18N_CONFIG;
}

program.parse();