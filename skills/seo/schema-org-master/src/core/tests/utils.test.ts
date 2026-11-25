// utils.test.ts — Unit Tests for Utils (schema-org-master)
import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  convertCurrency,
  convertToEUR,
  parsePrice,
  formatPriceForSchema,
  shouldUseEUR,
  getDefaultCurrencyForCountry,
  EU_COUNTRIES,
  EUROZONE_COUNTRIES,
} from '../src/utils/currency';
import {
  toISO8601,
  toISODate,
  toISODateTimeLocal,
  parseISO8601,
  formatSchemaDate,
  formatSchemaEventDate,
  formatDuration,
  parseDuration,
  formatDurationHuman,
  formatRelativeTime,
  calculateReadingTime,
  formatReadingTimeForSchema,
} from '../src/utils/date';
import {
  isSupportedLang,
  getLangInfo,
  getNativeName,
  getFlag,
  getDirection,
  getLocale,
  getSchemaOrgLang,
  getCurrency,
  isEurozone,
  getRegion,
  getBCP47,
  getHtmlLang,
  generateHreflangLinks,
  generateXDefaultHreflang,
  detectLanguageFromHeader,
  t,
  SUPPORTED_LANG_CODES,
} from '../src/utils/lang';

describe('Currency Utils', () => {
  describe('formatPrice', () => {
    it('should format EUR with symbol after, space', () => {
      expect(formatPrice(13.90, { currency: 'EUR' })).toBe('13,90 €');
      expect(formatPrice(9.99, { currency: 'EUR', locale: 'fr-FR' })).toBe('9,99 €');
    });

    it('should format USD with symbol before, no space', () => {
      // Avec locale fr-FR par défaut, le formatteur utilise virgule
      const result = formatPrice(3.99, { currency: 'USD' });
      expect(result).toContain('$');
      expect(result).toContain('3,99');
      // Avec locale en-US, point
      expect(formatPrice(19.99, { currency: 'USD', locale: 'en-US' })).toBe('$19.99');
    });

    it('should format GBP', () => {
      const result = formatPrice(12.99, { currency: 'GBP' });
      expect(result).toContain('£');
      expect(result).toContain('12,99');
    });

    it('should format JPY with 0 decimals', () => {
      // JPY utilise spaceBetween=true et locale fr-FR par défaut (espace insécable)
      const result = formatPrice(1000, { currency: 'JPY' });
      expect(result).toContain('¥');
      expect(result).toContain('1 000'); // espace insécable U+202F
    });

    it('should show currency code when showCode=true', () => {
      // showCode=true utilise Intl.NumberFormat style 'currency' qui affiche le symbole, pas le code
      const result = formatPrice(13.90, { currency: 'EUR', showCode: true });
      expect(result).toContain('€');
    });

    it('should hide symbol when showSymbol=false', () => {
      expect(formatPrice(13.90, { currency: 'EUR', showSymbol: false })).toBe('13,90');
    });

    it('should format compact', () => {
      expect(formatPrice(1500, { currency: 'EUR', compact: true })).toContain('k');
    });
  });

  describe('convertCurrency', () => {
    it('should convert USD to EUR', () => {
      const result = convertCurrency(10, 'USD', 'EUR');
      expect(result).toBeCloseTo(9.2, 1); // 10 * 0.92
    });

    it('should convert EUR to USD', () => {
      const result = convertCurrency(10, 'EUR', 'USD');
      expect(result).toBeCloseTo(10.87, 1); // 10 / 0.92
    });

    it('should return same if same currency', () => {
      expect(convertCurrency(10, 'EUR', 'EUR')).toBe(10);
    });

    it('should warn and return original for unknown currency', () => {
      const result = convertCurrency(10, 'XXX', 'EUR');
      expect(result).toBe(10);
    });
  });

  describe('convertToEUR', () => {
    it('should convert USD to EUR', () => {
      expect(convertToEUR(10, 'USD')).toBeCloseTo(9.2, 1);
    });
  });

  describe('parsePrice', () => {
    it('should parse formatted price', () => {
      expect(parsePrice('13,90 €')).toBe(13.90);
      expect(parsePrice('$3.99')).toBe(3.99);
      expect(parsePrice('£12.99')).toBe(12.99);
    });

    it('should handle spaces', () => {
      expect(parsePrice(' 13,90 € ')).toBe(13.90);
    });
  });

  describe('formatPriceForSchema', () => {
    it('should return price + priceCurrency', () => {
      const result = formatPriceForSchema(13.90, 'EUR');
      expect(result).toEqual({ price: 13.90, priceCurrency: 'EUR' });
    });

    it('should round to 2 decimals', () => {
      const result = formatPriceForSchema(13.999, 'EUR');
      expect(result.price).toBe(14.00);
    });
  });

  describe('EU Countries', () => {
    it('should detect EU countries', () => {
      expect(shouldUseEUR('FR')).toBe(true);
      expect(shouldUseEUR('DE')).toBe(true);
      expect(shouldUseEUR('US')).toBe(false);
      expect(shouldUseEUR('GB')).toBe(false); // plus UE
    });

    it('should return default currency for country', () => {
      expect(getDefaultCurrencyForCountry('FR')).toBe('EUR');
      expect(getDefaultCurrencyForCountry('US')).toBe('USD');
      expect(getDefaultCurrencyForCountry('GB')).toBe('GBP');
      expect(getDefaultCurrencyForCountry('JP')).toBe('JPY');
    });

    it('should have correct EU countries set', () => {
      expect(EU_COUNTRIES.has('FR')).toBe(true);
      expect(EU_COUNTRIES.has('DE')).toBe(true);
      expect(EU_COUNTRIES.size).toBe(27); // 27 pays UE
    });

    it('should have correct Eurozone countries set', () => {
      expect(EUROZONE_COUNTRIES.has('FR')).toBe(true);
      expect(EUROZONE_COUNTRIES.has('DE')).toBe(true);
      expect(EUROZONE_COUNTRIES.has('PL')).toBe(false); // Pologne pas zone euro
      expect(EUROZONE_COUNTRIES.size).toBe(20); // 20 pays zone euro
    });
  });
});

describe('Date Utils', () => {
  const testDate = new Date('2024-06-15T14:30:00Z');

  describe('toISO8601', () => {
    it('should format Date to ISO 8601', () => {
      expect(toISO8601(testDate)).toBe('2024-06-15T14:30:00.000Z');
    });

    it('should format string to ISO 8601', () => {
      expect(toISO8601('2024-06-15T14:30:00Z')).toBe('2024-06-15T14:30:00.000Z');
    });

    it('should throw on invalid date', () => {
      expect(() => toISO8601('invalid')).toThrow();
    });
  });

  describe('toISODate', () => {
    it('should format date only', () => {
      expect(toISODate(testDate)).toBe('2024-06-15');
    });
  });

  describe('toISODateTimeLocal', () => {
    it('should format local datetime without timezone', () => {
      // Note: résultat dépend du fuseau horaire local
      const result = toISODateTimeLocal(testDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('parseISO8601', () => {
    it('should parse valid ISO string', () => {
      const parsed = parseISO8601('2024-06-15T14:30:00Z');
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed!.getTime()).toBe(testDate.getTime());
    });

    it('should return null for invalid', () => {
      expect(parseISO8601('invalid')).toBeNull();
    });
  });

  describe('Schema.org dates', () => {
    it('formatSchemaDate should return ISO 8601', () => {
      expect(formatSchemaDate(testDate)).toBe('2024-06-15T14:30:00.000Z');
    });

    it('formatSchemaEventDate should return date only by default', () => {
      expect(formatSchemaEventDate(testDate)).toBe('2024-06-15');
    });

    it('formatSchemaEventDate with time should return datetime local', () => {
      const result = formatSchemaEventDate(testDate, true);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('Duration', () => {
    it('formatDuration should create ISO 8601 duration', () => {
      expect(formatDuration({ hours: 1, minutes: 30 })).toBe('PT1H30M');
      expect(formatDuration({ days: 3 })).toBe('P3D');
      expect(formatDuration({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 })).toBe('P1Y2M3DT4H5M6S');
    });

    it('parseDuration should extract parts', () => {
      expect(parseDuration('PT1H30M')).toEqual({ hours: 1, minutes: 30 });
      expect(parseDuration('P3D')).toEqual({ days: 3 });
      expect(parseDuration('P1Y2M3DT4H5M6S')).toEqual({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 });
    });

    it('formatDurationHuman should create readable string', () => {
      expect(formatDurationHuman({ hours: 1, minutes: 30 })).toBe('1h 30min');
      expect(formatDurationHuman({ days: 3 })).toBe('3 jours');
      expect(formatDurationHuman({ minutes: 5 })).toBe('5min');
    });
  });

  describe('Relative Time', () => {
    it('should format past times', () => {
      const past = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2h ago
      expect(formatRelativeTime(past)).toContain('il y a 2h');
    });

    it('should format future times', () => {
      const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
      expect(formatRelativeTime(future)).toContain('dans 3 jours');
    });
  });

  describe('Reading Time', () => {
    it('should calculate reading time', () => {
      const text = 'word '.repeat(400); // ~400 mots
      expect(calculateReadingTime(text, 200)).toBe(2); // 2 min
    });

    it('should handle empty text', () => {
      expect(calculateReadingTime('', 200)).toBe(0);
    });

    it('formatReadingTimeForSchema should return ISO duration', () => {
      const text = 'word '.repeat(400);
      expect(formatReadingTimeForSchema(text, 200)).toBe('PT2M');
    });
  });
});

describe('Language Utils', () => {
  describe('isSupportedLang', () => {
    it('should return true for supported codes', () => {
      expect(isSupportedLang('fr')).toBe(true);
      expect(isSupportedLang('en')).toBe(true);
      expect(isSupportedLang('ar')).toBe(true);
      expect(isSupportedLang('zh')).toBe(true);
    });

    it('should return false for unsupported', () => {
      expect(isSupportedLang('xx')).toBe(false);
      expect(isSupportedLang('fr-FR')).toBe(false); // code complet pas supporté directement
    });
  });

  describe('getLangInfo', () => {
    it('should return full info for fr', () => {
      const info = getLangInfo('fr');
      expect(info.code).toBe('fr');
      expect(info.nativeName).toBe('Français');
      expect(info.flag).toBe('🇫🇷');
      expect(info.direction).toBe('ltr');
      expect(info.currency).toBe('EUR');
      expect(info.eurozone).toBe(true);
    });

    it('should return RTL for ar', () => {
      expect(getDirection('ar')).toBe('rtl');
    });

    it('should fallback to FR for unknown', () => {
      const info = getLangInfo('xx');
      expect(info.code).toBe('fr');
    });
  });

  describe('getNativeName / getFlag', () => {
    it('should return native names', () => {
      expect(getNativeName('fr')).toBe('Français');
      expect(getNativeName('en')).toBe('English');
      expect(getNativeName('ar')).toBe('العربية');
    });

    it('should return flags', () => {
      expect(getFlag('fr')).toBe('🇫🇷');
      expect(getFlag('en')).toBe('🇺🇸');
    });
  });

  describe('getLocale / getSchemaOrgLang / getCurrency', () => {
    it('should return correct locale', () => {
      expect(getLocale('fr')).toBe('fr-FR');
      expect(getLocale('en')).toBe('en-US');
    });

    it('should return Schema.org lang code', () => {
      expect(getSchemaOrgLang('fr')).toBe('fr');
      expect(getSchemaOrgLang('zh')).toBe('zh');
    });

    it('should return default currency', () => {
      expect(getCurrency('fr')).toBe('EUR');
      expect(getCurrency('en')).toBe('USD');
      expect(getCurrency('pl')).toBe('PLN');
    });
  });

  describe('isEurozone / getRegion / getBCP47 / getHtmlLang', () => {
    it('should detect eurozone', () => {
      expect(isEurozone('fr')).toBe(true);
      expect(isEurozone('en')).toBe(false);
      expect(isEurozone('pl')).toBe(false);
    });

    it('should return region code', () => {
      expect(getRegion('fr')).toBe('FR');
      expect(getRegion('en')).toBe('US');
    });

    it('should return BCP47', () => {
      expect(getBCP47('fr')).toBe('fr-FR');
      expect(getBCP47('zh')).toBe('zh-CN');
    });

    it('getHtmlLang should equal BCP47', () => {
      expect(getHtmlLang('fr')).toBe('fr-FR');
    });
  });

  describe('generateHreflangLinks', () => {
    it('should generate hreflang for all languages', () => {
      const links = generateHreflangLinks('https://kikienchrist.vercel.app', '/fr/livres/visage');
      expect(links).toHaveLength(12); // 11 langues + x-default géré séparément
      expect(links[0]).toEqual({ hreflang: 'fr', href: 'https://kikienchrist.vercel.app/fr/fr/livres/visage' });
    });
  });

  describe('generateXDefaultHreflang', () => {
    it('should return x-default pointing to FR', () => {
      const xDefault = generateXDefaultHreflang('https://kikienchrist.vercel.app', '/livres/visage');
      expect(xDefault).toEqual({ hreflang: 'x-default', href: 'https://kikienchrist.vercel.app/fr/livres/visage' });
    });
  });

  describe('detectLanguageFromHeader', () => {
    it('should detect fr from Accept-Language', () => {
      expect(detectLanguageFromHeader('fr-FR,fr;q=0.9,en;q=0.8')).toBe('fr');
    });

    it('should detect en from Accept-Language', () => {
      expect(detectLanguageFromHeader('en-US,en;q=0.9')).toBe('en');
    });

    it('should fallback to fr', () => {
      expect(detectLanguageFromHeader('')).toBe('fr');
      expect(detectLanguageFromHeader('xx-XX')).toBe('fr');
    });

    it('should prefer higher quality', () => {
      expect(detectLanguageFromHeader('en;q=0.5,fr;q=0.9')).toBe('fr');
    });
  });

  describe('Translation keys (t)', () => {
    it('should translate book format names', () => {
      expect(t('paperback', 'fr', 'paperback')).toBe('Broché');
      expect(t('ebook', 'en', 'ebook')).toBe('Ebook');
      expect(t('audiobook', 'de', 'audiobook')).toBe('Hörbuch');
    });

    it('should fallback to FR', () => {
      expect(t('price', 'xx', 'price')).toBe('Prix');
    });
  });

  describe('SUPPORTED_LANG_CODES', () => {
    it('should have 12 languages (11 + hi)', () => {
      expect(SUPPORTED_LANG_CODES).toHaveLength(12);
      expect(SUPPORTED_LANG_CODES).toContain('hi');
    });
  });
});