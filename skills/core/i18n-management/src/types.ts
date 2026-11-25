/**
 * Types pour i18n Management
 */

export type LangCode = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de' | 'nl' | 'pl' | 'ar' | 'ru' | 'zh' | 'hi' | 'x-default';

export const SUPPORTED_LANGS: LangCode[] = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi', 'x-default'];
export const UI_LANGS: LangCode[] = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
export const DEFAULT_LANG: LangCode = 'fr';

export interface I18nConfig {
  basePath: string;
  supportedLangs: LangCode[];
  defaultLang: LangCode;
  translationsFile: string;
  i18nDir: string;
  middlewareFile: string;
  routesDir: string;
}

export interface TranslationEntry {
  key: string;
  values: Record<LangCode, string>;
  description?: string;
  category?: string;
}

export interface TranslationFile {
  version: string;
  updatedAt: string;
  entries: TranslationEntry[];
}

export interface SplitTranslationFile {
  lang: LangCode;
  translations: Record<string, string>;
  updatedAt: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalKeys: number;
    translatedKeys: number;
    missingByLang: Record<LangCode, number>;
    orphanKeys: string[];
  };
}

export interface SyncResult {
  synced: boolean;
  added: string[];
  removed: string[];
  updated: string[];
  errors: string[];
}

export interface RouteEntry {
  path: string;
  langs: LangCode[];
  hasTranslation: Record<LangCode, boolean>;
}