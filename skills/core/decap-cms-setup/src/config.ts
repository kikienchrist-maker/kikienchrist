/**
 * Configuration par défaut pour Decap CMS
 */
import type { DecapConfig, CollectionConfig, FieldConfig, BackendConfig } from './types.js';

export const SUPPORTED_LANGS = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'] as const;
export const DEFAULT_LANG = 'fr';

export const DEFAULT_DECAP_CONFIG: DecapConfig = {
  backend: {
    name: 'git-gateway',
    branch: 'main',
    commit_messages: {
      create: 'Create {{collection}} "{{slug}}"',
      update: 'Update {{collection}} "{{slug}}"',
      delete: 'Delete {{collection}} "{{slug}}"',
      uploadMedia: 'Upload media "{{path}}"',
      deleteMedia: 'Delete media "{{path}}"',
      openAuthoring: 'Open authoring for {{collection}} "{{slug}}"',
    },
  },
  media_folder: 'public/images',
  public_folder: '/images',
  collections: [],
  publish_mode: 'editorial_workflow',
  slug: {
    encoding: 'unicode',
    sanitize_replacement: '-',
    clean_accents: true,
  },
};

export const BLOG_CATEGORIES = [
  'priere',
  'etude-biblique',
  'temoignage',
  'vie-chretienne',
  'theologie',
  'jeunes',
  'famille',
  'guerre-spirituelle',
  'jeune',
  'guérison',
  'impossible',
  'enfants',
  'couple',
  'matin-soir',
  'generation-z',
  'routine',
  'autorite',
  'desert-spirituel',
] as const;

export const LEGAL_PAGE_TYPES = [
  'mentions-legales',
  'confidentialite',
  'cookies',
  'cgv',
  'accessibilite',
] as const;

export const BOOK_STATUS = ['draft', 'published', 'archived'] as const;

export function createBlogCollection(): CollectionConfig {
  return {
    name: 'blog',
    label: 'Articles de Blog',
    label_singular: 'Article',
    folder: 'src/content/blog',
    create: true,
    slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
    fields: [
      { label: 'Titre', name: 'title', widget: 'string', required: true },
      { label: 'Slug', name: 'pageSlug', widget: 'string', required: true, pattern: '^[a-z0-9-]+$' },
      { label: 'Clé de traduction', name: 'translationKey', widget: 'string', required: true },
      { label: 'Auteur', name: 'author', widget: 'relation', required: true, collection: 'authors', search_fields: ['name'], value_field: 'id', display_fields: ['name'] },
      { label: 'Date', name: 'date', widget: 'datetime', required: true, date_format: 'YYYY-MM-DD', time_format: false },
      { label: 'Langue', name: 'lang', widget: 'select', required: true, options: [...SUPPORTED_LANGS] },
      { label: 'Catégorie', name: 'category', widget: 'select', required: true, options: [...BLOG_CATEGORIES] },
      { label: 'Tags', name: 'tags', widget: 'list', required: false, fields: [{ label: 'Tag', name: 'tag', widget: 'string' }] },
      { label: 'Image de couverture', name: 'coverImage', widget: 'image', required: false },
      { label: 'Alt image', name: 'coverImageAlt', widget: 'string', required: false },
      { label: 'Extrait', name: 'excerpt', widget: 'text', required: true, hint: 'Résumé pour liste et SEO (max 160 caractères)' },
      { label: 'Contenu', name: 'body', widget: 'markdown', required: true },
      { label: 'Temps de lecture (min)', name: 'readingTime', widget: 'number', required: false, min: 1 },
      { label: 'SEO Title', name: 'seoTitle', widget: 'string', required: false, hint: 'Si vide, utilise le titre' },
      { label: 'SEO Description', name: 'seoDescription', widget: 'text', required: false, hint: 'Si vide, utilise l\'extrait' },
      { label: 'Canonical URL', name: 'canonicalUrl', widget: 'string', required: false },
      { label: 'Publié', name: 'published', widget: 'boolean', required: true, default: true },
      { label: 'Featured', name: 'featured', widget: 'boolean', required: false, default: false },
    ],
    meta: [
      { label: 'Path', name: 'path', widget: 'hidden' },
    ],
  };
}

export function createLegalCollection(): CollectionConfig {
  return {
    name: 'legal',
    label: 'Pages Légales',
    label_singular: 'Page Légale',
    folder: 'src/content/legalPages',
    create: true,
    slug: '{{slug}}',
    fields: [
      { label: 'Titre', name: 'title', widget: 'string', required: true },
      { label: 'Slug', name: 'slug', widget: 'string', required: true, pattern: '^[a-z0-9-]+$' },
      { label: 'Clé de traduction', name: 'translationKey', widget: 'string', required: true },
      { label: 'Langue', name: 'lang', widget: 'select', required: true, options: [...SUPPORTED_LANGS] },
      { label: 'Type de page', name: 'pageType', widget: 'select', required: true, options: [...LEGAL_PAGE_TYPES] },
      { label: 'Contenu', name: 'body', widget: 'markdown', required: true },
      { label: 'SEO Title', name: 'seoTitle', widget: 'string', required: false },
      { label: 'SEO Description', name: 'seoDescription', widget: 'text', required: false },
      { label: 'Dernière mise à jour', name: 'lastUpdated', widget: 'datetime', required: false, date_format: 'YYYY-MM-DD' },
    ],
  };
}

export function createTranslationsCollection(): CollectionConfig {
  const langFields: FieldConfig[] = SUPPORTED_LANGS.map(lang => ({
    label: lang,
    name: lang,
    widget: 'string',
    required: lang === DEFAULT_LANG,
  }));
  
  return {
    name: 'translations',
    label: 'Traductions (i18n)',
    label_singular: 'Fichier de traduction',
    folder: 'src/data/i18n',
    create: true,
    slug: '{{slug}}',
    fields: [
      { label: 'Code langue', name: 'lang', widget: 'hidden', default: 'fr' },
      { label: 'Traductions', name: 'translations', widget: 'object', fields: langFields },
    ],
  };
}

export function createBooksCollection(): CollectionConfig {
  return {
    name: 'books',
    label: 'Livres',
    label_singular: 'Livre',
    folder: 'src/content/books',
    create: true,
    slug: '{{slug}}',
    fields: [
      { label: 'Titre', name: 'title', widget: 'string', required: true },
      { label: 'Slug', name: 'slug', widget: 'string', required: true, pattern: '^[a-z0-9-]+$' },
      { label: 'Auteur', name: 'author', widget: 'relation', required: true, collection: 'authors', search_fields: ['name'], value_field: 'id', display_fields: ['name'] },
      { label: 'Description courte', name: 'shortDescription', widget: 'text', required: true },
      { label: 'Description longue', name: 'longDescription', widget: 'markdown', required: false },
      { label: 'Couverture', name: 'coverImage', widget: 'image', required: false },
      { label: 'Prix (€)', name: 'price', widget: 'number', required: false, min: 0, step: 0.01 },
      { label: 'ISBN', name: 'isbn', widget: 'string', required: false },
      { label: 'Pages', name: 'pages', widget: 'number', required: false, min: 1 },
      { label: 'Langue', name: 'lang', widget: 'select', required: true, options: [...SUPPORTED_LANGS] },
      { label: 'Statut', name: 'status', widget: 'select', required: true, options: [...BOOK_STATUS], default: 'draft' },
      { label: 'Date publication', name: 'publishedDate', widget: 'date', required: false, date_format: 'YYYY-MM-DD' },
      { label: 'Lien Payhip', name: 'payhipUrl', widget: 'string', required: false },
      { label: 'Lien Amazon', name: 'amazonUrl', widget: 'string', required: false },
      { label: 'Lien Lulu', name: 'luluUrl', widget: 'string', required: false },
      { label: 'Tags', name: 'tags', widget: 'list', required: false, fields: [{ label: 'Tag', name: 'tag', widget: 'string' }] },
    ],
  };
}

export function createAuthorsCollection(): CollectionConfig {
  return {
    name: 'authors',
    label: 'Auteurs',
    label_singular: 'Auteur',
    folder: 'src/content/authors',
    create: true,
    slug: '{{slug}}',
    fields: [
      { label: 'Nom', name: 'name', widget: 'string', required: true },
      { label: 'Slug', name: 'slug', widget: 'string', required: true, pattern: '^[a-z0-9-]+$' },
      { label: 'Bio courte', name: 'shortBio', widget: 'text', required: false },
      { label: 'Bio complète', name: 'bio', widget: 'markdown', required: false },
      { label: 'Photo', name: 'avatar', widget: 'image', required: false },
      { label: 'Email', name: 'email', widget: 'string', required: false, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
      { label: 'Site web', name: 'website', widget: 'string', required: false },
      { label: 'Twitter', name: 'twitter', widget: 'string', required: false },
      { label: 'LinkedIn', name: 'linkedin', widget: 'string', required: false },
    ],
  };
}

export function createSiteConfigCollection(): CollectionConfig {
  return {
    name: 'siteConfig',
    label: 'Configuration du Site',
    label_singular: 'Config',
    files: [
      {
        name: 'siteConfig',
        label: 'Configuration Globale',
        file: 'src/data/site-config.json',
        fields: [
          { label: 'Nom du site', name: 'siteName', widget: 'string', required: true, default: 'Kiki en Christ' },
          { label: 'Description', name: 'siteDescription', widget: 'text', required: true },
          { label: 'URL', name: 'siteUrl', widget: 'string', required: true, default: 'https://kikienchrist.vercel.app' },
          { label: 'Email contact', name: 'contactEmail', widget: 'string', required: true, default: 'kikienchrist@gmail.com' },
          { label: 'Langue par défaut', name: 'defaultLang', widget: 'select', required: true, options: [...SUPPORTED_LANGS], default: DEFAULT_LANG },
          { label: 'Langues supportées', name: 'supportedLangs', widget: 'list', required: true, fields: [{ label: 'Langue', name: 'lang', widget: 'select', options: [...SUPPORTED_LANGS] }] },
          { label: 'Logo', name: 'logo', widget: 'image', required: false },
          { label: 'Favicon', name: 'favicon', widget: 'image', required: false },
          { label: 'OG Image par défaut', name: 'defaultOgImage', widget: 'image', required: false },
          { label: 'Twitter', name: 'twitter', widget: 'string', required: false },
          { label: 'Facebook', name: 'facebook', widget: 'string', required: false },
          { label: 'Instagram', name: 'instagram', widget: 'string', required: false },
          { label: 'YouTube', name: 'youtube', widget: 'string', required: false },
          { label: 'FirstPromoter ID', name: 'firstPromoterId', widget: 'string', required: false },
          { label: 'GA Measurement ID', name: 'gaId', widget: 'string', required: false },
        ],
      },
    ],
  };
}

export function createAllCollections(): CollectionConfig[] {
  return [
    createBlogCollection(),
    createLegalCollection(),
    createTranslationsCollection(),
    createBooksCollection(),
    createAuthorsCollection(),
    createSiteConfigCollection(),
  ];
}