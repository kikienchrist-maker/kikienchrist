/**
 * Schémas de validation Zod pour frontmatter Markdown
 * Compatible avec collections Astro (blog, legalPages, books, etc.)
 */
import { z } from 'zod';

// ──────────────────────────────────────────────
// Types de base réutilisables
// ──────────────────────────────────────────────

export const LangCodeSchema = z.enum([
  'fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'
]);

export const CategorySchema = z.enum([
  'prière', 'formation', 'témoignage', 'vie-chrétienne',
  'famille', 'mission', 'actualité', 'ressource',
  'discernement', 'jeûne', 'épreuves', 'guerre spirituelle',
  'guérison', 'routine', 'jeunes', 'couple'
]);

export const LegalPageSlugSchema = z.enum([
  'mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'
]);

// Slug ASCII uniquement (pas de caractères accentués)
export const SlugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug doit être ASCII lowercase avec tirets');

// ──────────────────────────────────────────────
// Schémas par type de collection
// ──────────────────────────────────────────────

export const BlogFrontmatterSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(10).max(300),
  pubDate: z.string().datetime({ offset: true }),
  updatedDate: z.string().datetime({ offset: true }).optional(),
  author: z.string().default('Kiki en Christ'),
  authorRole: z.string().optional(),
  lang: LangCodeSchema,
  translationKey: z.string().optional(),
  category: CategorySchema,
  tags: z.array(z.string()).default([]),
  series: z.string().optional(),
  seriesOrder: z.number().int().positive().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  readingTime: z.number().int().positive().optional(),
  isLeadMagnet: z.boolean().default(false),
  leadMagnetTitle: z.string().optional(),
  leadMagnetDescription: z.string().optional(),
  leadMagnetFile: z.string().url().optional(),
  relatedPodcastEpisode: z.string().optional(),
  relatedVideo: z.string().url().optional(),
  canonicalURL: z.string().url().optional(),
  ogImage: z.string().url().optional(),
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(160).optional(),
  coverImage: z.string().optional(),
  slug: SlugSchema, // Doit être unique globalement
});

export const LegalPageFrontmatterSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(10).max(300),
  pageSlug: z.string().regex(/^[a-z-]+$/),
  slug: z.string().regex(/^[a-z-]+$/).optional(),
  lang: LangCodeSchema,
  translationKey: z.string().optional(),
  lastUpdated: z.string().date(),
  version: z.string().optional(),
});

export const BookFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  author: z.string().default('Kiki en Christ'),
  isbn: z.string().optional(),
  priceEUR: z.number().positive().optional(),
  promoPriceEUR: z.number().positive().optional(),
  payhipUrl: z.string().url().optional(),
  luluUrl: z.string().url().optional(),
  amazonUrl: z.string().url().optional(),
  coverImageFr: z.string().optional(),
  coverImageEn: z.string().optional(),
  coverImageEs: z.string().optional(),
  pubDate: z.string().date(),
  pageCount: z.number().int().positive().optional(),
  category: z.enum(['Spiritualité', 'Prière', 'Théologie', 'Vie chrétienne', 'Jeunesse']),
  tags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

// ──────────────────────────────────────────────
// Type d'union pour détection automatique
// ──────────────────────────────────────────────

export const AnyFrontmatterSchema = z.union([
  BlogFrontmatterSchema,
  LegalPageFrontmatterSchema,
  BookFrontmatterSchema,
]);

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;
export type LegalPageFrontmatter = z.infer<typeof LegalPageFrontmatterSchema>;
export type BookFrontmatter = z.infer<typeof BookFrontmatterSchema>;
export type AnyFrontmatter = z.infer<typeof AnyFrontmatterSchema>;
export type LangCode = z.infer<typeof LangCodeSchema>;