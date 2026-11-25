// cli/update-types.ts — Update Types Command (schema-org-master)
// Génère types TypeScript depuis schema-dts / schema.org

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateTypesCommand = new Command('update-types')
  .description('Update TypeScript types from schema-dts / schema.org')
  .option('-o, --output <path>', 'Output file', '../types/generated.ts')
  .option('--schema-dts', 'Generate from schema-dts package (default)', true)
  .option('--schema-org', 'Fetch from schema.org official JSON-LD', false)
  .option('--kiki-only', 'Only generate Kiki extended types (no schema-dts)', false)
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔄 Updating TypeScript types...'));

      let typesContent = '';

      if (options.kikiOnly) {
        typesContent = generateKikiTypes();
      } else if (options.schemaOrg) {
        typesContent = await fetchSchemaOrgTypes();
      } else {
        typesContent = await generateFromSchemaDts();
      }

      // Écrire fichier
      const outputPath = path.resolve(__dirname, options.output);
      await fs.writeFile(outputPath, typesContent, 'utf-8');
      console.log(chalk.green(`✅ Types written to ${outputPath}`));
    } catch (error) {
      console.error(chalk.red('❌ Failed to update types:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// GENERATE FROM SCHEMA-DTS
// ============================================================================

async function generateFromSchemaDts(): Promise<string> {
  try {
    // Importer schema-dts dynamiquement
    const schemaDts = await import('schema-dts');

    // Types principaux à extraire
    const typesToExtract = [
      'Book', 'Product', 'Offer', 'Organization', 'WebSite',
      'BreadcrumbList', 'FAQPage', 'Article', 'BlogPosting',
      'Review', 'AggregateRating', 'Person', 'VideoObject',
      'AudioObject', 'Course', 'Event', 'Question', 'Answer',
      'ItemList', 'ListItem', 'ImageObject', 'ContactPoint',
      'EntryPoint', 'SearchAction', 'Brand', 'Rating',
    ];

    let output = `// GENERATED FROM schema-dts — DO NOT EDIT MANUALLY
// Source: https://github.com/google/schema-dts
// Generated: ${new Date().toISOString()}

`;

    // Re-exporter types de base
    output += `// Base Schema.org types (re-exported from schema-dts)\n`;
    for (const type of typesToExtract) {
      output += `export type ${type} = import('schema-dts').${type};\n`;
    }

    output += '\n// Kiki Extended Types\n';
    output += generateKikiTypes();

    return output;
  } catch (error) {
    console.warn('schema-dts not available, generating minimal types');
    return generateKikiTypes();
  }
}

// ============================================================================
// FETCH FROM SCHEMA.ORG
// ============================================================================

async function fetchSchemaOrgTypes(): Promise<string> {
  try {
    const response = await fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    let output = `// GENERATED FROM schema.org OFFICIAL JSON-LD
// Source: https://schema.org/version/latest/schemaorg-current-https.jsonld
// Generated: ${new Date().toISOString()}

`;

    // Parser @graph pour extraire types
    const graph = data['@graph'] || [];
    const types = new Set<string>();

    for (const item of graph) {
      if (item['@type'] === 'rdfs:Class' && item['rdfs:label']) {
        const label = item['rdfs:label']['@value'] || item['rdfs:label'];
        if (typeof label === 'string' && /^[A-Z]/.test(label)) {
          types.add(label);
        }
      }
    }

    output += `// Found ${types.size} Schema.org types\n\n`;
    for (const type of Array.from(types).sort()) {
      output += `export interface ${type} {\n  '@type': '${type}';\n  // TODO: Add properties from schema.org\n}\n\n`;
    }

    output += '\n// Kiki Extended Types\n';
    output += generateKikiTypes();

    return output;
  } catch (error) {
    throw new Error(`Failed to fetch schema.org: ${error}`);
  }
}

// ============================================================================
// KIKI EXTENDED TYPES — Définitions manuelles
// ============================================================================

function generateKikiTypes(): string {
  return `// ============================================================================
// KIKI EN CHRIST EXTENDED TYPES
// Extensions propriétaires pour besoins spécifiques du site
// ============================================================================

import type { WithContext, WithId, Text, URL, DateTime, Number, Boolean } from 'schema-dts';

// Langues supportées (11)
export type KikiLangCode = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de' | 'nl' | 'pl' | 'ar' | 'ru' | 'zh' | 'hi';
export type KikiBookNumber = 1 | 2 | 3 | 4;
export type KikiBookFormat = 'Paperback' | 'EBook' | 'Audiobook';
export type KikiSeller = 'Lulu' | 'Payhip' | 'Google Play';
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

// ============================================================================
// EXTENDED BOOK — KikiBook
// ============================================================================

export interface KikiBook extends WithContext, WithId {
  '@type': 'Book';
  name: string;
  isbn: string;                    // ISBN-10 ou ISBN-13
  author: PersonInput | PersonInput[] | string;
  inLanguage: KikiLangCode;
  numberOfPages: number;
  datePublished: DateTime;
  description?: Text;
  image?: URL | URL[];
  publisher?: OrganizationInput;
  offers?: KikiOffer[];
  aggregateRating?: KikiAggregateRating;
  review?: KikiReview[];
  genre?: Text | Text[];
  keywords?: Text | Text[];
  bookFormat?: KikiBookFormat;

  // --- Kiki Extensions ---
  kikiSeries?: 'Kiki en Christ';
  kikiBookNumber?: KikiBookNumber;
  kikiHook?: Text;
  kikiBenefits?: readonly [Text, Text, Text];
  kikiAvailableFormats?: KikiBookFormat[];
  kikiPrices?: Partial<Record<KikiBookFormat, { amount: Number; currency: Text }>>;
}

// ============================================================================
// EXTENDED PRODUCT — KikiProduct (format vente: Lulu/Payhip/Google Play)
// ============================================================================

export interface KikiProduct extends WithContext, WithId {
  '@type': 'Product';
  name: Text;
  sku?: Text;
  gtin13?: Text;                   // ISBN-13 pour livres
  brand?: { '@type': 'Brand'; name: Text };
  category?: Text;
  description?: Text;
  image?: URL | URL[];
  offers?: KikiOffer[];

  // --- Kiki Extensions ---
  kikiBookRef?: KikiBookNumber;
  kikiFormat?: KikiBookFormat;
  kikiSeller?: KikiSeller;
  kikiOriginalPrice?: { amount: Number; currency: Text };
}

// ============================================================================
// EXTENDED OFFER — KikiOffer
// ============================================================================

export interface KikiOffer extends WithContext, WithId {
  '@type': 'Offer';
  price: Number;
  priceCurrency: Text;             // ISO 4217
  availability?: URL;              // https://schema.org/InStock etc.
  seller?: OrganizationInput;
  url?: URL;
  eligibleRegion?: Text | Text[];
  priceValidUntil?: DateTime;

  // --- Kiki Extensions ---
  kikiSeller?: KikiSeller;
  kikiFormat?: KikiBookFormat;
  kikiBookNumber?: KikiBookNumber;
}

// ============================================================================
// EXTENDED ORGANIZATION — KikiOrganization
// ============================================================================

export interface KikiOrganization extends WithContext, WithId {
  '@type': 'Organization';
  name: Text;
  url?: URL;
  logo?: URL;
  sameAs?: URL[];
  email?: Text;
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: Text;
    contactType: Text;
    availableLanguage?: Text[];
  };
  founder?: Text;

  // --- Kiki Extensions ---
  kikiFounder?: Text;
  kikiMission?: Text;
  kikiBooksCount?: 4;
  kikiLanguagesCount?: 11;
  kikiContactEmail?: 'kikienchrist@gmail.com';
}

// ============================================================================
// EXTENDED WEBSITE — KikiWebSite
// ============================================================================

export interface KikiWebSite extends WithContext, WithId {
  '@type': 'WebSite';
  name: Text;
  url?: URL;
  potentialAction?: {
    '@type': 'SearchAction';
    target: { '@type': 'EntryPoint'; urlTemplate: Text };
    queryInput: Text;
  };
  publisher?: OrganizationInput;

  // --- Kiki Extensions ---
  kikiSupportedLanguages?: readonly KikiLangCode[];
  kikiDefaultLanguage?: KikiLangCode;
}

// ============================================================================
// EXTENDED BREADCRUMBLIST — KikiBreadcrumbList
// ============================================================================

export interface KikiBreadcrumbList extends WithContext, WithId {
  '@type': 'BreadcrumbList';
  itemListElement: KikiListItem[];
}

export interface KikiListItem extends WithContext, WithId {
  '@type': 'ListItem';
  position: Number;
  item: { '@id': URL; name: Text };
}

// ============================================================================
// EXTENDED FAQPAGE — KikiFAQPage
// ============================================================================

export interface KikiFAQPage extends WithContext, WithId {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: Text;
    acceptedAnswer: { '@type': 'Answer'; text: Text };
  }>;

  // --- Kiki Extensions ---
  kikiSource?: 'legal' | 'blog' | 'manual';
  kikiDetectedQuestions?: Number;
}

// ============================================================================
// EXTENDED ARTICLE — KikiArticle / KikiBlogPosting
// ============================================================================

export interface KikiArticle extends WithContext, WithId {
  '@type': 'Article' | 'BlogPosting';
  headline: Text;
  author: PersonInput | PersonInput[] | Text;
  datePublished: DateTime;
  dateModified?: DateTime;
  image?: URL | URL[];
  publisher?: OrganizationInput & { logo?: { '@type': 'ImageObject'; url: URL } };
  mainEntityOfPage?: URL | { '@type': 'WebPage'; '@id': URL };
  articleSection?: Text;
  keywords?: Text | Text[];
  description?: Text;

  // --- Kiki Extensions ---
  kikiCategory?: Text;
  kikiTags?: readonly Text[];
  kikiReadingTimeMinutes?: Number;
  kikiSeries?: Text;
  kikiPartNumber?: Number;
}

// ============================================================================
// EXTENDED REVIEW — KikiReview
// ============================================================================

export interface KikiReview extends WithContext, WithId {
  '@type': 'Review';
  author: PersonInput;
  reviewBody: Text;
  reviewRating: { '@type': 'Rating'; ratingValue: Number; bestRating?: Number; worstRating?: Number };
  datePublished: DateTime;
  itemReviewed: { '@type': 'Book'; name: Text; '@id'?: URL };

  // --- Kiki Extensions ---
  kikiBookNumber?: KikiBookNumber;
  kikiVerifiedPurchase?: Boolean;
  kikiLanguage?: KikiLangCode;
}

// ============================================================================
// EXTENDED AGGREGATERATING — KikiAggregateRating
// ============================================================================

export interface KikiAggregateRating extends WithContext, WithId {
  '@type': 'AggregateRating';
  ratingValue: Number;
  reviewCount: Number;
  bestRating?: Number;
  worstRating?: Number;

  // --- Kiki Extensions ---
  kikiBookNumber?: KikiBookNumber;
  kikiReviewCount?: Number;
  kikiRatingDistribution?: Partial<Record<1 | 2 | 3 | 4 | 5, Number>>;
}

// ============================================================================
// INPUT TYPES — Pour builders
// ============================================================================

export interface BookInput {
  name: string;
  isbn: string;
  author: PersonInput | string;
  inLanguage: KikiLangCode;
  numberOfPages: number;
  datePublished: string;
  description?: string;
  image?: string | string[];
  publisher: OrganizationInput;
  offers: OfferInput[];
  aggregateRating?: { ratingValue: number; reviewCount: number; bestRating?: number; worstRating?: number };
  review?: Array<{ author: PersonInput; reviewBody: string; reviewRating: { ratingValue: number }; datePublished: string }>;
  genre?: string | string[];
  keywords?: string | string[];
  bookFormat?: KikiBookFormat;
  // Extensions
  kikiBookNumber: KikiBookNumber;
  kikiHook: string;
  kikiBenefits: readonly [string, string, string];
}

export interface PersonInput {
  name: string;
  url?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

export interface OrganizationInput {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  email?: string;
}

export interface OfferInput {
  price: number;
  priceCurrency: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability';
  seller: OrganizationInput | string;
  url?: string;
  eligibleRegion?: string | string[];
  priceValidUntil?: string;
}

export interface AggregateRatingInput {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface ReviewInput {
  author: PersonInput;
  reviewBody: string;
  reviewRating: { ratingValue: number; bestRating?: number; worstRating?: number };
  datePublished: string;
  itemReviewed: { '@type': 'Book'; name: string; '@id'?: string };
}

export interface BreadcrumbInput {
  name: string;
  url: string;
}

export interface FAQInput {
  question: string;
  answer: string;
}

export interface ArticleInput {
  headline: string;
  author: PersonInput | string;
  datePublished: string;
  dateModified?: string;
  image?: string | string[];
  publisher: OrganizationInput;
  mainEntityOfPage?: string;
  articleSection?: string;
  keywords?: string | string[];
  description?: string;
  // Extensions
  kikiCategory?: string;
  kikiTags?: string[];
  kikiReadingTimeMinutes?: number;
  kikiSeries?: string;
  kikiPartNumber?: number;
}

export interface VideoInput {
  name: string;
  description: string;
  contentUrl: string;
  embedUrl?: string;
  uploadDate: string;
  duration: string;
  thumbnailUrl?: string | string[];
  inLanguage?: KikiLangCode;
  transcript?: string;
}

export interface AudioInput {
  name: string;
  description: string;
  contentUrl: string;
  duration: string;
  inLanguage?: KikiLangCode;
  transcript?: string;
  readBy?: PersonInput;
}

export interface CourseInput {
  name: string;
  description: string;
  provider: OrganizationInput;
  hasCourseInstance?: any[];
  teaches?: string[];
}

export interface EventInput {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  eventStatus?: string;
  location?: any[];
  offers?: OfferInput[];
  performer?: PersonInput[];
}

// ============================================================================
// UNION TYPES
// ============================================================================

export type SupportedSchemaType =
  | KikiBook
  | KikiProduct
  | KikiOffer
  | KikiOrganization
  | KikiWebSite
  | KikiBreadcrumbList
  | KikiFAQPage
  | KikiArticle
  | KikiReview
  | KikiAggregateRating
  | { '@type': 'Person' } & PersonInput
  | { '@type': 'VideoObject' } & VideoInput
  | { '@type': 'AudioObject' } & AudioInput
  | { '@type': 'Course' } & CourseInput
  | { '@type': 'Event' } & EventInput
  | { '@type': 'Question' }
  | { '@type': 'Answer' };

export type JsonLdObject = {
  '@context': JsonLdContext;
} & (
  | SupportedSchemaType
  | { '@graph': SupportedSchemaType[] }
);

export type JsonLdContext = string | {
  '@vocab'?: string;
  '@language'?: string;
  '@base'?: string;
  [key: string]: any;
};

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'suggestion';
  schemaType?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: ValidationError[];
  schemaType: string;
  timestamp: string;
}

export interface GoogleValidationResult extends ValidationResult {
  richResultsEligible: boolean;
  missingRequiredFields: string[];
  missingRecommendedFields: string[];
}

// ============================================================================
// AUDIT TYPES
// ============================================================================

export interface AuditConfig {
  baseUrl: string;
  paths: string[];
  langCodes: string[];
  outputDir: string;
  format: 'console' | 'json' | 'html';
  google: boolean;
  concurrency: number;
}

export interface AuditResult {
  url: string;
  lang: string;
  path: string;
  validation: GoogleValidationResult;
  pageType: string;
  timestamp: string;
}
`;
}