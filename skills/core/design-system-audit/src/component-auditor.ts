/**
 * Audit des composants Astro pour conformité .bq
 */
import { readFileSync } from 'fs';
import { glob } from 'glob';
import type { ComponentAudit } from './types.js';

const BQ_CLASS_REGEX = /\bbq-[\w-]+\b/g;
const CLASS_REGEX = /\bclass\s*=\s*["'`]([^"'`]+)["'`]/g;
const INLINE_STYLE_REGEX = /\bstyle\s*=\s*["'`]([^"'`]+)["'`]/g;
const TAILWIND_REGEX = /\b(?:flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|w-|h-|p-|m-|text-|bg-|border-|rounded|shadow|hover:|focus:|dark:|md:|lg:|xl:)[\w:-]+\b/g;

export async function auditComponents(projectRoot: string): Promise<ComponentAudit[]> {
  const astroFiles = await glob(`${projectRoot}/src/**/*.astro`);
  const results: ComponentAudit[] = [];
  
  for (const file of astroFiles) {
    const content = readFileSync(file, 'utf-8');
    const audit = auditSingleComponent(file, content);
    results.push(audit);
  }
  
  return results;
}

function auditSingleComponent(file: string, content: string): ComponentAudit {
  const componentName = file.split('/').pop()?.replace('.astro', '') || 'unknown';
  
  // Extract all class attributes
  const classMatches = [...content.matchAll(CLASS_REGEX)];
  const allClasses = classMatches.flatMap(m => m[1].split(/\s+/)).filter(Boolean);
  
  // Extract inline styles
  const inlineStyleMatches = [...content.matchAll(INLINE_STYLE_REGEX)];
  const inlineStyles = inlineStyleMatches.map(m => m[1]);
  
  // Check for .bq classes
  const bqClassesUsed = allClasses.filter(c => c.startsWith('bq-'));
  const nonBqClassesUsed = allClasses.filter(c => !c.startsWith('bq-') && !TAILWIND_REGEX.test(c));
  
  // Check for Tailwind classes (might be OK if intentional, but flag)
  const tailwindClasses = allClasses.filter(c => TAILWIND_REGEX.test(c));
  
  const usesBqClasses = bqClassesUsed.length > 0;
  
  // Calculate score
  let score = 100;
  const issues: string[] = [];
  
  if (inlineStyles.length > 0) {
    score -= 20 * inlineStyles.length;
    issues.push(`${inlineStyles.length} inline style(s) found`);
  }
  
  if (nonBqClassesUsed.length > 0) {
    score -= Math.min(50, nonBqClassesUsed.length * 5);
    issues.push(`${nonBqClassesUsed.length} non-.bq custom class(es): ${nonBqClassesUsed.slice(0, 5).join(', ')}`);
  }
  
  if (tailwindClasses.length > 0) {
    score -= Math.min(30, tailwindClasses.length * 3);
    issues.push(`${tailwindClasses.length} Tailwind class(es) - consider .bq equivalents`);
  }
  
  if (!usesBqClasses && allClasses.length > 0) {
    score -= 30;
    issues.push('No .bq classes used despite having classes');
  }
  
  score = Math.max(0, score);
  
  return {
    file,
    componentName,
    usesBqClasses,
    bqClassesUsed: [...new Set(bqClassesUsed)],
    nonBqClassesUsed: [...new Set(nonBqClassesUsed)],
    inlineStyles,
    issues,
    score,
  };
}