// types.ts — Core Types + Kiki Extensions (schema-org-master)
// Re-exports sélectifs de schema-dts + extensions métier strictement typées

import type {
  // Core types
  WithContext,
  WithId,
  // Schema.org types (P0)
  Book as SchemaBook,
  Product as SchemaProduct,
  Offer as SchemaOffer,
  Organization as SchemaOrganization,
  WebSite as SchemaWebSite,
  BreadcrumbList as SchemaBreadcrumbList,
  FAQPage as SchemaFAQPage,
  Question as SchemaQuestion,
  Answer as SchemaAnswer,
  // Schema.org types (P1)
  Article as SchemaArticle,
  BlogPosting as SchemaBlogPosting,
  ItemList as SchemaItemList,
  ListItem as SchemaListItem,
  Review as SchemaReview,
  AggregateRating as SchemaAggregateRating,
  // Schema.org types (P2)
  Person as SchemaPerson,
  VideoObject as SchemaVideoObject,
  AudioObject as SchemaAudioObject,
  Course as SchemaCourse,
  Event as SchemaEvent,
  // Enums/Values
  BookFormatType,
  ItemAvailability,
  OrganizationRole,
  // Utils
  Text,
  URL,
  DateTime,
  Number,
  Boolean,
} from 'schema-dts';

// ============================================================================
// EXTENSIONS KIKI EN CHRIST — Types métier stricts
// ============================================================================

/** Numéro de livre dans la série (1-4) */
export type KikiBookNumber = 1 | 2 | 3 | 4;

/** Codes langues supportés (11 langues) */
export type KikiLangCode =
  | 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de'
  | 'nl' | 'pl' | 'ar' | 'ru' | 'zh' | 'hi';

/** Formats de livre pour Kiki */
export type KikiBookFormat =
  | 'Paperback'           // Livre broché (Lulu)
  | 'EBook'               // Ebook PDF/EPUB (Payhip)
  | 'Audiobook';          // Audio MP3/Streaming (Google Play)

/** Plateformes de vente */
export type KikiSeller = 'Lulu' | 'Payhip' | 'Google Play';

/** Statut de consentement RGPD */
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

// ============================================================================
// TYPES ÉTENDUS — Composition au lieu d'héritage (plus sûr)
// ============================================================================

/** Book étendu avec métadonnées Kiki */
export interface KikiBook extends SchemaBook {
  /** Série : "Kiki en Christ" */
  kikiSeries: 'Kiki en Christ';
  /** Numéro dans la série (1-4) */
  kikiBookNumber: KikiBookNumber;
  /** Accroche marketing courte */
  kikiHook: string;
  /** 3 bénéfices clés */
  kikiBenefits: readonly [string, string, string];
  /** Formats disponibles pour ce livre */
  kikiAvailableFormats: readonly KikiBookFormat[];
  /** Prix par format (pour affichage) */
  kikiPrices: Partial<Record<KikiBookFormat, { amount: number; currency: string }>>;
}

/** Product étendu pour offres Kiki */
export interface KikiProduct extends SchemaProduct {
  kikiBookRef: KikiBookNumber;           // Référence au livre parent
  kikiFormat: KikiBookFormat;            // Format de ce produit
  kikiSeller: KikiSeller;                // Plateforme
  kikiOriginalPrice?: { amount: number; currency: string }; // Prix original avant conversion
}

/** Offer étendue avec métadonnées Kiki */
export interface KikiOffer extends SchemaOffer {
  kikiSeller: KikiSeller;
  kikiFormat: KikiBookFormat;
  kikiBookNumber: KikiBookNumber;
  /** Régions éligibles (codes ISO 3166-1 alpha-2) */
  eligibleRegion?: string | string[];
  /** Prix valide jusqu'à */
  priceValidUntil?: string;
}

/** Organization étendue pour Kiki en Christ */
export interface KikiOrganization extends SchemaOrganization {
  kikiFounder: string;                   // Nom du fondateur
  kikiMission: string;                   // Mission statement
  kikiBooksCount: 4;                     // Nombre de livres publiés
  kikiLanguagesCount: 11;                // Nombre de langues
  kikiContactEmail: 'kikienchrist@gmail.com';
}

/** WebSite étendu */
export interface KikiWebSite extends SchemaWebSite {
  kikiSupportedLanguages: readonly KikiLangCode[];
  kikiDefaultLanguage: KikiLangCode;
}

/** BreadcrumbList avec items typés Kiki */
export interface KikiBreadcrumbList extends SchemaBreadcrumbList {
  itemListElement: readonly KikiListItem[];
}

export interface KikiListItem extends SchemaListItem {
  item: KikiWebPage | KikiBook | KikiProduct;
  position: number;
}

export interface KikiWebPage extends WithContext, WithId {
  '@type': 'WebPage';
  name: string;
  url: URL;
  inLanguage: KikiLangCode;
  isPartOf: KikiWebSite;
  breadcrumb?: KikiBreadcrumbList;
}

/** FAQPage avec détection auto questions */
export interface KikiFAQPage extends SchemaFAQPage {
  kikiSource: 'legal' | 'blog' | 'manual';
  kikiDetectedQuestions: number;
}

/** Article / BlogPosting étendu */
export interface KikiArticle extends SchemaArticle {
  kikiCategory: string;
  kikiTags: readonly string[];
  kikiReadingTimeMinutes: number;
  kikiSeries?: string;
  kikiPartNumber?: number;
}

/** Review étendue pour livres */
export interface KikiReview extends SchemaReview {
  kikiBookNumber: KikiBookNumber;
  kikiVerifiedPurchase: boolean;
  kikiLanguage: KikiLangCode;
}

/** AggregateRating étendue */
export interface KikiAggregateRating extends SchemaAggregateRating {
  kikiBookNumber: KikiBookNumber;
  kikiReviewCount: number;
  kikiRatingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

// ============================================================================
// UNION TYPES pour @graph discriminé
// ============================================================================

/** Tous les types Schema supportés par le générateur */
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
  | SchemaPerson
  | SchemaVideoObject
  | SchemaAudioObject
  | SchemaCourse
  | SchemaEvent
  | SchemaQuestion
  | SchemaAnswer
  | SchemaListItem;

/** Objet JSON-LD complet (avec @context) */
export interface JsonLdObject {
  '@context': JsonLdContext | string;
  '@graph'?: SupportedSchemaType[];
  /** Ou type unique sans @graph */
  '@type'?: SupportedSchemaType['@type'];
  [key: string]: unknown;
}

/** Contexte JSON-LD personnalisé pour compactage */
export interface JsonLdContext {
  '@vocab': 'https://schema.org/';
  '@language': KikiLangCode;
  /** Aliases courts pour compactage */
  kikiSeries: 'https://schema.org/name'; // extension custom
  kikiBookNumber: 'https://schema.org/position';
  kikiHook: 'https://schema.org/description';
  kikiBenefits: 'https://schema.org/featureList';
  kikiAvailableFormats: 'https://schema.org/offers';
  kikiPrices: 'https://schema.org/priceSpecification';
  kikiBookRef: 'https://schema.org/isBasedOn';
  kikiFormat: 'https://schema.org/bookFormat';
  kikiSeller: 'https://schema.org/seller';
  kikiOriginalPrice: 'https://schema.org/priceSpecification';
  kikiFounder: 'https://schema.org/founder';
  kikiMission: 'https://schema.org/mission';
  kikiBooksCount: 'https://schema.org/numberOfItems';
  kikiLanguagesCount: 'https://schema.org/availableLanguage';
  kikiContactEmail: 'https://schema.org/email';
  kikiSupportedLanguages: 'https://schema.org/availableLanguage';
  kikiDefaultLanguage: 'https://schema.org/inLanguage';
  kikiDetectedQuestions: 'https://schema.org/mainEntity';
  kikiCategory: 'https://schema.org/articleSection';
  kikiTags: 'https://schema.org/keywords';
  kikiReadingTimeMinutes: 'https://schema.org/timeRequired';
  kikiSeriesPart: 'https://schema.org/hasPart';
  kikiPartNumber: 'https://schema.org/position';
  kikiVerifiedPurchase: 'https://schema.org/verifiedPurchase';
  kikiLanguage: 'https://schema.org/inLanguage';
  kikiReviewCount: 'https://schema.org/reviewCount';
  kikiRatingDistribution: 'https://schema.org/ratingValue';
}

// ============================================================================
// BUILDER INPUT TYPES — Pour API fluide (entrées utilisateur simplifiées)
// ============================================================================

/** Input minimal pour créer un Book */
export interface BookInput {
  name: string;
  isbn: string;                    // ISBN-13 ou ISBN-10
  author: PersonInput | string;    // Nom ou objet Person
  inLanguage: KikiLangCode;
  numberOfPages: number;
  datePublished: string;           // ISO 8601
  description: string;
  image: string;                   // URL image couverture
  publisher: OrganizationInput;
  offers: OfferInput[];
  aggregateRating?: AggregateRatingInput;
  review?: ReviewInput[];
  genre?: string | string[];
  keywords?: string | string[];
  kikiBookNumber: KikiBookNumber;
  kikiHook: string;
  kikiBenefits: readonly [string, string, string];
}

/** Input pour Person (auteur) */
export interface PersonInput {
  name: string;
  url?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

/** Input pour Organization (éditeur) */
export interface OrganizationInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  email?: string;
  founder?: string;
}

/** Input pour Offer */
export interface OfferInput {
  price: number;
  priceCurrency: string;           // ISO 4217
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability';
  seller: OrganizationInput | string; // Nom ou objet
  url: string;
  eligibleRegion?: string | string[];
  priceValidUntil?: string;
  bookFormat?: KikiBookFormat;
}

/** Input pour AggregateRating */
export interface AggregateRatingInput {
  ratingValue: number;             // 1-5
  reviewCount: number;
  bestRating?: 5;
  worstRating?: 1;
  ratingDistribution?: Record<1 | 2 | 3 | 4 | 5, number>;
}

/** Input pour Review */
export interface ReviewInput {
  author: PersonInput;
  datePublished: string;
  reviewBody: string;
  reviewRating: AggregateRatingInput;
  verifiedPurchase?: boolean;
  inLanguage?: KikiLangCode;
}

/** Input pour BreadcrumbList */
export interface BreadcrumbInput {
  items: readonly {
    name: string;
    url: string;
    position: number;
  }[];
}

/** Input pour FAQPage */
export interface FAQInput {
  questions: readonly {
    name: string;
    acceptedAnswer: string;
  }[];
  source?: 'legal' | 'blog' | 'manual';
}

/** Input pour Article / BlogPosting */
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
  category?: string;
  tags?: string[];
  readingTimeMinutes?: number;
}

/** Input pour VideoObject */
export interface VideoInput {
  name: string;
  description: string;
  contentUrl: string;
  embedUrl?: string;
  uploadDate: string;
  duration: string;                // ISO 8601 duration (PT1H30M)
  thumbnailUrl?: string | string[];
  inLanguage?: KikiLangCode;
  transcript?: string;
}

/** Input pour AudioObject (Audiobook) */
export interface AudioInput {
  name: string;
  description: string;
  contentUrl: string;
  duration: string;
  inLanguage?: KikiLangCode;
  transcript?: string;
  readBy?: PersonInput;
}

/** Input pour Course */
export interface CourseInput {
  name: string;
  description: string;
  provider: OrganizationInput;
  hasCourseInstance: {
    courseMode: 'online' | 'offline';
    courseWorkload: string;
    offers: OfferInput[];
  }[];
  teaches?: string[];
}

/** Input pour Event */
export interface EventInput {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    '@type': 'Place' | 'VirtualLocation';
    name: string;
    address?: {
      '@type': 'PostalAddress';
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    url?: string;
  }[];
  offers?: OfferInput[];
  performer?: PersonInput[];
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventMovedOnline';
}

// ============================================================================
// VALIDATION RESULT TYPES
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
// CLI / AUDIT TYPES
// ============================================================================

export interface AuditConfig {
  dir: string;
  output: 'console' | 'json' | 'html';
  google: boolean;
  recursive: boolean;
  pattern: string;
}

export interface AuditResult {
  filesScanned: number;
  filesWithSchema: number;
  totalSchemas: number;
  validSchemas: number;
  invalidSchemas: number;
  byType: Record<string, { valid: number; invalid: number }>;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: ValidationError[];
}

// ============================================================================
// UTILS — Re-exports pour commodité
// ============================================================================

export type {
  WithContext,
  WithId,
  Text,
  URL,
  DateTime,
  Number,
  Boolean,
  BookFormatType,
  ItemAvailability,
  OrganizationRole,
} from 'schema-dts';