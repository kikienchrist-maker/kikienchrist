// injector.test.ts — Unit Tests for Astro Injector (schema-org-master)
import { describe, it, expect } from 'vitest';
import { injectSchemaOrg, generateSchemaOrgScript, extractFAQFromHTML, extractBreadcrumbsFromHTML } from '../src/injector';

describe('Injector — injectSchemaOrg', () => {
  const baseConfig = {
    globalData: {
      website: {
        name: 'Kiki en Christ',
        url: 'https://kikienchrist.vercel.app',
        searchUrlTemplate: 'https://kikienchrist.vercel.app/search?q={search_term_string}',
      },
      organization: {
        name: 'Kiki en Christ',
        url: 'https://kikienchrist.vercel.app',
        logo: 'https://kikienchrist.vercel.app/logo.png',
        sameAs: ['https://twitter.com/kikienchrist'],
        email: 'kikienchrist@gmail.com',
      },
    },
    defaultLang: 'fr',
    autoTypes: ['WebSite', 'Organization', 'BreadcrumbList', 'FAQPage'] as const,
  };

  it('should inject WebSite + Organization + BreadcrumbList', () => {
    const result = injectSchemaOrg({
      pageType: 'home',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/',
      breadcrumbs: [{ name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' }],
    }, baseConfig);

    expect(result.types).toContain('WebSite');
    expect(result.types).toContain('Organization');
    expect(result.types).toContain('BreadcrumbList');
    expect(result.html).toContain('"@type": "WebSite"');
    expect(result.html).toContain('"@type": "Organization"');
    expect(result.html).toContain('"@type": "BreadcrumbList"');
    expect(result.jsonLd['@graph']).toHaveLength(3);
  });

  it('should inject Book schema for book page', () => {
    const book = {
      '@type': 'Book',
      name: 'Le visage de Dieu',
      isbn: '9791035977887',
      author: { '@type': 'Person', name: 'Kiki en Christ' },
      inLanguage: 'fr',
      numberOfPages: 331,
      datePublished: '2023-05-18',
    };

    const result = injectSchemaOrg({
      pageType: 'book',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/livres/visage',
      book,
      breadcrumbs: [
        { name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' },
        { name: 'Livres', url: 'https://kikienchrist.vercel.app/fr/livres' },
        { name: 'Le visage de Dieu', url: 'https://kikienchrist.vercel.app/fr/livres/visage' },
      ],
    }, baseConfig);

    expect(result.types).toContain('Book');
    expect(result.jsonLd['@graph'].some((n: any) => n['@type'] === 'Book')).toBe(true);
    expect(result.jsonLd['@graph'].some((n: any) => n['@type'] === 'BreadcrumbList')).toBe(true);
  });

  it('should inject Article schema for article page', () => {
    const article = {
      '@type': 'Article',
      headline: 'Comment entendre la voix de Dieu',
      author: { '@type': 'Person', name: 'Kiki en Christ' },
      datePublished: '2024-01-15',
      image: 'https://kikienchrist.vercel.app/images/blog/entendre-voix-dieu.jpg',
      publisher: { '@type': 'Organization', name: 'Kiki en Christ' },
    };

    const result = injectSchemaOrg({
      pageType: 'article',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/blog/entendre-voix-dieu',
      article,
      breadcrumbs: [
        { name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' },
        { name: 'Blog', url: 'https://kikienchrist.vercel.app/fr/blog' },
        { name: 'Comment entendre la voix de Dieu', url: 'https://kikienchrist.vercel.app/fr/blog/entendre-voix-dieu' },
      ],
    }, baseConfig);

    expect(result.types).toContain('Article');
    expect(result.jsonLd['@graph'].some((n: any) => n['@type'] === 'Article')).toBe(true);
  });

  it('should inject FAQPage for legal page', () => {
    const result = injectSchemaOrg({
      pageType: 'legal',
      lang: 'fr',
      canonicalUrl: 'https://kikienchrist.vercel.app/fr/mentions-legales',
      faq: [
        { question: 'Qui est l\'éditeur ?', answer: 'Kiki en Christ' },
        { question: 'Contact ?', answer: 'kikienchrist@gmail.com' },
      ],
      breadcrumbs: [
        { name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' },
        { name: 'Mentions légales', url: 'https://kikienchrist.vercel.app/fr/mentions-legales' },
      ],
    }, baseConfig);

    expect(result.types).toContain('FAQPage');
    const faq = result.jsonLd['@graph'].find((n: any) => n['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(2);
    expect(faq.kikiSource).toBe('legal');
  });

  it('should respect disableAuto', () => {
    const result = injectSchemaOrg({
      pageType: 'home',
      lang: 'fr',
    }, { ...baseConfig, autoTypes: [] });

    expect(result.types).toHaveLength(0);
    expect(result.jsonLd['@graph']).toHaveLength(0);
  });

  it('should use custom lang', () => {
    const result = injectSchemaOrg({
      pageType: 'home',
      lang: 'en',
    }, baseConfig);

    expect(result.jsonLd['@context']['@language']).toBe('en');
  });
});

describe('generateSchemaOrgScript', () => {
  it('should return script tag HTML', () => {
    const script = generateSchemaOrgScript({
      pageType: 'home',
      lang: 'fr',
    }, { globalData: { website: { name: 'Test', url: 'https://test.com' } } });

    expect(script).toContain('<script type="application/ld+json">');
    expect(script).toContain('</script>');
    expect(script).toContain('"@type": "WebSite"');
  });
});

describe('extractFAQFromHTML', () => {
  it('should extract from <dl><dt><dd>', () => {
    const html = `
      <dl>
        <dt>Question 1?</dt>
        <dd>Answer 1</dd>
        <dt>Question 2?</dt>
        <dd>Answer 2</dd>
      </dl>
    `;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(2);
    expect(faqs[0]).toEqual({ question: 'Question 1?', answer: 'Answer 1' });
  });

  it('should extract from <h2><p> pattern', () => {
    const html = `
      <h2>Qu'est-ce que la foi ?</h2>
      <p>La foi est l'assurance des choses qu'on espère.</p>
      <h2>Comment prier ?</h2>
      <p>Parlez à Dieu comme à un ami.</p>
    `;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(2);
    expect(faqs[0].question).toBe('Qu\'est-ce que la foi ?');
    expect(faqs[0].answer).toBe('La foi est l\'assurance des choses qu\'on espère.');
  });

  it('should extract from <details><summary>', () => {
    const html = `
      <details>
        <summary>Question?</summary>
        <p>Réponse détaillée.</p>
      </details>
    `;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toBe('Question?');
    expect(faqs[0].answer).toBe('Réponse détaillée.');
  });

  it('should ignore too long Q/A', () => {
    const longQ = 'Q'.repeat(300);
    const longA = 'A'.repeat(3000);
    const html = `<h2>${longQ}</h2><p>${longA}</p>`;
    const faqs = extractFAQFromHTML(html);
    expect(faqs).toHaveLength(0);
  });
});

describe('extractBreadcrumbsFromHTML', () => {
  it('should extract from nav[aria-label=breadcrumb]', () => {
    const html = `
      <nav aria-label="breadcrumb">
        <ol>
          <li><a href="/fr/">Accueil</a></li>
          <li><a href="/fr/livres">Livres</a></li>
          <li><span>Visage</span></li>
        </ol>
      </nav>
    `;
    const breadcrumbs = extractBreadcrumbsFromHTML(html, 'https://kikienchrist.vercel.app');
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({ name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' });
    expect(breadcrumbs[1]).toEqual({ name: 'Livres', url: 'https://kikienchrist.vercel.app/fr/livres' });
  });

  it('should extract from .breadcrumb class', () => {
    const html = `
      <nav class="breadcrumb">
        <a href="/fr/">Accueil</a> / <a href="/fr/blog">Blog</a>
      </nav>
    `;
    const breadcrumbs = extractBreadcrumbsFromHTML(html, 'https://kikienchrist.vercel.app');
    expect(breadcrumbs).toHaveLength(2);
  });

  it('should return empty for no breadcrumb', () => {
    const html = '<nav><a href="/">Home</a></nav>';
    const breadcrumbs = extractBreadcrumbsFromHTML(html, 'https://kikienchrist.vercel.app');
    expect(breadcrumbs).toHaveLength(0);
  });
});