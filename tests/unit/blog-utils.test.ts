// Tests unitaires - Blog Utils (alias pour structure tests/)
import { describe, it, expect } from 'vitest';
import {
  generateBlogPostingJsonLd,
  generateBlogJsonLd,
  generateArticleMetaTags,
  getRelatedPosts,
  calculateReadingTime,
  slugify,
  formatDate,
  getCategoryLabel,
  extractHeadings,
  generateHeadingId,
} from '../../src/utils/blog';

describe('Blog Utils (tests/unit)', () => {
  const mockPost = {
    title: 'Test Article',
    description: 'Test description for SEO',
    pubDate: '2025-11-20T07:00:00+01:00',
    updatedDate: '2025-11-21T07:00:00+01:00',
    author: 'Jean Dupont',
    authorRole: 'Pasteur',
    lang: 'fr',
    category: 'prière',
    tags: ['prière', 'foi', 'guide'],
    series: 'Apprendre à prier',
    seriesOrder: 1,
    featured: true,
    draft: false,
    readingTime: 8,
    isLeadMagnet: true,
    leadMagnetTitle: 'Guide de prière',
    leadMagnetDescription: 'Un guide gratuit',
    leadMagnetFile: 'https://example.com/guide.pdf',
    relatedPodcastEpisode: 'ep-001',
    relatedVideo: 'https://youtube.com/watch?v=abc',
    canonicalURL: 'https://kikienchrist.com/fr/blog/test-article/',
    ogImage: 'https://ik.imagekit.io/og-test.jpg',
    ogTitle: 'OG Title',
    ogDescription: 'OG Description',
    structuredData: { type: 'BlogPosting' as const, wordCount: 1500 },
    slug: 'test-article',
    body: 'Lorem ipsum dolor sit amet. '.repeat(100),
  };

  const siteUrl = 'https://kikienchrist.vercel.app';

  describe('generateBlogPostingJsonLd', () => {
    it('should generate valid BlogPosting JSON-LD', () => {
      const jsonLd = generateBlogPostingJsonLd(mockPost, siteUrl);
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BlogPosting');
      expect(jsonLd.headline).toBe('Test Article');
      expect(jsonLd.description).toBe('Test description for SEO');
      expect(jsonLd.url).toBe('https://kikienchrist.com/fr/blog/test-article/');
      expect(jsonLd.author.name).toBe('Jean Dupont');
      expect(jsonLd.author.jobTitle).toBe('Pasteur');
      expect(jsonLd.inLanguage).toBe('fr');
      expect(jsonLd.articleSection).toBe('prière');
      expect(jsonLd.keywords).toBe('prière, foi, guide');
      expect(jsonLd.wordCount).toBe(1500);
      expect(jsonLd.isPartOf.name).toBe('Apprendre à prier');
      expect(jsonLd.associatedMedia.contentUrl).toBe('https://example.com/guide.pdf');
    });

    it('should handle missing optional fields', () => {
      const minimalPost = { ...mockPost, authorRole: undefined, series: undefined, isLeadMagnet: false, structuredData: undefined, body: 'short' };
      const jsonLd = generateBlogPostingJsonLd(minimalPost, siteUrl);
      
      expect(jsonLd.author.jobTitle).toBeUndefined();
      expect(jsonLd.isPartOf).toBeUndefined();
      expect(jsonLd.associatedMedia).toBeUndefined();
      expect(jsonLd.wordCount).toBeGreaterThan(0);
    });
  });

  describe('generateBlogJsonLd', () => {
    it('should generate Blog JSON-LD with pagination', () => {
      const posts = [mockPost, { ...mockPost, slug: 'post-2', title: 'Post 2' }];
      const jsonLd = generateBlogJsonLd(posts, siteUrl, 'fr', { currentPage: 1, totalPages: 5, pageSize: 10 });
      
      expect(jsonLd['@type']).toBe('Blog');
      expect(jsonLd.blogPosts).toHaveLength(2);
      expect(jsonLd.pagination.currentPage).toBe(1);
      expect(jsonLd.pagination.totalPages).toBe(5);
    });
  });

  describe('generateArticleMetaTags', () => {
    it('should generate all meta tags', () => {
      const tags = generateArticleMetaTags(mockPost, siteUrl);
      
      expect(tags.canonical).toBe('https://kikienchrist.com/fr/blog/test-article/');
      expect(tags['og:title']).toBe('OG Title');
      expect(tags['og:description']).toBe('OG Description');
      expect(tags['og:image']).toBe('https://ik.imagekit.io/og-test.jpg');
      expect(tags['og:locale']).toBe('fr_FR');
      expect(tags['article:published_time']).toBe('2025-11-20T06:00:00.000Z');
      expect(tags['article:author']).toContain('jean-dupont');
      expect(tags['twitter:card']).toBe('summary_large_image');
    });

    it('should fallback to post title/image when OG not provided', () => {
      const postNoOg = { ...mockPost, ogTitle: undefined, ogDescription: undefined, ogImage: undefined };
      const tags = generateArticleMetaTags(postNoOg, siteUrl);
      
      expect(tags['og:title']).toBe('Test Article');
      expect(tags['og:description']).toBe('Test description for SEO');
      expect(tags['og:image']).toBe(`${siteUrl}/og-default.jpg`);
    });
  });

  describe('getRelatedPosts', () => {
    const allPosts = [
      mockPost,
      { ...mockPost, slug: 'same-series-2', seriesOrder: 2, title: 'Same Series 2' },
      { ...mockPost, slug: 'same-category', category: 'prière', series: undefined, title: 'Same Category' },
      { ...mockPost, slug: 'shared-tag', tags: ['foi'], series: undefined, category: 'formation', title: 'Shared Tag' },
      { ...mockPost, slug: 'old-post', pubDate: '2020-01-01T00:00:00Z', series: undefined, category: 'actualité', tags: [], title: 'Old Post' },
    ];

    it('should prioritize same series', () => {
      const related = getRelatedPosts({ allPosts, currentSlug: 'test-article', category: 'prière', tags: ['prière', 'foi', 'guide'], series: 'Apprendre à prier', limit: 3 });
      
      expect(related[0].slug).toBe('same-series-2');
      expect(related[0].seriesOrder).toBe(2);
    });

    it('should fallback to category then tags', () => {
      const noSeriesPosts = allPosts.filter(p => !p.series);
      const related = getRelatedPosts({ allPosts: noSeriesPosts, currentSlug: 'same-category', category: 'prière', tags: ['prière'], limit: 3 });
      
      expect(related[0].slug).toBe('shared-tag'); // shared tag + more recent
    });

    it('should exclude current post', () => {
      const related = getRelatedPosts({ allPosts, currentSlug: 'test-article', limit: 10 });
      expect(related.find(p => p.slug === 'test-article')).toBeUndefined();
    });

    it('should exclude draft posts', () => {
      const draftPost = { ...mockPost, slug: 'draft-post', draft: true };
      const related = getRelatedPosts({ allPosts: [...allPosts, draftPost], currentSlug: 'test-article', limit: 10 });
      expect(related.find(p => p.slug === 'draft-post')).toBeUndefined();
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      expect(calculateReadingTime('word '.repeat(200))).toBe(1);
      expect(calculateReadingTime('word '.repeat(400))).toBe(2);
      expect(calculateReadingTime('word '.repeat(1000))).toBe(5);
      expect(calculateReadingTime('')).toBe(1); // Minimum 1 minute
    });
  });

  describe('slugify', () => {
    it('should slugify correctly', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('C\'est l\'été !')).toBe('cest-lete');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('Special@#$Chars')).toBe('specialchars');
      expect(slugify('Already-slugified')).toBe('already-slugified');
    });
  });

  describe('formatDate', () => {
    it('should format date in French', () => {
      const formatted = formatDate('2025-11-20T07:00:00+01:00', 'fr');
      expect(formatted).toContain('20');
      expect(formatted).toContain('novembre');
      expect(formatted).toContain('2025');
    });

    it('should format date in English', () => {
      const formatted = formatDate('2025-11-20T07:00:00+01:00', 'en');
      expect(formatted).toContain('20');
      expect(formatted).toContain('November');
      expect(formatted).toContain('2025');
    });

    it('should format date in Arabic (RTL)', () => {
      const formatted = formatDate('2025-11-20T07:00:00+01:00', 'ar');
      expect(formatted).toContain('2025');
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct labels for all languages', () => {
      expect(getCategoryLabel('prière', 'fr')).toBe('Prière');
      expect(getCategoryLabel('prière', 'en')).toBe('Prayer');
      expect(getCategoryLabel('prière', 'es')).toBe('Oración');
      expect(getCategoryLabel('prière', 'ar')).toBe('صلاة');
      expect(getCategoryLabel('formation', 'fr')).toBe('Formation');
      expect(getCategoryLabel('unknown', 'fr')).toBe('unknown');
    });
  });

  describe('extractHeadings', () => {
    it('should extract h2 and h3 with ids', () => {
      const html = `
        <h2 id="intro">Introduction</h2>
        <h3 id="sub1">Sous-partie 1</h3>
        <h2 id="conclusion">Conclusion</h2>
      `;
      const headings = extractHeadings(html);
      
      expect(headings).toHaveLength(3);
      expect(headings[0]).toEqual({ level: 2, text: 'Introduction', id: 'intro' });
      expect(headings[1]).toEqual({ level: 3, text: 'Sous-partie 1', id: 'sub1' });
      expect(headings[2]).toEqual({ level: 2, text: 'Conclusion', id: 'conclusion' });
    });

    it('should strip inner HTML from heading text', () => {
      const html = '<h2 id="test">Hello <strong>World</strong></h2>';
      const headings = extractHeadings(html);
      expect(headings[0].text).toBe('Hello World');
    });
  });

  describe('generateHeadingId', () => {
    it('should generate slug from heading text', () => {
      expect(generateHeadingId('Mon Titre')).toBe('mon-titre');
      expect(generateHeadingId('Titre avec accents')).toBe('titre-avec-accents');
    });
  });
});