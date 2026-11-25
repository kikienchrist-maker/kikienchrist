/**
 * Tests pour utils.ts
 */
import { describe, it, expect } from 'vitest';
import { flattenTranslations, unflattenTranslations, normalizeKey, calculateCompletion, sortLangs, validateIcuMessage } from './utils.js';
import { UI_LANGS, DEFAULT_LANG } from './config.js';

describe('utils', () => {
  describe('flattenTranslations', () => {
    it('applatit un objet simple', () => {
      const input = { hello: 'world', foo: 'bar' };
      const result = flattenTranslations(input);
      expect(result).toEqual({ hello: 'world', foo: 'bar' });
    });
    
    it('applatit un objet imbriqué', () => {
      const input = { common: { hello: 'world', buttons: { save: 'Sauver' } }, nav: { home: 'Accueil' } };
      const result = flattenTranslations(input);
      expect(result).toEqual({
        'common.hello': 'world',
        'common.buttons.save': 'Sauver',
        'nav.home': 'Accueil',
      });
    });
    
    it('ignore les tableaux', () => {
      const input = { items: ['a', 'b'], value: 'test' };
      const result = flattenTranslations(input);
      expect(result).toEqual({ value: 'test' });
    });
  });
  
  describe('unflattenTranslations', () => {
    it('reconstruit un objet imbriqué', () => {
      const input = { 'common.hello': 'world', 'common.buttons.save': 'Sauver', 'nav.home': 'Accueil' };
      const result = unflattenTranslations(input);
      expect(result).toEqual({
        common: { hello: 'world', buttons: { save: 'Sauver' } },
        nav: { home: 'Accueil' },
      });
    });
  });
  
  describe('normalizeKey', () => {
    it('normalise une clé', () => {
      expect(normalizeKey('Hello World')).toBe('hello_world');
      expect(normalizeKey('  Test.Key  ')).toBe('test.key');
      expect(normalizeKey('Special@#$Chars')).toBe('specialchars');
      expect(normalizeKey('multiple___underscores')).toBe('multiple_underscores');
    });
  });
  
  describe('calculateCompletion', () => {
    it('calcule le pourcentage', () => {
      expect(calculateCompletion(5, 10)).toBe(50);
      expect(calculateCompletion(10, 10)).toBe(100);
      expect(calculateCompletion(0, 10)).toBe(0);
      expect(calculateCompletion(0, 0)).toBe(100);
    });
  });
  
  describe('sortLangs', () => {
    it('trie avec défaut en premier', () => {
      const langs = ['en', 'es', 'fr', 'de'];
      const result = sortLangs(langs, 'fr');
      expect(result[0]).toBe('fr');
      expect(result.slice(1)).toEqual(['de', 'en', 'es']);
    });
  });
  
  describe('validateIcuMessage', () => {
    it('valide message simple', () => {
      const result = validateIcuMessage('Hello {name}');
      expect(result.valid).toBe(true);
    });
    
    it('valide plural ICU', () => {
      const result = validateIcuMessage('{count, plural, one {# item} other {# items}}');
      expect(result.valid).toBe(true);
    });
    
    it('détecte parenthèses non équilibrées', () => {
      const result = validateIcuMessage('Hello {name');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Parenthèses non équilibrées');
    });
  });
});