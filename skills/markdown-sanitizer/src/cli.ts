#!/usr/bin/env node
/**
 * CLI pour Markdown Sanitizer
 * Usage: markdown-sanitizer [options] <file|dir> [...]
 */
import { Command } from 'commander';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename, resolve } from 'path';
import { sanitizeMarkdown, serializeMarkdownClean, type SanitizeOptions, type SanitizeResult } from './index.js';

const program = new Command();

program
  .name('markdown-sanitizer')
  .description('Nettoie et valide les fichiers Markdown + frontmatter YAML')
  .version('1.0.0')
  .argument('[paths...]', 'Fichiers ou dossiers à traiter')
  .option('-r, --recursive', 'Traiter récursivement les dossiers')
  .option('-e, --ext <extensions>', 'Extensions à traiter', '.md,.markdown')
  .option('-c, --collection <type>', 'Type de collection', 'auto')
  .option('--lang <code>', 'Langue source (fr, en, es, etc.)')
  .option('--no-auto-fix', 'Ne pas corriger automatiquement')
  .option('--force-slug-regeneration', 'Forcer la régénération du slug depuis translationKey + lang')
  .option('--dry-run', 'Afficher les changements sans écrire')
  .option('--verbose', 'Logs détaillés')
  .option('--output-dir <dir>', 'Répertoire de sortie (défaut: inplace)')
  .action(async (paths: string[], options: any) => {
    const extensions = options.ext.split(',').map((e: string) => e.startsWith('.') ? e : `.${e}`);
    const sanitizeOptions: SanitizeOptions = {
      collection: options.collection as SanitizeOptions['collection'],
      sourceLang: options.lang,
      autoFix: options.autoFix !== false,
      forceSlugRegeneration: options.forceSlugRegeneration === true,
    };
    
    let files: string[] = [];
    
    for (const path of paths.length > 0 ? paths : ['.']) {
      const resolved = resolve(path);
      if (!existsSync(resolved)) {
        console.error(`[ERROR] Chemin introuvable: ${resolved}`);
        continue;
      }
      
      const stat = statSync(resolved);
      if (stat.isFile()) {
        if (extensions.includes(extname(resolved).toLowerCase())) {
          files.push(resolved);
        }
      } else if (stat.isDirectory() && options.recursive) {
        files.push(...findMarkdownFiles(resolved, extensions));
      } else if (stat.isDirectory()) {
        // Non-récursif: seulement fichiers à la racine
        files.push(...readdirSync(resolved)
          .filter(f => extensions.includes(extname(f).toLowerCase()))
          .map(f => join(resolved, f)));
      }
    }
    
    if (files.length === 0) {
      console.log('[INFO] Aucun fichier Markdown trouvé');
      return;
    }
    
    console.log(`[INFO] Traitement de ${files.length} fichier(s)...\n`);
    
    let totalErrors = 0;
    let totalWarnings = 0;
    let totalFixes = 0;
    let processed = 0;
    
    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const result = sanitizeMarkdown(content, sanitizeOptions);
        
        processed++;
        
        if (options.verbose || result.errors.length > 0 || result.warnings.length > 0 || result.fixes.length > 0) {
          console.log(`[${processed}/${files.length}] ${basename(file)} (${result.collection})`);
          if (result.errors.length > 0) {
            console.log(`  ❌ Erreurs: ${result.errors.join('; ')}`);
            totalErrors += result.errors.length;
          }
          if (result.warnings.length > 0) {
            console.log(`  ⚠️  Avertissements: ${result.warnings.join('; ')}`);
            totalWarnings += result.warnings.length;
          }
          if (result.fixes.length > 0) {
            console.log(`  🔧 Corrections: ${result.fixes.join('; ')}`);
            totalFixes += result.fixes.length;
          }
          if (result.errors.length === 0 && result.warnings.length === 0 && result.fixes.length === 0) {
            console.log(`  ✅ OK`);
          }
        }
        
        // Écrire si pas dry-run et (erreurs corrigées ou auto-fix activé)
        if (!options.dryRun && (result.errors.length > 0 || result.fixes.length > 0 || options.autoFix !== false)) {
          const outputPath = options.outputDir 
            ? join(resolve(options.outputDir), basename(file))
            : file;
          writeFileSync(outputPath, result.content, 'utf-8');
          if (options.verbose || result.fixes.length > 0) {
            console.log(`  💾 Écrit: ${outputPath}`);
          }
        }
        
      } catch (err) {
        console.error(`[ERROR] ${basename(file)}: ${err instanceof Error ? err.message : err}`);
        totalErrors++;
      }
    }
    
    console.log(`\n[SUMMARY] ${processed} fichiers traités`);
    console.log(`  Erreurs: ${totalErrors}`);
    console.log(`  Avertissements: ${totalWarnings}`);
    console.log(`  Corrections: ${totalFixes}`);
    
    if (totalErrors > 0 && options.autoFix === false) {
      console.log('\n[WARN] Des erreurs persistent. Utilisez --auto-fix (défaut) pour corriger.');
      process.exit(1);
    }
  });

function findMarkdownFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  function walk(currentDir: string) {
    for (const entry of readdirSync(currentDir)) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (extensions.includes(extname(entry).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }
  walk(dir);
  return files;
}

program.parse(process.argv);