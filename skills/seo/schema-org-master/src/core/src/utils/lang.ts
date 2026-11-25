// utils/lang.ts — Language Utilities (schema-org-master)
// BCP 47, ISO 639-1, ISO 3166-1, direction, names

// ============================================================================
// KIKI SUPPORTED LANGUAGES — 11 langues officielles
// ============================================================================

export type KikiLangCode =
  | 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de'
  | 'nl' | 'pl' | 'ar' | 'ru' | 'zh' | 'hi';

/** Métadonnées complètes par langue */
export interface LanguageInfo {
  code: KikiLangCode;           // ISO 639-1
  name: string;                 // Nom anglais
  nativeName: string;           // Nom natif
  flag: string;                 // Emoji drapeau
  direction: 'ltr' | 'rtl';     // Direction écriture
  region: string;               // ISO 3166-1 alpha-2 (pays principal)
  bcp47: string;                // Code BCP 47 complet
  schemaOrgLang: string;        // Code pour Schema.org inLanguage
  locale: string;               // Locale Intl (ex: fr-FR)
  currency: string;             // Devise par défaut (ISO 4217)
  eurozone: boolean;            // Pays zone euro
}

export const KIKI_LANGUAGES: Record<KikiLangCode, LanguageInfo> = {
  fr: {
    code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷',
    direction: 'ltr', region: 'FR', bcp47: 'fr-FR', schemaOrgLang: 'fr',
    locale: 'fr-FR', currency: 'EUR', eurozone: true,
  },
  en: {
    code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸',
    direction: 'ltr', region: 'US', bcp47: 'en-US', schemaOrgLang: 'en',
    locale: 'en-US', currency: 'USD', eurozone: false,
  },
  es: {
    code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸',
    direction: 'ltr', region: 'ES', bcp47: 'es-ES', schemaOrgLang: 'es',
    locale: 'es-ES', currency: 'EUR', eurozone: true,
  },
  pt: {
    code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹',
    direction: 'ltr', region: 'PT', bcp47: 'pt-PT', schemaOrgLang: 'pt',
    locale: 'pt-PT', currency: 'EUR', eurozone: true,
  },
  it: {
    code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹',
    direction: 'ltr', region: 'IT', bcp47: 'it-IT', schemaOrgLang: 'it',
    locale: 'it-IT', currency: 'EUR', eurozone: true,
  },
  de: {
    code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪',
    direction: 'ltr', region: 'DE', bcp47: 'de-DE', schemaOrgLang: 'de',
    locale: 'de-DE', currency: 'EUR', eurozone: true,
  },
  nl: {
    code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱',
    direction: 'ltr', region: 'NL', bcp47: 'nl-NL', schemaOrgLang: 'nl',
    locale: 'nl-NL', currency: 'EUR', eurozone: true,
  },
  pl: {
    code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱',
    direction: 'ltr', region: 'PL', bcp47: 'pl-PL', schemaOrgLang: 'pl',
    locale: 'pl-PL', currency: 'PLN', eurozone: false,
  },
  ar: {
    code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦',
    direction: 'rtl', region: 'SA', bcp47: 'ar-SA', schemaOrgLang: 'ar',
    locale: 'ar-SA', currency: 'SAR', eurozone: false,
  },
  ru: {
    code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺',
    direction: 'ltr', region: 'RU', bcp47: 'ru-RU', schemaOrgLang: 'ru',
    locale: 'ru-RU', currency: 'RUB', eurozone: false,
  },
  zh: {
    code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳',
    direction: 'ltr', region: 'CN', bcp47: 'zh-CN', schemaOrgLang: 'zh',
    locale: 'zh-CN', currency: 'CNY', eurozone: false,
  },
  hi: {
    code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳',
    direction: 'ltr', region: 'IN', bcp47: 'hi-IN', schemaOrgLang: 'hi',
    locale: 'hi-IN', currency: 'INR', eurozone: false,
  },
};

// ============================================================================
// HELPERS
// ============================================================================

/** Liste des codes langues supportés */
export const SUPPORTED_LANG_CODES: readonly KikiLangCode[] = Object.keys(KIKI_LANGUAGES) as KikiLangCode[];

/** Vérifie si un code est supporté */
export function isSupportedLang(code: string): code is KikiLangCode {
  return code in KIKI_LANGUAGES;
}

/** Récupère infos langue (fallback FR) */
export function getLangInfo(code: string): LanguageInfo {
  return KIKI_LANGUAGES[code as KikiLangCode] || KIKI_LANGUAGES.fr;
}

/** Nom natif de la langue */
export function getNativeName(code: string): string {
  return getLangInfo(code).nativeName;
}

/** Drapeau emoji */
export function getFlag(code: string): string {
  return getLangInfo(code).flag;
}

/** Direction écriture */
export function getDirection(code: string): 'ltr' | 'rtl' {
  return getLangInfo(code).direction;
}

/** Locale Intl */
export function getLocale(code: string): string {
  return getLangInfo(code).locale;
}

/** Code Schema.org inLanguage */
export function getSchemaOrgLang(code: string): string {
  return getLangInfo(code).schemaOrgLang;
}

/** Devise par défaut */
export function getCurrency(code: string): string {
  return getLangInfo(code).currency;
}

/** Est zone euro */
export function isEurozone(code: string): boolean {
  return getLangInfo(code).eurozone;
}

/** Code région (pays) */
export function getRegion(code: string): string {
  return getLangInfo(code).region;
}

/** Code BCP 47 complet */
export function getBCP47(code: string): string {
  return getLangInfo(code).bcp47;
}

// ============================================================================
// HTML LANG ATTRIBUTE — Pour <html lang="..."> et <meta lang="...">
// ============================================================================

/**
 * Génère l'attribut lang complet pour HTML
 * Inclut script si pertinent (ex: zh-Hans, zh-Hant)
 */
export function getHtmlLang(code: string): string {
  const info = getLangInfo(code);
  return info.bcp47;
}

/**
 * Génère les hreflang pour toutes les langues supportées
 * @param baseUrl URL de base (ex: https://kikienchrist.vercel.app)
 * @param currentPath Chemin courant (ex: /livres/visage)
 * @returns Array d'objets { hreflang, href }
 */
export function generateHreflangLinks(
  baseUrl: string,
  currentPath: string
): Array<{ hreflang: string; href: string }> {
  return SUPPORTED_LANG_CODES.map(lang => ({
    hreflang: lang,
    href: `${baseUrl}/${lang}${currentPath}`,
  }));
}

/**
 * Génère x-default hreflang
 */
export function generateXDefaultHreflang(baseUrl: string, currentPath: string): { hreflang: string; href: string } {
  return { hreflang: 'x-default', href: `${baseUrl}/fr${currentPath}` };
}

// ============================================================================
// LANGUAGE DETECTION — Depuis Accept-Language header
// ============================================================================

/**
 * Détecte la meilleure langue depuis Accept-Language header
 * @param acceptLanguage Header Accept-Language (ex: "fr-FR,fr;q=0.9,en;q=0.8")
 * @returns Code langue supporté le plus proche
 */
export function detectLanguageFromHeader(acceptLanguage: string): KikiLangCode {
  if (!acceptLanguage) return 'fr';

  // Parser les entrées: "fr-FR;q=0.9, en;q=0.8"
  const entries = acceptLanguage.split(',').map(part => {
    const [lang, q] = part.trim().split(';');
    const quality = q ? parseFloat(q.split('=')[1]) : 1;
    return { lang: lang.trim().toLowerCase(), quality };
  });

  // Trier par qualité décroissante
  entries.sort((a, b) => b.quality - a.quality);

  // Trouver première langue supportée
  for (const entry of entries) {
    // Essayer code complet (fr-FR)
    if (isSupportedLang(entry.lang)) return entry.lang;
    // Essayer code principal (fr)
    const primary = entry.lang.split('-')[0];
    if (isSupportedLang(primary)) return primary as KikiLangCode;
  }

  return 'fr'; // défaut
}

// ============================================================================
// TRANSLATION KEYS — Clés i18n communes pour Schema.org
// ============================================================================

export const SCHEMA_I18N_KEYS = {
  // Book
  book: {
    fr: 'Livre', en: 'Book', es: 'Libro', pt: 'Livro', it: 'Libro', de: 'Buch',
    nl: 'Boek', pl: 'Książka', ar: 'كتاب', ru: 'Книга', zh: '书', hi: 'पुस्तक',
  },
  // Paperback
  paperback: {
    fr: 'Broché', en: 'Paperback', es: 'Tapa blanda', pt: 'Capa comum', it: 'Brossura', de: 'Taschenbuch',
    nl: 'Paperback', pl: 'Miękka okładka', ar: 'غلاف ورقي', ru: 'Мягкая обложка', zh: '平装', hi: 'पेपरबैक',
  },
  // Ebook
  ebook: {
    fr: 'Ebook', en: 'Ebook', es: 'Ebook', pt: 'Ebook', it: 'Ebook', de: 'E-Book',
    nl: 'E-book', pl: 'Ebook', ar: 'كتاب إلكتروني', ru: 'Электронная книга', zh: '电子书', hi: 'ईबुक',
  },
  // Audiobook
  audiobook: {
    fr: 'Audio', en: 'Audiobook', es: 'Audiolibro', pt: 'Audiobook', it: 'Audiolibro', de: 'Hörbuch',
    nl: 'Audioboek', pl: 'Audiobook', ar: 'كتاب صوتي', ru: 'Аудиокнига', zh: '有声书', hi: 'ऑडियोबुक',
  },
  // Price
  price: {
    fr: 'Prix', en: 'Price', es: 'Precio', pt: 'Preço', it: 'Prezzo', de: 'Preis',
    nl: 'Prijs', pl: 'Cena', ar: 'سعر', ru: 'Цена', zh: '价格', hi: 'कीमत',
  },
  // Available
  available: {
    fr: 'Disponible', en: 'Available', es: 'Disponible', pt: 'Disponível', it: 'Disponibile', de: 'Verfügbar',
    nl: 'Beschikbaar', pl: 'Dostępny', ar: 'متاح', ru: 'Доступно', zh: '有货', hi: 'उपलब्ध',
  },
  // Rating
  rating: {
    fr: 'Note', en: 'Rating', es: 'Valoración', pt: 'Avaliação', it: 'Valutazione', de: 'Bewertung',
    nl: 'Beoordeling', pl: 'Ocena', ar: 'تقييم', ru: 'Рейтинг', zh: '评分', hi: 'रेटिंग',
  },
} as const;

/**
 * Récupère traduction pour une clé Schema.org
 */
export function t(key: keyof typeof SCHEMA_I18N_KEYS, lang: KikiLangCode, subKey: string): string {
  const dict = SCHEMA_I18N_KEYS[key];
  return (dict as Record<string, string>)[lang] || (dict as Record<string, string>).fr;
}