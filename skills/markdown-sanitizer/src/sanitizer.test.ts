import { describe, it, expect } from 'vitest';
import { sanitizeMarkdown, serializeMarkdownClean, type SanitizeOptions } from './index.js';

describe('sanitizeMarkdown - Blog', () => {
  const baseOptions: SanitizeOptions = {
    collection: 'blog',
    sourceLang: 'fr',
    knownBaseSlugs: ['entendre-voix-dieu', 'guerre-spirituelle-priere-autorite'],
    autoFix: true,
  };
  
  it('fixes minimal blog frontmatter with defaults', () => {
    const content = `---
title: "Test Article"
lang: fr
---
# Body`;
    
    const result = sanitizeMarkdown(content, baseOptions);
    expect(result.success).toBe(true);
    expect(result.frontmatter.title).toBe('Test Article');
    expect(result.frontmatter.lang).toBe('fr');
    expect(result.frontmatter.category).toBe('vie-chrétienne'); // défaut
    expect(result.frontmatter.tags).toEqual([]); // défaut
    expect(result.frontmatter.slug).toBeDefined();
    expect(result.frontmatter.translationKey).toBeDefined();
    expect(result.frontmatter.readingTime).toBe(10); // défaut
    expect(result.fixes.length).toBeGreaterThan(0);
  });
  
  it('corrects invalid category', () => {
    const content = `---
title: "Test"
lang: fr
category: "invalid-category"
---
# Body`;
    
    const result = sanitizeMarkdown(content, baseOptions);
    expect(result.frontmatter.category).toBe('vie-chrétienne');
    expect(result.warnings.some(w => w.includes('Catégorie invalide'))).toBe(true);
  });
  
  it('handles nested frontmatter from Ollama', () => {
    const content = `---
lang: "ar"
slug: "entendre-voix-dieu"
---
\`\`\`markdown
---
title: "كيف نسمع صوت الله"
description: "وصف باللغة العربية"
category: "التمييز"
tags: ["صوت الله", "التمييز"]
---
# المحتوى العربي
\`\`\``;
    
    const result = sanitizeMarkdown(content, { ...baseOptions, sourceLang: 'ar' });
    // hadNestedFm n'est pas exposé dans SanitizeResult, on teste le résultat final
    expect(result.frontmatter.title).toBe('كيف نسمع صوت الله');
    expect(result.frontmatter.category).toBe('vie-chrétienne'); // catégorie par défaut (mapping non implémenté)
    expect(result.frontmatter.lang).toBe('ar');
    expect(result.frontmatter.slug).toBe('entendre-voix-dieu'); // slug du frontmatter outer conservé
  });
  
  it('generates correct translation slugs', () => {
    const content = `---
title: "Test"
lang: en
translationKey: "entendre-voix-dieu"
---
# Body`;
    
    const result = sanitizeMarkdown(content, { ...baseOptions, sourceLang: 'en' });
    expect(result.frontmatter.slug).toBe('entendre-voix-dieu-en');
    expect(result.frontmatter.translationKey).toBe('entendre-voix-dieu');
  });
  
  it('validates required fields', () => {
    const content = `---
lang: fr
---
# Body only`;
    
    const result = sanitizeMarkdown(content, baseOptions);
    // autoFix=true (défaut) ajoute les défauts, donc pas d'erreur bloquante
    // Mais on peut tester que les défauts sont appliqués
    expect(result.frontmatter.title).toBe('Sans titre');
    expect(result.frontmatter.description).toBe('Description manquante - à compléter');
  });
});

describe('sanitizeMarkdown - Legal Pages', () => {
  const baseOptions: SanitizeOptions = {
    collection: 'legal',
    sourceLang: 'fr',
    knownBaseSlugs: ['mentions-legales', 'confidentialite'],
    autoFix: true,
  };
  
  it('validates legal page frontmatter', () => {
    const content = `---
title: "Mentions Légales"
pageSlug: "mentions-legales"
lang: fr
lastUpdated: "2025-01-15"
---
# Content`;
    
    const result = sanitizeMarkdown(content, baseOptions);
    expect(result.success).toBe(true);
    expect(result.frontmatter.pageSlug).toBe('mentions-legales');
    expect(result.frontmatter.lang).toBe('fr');
  });
  
  it('adds missing required fields', () => {
    const content = `---
lang: en
---
# Content`;
    
    const result = sanitizeMarkdown(content, { ...baseOptions, sourceLang: 'en' });
    expect(result.frontmatter.title).toBe('Sans titre');
    expect(result.frontmatter.pageSlug).toBeDefined();
    expect(result.frontmatter.lastUpdated).toBeDefined();
  });
});

describe('sanitizeMarkdown - Edge cases', () => {
  it('handles double-escaped YAML tags', () => {
    const content = `---
title: "Test"
lang: fr
tags: "[\\"tag1\\", \\"tag2\\"]"
---
# Body`;
    
    const result = sanitizeMarkdown(content, { 
      collection: 'blog', 
      sourceLang: 'fr',
      autoFix: true 
    });
    expect(result.frontmatter.tags).toEqual(['tag1', 'tag2']);
    // Le fix est fait dans normalizeFrontmatterTypes, pas dans sanitizeMarkdown
    // On vérifie juste le résultat
    expect(Array.isArray(result.frontmatter.tags)).toBe(true);
  });
  
  it('preserves body content exactly', () => {
    const body = `# Titre\n\nContenu avec **gras** et *italique*.\n\n> Citation\n\n- Liste\n- Items`;
    const content = `---
title: "Test"
lang: fr
---
${body}`;
    
    const result = sanitizeMarkdown(content, { 
      collection: 'blog', 
      sourceLang: 'fr' 
    });
    expect(result.content).toContain(body);
  });
  
  it('serializes clean markdown', () => {
    const content = `---
title: "Test"
lang: fr
tags: ["tag1", "tag2"]
featured: true
---
# Body`;
    
    const result = sanitizeMarkdown(content, { 
      collection: 'blog', 
      sourceLang: 'fr' 
    });
    
    // Vérifier structure
    expect(result.content.startsWith('---')).toBe(true);
    expect(result.content).toContain('title: "Test"');
    expect(result.content).toContain('lang: "fr"');
    expect(result.content).toContain('tags: ["tag1", "tag2"]');
    expect(result.content).toContain('featured: true');
    expect(result.content).toContain('# Body');
  });
});

describe('serializeMarkdownClean', () => {
  it('produces valid YAML frontmatter', () => {
    const fm = {
      title: 'Test',
      lang: 'fr',
      tags: ['tag1', 'tag2'],
      featured: true,
      readingTime: 10,
    };
    const body = '# Body';
    
    const result = serializeMarkdownClean(fm, body);
    expect(result).toContain('title: "Test"');
    expect(result).toContain('tags: ["tag1", "tag2"]');
    expect(result).toContain('featured: true');
    expect(result).toContain('readingTime: 10');
    expect(result.startsWith('---')).toBe(true);
  });
});