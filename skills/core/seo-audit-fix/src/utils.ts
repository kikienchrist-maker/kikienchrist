/**
 * Utilitaires pour SEO Audit
 */
import { JSDOM } from 'jsdom';
import axios from 'axios';
import type { SEOConfig, LangCode, PageAuditResult } from './types.js';
import { DEFAULT_CONFIG } from './config.js';

/**
 * Normalise une URL
 */
export function normalizeUrl(url: string, baseUrl: string): string {
  try {
    const parsed = new URL(url, baseUrl);
    // Retirer hash et query params de tracking
    parsed.hash = '';
    // Conserver seulement params utiles (lang, page, category)
    const allowedParams = ['lang', 'page', 'category', 'tag'];
    for (const [key] of parsed.searchParams) {
      if (!allowedParams.includes(key)) {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Extrait le code langue depuis l'URL
 */
export function extractLangFromUrl(url: string, supportedLangs: LangCode[]): LangCode | null {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && supportedLangs.includes(pathParts[0] as LangCode)) {
      return pathParts[0] as LangCode;
    }
    // Chercher dans query params
    const langParam = parsed.searchParams.get('lang');
    if (langParam && supportedLangs.includes(langParam as LangCode)) {
      return langParam as LangCode;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Récupère le HTML d'une page
 */
export async function fetchPageHtml(url: string, config: Partial<SEOConfig> = {}): Promise<{ html: string; statusCode: number; loadTimeMs: number }> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const startTime = Date.now();
  
  try {
    const response = await axios.get(url, {
      timeout: mergedConfig.requestTimeoutMs,
      headers: { 'User-Agent': mergedConfig.userAgent },
      validateStatus: () => true, // Accepter tous les codes
    });
    
    return {
      html: response.data,
      statusCode: response.status,
      loadTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      html: '',
      statusCode: 0,
      loadTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Parse HTML avec JSDOM
 */
export function parseHtml(html: string): JSDOM {
  return new JSDOM(html, {
    contentType: 'text/html',
    includeNodeLocations: true,
    pretendToBeVisual: true,
  });
}

/**
 * Sélectionne un élément
 */
export function querySelector(dom: JSDOM, selector: string): Element | null {
  return dom.window.document.querySelector(selector);
}

/**
 * Sélectionne tous les éléments
 */
export function querySelectorAll(dom: JSDOM, selector: string): Element[] {
  return Array.from(dom.window.document.querySelectorAll(selector));
}

/**
 * Obtient le contenu d'un meta tag
 */
export function getMetaContent(dom: JSDOM, name: string, property = false): string | null {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const el = querySelector(dom, selector);
  return el?.getAttribute('content') || null;
}

/**
 * Obtient tous les hreflang
 */
export function getHreflangTags(dom: JSDOM): { hreflang: string; href: string }[] {
  const links = querySelectorAll(dom, 'link[rel="alternate"][hreflang]');
  return links.map(link => ({
    hreflang: link.getAttribute('hreflang') || '',
    href: link.getAttribute('href') || '',
  }));
}

/**
 * Obtient tous les scripts JSON-LD
 */
export function getJsonLdScripts(dom: JSDOM): any[] {
  const scripts = querySelectorAll(dom, 'script[type="application/ld+json"]');
  const results: any[] = [];
  
  for (const script of scripts) {
    try {
      const content = script.textContent?.trim();
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          results.push(...parsed);
        } else {
          results.push(parsed);
        }
      }
    } catch {
      // Ignorer JSON invalide
    }
  }
  
  return results;
}

/**
 * Obtient le titre de la page
 */
export function getTitle(dom: JSDOM): string | null {
  const titleEl = querySelector(dom, 'title');
  return titleEl?.textContent?.trim() || null;
}

/**
 * Obtient le H1 principal
 */
export function getH1(dom: JSDOM): { count: number; text: string | null } {
  const h1s = querySelectorAll(dom, 'h1');
  return {
    count: h1s.length,
    text: h1s[0]?.textContent?.trim() || null,
  };
}

/**
 * Obtient toutes les images
 */
export function getImages(dom: JSDOM): { src: string; alt: string | null }[] {
  const imgs = querySelectorAll(dom, 'img');
  return imgs.map(img => ({
    src: img.getAttribute('src') || '',
    alt: img.getAttribute('alt'),
  }));
}

/**
 * Obtient tous les liens
 */
export function getLinks(dom: JSDOM, baseUrl: string): { url: string; anchorText: string | null }[] {
  const links = querySelectorAll(dom, 'a[href]');
  return links.map(link => {
    const href = link.getAttribute('href') || '';
    const absolute = normalizeUrl(href, baseUrl);
    return {
      url: absolute,
      anchorText: link.textContent?.trim() || null,
    };
  });
}

/**
 * Vérifie si une URL est interne
 */
export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    const parsed = new URL(url, baseUrl);
    const baseParsed = new URL(baseUrl);
    return parsed.hostname === baseParsed.hostname;
  } catch {
    return false;
  }
}

/**
 * Calcule un score pondéré
 */
export function calculateScore(results: { valid: boolean; weight: number }[]): number {
  const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
  const earnedWeight = results.filter(r => r.valid).reduce((sum, r) => sum + r.weight, 0);
  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

/**
 * Détermine le type de page depuis l'URL
 */
export function getPageType(url: string): string {
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
    if (path.match(/^\/[a-z-]+\/livres\/[^/]+\/?$/)) return 'book';
    if (path.match(/^\/[a-z-]+\/contact\/?$/)) return 'contact';
    if (path.match(/^\/[a-z-]+\/partenaires\/?$/)) return 'partners';
    
    return 'default';
  } catch {
    return 'default';
  }
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Chunk array
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}