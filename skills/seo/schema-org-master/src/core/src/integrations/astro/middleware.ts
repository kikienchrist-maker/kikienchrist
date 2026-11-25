// middleware.ts — Astro Middleware pour injection auto Schema.org (schema-org-master)
// Détection page-type + injection JSON-LD automatique

import type { APIContext } from 'astro';
import { injectSchemaOrg, generateSchemaOrgScript, type InjectorConfig } from '../../injector';
import { createContext } from '../../context';
import type { KikiLangCode, SupportedSchemaType } from '../../types';

// ============================================================================
// CONFIGURATION GLOBALE — À personnaliser par projet
// ============================================================================

export const defaultInjectorConfig: InjectorConfig = {
  autoTypes: ['WebSite', 'Organization', 'BreadcrumbList', 'FAQPage'],
  globalData: {
    website: {
      name: 'Kiki en Christ',
      url: 'https://kikienchrist.vercel.app',
      searchUrlTemplate: 'https://kikienchrist.vercel.app/{lang}/recherche?q={search_term_string}',
    },
    organization: {
      name: 'Kiki en Christ',
      url: 'https://kikienchrist.vercel.app',
      logo: 'https://kikienchrist.vercel.app/images/logo.png',
      sameAs: [
        'https://www.facebook.com/kikienchrist',
        'https://twitter.com/kikienchrist',
        'https://www.instagram.com/kikienchrist',
        'https://www.youtube.com/@kikienchrist',
      ],
      email: 'kikienchrist@gmail.com',
    },
  },
  defaultLang: 'fr',
  injectInHead: true,
  pretty: true,
};

// ============================================================================
// DÉTECTION PAGE-TYPE — Depuis URL et données page
// ============================================================================

export interface PageTypeInfo {
  pageType: 'home' | 'book' | 'article' | 'category' | 'legal' | 'search' | '404' | 'livres' | 'blog' | 'contact' | 'a-propos';
  lang: KikiLangCode;
  bookNumber?: 1 | 2 | 3 | 4;
  articleSlug?: string;
  categorySlug?: string;
  legalPage?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  canonicalUrl?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  faq?: Array<{ question: string; answer: string }>;
  bookData?: SupportedSchemaType;
  articleData?: SupportedSchemaType;
}

/**
 * Détecte le type de page depuis l'URL et les données Astro
 */
export function detectPageType(context: APIContext): PageTypeInfo {
  const { url, params, locals, props } = context;
  const pathname = url.pathname;
  
  // Extraire langue depuis URL (/fr/, /en/, etc.) ou cookie
  const langMatch = pathname.match(/^\/(fr|en|es|pt|de|it|nl|pl|ar|ru|zh|hi)(\/|$)/);
  const lang = (langMatch?.[1] as KikiLangCode) || 'fr';
  
  // Nettoyer le pathname sans la langue
  const pathWithoutLang = pathname.replace(/^\/(fr|en|es|pt|de|it|nl|pl|ar|ru|zh|hi)/, '') || '/';
  
  // Détecter page-type
  let pageType: PageTypeInfo['pageType'] = '404';
  let bookNumber: PageTypeInfo['bookNumber'] = undefined;
  let articleSlug: PageTypeInfo['articleSlug'] = undefined;
  let categorySlug: PageTypeInfo['categorySlug'] = undefined;
  let legalPage: PageTypeInfo['legalPage'] = undefined;
  
  // Accueil
  if (pathWithoutLang === '/' || pathWithoutLang === '') {
    pageType = 'home';
  }
  // Page livres (listing)
  else if (pathWithoutLang === '/livres/' || pathWithoutLang === '/livres') {
    pageType = 'livres';
  }
  // Livre individuel
  else if (pathWithoutLang.match(/^\/livre\/(\d+)/)) {
    pageType = 'book';
    const match = pathWithoutLang.match(/^\/livre\/(\d+)/);
    bookNumber = parseInt(match![1]) as 1 | 2 | 3 | 4;
  }
  // Blog index
  else if (pathWithoutLang === '/blog/' || pathWithoutLang === '/blog') {
    pageType = 'blog';
  }
  // Article blog
  else if (pathWithoutLang.match(/^\/blog\/[^/]+\/?$/)) {
    pageType = 'article';
    articleSlug = pathWithoutLang.replace(/^\/blog\/([^/]+)\/?$/, '$1');
  }
  // Catégorie blog
  else if (pathWithoutLang.match(/^\/blog\/categorie\/[^/]+\/?$/)) {
    pageType = 'category';
    categorySlug = pathWithoutLang.replace(/^\/blog\/categorie\/([^/]+)\/?$/, '$1');
  }
  // Pages légales
  else if (pathWithoutLang.match(/^\/(mentions-legales|confidentialite|cookies|cgv|accessibilite)\/?$/)) {
    pageType = 'legal';
    legalPage = pathWithoutLang.replace(/^\/(.+?)\/?$/, '$1');
  }
  // Recherche
  else if (pathWithoutLang.startsWith('/recherche')) {
    pageType = 'search';
  }
  // Contact
  else if (pathWithoutLang === '/contact/' || pathWithoutLang === '/contact') {
    pageType = 'contact';
  }
  // À propos
  else if (pathWithoutLang === '/a-propos/' || pathWithoutLang === '/a-propos') {
    pageType = 'a-propos';
  }
  
  // Construire breadcrumbs
  const breadcrumbs = buildBreadcrumbs(pathWithoutLang, lang, pageType);
  
  // URL canonique
  const canonicalUrl = `https://kikienchrist.vercel.app${pathname}`;
  
  // Données depuis props/locals (définies dans les pages)
  const pageProps = (locals as any).pageData || props || {};
  
  return {
    pageType,
    lang,
    bookNumber,
    articleSlug,
    categorySlug,
    legalPage,
    breadcrumbs,
    canonicalUrl,
    title: pageProps.title,
    description: pageProps.description,
    ogImage: pageProps.ogImage,
    faq: pageProps.faq,
    bookData: pageProps.bookData,
    articleData: pageProps.articleData,
  };
}

/**
 * Construit les breadcrumbs depuis le chemin
 */
export function buildBreadcrumbs(path: string, lang: KikiLangCode, pageType: PageTypeInfo['pageType']): Array<{ name: string; url: string }> {
  const base = `https://kikienchrist.vercel.app/${lang}`;
  const crumbs: Array<{ name: string; url: string }> = [
    { name: getHomeLabel(lang), url: base },
  ];
  
  if (path === '/' || path === '') return crumbs;
  
  const segments = path.split('/').filter(Boolean);
  
  if (segments[0] === 'livres' || segments[0] === 'livre') {
    crumbs.push({ name: getLivresLabel(lang), url: `${base}/livres/` });
    if (segments[1] && (pageType === 'book' || segments[0] === 'livre')) {
      const bookLabels = {
        fr: ['Le visage de Dieu', 'La Trinité', 'Le dernier Combat', 'Le mystère du Salut'],
        en: ['The Face of God', 'The Trinity', 'The Last Battle', 'The Mystery of Salvation'],
        es: ['El rostro de Dios', 'La Trinidad', 'La última Batalla', 'El misterio de la Salvación'],
        pt: ['O rosto de Deus', 'A Trindade', 'A última Batalha', 'O mistério da Salvação'],
        de: ['Das Antlitz Gottes', 'Die Trinität', 'Der letzte Kampf', 'Das Geheimnis der Erlösung'],
        it: ['Il volto di Dio', 'La Trinità', 'L\'ultima Battaglia', 'Il mistero della Salvezza'],
        nl: ['Het gezicht van God', 'De Drie-eenheid', 'De laatste Strijd', 'Het mysterie van de Verlossing'],
        pl: ['Oblicze Boga', 'Trójca Święta', 'Ostatnia Bitwa', 'Tajemnica Zbawienia'],
        ar: ['وجه الله', 'الثالوث', 'المعركة الأخيرة', 'سر الخلاص'],
        ru: ['Лик Бога', 'Троица', 'Последняя битва', 'Тайна спасения'],
        zh: ['神的面容', '三位一体', '最后的战斗', '救恩的奥秘'],
        hi: ['भगवान का चेहरा', 'त्रिमूर्ति', 'अंतिम लड़ाई', 'मोक्ष का रहस्य'],
      };
      const labels = bookLabels[lang] || bookLabels.fr;
      crumbs.push({ name: labels[parseInt(segments[1]) - 1] || `Livre ${segments[1]}`, url: '' });
    }
  } else if (segments[0] === 'blog') {
    crumbs.push({ name: getBlogLabel(lang), url: `${base}/blog/` });
    if (segments[1] === 'categorie' && segments[2]) {
      crumbs.push({ name: decodeURIComponent(segments[2]).replace(/-/g, ' '), url: '' });
    } else if (segments[1] && pageType === 'article') {
      crumbs.push({ name: decodeURIComponent(segments[1]).replace(/-/g, ' '), url: '' });
    }
  } else if (segments[0] === 'mentions-legales') {
    crumbs.push({ name: getLegalLabel(lang, 'mentions-legales'), url: '' });
  } else if (segments[0] === 'confidentialite') {
    crumbs.push({ name: getLegalLabel(lang, 'confidentialite'), url: '' });
  } else if (segments[0] === 'cookies') {
    crumbs.push({ name: getLegalLabel(lang, 'cookies'), url: '' });
  } else if (segments[0] === 'cgv') {
    crumbs.push({ name: getLegalLabel(lang, 'cgv'), url: '' });
  } else if (segments[0] === 'accessibilite') {
    crumbs.push({ name: getLegalLabel(lang, 'accessibilite'), url: '' });
  }
  
  return crumbs;
}

// Labels i18n pour breadcrumbs
function getHomeLabel(lang: KikiLangCode): string {
  const labels: Record<KikiLangCode, string> = {
    fr: 'Accueil', en: 'Home', es: 'Inicio', pt: 'Início',
    de: 'Startseite', it: 'Home', nl: 'Home', pl: 'Strona główna',
    ar: 'الرئيسية', ru: 'Главная', zh: '首页', hi: 'होम',
  };
  return labels[lang] || labels.fr;
}

function getLivresLabel(lang: KikiLangCode): string {
  const labels: Record<KikiLangCode, string> = {
    fr: 'Nos livres', en: 'Our Books', es: 'Nuestros libros', pt: 'Nossos livros',
    de: 'Unsere Bücher', it: 'I nostri libri', nl: 'Onze boeken', pl: 'Nasze książki',
    ar: 'كتبنا', ru: 'Наши книги', zh: '我们的书', hi: 'हमारी किताबें',
  };
  return labels[lang] || labels.fr;
}

function getBlogLabel(lang: KikiLangCode): string {
  const labels: Record<KikiLangCode, string> = {
    fr: 'Blog', en: 'Blog', es: 'Blog', pt: 'Blog',
    de: 'Blog', it: 'Blog', nl: 'Blog', pl: 'Blog',
    ar: 'مدونة', ru: 'Блог', zh: '博客', hi: 'ब्लॉग',
  };
  return labels[lang] || labels.fr;
}

function getLegalLabel(lang: KikiLangCode, page: string): string {
  const labels: Record<string, Record<KikiLangCode, string>> = {
    'mentions-legales': { fr: 'Mentions légales', en: 'Legal Notice', es: 'Aviso legal', pt: 'Aviso legal', de: 'Impressum', it: 'Note legali', nl: 'Juridische kennisgeving', pl: 'Informacje prawne', ar: 'إشعار قانوني', ru: 'Юридическое уведомление', zh: '法律声明', hi: 'कानूनी नोटिस' },
    'confidentialite': { fr: 'Confidentialité', en: 'Privacy', es: 'Privacidad', pt: 'Privacidade', de: 'Datenschutz', it: 'Privacy', nl: 'Privacy', pl: 'Prywatność', ar: 'الخصوصية', ru: 'Конфиденциальность', zh: '隐私', hi: 'गोपनीयता' },
    'cookies': { fr: 'Cookies', en: 'Cookies', es: 'Cookies', pt: 'Cookies', de: 'Cookies', it: 'Cookie', nl: 'Cookies', pl: 'Pliki cookie', ar: 'ملفات تعريف الارتباط', ru: 'Cookie', zh: 'Cookie', hi: 'कुकीज़' },
    'cgv': { fr: 'CGV', en: 'Terms', es: 'Términos', pt: 'Termos', de: 'AGB', it: 'Termini', nl: 'Voorwaarden', pl: 'Regulamin', ar: 'الشروط', ru: 'Условия', zh: '条款', hi: 'शर्तें' },
    'accessibilite': { fr: 'Accessibilité', en: 'Accessibility', es: 'Accesibilidad', pt: 'Acessibilidade', de: 'Barrierefreiheit', it: 'Accessibilità', nl: 'Toegankelijkheid', pl: 'Dostępność', ar: 'إمكانية الوصول', ru: 'Доступность', zh: '无障碍', hi: 'सुलभता' },
  };
  return labels[page]?.[lang] || labels[page]?.fr || page;
}

// ============================================================================
// EXTRACTION FAQ DEPUIS HTML — Pour pages légales
// ============================================================================

/**
 * Extrait les paires Q/R depuis le HTML rendu (pour FAQPage)
 * À appeler après le rendu de la page
 */
export function extractFAQFromHTML(html: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  
  // Pattern 1: <details><summary>Question</summary>Réponse</details>
  const detailsRegex = /<details[^>]*>\s*<summary[^>]*>([^<]+)<\/summary>\s*([\s\S]*?)<\/details>/gi;
  let match;
  while ((match = detailsRegex.exec(html)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  
  // Pattern 2: <h3>Question</h3><p>Réponse</p> (structure FAQ classique)
  const h3Regex = /<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  while ((match = h3Regex.exec(html)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (question && answer && !faqs.some(f => f.question === question)) {
      faqs.push({ question, answer });
    }
  }
  
  // Pattern 3: data-faq-question / data-faq-answer attributes
  const attrRegex = /<[^>]+data-faq-question="([^"]+)"[^>]*>[\s\S]*?<[^>]+data-faq-answer="([^"]+)"[^>]*>/gi;
  while ((match = attrRegex.exec(html)) !== null) {
    faqs.push({ question: match[1].trim(), answer: match[2].trim() });
  }
  
  return faqs;
}

// ============================================================================
// EXTRACTION BREADCRUMBS DEPUIS HTML
// ============================================================================

/**
 * Extrait les breadcrumbs depuis le HTML (nav[aria-label="breadcrumb"] ou .breadcrumb)
 */
export function extractBreadcrumbsFromHTML(html: string): Array<{ name: string; url: string }> {
  const crumbs: Array<{ name: string; url: string }> = [];
  
  // Pattern: <nav aria-label="breadcrumb"><ol><li><a href="...">Name</a></li>...</ol></nav>
  const navRegex = /<nav[^>]*aria-label=["']breadcrumb["'][^>]*>([\s\S]*?)<\/nav>/i;
  const navMatch = html.match(navRegex);
  if (navMatch) {
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(navMatch[1])) !== null) {
      const aMatch = liMatch[1].match(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i);
      if (aMatch) {
        crumbs.push({ name: aMatch[2].trim(), url: aMatch[1] });
      } else {
        // Dernier élément sans lien
        const spanMatch = liMatch[1].match(/<span[^>]*>([^<]+)<\/span>/i);
        if (spanMatch) {
          crumbs.push({ name: spanMatch[1].trim(), url: '' });
        }
      }
    }
  }
  
  return crumbs;
}

// ============================================================================
// MIDDLEWARE ASTRO PRINCIPAL
// ============================================================================

/**
 * Middleware Astro pour injection automatique Schema.org
 * Utilisation dans astro.config.mjs:
 *   import { schemaOrgMiddleware } from './skills/seo/schema-org-master/src/core/integrations/astro/middleware';
 *   export const onRequest = schemaOrgMiddleware;
 */
export async function schemaOrgMiddleware(context: APIContext, next: () => Promise<Response>) {
  const pageInfo = detectPageType(context);
  
  // Config par défaut + overrides depuis locals
  const config: InjectorConfig = {
    ...defaultInjectorConfig,
    ...(context.locals.schemaOrgConfig || {}),
    defaultLang: pageInfo.lang,
  };
  
  // Données page pour injection
  const pageData = {
    pageType: pageInfo.pageType,
    lang: pageInfo.lang,
    canonicalUrl: pageInfo.canonicalUrl,
    title: pageInfo.title,
    description: pageInfo.description,
    ogImage: pageInfo.ogImage,
    breadcrumbs: pageInfo.breadcrumbs,
    faq: pageInfo.faq,
    book: pageInfo.bookData,
    article: pageInfo.articleData,
  };
  
  // Générer script JSON-LD
  const script = generateSchemaOrgScript(pageData, config);
  
  // Stocker dans locals pour accès dans les layouts/pages
  context.locals.schemaOrgScript = script;
  context.locals.schemaOrgData = pageData;
  context.locals.schemaOrgConfig = config;
  
  // Continuer le rendu
  const response = await next();
  
  // Optionnel: Injecter dans le HTML final (si pas fait via composant)
  // Décommenter si injection via middleware souhaitée:
  /*
  const html = await response.text();
  const injectedHtml = injectIntoHTML(html, script, config.injectInHead);
  return new Response(injectedHtml, {
    status: response.status,
    headers: response.headers,
  });
  */
  
  return response;
}

/**
 * Injecte le script JSON-LD dans le HTML (fallback si pas de composant)
 */
function injectIntoHTML(html: string, script: string, inHead: boolean = true): string {
  if (inHead) {
    const headEnd = html.indexOf('</head>');
    if (headEnd !== -1) {
      return html.slice(0, headEnd) + script + html.slice(headEnd);
    }
  }
  // Fallback: dans body
  const bodyEnd = html.indexOf('</body>');
  if (bodyEnd !== -1) {
    return html.slice(0, bodyEnd) + script + html.slice(bodyEnd);
  }
  return html + script;
}

// ============================================================================
// HELPER POUR PAGES — Utilisation dans .astro pages
// ============================================================================

/**
 * Helper à utiliser dans les pages Astro pour définir les données Schema.org
 * Exemple dans /src/pages/[lang]/livre/[id].astro:
 * ---
 * import { definePageSchemaOrg } from '@kikienchrist/schema-org-master/integrations/astro/middleware';
 * definePageSchemaOrg(Astro, { pageType: 'book', bookNumber: 1 });
 * ---
 */
export function definePageSchemaOrg(
  context: APIContext,
  overrides: Partial<PageTypeInfo>
): void {
  const pageInfo = detectPageType(context);
  const merged = { ...pageInfo, ...overrides };
  
  context.locals.pageData = {
    title: merged.title,
    description: merged.description,
    ogImage: merged.ogImage,
    faq: merged.faq,
    bookData: merged.bookData,
    articleData: merged.articleData,
  };
}