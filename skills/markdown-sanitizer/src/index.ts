/**
 * Markdown Sanitizer - Point d'entrée principal
 * Nettoie, valide, corrige les fichiers Markdown + frontmatter YAML
 */
export { sanitizeMarkdown, serializeMarkdownClean, stringifyYaml, type SanitizeOptions, type SanitizeResult } from './sanitizer.js';
export { parseMarkdown, normalizeFrontmatterTypes, detectCollectionType, type ParsedMarkdown } from './parser.js';
export { slugifyText, generateTranslationSlug, validateSlug, extractBaseSlug, type SlugifyOptions } from './slugify.js';
export { 
  BlogFrontmatterSchema, 
  LegalPageFrontmatterSchema, 
  BookFrontmatterSchema,
  AnyFrontmatterSchema,
  LangCodeSchema,
  CategorySchema,
  type BlogFrontmatter,
  type LegalPageFrontmatter,
  type BookFrontmatter,
  type AnyFrontmatter,
  type LangCode 
} from './schemas.js';