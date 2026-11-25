/**
 * Correcteur Hreflang
 * Génère les tags hreflang bidirectionnels complets + x-default
 */
import type { PageAuditResult, SEOFix, LangCode } from '../types.js';
import { DEFAULT_CONFIG } from '../config.js';

export function generateHreflangFixes(result: PageAuditResult): SEOFix[] {
  const fixes: SEOFix[] = [];
  const hreflang = result.hreflang;
  const url = result.url;
  
  // Si pas de hreflang du tout, générer le set complet
  if (!hreflang.present || hreflang.tags.length === 0) {
    return generateFullHreflangSet(url, result.lang);
  }
  
  // Ajouter langues manquantes
  for (const missingLang of hreflang.missingLangs) {
    const expectedHref = generateHrefForLang(url, missingLang);
    fixes.push({
      type: 'add',
      category: 'hreflang',
      selector: 'head',
      currentValue: null,
      newValue: `<link rel="alternate" hreflang="${missingLang}" href="${expectedHref}" />`,
      description: `Ajouter hreflang manquant: ${missingLang}`,
      autoFixable: true,
    });
  }
  
  // Ajouter x-default si manquant
  if (!hreflang.hasXDefault) {
    const xDefaultHref = generateHrefForLang(url, 'x-default');
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
  
  // Corriger tags invalides
  for (const tag of hreflang.tags) {
    if (!tag.valid) {
      const expectedHref = generateHrefForLang(url, tag.hreflang as LangCode);
      fixes.push({
        type: 'update',
        category: 'hreflang',
        selector: `link[rel="alternate"][hreflang="${tag.hreflang}"]`,
        currentValue: tag.href,
        newValue: expectedHref,
        description: `Corriger hreflang invalide: ${tag.hreflang}`,
        autoFixable: true,
      });
    }
  }
  
  return fixes;
}

function generateFullHreflangSet(url: string, currentLang: LangCode): SEOFix[] {
  const fixes: SEOFix[] = [];
  const baseUrl = new URL(url);
  const pathParts = baseUrl.pathname.split('/').filter(Boolean);
  
  // Déterminer le path sans le code langue
  let pathWithoutLang = pathParts.slice(1).join('/');
  if (DEFAULT_CONFIG.supportedLangs.includes(pathParts[0] as LangCode)) {
    pathWithoutLang = pathParts.slice(1).join('/');
  } else {
    pathWithoutLang = pathParts.join('/');
  }
  
  // Générer pour chaque langue supportée
  for (const lang of DEFAULT_CONFIG.supportedLangs) {
    if (lang === 'x-default') continue;
    
    const targetUrl = new URL(baseUrl.origin);
    targetUrl.pathname = `/${lang}/${pathWithoutLang}`.replace(/\/+$/, '') + '/';
    
    fixes.push({
      type: 'add',
      category: 'hreflang',
      selector: 'head',
      currentValue: null,
      newValue: `<link rel="alternate" hreflang="${lang}" href="${targetUrl.toString()}" />`,
      description: `Ajouter hreflang: ${lang}`,
      autoFixable: true,
    });
  }
  
  // x-default -> version FR (langue par défaut)
  const xDefaultUrl = new URL(baseUrl.origin);
  xDefaultUrl.pathname = `/${DEFAULT_CONFIG.defaultLang}/${pathWithoutLang}`.replace(/\/+$/, '') + '/';
  
  fixes.push({
    type: 'add',
    category: 'hreflang',
    selector: 'head',
    currentValue: null,
    newValue: `<link rel="alternate" hreflang="x-default" href="${xDefaultUrl.toString()}" />`,
    description: 'Ajouter hreflang x-default',
    autoFixable: true,
  });
  
  return fixes;
}

function generateHrefForLang(url: string, targetLang: string): string {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0 && DEFAULT_CONFIG.supportedLangs.includes(pathParts[0] as LangCode)) {
      if (targetLang === 'x-default') {
        pathParts[0] = DEFAULT_CONFIG.defaultLang;
      } else {
        pathParts[0] = targetLang;
      }
    } else if (targetLang !== 'x-default') {
      pathParts.unshift(targetLang);
    }
    
    parsed.pathname = '/' + pathParts.join('/');
    return parsed.toString();
  } catch {
    return url;
  }
}