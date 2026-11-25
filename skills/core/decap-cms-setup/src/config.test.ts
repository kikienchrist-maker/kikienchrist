/**
 * Tests pour config.ts
 */
import { describe, it, expect } from 'vitest';
import { 
  createBlogCollection, 
  createLegalCollection, 
  createTranslationsCollection,
  createBooksCollection,
  createAuthorsCollection,
  createSiteConfigCollection,
  createAllCollections,
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  BLOG_CATEGORIES,
  LEGAL_PAGE_TYPES,
  BOOK_STATUS,
} from './config.js';

describe('config', () => {
  describe('createBlogCollection', () => {
    it('crée une collection blog valide', () => {
      const coll = createBlogCollection();
      expect(coll.name).toBe('blog');
      expect(coll.label).toBe('Articles de Blog');
      expect(coll.folder).toBe('src/content/blog');
      expect(coll.create).toBe(true);
      expect(coll.fields.length).toBeGreaterThan(10);
      
      // Vérifier champs requis
      const fieldNames = coll.fields.map(f => f.name);
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('pageSlug');
      expect(fieldNames).toContain('translationKey');
      expect(fieldNames).toContain('author');
      expect(fieldNames).toContain('date');
      expect(fieldNames).toContain('lang');
      expect(fieldNames).toContain('category');
      expect(fieldNames).toContain('body');
    });
    
    it('inclut toutes les langues supportées', () => {
      const coll = createBlogCollection();
      const langField = coll.fields.find(f => f.name === 'lang');
      expect(langField).toBeDefined();
      expect(langField!.options).toEqual(SUPPORTED_LANGS);
    });
  });
  
  describe('createLegalCollection', () => {
    it('crée une collection legal valide', () => {
      const coll = createLegalCollection();
      expect(coll.name).toBe('legal');
      expect(coll.folder).toBe('src/content/legalPages');
      
      const fieldNames = coll.fields.map(f => f.name);
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('slug');
      expect(fieldNames).toContain('translationKey');
      expect(fieldNames).toContain('lang');
      expect(fieldNames).toContain('pageType');
      expect(fieldNames).toContain('body');
    });
    
    it('inclut les types de pages légales', () => {
      const coll = createLegalCollection();
      const pageTypeField = coll.fields.find(f => f.name === 'pageType');
      expect(pageTypeField!.options).toEqual(LEGAL_PAGE_TYPES);
    });
  });
  
  describe('createTranslationsCollection', () => {
    it('crée une collection translations valide', () => {
      const coll = createTranslationsCollection();
      expect(coll.name).toBe('translations');
      expect(coll.folder).toBe('src/data/i18n');
      
      const translationsField = coll.fields.find(f => f.name === 'translations');
      expect(translationsField).toBeDefined();
      expect(translationsField!.widget).toBe('object');
    });
  });
  
  describe('createBooksCollection', () => {
    it('crée une collection books valide', () => {
      const coll = createBooksCollection();
      expect(coll.name).toBe('books');
      expect(coll.folder).toBe('src/content/books');
      
      const fieldNames = coll.fields.map(f => f.name);
      expect(fieldNames).toContain('title');
      expect(fieldNames).toContain('slug');
      expect(fieldNames).toContain('author');
      expect(fieldNames).toContain('price');
      expect(fieldNames).toContain('status');
    });
  });
  
  describe('createAuthorsCollection', () => {
    it('crée une collection authors valide', () => {
      const coll = createAuthorsCollection();
      expect(coll.name).toBe('authors');
      expect(coll.folder).toBe('src/content/authors');
    });
  });
  
  describe('createSiteConfigCollection', () => {
    it('crée une collection siteConfig valide', () => {
      const coll = createSiteConfigCollection();
      expect(coll.name).toBe('siteConfig');
      expect(coll.files).toBeDefined();
      expect(coll.files!.length).toBe(1);
      expect(coll.files![0].file).toBe('src/data/site-config.json');
    });
  });
  
  describe('createAllCollections', () => {
    it('retourne 6 collections', () => {
      const collections = createAllCollections();
      expect(collections.length).toBe(6);
      expect(collections.map(c => c.name)).toEqual([
        'blog', 'legal', 'translations', 'books', 'authors', 'siteConfig'
      ]);
    });
  });
  
  describe('Constants', () => {
    it('SUPPORTED_LANGS a 12 langues', () => {
      expect(SUPPORTED_LANGS.length).toBe(12);
      expect(SUPPORTED_LANGS).toContain('fr');
      expect(SUPPORTED_LANGS).toContain('en');
      expect(SUPPORTED_LANGS).toContain('ar');
      expect(SUPPORTED_LANGS).toContain('zh');
    });
    
    it('DEFAULT_LANG est fr', () => {
      expect(DEFAULT_LANG).toBe('fr');
    });
    
    it('BLOG_CATEGORIES non vide', () => {
      expect(BLOG_CATEGORIES.length).toBeGreaterThan(0);
    });
    
    it('LEGAL_PAGE_TYPES a 5 types', () => {
      expect(LEGAL_PAGE_TYPES.length).toBe(5);
    });
    
    it('BOOK_STATUS a 3 statuts', () => {
      expect(BOOK_STATUS.length).toBe(3);
    });
  });
});