/**
 * Tests pour generator.ts
 */
import { describe, it, expect } from 'vitest';
import { generateDecapConfig, configToYaml } from './generator.js';
import { createAllCollections } from './config.js';

describe('generator', () => {
  describe('generateDecapConfig', () => {
    it('génère une config valide avec collections par défaut', () => {
      const config = generateDecapConfig({ outputDir: 'static/admin' });
      
      expect(config.backend.name).toBe('git-gateway');
      expect(config.backend.branch).toBe('main');
      expect(config.media_folder).toBe('public/images');
      expect(config.public_folder).toBe('/images');
      expect(config.collections.length).toBe(6);
      expect(config.publish_mode).toBe('editorial_workflow');
    });
    
    it('permet de surcharger le backend', () => {
      const config = generateDecapConfig({ 
        outputDir: 'static/admin',
        backend: { repo: 'owner/repo', branch: 'develop' }
      });
      
      expect(config.backend.repo).toBe('owner/repo');
      expect(config.backend.branch).toBe('develop');
    });
    
    it('génère config en mode simple', () => {
      const config = generateDecapConfig({ 
        outputDir: 'static/admin',
        publishMode: 'simple'
      });
      
      expect(config.publish_mode).toBe('simple');
    });
  });
  
  describe('configToYaml', () => {
    it('génère du YAML valide', () => {
      const config = generateDecapConfig({ outputDir: 'static/admin' });
      const yaml = configToYaml(config);
      
      expect(yaml).toContain('backend:');
      expect(yaml).toContain('name: git-gateway');
      expect(yaml).toContain('branch: main');
      expect(yaml).toContain('media_folder: "public/images"');
      expect(yaml).toContain('public_folder: "/images"');
      expect(yaml).toContain('collections:');
      expect(yaml).toContain('name: "blog"');
      expect(yaml).toContain('name: "legal"');
      expect(yaml).toContain('name: "translations"');
      expect(yaml).toContain('name: "books"');
      expect(yaml).toContain('name: "authors"');
      expect(yaml).toContain('name: "siteConfig"');
    });
    
    it('inclut commit_messages', () => {
      const config = generateDecapConfig({ outputDir: 'static/admin' });
      const yaml = configToYaml(config);
      
      expect(yaml).toContain('commit_messages:');
      expect(yaml).toContain('create:');
      expect(yaml).toContain('update:');
    });
  });
});