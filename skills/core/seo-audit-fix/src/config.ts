/**
 * Configuration par défaut pour SEO Audit
 */
import type { SEOConfig, LangCode } from './types.js';

/**
 * Détermine le type de page depuis l'URL
 */
export function getPageType(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    
    if (path === '/' || path === '') return 'home';
    if (path.match(/^\/[a-z-]+\/blog\/?$/)) return 'blogIndex';
    if (path.match(/^\/[a-z-]+\/blog\/[^/]+\/?$/)) return 'blogPost';
    if (path.match(/^\/[a-z-]+\/blog\/categorie\/[^/]+\/?$/)) return 'blogCategory';
    if (path.match(/^\/[a-z-]+\/(mentions-legales|confidentialite|cookies|cgv|accessibilite)\/?$/)) return 'legal';
    if (path.match(/^\/[a-z-]+\/livres\/[^/]+\/?$/)) return 'book';
    if (path.match(/^\/[a-z-]+\/contact\/?$/)) return 'contact';
    if (path.match(/^\/[a-z-]+\/partenaires\/?$/)) return 'partners';
    
    return 'default';
  } catch {
    return 'default';
  }
}

export const DEFAULT_CONFIG: SEOConfig = {
  baseUrl: 'https://kikienchrist.vercel.app',
  lighthouseThresholds: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 90,
  },
  excludePatterns: [
    '/404',
    '/500',
    '/offline',
    '/sw.js',
    '/workbox-',
    '/manifest.webmanifest',
    '/robots.txt',
    '/sitemap.xml',
    '/rss.xml',
    '/_astro/',
    '/images/',
    '/fonts/',
    '/icons/',
  ],
  supportedLangs: ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'],
  defaultLang: 'fr',
  requestTimeoutMs: 15000,
  maxConcurrency: 5,
  userAgent: 'KikiEnChrist-SEOAudit/1.0 (+https://kikienchrist.vercel.app)',
};

/**
 * Règles de validation meta
 */
export const META_RULES = {
  title: {
    minLength: 30,
    maxLength: 60,
    required: true,
  },
  description: {
    minLength: 120,
    maxLength: 160,
    required: true,
  },
  ogTitle: {
    minLength: 30,
    maxLength: 60,
    required: true,
  },
  ogDescription: {
    minLength: 120,
    maxLength: 160,
    required: true,
  },
  ogImage: {
    required: true,
    minWidth: 1200,
    minHeight: 630,
  },
  canonical: {
    required: true,
  },
  hreflang: {
    required: true,
    bidirectional: true,
    xDefaultRequired: true,
  },
};

/**
 * Types Schema.org requis par type de page
 */
export const REQUIRED_SCHEMA_BY_PAGE_TYPE: Record<string, string[]> = {
  home: ['WebSite', 'Organization'],
  blogIndex: ['WebSite', 'Organization', 'Blog'],
  blogPost: ['WebSite', 'Organization', 'Article', 'BreadcrumbList'],
  blogCategory: ['WebSite', 'Organization', 'CollectionPage', 'BreadcrumbList'],
  legal: ['WebSite', 'Organization', 'WebPage', 'BreadcrumbList', 'FAQPage'],
  book: ['WebSite', 'Organization', 'Book', 'BreadcrumbList'],
  contact: ['WebSite', 'Organization', 'ContactPage', 'BreadcrumbList'],
  partners: ['WebSite', 'Organization', 'CollectionPage', 'BreadcrumbList'],
  default: ['WebSite', 'Organization', 'WebPage', 'BreadcrumbList'],
};

/**
 * Mots-clés SEO par langue (pour vérification contenu)
 */
export const SEO_KEYWORDS_BY_LANG: Partial<Record<LangCode, string[]>> = {
  fr: ['prière', 'Dieu', 'Jésus', 'foi', 'bible', 'chrétien', 'saint-esprit', 'église', 'salut', 'grâce'],
  en: ['prayer', 'God', 'Jesus', 'faith', 'bible', 'christian', 'holy-spirit', 'church', 'salvation', 'grace'],
  es: ['oración', 'Dios', 'Jesús', 'fe', 'biblia', 'cristiano', 'espiritu-santo', 'iglesia', 'salvacion', 'gracia'],
  pt: ['oração', 'Deus', 'Jesus', 'fé', 'bíblia', 'cristão', 'espirito-santo', 'igreja', 'salvação', 'graça'],
  it: ['preghiera', 'Dio', 'Gesù', 'fede', 'bibbia', 'cristiano', 'spirito-santo', 'chiesa', 'salvezza', 'grazia'],
  de: ['gebet', 'Gott', 'Jesus', 'glaube', 'bibel', 'christlich', 'heiliger-geist', 'kirche', 'erlösung', 'gnade'],
  nl: ['gebed', 'God', 'Jezus', 'geloof', 'bijbel', 'christelijk', 'heilige-geest', 'kerk', 'verlossing', 'genade'],
  pl: ['modlitwa', 'Bóg', 'Jezus', 'wiara', 'biblija', 'chrześcijański', 'duch-święty', 'kościół', 'zbawienie', 'łaska'],
  ar: ['صلاة', 'الله', 'يسوع', 'إيمان', 'الكتاب المقدس', 'مسيحي', 'الروح القدس', 'كنيسة', 'خلاص', 'نعمة'],
  ru: ['молитва', 'Бог', 'Иисус', 'вера', 'библия', 'христианин', 'святой-дух', 'церковь', 'спасение', 'благодать'],
  zh: ['祷告', '神', '耶稣', '信仰', '圣经', '基督徒', '圣灵', '教会', '救恩', '恩典'],
  hi: ['प्रार्थना', 'परमेश्वर', 'यीशु', 'विश्वास', 'बाइबिल', 'मसीही', 'पवित्र-आत्मा', 'चर्च', 'उद्धार', 'अनुग्रह'],
};