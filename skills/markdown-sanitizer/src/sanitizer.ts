/**
 * Sanitizer principal : nettoie, valide, corrige un fichier Markdown
 * Pipeline complet : parse → normalize → validate → fix → serialize
 */
import { parseMarkdown, normalizeFrontmatterTypes, detectCollectionType } from './parser.js';
import { slugifyText, generateTranslationSlug, validateSlug, extractBaseSlug } from './slugify.js';
import { 
  BlogFrontmatterSchema, 
  LegalPageFrontmatterSchema, 
  BookFrontmatterSchema,
  AnyFrontmatterSchema,
  type BlogFrontmatter,
  type LegalPageFrontmatter,
  type BookFrontmatter,
  type LangCode 
} from './schemas.js';
import matter from 'gray-matter';
import type { ParsedMarkdown } from './parser.js';

type CollectionType = 'blog' | 'legal' | 'book';
type ValidatedFrontmatter = BlogFrontmatter | LegalPageFrontmatter | BookFrontmatter | Record<string, unknown>;

export interface SanitizeOptions {
  /** Langue source du fichier (pour logs et slug) */
  sourceLang?: LangCode;
  /** Slugs de base connus (pour extraction baseSlug) */
  knownBaseSlugs?: string[];
  /** Collection cible (pour validation schéma) */
  collection?: 'blog' | 'legal' | 'book' | 'auto';
  /** Corriger automatiquement les erreurs */
  autoFix?: boolean;
  /** Forcer la régénération du slug depuis translationKey + lang */
  forceSlugRegeneration?: boolean;
  /** Conserver le frontmatter original en commentaire */
  keepOriginalComment?: boolean;
}

export interface SanitizeResult {
  success: boolean;
  content: string;
  frontmatter: Record<string, unknown>;
  errors: string[];
  warnings: string[];
  fixes: string[];
  collection: 'blog' | 'legal' | 'book' | 'unknown';
  baseSlug: string;
  lang: LangCode;
}

/**
 * Sanitize complet d'un fichier Markdown
 */
export function sanitizeMarkdown(content: string, options: SanitizeOptions = {}): SanitizeResult {
  const {
    sourceLang,
    knownBaseSlugs = [],
    collection = 'auto',
    autoFix = true,
    forceSlugRegeneration = false,
    keepOriginalComment = false,
  } = options;
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const fixes: string[] = [];
  
  // 1. Parser
  const parsed = parseMarkdown(content, { extractNested: true, lang: sourceLang });
  let frontmatter = parsed.frontmatter;
  let body = parsed.body;
  
  // 2. Détecter collection
  const detectedCollectionRaw = collection === 'auto' ? detectCollectionType(frontmatter) : collection;
  const detectedCollection: CollectionType = (detectedCollectionRaw === 'unknown' ? 'blog' : detectedCollectionRaw) as CollectionType;
  
  // 3. Normaliser types
  frontmatter = normalizeFrontmatterTypes(frontmatter, detectedCollection);
  
  // 4. Déterminer langue et slug de base
  const lang = (frontmatter.lang as LangCode) || sourceLang || 'fr';
  let baseSlug = (frontmatter.translationKey as string) || (frontmatter.slug as string) || '';
  
  // Si pas de translationKey, essayer d'extraire depuis le slug
  if (!baseSlug && frontmatter.slug) {
    baseSlug = extractBaseSlug(frontmatter.slug as string, knownBaseSlugs);
    fixes.push(`baseSlug extrait du slug: ${baseSlug}`);
  }
  
  // 5. Valider et corriger selon schéma
  let validatedFm: BlogFrontmatter | LegalPageFrontmatter | BookFrontmatter | Record<string, unknown> = frontmatter;
  
  switch (detectedCollection) {
    case 'blog':
      validatedFm = validateAndFixBlog(frontmatter, baseSlug, lang, errors, warnings, fixes, autoFix, forceSlugRegeneration);
      break;
    case 'legal':
      validatedFm = validateAndFixLegal(frontmatter, baseSlug, lang, errors, warnings, fixes, autoFix, forceSlugRegeneration);
      break;
    case 'book':
      validatedFm = validateAndFixBook(frontmatter, baseSlug, lang, errors, warnings, fixes, autoFix, forceSlugRegeneration);
      break;
    default:
      warnings.push('Type de collection inconnu, validation basique seulement');
      validatedFm = frontmatter;
  }
  
  // 6. Valider slug final (seulement pour blog/legal qui ont slug)
  if (detectedCollection === 'blog' || detectedCollection === 'legal') {
    const vf = validatedFm as BlogFrontmatter | LegalPageFrontmatter;
    const slugValidation = validateSlug(vf.slug as string);
    if (!slugValidation.valid) {
      errors.push(...slugValidation.errors.map(e => `Slug invalide: ${e}`));
      if (autoFix && slugValidation.errors.some(e => e.includes('caractères invalides'))) {
        const fixedSlug = slugifyText(vf.slug as string);
        vf.slug = fixedSlug;
        fixes.push(`Slug corrigé: ${fixedSlug}`);
      }
    }
    
    // 7. S'assurer que translationKey est défini
    if (!vf.translationKey) {
      vf.translationKey = baseSlug || vf.slug;
      fixes.push(`translationKey défini: ${vf.translationKey}`);
    }
  }
  
  // 8. Sérialiser
  const newContent = serializeMarkdown(validatedFm, body, keepOriginalComment ? parsed.originalFmRaw : undefined);
  
  // Cast sécurisé pour translationKey
  const translationKey = (validatedFm as Record<string, unknown>).translationKey as string | undefined;
  
  return {
    success: errors.length === 0,
    content: newContent,
    frontmatter: validatedFm,
    errors,
    warnings,
    fixes,
    collection: detectedCollection,
    baseSlug: baseSlug || translationKey || '',
    lang,
  };
}

// ──────────────────────────────────────────────
// Validation + Fix par type de collection
// ──────────────────────────────────────────────

function validateAndFixBlog(
  fm: Record<string, unknown>,
  baseSlug: string,
  lang: LangCode,
  errors: string[],
  warnings: string[],
  fixes: string[],
  autoFix: boolean,
  forceSlugRegeneration: boolean
): BlogFrontmatter {
  const isSourceLang = lang === 'fr';
  const expectedSlug = generateTranslationSlug(baseSlug || 'untitled', lang, isSourceLang);
  
  // Champs requis avec valeurs par défaut
  const defaults: Partial<BlogFrontmatter> = {
    title: 'Sans titre',
    description: 'Description manquante - à compléter',
    pubDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    author: 'Kiki en Christ',
    lang,
    translationKey: baseSlug || expectedSlug,
    category: 'vie-chrétienne',
    tags: [],
    featured: false,
    draft: false,
    readingTime: 10,
    coverImage: '/images/blog/default-cover.jpg',
    ogImage: 'https://kikienchrist.vercel.app/og/blog/default.png',
    slug: expectedSlug,
  };
  
  // Appliquer défauts pour champs manquants
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (!(key in fm) || fm[key] === '' || fm[key] === null || fm[key] === undefined) {
      fm[key] = defaultValue;
      if (autoFix) fixes.push(`${key} ajouté (défaut)`);
    }
  }
  
  // Valider catégorie
  const validCategories = BlogFrontmatterSchema.shape.category.options as string[];
  if (fm.category && !validCategories.includes(fm.category as string)) {
    warnings.push(`Catégorie invalide: ${fm.category}, utilisation: vie-chrétienne`);
    if (autoFix) {
      fm.category = 'vie-chrétienne';
      fixes.push('Catégorie corrigée: vie-chrétienne');
    }
  }
  
  // Valider série
  if (fm.series && typeof fm.series === 'string' && fm.series.includes('undefined')) {
    if (autoFix) {
      fm.series = 'apprendre-à-prier';
      fixes.push('Série corrigée: apprendre-à-prier');
    }
  }
  
  // Valider slug - forcer régénération si forceSlugRegeneration
  if (forceSlugRegeneration || !fm.slug || fm.slug === 'undefined') {
    fm.slug = expectedSlug;
    if (autoFix) fixes.push(`Slug généré: ${expectedSlug}`);
  }
  
  // Validation finale Zod
  const result = BlogFrontmatterSchema.safeParse(fm);
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`Blog validation: ${issue.path.join('.')}: ${issue.message}`);
    }
  }
  
  return result.success ? result.data : (fm as BlogFrontmatter);
}

function validateAndFixLegal(
  fm: Record<string, unknown>,
  baseSlug: string,
  lang: LangCode,
  errors: string[],
  warnings: string[],
  fixes: string[],
  autoFix: boolean,
  forceSlugRegeneration: boolean
): LegalPageFrontmatter {
  const isSourceLang = lang === 'fr';
  const expectedSlug = generateTranslationSlug(baseSlug || 'untitled', lang, isSourceLang);
  
  const defaults: Partial<LegalPageFrontmatter> = {
    title: 'Sans titre',
    description: 'Description manquante - à compléter',
    pageSlug: expectedSlug,
    lang,
    translationKey: baseSlug || expectedSlug,
    lastUpdated: new Date().toISOString().split('T')[0],
    version: '1.0.0',
    slug: expectedSlug,
  };
  
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (!(key in fm) || fm[key] === '' || fm[key] === null || fm[key] === undefined) {
      fm[key] = defaultValue;
      if (autoFix) fixes.push(`${key} ajouté (défaut)`);
    }
  }
  
  // Forcer régénération slug pour legal aussi
  if (forceSlugRegeneration) {
    fm.slug = expectedSlug;
    if (autoFix) fixes.push(`Slug régénéré: ${expectedSlug}`);
  }
  
  const result = LegalPageFrontmatterSchema.safeParse(fm);
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`Legal validation: ${issue.path.join('.')}: ${issue.message}`);
    }
  }
  
  return result.success ? result.data : (fm as LegalPageFrontmatter);
}

function validateAndFixBook(
  fm: Record<string, unknown>,
  baseSlug: string,
  lang: LangCode,
  errors: string[],
  warnings: string[],
  fixes: string[],
  autoFix: boolean,
  forceSlugRegeneration: boolean
): BookFrontmatter {
  const defaults: Partial<BookFrontmatter> = {
    id: baseSlug || 'untitled',
    title: 'Sans titre',
    description: 'Description manquante',
    author: 'Kiki en Christ',
    category: 'Vie chrétienne',
    tags: [],
    active: true,
    pubDate: new Date().toISOString().split('T')[0],
  };
  
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (!(key in fm) || fm[key] === '' || fm[key] === null || fm[key] === undefined) {
      fm[key] = defaultValue;
      if (autoFix) fixes.push(`${key} ajouté (défaut)`);
    }
  }
  
  const result = BookFrontmatterSchema.safeParse(fm);
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`Book validation: ${issue.path.join('.')}: ${issue.message}`);
    }
  }
  
  return result.success ? result.data : (fm as BookFrontmatter);
}

// ──────────────────────────────────────────────
// Sérialisation Markdown + frontmatter YAML
// ──────────────────────────────────────────────

function serializeMarkdown(
  frontmatter: Record<string, unknown>,
  body: string,
  originalFmRaw?: string
): string {
  return serializeMarkdownClean(frontmatter, body);
}

/**
 * Sérialisation YAML propre pour frontmatter
 */
export function stringifyYaml(obj: Record<string, unknown>): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}: [${value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(', ')}]`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      const str = String(value).replace(/"/g, '\\"');
      lines.push(`${key}: "${str}"`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Sérialisation complète Markdown avec frontmatter YAML propre
 */
export function serializeMarkdownClean(frontmatter: Record<string, unknown>, body: string): string {
  const yaml = stringifyYaml(frontmatter);
  return `---\n${yaml}\n---\n\n${body.trim()}\n`;
}