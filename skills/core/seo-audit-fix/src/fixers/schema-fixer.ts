/**
 * Correcteur Schema.org
 * Génère/Met à jour les JSON-LD requis
 */
import type { PageAuditResult, SEOFix } from '../types.js';
import { REQUIRED_SCHEMA_BY_PAGE_TYPE, getPageType } from '../config.js';

export function generateSchemaFixes(result: PageAuditResult): SEOFix[] {
  const fixes: SEOFix[] = [];
  const schema = result.schema;
  const pageType = getPageType(result.url);
  const requiredTypes: string[] = REQUIRED_SCHEMA_BY_PAGE_TYPE[pageType] ?? REQUIRED_SCHEMA_BY_PAGE_TYPE.default ?? ['WebSite', 'Organization'];
  
  // Si pas de schema du tout, générer le set complet
  if (!schema.present || schema.jsonLd.length === 0) {
    return generateFullSchemaSet(result);
  }
  
  // Ajouter types manquants
  const foundTypes = new Set(schema.types);
  for (const requiredType of requiredTypes) {
    if (!foundTypes.has(requiredType)) {
      const schemaJson = generateSchemaObject(requiredType, result);
      fixes.push({
        type: 'add',
        category: 'schema',
        selector: 'head',
        currentValue: null,
        newValue: `<script type="application/ld+json">${JSON.stringify(schemaJson, null, 2)}</script>`,
        description: `Ajouter Schema.org manquant: ${requiredType}`,
        autoFixable: true,
      });
    }
  }
  
  // Corriger erreurs existantes
  for (const error of schema.errors) {
    if (error.includes('Article')) {
      const articleSchema = generateSchemaObject('Article', result);
      fixes.push({
        type: 'update',
        category: 'schema',
        selector: 'script[type="application/ld+json"]',
        currentValue: 'existing',
        newValue: `<script type="application/ld+json">${JSON.stringify(articleSchema, null, 2)}</script>`,
        description: `Corriger Article Schema: ${error}`,
        autoFixable: true,
      });
    }
    if (error.includes('BreadcrumbList')) {
      const breadcrumbSchema = generateBreadcrumbSchema(result);
      fixes.push({
        type: 'update',
        category: 'schema',
        selector: 'script[type="application/ld+json"]',
        currentValue: 'existing',
        newValue: `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema, null, 2)}</script>`,
        description: `Corriger BreadcrumbList Schema: ${error}`,
        autoFixable: true,
      });
    }
    if (error.includes('FAQPage')) {
      const faqSchema = generateFAQSchema(result);
      if (faqSchema) {
        fixes.push({
          type: 'update',
          category: 'schema',
          selector: 'script[type="application/ld+json"]',
          currentValue: 'existing',
          newValue: `<script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>`,
          description: `Corriger FAQPage Schema: ${error}`,
          autoFixable: true,
        });
      }
    }
  }
  
  return fixes;
}

function generateFullSchemaSet(result: PageAuditResult): SEOFix[] {
  const fixes: SEOFix[] = [];
  const pageType = getPageType(result.url);
  const requiredTypes: string[] = REQUIRED_SCHEMA_BY_PAGE_TYPE[pageType] ?? REQUIRED_SCHEMA_BY_PAGE_TYPE.default ?? ['WebSite', 'Organization'];
  
  for (const type of requiredTypes) {
    const schemaJson = generateSchemaObject(type, result);
    fixes.push({
      type: 'add',
      category: 'schema',
      selector: 'head',
      currentValue: null,
      newValue: `<script type="application/ld+json">${JSON.stringify(schemaJson, null, 2)}</script>`,
      description: `Ajouter Schema.org: ${type}`,
      autoFixable: true,
    });
  }
  
  return fixes;
}

function generateSchemaObject(type: string, result: PageAuditResult): any {
  const baseUrl = 'https://kikienchrist.vercel.app';
  const lang = result.lang;
  const url = result.url;
  
  switch (type) {
    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Kiki en Christ',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/${lang}/recherche?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: lang,
      };
    
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Kiki en Christ',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        sameAs: [
          'https://www.facebook.com/kikienchrist',
          'https://www.instagram.com/kikienchrist',
          'https://www.youtube.com/@kikienchrist',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+33-0-00-00-00-00',
          contactType: 'customer service',
          availableLanguage: ['French', 'English', 'Spanish', 'Portuguese', 'Italian', 'German', 'Dutch', 'Polish', 'Arabic', 'Russian', 'Chinese', 'Hindi'],
        },
        email: 'kikienchrist@gmail.com',
      };
    
    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: result.meta.ogTitle.value || result.content.h1Text || 'Article',
        description: result.meta.ogDescription.value || result.meta.description.value,
        image: result.meta.ogImage.value ? [result.meta.ogImage.value] : [`${baseUrl}/og/default.png`],
        datePublished: extractDate(result.url) || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: 'Kiki en Christ',
          url: `${baseUrl}/${lang}/auteur/kikienchrist`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Kiki en Christ',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        articleSection: getArticleSection(result.url),
        inLanguage: lang,
        isAccessibleForFree: true,
      };
    
    case 'BreadcrumbList':
      return generateBreadcrumbSchema(result);
    
    case 'FAQPage':
      return generateFAQSchema(result);
    
    case 'Blog':
      return {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog Kiki en Christ',
        description: 'Articles chrétiens sur la prière, la foi et la vie spirituelle',
        url: `${baseUrl}/${lang}/blog`,
        blogPosts: [],
        inLanguage: lang,
      };
    
    case 'CollectionPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: getCollectionName(result.url),
        description: `Collection d'articles et ressources chrétiennes`,
        url: url,
        inLanguage: lang,
      };
    
    case 'WebPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: result.meta.title.value || 'Page',
        description: result.meta.description.value,
        url: url,
        inLanguage: lang,
        isAccessibleForFree: true,
      };
    
    case 'ContactPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact - Kiki en Christ',
        description: 'Contactez l\'équipe Kiki en Christ',
        url: url,
        inLanguage: lang,
        mainEntity: {
          '@type': 'Organization',
          name: 'Kiki en Christ',
          email: 'kikienchrist@gmail.com',
          url: baseUrl,
        },
      };
    
    case 'Book':
      return {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: 'Livre chrétien',
        description: 'Ressources chrétiennes pour la vie spirituelle',
        url: url,
        inLanguage: lang,
        publisher: {
          '@type': 'Organization',
          name: 'Kiki en Christ',
        },
      };
    
    default:
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Page',
        url: url,
        inLanguage: lang,
      };
  }
}

function generateBreadcrumbSchema(result: PageAuditResult): any {
  const baseUrl = 'https://kikienchrist.vercel.app';
  const lang = result.lang;
  const url = result.url;
  const pageType = getPageType(url);
  
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${lang}/`,
        name: 'Accueil',
      },
    },
  ];
  
  let position = 2;
  
  if (pageType === 'blogIndex' || pageType === 'blogPost' || pageType === 'blogCategory') {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: position++,
      item: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${lang}/blog`,
        name: 'Blog',
      },
    });
  }
  
  if (pageType === 'blogCategory') {
    const categoryMatch = url.match(/categorie\/([^/]+)/);
    if (categoryMatch && categoryMatch[1]) {
      const categoryName = categoryMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      breadcrumbs.push({
        '@type': 'ListItem',
        position: position++,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/${lang}/blog/categorie/${categoryMatch[1]}`,
          name: categoryName,
        },
      });
    }
  }
  
  if (pageType === 'blogPost' || pageType === 'legal' || pageType === 'book' || pageType === 'contact' || pageType === 'partners') {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: position++,
      item: {
        '@type': 'WebPage',
        '@id': url,
        name: result.meta.title.value || result.content.h1Text || 'Page',
      },
    });
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

function generateFAQSchema(result: PageAuditResult): any | null {
  // Extraire FAQ du contenu si présent
  const faqSection = extractFAQFromContent(result);
  if (!faqSection || faqSection.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqSection.map((q, i) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

function extractFAQFromContent(result: PageAuditResult): { question: string; answer: string }[] | null {
  // TODO: Parser le HTML pour trouver sections FAQ
  // Pour l'instant, retourne null (nécessite implémentation spécifique)
  return null;
}

function getArticleSection(url: string): string {
  const categoryMatch = url.match(/categorie\/([^/]+)/);
  if (categoryMatch && categoryMatch[1]) {
    return categoryMatch[1].replace(/-/g, ' ');
  }
  return 'Vie chrétienne';
}

function getCollectionName(url: string): string {
  if (url.includes('/blog/categorie/')) {
    const match = url.match(/categorie\/([^/]+)/);
    return match && match[1] ? match[1].replace(/-/g, ' ') : 'Articles';
  }
  if (url.includes('/livres/')) return 'Livres';
  if (url.includes('/partenaires/')) return 'Partenaires';
  return 'Collection';
}

function extractDate(url: string): string | null {
  // Essayer d'extraire date depuis URL ou métadonnées
  return null;
}