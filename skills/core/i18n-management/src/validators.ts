/**
 * Validateurs pour i18n
 */
import type { TranslationEntry, TranslationFile, SplitTranslationFile, ValidationResult, LangCode, I18nConfig } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS, TRANSLATION_CATEGORIES, ICU_PLURAL_RULES } from './config.js';
import { flattenTranslations, validateIcuMessage } from './utils.js';

/**
 * Valide le fichier translations.json principal
 */
export function validateTranslationsFile(
  file: TranslationFile,
  config: I18nConfig = DEFAULT_I18N_CONFIG
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingByLang: Record<LangCode, number> = {} as Record<LangCode, number>;
  const orphanKeys: string[] = [];
  
  // Initialiser compteurs
  for (const lang of config.supportedLangs) {
    missingByLang[lang] = 0;
  }
  
  if (!file.entries || !Array.isArray(file.entries)) {
    errors.push('Champ "entries" manquant ou invalide');
    return { valid: false, errors, warnings, stats: { totalKeys: 0, translatedKeys: 0, missingByLang, orphanKeys } };
  }
  
  const allKeys = new Set<string>();
  const keysByLang: Record<LangCode, Set<string>> = {} as Record<LangCode, Set<string>>;
  
  for (const lang of config.supportedLangs) {
    keysByLang[lang] = new Set();
  }
  
  // Analyser chaque entrée
  for (const entry of file.entries) {
    allKeys.add(entry.key);
    
    // Vérifier langues présentes
    for (const lang of config.supportedLangs) {
      if (lang === 'x-default') continue;
      const value = entry.values?.[lang];
      if (!value || value.trim() === '') {
        missingByLang[lang]++;
      } else {
        keysByLang[lang].add(entry.key);
        // Valider ICU si présent
        if (value.includes('{') && value.includes('plural')) {
          const icuCheck = validateIcuMessage(value);
          if (!icuCheck.valid) {
            warnings.push(`ICU invalide pour ${entry.key} [${lang}]: ${icuCheck.errors.join(', ')}`);
          }
        }
      }
    }
    
    // Vérifier catégorie
    if (entry.category && !TRANSLATION_CATEGORIES.includes(entry.category as any)) {
      warnings.push(`Catégorie inconnue pour ${entry.key}: ${entry.category}`);
    }
  }
  
  // Clés orphelines (présentes dans certaines langues mais pas dans la liste principale)
  // Pour translations.json, toutes les clés devraient être dans entries
  
  const totalKeys = allKeys.size;
  const translatedKeys = file.entries.filter(e => 
    UI_LANGS.every((lang: LangCode) => e.values?.[lang]?.trim())
  ).length;
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalKeys,
      translatedKeys,
      missingByLang,
      orphanKeys,
    },
  };
}

/**
 * Valide un fichier de traduction split (ex: fr.json)
 */
export function validateSplitFile(
  lang: LangCode,
  file: SplitTranslationFile,
  masterKeys: Set<string>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingByLang: Record<LangCode, number> = {} as Record<LangCode, number>;
  missingByLang[lang] = 0;
  
  if (!file.translations || typeof file.translations !== 'object') {
    errors.push('Champ "translations" manquant ou invalide');
    return { valid: false, errors, warnings, stats: { totalKeys: 0, translatedKeys: 0, missingByLang, orphanKeys: [] } };
  }
  
  const fileKeys = new Set(Object.keys(file.translations));
  const translatedKeys = 0;
  let count = 0;
  
  // Clés manquantes par rapport au master
  for (const key of masterKeys) {
    if (!fileKeys.has(key)) {
      missingByLang[lang]++;
    } else {
      count++;
      const value = file.translations[key];
      if (value && value.includes('{') && value.includes('plural')) {
        const icuCheck = validateIcuMessage(value);
        if (!icuCheck.valid) {
          warnings.push(`ICU invalide pour ${key}: ${icuCheck.errors.join(', ')}`);
        }
      }
    }
  }
  
  // Clés orphelines (dans le fichier mais pas dans master)
  const orphanKeys = Array.from(fileKeys).filter(k => !masterKeys.has(k));
  if (orphanKeys.length > 0) {
    warnings.push(`${orphanKeys.length} clés orphelines: ${orphanKeys.slice(0, 10).join(', ')}${orphanKeys.length > 10 ? '...' : ''}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalKeys: masterKeys.size,
      translatedKeys: count,
      missingByLang,
      orphanKeys,
    },
  };
}

/**
 * Valide la cohérence entre translations.json et les fichiers split
 */
export function validateConsistency(
  masterFile: TranslationFile,
  splitFiles: Record<LangCode, SplitTranslationFile>,
  config: I18nConfig = DEFAULT_I18N_CONFIG
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingByLang: Record<LangCode, number> = {} as Record<LangCode, number>;
  const orphanKeys: string[] = [];
  
  for (const lang of config.supportedLangs) {
    missingByLang[lang] = 0;
  }
  
  const masterKeys = new Set(masterFile.entries.map(e => e.key));
  
  // Vérifier chaque fichier split
  for (const lang of config.supportedLangs) {
    if (lang === 'x-default') continue;
    
    const splitFile = splitFiles[lang];
    if (!splitFile) {
      errors.push(`Fichier split manquant pour ${lang}`);
      missingByLang[lang] = masterKeys.size;
      continue;
    }
    
    const splitKeys = new Set(Object.keys(splitFile.translations));
    
    // Clés manquantes
    for (const key of masterKeys) {
      if (!splitKeys.has(key)) {
        missingByLang[lang]++;
        errors.push(`Clé manquante dans ${lang}: ${key}`);
      }
    }
    
    // Clés orphelines
    for (const key of splitKeys) {
      if (!masterKeys.has(key)) {
        orphanKeys.push(`${lang}:${key}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalKeys: masterKeys.size,
      translatedKeys: 0,
      missingByLang,
      orphanKeys,
    },
  };
}