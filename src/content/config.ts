import { defineCollection, z } from 'astro:content';

// Collection Blog - Articles multilingues
export const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Métadonnées obligatoires
    title: z.string().min(1).max(120),
    description: z.string().min(10).max(300),
    pubDate: z.string().datetime({ offset: true }), // ISO 8601 avec timezone
    updatedDate: z.string().datetime({ offset: true }).optional(),
    author: z.string().default('Équipe Kiki en Christ'),
    authorRole: z.string().optional(),
    
    // Langue & Localisation
    lang: z.enum(['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi']),
    translationKey: z.string().optional(), // Clé pour lier les traductions d'un même article
    
    // Catégorisation
    category: z.enum([
      'prière',           // Vie de prière
      'formation',        // Enseignement / Formation
      'témoignage',       // Témoignages
      'vie-chrétienne',   // Vie pratique
      'famille',          // Famille / Couple / Enfants
      'mission',          // Mission / Évangélisation
      'actualité',        // Actualités du ministère
      'ressource',        // Outils / Ressources
      'discernement',     // Entendre la voix de Dieu
      'jeûne',            // Jeûne et prière
      'épreuves',         // Désert spirituel / silêncio de Dieu
      'guerre spirituelle', // Armure de Dieu / autorité
      'guérison',         // Prière pour la guérison
      'routine',          // Routines spirituelles matin/soir
      'jeunes',           // Génération Z / Jeunes
      'couple'            // Mariage / Prière en couple
    ]),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(), // Ex: "Les 7 Prières", "Combat Spirituel"
    seriesOrder: z.number().int().positive().optional(),
    
    // SEO
    canonicalURL: z.string().url().optional(),
    noindex: z.boolean().default(false),
    nofollow: z.boolean().default(false),
    ogImage: z.string().url().optional(), // Image Open Graph spécifique
    ogTitle: z.string().max(60).optional(),
    ogDescription: z.string().max(160).optional(),
    
    // Contenu
    featured: z.boolean().default(false), // Article mis en avant
    draft: z.boolean().default(false),
    readingTime: z.number().int().positive().optional(), // Minutes (calculé auto si absent)
    
    // Lead Magnet
    isLeadMagnet: z.boolean().default(false),
    leadMagnetTitle: z.string().optional(),
    leadMagnetDescription: z.string().optional(),
    leadMagnetFile: z.string().url().optional(), // URL PDF/guide
    
    // Podcast / Vidéo liés
    relatedPodcastEpisode: z.string().optional(), // ID épisode
    relatedVideo: z.string().url().optional(),
    
    // Données structurées JSON-LD
    structuredData: z.object({
      type: z.enum(['BlogPosting', 'Article', 'NewsArticle']).default('BlogPosting'),
      wordCount: z.number().int().positive().optional(),
    }).optional(),
  }),
});

// Collection Auteurs (pour pages auteur + schema Person)
export const authors = defineCollection({
  type: 'data',
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
      ru: z.string(),
      zh: z.string(),
      hi: z.string(),
    }),
    avatar: z.string().url(),
    social: z.object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      instagram: z.string().url().optional(),
      youtube: z.string().url().optional(),
    }).optional(),
    email: z.string().email().optional(),
  }),
});

// Collection Pages statiques (Mentions légales, CGV, etc. - 11 langues)
export const legalPages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pageSlug: z.string(), // mentions-legales, confidentialite, cookies, cgv, accessibilite (renommé car 'slug' est réservé par Astro)
    lang: z.enum(['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi']),
    lastUpdated: z.string().datetime({ offset: true }),
    version: z.string(),
    // content: z.string() — retiré: pour type:'content', Astro injecte le body Markdown dans entry.data.content automatiquement
    requiredByLaw: z.boolean().default(true),
    jurisdiction: z.array(z.string()).default(['EU', 'FR']), // EU, FR, US, CA, BR, CN, etc.
  }),
});

export const collections = { blog, authors, legalPages };