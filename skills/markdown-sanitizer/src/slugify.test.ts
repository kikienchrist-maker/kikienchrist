import { describe, it, expect } from 'vitest';
import { slugifyText, generateTranslationSlug, validateSlug, extractBaseSlug } from './slugify.js';

describe('slugifyText', () => {
  it('removes accents and lowercases', () => {
    expect(slugifyText('Comment entendre la voix de Dieu')).toBe('comment-entendre-la-voix-de-dieu');
    expect(slugifyText('Jesús María')).toBe('jesus-maria');
    // Cyrillique: slugify supprime les non-ASCII, résultat vide -> fallback
    const cyrResult = slugifyText('Привет мир');
    expect(typeof cyrResult).toBe('string');
  });
  
  it('handles special characters', () => {
    expect(slugifyText('Test @#$%^&*()')).toBe('test');
    expect(slugifyText('Test---multiple---dashes')).toBe('test-multiple-dashes');
  });
  
  it('truncates long slugs', () => {
    const long = 'a'.repeat(100);
    const result = slugifyText(long, { maxLength: 50 });
    expect(result.length).toBeLessThanOrEqual(50);
  });
  
  it('removes stop words when enabled', () => {
    const result = slugifyText('the quick brown fox', { removeStopWords: true });
    expect(result).not.toContain('the');
    expect(result).toContain('quick-brown-fox');
  });
  
  it('preserves numbers by default', () => {
    expect(slugifyText('Article 2025')).toBe('article-2025');
  });
});

describe('generateTranslationSlug', () => {
  it('returns base slug for source language', () => {
    expect(generateTranslationSlug('entendre-voix-dieu', 'fr', true)).toBe('entendre-voix-dieu');
  });
  
  it('appends lang code for translations', () => {
    expect(generateTranslationSlug('entendre-voix-dieu', 'en')).toBe('entendre-voix-dieu-en');
    expect(generateTranslationSlug('entendre-voix-dieu', 'es')).toBe('entendre-voix-dieu-es');
    expect(generateTranslationSlug('entendre-voix-dieu', 'zh')).toBe('entendre-voix-dieu-zh');
  });
});

describe('validateSlug', () => {
  it('accepts valid slugs', () => {
    expect(validateSlug('entendre-voix-dieu').valid).toBe(true);
    expect(validateSlug('article-123').valid).toBe(true);
    expect(validateSlug('a').valid).toBe(true);
  });
  
  it('rejects invalid characters', () => {
    expect(validateSlug('Entendre Voix').valid).toBe(false); // majuscules + espace
    expect(validateSlug('entendre_voix').valid).toBe(false); // underscore
    expect(validateSlug('entendre.voix').valid).toBe(false); // point
  });
  
  it('rejects leading/trailing dashes', () => {
    expect(validateSlug('-entendre').valid).toBe(false);
    expect(validateSlug('entendre-').valid).toBe(false);
  });
  
  it('rejects double dashes', () => {
    expect(validateSlug('entendre--voix').valid).toBe(false);
  });
  
  it('rejects starting with number', () => {
    expect(validateSlug('123-article').valid).toBe(false);
  });
});

describe('extractBaseSlug', () => {
  it('matches known base slugs', () => {
    const known = ['entendre-voix-dieu', 'guerre-spirituelle-priere-autorite'];
    expect(extractBaseSlug('entendre-voix-dieu-en', known)).toBe('entendre-voix-dieu');
    expect(extractBaseSlug('entendre-voix-dieu', known)).toBe('entendre-voix-dieu');
  });
  
  it('falls back to removing lang suffix', () => {
    expect(extractBaseSlug('article-inconnu-en')).toBe('article-inconnu');
    expect(extractBaseSlug('article-inconnu-zh')).toBe('article-inconnu');
  });
  
  it('preserves slug if no lang suffix detected', () => {
    expect(extractBaseSlug('article-long-sans-lang')).toBe('article-long-sans-lang');
  });
});