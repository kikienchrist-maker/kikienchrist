/**
 * Types pour SEO Audit & Fix
 */

export type LangCode = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de' | 'nl' | 'pl' | 'ar' | 'ru' | 'zh' | 'hi' | 'x-default';

export interface SEOConfig {
  /** URL de base du site */
  baseUrl: string;
  /** Seuils Lighthouse */
  lighthouseThresholds: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  /** Pages à exclure de l'audit */
  excludePatterns: string[];
  /** Langues supportées */
  supportedLangs: LangCode[];
  /** Langue par défaut */
  defaultLang: LangCode;
  /** Timeout requêtes HTTP */
  requestTimeoutMs: number;
  /** Concurrence max */
  maxConcurrency: number;
  /** User-Agent pour crawl */
  userAgent: string;
}

export interface PageAuditResult {
  url: string;
  lang: LangCode;
  path: string;
  statusCode: number;
  loadTimeMs: number;
  
  // Meta tags
  meta: MetaAuditResult;
  
  // Schema.org
  schema: SchemaAuditResult;
  
  // Hreflang
  hreflang: HreflangAuditResult;
  
  // Contenu
  content: ContentAuditResult;
  
  // Lighthouse (si activé)
  lighthouse?: LighthouseAuditResult;
  
  // Score global
  score: number;
  issues: SEOIssue[];
  fixes: SEOFix[];
}

export interface MetaAuditResult {
  title: MetaFieldAudit;
  description: MetaFieldAudit;
  canonical: MetaFieldAudit;
  ogTitle: MetaFieldAudit;
  ogDescription: MetaFieldAudit;
  ogImage: MetaFieldAudit;
  ogType: MetaFieldAudit;
  ogUrl: MetaFieldAudit;
  twitterCard: MetaFieldAudit;
  twitterTitle: MetaFieldAudit;
  twitterDescription: MetaFieldAudit;
  twitterImage: MetaFieldAudit;
  robots: MetaFieldAudit;
  viewport: MetaFieldAudit;
  charset: MetaFieldAudit;
}

export interface MetaFieldAudit {
  present: boolean;
  value: string | null;
  expected: string | null;
  valid: boolean;
  issues: string[];
}

export interface SchemaAuditResult {
  present: boolean;
  types: string[]; // WebSite, Organization, Article, BreadcrumbList, FAQPage, etc.
  valid: boolean;
  errors: string[];
  warnings: string[];
  jsonLd: any[];
}

export interface HreflangAuditResult {
  present: boolean;
  tags: HreflangTag[];
  bidirectional: boolean;
  hasXDefault: boolean;
  missingLangs: LangCode[];
  issues: string[];
}

export interface HreflangTag {
  hreflang: string;
  href: string;
  valid: boolean;
}

export interface ContentAuditResult {
  h1Count: number;
  h1Text: string | null;
  h1Unique: boolean;
  imagesTotal: number;
  imagesWithAlt: number;
  imagesMissingAlt: string[];
  linksTotal: number;
  linksBroken: BrokenLink[];
  readingTimePresent: boolean;
  readingTimeValue: number | null;
  wordCount: number;
  structure: ContentStructureIssue[];
}

export interface BrokenLink {
  url: string;
  anchorText: string | null;
  statusCode: number | null;
  error: string | null;
}

export interface ContentStructureIssue {
  type: 'missing_h2' | 'too_short' | 'keyword_stuffing' | 'thin_content';
  message: string;
  selector?: string;
}

export interface LighthouseAuditResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  passed: boolean;
  metrics: Record<string, number>;
  opportunities: string[];
  diagnostics: string[];
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'schema' | 'hreflang' | 'content' | 'lighthouse' | 'technical';
  message: string;
  selector?: string;
  currentValue?: string;
  expectedValue?: string;
}

export interface SEOFix {
  type: 'add' | 'update' | 'remove';
  category: 'meta' | 'schema' | 'hreflang' | 'content';
  selector: string;
  currentValue: string | null;
  newValue: string;
  description: string;
  autoFixable: boolean;
}

export interface AuditSummary {
  totalPages: number;
  auditedPages: number;
  failedPages: number;
  averageScore: number;
  scoreDistribution: Record<string, number>;
  issuesByCategory: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  topIssues: { issue: SEOIssue; count: number }[];
  lighthouseAverages: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  pagesNeedingFix: number;
}

export interface AuditReport {
  timestamp: string;
  config: SEOConfig;
  summary: AuditSummary;
  pages: PageAuditResult[];
}

export interface FixResult {
  url: string;
  applied: SEOFix[];
  failed: { fix: SEOFix; error: string }[];
  success: boolean;
}