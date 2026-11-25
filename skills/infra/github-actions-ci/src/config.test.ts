/**
 * Tests pour config.ts
 */
import { describe, it, expect } from 'vitest';
import { DEFAULT_GHA_CONFIG, mergeConfig } from './config.js';

describe('config', () => {
  describe('DEFAULT_GHA_CONFIG', () => {
    it('a tous les jobs activés par défaut', () => {
      expect(DEFAULT_GHA_CONFIG.jobs.lint).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.typecheck).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.unit).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.build).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.e2e).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.a11y).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.lighthouse).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.security).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.deployPreview).toBe(true);
      expect(DEFAULT_GHA_CONFIG.jobs.deployProduction).toBe(true);
    });
    
    it('a config Vercel par défaut', () => {
      expect(DEFAULT_GHA_CONFIG.vercel.enabled).toBe(true);
      expect(DEFAULT_GHA_CONFIG.vercel.projectId).toContain('VERCEL_PROJECT_ID');
    });
    
    it('a budgets Lighthouse par défaut', () => {
      expect(DEFAULT_GHA_CONFIG.lighthouse.budgets.performance).toBe(90);
      expect(DEFAULT_GHA_CONFIG.lighthouse.budgets.accessibility).toBe(95);
      expect(DEFAULT_GHA_CONFIG.lighthouse.budgets.bestPractices).toBe(90);
      expect(DEFAULT_GHA_CONFIG.lighthouse.budgets.seo).toBe(90);
    });
    
    it('a projets Playwright par défaut', () => {
      expect(DEFAULT_GHA_CONFIG.playwright.projects).toBeDefined();
      expect(DEFAULT_GHA_CONFIG.playwright.projects!.length).toBe(5);
    });
  });
  
  describe('mergeConfig', () => {
    it('merge config utilisateur avec défauts', () => {
      const merged = mergeConfig({
        projectName: 'mon-projet',
        nodeVersion: '18',
        jobs: { lint: false },
      });
      
      expect(merged.projectName).toBe('mon-projet');
      expect(merged.nodeVersion).toBe('18');
      expect(merged.jobs.lint).toBe(false);
      expect(merged.jobs.typecheck).toBe(true); // défaut conservé
    });
    
    it('merge nested objects', () => {
      const merged = mergeConfig({
        lighthouse: { budgets: { performance: 80 } },
      });
      
      expect(merged.lighthouse.budgets.performance).toBe(80);
      expect(merged.lighthouse.budgets.accessibility).toBe(95); // défaut conservé
    });
  });
});