// context.test.ts — Unit Tests for JSON-LD Context (schema-org-master)
import { describe, it, expect } from 'vitest';
import {
  BASE_SCHEMA_CONTEXT,
  createContext,
  createStrictContext,
  mergeContexts,
  compactJsonLd,
  expandJsonLd,
  stringifyJsonLd,
  parseJsonLd,
  mergeJsonLdGraphs,
} from '../src/context';
import type { JsonLdContext } from '../src/types';

describe('Context Management', () => {
  describe('BASE_SCHEMA_CONTEXT', () => {
    it('should have required properties', () => {
      expect(BASE_SCHEMA_CONTEXT['@vocab']).toBe('https://schema.org/');
      expect(BASE_SCHEMA_CONTEXT['@language']).toBe('fr');
    });
  });

  describe('createContext', () => {
    it('should create context with language', () => {
      const ctx = createContext('fr');
      expect(ctx['@vocab']).toBe('https://schema.org/');
      expect(ctx['@language']).toBe('fr');
    });

    it('should create context for different languages', () => {
      const ctxEn = createContext('en');
      expect(ctxEn['@language']).toBe('en');

      const ctxAr = createContext('ar');
      expect(ctxAr['@language']).toBe('ar');
    });

    it('should include Kiki extensions', () => {
      const ctx = createContext('fr');
      expect(ctx.kikiSeries).toBeDefined();
      expect(ctx.kikiBookNumber).toBeDefined();
      expect(ctx.kikiHook).toBeDefined();
      expect(ctx.kikiBenefits).toBeDefined();
    });
  });

  describe('createStrictContext', () => {
    it('should create minimal context without extensions', () => {
      const ctx = createStrictContext('fr');
      expect(ctx['@vocab']).toBe('https://schema.org/');
      expect(ctx['@language']).toBe('fr');
      expect(ctx.kikiSeries).toBeUndefined();
    });
  });

  describe('mergeContexts', () => {
    it('should merge two contexts', () => {
      const ctx1: JsonLdContext = { '@vocab': 'https://schema.org/', '@language': 'fr', custom1: 'val1' };
      const ctx2: JsonLdContext = { '@base': 'https://example.com/', custom2: 'val2' };
      const merged = mergeContexts(ctx1, ctx2);

      expect(merged['@vocab']).toBe('https://schema.org/');
      expect(merged['@language']).toBe('fr');
      expect(merged['@base']).toBe('https://example.com/');
      expect(merged.custom1).toBe('val1');
      expect(merged.custom2).toBe('val2');
    });

    it('should override with second context', () => {
      const ctx1: JsonLdContext = { '@language': 'fr', custom: 'val1' };
      const ctx2: JsonLdContext = { '@language': 'en', custom: 'val2' };
      const merged = mergeContexts(ctx1, ctx2);

      expect(merged['@language']).toBe('en');
      expect(merged.custom).toBe('val2');
    });
  });

  describe('compactJsonLd / expandJsonLd', () => {
    it('should compact with @vocab', () => {
      const expanded = {
        'https://schema.org/name': 'Test',
        'https://schema.org/isbn': '9781234567897',
      };
      const context: JsonLdContext = { '@vocab': 'https://schema.org/' };
      const compacted = compactJsonLd(expanded, context);

      expect(compacted.name).toBe('Test');
      expect(compacted.isbn).toBe('9781234567897');
    });

    it('should expand with @vocab', () => {
      const compacted = { name: 'Test', isbn: '9781234567897' };
      const context: JsonLdContext = { '@vocab': 'https://schema.org/' };
      const expanded = expandJsonLd(compacted, context);

      expect(expanded['https://schema.org/name']).toBe('Test');
      expect(expanded['https://schema.org/isbn']).toBe('9781234567897');
    });
  });

  describe('stringifyJsonLd', () => {
    it('should stringify with pretty print', () => {
      const data = { '@type': 'Book', name: 'Test' };
      const context: JsonLdContext = { '@vocab': 'https://schema.org/', '@language': 'fr' };
      const str = stringifyJsonLd(data, { pretty: true, context });

      expect(str).toContain('"@context"');
      expect(str).toContain('"@type": "Book"');
      expect(str).toContain('"name": "Test"');
      expect(str).toContain('\n'); // pretty
    });

    it('should stringify without pretty', () => {
      const data = { '@type': 'Book', name: 'Test' };
      const context: JsonLdContext = { '@vocab': 'https://schema.org/' };
      const str = stringifyJsonLd(data, { pretty: false, context });

      expect(str).not.toContain('\n');
    });

    it('should handle @graph array', () => {
      const data = { '@graph': [{ '@type': 'Book', name: 'A' }, { '@type': 'Book', name: 'B' }] };
      const context: JsonLdContext = { '@vocab': 'https://schema.org/' };
      const str = stringifyJsonLd(data, { pretty: true, context });

      expect(str).toContain('"@graph"');
      expect(str).toContain('"name": "A"');
      expect(str).toContain('"name": "B"');
    });
  });

  describe('parseJsonLd', () => {
    it('should parse valid JSON-LD string', () => {
      const str = '{"@context":"https://schema.org/","@type":"Book","name":"Test"}';
      const parsed = parseJsonLd(str);

      expect(parsed['@type']).toBe('Book');
      expect(parsed.name).toBe('Test');
    });

    it('should throw on invalid JSON', () => {
      expect(() => parseJsonLd('invalid json')).toThrow();
    });
  });

  describe('mergeJsonLdGraphs', () => {
    it('should merge multiple graphs deduplicating by @id', () => {
      const graph1 = {
        '@context': 'https://schema.org/',
        '@graph': [
          { '@type': 'Book', '@id': 'book1', name: 'Book 1' },
          { '@type': 'Organization', '@id': 'org1', name: 'Org 1' },
        ],
      };
      const graph2 = {
        '@context': 'https://schema.org/',
        '@graph': [
          { '@type': 'Book', '@id': 'book1', name: 'Book 1 Updated' }, // duplicate @id
          { '@type': 'Book', '@id': 'book2', name: 'Book 2' },
        ],
      };

      const merged = mergeJsonLdGraphs(graph1, graph2);

      expect(merged['@graph']).toHaveLength(3); // book1 (merged), org1, book2
      const book1 = merged['@graph'].find((n: any) => n['@id'] === 'book1');
      expect(book1.name).toBe('Book 1 Updated'); // dernier gagne
    });

    it('should handle objects without @graph', () => {
      const obj1 = { '@context': 'https://schema.org/', '@type': 'Book', '@id': 'book1', name: 'Book 1' };
      const obj2 = { '@context': 'https://schema.org/', '@type': 'Organization', '@id': 'org1', name: 'Org 1' };

      const merged = mergeJsonLdGraphs(obj1, obj2);

      expect(merged['@graph']).toHaveLength(2);
    });

    it('should deduplicate by @type + name when no @id', () => {
      const graph1 = {
        '@context': 'https://schema.org/',
        '@graph': [{ '@type': 'Book', name: 'Book 1' }],
      };
      const graph2 = {
        '@context': 'https://schema.org/',
        '@graph': [{ '@type': 'Book', name: 'Book 1' }], // same type+name
      };

      const merged = mergeJsonLdGraphs(graph1, graph2);

      expect(merged['@graph']).toHaveLength(1);
    });

    it('should preserve context from first', () => {
      const graph1 = { '@context': { '@vocab': 'https://schema.org/', '@language': 'fr' }, '@graph': [] };
      const graph2 = { '@context': { '@vocab': 'https://schema.org/', '@language': 'en' }, '@graph': [] };

      const merged = mergeJsonLdGraphs(graph1, graph2);

      expect(merged['@context']['@language']).toBe('fr');
    });
  });
});