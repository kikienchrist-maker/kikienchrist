/**
 * Auditeur Hreflang
 */
import type { JSDOM } from 'jsdom';
import type { PageAuditResult, HreflangAuditResult, HreflangTag, SEOIssue, LangCode } from '../types.js';
import { getHreflangTags } from '../utils.js';
import { DEFAULT_CONFIG } from '../config.js';

export function auditHreflang(dom: JSDOM, url: string, lang: LangCode, result: PageAuditResult): HreflangAuditResult {
  const tags = getHreflangTags(dom);
  const issues: SEOIssue[] = [];
  const fixes: any[] = [];
  
  const present = tags.length > 0;
  let bidirectional = true;
  let hasXDefault = false;
  const missingLangs: LangCode[] = [];
  const tagIssues: string[] = [];
  
  // Analyser chaque tag
  const validatedTags: HreflangTag[] = tags.map(tag => {
    const valid = validateHreflangTag(tag, url, lang);
    if (!valid) {
      tagIssues.push(`Hreflang invalide: ${tag.hreflang} -> ${tag.href}`);
    }
    return { ...tag, valid };
  });
  
  // Vérifier x-default
  hasXDefault = validatedTags.some(t => t.hreflang === 'x-default');
  if (!hasXDefault) {
    tagIssues.push('x-default manquant (requis pour SEO international)');
  }
  
  // Vérifier bidirectionnel (chaque langue doit pointer vers cette page)
  const currentUrlNormalized = normalizeUrlForComparison(url);
  for (const tag of validatedTags) {
    if (tag.hreflang !== 'x-default') {
      const tagUrlNormalized = normalizeUrlForComparison(tag.href);
      // Pour bidirectionnel, on vérifie que l'URL correspond au pattern attendu
      if (!tagUrlNormalized.includes(`/${tag.hreflang}/`)) {
        bidirectional = false;
        tagIssues.push(`Hreflang ${tag.hreflang} ne pointe pas vers la bonne langue: ${tag.href}`);
      }
    }
  }
  
  // Vérifier langues manquantes (basé sur config)
  const expectedLangs = DEFAULT_CONFIG.supportedLangs.filter(l => l !== 'x-default');
  for (const expectedLang of expectedLangs) {
    if (!validatedTags.some(t => t.hreflang === expectedLang)) {
      missingLangs.push(expectedLang);
    }
  }
  
  // Générer fixes pour tags manquants
  if (missingLangs.length > 0) {
    for (const missingLang of missingLangs) {
      const expectedHref = generateExpectedHref(url, missingLang);
      fixes.push({
        type: 'add',
        category: 'hreflang',
        selector: 'head',
        currentValue: null,
        newValue: `<link rel="alternate" hreflang="${missingLang}" href="${expectedHref}" />`,
        description: `Ajouter hreflang pour ${missingLang}`,
        autoFixable: true,
      });
    }
  }
  
  if (!hasXDefault) {
    const xDefaultHref = generateExpectedHref(url, 'x-default');
    fixes.push({
      type: 'add',
      category: 'hreflang',
      selector: 'head',
      currentValue: null,
      newValue: `<link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`,
      description: 'Ajouter hreflang x-default',
      autoFixable: true,
    });
  }
  
  return {
    present,
    tags: validatedTags,
    bidirectional,
    hasXDefault,
    missingLangs,
    issues: tagIssues,
  };
}

function validateHreflangTag(tag: { hreflang: string; href: string }, currentUrl: string, currentLang: LangCode): boolean {
  // Format hreflang valide
  if (!tag.hreflang || !tag.href) return false;
  
  // URL valide
  try {
    new URL(tag.href);
  } catch {
    return false;
  }
  
  // Pas de self-reference incorrecte
  if (tag.hreflang === currentLang && !tag.href.includes(`/${currentLang}/`)) {
    return false;
  }
  
  return true;
}

function normalizeUrlForComparison(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url;
  }
}

function generateExpectedHref(currentUrl: string, targetLang: string): string {
  try {
    const parsed = new URL(currentUrl);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    
    // Remplacer le code langue au début du path
    if (pathParts.length > 0 && DEFAULT_CONFIG.supportedLangs.includes(pathParts[0] as LangCode)) {
      if (targetLang === 'x-default') {
        // x-default pointe vers la version FR (langue par défaut)
        pathParts[0] = DEFAULT_CONFIG.defaultLang;
      } else {
        pathParts[0] = targetLang;
      }
    } else if (targetLang !== 'x-default') {
      // Pas de langue détectée, insérer au début
      pathParts.unshift(targetLang);
    }
    
    parsed.pathname = '/' + pathParts.join('/');
    return parsed.toString();
  } catch {
    return currentUrl;
  }
}