/**
 * Utility to load translations from JSON for a given locale
 * Used by MainLayout and components needing full translation object
 */

import translationsData from '../data/translations.json';

export type Locale = 'fr' | 'en' | 'es' | 'de' | 'pt' | 'it' | 'ru' | 'zh' | 'hi';
export type TranslationKey = keyof typeof translationsData.fr;

/**
 * Get full translations object for a locale
 * Falls back to French if locale not found
 */
export function getTranslations(locale: string): Record<string, unknown> {
  const supportedLocales: Locale[] = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];
  const safeLocale = supportedLocales.includes(locale as Locale) ? locale : 'fr';
  return translationsData[safeLocale as Locale] as Record<string, unknown>;
}

/**
 * Get a specific translation section for a locale
 */
export function getTranslationSection(locale: string, section: string): Record<string, unknown> {
  const translations = getTranslations(locale);
  return (translations[section] as Record<string, unknown>) || {};
}