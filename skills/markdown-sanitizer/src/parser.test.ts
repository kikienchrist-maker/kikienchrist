import { describe, it, expect } from 'vitest';
import { parseMarkdown, normalizeFrontmatterTypes, detectCollectionType } from './parser.js';

describe('parseMarkdown', () => {
  it('parses standard frontmatter', () => {
    const content = `---
title: "Test Article"
lang: fr
tags: ["tag1", "tag2"]
published: true
count: 42
---
# Body content`;
    
    const result = parseMarkdown(content);
    expect(result.frontmatter.title).toBe('Test Article');
    expect(result.frontmatter.lang).toBe('fr');
    expect(result.frontmatter.tags).toEqual(['tag1', 'tag2']);
    expect(result.frontmatter.published).toBe(true); // normalizeFrontmatterTypes convertit
    expect(result.frontmatter.count).toBe(42); // normalizeFrontmatterTypes convertit
    expect(result.body).toBe('# Body content');
    expect(result.hadNestedFm).toBe(false);
  });
  
  it('extracts nested frontmatter from ```markdown block', () => {
    const content = `---
title: "Outer"
lang: fr
---
    
\`\`\`markdown
---
title: "Inner Title"
description: "Inner description"
category: "prière"
---
# Real content
\`\`\``;
    
    const result = parseMarkdown(content, { extractNested: true });
    expect(result.hadNestedFm).toBe(true);
    expect(result.frontmatter.title).toBe('Inner Title'); // Priorité au nested
    expect(result.frontmatter.description).toBe('Inner description');
    expect(result.frontmatter.category).toBe('prière');
    expect(result.body).toBe('# Real content');
  });
  
  it('handles nested yaml block', () => {
    const content = `\`\`\`yaml
---
title: "YAML Block"
lang: en
---
# Body content
\`\`\``;
    
    const result = parseMarkdown(content, { extractNested: true });
    expect(result.hadNestedFm).toBe(true);
    expect(result.frontmatter.title).toBe('YAML Block');
    expect(result.frontmatter.lang).toBe('en');
    expect(result.body).toBe('# Body content');
  });
  
  it('falls back to outer fm when nested extraction fails', () => {
    const content = `---
title: "Outer Only"
lang: fr
---
\`\`\`markdown
No frontmatter here
\`\`\``;
    
    const result = parseMarkdown(content, { extractNested: true });
    expect(result.hadNestedFm).toBe(false);
    expect(result.frontmatter.title).toBe('Outer Only');
  });
});

describe('normalizeFrontmatterTypes', () => {
  it('converts string booleans to boolean', () => {
    const fm = { featured: 'true', draft: 'false', active: 'true' };
    const result = normalizeFrontmatterTypes(fm, 'blog');
    expect(result.featured).toBe(true);
    expect(result.draft).toBe(false);
    expect(result.active).toBe(true);
  });
  
  it('converts string numbers to number', () => {
    const fm = { readingTime: '10', seriesOrder: '1', priceEUR: '19.99' };
    const result = normalizeFrontmatterTypes(fm, 'blog');
    expect(result.readingTime).toBe(10);
    expect(result.seriesOrder).toBe(1);
    expect(result.priceEUR).toBe(19.99);
  });
  
  it('parses tags string as JSON array', () => {
    const fm = { tags: '["tag1", "tag2", "tag3"]' };
    const result = normalizeFrontmatterTypes(fm, 'blog');
    expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });
  
  it('falls back to comma-separated for tags', () => {
    const fm = { tags: 'tag1, tag2, tag3' };
    const result = normalizeFrontmatterTypes(fm, 'blog');
    expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });
  
  it('removes invalid dates', () => {
    const fm = { pubDate: 'not-a-date', updatedDate: '2025-01-15T08:00:00+01:00' };
    const result = normalizeFrontmatterTypes(fm, 'blog');
    expect(result.pubDate).toBeUndefined();
    expect(result.updatedDate).toBe('2025-01-15T08:00:00+01:00');
  });
});

describe('detectCollectionType', () => {
  it('detects blog', () => {
    const fm = { category: 'prière', series: 'apprendre-à-prier', tags: ['tag'] };
    expect(detectCollectionType(fm)).toBe('blog');
  });
  
  it('detects legal', () => {
    const fm = { pageSlug: 'mentions-legales', lastUpdated: '2025-01-15' };
    expect(detectCollectionType(fm)).toBe('legal');
  });
  
  it('detects book', () => {
    const fm = { id: 'visage', priceEUR: 19.99, coverImageFr: '/img.jpg' };
    expect(detectCollectionType(fm)).toBe('book');
  });
  
  it('returns unknown for minimal fm', () => {
    const fm = { title: 'Test' };
    expect(detectCollectionType(fm)).toBe('unknown');
  });
});