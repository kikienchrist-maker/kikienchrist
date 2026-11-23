/**
 * i18n utilities for language detection and URL handling
 */

export const SUPPORTED_LANGS = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: SupportedLang = 'fr';

export const LANG_NAMES: Record<SupportedLang, string> = {
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
};

export const LANG_FLAGS: Record<SupportedLang, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  pt: '🇵🇹',
  it: '🇮🇹',
  de: '🇩🇪',
  nl: '🇳🇱',
  pl: '🇵🇱',
  ar: '🇸🇦',
  ru: '🇷🇺',
  zh: '🇨🇳',
  hi: '🇮🇳',
};

export const LANG_DIRS: Record<SupportedLang, 'ltr' | 'rtl'> = {
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
};

/**
 * Check if a language code is supported
 */
export function isSupportedLang(lang: string): lang is SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang);
}

/**
 * Get the language prefix from a pathname
 * e.g., "/en/books" -> "en"
 * e.g., "/books" -> null
 */
export function getLangFromPath(pathname: string): SupportedLang | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const first = segments[0].toLowerCase();
  return isSupportedLang(first) ? first : null;
}

/**
 * Remove language prefix from pathname
 * e.g., "/en/books" -> "/books"
 * e.g., "/books" -> "/books"
 */
export function removeLangPrefix(pathname: string): string {
  const lang = getLangFromPath(pathname);
  if (!lang) return pathname;
  return pathname.replace(new RegExp(`^/${lang}(?=/|$)`), '') || '/';
}

/**
 * Add language prefix to pathname
 * e.g., "/books", "en" -> "/en/books"
 * e.g., "/", "fr" -> "/"
 */
export function addLangPrefix(pathname: string, lang: SupportedLang): string {
  const cleanPath = removeLangPrefix(pathname);
  if (lang === DEFAULT_LANG && cleanPath === '/') return '/';
  if (lang === DEFAULT_LANG) return cleanPath;
  return `/${lang}${cleanPath === '/' ? '/' : cleanPath}`;
}

/**
 * Get all localized URLs for a given path
 * Useful for hreflang alternate links
 */
export function getLocalizedUrls(baseUrl: string, path: string): Record<SupportedLang, string> {
  const urls = {} as Record<SupportedLang, string>;
  for (const lang of SUPPORTED_LANGS) {
    urls[lang] = `${baseUrl}${addLangPrefix(path, lang)}`;
  }
  return urls;
}

/**
 * Detect language from Accept-Language header
 */
export function detectLanguageFromHeader(acceptLanguage: string | null): SupportedLang {
  if (!acceptLanguage) return DEFAULT_LANG;

  const prefs = acceptLanguage
    .split(',')
    .map(part => {
      const [lang, q] = part.trim().split(';');
      const quality = q ? parseFloat(q.split('=')[1]) : 1.0;
      return { lang: lang.trim().toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { lang } of prefs) {
    const baseLang = lang.split('-')[0];
    if (isSupportedLang(baseLang)) return baseLang;
    if (isSupportedLang(lang)) return lang;
  }

  return DEFAULT_LANG;
}

/**
 * Generate hreflang link tags for SEO
 */
export function generateHreflangLinks(baseUrl: string, currentPath: string): string {
  const urls = getLocalizedUrls(baseUrl, currentPath);
  let html = '';

  // x-default points to root (which will redirect based on Accept-Language)
  html += `<link rel="alternate" href="${baseUrl}/" hreflang="x-default" />\n`;

  for (const [lang, url] of Object.entries(urls)) {
    html += `<link rel="alternate" href="${url}" hreflang="${lang}" />\n`;
  }

  return html.trim();
}