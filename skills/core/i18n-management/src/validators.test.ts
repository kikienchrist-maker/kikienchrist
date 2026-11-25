/**
 * Tests pour validators.ts
 */
import { describe, it, expect } from 'vitest';
import { validateTranslationsFile, validateSplitFile, validateConsistency } from './validators.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS } from './config.js';

describe('validators', () => {
  const mockMaster = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    entries: [
      { key: 'common.hello', values: { fr: 'Bonjour', en: 'Hello', es: 'Hola', pt: '', it: '', de: '', nl: '', pl: '', ar: '', ru: '', zh: '', hi: '', 'x-default': 'Bonjour' }, description: '', category: 'common' },
      { key: 'common.goodbye', values: { fr: 'Au revoir', en: 'Goodbye', es: 'Adiós', pt: 'Tchau', it: 'Arrivederci', de: 'Tschüss', nl: 'Tot ziens', pl: 'Do widzenia', ar: 'مع السلامة', ru: 'До свидания', zh: '再见', hi: 'अलविदा', 'x-default': 'Au revoir' }, description: '', category: 'common' },
      { key: 'blog.read_more', values: { fr: 'Lire la suite', en: '', es: '', pt: '', it: '', de: '', nl: '', pl: '', ar: '', ru: '', zh: '', hi: '', 'x-default': 'Lire la suite' }, description: '', category: 'blog' },
    ],
  };
  
  describe('validateTranslationsFile', () => {
    it('valide un fichier correct', () => {
      const result = validateTranslationsFile(mockMaster, DEFAULT_I18N_CONFIG);
      expect(result.valid).toBe(true);
      expect(result.stats.totalKeys).toBe(3);
      expect(result.stats.translatedKeys).toBe(1); // seulement common.goodbye a toutes les langues
    });
    
    it('détecte clés manquantes par langue', () => {
      const result = validateTranslationsFile(mockMaster, DEFAULT_I18N_CONFIG);
      expect(result.stats.missingByLang.en).toBe(1); // blog.read_more manquant en en
      expect(result.stats.missingByLang.es).toBe(1); // blog.read_more manquant en es (common.hello a 'Hola')
    });
  });
  
  describe('validateSplitFile', () => {
    it('valide un fichier split correct', () => {
      const splitFile = {
        lang: 'fr',
        translations: { 'common.hello': 'Bonjour', 'common.goodbye': 'Au revoir' },
        updatedAt: new Date().toISOString(),
      };
      const masterKeys = new Set(['common.hello', 'common.goodbye', 'blog.read_more']);
      const result = validateSplitFile('fr', splitFile, masterKeys);
      expect(result.valid).toBe(true);
      expect(result.stats.translatedKeys).toBe(2);
      expect(result.stats.missingByLang.fr).toBe(1); // blog.read_more manquant
    });
    
    it('détecte clés orphelines', () => {
      const splitFile = {
        lang: 'fr',
        translations: { 'common.hello': 'Bonjour', 'orphan.key': 'Orphelin' },
        updatedAt: new Date().toISOString(),
      };
      const masterKeys = new Set(['common.hello']);
      const result = validateSplitFile('fr', splitFile, masterKeys);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.stats.orphanKeys).toContain('orphan.key');
    });
  });
  
  describe('validateConsistency', () => {
    it('détecte incohérences', () => {
      const splitFiles = {
        fr: { lang: 'fr', translations: { 'common.hello': 'Bonjour', 'common.goodbye': 'Au revoir' }, updatedAt: new Date().toISOString() },
        en: { lang: 'en', translations: { 'common.hello': 'Hello' }, updatedAt: new Date().toISOString() }, // missing goodbye
      };
      const result = validateConsistency(mockMaster, splitFiles, DEFAULT_I18N_CONFIG);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('en'))).toBe(true);
    });
  });
});