// utils/currency.ts — Currency Formatting & Conversion (schema-org-master)
// ISO 4217, formatting, conversion rates

// ============================================================================
// ISO 4217 CURRENCY DATA
// ============================================================================

export interface CurrencyInfo {
  code: string;           // ISO 4217 (EUR, USD, GBP, etc.)
  symbol: string;         // Symbole (€, $, £, etc.)
  name: string;           // Nom complet
  decimals: number;       // Décimales standard (2 pour la plupart)
  symbolPosition: 'before' | 'after'; // Position symbole
  spaceBetween: boolean;  // Espace entre montant et symbole
}

/** Devises supportées par Kiki en Christ */
export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2, symbolPosition: 'before', spaceBetween: false },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2, symbolPosition: 'before', spaceBetween: false },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2, symbolPosition: 'before', spaceBetween: true },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2, symbolPosition: 'before', spaceBetween: true },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0, symbolPosition: 'before', spaceBetween: true },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 2, symbolPosition: 'before', spaceBetween: false },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2, symbolPosition: 'before', spaceBetween: false },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 2, symbolPosition: 'before', spaceBetween: true },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimals: 0, symbolPosition: 'after', spaceBetween: true },
  RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', decimals: 2, symbolPosition: 'after', spaceBetween: true },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', decimals: 0, symbolPosition: 'after', spaceBetween: false },
};

// ============================================================================
// EXCHANGE RATES — Taux de change (mise à jour manuelle ou via API)
// ============================================================================

/**
 * Taux de change de base (vers EUR = 1)
 * À mettre à jour périodiquement via API (ex: exchangerate-api.com, fixer.io)
 * Dernière MAJ: 2024-11-25
 */
export const EXCHANGE_RATES_TO_EUR: Record<string, number> = {
  EUR: 1.0,
  USD: 0.92,
  GBP: 1.17,
  CAD: 0.67,
  AUD: 0.61,
  CHF: 1.05,
  JPY: 0.0061,
  CNY: 0.13,
  INR: 0.011,
  BRL: 0.18,
  PLN: 0.23,
  CZK: 0.041,
  HUF: 0.0026,
  RON: 0.20,
  SEK: 0.089,
  NOK: 0.086,
  DKK: 0.13,
  TRY: 0.028,
  RUB: 0.010,
  KRW: 0.00069,
};

/**
 * Convertit un montant d'une devise vers une autre
 * @param amount Montant
 * @param from Devise source (ISO 4217)
 * @param to Devise cible (ISO 4217)
 * @returns Montant converti
 */
export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;

  const fromRate = EXCHANGE_RATES_TO_EUR[from];
  const toRate = EXCHANGE_RATES_TO_EUR[to];

  if (!fromRate || !toRate) {
    console.warn(`[currency] Unknown currency rate: ${from} or ${to}, returning original`);
    return amount;
  }

  // Convertir: amount * (from->EUR) / (to->EUR) = amount * (fromRate / toRate)
  return amount * (fromRate / toRate);
}

/**
 * Convertit vers EUR (helper fréquent pour pays UE)
 */
export function convertToEUR(amount: number, from: string): number {
  return convertCurrency(amount, from, 'EUR');
}

// ============================================================================
// FORMATTING — Affichage prix
// ============================================================================

export interface FormatPriceOptions {
  /** Devise (ISO 4217) */
  currency: string;
  /** Locale pour formatage nombres (défaut: 'fr-FR') */
  locale?: string;
  /** Forcer nombre de décimales (override currency default) */
  decimals?: number;
  /** Afficher le code devise (EUR, USD) au lieu du symbole */
  showCode?: boolean;
  /** Afficher le symbole (défaut: true) */
  showSymbol?: boolean;
  /** Format compact (1.2K, 5M) */
  compact?: boolean;
}

/**
 * Formate un prix selon la devise et locale
 * @param amount Montant en nombre
 * @param options Options de formatage
 * @returns String formaté (ex: "13,90 €", "$3.99", "9,99 EUR")
 */
export function formatPrice(amount: number, options: FormatPriceOptions): string {
  const {
    currency,
    locale = 'fr-FR',
    decimals,
    showCode = false,
    showSymbol = true,
    compact = false,
  } = options;

  const currencyInfo = SUPPORTED_CURRENCIES[currency] || {
    code: currency,
    symbol: currency,
    decimals: 2,
    symbolPosition: 'after',
    spaceBetween: true,
  };

  const dec = decimals ?? currencyInfo.decimals;
  
  // Pour showCode=true, utiliser style currency
  if (showCode) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: compact ? 'short' : undefined,
    });
    return formatter.format(amount);
  }

  // Sinon formatter nombre + symbole manuel — utiliser locale 'en-US' pour symboles avant (USD, GBP)
  const symbolLocale = locale;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: compact ? 'short' : undefined,
  });

  const numStr = formatter.format(amount);
  const symbol = showSymbol ? currencyInfo.symbol : '';
  const space = currencyInfo.spaceBetween && symbol ? ' ' : '';

  if (currencyInfo.symbolPosition === 'before') {
    return `${symbol}${space}${numStr}`;
  } else {
    return `${numStr}${space}${symbol}`;
  }
}

/**
 * Formate prix pour Schema.org (valeur numérique + currency séparée)
 * Schema.org attend price comme number, priceCurrency comme string ISO 4217
 */
export function formatPriceForSchema(amount: number, currency: string): { price: number; priceCurrency: string } {
  return {
    price: Math.round(amount * 100) / 100, // 2 décimales max
    priceCurrency: currency.toUpperCase(),
  };
}

/**
 * Parse un prix string vers number (gère symboles, espaces, virgules)
 */
export function parsePrice(priceStr: string, currency?: string): number {
  // Nettoyer: garder chiffres, point, virgule, minus
  const cleaned = priceStr
    .replace(/[^\d.,-]/g, '')
    .replace(',', '.');

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// ============================================================================
// EU COUNTRIES — Détection pays UE pour auto-conversion EUR
// ============================================================================

/** Pays UE (ISO 3166-1 alpha-2) — pour conversion auto EUR */
export const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);

/** Pays utilisant l'Euro (zone euro) — 20 pays (incluant la Croatie ajoutée 2023) */
export const EUROZONE_COUNTRIES = new Set([
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'HR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
]);

/**
 * Détermine si un pays doit afficher les prix en EUR
 * @param countryCode Code pays ISO 3166-1 alpha-2
 * @returns true si pays UE
 */
export function shouldUseEUR(countryCode: string): boolean {
  return EU_COUNTRIES.has(countryCode.toUpperCase());
}

/**
 * Détermine la devise par défaut pour un pays
 */
export function getDefaultCurrencyForCountry(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (EUROZONE_COUNTRIES.has(code)) return 'EUR';
  if (code === 'GB') return 'GBP';
  if (code === 'US') return 'USD';
  if (code === 'CA') return 'CAD';
  if (code === 'AU') return 'AUD';
  if (code === 'CH') return 'CHF';
  if (code === 'JP') return 'JPY';
  if (code === 'CN') return 'CNY';
  if (code === 'IN') return 'INR';
  if (code === 'BR') return 'BRL';
  if (code === 'PL') return 'PLN';
  if (code === 'CZ') return 'CZK';
  if (code === 'HU') return 'HUF';
  if (code === 'RO') return 'RON';
  if (code === 'SE') return 'SEK';
  if (code === 'NO') return 'NOK';
  if (code === 'DK') return 'DKK';
  if (code === 'TR') return 'TRY';
  if (code === 'RU') return 'RUB';
  if (code === 'KR') return 'KRW';
  return 'EUR'; // défaut
}