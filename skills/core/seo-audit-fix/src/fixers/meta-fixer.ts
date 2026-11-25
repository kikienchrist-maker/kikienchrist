/**
 * Correcteur Meta Tags
 * Génère les corrections pour title, description, OG, Twitter, canonical
 */
import type { JSDOM } from 'jsdom';
import type { PageAuditResult, SEOFix } from '../types.js';

export function generateMetaFixes(result: PageAuditResult): SEOFix[] {
  const fixes: SEOFix[] = [];
  const meta = result.meta;
  const url = new URL(result.url);
  const lang = result.lang;
  
  // Title
  if (!meta.title.valid) {
    const expectedTitle = generateTitle(result);
    fixes.push({
      type: meta.title.present ? 'update' : 'add',
      category: 'meta',
      selector: 'title',
      currentValue: meta.title.value,
      newValue: expectedTitle,
      description: `Corriger title: ${meta.title.issues.join(', ')}`,
      autoFixable: true,
    });
  }
  
  // Description
  if (!meta.description.valid) {
    const expectedDesc = generateDescription(result);
    fixes.push({
      type: meta.description.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[name="description"]',
      currentValue: meta.description.value,
      newValue: expectedDesc,
      description: `Corriger description: ${meta.description.issues.join(', ')}`,
      autoFixable: true,
    });
  }
  
  // Canonical
  if (!meta.canonical.valid) {
    const expectedCanonical = generateCanonical(result);
    fixes.push({
      type: meta.canonical.present ? 'update' : 'add',
      category: 'meta',
      selector: 'link[rel="canonical"]',
      currentValue: meta.canonical.value,
      newValue: expectedCanonical,
      description: `Corriger canonical`,
      autoFixable: true,
    });
  }
  
  // OG Title
  if (!meta.ogTitle.valid) {
    const expectedOgTitle = generateTitle(result);
    fixes.push({
      type: meta.ogTitle.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[property="og:title"]',
      currentValue: meta.ogTitle.value,
      newValue: expectedOgTitle,
      description: `Corriger og:title`,
      autoFixable: true,
    });
  }
  
  // OG Description
  if (!meta.ogDescription.valid) {
    const expectedOgDesc = generateDescription(result);
    fixes.push({
      type: meta.ogDescription.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[property="og:description"]',
      currentValue: meta.ogDescription.value,
      newValue: expectedOgDesc,
      description: `Corriger og:description`,
      autoFixable: true,
    });
  }
  
  // OG Image
  if (!meta.ogImage.valid) {
    const expectedOgImage = generateOgImage(result);
    fixes.push({
      type: meta.ogImage.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[property="og:image"]',
      currentValue: meta.ogImage.value,
      newValue: expectedOgImage,
      description: `Corriger og:image`,
      autoFixable: true,
    });
  }
  
  // OG Type
  if (!meta.ogType.valid) {
    const expectedOgType = getOgType(result.url);
    fixes.push({
      type: meta.ogType.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[property="og:type"]',
      currentValue: meta.ogType.value,
      newValue: expectedOgType,
      description: `Corriger og:type`,
      autoFixable: true,
    });
  }
  
  // OG URL
  if (!meta.ogUrl.valid) {
    fixes.push({
      type: meta.ogUrl.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[property="og:url"]',
      currentValue: meta.ogUrl.value,
      newValue: result.url,
      description: `Corriger og:url`,
      autoFixable: true,
    });
  }
  
  // Twitter Card
  if (!meta.twitterCard.valid) {
    fixes.push({
      type: meta.twitterCard.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[name="twitter:card"]',
      currentValue: meta.twitterCard.value,
      newValue: 'summary_large_image',
      description: `Corriger twitter:card`,
      autoFixable: true,
    });
  }
  
  // Viewport
  if (!meta.viewport.valid) {
    fixes.push({
      type: meta.viewport.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[name="viewport"]',
      currentValue: meta.viewport.value,
      newValue: 'width=device-width, initial-scale=1',
      description: `Corriger viewport`,
      autoFixable: true,
    });
  }
  
  // Charset
  if (!meta.charset.valid) {
    fixes.push({
      type: meta.charset.present ? 'update' : 'add',
      category: 'meta',
      selector: 'meta[charset]',
      currentValue: meta.charset.value,
      newValue: 'UTF-8',
      description: `Corriger charset`,
      autoFixable: true,
    });
  }
  
  return fixes;
}

function generateTitle(result: PageAuditResult): string {
  // Priorité: H1 > ogTitle > title > fallback
  if (result.content.h1Text && result.content.h1Text.length <= 60) {
    return result.content.h1Text;
  }
  if (result.meta.ogTitle.value && result.meta.ogTitle.value.length <= 60) {
    return result.meta.ogTitle.value;
  }
  if (result.meta.title.value && result.meta.title.value.length <= 60) {
    return result.meta.title.value;
  }
  
  // Fallback selon type de page
  const pageType = getPageType(result.url);
  const siteName = 'Kiki en Christ';
  
  const fallbacks: Record<string, string> = {
    home: `${siteName} - Foi, Prière et Vie Chrétienne`,
    blogIndex: `Blog - Articles de Foi et Vie Chrétienne | ${siteName}`,
    blogPost: result.content.h1Text ? `${result.content.h1Text} | ${siteName}` : `Article | ${siteName}`,
    blogCategory: `Catégorie | ${siteName}`,
    legal: `Mentions Légales | ${siteName}`,
    book: `Livres Chrétiens | ${siteName}`,
    contact: `Contact | ${siteName}`,
    partners: `Partenaires | ${siteName}`,
    default: `${siteName} - Foi et Vie Chrétienne`,
  };
  
  return fallbacks[pageType] ?? fallbacks.default ?? `${siteName} - Foi et Vie Chrétienne`;
}

function generateDescription(result: PageAuditResult): string {
  // Si on a un og:description valide, l'utiliser
  if (result.meta.ogDescription.value && 
      result.meta.ogDescription.value.length >= 120 && 
      result.meta.ogDescription.value.length <= 160) {
    return result.meta.ogDescription.value;
  }
  
  // Fallback selon type de page
  const pageType = getPageType(result.url);
  
  const fallbacks: Record<string, string> = {
    home: 'Découvrez Kiki en Christ : ressources chrétiennes pour grandir dans la foi. Prière, études bibliques, livres, accompagnement spirituel. Rejoignez notre communauté.',
    blogIndex: 'Articles chrétiens sur la prière, la foi, la vie spirituelle. Études bibliques, témoignages, conseils pratiques pour votre marche avec Dieu.',
    blogPost: result.content.h1Text 
      ? `Article: ${result.content.h1Text}. Enseignements bibliques, prière, vie chrétienne pratique.`
      : 'Article chrétien sur la foi, la prière et la vie spirituelle. Enseignements bibliques et application pratique.',
    blogCategory: 'Articles de cette catégorie sur la vie chrétienne, la prière et la foi. Études bibliques et ressources spirituelles.',
    legal: 'Mentions légales, politique de confidentialité, conditions d\'utilisation et accessibilité de Kiki en Christ.',
    book: 'Découvrez nos livres chrétiens : prière, vie spirituelle, étude biblique. Ressources pour grandir dans la foi.',
    contact: 'Contactez l\'équipe Kiki en Christ. Questions, témoignages, partenariats, prière. Nous sommes là pour vous.',
    partners: 'Nos partenaires ministériels et associations chrétiennes. Ministères amis, organisations partenaires.',
    default: 'Ressources chrétiennes pour la prière, l\'étude biblique et la vie spirituelle. Kiki en Christ vous accompagne dans votre foi.',
  };
  
  return fallbacks[pageType] ?? fallbacks.default ?? 'Ressources chrétiennes pour la prière, l\'étude biblique et la vie spirituelle. Kiki en Christ vous accompagne dans votre foi.';
}

function generateCanonical(result: PageAuditResult): string {
  // Canonical = URL sans paramètres de tracking
  return result.url;
}

function generateOgImage(result: PageAuditResult): string {
  // Utiliser l'image existante si valide, sinon fallback
  if (result.meta.ogImage.value && isValidUrl(result.meta.ogImage.value)) {
    return result.meta.ogImage.value;
  }
  
  const pageType = getPageType(result.url);
  const baseUrl = 'https://kikienchrist.vercel.app';
  
  const images: Record<string, string> = {
    home: `${baseUrl}/og/home.png`,
    blogIndex: `${baseUrl}/og/blog-index.png`,
    blogPost: `${baseUrl}/og/blog/post.png`,
    blogCategory: `${baseUrl}/og/blog/category.png`,
    legal: `${baseUrl}/og/legal.png`,
    book: `${baseUrl}/og/books.png`,
    contact: `${baseUrl}/og/contact.png`,
    partners: `${baseUrl}/og/partners.png`,
    default: `${baseUrl}/og/default.png`,
  };
  
  return images[pageType] ?? images.default ?? `${baseUrl}/og/default.png`;
}

function getOgType(url: string): string {
  const pageType = getPageType(url);
  const types: Record<string, string> = {
    home: 'website',
    blogIndex: 'website',
    blogPost: 'article',
    blogCategory: 'website',
    legal: 'website',
    book: 'website',
    contact: 'website',
    partners: 'website',
    default: 'website',
  };
  return types[pageType] ?? types.default ?? 'website';
}

function getPageType(url: string): string {
  try {
    const parsed = new URL(url);
    // Normaliser: enlever trailing slash sauf pour la racine
    let path = parsed.pathname;
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    if (path === '/' || path === '') return 'home';
    // Page d'accueil par langue: /fr, /en, etc.
    if (path.match(/^\/[a-z-]+$/)) return 'home';
    if (path.match(/^\/[a-z-]+\/blog$/)) return 'blogIndex';
    if (path.match(/^\/[a-z-]+\/blog\/[^/]+$/)) return 'blogPost';
    if (path.match(/^\/[a-z-]+\/blog\/categorie\/[^/]+$/)) return 'blogCategory';
    if (path.match(/^\/[a-z-]+\/(mentions-legales|confidentialite|cookies|cgv|accessibilite)$/)) return 'legal';
    if (path.match(/^\/[a-z-]+\/livres\/[^/]+$/)) return 'book';
    if (path.match(/^\/[a-z-]+\/contact$/)) return 'contact';
    if (path.match(/^\/[a-z-]+\/partenaires$/)) return 'partners';
    
    return 'default';
  } catch {
    return 'default';
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}