#!/usr/bin/env node
/**
 * Traduction articles blog avec Ollama qwen2.5:7b (plus robuste)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

const TARGET_LANGS = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Español', native: 'Español' },
  { code: 'pt', name: 'Português', native: 'Português' },
  { code: 'it', name: 'Italiano', native: 'Italiano' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch' },
  { code: 'nl', name: 'Nederlands', native: 'Nederlands' },
  { code: 'pl', name: 'Polski', native: 'Polski' },
  { code: 'ar', name: 'العربية', native: 'العربية' },
  { code: 'ru', name: 'Русский', native: 'Русский' },
  { code: 'zh', name: '中文', native: '中文' },
  { code: 'hi', name: 'हिन्दी', native: 'हिन्दी' }
];

const VALID_CATEGORIES = [
  'prière', 'formation', 'témoignage', 'vie-chrétienne',
  'famille', 'mission', 'actualité', 'ressource',
  'discernement', 'jeûne', 'épreuves', 'guerre spirituelle',
  'guérison', 'routine', 'jeunes', 'couple'
];

const ARTICLE_SLUGS = {
  'fr-entendre-voix-dieu.md': 'entendre-voix-dieu',
  'fr-guerre-spirituelle.md': 'guerre-spirituelle-priere-autorite',
  'fr-jeuner-prier.md': 'jeuner-prier',
  'fr-priere-couple.md': 'priere-couple',
  'fr-priere-enfants.md': 'apprendre-prier-enfants',
  'fr-priere-impossible.md': 'priere-impossible-desert-spirituel',
  'fr-priere-jeunes.md': 'priere-generation-z-jeunes',
  'fr-priere-maladie.md': 'priere-guerison-maladie',
  'fr-priere-matin-soir.md': 'priere-matin-soir-routine',
  'fr-priere-quotidienne.md': 'priere-quotidienne-7-cles'
};

const SERIES_MAP = {
  'fr-entendre-voix-dieu.md': null,
  'fr-guerre-spirituelle.md': 'apprendre-à-prier',
  'fr-jeuner-prier.md': 'apprendre-à-prier',
  'fr-priere-couple.md': 'apprendre-à-prier',
  'fr-priere-enfants.md': 'apprendre-à-prier',
  'fr-priere-impossible.md': 'apprendre-à-prier',
  'fr-priere-jeunes.md': 'apprendre-à-prier',
  'fr-priere-maladie.md': 'apprendre-à-prier',
  'fr-priere-matin-soir.md': 'apprendre-à-prier',
  'fr-priere-quotidienne.md': 'apprendre-à-prier'
};

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:7b';

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };
  const fmText = match[1];
  const frontmatter = {};
  fmText.split('\n').forEach(line => {
    const [key, ...valParts] = line.split(':');
    if (key && valParts.length) {
      let val = valParts.join(':').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[key.trim()] = val;
    }
  });
  const body = content.slice(match[0].length).trim();
  return { frontmatter, body };
}

function buildFrontmatter(fm, targetLang, slug, translationKey) {
  const newFm = { ...fm };
  newFm.lang = targetLang;
  newFm.slug = slug;
  newFm.translationKey = translationKey;
  newFm.updatedDate = new Date().toISOString();
  const lines = ['---'];
  for (const [key, value] of Object.entries(newFm)) {
    if (key === 'tags' && Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'string') {
      const escaped = String(value).replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function buildBlogTranslationPrompt(sourceContent, targetLang, articleFile) {
  const langInfo = TARGET_LANGS.find(l => l.code === targetLang);
  return `Tu es un traducteur expert en contenu chretien/spirituel. Traduis l'article de blog suivant du francais vers le ${langInfo.native} (${langInfo.name}).

REGLES STRICTES :
1. Garde EXACTEMENT la meme structure Markdown (frontmatter YAML + corps)
2. Ne traduis PAS : noms propres (Kiki en Christ, Jesus, Dieu, Saint-Esprit, Bible, Ecriture), references bibliques (Jean 3:16, Psaume 23, etc.), versets
3. Ne traduis PAS : URLs, chemins d'images, slugs, noms de series techniques
4. Traduis title, description, tags, et tout le corps du texte
5. Adapte les termes theologiques correctement (grace, salut, sanctification, intercession, etc.)
6. Pour l'arabe : ecriture RTL, termes chretiens arabes standards (pas termes islamiques)
7. Reponds UNIQUEMENT avec le fichier Markdown complet (frontmatter + corps), sans commentaires, sans code fences
8. Le frontmatter doit contenir : title, slug, lang, pubDate, updatedDate, description, category, series (si applicable), tags, coverImage, ogImage, readingTime, author, featured, draft

ARTICLE A TRADUIRE (${articleFile}) :
${sourceContent}

TRADUCTION EN ${langInfo.native.toUpperCase()} :`;
}

async function callOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.15, top_p: 0.9, num_predict: 8192 }
    })
  });
  if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
  const data = await response.json();
  return data.response.trim();
}

// Trouver langues manquantes par article
function getMissingLangs() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const articleLangs = {};
  for (const file of files) {
    const match = file.match(/^([a-z]{2})-(.+)\.md$/);
    if (match) {
      const lang = match[1];
      const slug = match[2];
      if (!articleLangs[slug]) articleLangs[slug] = new Set();
      articleLangs[slug].add(lang);
    }
  }
  const allLangs = TARGET_LANGS.map(l => l.code).concat(['fr']);
  const missing = {};
  for (const [slug, langs] of Object.entries(articleLangs)) {
    const missingLangs = allLangs.filter(l => !langs.has(l));
    if (missingLangs.length > 0) {
      missing[slug] = missingLangs;
    }
  }
  return missing;
}

async function translateForSlug(slug, missingLangs) {
  const sourceFile = `fr-${slug}.md`;
  const sourcePath = path.join(BLOG_DIR, sourceFile);
  if (!fs.existsSync(sourcePath)) {
    console.log(`[WARN] Source non trouvee : ${sourceFile}`);
    return;
  }
  const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  const { frontmatter } = parseFrontmatter(sourceContent);
  const translationKey = slug;
  console.log(`\n[TRANSLATE] ${sourceFile} (${frontmatter.title})`);
  console.log(`  Langues manquantes : ${missingLangs.filter(l => l !== 'fr').join(', ')}`);
  for (const langCode of missingLangs) {
    if (langCode === 'fr') continue;
    const langInfo = TARGET_LANGS.find(l => l.code === langCode);
    const targetFileName = `${langCode}-${slug}.md`;
    const targetPath = path.join(BLOG_DIR, targetFileName);
    if (fs.existsSync(targetPath)) {
      console.log(`  [SKIP] ${langCode} : existe deja`);
      continue;
    }
    try {
      console.log(`  [WORK] ${langCode} (${langInfo?.native})...`);
      const prompt = buildBlogTranslationPrompt(sourceContent, langCode, sourceFile);
      const translated = await callOllama(prompt);
      const { frontmatter: newFm, body: newBody } = parseFrontmatter(translated);
      if (newFm.category && !VALID_CATEGORIES.includes(newFm.category)) {
        newFm.category = frontmatter.category;
      }
      const finalFm = buildFrontmatter(newFm || frontmatter, langCode, slug, translationKey);
      const finalContent = `${finalFm}\n\n${newBody || translated}`;
      fs.writeFileSync(targetPath, finalContent, 'utf-8');
      console.log(`  [OK] ${langCode} : cree`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (error) {
      console.error(`  [ERROR] ${langCode} : erreur - ${error.message}`);
    }
  }
}

async function main() {
  console.log('=== Traduction articles blog - Ollama qwen2.5:7b ===');
  console.log(`Repertoire : ${BLOG_DIR}`);
  console.log(`Model : ${MODEL}`);
  console.log(`Langues : ${TARGET_LANGS.map(l => l.code).join(', ')}`);
  try {
    await fetch('http://localhost:11434/api/tags');
    console.log('[OK] Ollama accessible');
  } catch {
    console.error('[ERROR] Ollama non accessible sur localhost:11434');
    process.exit(1);
  }
  const missing = getMissingLangs();
  console.log('\nArticles a completer :');
  for (const [slug, langs] of Object.entries(missing)) {
    console.log(`  - ${slug} : ${langs.filter(l => l !== 'fr').join(', ')}`);
  }
  for (const [slug, langs] of Object.entries(missing)) {
    await translateForSlug(slug, langs);
  }
  console.log('\n=== Traduction terminee ===');
}

main().catch(console.error);