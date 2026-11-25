// injector/index.ts — Astro Injector (schema-org-master)
// Injection automatique JSON-LD dans <head> + <body> avec slots override

import type { JsonLdObject, SupportedSchemaType, KikiLangCode } from '../types';
import { mergeJsonLdGraphs, stringifyJsonLd, createContext } from '../context';

// ============================================================================
// INJECTOR CORE — Logique pure (framework-agnostic)
// ============================================================================

/**
 * Configuration d'injection
 */
export interface InjectorConfig {
  /** Types à injecter automatiquement depuis les données */
  autoTypes?: ('WebSite' | 'Organization' | 'BreadcrumbList' | 'FAQPage')[];
  /** Données globales (site, org) */
  globalData?: {
    website?: { name: string; url: string; searchUrlTemplate?: string };
    organization?: { name: string; url: string; logo?: string; sameAs?: string[]; email?: string };
  };
  /** Langue par défaut */
  defaultLang?: KikiLangCode;
  /** Injecter dans head (true) ou body (false) */
  injectInHead?: boolean;
  /** Pretty print JSON-LD */
  pretty?: boolean;
}

/**
 * Résultat d'injection
 */
export interface InjectionResult {
  /** Script tag HTML complet */
  html: string;
  /** Objet JSON-LD injecté */
  jsonLd: JsonLdObject;
  /** Types injectés */
  types: string[];
}

/**
 * Injecte les schémas de base (WebSite, Organization, BreadcrumbList)
 * @param pageData Données spécifiques à la page
 * @param config Configuration globale
 * @returns InjectionResult avec HTML prêt à insérer
 */
export function injectSchemaOrg(
  pageData: {
    /** Type de page pour auto-génération */
    pageType?: 'home' | 'book' | 'article' | 'category' | 'legal' | 'search' | '404';
    /** Livre (si pageType === 'book') */
    book?: SupportedSchemaType;
    /** Article (si pageType === 'article') */
    article?: SupportedSchemaType;
    /** Breadcrumbs items */
    breadcrumbs?: Array<{ name: string; url: string }>;
    /** FAQ questions (si pageType === 'legal' ou FAQ) */
    faq?: Array<{ question: string; answer: string }>;
    /** Langue de la page */
    lang?: KikiLangCode;
    /** URL canonique */
    canonicalUrl?: string;
    /** Titre page */
    title?: string;
    /** Description page */
    description?: string;
    /** Image OG */
    ogImage?: string;
  },
  config: InjectorConfig = {}
): InjectionResult {
  const {
    autoTypes = ['WebSite', 'Organization', 'BreadcrumbList'],
    globalData = {},
    defaultLang = 'fr',
    injectInHead = true,
    pretty = true,
  } = config;

  const lang = pageData.lang || defaultLang;
  const context = createContext(lang);
  const schemas: SupportedSchemaType[] = [];
  const injectedTypes: string[] = [];

  // 1. WebSite (toujours si activé)
  if (autoTypes.includes('WebSite') && globalData.website) {
    const ws = buildWebSite(globalData.website, lang, pageData.canonicalUrl);
    schemas.push(ws);
    injectedTypes.push('WebSite');
  }

  // 2. Organization (toujours si activé)
  if (autoTypes.includes('Organization') && globalData.organization) {
    const org = buildOrganization(globalData.organization);
    schemas.push(org);
    injectedTypes.push('Organization');
  }

  // 3. BreadcrumbList (si données fournies)
  if (autoTypes.includes('BreadcrumbList') && pageData.breadcrumbs && pageData.breadcrumbs.length > 0) {
    const bc = buildBreadcrumbList(pageData.breadcrumbs);
    schemas.push(bc);
    injectedTypes.push('BreadcrumbList');
  }

  // 4. FAQPage (si page legal ou FAQ explicite)
  if (autoTypes.includes('FAQPage') && pageData.faq && pageData.faq.length > 0) {
    const faq = buildFAQPage(pageData.faq, pageData.pageType === 'legal' ? 'legal' : 'manual');
    schemas.push(faq);
    injectedTypes.push('FAQPage');
  }

  // 5. Page-specific schema (Book, Article, etc.)
  if (pageData.pageType === 'book' && pageData.book) {
    schemas.push(pageData.book as SupportedSchemaType);
    injectedTypes.push('Book');
  }
  if (pageData.pageType === 'article' && pageData.article) {
    schemas.push(pageData.article as SupportedSchemaType);
    injectedTypes.push('Article');
  }

  // Merge tout en un @graph dédupliqué
  const merged = mergeJsonLdGraphs(
    { '@context': context, '@graph': schemas },
  );

  // Sérialiser
  const jsonLdString = stringifyJsonLd(merged, { pretty, context });

  // HTML script tag
  const html = `<script type="application/ld+json">${jsonLdString}</script>`;

  return { html, jsonLd: merged, types: injectedTypes };
}

// ============================================================================
// BUILDERS INTERNES — Schémas de base auto-générés
// ============================================================================

function buildWebSite(
  data: { name: string; url: string; searchUrlTemplate?: string },
  lang: string,
  canonicalUrl?: string
): SupportedSchemaType {
  return {
    '@type': 'WebSite',
    '@id': `${data.url}#website`,
    name: data.name,
    url: data.url,
    inLanguage: lang,
    potentialAction: data.searchUrlTemplate ? {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.searchUrlTemplate,
      },
      queryInput: 'required name=search_term_string',
    } : undefined,
  };
}

function buildOrganization(data: {
  name: string; url: string; logo?: string; sameAs?: string[]; email?: string;
}): SupportedSchemaType {
  return {
    '@type': 'Organization',
    '@id': `${data.url}#organization`,
    name: data.name,
    url: data.url,
    logo: data.logo,
    sameAs: data.sameAs,
    email: data.email,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '', // à remplir si dispo
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Spanish', 'Portuguese', 'Italian', 'German', 'Dutch', 'Polish', 'Arabic', 'Russian', 'Chinese', 'Hindi'],
    },
  };
}

function buildBreadcrumbList(items: Array<{ name: string; url: string }>): SupportedSchemaType {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url || 'https://kikienchrist.vercel.app'}#breadcrumb`,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@id': item.url,
        name: item.name,
      },
    })),
  };
}

function buildFAQPage(
  faqs: Array<{ question: string; answer: string }>,
  source: 'legal' | 'blog' | 'manual' = 'manual'
): SupportedSchemaType {
  return {
    '@type': 'FAQPage',
    '@id': `https://kikienchrist.vercel.app#faq-${source}`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
    kikiSource: source,
    kikiDetectedQuestions: faqs.length,
  };
}

// ============================================================================
// HTML INJECTION UTILITY — Injection basique dans HTML string
// ============================================================================

/**
 * Injecte un script tag dans le HTML (utilitaire simple pour middleware/SSG)
 * @param html HTML complet
 * @param scriptTag Script tag à injecter (ex: `<script type="application/ld+json">...</script>`)
 * @param inHead Si true, injecte avant </head>, sinon avant </body>, sinon à la fin
 * @returns HTML avec script injecté
 */
export function injectIntoHTML(html: string, scriptTag: string, inHead: boolean = true): string {
  if (inHead) {
    const headEnd = html.indexOf('</head>');
    if (headEnd !== -1) {
      return html.slice(0, headEnd) + scriptTag + html.slice(headEnd);
    }
  }
  const bodyEnd = html.indexOf('</body>');
  if (bodyEnd !== -1) {
    return html.slice(0, bodyEnd) + scriptTag + html.slice(bodyEnd);
  }
  return html + scriptTag;
}

// ============================================================================
// EXTRACTORS — Détection auto depuis contenu HTML/Markdown
// ============================================================================

/**
 * Extrait FAQ depuis HTML (recherche dt/dd, h2+p, dl, etc.)
 */
export function extractFAQFromHTML(html: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  // Pattern 1: <dl><dt>Q</dt><dd>A</dd></dl>
  const dlMatches = html.match(/<dl[^>]*>([\s\S]*?)<\/dl>/gi);
  if (dlMatches) {
    for (const dl of dlMatches) {
      const dtMatches = dl.match(/<dt[^>]*>([\s\S]*?)<\/dt>/gi);
      const ddMatches = dl.match(/<dd[^>]*>([\s\S]*?)<\/dd>/gi);
      if (dtMatches && ddMatches && dtMatches.length === ddMatches.length) {
        for (let i = 0; i < dtMatches.length; i++) {
          const q = stripTags(dtMatches[i]).trim();
          const a = stripTags(ddMatches[i]).trim();
          if (q && a) faqs.push({ question: q, answer: a });
        }
      }
    }
  }

  // Pattern 2: <h2>Q</h2><p>A</p> (fréquent dans pages legal)
  const h2Pattern = /<h2[^>]*>([\s\S]*?)<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = h2Pattern.exec(html)) !== null) {
    const q = stripTags(match[1]).trim();
    const a = stripTags(match[2]).trim();
    if (q && a && q.length < 200 && a.length < 2000) {
      faqs.push({ question: q, answer: a });
    }
  }

  // Pattern 3: <details><summary>Q</summary>A</details>
  const detailsPattern = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi;
  while ((match = detailsPattern.exec(html)) !== null) {
    const q = stripTags(match[1]).trim();
    const a = stripTags(match[2]).trim();
    if (q && a) faqs.push({ question: q, answer: a });
  }

  return faqs;
}

/**
 * Extrait breadcrumbs depuis navigation HTML
 */
export function extractBreadcrumbsFromHTML(html: string, baseUrl: string): Array<{ name: string; url: string }> {
  const breadcrumbs: Array<{ name: string; url: string }> = [];

  // Pattern: nav[aria-label="breadcrumb"] ou .breadcrumb
  const navMatch = html.match(/<nav[^>]*aria-label=["']breadcrumb["'][^>]*>([\s\S]*?)<\/nav>/i)
    || html.match(/<nav[^>]*class=["'][^"']*breadcrumb[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)
    || html.match(/<ol[^>]*class=["'][^"']*breadcrumb[^"']*["'][^>]*>([\s\S]*?)<\/ol>/i);

  if (navMatch) {
    const navHtml = navMatch[1];
    const linkMatches = navHtml.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
    if (linkMatches) {
      for (const link of linkMatches) {
        const hrefMatch = link.match(/href=["']([^"']+)["']/);
        const textMatch = link.match(/>([\s\S]*?)<\/a>/);
        if (hrefMatch && textMatch) {
          const url = hrefMatch[1].startsWith('http') ? hrefMatch[1] : new URL(hrefMatch[1], baseUrl).href;
          const name = stripTags(textMatch[1]).trim();
          if (name) breadcrumbs.push({ name, url });
        }
      }
    }
  }

  return breadcrumbs;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// ============================================================================
// ASTRO INTEGRATION HELPER — Pour composant .astro
// ============================================================================

/**
 * Génère le script tag pour composant Astro SchemaOrg.astro
 * Utilisé côté serveur au build
 */
export function generateSchemaOrgScript(
  pageData: Parameters<typeof injectSchemaOrg>[0],
  config: InjectorConfig = {}
): string {
  const result = injectSchemaOrg(pageData, config);
  return result.html;
}