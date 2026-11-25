/**
 * Utilitaires pour i18n Management
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, resolve, relative } from 'path';
import type { LangCode, TranslationEntry, TranslationFile, SplitTranslationFile, ValidationResult, I18nConfig } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS, LANG_NAMES } from './config.js';

/**
 * Charge un fichier JSON en gérant les erreurs
 */
export function loadJsonFile<T>(filePath: string): T | null {
  try {
    if (!existsSync(filePath)) return null;
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error);
    return null;
  }
}

/**
 * Sauvegarde un fichier JSON avec formatage
 */
export function saveJsonFile(filePath: string, data: any): boolean {
  try {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Erreur écriture ${filePath}:`, error);
    return false;
  }
}

/**
 * Normalise une clé de traduction (lowercase, dots, underscores)
 */
export function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_.]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Extrait toutes les clés d'un objet imbriqué avec notation pointée
 */
export function flattenTranslations(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenTranslations(value, newKey));
    }
  }
  
  return result;
}

/**
 * Reconstruit un objet imbriqué depuis des clés pointées
 */
export function unflattenTranslations(flat: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }
  
  return result;
}

/**
 * Valide une clé ICU MessageFormat basique
 */
export function validateIcuMessage(message: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Vérifier parenthèses équilibrées
  let depth = 0;
  for (const char of message) {
    if (char === '{') depth++;
    else if (char === '}') depth--;
    if (depth < 0) {
      errors.push('Parenthèse fermante sans ouvrante');
      break;
    }
  }
  if (depth !== 0) errors.push('Parenthèses non équilibrées');
  
  // Vérifier syntaxe plural basique
  const pluralMatches = message.match(/\{[\w\s,]+plural,/g);
  if (pluralMatches) {
    for (const match of pluralMatches) {
      if (!match.includes('offset:') && !match.match(/\d+\s*\{/)) {
        // Peut-être OK, juste un avertissement
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Génère un nom de fichier pour une langue
 */
export function getLangFileName(lang: LangCode): string {
  return `${lang}.json`;
}

/**
 * Trie les langues: défaut en premier, puis alphabétique
 */
export function sortLangs(langs: LangCode[], defaultLang: LangCode): LangCode[] {
  return [...langs].sort((a, b) => {
    if (a === defaultLang) return -1;
    if (b === defaultLang) return 1;
    return a.localeCompare(b);
  });
}

/**
 * Calcule le pourcentage de complétion
 */
export function calculateCompletion(translated: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((translated / total) * 100);
}

/**
 * Trouve les fichiers de routes Astro
 */
export function findAstroRoutes(routesDir: string): string[] {
  const routes: string[] = [];
  
  function scan(dir: string) {
    try {
      if (!existsSync(dir)) return;
      
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(fullPath);
        } else if (entry.name.endsWith('.astro') || entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
          routes.push(relative(routesDir, fullPath));
        }
      }
    } catch (error) {
      // Ignorer erreurs d'accès (ex: EISDIR sur Windows)
      console.warn(`Impossible de scanner ${dir}:`, error instanceof Error ? error.message : error);
    }
  }
  
  scan(routesDir);
  return routes;
}

/**
 * Extrait les codes de langue depuis les chemins de routes
 */
export function extractLangsFromRoutes(routes: string[]): LangCode[] {
  const langs = new Set<LangCode>();
  const langPattern = /^\[lang\]/;
  
  for (const route of routes) {
    const parts = route.split(/[/\\]/);
    for (const part of parts) {
      if (part === '[lang]' || part.startsWith('[lang]')) {
        // Route dynamique avec [lang]
      } else if (UI_LANGS.includes(part as LangCode)) {
        langs.add(part as LangCode);
      }
    }
  }
  
  return Array.from(langs);
}