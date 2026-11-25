/**
 * Tests pour middleware.ts
 */
import { describe, it, expect } from 'vitest';
import { generateMiddlewareCode, generateEdgeMiddlewareCode } from './middleware.js';
import { UI_LANGS, DEFAULT_LANG } from './config.js';

describe('middleware', () => {
  describe('generateMiddlewareCode', () => {
    it('génère du code TypeScript valide', () => {
      const code = generateMiddlewareCode();
      expect(code).toContain('defineMiddleware');
      expect(code).toContain('SUPPORTED_LANGS');
      expect(code).toContain('DEFAULT_LANG');
      expect(code).toContain('COOKIE_NAME');
      expect(code).toContain('onRequest');
      expect(code).toContain('locals.lang');
    });
    
    it('inclut toutes les langues supportées', () => {
      const code = generateMiddlewareCode();
      for (const lang of UI_LANGS) {
        expect(code).toContain(`"${lang}"`);
      }
    });
    
    it('gère les options personnalisées', () => {
      const code = generateMiddlewareCode({
        cookieName: 'custom-lang',
        cookieMaxAge: 3600,
        defaultLang: 'en',
        supportedLangs: ['en', 'fr'],
        enableAutoDetect: false,
      });
      expect(code).toContain('custom-lang');
      expect(code).toContain('3600');
      expect(code).toContain('DEFAULT_LANG = \'en\'');
      // Quand enableAutoDetect=false, acceptLang est mis à null
      expect(code).toContain('const acceptLang = null;');
    });
  });
  
  describe('generateEdgeMiddlewareCode', () => {
    it('génère du code pour Edge/Next.js', () => {
      const code = generateEdgeMiddlewareCode();
      expect(code).toContain('NextResponse');
      expect(code).toContain('NextRequest');
      expect(code).toContain('middleware');
      expect(code).toContain('config');
      expect(code).toContain('matcher');
    });
  });
});