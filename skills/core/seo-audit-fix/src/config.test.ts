import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG, META_RULES, REQUIRED_SCHEMA_BY_PAGE_TYPE, SEO_KEYWORDS_BY_LANG } from './config.js';

describe('config', () => {
  it('DEFAULT_CONFIG has correct structure', () => {
    expect(DEFAULT_CONFIG.baseUrl).toBe('https://kikienchrist.vercel.app');
    expect(DEFAULT_CONFIG.lighthouseThresholds.performance).toBe(90);
    expect(DEFAULT_CONFIG.lighthouseThresholds.accessibility).toBe(95);
    expect(DEFAULT_CONFIG.supportedLangs).toHaveLength(12); // 11 + x-default
    expect(DEFAULT_CONFIG.defaultLang).toBe('fr');
  });

  it('META_RULES has correct thresholds', () => {
    expect(META_RULES.title.minLength).toBe(30);
    expect(META_RULES.title.maxLength).toBe(60);
    expect(META_RULES.description.minLength).toBe(120);
    expect(META_RULES.description.maxLength).toBe(160);
  });

  it('REQUIRED_SCHEMA_BY_PAGE_TYPE has all page types', () => {
    expect(REQUIRED_SCHEMA_BY_PAGE_TYPE.home).toContain('WebSite');
    expect(REQUIRED_SCHEMA_BY_PAGE_TYPE.blogPost).toContain('Article');
    expect(REQUIRED_SCHEMA_BY_PAGE_TYPE.blogPost).toContain('BreadcrumbList');
    expect(REQUIRED_SCHEMA_BY_PAGE_TYPE.legal).toContain('FAQPage');
  });

  it('SEO_KEYWORDS_BY_LANG has keywords for all langs', () => {
    for (const lang of DEFAULT_CONFIG.supportedLangs) {
      if (lang !== 'x-default') {
        expect(SEO_KEYWORDS_BY_LANG[lang as any]).toBeDefined();
        expect(SEO_KEYWORDS_BY_LANG[lang as any]!.length).toBeGreaterThan(5);
      }
    }
  });
});