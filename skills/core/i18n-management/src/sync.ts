/**
 * Synchronisation translations.json <-> fichiers split i18n/*.json
 */
import type { TranslationEntry, TranslationFile, SplitTranslationFile, SyncResult, LangCode, I18nConfig } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS, LANG_NAMES } from './config.js';
import { loadJsonFile, saveJsonFile, flattenTranslations, unflattenTranslations, getLangFileName, sortLangs } from './utils.js';
import { join, resolve } from 'path';

/**
 * Synchronise translations.json vers les fichiers split i18n/*.json
 */
export function syncMasterToSplit(
  masterFile: TranslationFile,
  i18nDir: string,
  config: I18nConfig = DEFAULT_I18N_CONFIG
): SyncResult {
  const added: string[] = [];
  const removed: string[] = [];
  const updated: string[] = [];
  const errors: string[] = [];
  
  // Créer map clé -> valeurs par langue
  const entriesByKey = new Map<string, TranslationEntry>();
  for (const entry of masterFile.entries) {
    entriesByKey.set(entry.key, entry);
  }
  
  const masterKeys = new Set(entriesByKey.keys());
  
  // Pour chaque langue UI (pas x-default)
  for (const lang of UI_LANGS) {
    const filePath = join(i18nDir, getLangFileName(lang));
    let splitFile: SplitTranslationFile | null = loadJsonFile(filePath);
    
    if (!splitFile) {
      splitFile = {
        lang,
        translations: {},
        updatedAt: new Date().toISOString(),
      };
    }
    
    const splitKeys = new Set(Object.keys(splitFile.translations));
    let hasChanges = false;
    
    // Ajouter/mettre à jour clés du master
    for (const key of masterKeys) {
      const entry = entriesByKey.get(key)!;
      const value = entry.values[lang] || entry.values[config.defaultLang] || '';
      
      if (!splitKeys.has(key)) {
        splitFile.translations[key] = value;
        added.push(`${lang}:${key}`);
        hasChanges = true;
      } else if (splitFile.translations[key] !== value) {
        splitFile.translations[key] = value;
        updated.push(`${lang}:${key}`);
        hasChanges = true;
      }
    }
    
    // Supprimer clés orphelines (plus dans master)
    for (const key of splitKeys) {
      if (!masterKeys.has(key)) {
        delete splitFile.translations[key];
        removed.push(`${lang}:${key}`);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      splitFile.updatedAt = new Date().toISOString();
      // Trier les clés
      const sorted: Record<string, string> = {};
      for (const key of Object.keys(splitFile.translations).sort()) {
        sorted[key] = splitFile.translations[key];
      }
      splitFile.translations = sorted;
      
      if (!saveJsonFile(filePath, splitFile)) {
        errors.push(`Échec écriture ${filePath}`);
      }
    }
  }
  
  return {
    synced: errors.length === 0,
    added,
    removed,
    updated,
    errors,
  };
}

/**
 * Synchronise les fichiers split i18n/*.json vers translations.json
 */
export function syncSplitToMaster(
  i18nDir: string,
  masterFile: TranslationFile,
  config: I18nConfig = DEFAULT_I18N_CONFIG
): SyncResult {
  const added: string[] = [];
  const removed: string[] = [];
  const updated: string[] = [];
  const errors: string[] = [];
  
  // Charger tous les fichiers split
  const splitFiles: Record<LangCode, SplitTranslationFile> = {} as Record<LangCode, SplitTranslationFile>;
  
  for (const lang of UI_LANGS) {
    const filePath = join(i18nDir, getLangFileName(lang));
    const splitFile = loadJsonFile<SplitTranslationFile>(filePath);
    if (splitFile) {
      splitFiles[lang] = splitFile;
    }
  }
  
  // Construire map des clés existantes
  const existingEntries = new Map<string, TranslationEntry>();
  for (const entry of masterFile.entries) {
    existingEntries.set(entry.key, { ...entry });
  }
  
  const allSplitKeys = new Set<string>();
  for (const lang of UI_LANGS) {
    if (splitFiles[lang]) {
      for (const key of Object.keys(splitFiles[lang]!.translations)) {
        allSplitKeys.add(key);
      }
    }
  }
  
  // Pour chaque clé dans les splits
  for (const key of allSplitKeys) {
    const existing = existingEntries.get(key);
    const values: Record<LangCode, string> = {} as Record<LangCode, string>;
    
    for (const lang of UI_LANGS) {
      values[lang] = splitFiles[lang]?.translations[key] || '';
    }
    values['x-default'] = values[config.defaultLang] || '';
    
    if (existing) {
      // Vérifier si changement
      let changed = false;
      for (const lang of UI_LANGS) {
        if (existing.values[lang] !== values[lang]) {
          changed = true;
          break;
        }
      }
      if (changed) {
        existing.values = values;
        existingEntries.set(key, existing);
        updated.push(key);
      }
    } else {
      // Nouvelle entrée
      const newEntry: TranslationEntry = {
        key,
        values,
        description: '',
        category: 'common',
      };
      existingEntries.set(key, newEntry);
      added.push(key);
    }
  }
  
  // Supprimer clés plus dans aucun split
  for (const [key, entry] of existingEntries) {
    if (!allSplitKeys.has(key)) {
      existingEntries.delete(key);
      removed.push(key);
    }
  }
  
  // Reconstruire master file
  masterFile.entries = Array.from(existingEntries.values()).sort((a, b) => a.key.localeCompare(b.key));
  masterFile.updatedAt = new Date().toISOString();
  
  const masterPath = config.translationsFile;
  if (!saveJsonFile(masterPath, masterFile)) {
    errors.push(`Échec écriture ${masterPath}`);
  }
  
  return {
    synced: errors.length === 0,
    added,
    removed,
    updated,
    errors,
  };
}

/**
 * Synchronisation bidirectionnelle complète
 */
export function fullSync(
  config: I18nConfig = DEFAULT_I18N_CONFIG
): { masterToSplit: SyncResult; splitToMaster: SyncResult } {
  const masterPath = resolve(config.basePath, config.translationsFile);
  const i18nDir = resolve(config.basePath, config.i18nDir);
  
  const masterFile = loadJsonFile<TranslationFile>(masterPath);
  if (!masterFile) {
    throw new Error(`Fichier master introuvable: ${masterPath}`);
  }
  
  // 1. Master -> Split
  const masterToSplit = syncMasterToSplit(masterFile, i18nDir, config);
  
  // Recharger master après sync split
  const updatedMasterFile = loadJsonFile<TranslationFile>(masterPath);
  if (!updatedMasterFile) {
    throw new Error(`Fichier master introuvable après sync`);
  }
  
  // 2. Split -> Master
  const splitToMaster = syncSplitToMaster(i18nDir, updatedMasterFile, config);
  
  return { masterToSplit, splitToMaster };
}