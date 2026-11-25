// validator/index.ts — Validator Entry Point (schema-org-master)
// Validation runtime avec Zod + règles Google Rich Results

import { z } from 'zod';
import type {
  ValidationError,
  ValidationResult,
  GoogleValidationResult,
  SupportedSchemaType,
  JsonLdObject,
  KikiBook,
  KikiProduct,
  KikiOffer,
  KikiOrganization,
  KikiWebSite,
  KikiBreadcrumbList,
  KikiFAQPage,
  KikiArticle,
  KikiReview,
} from '../types';

// ============================================================================
// ZOD SCHEMAS — Par type Schema.org (strict)
// ============================================================================

// Helpers
const urlSchema = z.string().url();
const isoDateSchema = z.string().datetime({ offset: true }).or(z.string().date());
const positiveNumber = z.number().positive();
const currencySchema = z.string().length(3); // ISO 4217
const langSchema = z.string().min(2).max(8); // BCP 47

// Base schema avec @type discriminé
const baseSchema = z.object({
  '@type': z.string().min(1),
  '@id': z.string().url().optional(),
  '@context': z.union([z.string().url(), z.record(z.unknown())]).optional(),
});

// Book Schema
export const BookSchema = baseSchema.extend({
  '@type': z.literal('Book'),
  name: z.string().min(1),
  isbn: z.string().regex(/^(?:\d{10}|\d{13})$/, 'Invalid ISBN'),
  author: z.union([
    z.object({ '@type': z.literal('Person'), name: z.string() }),
    z.array(z.object({ '@type': z.literal('Person'), name: z.string() })),
    z.string(),
  ]),
  inLanguage: langSchema,
  numberOfPages: positiveNumber,
  datePublished: isoDateSchema,
  description: z.string().optional(),
  image: z.union([urlSchema, z.array(urlSchema)]).optional(),
  publisher: z.object({
    '@type': z.literal('Organization'),
    name: z.string(),
    url: urlSchema.optional(),
  }).optional(),
  offers: z.array(z.object({
    '@type': z.literal('Offer'),
    price: positiveNumber,
    priceCurrency: currencySchema,
    availability: z.string().url().optional(),
    seller: z.object({
      '@type': z.literal('Organization'),
      name: z.string(),
    }).optional(),
    url: urlSchema.optional(),
  })).optional(),
  aggregateRating: z.object({
    '@type': z.literal('AggregateRating'),
    ratingValue: z.number().min(1).max(5),
    reviewCount: z.number().int().nonnegative(),
    bestRating: z.number().default(5),
    worstRating: z.number().default(1),
  }).optional(),
  review: z.array(z.object({
    '@type': z.literal('Review'),
    author: z.object({ '@type': z.literal('Person'), name: z.string() }),
    reviewBody: z.string(),
    reviewRating: z.object({
      '@type': z.literal('Rating'),
      ratingValue: z.number().min(1).max(5),
    }),
    datePublished: isoDateSchema,
  })).optional(),
  genre: z.union([z.string(), z.array(z.string())]).optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  bookFormat: z.enum(['Paperback', 'EBook', 'Audiobook']).optional(),
  // Extensions Kiki
  kikiSeries: z.literal('Kiki en Christ').optional(),
  kikiBookNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  kikiHook: z.string().optional(),
  kikiBenefits: z.tuple([z.string(), z.string(), z.string()]).optional(),
  kikiAvailableFormats: z.array(z.enum(['Paperback', 'EBook', 'Audiobook'])).optional(),
  kikiPrices: z.record(z.enum(['Paperback', 'EBook', 'Audiobook']), z.object({
    amount: positiveNumber,
    currency: currencySchema,
  })).optional(),
}) satisfies z.ZodType<KikiBook>;

// Product Schema
export const ProductSchema = baseSchema.extend({
  '@type': z.literal('Product'),
  name: z.string().min(1),
  sku: z.string().optional(),
  gtin13: z.string().regex(/^\d{13}$/).optional(),
  brand: z.object({
    '@type': z.literal('Brand'),
    name: z.string(),
  }).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  image: z.union([urlSchema, z.array(urlSchema)]).optional(),
  offers: z.array(z.object({
    '@type': z.literal('Offer'),
    price: positiveNumber,
    priceCurrency: currencySchema,
    availability: z.string().url().optional(),
    seller: z.object({
      '@type': z.literal('Organization'),
      name: z.string(),
    }).optional(),
    url: urlSchema.optional(),
  })).optional(),
  // Extensions Kiki
  kikiBookRef: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  kikiFormat: z.enum(['Paperback', 'EBook', 'Audiobook']).optional(),
  kikiSeller: z.enum(['Lulu', 'Payhip', 'Google Play']).optional(),
  kikiOriginalPrice: z.object({
    amount: positiveNumber,
    currency: currencySchema,
  }).optional(),
}) satisfies z.ZodType<KikiProduct>;

// Offer Schema
export const OfferSchema = baseSchema.extend({
  '@type': z.literal('Offer'),
  price: positiveNumber,
  priceCurrency: currencySchema,
  availability: z.string().url().optional(),
  seller: z.object({
    '@type': z.literal('Organization'),
    name: z.string(),
  }).optional(),
  url: urlSchema.optional(),
  eligibleRegion: z.union([z.string(), z.array(z.string())]).optional(),
  priceValidUntil: isoDateSchema.optional(),
  // Extensions Kiki
  kikiSeller: z.enum(['Lulu', 'Payhip', 'Google Play']).optional(),
  kikiFormat: z.enum(['Paperback', 'EBook', 'Audiobook']).optional(),
  kikiBookNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
}) satisfies z.ZodType<KikiOffer>;

// Organization Schema
export const OrganizationSchema = baseSchema.extend({
  '@type': z.literal('Organization'),
  name: z.string().min(1),
  url: urlSchema.optional(),
  logo: urlSchema.optional(),
  sameAs: z.array(urlSchema).optional(),
  email: z.string().email().optional(),
  contactPoint: z.object({
    '@type': z.literal('ContactPoint'),
    telephone: z.string(),
    contactType: z.string(),
    availableLanguage: z.array(z.string()).optional(),
  }).optional(),
  founder: z.string().optional(),
  // Extensions Kiki
  kikiFounder: z.string().optional(),
  kikiMission: z.string().optional(),
  kikiBooksCount: z.literal(4).optional(),
  kikiLanguagesCount: z.literal(11).optional(),
  kikiContactEmail: z.literal('kikienchrist@gmail.com').optional(),
}) satisfies z.ZodType<KikiOrganization>;

// WebSite Schema
export const WebSiteSchema = baseSchema.extend({
  '@type': z.literal('WebSite'),
  name: z.string().min(1),
  url: urlSchema.optional(),
  potentialAction: z.object({
    '@type': z.literal('SearchAction'),
    target: z.object({
      '@type': z.literal('EntryPoint'),
      urlTemplate: z.string(),
    }),
    queryInput: z.string(),
  }).optional(),
  publisher: z.object({
    '@type': z.literal('Organization'),
    name: z.string(),
  }).optional(),
  // Extensions Kiki
  kikiSupportedLanguages: z.array(z.string()).optional(),
  kikiDefaultLanguage: z.string().optional(),
}) satisfies z.ZodType<KikiWebSite>;

// BreadcrumbList Schema
export const BreadcrumbListSchema = baseSchema.extend({
  '@type': z.literal('BreadcrumbList'),
  itemListElement: z.array(z.object({
    '@type': z.literal('ListItem'),
    position: z.number().int().positive(),
    item: z.object({
      '@id': z.string().url(),
      name: z.string(),
    }),
  })),
}) satisfies z.ZodType<KikiBreadcrumbList>;

// FAQPage Schema
export const FAQPageSchema = baseSchema.extend({
  '@type': z.literal('FAQPage'),
  mainEntity: z.array(z.object({
    '@type': z.literal('Question'),
    name: z.string().min(1),
    acceptedAnswer: z.object({
      '@type': z.literal('Answer'),
      text: z.string().min(1),
    }),
  })).min(1),
  // Extensions Kiki
  kikiSource: z.enum(['legal', 'blog', 'manual']).optional(),
  kikiDetectedQuestions: z.number().int().nonnegative().optional(),
}) satisfies z.ZodType<KikiFAQPage>;

// Article Schema
export const ArticleSchema = baseSchema.extend({
  '@type': z.union([z.literal('Article'), z.literal('BlogPosting')]),
  headline: z.string().min(1),
  author: z.union([
    z.object({ '@type': z.literal('Person'), name: z.string() }),
    z.array(z.object({ '@type': z.literal('Person'), name: z.string() })),
    z.string(),
  ]),
  datePublished: isoDateSchema,
  dateModified: isoDateSchema.optional(),
  image: z.union([urlSchema, z.array(urlSchema)]).optional(),
  publisher: z.object({
    '@type': z.literal('Organization'),
    name: z.string(),
    logo: z.object({
      '@type': z.literal('ImageObject'),
      url: urlSchema,
    }).optional(),
  }).optional(),
  mainEntityOfPage: z.union([
    z.string().url(),
    z.object({ '@type': z.literal('WebPage'), '@id': z.string().url() }),
  ]).optional(),
  articleSection: z.string().optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.string().optional(),
  // Extensions Kiki
  kikiCategory: z.string().optional(),
  kikiTags: z.array(z.string()).optional(),
  kikiReadingTimeMinutes: z.number().int().positive().optional(),
  kikiSeries: z.string().optional(),
  kikiPartNumber: z.number().int().positive().optional(),
}) satisfies z.ZodType<KikiArticle>;

// Review Schema
export const ReviewSchema = baseSchema.extend({
  '@type': z.literal('Review'),
  author: z.object({ '@type': z.literal('Person'), name: z.string() }),
  reviewBody: z.string().min(1),
  reviewRating: z.object({
    '@type': z.literal('Rating'),
    ratingValue: z.number().min(1).max(5),
    bestRating: z.number().default(5),
    worstRating: z.number().default(1),
  }),
  datePublished: isoDateSchema,
  itemReviewed: z.object({
    '@type': z.literal('Book'),
    name: z.string(),
    '@id': z.string().url().optional(),
  }),
  // Extensions Kiki
  kikiBookNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  kikiVerifiedPurchase: z.boolean().optional(),
  kikiLanguage: z.string().optional(),
}) satisfies z.ZodType<KikiReview>;

// AggregateRating Schema
export const AggregateRatingSchema = baseSchema.extend({
  '@type': z.literal('AggregateRating'),
  ratingValue: z.number().min(1).max(5),
  reviewCount: z.number().int().nonnegative(),
  bestRating: z.number().default(5),
  worstRating: z.number().default(1),
  // Extensions Kiki
  kikiBookNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  kikiReviewCount: z.number().int().nonnegative().optional(),
  kikiRatingDistribution: z.record(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]), z.number().int().nonnegative()).optional(),
}) satisfies z.ZodType<any>; // KikiAggregateRating

// ============================================================================
// SCHEMA REGISTRY — Map @type -> ZodSchema
// ============================================================================

const SCHEMA_REGISTRY: Record<string, z.ZodSchema<any>> = {
  Book: BookSchema,
  Product: ProductSchema,
  Offer: OfferSchema,
  Organization: OrganizationSchema,
  WebSite: WebSiteSchema,
  BreadcrumbList: BreadcrumbListSchema,
  FAQPage: FAQPageSchema,
  Article: ArticleSchema,
  BlogPosting: ArticleSchema,
  Review: ReviewSchema,
  AggregateRating: AggregateRatingSchema,
};

// ============================================================================
// GOOGLE RICH RESULTS RULES — Champs requis/recommandés par type
// ============================================================================

interface GoogleRules {
  required: string[];
  recommended: string[];
}

const GOOGLE_RULES: Record<string, GoogleRules> = {
  Book: {
    required: ['name', 'author', 'isbn', 'inLanguage', 'offers'],
    recommended: ['description', 'image', 'datePublished', 'publisher', 'aggregateRating', 'genre', 'bookFormat', 'numberOfPages'],
  },
  Product: {
    required: ['name', 'offers'],
    recommended: ['description', 'image', 'brand', 'sku', 'gtin13', 'category', 'aggregateRating', 'review'],
  },
  Organization: {
    required: ['name'],
    recommended: ['url', 'logo', 'sameAs', 'contactPoint', 'founder', 'email'],
  },
  WebSite: {
    required: ['name', 'url'],
    recommended: ['potentialAction', 'publisher'],
  },
  BreadcrumbList: {
    required: ['itemListElement'],
    recommended: [],
  },
  FAQPage: {
    required: ['mainEntity'],
    recommended: [],
  },
  Article: {
    required: ['headline', 'author', 'datePublished', 'image', 'publisher'],
    recommended: ['dateModified', 'mainEntityOfPage', 'articleSection', 'keywords', 'description'],
  },
  BlogPosting: {
    required: ['headline', 'author', 'datePublished', 'image', 'publisher'],
    recommended: ['dateModified', 'mainEntityOfPage', 'articleSection', 'keywords', 'description'],
  },
  Review: {
    required: ['author', 'reviewBody', 'reviewRating', 'datePublished', 'itemReviewed'],
    recommended: ['itemReviewed.@id'],
  },
  AggregateRating: {
    required: ['ratingValue', 'reviewCount'],
    recommended: ['bestRating', 'worstRating'],
  },
};

// ============================================================================
// VALIDATOR CORE
// ============================================================================

/**
 * Valide un objet JSON-LD contre le schéma Zod correspondant
 * @param data Objet à valider (avec @type)
 * @returns ValidationResult détaillé
 */
export function validate(data: Record<string, unknown>): ValidationResult {
  const type = data['@type'];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const suggestions: ValidationError[] = [];

  // Détecter @graph (avec ou sans @type explicite)
  const isGraph = Array.isArray(data['@graph']);
  
  if (!type && !isGraph) {
    return {
      valid: false,
      errors: [{
        path: '@type',
        message: 'Missing or invalid @type',
        code: 'MISSING_TYPE',
        severity: 'error',
      }],
      warnings: [],
      suggestions: [],
      schemaType: 'unknown',
      timestamp: new Date().toISOString(),
    };
  }

  // Si c'est un @graph, valider chaque nœud
  if (isGraph) {
    const graphResults = (data['@graph'] as Record<string, unknown>[]).map((node, idx) =>
      validateNode(node, `@graph[${idx}]`)
    );
    const allErrors = graphResults.flatMap(r => r.errors);
    const allWarnings = graphResults.flatMap(r => r.warnings);
    const allSuggestions = graphResults.flatMap(r => r.suggestions);

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: allSuggestions,
      schemaType: '@graph',
      timestamp: new Date().toISOString(),
    };
  }

  // Validation nœud unique
  return validateNode(data, '');
}

function validateNode(node: Record<string, unknown>, pathPrefix: string): ValidationResult {
  const type = node['@type'];
  const schema = SCHEMA_REGISTRY[type as string];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const suggestions: ValidationError[] = [];

  if (!schema) {
    warnings.push({
      path: pathPrefix ? `${pathPrefix}.@type` : '@type',
      message: `No validator for type "${type}"`,
      code: 'UNKNOWN_TYPE',
      severity: 'warning',
      schemaType: type as string,
    });
    return { valid: true, errors, warnings, suggestions, schemaType: type as string, timestamp: new Date().toISOString() };
  }

  // Zod validation
  const result = schema.safeParse(node);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const fullPath = pathPrefix ? `${pathPrefix}.${issue.path.join('.')}` : issue.path.join('.');
      errors.push({
        path: fullPath,
        message: issue.message,
        code: issue.code,
        severity: 'error',
        schemaType: type as string,
      });
    }
  }

  // Google Rich Results rules (toujours vérifier, même si Zod échoue)
  const googleRules = GOOGLE_RULES[type as string];
  if (googleRules) {
    // Utiliser le nœud original pour vérifier les champs
    const nodeData = node as Record<string, unknown>;

    // Required fields
    for (const field of googleRules.required) {
      if (!hasField(nodeData, field)) {
        errors.push({
          path: pathPrefix ? `${pathPrefix}.${field}` : field,
          message: `Missing required field for Google Rich Results: ${field}`,
          code: 'GOOGLE_REQUIRED_MISSING',
          severity: 'error',
          schemaType: type as string,
        });
      }
    }

    // Recommended fields
    for (const field of googleRules.recommended) {
      if (!hasField(nodeData, field)) {
        warnings.push({
          path: pathPrefix ? `${pathPrefix}.${field}` : field,
          message: `Missing recommended field for Google Rich Results: ${field}`,
          code: 'GOOGLE_RECOMMENDED_MISSING',
          severity: 'warning',
          schemaType: type as string,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
    schemaType: type as string,
    timestamp: new Date().toISOString(),
  };
}

function hasField(obj: Record<string, unknown>, path: string): boolean {
  const parts = path.split('.');
  let current: unknown = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (current === null || current === undefined || typeof current !== 'object') {
      return false;
    }
    if (Array.isArray(current)) {
      // Pour arrays, vérifier si au moins un élément a le champ
      // Si c'est le dernier segment, vérifier l'existence dans les éléments
      if (i === parts.length - 1) {
        return current.some(item => item !== null && item !== undefined && typeof item === 'object' && part in (item as Record<string, unknown>));
      }
      // Sinon, vérifier récursivement sur TOUS les éléments valides
      const validItems = current.filter(item => item !== null && item !== undefined && typeof item === 'object');
      if (validItems.length === 0) return false;
      // Vérifier si AU MOINS un élément a le chemin complet restant
      const remainingPath = parts.slice(i + 1).join('.');
      return validItems.some(item => hasField(item as Record<string, unknown>, remainingPath));
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current !== undefined && current !== null;
}

// ============================================================================
// GOOGLE-SPECIFIC VALIDATOR
// ============================================================================

/**
 * Valide spécifiquement pour Google Rich Results
 * Inclut vérifications supplémentaires (ImageObject structure, etc.)
 */
export function validateForGoogle(data: Record<string, unknown>): GoogleValidationResult {
  // Si c'est un @graph, valider le premier nœud avec @type Book/Product/etc.
  let nodeToValidate = data;
  if (data['@type'] === '@graph' && Array.isArray(data['@graph'])) {
    // Trouver le premier nœud avec un type connu pour Google
    const graphNodes = data['@graph'] as Record<string, unknown>[];
    const mainNode = graphNodes.find(n => GOOGLE_RULES[n['@type'] as string]);
    if (mainNode) {
      nodeToValidate = mainNode;
    } else {
      nodeToValidate = graphNodes[0];
    }
  }

  const baseResult = validate(nodeToValidate);
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];

  // Extraire champs manquants Google
  for (const error of baseResult.errors) {
    if (error.code === 'GOOGLE_REQUIRED_MISSING') {
      missingRequired.push(error.path);
    }
  }
  for (const warning of baseResult.warnings) {
    if (warning.code === 'GOOGLE_RECOMMENDED_MISSING') {
      missingRecommended.push(warning.path);
    }
  }

  // Vérifications spécifiques Google
  const type = data['@type'];
  if (type === 'Article' || type === 'BlogPosting') {
    // Image doit être ImageObject avec url, width, height
    const image = data.image;
    if (image && !Array.isArray(image)) {
      if (typeof image === 'string') {
        missingRecommended.push('image (should be ImageObject with url, width, height)');
      } else if (typeof image === 'object' && !('url' in image)) {
        missingRequired.push('image.url');
      }
    }
    // Publisher logo
    const publisher = data.publisher;
    if (publisher && typeof publisher === 'object' && !('logo' in publisher)) {
      missingRecommended.push('publisher.logo');
    }
  }

  if (type === 'Product') {
    // Offers doivent avoir priceCurrency, availability
    const offers = data.offers;
    if (Array.isArray(offers)) {
      for (let i = 0; i < offers.length; i++) {
        const offer = offers[i];
        if (offer && typeof offer === 'object') {
          if (!offer.priceCurrency) missingRequired.push(`offers[${i}].priceCurrency`);
          if (!offer.availability) missingRecommended.push(`offers[${i}].availability`);
        }
      }
    }
  }

  return {
    ...baseResult,
    richResultsEligible: baseResult.valid && missingRequired.length === 0,
    missingRequiredFields: missingRequired,
    missingRecommendedFields: missingRecommended,
  };
}

// ============================================================================
// REPORTER — Formattage sorties
// ============================================================================

export class ValidationReporter {
  static formatConsole(result: ValidationResult): string {
    const lines: string[] = [];
    const icon = result.valid ? '✅' : '❌';
    lines.push(`${icon} Validation ${result.valid ? 'PASSED' : 'FAILED'} — ${result.schemaType}`);

    if (result.errors.length > 0) {
      lines.push('\n🔴 ERRORS:');
      for (const e of result.errors) {
        lines.push(`  • ${e.path}: ${e.message} [${e.code}]`);
      }
    }

    if (result.warnings.length > 0) {
      lines.push('\n🟡 WARNINGS:');
      for (const w of result.warnings) {
        lines.push(`  • ${w.path}: ${w.message} [${w.code}]`);
      }
    }

    if (result.suggestions.length > 0) {
      lines.push('\n💡 SUGGESTIONS:');
      for (const s of result.suggestions) {
        lines.push(`  • ${s.path}: ${s.message} [${s.code}]`);
      }
    }

    if ('richResultsEligible' in result) {
      const gResult = result as GoogleValidationResult;
      lines.push(`\n🎯 Google Rich Results: ${gResult.richResultsEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`);
      if (gResult.missingRequiredFields.length > 0) {
        lines.push(`  Missing required: ${gResult.missingRequiredFields.join(', ')}`);
      }
      if (gResult.missingRecommendedFields.length > 0) {
        lines.push(`  Missing recommended: ${gResult.missingRecommendedFields.join(', ')}`);
      }
    }

    return lines.join('\n');
  }

  static formatJson(result: ValidationResult): string {
    return JSON.stringify(result, null, 2);
  }

  static formatHtml(result: ValidationResult): string {
    const icon = result.valid ? '✅' : '❌';
    let html = `<div class="validation-report ${result.valid ? 'valid' : 'invalid'}">`;
    html += `<h3>${icon} Validation ${result.valid ? 'Passed' : 'Failed'} — ${result.schemaType}</h3>`;

    if (result.errors.length > 0) {
      html += '<h4>Errors</h4><ul>';
      for (const e of result.errors) {
        html += `<li><code>${e.path}</code>: ${e.message} <span class="code">[${e.code}]</span></li>`;
      }
      html += '</ul>';
    }

    if (result.warnings.length > 0) {
      html += '<h4>Warnings</h4><ul>';
      for (const w of result.warnings) {
        html += `<li><code>${w.path}</code>: ${w.message} <span class="code">[${w.code}]</span></li>`;
      }
      html += '</ul>';
    }

    if ('richResultsEligible' in result) {
      const gResult = result as GoogleValidationResult;
      html += `<h4>Google Rich Results: <span class="${gResult.richResultsEligible ? 'eligible' : 'not-eligible'}">${gResult.richResultsEligible ? 'Eligible' : 'Not Eligible'}</span></h4>`;
    }

    html += '</div>';
    return html;
  }
}