// index.ts — Astro Integration Entry Point (schema-org-master)
// Export de tous les composants et utilitaires Astro

// Core integration factory
export { createSchemaOrgIntegration, type SchemaOrgIntegrationOptions } from './integration';

// Components
export { default as SchemaOrg } from './components/SchemaOrg.astro';
export { default as SchemaOrgHead } from './components/SchemaOrgHead.astro';
export { default as SchemaOrgBody } from './components/SchemaOrgBody.astro';
export { default as SchemaOrgAuto } from './components/SchemaOrgAuto.astro';
export { default as BookSchema } from './components/BookSchema.astro';
export { default as ProductSchema } from './components/ProductSchema.astro';
export { default as ArticleSchema } from './components/ArticleSchema.astro';
export { default as WebSiteSchema } from './components/WebSiteSchema.astro';
export { default as OrganizationSchema } from './components/OrganizationSchema.astro';
export { default as BreadcrumbSchema } from './components/BreadcrumbSchema.astro';
export { default as FAQSchema } from './components/FAQSchema.astro';
export { default as FAQExtractor } from './components/FAQExtractor.astro';
export { default as BreadcrumbExtractor } from './components/BreadcrumbExtractor.astro';

// Middleware & utilities
export { 
  schemaOrgMiddleware, 
  detectPageType, 
  definePageSchemaOrg,
  extractFAQFromHTML,
  extractBreadcrumbsFromHTML,
  type PageTypeInfo,
  type InjectorConfig,
} from './middleware';

// Re-export core types
export type { 
  KikiBook, 
  KikiProduct, 
  KikiOffer, 
  KikiOrganization, 
  KikiWebSite,
  KikiBreadcrumbList,
  KikiFAQPage,
  KikiArticle,
  KikiReview,
  KikiLangCode,
  SupportedSchemaType,
  JsonLdObject,
} from '../../types';

// Re-export builders
export {
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
  createKikiBook,
  KIKI_BOOKS_FR,
  createKikiBookSeries,
  createKikiBookForLang,
  generateAllKikiBooks,
} from '../../builder';

// Re-export validator
export {
  validate,
  validateForGoogle,
  ValidationReporter,
  type ValidationResult,
  type GoogleValidationResult,
  type ValidationError,
} from '../../validator';

// Re-export injector
export {
  injectSchemaOrg,
  generateSchemaOrgScript,
  extractSchemaOrgFromHTML,
  type InjectorConfig as CoreInjectorConfig,
} from '../../injector';

// Re-export context
export {
  createContext,
  getContext,
  setContext,
  type SchemaOrgContext,
} from '../../context';

// Re-export utils
export {
  formatCurrency,
  parseCurrency,
  formatDate,
  parseDate,
  formatLang,
  parseLang,
  type CurrencyFormatOptions,
  type DateFormatOptions,
} from '../../utils';