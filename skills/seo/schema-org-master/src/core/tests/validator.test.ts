// validator.test.ts — Unit Tests for Validator (schema-org-master)
import { describe, it, expect } from 'vitest';
import { validate, validateForGoogle } from '../src/validator';
import type { KikiBook, KikiProduct, KikiOrganization } from '../src/types';

describe('Validator — Zod Schema Validation', () => {
  // Helper: livre valide minimal
  const validBook: KikiBook = {
    '@type': 'Book',
    '@context': 'https://schema.org',
    name: 'Test Book',
    isbn: '9791035977887',
    author: { '@type': 'Person', name: 'Author' },
    inLanguage: 'fr',
    numberOfPages: 100,
    datePublished: '2024-01-01T00:00:00Z',
    offers: [{ '@type': 'Offer', price: 10, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }],
  };

  it('should pass valid Book', () => {
    const result = validate(validBook);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.schemaType).toBe('Book');
  });

  it('should fail missing @type', () => {
    const { '@type': _, ...noType } = validBook;
    const result = validate(noType);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'MISSING_TYPE')).toBe(true);
  });

  it('should fail invalid ISBN', () => {
    const book = { ...validBook, isbn: 'invalid' };
    const result = validate(book);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path.includes('isbn'))).toBe(true);
  });

  it('should fail missing required fields (name, author, isbn, inLanguage)', () => {
    const book = { ...validBook };
    delete (book as any).name;
    const result = validate(book);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === 'name')).toBe(true);
  });

  it('should validate @graph array', () => {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [validBook, { ...validBook, '@id': 'https://example.com/other', name: 'Other' }],
    };
    const result = validate(graph);
    expect(result.valid).toBe(true);
    expect(result.schemaType).toBe('@graph');
  });

  it('should collect errors from all @graph nodes', () => {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [validBook, { '@type': 'Book', name: 'Invalid' }], // missing required
    };
    const result = validate(graph);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('Validator — Google Rich Results Rules', () => {
  const validBook = {
    '@type': 'Book',
    '@context': 'https://schema.org',
    name: 'Test Book',
    isbn: '9791035977887',
    author: { '@type': 'Person', name: 'Author' },
    inLanguage: 'fr',
    numberOfPages: 100,
    datePublished: '2024-01-01T00:00:00Z',
    description: 'A test book',
    image: 'https://example.com/book.jpg',
    publisher: { '@type': 'Organization', name: 'Publisher' },
    offers: [{ '@type': 'Offer', price: 10, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.5, reviewCount: 10 },
    genre: 'Fiction',
    bookFormat: 'Paperback',
  };

  it('should be Google eligible with all required + recommended', () => {
    const result = validateForGoogle(validBook);
    expect(result.valid).toBe(true);
    expect(result.richResultsEligible).toBe(true);
    expect(result.missingRequiredFields).toHaveLength(0);
  });

  it('should fail Google required: missing offers', () => {
    const { offers, ...noOffers } = validBook;
    const result = validateForGoogle(noOffers);
    expect(result.richResultsEligible).toBe(false);
    expect(result.missingRequiredFields).toContain('offers');
  });

  it('should warn Google recommended: missing aggregateRating', () => {
    const { aggregateRating, ...noRating } = validBook;
    const result = validateForGoogle(noRating);
    expect(result.richResultsEligible).toBe(true); // encore éligible si required OK
    expect(result.missingRecommendedFields).toContain('aggregateRating');
  });

  it('should validate Product requires offers', () => {
    const product = {
      '@type': 'Product',
      name: 'Test Product',
      offers: [{ '@type': 'Offer', price: 10, priceCurrency: 'EUR' }],
    };
    const result = validateForGoogle(product);
    expect(result.valid).toBe(true);
    expect(result.richResultsEligible).toBe(true);
  });

  it('should fail Product missing offers (Google required)', () => {
    const product = { '@type': 'Product', name: 'Test' };
    const result = validateForGoogle(product);
    expect(result.richResultsEligible).toBe(false);
    expect(result.missingRequiredFields).toContain('offers');
  });

  it('should validate Organization requires only name', () => {
    const org = { '@type': 'Organization', name: 'Test Org' };
    const result = validateForGoogle(org);
    expect(result.richResultsEligible).toBe(true);
  });

  it('should validate WebSite requires name + url', () => {
    const ws = { '@type': 'WebSite', name: 'Test', url: 'https://example.com' };
    const result = validateForGoogle(ws);
    expect(result.richResultsEligible).toBe(true);
  });

  it('should fail WebSite missing url', () => {
    const ws = { '@type': 'WebSite', name: 'Test' };
    const result = validateForGoogle(ws);
    expect(result.richResultsEligible).toBe(false);
    expect(result.missingRequiredFields).toContain('url');
  });

  it('should validate FAQPage requires mainEntity', () => {
    const faq = {
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A' } }],
    };
    const result = validateForGoogle(faq);
    expect(result.richResultsEligible).toBe(true);
  });

  it('should validate Article requires headline, author, datePublished, image, publisher', () => {
    const article = {
      '@type': 'Article',
      headline: 'Test',
      author: { '@type': 'Person', name: 'Author' },
      datePublished: '2024-01-01T00:00:00Z',
      image: 'https://example.com/img.jpg',
      publisher: { '@type': 'Organization', name: 'Pub' },
    };
    const result = validateForGoogle(article);
    expect(result.richResultsEligible).toBe(true);
  });

  it('should check Article image should be ImageObject', () => {
    const article = {
      '@type': 'Article',
      headline: 'Test',
      author: { '@type': 'Person', name: 'Author' },
      datePublished: '2024-01-01T00:00:00Z',
      image: 'https://example.com/img.jpg', // string au lieu d'objet
      publisher: { '@type': 'Organization', name: 'Pub' },
    };
    const result = validateForGoogle(article);
    expect(result.missingRecommendedFields.some(f => f.includes('image'))).toBe(true);
  });

  it('should check Product offers need priceCurrency and availability', () => {
    const product = {
      '@type': 'Product',
      name: 'Test',
      offers: [{ '@type': 'Offer', price: 10 }], // missing priceCurrency, availability
    };
    const result = validateForGoogle(product);
    expect(result.missingRequiredFields.some(f => f.includes('priceCurrency'))).toBe(true);
    expect(result.missingRecommendedFields.some(f => f.includes('availability'))).toBe(true);
  });
});

describe('Validator — Edge Cases', () => {
  it('should handle unknown @type gracefully', () => {
    const unknown = { '@type': 'UnknownType', name: 'Test' };
    const result = validate(unknown);
    expect(result.valid).toBe(true); // pas d'erreur, juste warning
    expect(result.warnings.some(w => w.code === 'UNKNOWN_TYPE')).toBe(true);
  });

  it('should validate nested arrays (author array)', () => {
    const book = {
      '@type': 'Book',
      name: 'Test',
      isbn: '9791035977887',
      author: [{ '@type': 'Person', name: 'A1' }, { '@type': 'Person', name: 'A2' }],
      inLanguage: 'fr',
      numberOfPages: 100,
      datePublished: '2024-01-01T00:00:00Z',
      offers: [{ '@type': 'Offer', price: 10, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }],
    };
    const result = validate(book);
    expect(result.valid).toBe(true);
  });

  it('should validate image as array', () => {
    const book = {
      '@type': 'Book',
      name: 'Test',
      isbn: '9791035977887',
      author: { '@type': 'Person', name: 'Author' },
      inLanguage: 'fr',
      numberOfPages: 100,
      datePublished: '2024-01-01T00:00:00Z',
      image: ['https://ex.com/1.jpg', 'https://ex.com/2.jpg'],
      offers: [{ '@type': 'Offer', price: 10, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }],
    };
    const result = validate(book);
    expect(result.valid).toBe(true);
  });

  it('should detect missing field in nested object path', () => {
    const book = {
      '@type': 'Book',
      name: 'Test',
      isbn: '9791035977887',
      author: { '@type': 'Person' }, // missing name
      inLanguage: 'fr',
      numberOfPages: 100,
      datePublished: '2024-01-01T00:00:00Z',
      offers: [{ '@type': 'Offer', price: 10, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' }],
    };
    const result = validate(book);
    expect(result.valid).toBe(false);
    // Zod peut reporter le chemin comme 'author' ou 'author.name' selon l'union
    expect(result.errors.some(e => e.path.includes('author'))).toBe(true);
  });
});

describe('ValidationReporter', () => {
  let ValidationReporter: any;
  beforeAll(async () => {
    const mod = await import('../src/validator');
    ValidationReporter = mod.ValidationReporter;
  });

  it('should format console output', () => {
    const result = validate({ '@type': 'Book', name: 'Test' }); // invalid
    const output = ValidationReporter.formatConsole(result);
    expect(output).toContain('❌');
    expect(output).toContain('FAILED');
    expect(output).toContain('ERRORS');
  });

  it('should format JSON output', () => {
    const result = validate({ '@type': 'Book', name: 'Test', isbn: '9791035977887', author: { '@type': 'Person', name: 'A' }, inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' });
    const output = ValidationReporter.formatJson(result);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('should format HTML output', () => {
    const result = validate({ '@type': 'Book', name: 'Test', isbn: '9791035977887', author: { '@type': 'Person', name: 'A' }, inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' });
    const output = ValidationReporter.formatHtml(result);
    expect(output).toContain('<div class="validation-report');
    expect(output).toContain('Valid');
  });
});