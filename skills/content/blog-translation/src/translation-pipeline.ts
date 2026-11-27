/**
 * Pipeline principal de traduction
 * Orchestre: extraction → traduction → validation → écriture
 * Avec cache persistant + fallback intelligent
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname, resolve, isAbsolute } from 'path';
import pLimit from 'p-limit';
import ora from 'ora';
import chalk from 'chalk';
import { serializeMarkdownClean, slugifyText, generateTranslationSlug } from '@kikienchrist/markdown-sanitizer';
import { createHash } from 'crypto';

/**
 * Trouve la racine du projet (contient package.json ou .git)
 */
function findProjectRoot(startDir: string = process.cwd()): string {
  let dir = resolve(startDir);
  while (dir !== resolve(dir, '..')) {
    if (existsSync(join(dir, 'package.json')) || existsSync(join(dir, '.git'))) {
      return dir;
    }
    dir = resolve(dir, '..');
  }
  return process.cwd();
}

/**
 * Résout un chemin relatif par rapport à la racine du projet
 */
function resolveProjectPath(relativePath: string): string {
  if (isAbsolute(relativePath)) return relativePath;
  const root = findProjectRoot();
  return resolve(root, relativePath);
}

/**
 * Cache de traduction persistant (fichier JSON)
 */
class TranslationCache {
  private cachePath: string;
  private data: Record<string, { translated: string; timestamp: number; provider: string }> = {};
  private dirty = false;

  constructor(cachePath: string) {
    this.cachePath = cachePath;
    this.load();
  }

  private load(): void {
    if (existsSync(this.cachePath)) {
      try {
        this.data = JSON.parse(readFileSync(this.cachePath, 'utf-8'));
      } catch {
        this.data = {};
      }
    }
  }

  private save(): void {
    if (this.dirty) {
      writeFileSync(this.cachePath, JSON.stringify(this.data, null, 2), 'utf-8');
      this.dirty = false;
    }
  }

  getKey(text: string, sourceLang: string, targetLang: string, provider: string): string {
    const hash = createHash('sha256').update(`${provider}|${sourceLang}|${targetLang}|${text}`).digest('hex').slice(0, 32);
    return hash;
  }

  get(text: string, sourceLang: string, targetLang: string, provider: string): string | null {
    const key = this.getKey(text, sourceLang, targetLang, provider);
    const entry = this.data[key];
    if (entry) return entry.translated;
    return null;
  }

  set(text: string, sourceLang: string, targetLang: string, provider: string, translated: string): void {
    const key = this.getKey(text, sourceLang, targetLang, provider);
    this.data[key] = { translated, timestamp: Date.now(), provider };
    this.dirty = true;
  }

  flush(): void {
    this.save();
  }

  stats(): { entries: number; providers: Record<string, number> } {
    const providers: Record<string, number> = {};
    for (const entry of Object.values(this.data)) {
      providers[entry.provider] = (providers[entry.provider] || 0) + 1;
    }
    return { entries: Object.keys(this.data).length, providers };
  }
}
import type {
  BlogArticle,
  BlogFrontmatter,
  TranslationJob,
  TranslationResult,
  BatchTranslationResult,
  TranslationConfig,
  LangCode,
  GlossaryEntry,
  TranslationProvider,
  ProviderName,
} from './types.js';
import { createProvider, getProviderNames } from './providers/index.js';
import { getFlatGlossary, getGlossaryForContext } from './glossary.js';
import { extractAllArticles, getMissingTranslations, ExtractedArticle } from './markdown-extractor.js';

export class TranslationPipeline {
  private config: TranslationConfig;
  private providerCache: Map<string, TranslationProvider> = new Map();
  private results: TranslationResult[] = [];
  private cache: TranslationCache;

  constructor(config: Partial<TranslationConfig> = {}) {
    const resolvedOutputDir = config.outputDir ? resolveProjectPath(config.outputDir) : resolveProjectPath('src/content/blog');
    const hasDeepLKey = config.deepl?.apiKey || process.env.DEEPL_API_KEY;
    
    this.config = {
      defaultProvider: hasDeepLKey ? 'deepl' : 'ollama',
      fallbackProviders: hasDeepLKey ? ['ollama'] : ['libretranslate', 'ollama'],
      ollama: {
        baseUrl: 'http://localhost:11434',
        defaultModel: 'llama3.2:1b',
        timeoutMs: 60000,
      },
      libretranslate: {
        baseUrl: 'https://libretranslate.de',
      },
      deepl: {
        apiKey: hasDeepLKey || '',
        apiUrl: 'https://api-free.deepl.com/v2',
      },
      glossary: [],
      concurrency: 2,
      retryAttempts: 2,
      retryDelayMs: 5000,
      outputDir: resolvedOutputDir,
      dryRun: false,
      ...config,
    };

    // Cache persistant dans le dossier du projet
    const cachePath = resolveProjectPath('.translation-cache.json');
    this.cache = new TranslationCache(cachePath);
  }

  async run(articles?: ExtractedArticle[], targetLangs?: LangCode[]): Promise<BatchTranslationResult> {
    const spinner = ora('Extraction des articles...').start();
    
    const allArticles = articles || extractAllArticles(this.config.outputDir);
    const sourceArticles = allArticles.filter(a => a.article.sourceLang === 'fr' || a.article.slug === a.article.translationKey);
    
    spinner.succeed(`${allArticles.length} articles extraits, ${sourceArticles.length} sources FR`);

    // Déterminer les langues cibles
    const targetLangList: LangCode[] = ['en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
    const langs = targetLangs || targetLangList.filter(l => l !== 'fr');
    
    // Trouver traductions manquantes
    const missing = getMissingTranslations(allArticles, langs);
    spinner.info(`${missing.length} articles avec traductions manquantes`);

    // Créer jobs de traduction
    const jobs: TranslationJob[] = [];
    for (const { translationKey, sourceArticle, missingLangs } of missing) {
      for (const lang of missingLangs) {
        jobs.push({
          article: sourceArticle.article,
          targetLang: lang,
          provider: this.config.defaultProvider,
          priority: sourceArticle.article.frontmatter.featured ? 10 : 5,
        });
      }
    }

    if (jobs.length === 0) {
      spinner.info('Aucune traduction nécessaire');
      return this.buildResult([]);
    }

    spinner.info(`${jobs.length} traductions à effectuer`);
    
    // Exécuter avec parallélisme limité
    const limit = pLimit(this.config.concurrency);
    const jobPromises = jobs.map(job => limit(() => this.executeJob(job)));
    
    const progressSpinner = ora(`Traduction en cours (0/${jobs.length})...`).start();
    let completed = 0;

    const results = await Promise.all(
      jobPromises.map(p => p.then(r => {
        completed++;
        progressSpinner.text = `Traduction en cours (${completed}/${jobs.length})...`;
        return r;
      }))
    );

    progressSpinner.succeed(`Traductions terminées: ${results.filter(r => r.success).length}/${results.length} succès`);

    // Écrire les fichiers si pas dry-run
    if (!this.config.dryRun) {
      await this.writeResults(results);
    }

    return this.buildResult(results);
  }

  private async executeJob(job: TranslationJob): Promise<TranslationResult> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    // Essayer provider principal + fallbacks
    const providersToTry = [job.provider, ...this.config.fallbackProviders].filter((v, i, a) => a.indexOf(v) === i);

    for (const providerName of providersToTry) {
      for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
        try {
          const provider = await this.getProvider(providerName);
          const available = await provider.isAvailable();
          
          if (!available) {
            throw new Error(`Provider ${providerName} non disponible`);
          }

          // Auto-install modèle Ollama si nécessaire
          if (providerName === 'ollama' && 'ensureModel' in provider) {
            const model = job.options?.model || (provider as any).defaultModel || 'qwen2.5:1.5b';
            await (provider as any).ensureModel(model);
          }

          // Rate limiting pour DeepL Free API (max ~10 req/s, mais on joue safe)
          if (providerName === 'deepl' && this.config.concurrency > 1) {
            await new Promise(resolve => setTimeout(resolve, 200 * attempt));
          }

          // Préparer glossaire pour cette traduction
          const glossary = this.buildGlossaryForJob(job);

          const [translatedTitle, translatedDesc, translatedBody] = await Promise.all([
            this.translateWithGlossary(provider, job.article.frontmatter.title, job.article.sourceLang, job.targetLang, glossary, 'title'),
            this.translateWithGlossary(provider, job.article.frontmatter.description, job.article.sourceLang, job.targetLang, glossary, 'description'),
            this.translateWithGlossary(provider, job.article.body, job.article.sourceLang, job.targetLang, glossary, 'body'),
          ]);

          // Construire frontmatter traduit
          const translatedFrontmatter: BlogFrontmatter = {
            ...job.article.frontmatter,
            title: translatedTitle,
            description: translatedDesc,
            lang: job.targetLang,
            pageSlug: generateTranslationSlug(job.article.translationKey, job.targetLang, job.targetLang === 'fr'),
            updatedDate: new Date().toISOString(),
          };

          return {
            job,
            success: true,
            translatedFrontmatter,
            translatedBody,
            durationMs: Date.now() - startTime,
            provider: providerName,
            model: providerName === 'ollama' ? this.config.ollama.defaultModel : undefined,
          };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.warn(chalk.yellow(`[${job.targetLang}] ${providerName} tentative ${attempt} échouée: ${lastError.message}`));
          
          if (attempt < this.config.retryAttempts) {
            await new Promise(r => setTimeout(r, this.config.retryDelayMs * attempt));
          }
        }
      }
    }

    // Tous les providers ont échoué
    return {
      job,
      success: false,
      error: lastError?.message || 'Erreur inconnue',
      durationMs: Date.now() - startTime,
      provider: providersToTry[0] || this.config.defaultProvider,
    };
  }

  private async getProvider(name: ProviderName): Promise<TranslationProvider> {
    if (!this.providerCache.has(name)) {
      this.providerCache.set(name, createProvider(name, this.config));
    }
    return this.providerCache.get(name)!;
  }

  private buildGlossaryForJob(job: TranslationJob): GlossaryEntry[] {
    const entries: GlossaryEntry[] = [];
    const flatGlossary = getFlatGlossary();
    
    for (const [source, target] of Object.entries(flatGlossary)) {
      entries.push({ source, target, keepAsIs: true });
    }
    
    // Ajouter glossaire config
    entries.push(...this.config.glossary);
    
    return entries;
  }

  private async translateWithGlossary(
    provider: TranslationProvider,
    text: string,
    sourceLang: LangCode,
    targetLang: LangCode,
    glossary: GlossaryEntry[],
    context: string
  ): Promise<string> {
    if (!text || text.trim() === '') return text;
    
    // Vérifier le cache d'abord
    const providerName = provider.name;
    const cached = this.cache.get(text, sourceLang, targetLang, providerName);
    if (cached) {
      return cached;
    }
    
    // Pour le corps, on traduit par chunks si trop long
    if (context === 'body' && text.length > 3000) {
      const result = await this.translateLongText(provider, text, sourceLang, targetLang, glossary);
      this.cache.set(text, sourceLang, targetLang, providerName, result);
      return result;
    }

    const result = await provider.translate(text, sourceLang, targetLang, {
      glossary,
      context: `blog article chrétien - ${context}`,
      temperature: context === 'title' ? 0.2 : 0.3,
    });
    
    this.cache.set(text, sourceLang, targetLang, providerName, result);
    return result;
  }

  private async translateLongText(
    provider: TranslationProvider,
    text: string,
    sourceLang: LangCode,
    targetLang: LangCode,
    glossary: GlossaryEntry[]
  ): Promise<string> {
    // Découper par sections Markdown (titres ##, ###)
    const sections = text.split(/(?=^##?\s)/m).filter(s => s.trim());
    const translated: string[] = [];

    for (const section of sections) {
      if (section.trim().length < 50) {
        translated.push(section);
        continue;
      }
      const translatedSection = await provider.translate(section, sourceLang, targetLang, {
        glossary,
        context: 'blog article chrétien - body section',
        temperature: 0.3,
      });
      translated.push(translatedSection);
    }

    return translated.join('\n\n');
  }

  private async writeResults(results: TranslationResult[]): Promise<void> {
    const spinner = ora('Écriture des fichiers traduits...').start();
    let written = 0;

    for (const result of results) {
      if (!result.success || !result.translatedFrontmatter || !result.translatedBody) continue;

      const { job, translatedFrontmatter, translatedBody } = result;
      const baseSlug = job.article.translationKey;
      const targetLang = job.targetLang;
      const slug = generateTranslationSlug(baseSlug, targetLang, targetLang === 'fr');
      
      // Nom de fichier: {lang}-{baseSlug}.md
      const filename = targetLang === 'fr' ? `${slug}.md` : `${targetLang}-${baseSlug}.md`;
      const filePath = join(this.config.outputDir, filename);

      // S'assurer que le dossier existe
      mkdirSync(dirname(filePath), { recursive: true });

      const content = serializeMarkdownClean(translatedFrontmatter as unknown as Record<string, unknown>, translatedBody);
      writeFileSync(filePath, content, 'utf-8');
      written++;
    }

    spinner.succeed(`${written} fichiers écrits`);
  }

  private buildResult(results: TranslationResult[]): BatchTranslationResult {
    const byProvider: Record<string, { success: number; failed: number }> = {};
    const byLang: Record<string, { success: number; failed: number }> = {};

    for (const r of results) {
      const provider = r.provider;
      byProvider[provider] = byProvider[provider] || { success: 0, failed: 0 };
      byProvider[provider][r.success ? 'success' : 'failed']++;
      
      const targetLang = r.job.targetLang;
      byLang[targetLang] = byLang[targetLang] || { success: 0, failed: 0 };
      byLang[targetLang][r.success ? 'success' : 'failed']++;
    }

    // Flush cache à la fin
    this.cache.flush();
    const cacheStats = this.cache.stats();

    return {
      results,
      summary: {
        total: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        totalDurationMs: results.reduce((sum, r) => sum + r.durationMs, 0),
        byProvider: byProvider as any,
        byLang: byLang as any,
        cacheStats,
      },
    };
  }
}

// Fonction utilitaire pour usage direct
export async function translateArticles(options: {
  sourceDir?: string;
  targetLangs?: LangCode[];
  provider?: 'ollama' | 'libretranslate' | 'deepl';
  model?: string;
  concurrency?: number;
  dryRun?: boolean;
  outputDir?: string;
} = {}): Promise<BatchTranslationResult> {
  const config: Partial<TranslationConfig> = {
    defaultProvider: options.provider || 'ollama',
    ollama: { defaultModel: options.model || 'qwen2.5:1.5b', baseUrl: 'http://localhost:11434', timeoutMs: 600000 },
    concurrency: options.concurrency || 2,
    dryRun: options.dryRun || false,
    outputDir: options.sourceDir || 'src/content/blog',
  };

  const pipeline = new TranslationPipeline(config);
  return pipeline.run(undefined, options.targetLangs);
}