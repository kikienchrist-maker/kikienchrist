/**
 * Parser robuste pour Markdown + frontmatter YAML
 * Gère : frontmatter imbriqué, blocs de code, encoding, types
 */
import { load as parseYaml, type LoadOptions, DEFAULT_SCHEMA } from 'js-yaml';
import matter from 'gray-matter';
import type { AnyFrontmatter } from './schemas.js';

const YAML_OPTIONS: LoadOptions = { schema: DEFAULT_SCHEMA };

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>;
  body: string;
  originalFmRaw: string;
  hadNestedFm: boolean;
}

export interface ParseOptions {
  /** Détecter et extraire frontmatter imbriqué dans ```markdown\n--- */
  extractNested?: boolean;
  /** Langue du fichier (pour logs) */
  lang?: string;
}

/**
 * Parse un fichier Markdown avec frontmatter YAML
 * Supporte : frontmatter normal, frontmatter imbriqué (Ollama), blocs de code
 */
export function parseMarkdown(content: string, options: ParseOptions = {}): ParsedMarkdown {
  const { extractNested = true, lang } = options;
  
  // 1. Essayer gray-matter d'abord (standard)
  const matterResult = matter(content, {
    engines: { yaml: (s: string) => parseYaml(s, YAML_OPTIONS) as object },
    excerpt: false,
  });
  
  let frontmatter = matterResult.data as Record<string, unknown>;
  let body = matterResult.content;
  let originalFmRaw = `---\n${matter.stringify('', frontmatter).split('\n').slice(1, -1).join('\n')}\n---`;
  let hadNestedFm = false;
  
  // 2. Détecter frontmatter imbriqué dans ```markdown ou ```yaml
  if (extractNested && (content.includes('```markdown\n---') || content.includes('```yaml\n---'))) {
    const nested = extractNestedFrontmatter(content);
    if (nested) {
      frontmatter = { ...frontmatter, ...nested.frontmatter }; // Priorité au nested
      body = nested.body ?? '';
      hadNestedFm = true;
      if (lang) {
        console.log(`[${lang}] Frontmatter imbriqué détecté et extrait`);
      }
    }
  }
  
  return { frontmatter, body, originalFmRaw, hadNestedFm };
}

/**
 * Extrait le frontmatter imbriqué d'un bloc ```markdown\n---\n...\n---```
 */
function extractNestedFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } | null {
  // Pattern: ```markdown\n---\n(frontmatter)\n---\n(body)\n```
  // ou: ```yaml\n---\n(frontmatter)\n---\n```
  const patterns = [
    /```markdown\n---\n([\s\S]*?)\n---\n([\s\S]*?)\n```/,
    /```yaml\n---\n([\s\S]*?)\n---\n([\s\S]*?)\n```/,
    /```\n---\n([\s\S]*?)\n---\n([\s\S]*?)\n```/,
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match?.[1] && match?.[2]) {
      const fmText = match[1].trim();
      const body = match[2].trim();
      
      try {
        const frontmatter = parseYaml(fmText, YAML_OPTIONS) as Record<string, unknown>;
        if (frontmatter && Object.keys(frontmatter).length > 0) {
          return { frontmatter, body };
        }
      } catch {
        // Ignorer erreur parsing, essayer pattern suivant
      }
    }
  }
  
  return null;
}

/**
 * Normalise les valeurs du frontmatter vers les bons types
 * (gray-matter met tout en string)
 */
export function normalizeFrontmatterTypes(
  fm: Record<string, unknown>,
  schema: 'blog' | 'legal' | 'book' = 'blog'
): Record<string, unknown> {
  const normalized = { ...fm };
  
  // Boolean fields
  const boolFields = ['featured', 'draft', 'isLeadMagnet', 'active'];
  for (const field of boolFields) {
    if (field in normalized) {
      const val = normalized[field];
      if (typeof val === 'string') {
        normalized[field] = val.toLowerCase() === 'true';
      } else if (typeof val !== 'boolean') {
        normalized[field] = Boolean(val);
      }
    }
  }
  
  // Number fields
  const numFields = ['readingTime', 'seriesOrder', 'pageCount', 'priceEUR', 'promoPriceEUR'];
  for (const field of numFields) {
    if (field in normalized) {
      const val = normalized[field];
      if (typeof val === 'string') {
        const n = parseFloat(val);
        normalized[field] = isNaN(n) ? undefined : n;
      } else if (typeof val !== 'number') {
        delete normalized[field];
      }
    }
  }
  
  // Array fields (tags)
  if ('tags' in normalized) {
    const val = normalized.tags;
    if (typeof val === 'string') {
      // Essayer JSON.parse d'abord
      try {
        const parsed = JSON.parse(val);
        normalized.tags = Array.isArray(parsed) ? parsed : val.split(',').map(s => s.trim()).filter(Boolean);
      } catch {
        normalized.tags = val.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (!Array.isArray(val)) {
      normalized.tags = [];
    }
  }
  
  // Date fields - garder en string ISO mais valider
  const dateFields = ['pubDate', 'updatedDate', 'lastUpdated'];
  for (const field of dateFields) {
    if (field in normalized && typeof normalized[field] === 'string') {
      const date = new Date(normalized[field] as string);
      if (isNaN(date.getTime())) {
        console.warn(`[WARN] Date invalide pour ${field}: ${normalized[field]}`);
        delete normalized[field];
      }
    }
  }
  
  return normalized;
}

/**
 * Détecte le type de collection basé sur le frontmatter
 */
export function detectCollectionType(fm: Record<string, unknown>): 'blog' | 'legal' | 'book' | 'unknown' {
  if ('category' in fm && 'series' in fm && 'tags' in fm) return 'blog';
  if ('pageSlug' in fm && 'lastUpdated' in fm) return 'legal';
  if ('id' in fm && 'priceEUR' in fm && 'coverImageFr' in fm) return 'book';
  return 'unknown';
}