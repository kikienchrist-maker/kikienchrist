/**
 * SEO Audit Fix - Point d'entrée principal
 */
export { SEOPipeline, runSEOAudit } from './seo-pipeline.js';
export { auditMeta } from './auditors/meta-auditor.js';
export { auditSchema } from './auditors/schema-auditor.js';
export { auditHreflang } from './auditors/hreflang-auditor.js';
export { auditContent } from './auditors/content-auditor.js';
export { runLighthouseAudit, auditLighthouseForPage } from './auditors/lighthouse-auditor.js';
export { generateMetaFixes } from './fixers/meta-fixer.js';
export { generateHreflangFixes } from './fixers/hreflang-fixer.js';
export { generateSchemaFixes } from './fixers/schema-fixer.js';
export { generateContentFixes } from './fixers/content-fixer.js';
export { generateHtmlReport } from './reporters/html-reporter.js';
export { generateJsonReport, generateJsonSummary } from './reporters/json-reporter.js';
export { generateMarkdownReport, generateMarkdownFixes } from './reporters/markdown-reporter.js';
export type {
  SEOConfig,
  PageAuditResult,
  AuditReport,
  AuditSummary,
  MetaAuditResult,
  SchemaAuditResult,
  HreflangAuditResult,
  ContentAuditResult,
  LighthouseAuditResult,
  SEOIssue,
  SEOFix,
  LangCode,
  FixResult,
} from './types.js';
export { DEFAULT_CONFIG, META_RULES, REQUIRED_SCHEMA_BY_PAGE_TYPE, SEO_KEYWORDS_BY_LANG } from './config.js';