#!/usr/bin/env node
/**
 * Traduction automatique des articles de blog FR vers 10 langues avec Ollama/qwen2.5
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

const TARGET_LANGS = [
  { code: 'fr', name: 'Français', native: 'Français' },
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

const LANGS_TO_TRANSLATE = TARGET_LANGS.filter(l => l.code !== 'fr');

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b';

// Catégories valides (doivent correspondre au schéma)
const VALID_CATEGORIES = [
  'prière', 'formation', 'témoignage', 'vie-chrétienne',
  'famille', 'mission', 'actualité', 'ressource',
  'discernement', 'jeûne', 'épreuves', 'guerre spirituelle',
  'guérison', 'routine', 'jeunes', 'couple'
];

// Mapping catégories FR -> codes valides
const CATEGORY_MAP = {
  'prière': 'prière',
  'formation': 'formation',
  'témoignage': 'témoignage',
  'vie-chrétienne': 'vie-chrétienne',
  'famille': 'famille',
  'mission': 'mission',
  'actualité': 'actualité',
  'ressource': 'ressource',
  'discernement': 'discernement',
  'jeûne': 'jeûne',
  'épreuves': 'épreuves',
  'guerre spirituelle': 'guerre spirituelle',
  'guérison': 'guérison',
  'routine': 'routine',
  'jeunes': 'jeunes',
  'couple': 'couple'
};

// Slugs par article (basés sur les noms de fichiers)
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

// Séries
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

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Parser frontmatter YAML
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

// Construire nouveau frontmatter
function buildFrontmatter(fm, targetLang, slug, translationKey) {
  const newFm = { ...fm };
  newFm.lang = targetLang;
  newFm.slug = slug;
  newFm.translationKey = translationKey;
  
  // Mettre à jour les dates
  const today = new Date().toISOString().split('T')[0];
  newFm.updatedDate = new Date().toISOString();
  
  // Traduire title et description via le modèle (sera fait dans le prompt)
  // Mais on garde les champs techniques inchangés
  
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

// Prompt de traduction pour articles de blog
function buildBlogTranslationPrompt(sourceContent, targetLang, articleFile) {
  const langInfo = TARGET_LANGS.find(l => l.code === targetLang);
  const slug = ARTICLE_SLUGS[articleFile];
  const series = SERIES_MAP[articleFile];
  
  return `Tu es un traducteur spécialisé en contenu chrétien/spirituel. Traduis l'article de blog suivant du français vers le ${langInfo.native} (${langInfo.name}).

RÈGLES STRICTES :
1. Garde EXACTEMENT la même structure Markdown (frontmatter YAML + corps)
2. Ne traduis PAS : noms propres (Kiki en Christ, Jésus, Dieu, Saint-Esprit, Bible, Écriture), références bibliques (Jean 3:16, Psaume 23, etc.), versets
3. Ne traduis PAS : URLs, chemins d'images, slugs, noms de séries techniques
4. Traduis le title, description, tags, et tout le corps du texte
5. Adapte les termes théologiques correctement (grâce, salut, sanctification, intercession, etc.)
6. Pour l'arabe : écriture RTL, termes islamiques à éviter (utiliser termes chrétiens arabes standards)
7. Réponds UNIQUEMENT avec le fichier Markdown complet (frontmatter + corps), sans commentaires, sans code fences
8. Le frontmatter doit contenir : title, slug, lang, pubDate, updatedDate, description, category, series (si applicable), tags, coverImage, ogImage, readingTime, author, featured, draft

ARTICLE À TRADUIRE (${articleFile}) :
${sourceContent}

TRADUCTION EN ${langInfo.native.toUpperCase()} :`;
}

// Appel API Ollama
async function callOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.15,
        top_p: 0.9,
        num_predict: 4096
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response.trim();
}

// Traduire un article
async function translateArticle(fileName) {
  const sourcePath = path.join(BLOG_DIR, fileName);
  const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  
  const { frontmatter, body } = parseFrontmatter(sourceContent);
  const slug = ARTICLE_SLUGS[fileName];
  const series = SERIES_MAP[fileName];
  const translationKey = slug;
  
  console.log(`\n📝 Traduction : ${fileName} (${frontmatter.title})`);
  
  for (const lang of LANGS_TO_TRANSLATE) {
    const targetFileName = `${lang.code}-${slug}.md`;
    const targetPath = path.join(BLOG_DIR, targetFileName);
    
    if (fs.existsSync(targetPath)) {
      console.log(`  ⏭️  ${lang.code} : existe déjà`);
      continue;
    }
    
    try {
      console.log(`  🔄 ${lang.code} (${lang.native})...`);
      
      const prompt = buildBlogTranslationPrompt(sourceContent, lang.code, fileName);
      const translated = await callOllama(prompt);
      
      // Parser la réponse
      const { frontmatter: newFm, body: newBody } = parseFrontmatter(translated);
      
      // Valider/corriger la catégorie
      if (newFm.category && !VALID_CATEGORIES.includes(newFm.category)) {
        newFm.category = CATEGORY_MAP[frontmatter.category] || 'vie-chrétienne';
      }
      
      // Reconstruire frontmatter propre
      const finalFm = buildFrontmatter(newFm || frontmatter, lang.code, slug, translationKey);
      const finalContent = `${finalFm}\n\n${newBody || translated}`;
      
      fs.writeFileSync(targetPath, finalContent, 'utf-8');
      console.log(`  ✅ ${lang.code} : créé`);
      
      await new Promise(r => setTimeout(r, 800));
      
    } catch (error) {
      console.error(`  ❌ ${lang.code} : erreur - ${error.message}`);
    }
  }
}

// Main
async function main() {
  console.log('🚀 Traduction automatique articles blog - Ollama/qwen2.5:1.5b');
  console.log(`📁 Répertoire : ${BLOG_DIR}`);
  console.log(`🌐 Langues cibles : ${LANGS_TO_TRANSLATE.map(l => l.code).join(', ')}`);
  
  // Vérifier Ollama
  try {
    await fetch('http://localhost:11434/api/tags');
    console.log('✅ Ollama accessible');
  } catch {
    console.error('❌ Ollama non accessible sur localhost:11434');
    process.exit(1);
  }
  
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.startsWith('fr-') && f.endsWith('.md'));
  
  for (const file of files) {
    await translateArticle(file);
  }
  
  console.log('\n🎉 Traduction articles terminée !');
  console.log('📋 Prochaines étapes :');
  console.log('   1. Vérifier quelques fichiers générés');
  console.log('   2. Relancer le build : npm run build');
  console.log('   3. Tester : npm run test:e2e');
}

main().catch(console.error);