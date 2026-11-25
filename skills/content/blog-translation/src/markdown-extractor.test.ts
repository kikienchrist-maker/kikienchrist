import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractAllArticles, getSourceArticles, getMissingTranslations, ExtractedArticle } from './markdown-extractor.js';

// Mock fs
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
}));

vi.mock('gray-matter', () => ({
  default: vi.fn(),
}));

import { readFileSync, readdirSync, statSync } from 'fs';
import matter from 'gray-matter';

describe('markdown-extractor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('extracts articles from blog directory', () => {
    const mockFiles = ['fr-article1.md', 'en-article1.md', 'fr-article2.md'];
    (readdirSync as any).mockReturnValue(mockFiles);
    (statSync as any).mockReturnValue({ isDirectory: () => true });

    (readFileSync as any).mockImplementation((path: string) => {
      const filename = path.split('/').pop() || '';
      const lang = filename.startsWith('en-') ? 'en' : 'fr';
      return `---
title: "Test Article"
lang: ${lang}
translationKey: "article1"
slug: "${filename.replace('.md', '')}"
category: "prière"
tags: ["tag1"]
---
# Body content`;
    });

    (matter as any).mockImplementation((content: string) => ({
      data: { title: 'Test Article', lang: 'fr', translationKey: 'article1', slug: 'fr-article1', category: 'prière', tags: ['tag1'] },
      content: '# Body content',
    }));

    const articles = extractAllArticles('src/content/blog');
    expect(articles.length).toBe(3);
  });

  it('getSourceArticles returns FR articles', () => {
    const mockArticles: ExtractedArticle[] = [
      { filePath: 'a.md', article: { slug: 'fr-art', translationKey: 'art', sourceLang: 'fr', frontmatter: {} as any, body: '' }, warnings: [] },
      { filePath: 'b.md', article: { slug: 'en-art', translationKey: 'art', sourceLang: 'en', frontmatter: {} as any, body: '' }, warnings: [] },
      { filePath: 'c.md', article: { slug: 'fr-art2', translationKey: 'art2', sourceLang: 'fr', frontmatter: {} as any, body: '' }, warnings: [] },
    ];

    const sources = getSourceArticles(mockArticles);
    expect(sources.length).toBe(2);
    expect(sources.every(a => a.article.sourceLang === 'fr')).toBe(true);
  });

  it('getMissingTranslations detects missing langs', () => {
    const mockArticles: ExtractedArticle[] = [
      { filePath: 'a.md', article: { slug: 'fr-art', translationKey: 'art', sourceLang: 'fr', frontmatter: {} as any, body: '' }, warnings: [] },
      { filePath: 'b.md', article: { slug: 'en-art', translationKey: 'art', sourceLang: 'en', frontmatter: {} as any, body: '' }, warnings: [] },
      // Pas de ES, PT pour 'art'
      { filePath: 'c.md', article: { slug: 'fr-art2', translationKey: 'art2', sourceLang: 'fr', frontmatter: {} as any, body: '' }, warnings: [] },
    ];

    const missing = getMissingTranslations(mockArticles, ['en', 'es', 'pt']);
    expect(missing.length).toBe(2); // art (manque es,pt), art2 (manque en,es,pt)
    
    const artMissing = missing.find(m => m.translationKey === 'art');
    expect(artMissing?.missingLangs).toEqual(['es', 'pt']);
  });
});