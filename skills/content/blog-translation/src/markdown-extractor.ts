/**
 * Extracteur d'articles blog depuis le système de fichiers
 * Réutilise la logique de markdown-sanitizer
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import matter from 'gray-matter';
import type { BlogArticle, BlogFrontmatter, LangCode } from './types.js';
import { parseMarkdown, normalizeFrontmatterTypes, detectCollectionType } from '@kikienchrist/markdown-sanitizer';

const BLOG_DIR = 'src/content/blog';
const VALID_EXTENSIONS = ['.md', '.markdown'];

export interface ExtractedArticle {
  filePath: string;
  article: BlogArticle;
  warnings: string[];
}

function slugifyFilename(filename: string): string {
  return basename(filename, extname(filename));
}

function extractLangFromFilename(filename: string): LangCode | null {
  const match = filename.match(/^([a-z]{2})-/);
  if (match) {
    const lang = match[1] as LangCode;
    const validLangs: LangCode[] = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
    return validLangs.includes(lang) ? lang : null;
  }
  return null;
}

export function extractAllArticles(blogDir = BLOG_DIR): ExtractedArticle[] {
  const articles: ExtractedArticle[] = [];
  const warnings: string[] = [];

  if (!statSync(blogDir, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`Dossier blog introuvable: ${blogDir}`);
  }

  const files = readdirSync(blogDir)
    .filter(f => VALID_EXTENSIONS.includes(extname(f).toLowerCase()))
    .filter(f => !f.startsWith('.'));

  for (const file of files) {
    const filePath = join(blogDir, file);
    const fileWarnings: string[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      const parsed = parseMarkdown(content, { extractNested: true });
      let frontmatter = normalizeFrontmatterTypes(parsed.frontmatter, 'blog');
      const body = parsed.body;

      // Détecter langue depuis filename ou frontmatter
      const filenameLang = extractLangFromFilename(file);
      const fmLang = frontmatter.lang as LangCode;
      const sourceLang = filenameLang || fmLang || 'fr';

      // Validation minimale
      if (!frontmatter.title || frontmatter.title === 'Sans titre') {
        fileWarnings.push('Titre manquant ou par défaut');
      }
      if (!frontmatter.translationKey) {
        fileWarnings.push('translationKey manquant');
      }
      if (!frontmatter.slug) {
        fileWarnings.push('slug manquant');
      }

      const article: BlogArticle = {
        slug: (frontmatter.slug as string) || slugifyFilename(file),
        translationKey: (frontmatter.translationKey as string) || slugifyFilename(file),
        frontmatter: {
          ...frontmatter,
          pageSlug: (frontmatter.slug as string) || slugifyFilename(file),
        } as BlogFrontmatter,
        body,
        sourceLang,
      };

      articles.push({ filePath, article, warnings: fileWarnings });
    } catch (error) {
      fileWarnings.push(`Erreur parsing: ${error instanceof Error ? error.message : error}`);
      // Article minimal pour ne pas bloquer
      articles.push({
        filePath,
        article: {
          slug: slugifyFilename(file),
          translationKey: slugifyFilename(file),
          frontmatter: {
            title: 'Erreur parsing',
            description: 'Erreur lors de l\'extraction',
            pubDate: new Date().toISOString(),
            author: 'Kiki en Christ',
            lang: 'fr',
            translationKey: slugifyFilename(file),
            category: 'vie-chrétienne',
            tags: [],
            featured: false,
            draft: true,
            readingTime: 10,
            coverImage: '/images/blog/default-cover.jpg',
            ogImage: 'https://kikienchrist.vercel.app/og/blog/default.png',
            pageSlug: slugifyFilename(file),
          },
          body: '',
          sourceLang: 'fr',
        },
        warnings: fileWarnings,
      });
    }
  }

  return articles;
}

export function getSourceArticles(articles: ExtractedArticle[]): ExtractedArticle[] {
  // Articles sources = lang=fr OU pas de suffixe -{lang} dans slug
  return articles.filter(({ article }) => 
    article.sourceLang === 'fr' || 
    article.slug === article.translationKey
  );
}

export function getTranslationsForKey(
  articles: ExtractedArticle[],
  translationKey: string,
  targetLang: LangCode
): ExtractedArticle | undefined {
  return articles.find(({ article }) => 
    article.translationKey === translationKey && article.sourceLang === targetLang
  );
}

export function getMissingTranslations(
  articles: ExtractedArticle[],
  targetLangs: LangCode[]
): { translationKey: string; sourceArticle: ExtractedArticle; missingLangs: LangCode[] }[] {
  const sourceArticles = getSourceArticles(articles);
  const result: { translationKey: string; sourceArticle: ExtractedArticle; missingLangs: LangCode[] }[] = [];

  for (const source of sourceArticles) {
    const missingLangs = targetLangs.filter(lang => {
      if (lang === 'fr') return false; // FR est la source
      return !getTranslationsForKey(articles, source.article.translationKey, lang);
    });
    
    if (missingLangs.length > 0) {
      result.push({
        translationKey: source.article.translationKey,
        sourceArticle: source,
        missingLangs,
      });
    }
  }

  return result;
}