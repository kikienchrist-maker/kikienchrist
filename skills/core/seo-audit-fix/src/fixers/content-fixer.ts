/**
 * Correcteur Contenu
 * Génère fixes pour H1, images alt, liens, structure
 */
import type { PageAuditResult, SEOFix } from '../types.js';

export function generateContentFixes(result: PageAuditResult): SEOFix[] {
  const fixes: SEOFix[] = [];
  const content = result.content;
  
  // H1 manquant
  if (content.h1Count === 0) {
    fixes.push({
      type: 'add',
      category: 'content',
      selector: 'main',
      currentValue: null,
      newValue: '<h1>Titre principal de la page</h1>',
      description: 'Ajouter H1 principal (nécessite revue manuelle)',
      autoFixable: false,
    });
  }
  
  // H1 multiples - suggérer de garder le premier
  if (content.h1Count > 1) {
    fixes.push({
      type: 'remove',
      category: 'content',
      selector: 'h1:not(:first-of-type)',
      currentValue: 'multiple H1',
      newValue: '',
      description: `Réduire ${content.h1Count} H1 à 1 seul (garder le premier)`,
      autoFixable: false, // Risque de casser structure
    });
  }
  
  // Images sans alt
  for (const src of content.imagesMissingAlt) {
    // Générer alt contextuel basique
    const altText = generateImageAlt(src, result);
    fixes.push({
      type: 'update',
      category: 'content',
      selector: `img[src="${src}"]`,
      currentValue: '',
      newValue: altText,
      description: `Ajouter alt pour image: ${src}`,
      autoFixable: false, // Nécessite description sémantique
    });
  }
  
  // Liens cassés - ne peut pas auto-fixer, juste signaler
  for (const broken of content.linksBroken) {
    fixes.push({
      type: 'update',
      category: 'content',
      selector: `a[href="${broken.url}"]`,
      currentValue: broken.url,
      newValue: '#',
      description: `Lien cassé: ${broken.url} (${broken.error}) - à corriger manuellement`,
      autoFixable: false,
    });
  }
  
  // Reading time manquant
  if (!content.readingTimePresent && content.wordCount > 0) {
    const readingTime = Math.ceil(content.wordCount / 200); // ~200 mots/min
    fixes.push({
      type: 'add',
      category: 'content',
      selector: 'article, .article-content, main',
      currentValue: null,
      newValue: `<meta name="reading-time" content="${readingTime}" />`,
      description: `Ajouter temps de lecture: ${readingTime} min`,
      autoFixable: true,
    });
  }
  
  // Structure - H2 manquants pour contenu long
  const structureIssues = content.structure.filter(s => s.type === 'missing_h2');
  if (structureIssues.length > 0) {
    fixes.push({
      type: 'add',
      category: 'content',
      selector: 'main',
      currentValue: null,
      newValue: '<!-- Ajouter des sous-titres H2 pour structurer le contenu -->',
      description: 'Contenu long sans H2: ajouter des sous-titres',
      autoFixable: false,
    });
  }
  
  // Contenu trop court
  const thinContent = content.structure.filter(s => s.type === 'thin_content');
  if (thinContent.length > 0) {
    fixes.push({
      type: 'add',
      category: 'content',
      selector: 'main',
      currentValue: null,
      newValue: '<!-- Contenu à enrichir: minimum 300 mots recommandé -->',
      description: `Contenu court: ${content.wordCount} mots`,
      autoFixable: false,
    });
  }
  
  return fixes;
}

function generateImageAlt(src: string, result: PageAuditResult): string {
  // Essayer de déduire depuis le nom de fichier
  const filename = src.split('/').pop() || '';
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  const words = nameWithoutExt.split(/[-_]/).filter(w => w.length > 1);
  
  if (words.length > 0) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  // Fallback selon type de page
  const pageType = getPageType(result.url);
  const fallbacks: Record<string, string> = {
    home: 'Image d\'accueil Kiki en Christ',
    blogIndex: 'Illustration blog',
    blogPost: `Illustration pour "${result.content.h1Text || 'article'}"`,
    blogCategory: 'Illustration catégorie',
    legal: 'Document légal',
    book: 'Couverture livre',
    contact: 'Contact',
    partners: 'Partenaire',
    default: 'Image illustrative',
  };
  
  return fallbacks[pageType] ?? fallbacks.default ?? 'Image illustrative';
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