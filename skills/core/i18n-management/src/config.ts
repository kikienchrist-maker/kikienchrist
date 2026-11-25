/**
 * Configuration par défaut pour i18n Management
 */
import type { I18nConfig, LangCode } from './types.js';
import { SUPPORTED_LANGS, UI_LANGS, DEFAULT_LANG } from './types.js';
export { SUPPORTED_LANGS, UI_LANGS, DEFAULT_LANG } from './types.js';

export const DEFAULT_I18N_CONFIG: I18nConfig = {
  basePath: process.cwd(),
  supportedLangs: SUPPORTED_LANGS,
  defaultLang: DEFAULT_LANG,
  translationsFile: 'src/data/translations.json',
  i18nDir: 'src/data/i18n',
  middlewareFile: 'src/middleware.ts',
  routesDir: 'src/pages',
};

export const LANG_NAMES: Record<LangCode, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  de: 'Deutsch',
  nl: 'Nederlands',
  pl: 'Polski',
  ar: 'العربية',
  ru: 'Русский',
  zh: '中文',
  hi: 'हिन्दी',
  'x-default': 'Default',
};

export const LANG_DIRECTIONS: Record<LangCode, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  en: 'ltr',
  es: 'ltr',
  pt: 'ltr',
  it: 'ltr',
  de: 'ltr',
  nl: 'ltr',
  pl: 'ltr',
  ar: 'rtl',
  ru: 'ltr',
  zh: 'ltr',
  hi: 'ltr',
  'x-default': 'ltr',
};

export const LANG_REGIONS: Record<LangCode, string> = {
  fr: 'FR',
  en: 'US',
  es: 'ES',
  pt: 'PT',
  it: 'IT',
  de: 'DE',
  nl: 'NL',
  pl: 'PL',
  ar: 'SA',
  ru: 'RU',
  zh: 'CN',
  hi: 'IN',
  'x-default': 'FR',
};

export const TRANSLATION_CATEGORIES = [
  'common',
  'navigation',
  'blog',
  'legal',
  'books',
  'forms',
  'seo',
  'accessibility',
  'errors',
  'newsletter',
  'pwa',
  'affiliation',
] as const;

export type TranslationCategory = typeof TRANSLATION_CATEGORIES[number];

export const ICU_PLURAL_RULES: Record<LangCode, string> = {
  fr: 'nplurals=2; plural=(n > 1)',
  en: 'nplurals=2; plural=(n != 1)',
  es: 'nplurals=2; plural=(n != 1)',
  pt: 'nplurals=2; plural=(n != 1)',
  it: 'nplurals=2; plural=(n != 1)',
  de: 'nplurals=2; plural=(n != 1)',
  nl: 'nplurals=2; plural=(n != 1)',
  pl: 'nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)',
  ar: 'nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5)',
  ru: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)',
  zh: 'nplurals=1; plural=0',
  hi: 'nplurals=2; plural=(n != 1)',
  'x-default': 'nplurals=2; plural=(n > 1)',
};