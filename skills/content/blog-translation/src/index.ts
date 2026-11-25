/**
 * Blog Translation - Point d'entrée principal
 */
export { TranslationPipeline, translateArticles } from './translation-pipeline.js';
export { createProvider, getProviderNames } from './providers/index.js';
export { OllamaProvider } from './providers/ollama-provider.js';
export { LibreTranslateProvider } from './providers/libretranslate-provider.js';
export { DeepLProvider } from './providers/deepl-provider.js';
export { extractAllArticles, getSourceArticles, getMissingTranslations } from './markdown-extractor.js';
export type { ExtractedArticle } from './markdown-extractor.js';
export { getFlatGlossary, getGlossaryForContext, GLOSSARY } from './glossary.js';
export type {
  LangCode,
  ProviderName,
  TranslationProvider,
  TranslationOptions,
  GlossaryEntry,
  BlogArticle,
  BlogFrontmatter,
  TranslationJob,
  TranslationResult,
  BatchTranslationResult,
  TranslationConfig,
} from './types.js';

export type { ParsedMarkdown } from '@kikienchrist/markdown-sanitizer';