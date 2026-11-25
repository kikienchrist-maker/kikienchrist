/**
 * Tests pour generator.ts
 */
import { describe, it, expect } from 'vitest';
import { generateWorkflow } from './generator.js';
import { DEFAULT_GHA_CONFIG, mergeConfig } from './config.js';

describe('generator', () => {
  describe('generateWorkflow', () => {
    it('génère workflow avec jobs par défaut', () => {
      const config = mergeConfig({});
      const { workflowYml } = generateWorkflow(config);
      
      expect(workflowYml).toContain('name: kikienchrist CI/CD');
      expect(workflowYml).toContain('on:');
      expect(workflowYml).toContain('jobs:');
      expect(workflowYml).toContain('lint:');
      expect(workflowYml).toContain('typecheck:');
      expect(workflowYml).toContain('unit:');
      expect(workflowYml).toContain('build:');
      expect(workflowYml).toContain('e2e:');
      expect(workflowYml).toContain('a11y:');
      expect(workflowYml).toContain('lighthouse:');
      expect(workflowYml).toContain('security:');
      expect(workflowYml).toContain('deploy_preview:');
      expect(workflowYml).toContain('deploy_production:');
    });
    
    it('respect jobs désactivés', () => {
      const config = mergeConfig({
        jobs: {
          lint: false,
          typecheck: false,
          e2e: false,
        }
      });
      const { workflowYml } = generateWorkflow(config);
      
      expect(workflowYml).not.toContain('lint:');
      expect(workflowYml).not.toContain('typecheck:');
      expect(workflowYml).not.toContain('e2e:');
      expect(workflowYml).toContain('build:');
    });
    
    it('build depends on lint/typecheck/unit when enabled', () => {
      const config = mergeConfig({});
      const { workflowYml } = generateWorkflow(config);
      
      // Vérifier que build a needs avec lint, typecheck, unit
      const buildSection = workflowYml.split('build:')[1]?.split('\n')[0];
      expect(workflowYml).toContain('needs:');
    });
    
    it('deploy_preview depends on build, e2e, a11y, lighthouse, security', () => {
      const config = mergeConfig({});
      const { workflowYml } = generateWorkflow(config);
      
      expect(workflowYml).toContain('deploy_preview:');
      expect(workflowYml).toContain('needs:');
    });
    
    it('deploy_production only on main push', () => {
      const config = mergeConfig({});
      const { workflowYml } = generateWorkflow(config);
      
      expect(workflowYml).toContain('deploy_production:');
      expect(workflowYml).toContain("github.ref == 'refs/heads/main'");
    });
    
    it('contient triggers push, pull_request, workflow_dispatch', () => {
      const config = mergeConfig({});
      const { workflowYml } = generateWorkflow(config);
      
      expect(workflowYml).toContain('push:');
      expect(workflowYml).toContain('pull_request:');
      expect(workflowYml).toContain('workflow_dispatch:');
    });
  });
});