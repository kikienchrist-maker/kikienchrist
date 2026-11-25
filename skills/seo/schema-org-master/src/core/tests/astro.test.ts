// astro.test.ts — Tests pour intégration Astro (schema-org-master)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  detectPageType, 
  extractFAQFromHTML, 
  extractBreadcrumbsFromHTML,
} from '../src/integrations/astro/middleware';
import { buildBreadcrumbs } from '../src/integrations/astro/middleware';
import { 
  generateSchemaOrgScript, 
  injectSchemaOrg,
  injectIntoHTML,
  type PageData,
  type InjectionResult
} from '../src/injector';

// Helper pour extraire JSON du script tag
function extractJsonFromScript(html: string): any {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  return JSON.parse(match[1]);
}

// Mock Astro context
function createMockContext(overrides: Partial<{
  pathname: string;
  params: Record<string, string>;
  locals: Record<string, unknown>;
  props: Record<string, unknown>;
}> = {}) {
  return {
    url: new URL(`https://kikienchrist.vercel.app${overrides.pathname || '/fr/'}`),
    params: overrides.params || {},
    locals: overrides.locals || {},
    props: overrides.props || {},
  };
}

describe('Astro Integration — detectPageType', () => {
  it('should detect home page', () => {
    const ctx = createMockContext({ pathname: '/fr/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('home');
    expect(result.lang).toBe('fr');
  });

  it('should detect home page in English', () => {
    const ctx = createMockContext({ pathname: '/en/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('home');
    expect(result.lang).toBe('en');
  });

  it('should detect livres page', () => {
    const ctx = createMockContext({ pathname: '/fr/livres/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('livres');
    expect(result.lang).toBe('fr');
  });

  it('should detect book page with number', () => {
    const ctx = createMockContext({ pathname: '/fr/livre/2/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('book');
    expect(result.bookNumber).toBe(2);
    expect(result.lang).toBe('fr');
  });

  it('should detect blog index', () => {
    const ctx = createMockContext({ pathname: '/fr/blog/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('blog');
  });

  it('should detect article page', () => {
    const ctx = createMockContext({ pathname: '/fr/blog/mon-article/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('article');
    expect(result.articleSlug).toBe('mon-article');
  });

  it('should detect category page', () => {
    const ctx = createMockContext({ pathname: '/fr/blog/categorie/vie-chretienne/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('category');
    expect(result.categorySlug).toBe('vie-chretienne');
  });

  it('should detect legal pages', () => {
    const ctx = createMockContext({ pathname: '/fr/mentions-legales/' });
    const result = detectPageType(ctx as any);
    expect(result.pageType).toBe('legal');
    expect(result.legalPage).toBe('mentions-legales');
  });

  it('should build breadcrumbs for home', () => {
    const crumbs = buildBreadcrumbs('/', 'fr', 'home');
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].name).toBe('Accueil');
  });

  it('should build breadcrumbs for livre', () => {
    const crumbs = buildBreadcrumbs('/livre/1/', 'fr', 'book');
    expect(crumbs.length).toBeGreaterThanOrEqual(2);
    expect(crumbs[0].name).toBe('Accueil');
    expect(crumbs[1].name).toBe('Nos livres');
  });
});

describe('Astro Integration — extractFAQFromHTML', () => {
  it('should extract FAQ from details/summary', () => {
    const html = `
      <details><summary>Qu'est-ce que Kiki ?</summary>Kiki est une série de livres.</details>
      <details><summary>Combien de livres ?</summary>Il y a 4 livres.</details>
    `;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe('Qu\'est-ce que Kiki ?');
    expect(faqs[0].answer).toBe('Kiki est une série de livres.');
  });

  it('should extract FAQ from h3/p pattern', () => {
    const html = `
      <h3>Question 1</h3><p>Réponse 1</p>
      <h3>Question 2</h3><p>Réponse 2</p>
    `;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe('Question 1');
    expect(faqs[0].answer).toBe('Réponse 1');
  });

  it('should extract FAQ from data attributes', () => {
    const html = `
      <div data-faq-question="Q1"><span data-faq-answer="R1"></span></div>
    `;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toBe('Q1');
    expect(faqs[0].answer).toBe('R1');
  });

  it('should return empty for no FAQ', () => {
    const html = '<p>Contenu sans FAQ</p>';
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(0);
  });
});

describe('Astro Integration — extractBreadcrumbsFromHTML', () => {
  it('should extract breadcrumbs from nav aria-label', () => {
    const html = `
      <nav aria-label="breadcrumb">
        <ol>
          <li><a href="/fr/">Accueil</a></li>
          <li><a href="/fr/blog/">Blog</a></li>
          <li><span>Mon Article</span></li>
        </ol>
      </nav>
    `;
    const crumbs = extractBreadcrumbsFromHTML(html);
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0]).toEqual({ name: 'Accueil', url: '/fr/' });
    expect(crumbs[1]).toEqual({ name: 'Blog', url: '/fr/blog/' });
    expect(crumbs[2]).toEqual({ name: 'Mon Article', url: '' });
  });

  it('should return empty for no breadcrumbs', () => {
    const html = '<nav>Pas de breadcrumb</nav>';
    const crumbs = extractBreadcrumbsFromHTML(html);
    expect(crumbs).toHaveLength(0);
  });
});

describe('Astro Integration — generateSchemaOrgScript', () => {
  it('should generate WebSite + Organization + BreadcrumbList for home', () => {
    const pageData: PageData = {
      pageType: 'home',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/',
      breadcrumbs: [{ name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' }],
    };
    
    const script = generateSchemaOrgScript(pageData, {
      autoTypes: ['WebSite', 'Organization', 'BreadcrumbList'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
      injectInHead: true,
      pretty: false,
    });
    
    const parsed = extractJsonFromScript(script);
    expect(parsed['@graph']).toBeDefined();
    expect(Array.isArray(parsed['@graph'])).toBe(true);
    
    const types = parsed['@graph'].map((g: any) => g['@type']);
    expect(types).toContain('WebSite');
    expect(types).toContain('Organization');
    expect(types).toContain('BreadcrumbList');
  });

  it('should generate Book schema for book page', () => {
    const pageData: PageData = {
      pageType: 'book',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/livre/1/',
      book: {
        '@type': 'Book',
        name: 'Kiki - Le visage de Dieu',
        isbn: '9791035977887',
      },
    };
    
    const script = generateSchemaOrgScript(pageData, {
      autoTypes: ['WebSite', 'Organization', 'BreadcrumbList'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
      injectInHead: true,
      pretty: false,
    });
    
    const parsed = extractJsonFromScript(script);
    const types = parsed['@graph'].map((g: any) => g['@type']);
    expect(types).toContain('Book');
    expect(types).toContain('WebSite');
    expect(types).toContain('Organization');
  });

  it('should generate Article schema for article page', () => {
    const pageData: PageData = {
      pageType: 'article',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/blog/mon-article/',
      article: {
        '@type': 'BlogPosting',
        headline: 'Mon Article',
        author: { '@type': 'Person', name: 'Auteur' },
        datePublished: '2024-01-01T00:00:00Z',
      },
    };
    
    const script = generateSchemaOrgScript(pageData, {
      autoTypes: ['WebSite', 'Organization', 'BreadcrumbList'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
      injectInHead: true,
      pretty: false,
    });
    
    const parsed = extractJsonFromScript(script);
    const types = parsed['@graph'].map((g: any) => g['@type']);
    expect(types).toContain('BlogPosting');
  });

  it('should generate FAQPage schema when FAQ present', () => {
    const pageData: PageData = {
      pageType: 'legal',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/mentions-legales/',
      faq: [
        { question: 'Q1?', answer: 'R1.' },
        { question: 'Q2?', answer: 'R2.' },
      ],
    };
    
    const script = generateSchemaOrgScript(pageData, {
      autoTypes: ['WebSite', 'Organization', 'BreadcrumbList', 'FAQPage'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
      injectInHead: true,
      pretty: false,
    });
    
    const parsed = extractJsonFromScript(script);
    const types = parsed['@graph'].map((g: any) => g['@type']);
    expect(types).toContain('FAQPage');
  });
});

describe('Astro Integration — injectIntoHTML (HTML injection utility)', () => {
  it('should inject script into head', () => {
    const html = '<html><head><title>Test</title></head><body>Content</body></html>';
    const script = '<script type="application/ld+json">{"@type":"Test"}</script>';
    
    const result = injectIntoHTML(html, script, true);
    expect(result).toContain('<script type="application/ld+json">');
    expect(result).toContain('{"@type":"Test"}');
    expect(result.indexOf('<script type="application/ld+json">')).toBeLessThan(result.indexOf('</head>'));
  });

  it('should inject script into body if no head', () => {
    const html = '<html><body>Content</body></html>';
    const script = '<script type="application/ld+json">{"@type":"Test"}</script>';
    
    const result = injectIntoHTML(html, script, true);
    expect(result).toContain('<script type="application/ld+json">');
    expect(result.indexOf('<script type="application/ld+json">')).toBeLessThan(result.indexOf('</body>'));
  });

  it('should inject at end if no head/body', () => {
    const html = '<html>Content</html>';
    const script = '<script type="application/ld+json">{"@type":"Test"}</script>';
    
    const result = injectIntoHTML(html, script, true);
    expect(result).toBe(html + script);
  });
});

describe('Astro Integration — injectSchemaOrg (core function)', () => {
  it('should return InjectionResult with html, jsonLd, types', () => {
    const pageData: PageData = {
      pageType: 'home',
      lang: 'fr',
      canonicalUrl: 'https://test.com/fr/',
      breadcrumbs: [{ name: 'Accueil', url: 'https://test.com/fr/' }],
    };
    
    const result = injectSchemaOrg(pageData, {
      autoTypes: ['WebSite', 'Organization', 'BreadcrumbList'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
      injectInHead: true,
      pretty: false,
    });
    
    expect(result).toHaveProperty('html');
    expect(result).toHaveProperty('jsonLd');
    expect(result).toHaveProperty('types');
    expect(result.html).toContain('<script type="application/ld+json">');
    expect(result.jsonLd['@graph']).toBeDefined();
    expect(result.types).toContain('WebSite');
    expect(result.types).toContain('Organization');
    expect(result.types).toContain('BreadcrumbList');
  });

  it('should generate Book schema when pageType=book', () => {
    const pageData: PageData = {
      pageType: 'book',
      lang: 'fr',
      canonicalUrl: 'https://test.com/fr/livre/1/',
      book: {
        '@type': 'Book',
        name: 'Test Book',
        isbn: '9791035977887',
        author: { '@type': 'Person', name: 'Author' },
        inLanguage: 'fr',
        numberOfPages: 100,
        datePublished: '2024-01-01T00:00:00Z',
      },
    };
    
    const result = injectSchemaOrg(pageData, {
      autoTypes: ['WebSite', 'Organization'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
    });
    
    expect(result.types).toContain('Book');
    const bookInGraph = result.jsonLd['@graph'].find((g: any) => g['@type'] === 'Book');
    expect(bookInGraph).toBeDefined();
    expect(bookInGraph.name).toBe('Test Book');
  });

  it('should generate FAQPage when faq provided', () => {
    const pageData: PageData = {
      pageType: 'legal',
      lang: 'fr',
      canonicalUrl: 'https://test.com/fr/legal/',
      faq: [
        { question: 'Q1?', answer: 'R1.' },
      ],
    };
    
    const result = injectSchemaOrg(pageData, {
      autoTypes: ['WebSite', 'Organization', 'FAQPage'],
      globalData: {
        website: { name: 'Test', url: 'https://test.com' },
        organization: { name: 'Test Org', url: 'https://test.com' },
      },
      defaultLang: 'fr',
    });
    
    expect(result.types).toContain('FAQPage');
    const faqInGraph = result.jsonLd['@graph'].find((g: any) => g['@type'] === 'FAQPage');
    expect(faqInGraph).toBeDefined();
    expect(faqInGraph.mainEntity).toHaveLength(1);
  });
});