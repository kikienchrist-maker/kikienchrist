/**
 * Extraction des clés de traduction depuis le code source
 */
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, resolve, relative } from 'path';
import type { TranslationEntry, LangCode, I18nConfig } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS } from './config.js';

export interface ExtractionResult {
  entries: TranslationEntry[];
  filesScanned: number;
  keysFound: number;
  byFile: Record<string, string[]>;
}

/**
 * Patterns pour détecter les appels de traduction
 */
const TRANSLATION_PATTERNS = [
  // t('key') ou t("key")
  /t\(['"]([^'"]+)['"]\)/g,
  // translate('key')
  /translate\(['"]([^'"]+)['"]\)/g,
  // i18n.t('key')
  /i18n\.t\(['"]([^'"]+)['"]\)/g,
  // Astro: {t('key')}
  /\{t\(['"]([^'"]+)['"]\)\}/g,
  // useTranslation: t('key')
  /const\s+\w+\s*=\s*useTranslation\(\);\s*.*?\.t\(['"]([^'"]+)['"]\)/gs,
];

/**
 * Extrait les clés de traduction depuis les fichiers source
 */
export function extractTranslationKeys(
  srcDir: string,
  config: I18nConfig = DEFAULT_I18N_CONFIG
): ExtractionResult {
  const entries: TranslationEntry[] = [];
  const keysSet = new Set<string>();
  const byFile: Record<string, string[]> = {};
  let filesScanned = 0;
  
  function scanDir(dir: string) {
    if (!existsSync(dir)) return;
    
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      const relPath = relative(resolve(config.basePath, srcDir), fullPath);
      
      if (entry.isDirectory()) {
        // Ignorer node_modules, dist, .astro
        if (!['node_modules', 'dist', '.astro', '.git', 'coverage'].includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.name.match(/\.(astro|ts|tsx|js|jsx|md|mdx)$/)) {
        filesScanned++;
        const content = readFileSync(fullPath, 'utf-8');
        const fileKeys: string[] = [];
        
        for (const pattern of TRANSLATION_PATTERNS) {
          let match;
          pattern.lastIndex = 0;
          while ((match = pattern.exec(content)) !== null) {
            const key = match[1].trim();
            if (key && !keysSet.has(key)) {
              keysSet.add(key);
              fileKeys.push(key);
            }
          }
        }
        
        if (fileKeys.length > 0) {
          byFile[relPath] = fileKeys;
        }
      }
    }
  }
  
  scanDir(resolve(config.basePath, srcDir));
  
  // Créer entrées avec valeurs par défaut
  for (const key of keysSet) {
    const values: Record<LangCode, string> = {} as Record<LangCode, string>;
    for (const lang of UI_LANGS) {
      values[lang] = '';
    }
    values['x-default'] = '';
    
    entries.push({
      key,
      values,
      description: `Auto-extracted from source`,
      category: 'common',
    });
  }
  
  return {
    entries: entries.sort((a, b) => a.key.localeCompare(b.key)),
    filesScanned,
    keysFound: keysSet.size,
    byFile,
  };
}

/**
 * Met à jour translations.json avec les clés extraites
 */
export function updateTranslationsWithExtracted(
  masterFile: any,
  extracted: ExtractionResult
): { added: number; updated: number } {
  const existingKeys = new Map<string, any>();
  for (const entry of masterFile.entries || []) {
    existingKeys.set(entry.key, entry);
  }
  
  let added = 0;
  let updated = 0;
  
  for (const entry of extracted.entries) {
    if (existingKeys.has(entry.key)) {
      // Conserver valeurs existantes, juste mettre à jour description si vide
      const existing = existingKeys.get(entry.key);
      if (!existing.description && entry.description) {
        existing.description = entry.description;
        updated++;
      }
    } else {
      masterFile.entries.push(entry);
      added++;
    }
  }
  
  // Trier
  masterFile.entries.sort((a: any, b: any) => a.key.localeCompare(b.key));
  masterFile.updatedAt = new Date().toISOString();
  
  return { added, updated };
}