// src/lib/i18n/format.ts
// Formatters centralisés par locale (Intl API)

// ──────────────────────────────────────────────
// Config locales supportées
// ──────────────────────────────────────────────
export const SUPPORTED_LOCALES = [
  'fr-FR',
  'en-US',
  'es-ES',
  'pt-PT',
  'it-IT',
  'de-DE',
  'nl-NL',
  'pl-PL',
  'ar-SA',
  'zh-CN',
  'hi-IN',
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Mapping code court (fr, en...) → locale complète (fr-FR, en-US)
export const LANG_TO_LOCALE: Record<string, SupportedLocale> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-PT',
  it: 'it-IT',
  de: 'de-DE',
  nl: 'nl-NL',
  pl: 'pl-PL',
  ar: 'ar-SA',
  zh: 'zh-CN',
  hi: 'hi-IN',
};

// ──────────────────────────────────────────────
// Date Formatting
// ──────────────────────────────────────────────
export type DateFormatStyle = 'short' | 'medium' | 'long' | 'full' | 'custom';

const dateFormatCache = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(
  locale: SupportedLocale,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const key = locale + JSON.stringify(options);
  if (!dateFormatCache.has(key)) {
    dateFormatCache.set(key, new Intl.DateTimeFormat(locale, options));
  }
  return dateFormatCache.get(key)!;
}

export function formatDate(
  date: Date | string | number,
  locale: SupportedLocale,
  style: DateFormatStyle = 'medium',
  customOptions?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const options: Intl.DateTimeFormatOptions =
    customOptions ||
    {
      short: { day: '2-digit', month: '2-digit', year: '2-digit' },
      medium: { day: '2-digit', month: 'short', year: 'numeric' },
      long: { day: 'numeric', month: 'long', year: 'numeric' },
      full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    }[style];

  return getDateFormatter(locale, options).format(d);
}

export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number,
  locale: SupportedLocale
): string {
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${fmt.format(start instanceof Date ? start : new Date(start))} – ${fmt.format(end instanceof Date ? end : new Date(end))}`;
}

// ──────────────────────────────────────────────
// Number Formatting
// ──────────────────────────────────────────────
const numberFormatCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(
  locale: SupportedLocale,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const key = locale + JSON.stringify(options);
  if (!numberFormatCache.has(key)) {
    numberFormatCache.set(key, new Intl.NumberFormat(locale, options));
  }
  return numberFormatCache.get(key)!;
}

export function formatNumber(
  value: number,
  locale: SupportedLocale,
  options: Intl.NumberFormatOptions = {}
): string {
  return getNumberFormatter(locale, options).format(value);
}

export function formatCompactNumber(value: number, locale: SupportedLocale): string {
  return getNumberFormatter(locale, { notation: 'compact', compactDisplay: 'short' }).format(value);
}

// ──────────────────────────────────────────────
// Currency Formatting (EUR par défaut)
// ──────────────────────────────────────────────
const currencyFormatCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(locale: SupportedLocale, currency = 'EUR'): Intl.NumberFormat {
  const key = locale + currency;
  if (!currencyFormatCache.has(key)) {
    currencyFormatCache.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
      })
    );
  }
  return currencyFormatCache.get(key)!;
}

export function formatCurrency(value: number, locale: SupportedLocale, currency = 'EUR'): string {
  return getCurrencyFormatter(locale, currency).format(value);
}

// ──────────────────────────────────────────────
// Relative Time (il y a X jours, in X days...)
// ──────────────────────────────────────────────
const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

function getRtf(locale: SupportedLocale): Intl.RelativeTimeFormat {
  if (!rtfCache.has(locale)) {
    rtfCache.set(locale, new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }));
  }
  return rtfCache.get(locale)!;
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: SupportedLocale
): string {
  return getRtf(locale).format(value, unit);
}

export function formatTimeAgo(date: Date | string | number, locale: SupportedLocale): string {
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (diffSec < 60) return formatRelativeTime(diffSec, 'second', locale);
  if (diffMin < 60) return formatRelativeTime(diffMin, 'minute', locale);
  if (diffHour < 24) return formatRelativeTime(diffHour, 'hour', locale);
  if (diffDay < 7) return formatRelativeTime(diffDay, 'day', locale);
  if (diffWeek < 4) return formatRelativeTime(diffWeek, 'week', locale);
  if (diffMonth < 12) return formatRelativeTime(diffMonth, 'month', locale);
  return formatRelativeTime(diffYear, 'year', locale);
}

// ──────────────────────────────────────────────
// List Formatting (A, B et C)
// ──────────────────────────────────────────────
const listFormatCache = new Map<string, Intl.ListFormat>();

function getListFormatter(
  locale: SupportedLocale,
  type: Intl.ListFormatType = 'conjunction'
): Intl.ListFormat {
  const key = locale + type;
  if (!listFormatCache.has(key)) {
    listFormatCache.set(key, new Intl.ListFormat(locale, { style: 'long', type }));
  }
  return listFormatCache.get(key)!;
}

export function formatList(
  items: string[],
  locale: SupportedLocale,
  type: Intl.ListFormatType = 'conjunction'
): string {
  return getListFormatter(locale, type).format(items);
}
