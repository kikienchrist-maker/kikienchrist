/**
 * Auditeur Meta Tags
 */
import type { JSDOM } from 'jsdom';
import type { PageAuditResult, MetaAuditResult, MetaFieldAudit, SEOIssue, LangCode } from '../types.js';
import { META_RULES } from '../config.js';
import { getMetaContent, getTitle, getH1 } from '../utils.js';

export function auditMeta(dom: JSDOM, url: string, lang: LangCode, result: PageAuditResult): MetaAuditResult {
  const issues: SEOIssue[] = [];
  const fixes: any[] = [];
  
  // Title
  const title = auditField(
    'title',
    getTitle(dom),
    META_RULES.title,
    (value) => !!value && value.length >= (META_RULES.title.minLength ?? 30) && value.length <= (META_RULES.title.maxLength ?? 60),
    result,
    issues,
    fixes
  );
  
  // Description
  const description = auditField(
    'description',
    getMetaContent(dom, 'description'),
    META_RULES.description,
    (value) => !!value && value.length >= (META_RULES.description.minLength ?? 120) && value.length <= (META_RULES.description.maxLength ?? 160),
    result,
    issues,
    fixes
  );
  
  // Canonical
  const canonical = auditField(
    'canonical',
    getLinkHref(dom, 'canonical'),
    META_RULES.canonical,
    (value) => !!value && isValidUrl(value),
    result,
    issues,
    fixes
  );
  
  // OG Tags
  const ogTitle = auditField(
    'ogTitle',
    getMetaContent(dom, 'og:title', true),
    META_RULES.ogTitle,
    (value) => !!value && value.length >= (META_RULES.ogTitle.minLength ?? 30) && value.length <= (META_RULES.ogTitle.maxLength ?? 60),
    result,
    issues,
    fixes
  );
  
  const ogDescription = auditField(
    'ogDescription',
    getMetaContent(dom, 'og:description', true),
    META_RULES.ogDescription,
    (value) => !!value && value.length >= (META_RULES.ogDescription.minLength ?? 120) && value.length <= (META_RULES.ogDescription.maxLength ?? 160),
    result,
    issues,
    fixes
  );
  
  const ogImage = auditField(
    'ogImage',
    getMetaContent(dom, 'og:image', true),
    META_RULES.ogImage,
    (value) => !!value && isValidUrl(value),
    result,
    issues,
    fixes
  );
  
  const ogType = auditField(
    'ogType',
    getMetaContent(dom, 'og:type', true),
    { required: true },
    (value) => !!value,
    result,
    issues,
    fixes
  );
  
  const ogUrl = auditField(
    'ogUrl',
    getMetaContent(dom, 'og:url', true),
    { required: true },
    (value) => !!value && isValidUrl(value),
    result,
    issues,
    fixes
  );
  
  // Twitter Cards
  const twitterCard = auditField(
    'twitterCard',
    getMetaContent(dom, 'twitter:card'),
    { required: false },
    (value) => !value || ['summary', 'summary_large_image'].includes(value),
    result,
    issues,
    fixes
  );
  
  const twitterTitle = auditField(
    'twitterTitle',
    getMetaContent(dom, 'twitter:title'),
    { required: false },
    (value) => !value || (!!value && value.length >= 30 && value.length <= 60),
    result,
    issues,
    fixes
  );
  
  const twitterDescription = auditField(
    'twitterDescription',
    getMetaContent(dom, 'twitter:description'),
    { required: false },
    (value) => !value || (!!value && value.length >= 120 && value.length <= 160),
    result,
    issues,
    fixes
  );
  
  const twitterImage = auditField(
    'twitterImage',
    getMetaContent(dom, 'twitter:image'),
    { required: false },
    (value) => !value || (!!value && isValidUrl(value)),
    result,
    issues,
    fixes
  );
  
  // Robots
  const robots = auditField(
    'robots',
    getMetaContent(dom, 'robots'),
    { required: false },
    (value) => !value || !value.includes('noindex'),
    result,
    issues,
    fixes
  );
  
  // Viewport
  const viewport = auditField(
    'viewport',
    getMetaContent(dom, 'viewport'),
    { required: true },
    (value) => !!value && value.includes('width=device-width'),
    result,
    issues,
    fixes
  );
  
  // Charset
  const charset = auditField(
    'charset',
    getCharset(dom),
    { required: true },
    (value) => !!value && value.toLowerCase().includes('utf-8'),
    result,
    issues,
    fixes
  );
  
  return {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    robots,
    viewport,
    charset,
  };
}

interface MetaFieldRules {
  required: boolean;
  minLength?: number;
  maxLength?: number;
}

function auditField(
  name: string,
  value: string | null,
  rules: MetaFieldRules,
  validator: (value: string) => boolean,
  result: PageAuditResult,
  issues: SEOIssue[],
  fixes: any[]
): MetaFieldAudit {
  const fieldIssues: string[] = [];
  let valid = true;
  
  if (rules.required && (!value || value.trim() === '')) {
    valid = false;
    fieldIssues.push(`${name} manquant (requis)`);
  } else if (value && !validator(value)) {
    valid = false;
    if (rules.minLength && value.length < rules.minLength) {
      fieldIssues.push(`${name} trop court (${value.length}/${rules.minLength})`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      fieldIssues.push(`${name} trop long (${value.length}/${rules.maxLength})`);
    }
    if (!fieldIssues.length) {
      fieldIssues.push(`${name} invalide`);
    }
  }
  
  // Déterminer valeur attendue
  let expected: string | null = null;
  if (name === 'title' && (!value || value.length < (META_RULES.title.minLength || 30))) {
    expected = generateExpectedTitle(result);
  } else if (name === 'description' && (!value || value.length < (META_RULES.description.minLength || 120))) {
    expected = generateExpectedDescription(result);
  }
  
  if (!valid && expected) {
    fixes.push({
      type: value ? 'update' : 'add',
      category: 'meta',
      selector: name === 'title' ? 'title' : `meta[name="${name}"], meta[property="${name}"]`,
      currentValue: value,
      newValue: expected,
      description: `Corriger ${name}`,
      autoFixable: true,
    });
  }
  
  return {
    present: !!value,
    value,
    expected,
    valid,
    issues: fieldIssues,
  };
}

function generateExpectedTitle(result: PageAuditResult): string {
  // Utiliser H1 si disponible
  if (result.content?.h1Text) {
    return result.content.h1Text.length > 60 
      ? result.content.h1Text.substring(0, 57) + '...'
      : result.content.h1Text;
  }
  return 'Kiki en Christ - Foi et Vie Chrétienne';
}

function generateExpectedDescription(result: PageAuditResult): string {
  // Essayer d'extraire du contenu
  return 'Découvrez des ressources chrétiennes pour grandir dans la foi : prières, études bibliques, livres et accompagnement spirituel.';
}

function getLinkHref(dom: JSDOM, rel: string): string | null {
  const link = dom.window.document.querySelector(`link[rel="${rel}"]`);
  return link?.getAttribute('href') || null;
}

function getCharset(dom: JSDOM): string | null {
  const meta = dom.window.document.querySelector('meta[charset]');
  if (meta) return meta.getAttribute('charset') || null;
  const httpEquiv = dom.window.document.querySelector('meta[http-equiv="Content-Type"]');
  return httpEquiv?.getAttribute('content') || null;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}