/**
 * Types pour le pipeline de traduction blog
 */
export type LangCode = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de' | 'nl' | 'pl' | 'ar' | 'ru' | 'zh' | 'hi';

export type ProviderName = 'ollama' | 'libretranslate' | 'deepl';

export interface TranslationProvider {
  name: ProviderName;
  translate(text: string, sourceLang: LangCode, targetLang: LangCode, options?: TranslationOptions): Promise<string>;
  isAvailable(): Promise<boolean>;
  getSupportedLanguages(): Promise<LangCode[]>;
}

export interface TranslationOptions {
  /** Modèle à utiliser (pour Ollama) */
  model?: string;
  /** Contexte/domain pour amélioration qualité */
  context?: string;
  /** Glossaire de termes à préserver */
  glossary?: GlossaryEntry[];
  /** Température (0-1) */
  temperature?: number;
  /** Max tokens */
  maxTokens?: number;
}

export interface GlossaryEntry {
  source: string;
  target: string;
  /** Contexte où appliquer (ex: 'bible', 'ui', 'names') */
  context?: string;
  /** Ne pas traduire (garder tel quel) */
  keepAsIs?: boolean;
}

export interface BlogArticle {
  slug: string;
  translationKey: string;
  frontmatter: BlogFrontmatter;
  body: string;
  sourceLang: LangCode;
  featured?: boolean;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  author: string;
  authorRole?: string;
  lang: LangCode;
  translationKey: string;
  category: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  featured: boolean;
  draft: boolean;
  readingTime: number;
  coverImage: string;
  ogImage: string;
  isLeadMagnet?: boolean;
  leadMagnetTitle?: string;
  leadMagnetDescription?: string;
  leadMagnetFile?: string;
  relatedPodcastEpisode?: string;
  relatedVideo?: string;
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  pageSlug: string; // Astro blog utilise pageSlug
}

export interface TranslationJob {
  article: BlogArticle;
  targetLang: LangCode;
  provider: ProviderName;
  options?: TranslationOptions;
  priority?: number;
}

export interface TranslationResult {
  job: TranslationJob;
  success: boolean;
  translatedFrontmatter?: BlogFrontmatter;
  translatedBody?: string;
  error?: string;
  durationMs: number;
  provider: ProviderName;
  model?: string;
}

export interface BatchTranslationResult {
  results: TranslationResult[];
  summary: {
    total: number;
    success: number;
    failed: number;
    totalDurationMs: number;
    byProvider: Record<ProviderName, { success: number; failed: number }>;
    byLang: Record<LangCode, { success: number; failed: number }>;
  };
}

export interface TranslationConfig {
  defaultProvider: ProviderName;
  fallbackProviders: ProviderName[];
  ollama: {
    baseUrl: string;
    defaultModel: string;
    timeoutMs: number;
  };
  libretranslate: {
    baseUrl: string;
    apiKey?: string;
  };
  deepl: {
    apiKey: string;
    apiUrl: string;
  };
  glossary: GlossaryEntry[];
  concurrency: number;
  retryAttempts: number;
  retryDelayMs: number;
  outputDir: string;
  dryRun: boolean;
}