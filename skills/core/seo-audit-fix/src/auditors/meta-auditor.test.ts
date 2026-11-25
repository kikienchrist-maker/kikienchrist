import { describe, it, expect, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { auditMeta } from './meta-auditor.js';

describe('meta-auditor', () => {
  function createDom(html: string): JSDOM {
    return new JSDOM(`<!DOCTYPE html><html><head>${html}</head><body><h1>Test</h1></body></html>`);
  }

  it('validates title length', () => {
    const dom = createDom('<title>Short</title>');
    const result: any = { content: { h1Text: 'H1 Title' } };
    const meta = auditMeta(dom, 'https://test.com/fr/', 'fr', result);
    
    expect(meta.title.present).toBe(true);
    expect(meta.title.valid).toBe(false);
    expect(meta.title.issues).toContain('title trop court (5/30)');
  });

  it('validates description length', () => {
    const dom = createDom('<meta name="description" content="Short desc">');
    const result: any = {};
    const meta = auditMeta(dom, 'https://test.com/fr/', 'fr', result);
    
    expect(meta.description.present).toBe(true);
    expect(meta.description.valid).toBe(false);
    expect(meta.description.issues).toContain('description trop court (10/120)');
  });

  it('validates canonical URL', () => {
    const dom = createDom('<link rel="canonical" href="https://test.com/fr/page">');
    const result: any = {};
    const meta = auditMeta(dom, 'https://test.com/fr/page', 'fr', result);
    
    expect(meta.canonical.present).toBe(true);
    expect(meta.canonical.valid).toBe(true);
  });

  it('validates OG tags', () => {
    const dom = createDom(`
      <meta property="og:title" content="OG Title That Is Long Enough For Validation Right Here">
      <meta property="og:description" content="OG Description here that is long enough to pass the validation rules for minimum length of 120 characters required by the SEO audit tool">
      <meta property="og:image" content="https://test.com/og.png">
      <meta property="og:type" content="article">
      <meta property="og:url" content="https://test.com/fr/page">
    `);
    const result: any = {};
    const meta = auditMeta(dom, 'https://test.com/fr/page', 'fr', result);
    
    expect(meta.ogTitle.valid).toBe(true);
    expect(meta.ogDescription.valid).toBe(true);
    expect(meta.ogImage.valid).toBe(true);
    expect(meta.ogType.valid).toBe(true);
    expect(meta.ogUrl.valid).toBe(true);
  });

  it('validates viewport', () => {
    const dom = createDom('<meta name="viewport" content="width=device-width, initial-scale=1">');
    const result: any = {};
    const meta = auditMeta(dom, 'https://test.com/fr/', 'fr', result);
    
    expect(meta.viewport.valid).toBe(true);
  });

  it('detects missing charset', () => {
    const dom = createDom('<meta charset="ISO-8859-1">');
    const result: any = {};
    const meta = auditMeta(dom, 'https://test.com/fr/', 'fr', result);
    
    expect(meta.charset.present).toBe(true);
    expect(meta.charset.valid).toBe(false);
  });
});