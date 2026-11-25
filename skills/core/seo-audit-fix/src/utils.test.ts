import { describe, it, expect } from 'vitest';
import { normalizeUrl, extractLangFromUrl, getPageType, isInternalUrl, chunkArray } from './utils.js';

describe('utils', () => {
  describe('normalizeUrl', () => {
    it('normalizes relative URLs', () => {
      expect(normalizeUrl('/fr/blog/test', 'https://kikienchrist.vercel.app'))
        .toBe('https://kikienchrist.vercel.app/fr/blog/test');
    });

    it('removes tracking params', () => {
      expect(normalizeUrl('/fr/blog/test?utm_source=test&page=1', 'https://kikienchrist.vercel.app'))
        .toBe('https://kikienchrist.vercel.app/fr/blog/test?page=1');
    });

    it('keeps allowed params', () => {
      expect(normalizeUrl('/fr/blog?page=2&category=priere', 'https://kikienchrist.vercel.app'))
        .toBe('https://kikienchrist.vercel.app/fr/blog?page=2&category=priere');
    });
  });

  describe('extractLangFromUrl', () => {
    it('extracts lang from path', () => {
      expect(extractLangFromUrl('https://kikienchrist.vercel.app/fr/blog', ['fr', 'en'])).toBe('fr');
      expect(extractLangFromUrl('https://kikienchrist.vercel.app/en/blog', ['fr', 'en'])).toBe('en');
    });

    it('returns null for unknown lang', () => {
      expect(extractLangFromUrl('https://kikienchrist.vercel.app/xx/blog', ['fr', 'en'])).toBeNull();
    });
  });

  describe('getPageType', () => {
    it('identifies page types correctly', () => {
      expect(getPageType('https://kikienchrist.vercel.app/fr/')).toBe('home');
      expect(getPageType('https://kikienchrist.vercel.app/fr/blog')).toBe('blogIndex');
      expect(getPageType('https://kikienchrist.vercel.app/fr/blog/mon-article')).toBe('blogPost');
      expect(getPageType('https://kikienchrist.vercel.app/fr/blog/categorie/priere')).toBe('blogCategory');
      expect(getPageType('https://kikienchrist.vercel.app/fr/mentions-legales')).toBe('legal');
      expect(getPageType('https://kikienchrist.vercel.app/fr/livres/mon-livre')).toBe('book');
      expect(getPageType('https://kikienchrist.vercel.app/fr/contact')).toBe('contact');
      expect(getPageType('https://kikienchrist.vercel.app/fr/partenaires')).toBe('partners');
      expect(getPageType('https://kikienchrist.vercel.app/fr/autre')).toBe('default');
    });
  });

  describe('isInternalUrl', () => {
    it('identifies internal URLs', () => {
      expect(isInternalUrl('https://kikienchrist.vercel.app/fr/blog', 'https://kikienchrist.vercel.app')).toBe(true);
      expect(isInternalUrl('/fr/blog', 'https://kikienchrist.vercel.app')).toBe(true);
    });

    it('identifies external URLs', () => {
      expect(isInternalUrl('https://google.com', 'https://kikienchrist.vercel.app')).toBe(false);
      expect(isInternalUrl('https://subdomain.kikienchrist.vercel.app', 'https://kikienchrist.vercel.app')).toBe(false);
    });
  });

  describe('chunkArray', () => {
    it('chunks array correctly', () => {
      expect(chunkArray([1,2,3,4,5], 2)).toEqual([[1,2], [3,4], [5]]);
      expect(chunkArray([1,2,3], 5)).toEqual([[1,2,3]]);
      expect(chunkArray([], 2)).toEqual([]);
    });
  });
});