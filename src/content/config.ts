import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ──────────────────────────────────────────────
// Blog Collection (Markdown + Frontmatter)
// ──────────────────────────────────────────────
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(10).max(300),
    pubDate: z.string().datetime({ offset: true }),
    updatedDate: z.string().datetime({ offset: true }).optional(),
    author: z.string().default('Kiki en Christ'),
    authorRole: z.string().optional(),
    lang: z.enum(['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi']),
    translationKey: z.string().optional(),
    category: z.enum([
      'prière',
      'formation',
      'témoignage',
      'vie-chrétienne',
      'famille',
      'mission',
      'actualité',
      'ressource',
      'discernement',
      'jeûne',
      'épreuves',
      'guerre spirituelle',
      'guérison',
      'routine',
      'jeunes',
      'couple',
    ]),
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
    structuredData: z
      .object({
        type: z.enum(['BlogPosting', 'Article']).default('BlogPosting'),
        wordCount: z.number().int().positive().optional(),
      })
      .optional(),
  }),
});

// ──────────────────────────────────────────────
// Authors Collection (Data files - JSON)
// ──────────────────────────────────────────────
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.object({
      fr: z.string(),
      en: z.string(),
      es: z.string(),
      pt: z.string(),
      it: z.string(),
      de: z.string(),
      nl: z.string(),
      pl: z.string(),
      ar: z.string(),
      zh: z.string(),
      hi: z.string(),
    }),
    avatar: z.string().url(),
    social: z
      .object({
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
        youtube: z.string().url().optional(),
      })
      .optional(),
    email: z.string().email().optional(),
  }),
});

// ──────────────────────────────────────────────
// Legal Pages Collection
// ──────────────────────────────────────────────
const legalPages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legalPages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pageSlug: z.string().regex(/^[a-z-]+$/),
    slug: z
      .string()
      .regex(/^[a-z-]+$/)
      .optional(), // Legacy support for old frontmatter
    lang: z.enum(['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi']),
    translationKey: z.string().optional(),
    lastUpdated: z.string().date(),
    version: z.string().optional(),
  }),
});

// ──────────────────────────────────────────────
// Books Collection (Decap CMS managed - Markdown in src/content/books)
// ──────────────────────────────────────────────
const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
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
  }),
});

// ──────────────────────────────────────────────
// Translations (i18n) Collection - Data files in src/data/i18n
// ──────────────────────────────────────────────
const translations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/i18n' }),
  schema: z
    .object({
      lang: z.enum(['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'zh', 'hi']),
      nativeName: z.string().optional(),
      englishName: z.string().optional(),
      dir: z.enum(['ltr', 'rtl']).optional(),
      dateFormat: z.string().optional(),
      translations: z.record(z.unknown()).optional(),
    })
    .passthrough(), // Accepte les champs supplémentaires (format plat existant)
});

// ──────────────────────────────────────────────
// Site Config (Global) - Single JSON file in src/data/config
// ──────────────────────────────────────────────
const siteConfig = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/config' }),
  schema: z.object({
    siteName: z.string(),
    siteUrl: z.string().url(),
    defaultLang: z.enum(['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'zh', 'hi']),
    contactEmail: z.string().email(),
    ga4Id: z.string().optional(),
    metaPixelId: z.string().optional(),
  }),
});

export const collections = {
  blog,
  authors,
  legalPages,
  books,
  translations,
  siteConfig,
};
