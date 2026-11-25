/**
 * Tests pour netlify.ts
 */
import { describe, it, expect } from 'vitest';
import { generateNetlifyConfig, generateIdentityWidgetCode } from './netlify.js';

describe('netlify', () => {
  describe('generateNetlifyConfig', () => {
    it('génère config Identity valide', () => {
      const { identity } = generateNetlifyConfig({ 
        outputDir: '.', 
        siteUrl: 'https://example.com' 
      });
      
      expect(identity.enabled).toBe(true);
      expect(identity.url).toBe('https://example.com');
      expect(identity.audience).toBe('https://example.com');
      expect(identity.external_providers).toContain('google');
      expect(identity.external_providers).toContain('github');
      expect(identity.registration_preferences).toBe('email_password');
      expect(identity.email_templates).toBeDefined();
      expect(identity.email_templates!.signup).toContain('ConfirmationURL');
      expect(identity.email_templates!.recovery).toContain('RecoveryURL');
    });
    
    it('génère config Git Gateway valide', () => {
      const { gitGateway } = generateNetlifyConfig({ 
        outputDir: '.', 
        siteUrl: 'https://example.com' 
      });
      
      expect(gitGateway.enabled).toBe(true);
      expect(gitGateway.branch).toBe('main');
    });
    
    it('permet de surcharger les options', () => {
      const { identity, gitGateway } = generateNetlifyConfig({ 
        outputDir: '.', 
        siteUrl: 'https://example.com',
        identity: { external_providers: ['github'] },
        gitGateway: { branch: 'develop' }
      });
      
      expect(identity.external_providers).toEqual(['github']);
      expect(gitGateway.branch).toBe('develop');
    });
  });
  
  describe('generateIdentityWidgetCode', () => {
    it('génère le code du widget', () => {
      const code = generateIdentityWidgetCode('https://example.com');
      
      expect(code).toContain('netlify-identity-widget.js');
      expect(code).toContain('https://example.com/.netlify/identity');
      expect(code).toContain('netlifyIdentity.init');
      expect(code).toContain('netlifyIdentity.on("login"');
    });
  });
});