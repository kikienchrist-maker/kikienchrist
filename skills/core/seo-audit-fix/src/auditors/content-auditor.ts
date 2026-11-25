/**
 * Auditeur Contenu (H1, images, liens, structure)
 */
import type { JSDOM } from 'jsdom';
import type { PageAuditResult, ContentAuditResult, BrokenLink, SEOIssue, LangCode } from '../types.js';
import { SEO_KEYWORDS_BY_LANG } from '../config.js';
import { getH1, getImages, getLinks, isInternalUrl } from '../utils.js';

export async function auditContent(
  dom: JSDOM, 
  url: string, 
  lang: LangCode, 
  baseUrl: string,
  result: PageAuditResult
): Promise<ContentAuditResult> {
  const issues: SEOIssue[] = [];
  const fixes: any[] = [];
  const structureIssues: any[] = [];
  
  // H1
  const h1 = getH1(dom);
  const h1Count = h1.count;
  const h1Text = h1.text;
  const h1Unique = h1Count === 1;
  
  if (h1Count === 0) {
    issues.push({
      type: 'error',
      category: 'content',
      message: 'Aucun H1 trouvé sur la page',
    });
    fixes.push({
      type: 'add',
      category: 'content',
      selector: 'main',
      currentValue: null,
      newValue: '<h1>Titre de la page</h1>',
      description: 'Ajouter H1 principal',
      autoFixable: false, // Nécessite contexte
    });
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: `${h1Count} balises H1 trouvées (devrait être 1)`,
    });
  }
  
  // Images
  const images = getImages(dom);
  const imagesTotal = images.length;
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
  const imagesMissingAlt = images
    .filter(img => !img.alt || img.alt.trim() === '')
    .map(img => img.src);
  
  if (imagesMissingAlt.length > 0) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: `${imagesMissingAlt.length} image(s) sans attribut alt`,
    });
    for (const src of imagesMissingAlt) {
      fixes.push({
        type: 'update',
        category: 'content',
        selector: `img[src="${src}"]`,
        currentValue: '',
        newValue: 'Image illustrative',
        description: `Ajouter alt pour ${src}`,
        autoFixable: false, // Nécessite description contextuelle
      });
    }
  }
  
  // Liens
  const links = getLinks(dom, baseUrl);
  const linksTotal = links.length;
  const brokenLinks: BrokenLink[] = [];
  
  // Vérifier liens internes (échantillon pour performance)
  const internalLinks = links.filter(l => isInternalUrl(l.url, baseUrl));
  const sampleSize = Math.min(internalLinks.length, 20);
  const sampledLinks = internalLinks.slice(0, sampleSize);
  
  for (const link of sampledLinks) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(link.url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.status >= 400) {
        brokenLinks.push({
          url: link.url,
          anchorText: link.anchorText,
          statusCode: response.status,
          error: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      brokenLinks.push({
        url: link.url,
        anchorText: link.anchorText,
        statusCode: null,
        error: error instanceof Error ? error.message : 'Erreur réseau',
      });
    }
  }
  
  if (brokenLinks.length > 0) {
    issues.push({
      type: 'error',
      category: 'content',
      message: `${brokenLinks.length} lien(s) cassé(s) détecté(s)`,
    });
  }
  
  // Reading time
  const readingTimeMeta = dom.window.document.querySelector('meta[name="reading-time"], meta[property="article:reading_time"]');
  const readingTimePresent = !!readingTimeMeta;
  const readingTimeValue = readingTimePresent ? parseInt(readingTimeMeta.getAttribute('content') || '0') : null;
  
  // Word count estimation
  const bodyText = dom.window.document.body?.textContent || '';
  const wordCount = bodyText.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  // Structure checks
  const h2s = dom.window.document.querySelectorAll('h2').length;
  const h3s = dom.window.document.querySelectorAll('h3').length;
  
  if (h2s === 0 && wordCount > 300) {
    structureIssues.push({
      type: 'missing_h2',
      message: 'Contenu long sans sous-titres H2',
      selector: 'main',
    });
  }
  
  if (wordCount < 300) {
    structureIssues.push({
      type: 'thin_content',
      message: `Contenu court: ${wordCount} mots (minimum recommandé: 300)`,
      selector: 'main',
    });
  }
  
  // Keywords check (basique)
  const keywords = SEO_KEYWORDS_BY_LANG[lang] || [];
  const foundKeywords = keywords.filter(kw => 
    bodyText.toLowerCase().includes(kw.toLowerCase())
  );
  
  if (foundKeywords.length === 0 && keywords.length > 0) {
    structureIssues.push({
      type: 'keyword_stuffing', // Réutilisé pour "mots-clés manquants"
      message: `Aucun mot-clé théologique détecté (attendus: ${keywords.slice(0, 5).join(', ')}...)`,
      selector: 'main',
    });
  }
  
  return {
    h1Count,
    h1Text,
    h1Unique,
    imagesTotal,
    imagesWithAlt,
    imagesMissingAlt,
    linksTotal,
    linksBroken: brokenLinks,
    readingTimePresent,
    readingTimeValue,
    wordCount,
    structure: structureIssues,
  };
}