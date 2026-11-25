/**
 * Auditeur Schema.org (JSON-LD)
 */
import type { JSDOM } from 'jsdom';
import type { PageAuditResult, SchemaAuditResult, SEOIssue } from '../types.js';
import { REQUIRED_SCHEMA_BY_PAGE_TYPE, getPageType } from '../config.js';
import { getJsonLdScripts } from '../utils.js';

export function auditSchema(dom: JSDOM, url: string, result: PageAuditResult): SchemaAuditResult {
  const jsonLd = getJsonLdScripts(dom);
  const pageType = getPageType(url);
  const requiredTypes: string[] = REQUIRED_SCHEMA_BY_PAGE_TYPE[pageType] ?? REQUIRED_SCHEMA_BY_PAGE_TYPE.default ?? ['WebSite', 'Organization'];
  const foundTypes = new Set<string>();
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Analyser chaque script JSON-LD
  for (const script of jsonLd) {
    const types = extractSchemaTypes(script);
    for (const type of types) {
      foundTypes.add(type);
    }
    
    // Validation basique
    const validationErrors = validateSchemaObject(script, pageType);
    errors.push(...validationErrors);
  }
  
  // Vérifier types requis
  for (const required of requiredTypes) {
    if (!foundTypes.has(required)) {
      errors.push(`Type Schema.org requis manquant: ${required} (pour page type: ${pageType})`);
    }
  }
  
  // Vérifications spécifiques
  if (foundTypes.has('Article')) {
    const articleSchema = jsonLd.find(s => extractSchemaTypes(s).includes('Article'));
    if (articleSchema) {
      validateArticleSchema(articleSchema, errors, warnings);
    }
  }
  
  if (foundTypes.has('BreadcrumbList')) {
    const breadcrumbSchema = jsonLd.find(s => extractSchemaTypes(s).includes('BreadcrumbList'));
    if (breadcrumbSchema) {
      validateBreadcrumbSchema(breadcrumbSchema, errors, warnings);
    }
  }
  
  if (foundTypes.has('FAQPage')) {
    const faqSchema = jsonLd.find(s => extractSchemaTypes(s).includes('FAQPage'));
    if (faqSchema) {
      validateFAQSchema(faqSchema, errors, warnings);
    }
  }
  
  const valid = errors.length === 0;
  
  return {
    present: jsonLd.length > 0,
    types: Array.from(foundTypes),
    valid,
    errors,
    warnings,
    jsonLd,
  };
}

function extractSchemaTypes(obj: any): string[] {
  const types: string[] = [];
  
  if (obj['@type']) {
    if (Array.isArray(obj['@type'])) {
      types.push(...obj['@type']);
    } else {
      types.push(obj['@type']);
    }
  }
  
  // Récursif pour @graph
  if (obj['@graph'] && Array.isArray(obj['@graph'])) {
    for (const item of obj['@graph']) {
      types.push(...extractSchemaTypes(item));
    }
  }
  
  return types;
}

function validateSchemaObject(obj: any, pageType: string): string[] {
  const errors: string[] = [];
  
  // @context requis
  if (!obj['@context'] || !obj['@context'].includes('schema.org')) {
    errors.push('JSON-LD: @context manquant ou invalide (doit contenir schema.org)');
  }
  
  // @type requis
  if (!obj['@type']) {
    errors.push('JSON-LD: @type manquant');
  }
  
  return errors;
}

function validateArticleSchema(obj: any, errors: string[], warnings: string[]): void {
  const required = ['headline', 'datePublished', 'author', 'image'];
  const recommended = ['dateModified', 'description', 'articleSection', 'keywords', 'publisher'];
  
  for (const field of required) {
    if (!obj[field]) {
      errors.push(`Article: champ requis manquant: ${field}`);
    }
  }
  
  for (const field of recommended) {
    if (!obj[field]) {
      warnings.push(`Article: champ recommandé manquant: ${field}`);
    }
  }
  
  // Vérifier author
  if (obj.author) {
    if (typeof obj.author === 'object' && !obj.author['@type']) {
      warnings.push('Article.author: @type manquant (devrait être Person ou Organization)');
    }
  }
  
  // Vérifier publisher
  if (obj.publisher) {
    if (typeof obj.publisher === 'object' && obj.publisher['@type'] !== 'Organization') {
      warnings.push('Article.publisher: @type devrait être Organization');
    }
  }
}

function validateBreadcrumbSchema(obj: any, errors: string[], warnings: string[]): void {
  if (!obj.itemListElement || !Array.isArray(obj.itemListElement)) {
    errors.push('BreadcrumbList: itemListElement manquant ou invalide');
    return;
  }
  
  for (let i = 0; i < obj.itemListElement.length; i++) {
    const item = obj.itemListElement[i];
    if (!item['@type'] || item['@type'] !== 'ListItem') {
      errors.push(`BreadcrumbList[${i}]: @type doit être ListItem`);
    }
    if (!item.position || typeof item.position !== 'number') {
      errors.push(`BreadcrumbList[${i}]: position manquante ou invalide`);
    }
    if (!item.item || !item.item['@id'] || !item.item.name) {
      errors.push(`BreadcrumbList[${i}]: item avec @id et name requis`);
    }
  }
}

function validateFAQSchema(obj: any, errors: string[], warnings: string[]): void {
  if (!obj.mainEntity || !Array.isArray(obj.mainEntity)) {
    errors.push('FAQPage: mainEntity manquant ou invalide');
    return;
  }
  
  for (let i = 0; i < obj.mainEntity.length; i++) {
    const question = obj.mainEntity[i];
    if (question['@type'] !== 'Question') {
      errors.push(`FAQPage[${i}]: @type doit être Question`);
    }
    if (!question.name) {
      errors.push(`FAQPage[${i}]: name (question) manquant`);
    }
    if (!question.acceptedAnswer) {
      errors.push(`FAQPage[${i}]: acceptedAnswer manquant`);
    } else if (question.acceptedAnswer['@type'] !== 'Answer') {
      errors.push(`FAQPage[${i}]: acceptedAnswer.@type doit être Answer`);
    } else if (!question.acceptedAnswer.text) {
      errors.push(`FAQPage[${i}]: acceptedAnswer.text manquant`);
    }
  }
}