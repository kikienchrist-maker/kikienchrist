// index.ts — Exports Publics (schema-org-master)
// Point d'entrée unique pour toute l'API publique

// ============================================================================
// TYPES — Re-exports complets
// ============================================================================

export type {
  // Core schema-dts re-exports
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

  // Schema.org base types
  Book as SchemaBook,
  Product as SchemaProduct,
  Offer as SchemaOffer,
  Organization as SchemaOrganization,
  WebSite as SchemaWebSite,
  BreadcrumbList as SchemaBreadcrumbList,
  FAQPage as SchemaFAQPage,
  Article as SchemaArticle,
  BlogPosting as SchemaBlogPosting,
  ItemList as SchemaItemList,
  ListItem as SchemaListItem,
  Review as SchemaReview,
  AggregateRating as SchemaAggregateRating,
  Person as SchemaPerson,
  VideoObject as SchemaVideoObject,
  AudioObject as SchemaAudioObject,
  Course as SchemaCourse,
  Event as SchemaEvent,
  Question as SchemaQuestion,
  Answer as SchemaAnswer,

  // Kiki Extended Types
  KikiBook,
  KikiProduct,
  KikiOffer,
  KikiOrganization,
  KikiWebSite,
  KikiBreadcrumbList,
  KikiListItem,
  KikiWebPage,
  KikiFAQPage,
  KikiArticle,
  KikiReview,
  KikiAggregateRating,
  SupportedSchemaType,
  JsonLdObject,
  JsonLdContext,

  // Input Types
  BookInput,
  PersonInput,
  OrganizationInput,
  OfferInput,
  AggregateRatingInput,
  ReviewInput,
  BreadcrumbInput,
  FAQInput,
  ArticleInput,
  VideoInput,
  AudioInput,
  CourseInput,
  EventInput,

  // Validation Types
  ValidationError,
  ValidationResult,
  GoogleValidationResult,

  // CLI/Audit Types
  AuditConfig,
  AuditResult,

  // Enums/Constants
  KikiBookNumber,
  KikiLangCode,
  KikiBookFormat,
  KikiSeller,
  ConsentCategory,
} from './types';

// ============================================================================
// CONTEXT — JSON-LD Context Management
// ============================================================================

export {
  BASE_SCHEMA_CONTEXT,
  createContext,
  createStrictContext,
  mergeContexts,
  compactJsonLd,
  expandJsonLd,
  stringifyJsonLd,
  parseJsonLd,
  mergeJsonLdGraphs,
} from './context';

// ============================================================================
// BUILDERS — Fluent API Entry Point
// ============================================================================

export {
  SchemaOrg,
  BaseBuilder,
  // Concrete builders (pour usage avancé)
  BookBuilder,
  ProductBuilder,
  OrganizationBuilder,
  WebSiteBuilder,
  BreadcrumbListBuilder,
  FAQPageBuilder,
  ArticleBuilder,
  OfferBuilder,
  ReviewBuilder,
  PersonBuilder,
  VideoObjectBuilder,
  AudioObjectBuilder,
  CourseBuilder,
  EventBuilder,
} from './builder/base';

// Specialized Book Builder
export {
  createKikiBook,
  KIKI_BOOKS_FR,
  KIKI_BOOK_HOOKS,
  KIKI_BOOK_BENEFITS,
  generateAllKikiBooks,
  createKikiBookSeries,
  createKikiBookForLang,
} from './builder/book';

// ============================================================================
// VALIDATOR — Runtime Validation
// ============================================================================

export {
  validate,
  validateForGoogle,
  ValidationReporter,
} from './validator';

// ============================================================================
// INJECTOR — Astro Integration
// ============================================================================

export {
  injectSchemaOrg,
  SchemaOrgAstro,
} from './injector';

// ============================================================================
// UTILS — Helpers
// ============================================================================

export {
  formatCurrency,
  formatDate,
  formatLang,
  formatDuration,
} from './utils';

// ============================================================================
// CLI — Command Line Interface (entry point séparé)
// ============================================================================

// Export CLI seulement si import explicite
// export { runCli } from './cli';