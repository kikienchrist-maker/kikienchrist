/**
 * Tests pour sync.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { syncMasterToSplit, syncSplitToMaster } from './sync.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS } from './config.js';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';

const TEST_DIR = join(process.cwd(), 'test-sync-temp');

describe('sync', () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
    mkdirSync(join(TEST_DIR, 'i18n'), { recursive: true });
  });
  
  const mockMaster = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    entries: [
      { key: 'common.hello', values: { fr: 'Bonjour', en: 'Hello', es: 'Hola', pt: 'Olá', it: 'Ciao', de: 'Hallo', nl: 'Hallo', pl: 'Cześć', ar: 'مرحبا', ru: 'Привет', zh: '你好', hi: 'नमस्ते', 'x-default': 'Bonjour' }, description: '', category: 'common' },
      { key: 'common.goodbye', values: { fr: 'Au revoir', en: 'Goodbye', es: 'Adiós', pt: 'Tchau', it: 'Arrivederci', de: 'Tschüss', nl: 'Tot ziens', pl: 'Do widzenia', ar: 'مع السلامة', ru: 'До свидания', zh: '再见', hi: 'अलविदा', 'x-default': 'Au revoir' }, description: '', category: 'common' },
    ],
  };
  
  describe('syncMasterToSplit', () => {
    it('crée fichiers split depuis master', () => {
      const result = syncMasterToSplit(mockMaster, join(TEST_DIR, 'i18n'), DEFAULT_I18N_CONFIG);
      expect(result.synced).toBe(true);
      expect(result.added.length).toBe(UI_LANGS.length * 2); // 2 clés × 12 langues
      expect(result.errors).toHaveLength(0);
      
      // Vérifier contenu fr.json
      const frContent = JSON.parse(require('fs').readFileSync(join(TEST_DIR, 'i18n', 'fr.json'), 'utf-8'));
      expect(frContent.lang).toBe('fr');
      expect(frContent.translations['common.hello']).toBe('Bonjour');
      expect(frContent.translations['common.goodbye']).toBe('Au revoir');
    });
    
    it('met à jour fichiers existants', () => {
      // Créer fr.json existant
      writeFileSync(join(TEST_DIR, 'i18n', 'fr.json'), JSON.stringify({
        lang: 'fr',
        translations: { 'common.hello': 'Salut' }, // valeur différente
        updatedAt: new Date().toISOString(),
      }));
      
      const result = syncMasterToSplit(mockMaster, join(TEST_DIR, 'i18n'), DEFAULT_I18N_CONFIG);
      expect(result.updated.some(u => u.includes('fr:common.hello'))).toBe(true);
      
      const frContent = JSON.parse(require('fs').readFileSync(join(TEST_DIR, 'i18n', 'fr.json'), 'utf-8'));
      expect(frContent.translations['common.hello']).toBe('Bonjour'); // mis à jour vers master
    });
    
    it('supprime clés orphelines', () => {
      writeFileSync(join(TEST_DIR, 'i18n', 'fr.json'), JSON.stringify({
        lang: 'fr',
        translations: { 'common.hello': 'Bonjour', 'orphan.key': 'Orphelin' },
        updatedAt: new Date().toISOString(),
      }));
      
      const result = syncMasterToSplit(mockMaster, join(TEST_DIR, 'i18n'), DEFAULT_I18N_CONFIG);
      expect(result.removed.some(r => r.includes('fr:orphan.key'))).toBe(true);
    });
  });
  
  describe('syncSplitToMaster', () => {
    it('met à jour master depuis splits', () => {
      // Créer splits
      for (const lang of UI_LANGS) {
        writeFileSync(join(TEST_DIR, 'i18n', `${lang}.json`), JSON.stringify({
          lang,
          translations: { 'common.hello': `Hello-${lang}`, 'new.key': `New-${lang}` },
          updatedAt: new Date().toISOString(),
        }));
      }
      
      const master = { ...mockMaster };
      const result = syncSplitToMaster(join(TEST_DIR, 'i18n'), master, DEFAULT_I18N_CONFIG);
      
      expect(result.added).toContain('new.key');
      expect(result.updated.some(u => u === 'common.hello')).toBe(true);
      expect(master.entries.find(e => e.key === 'new.key')).toBeDefined();
      expect(master.entries.find(e => e.key === 'common.hello')?.values.fr).toBe('Hello-fr');
    });
  });
});