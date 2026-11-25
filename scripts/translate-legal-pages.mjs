#!/usr/bin/env node
/**
 * Script de traduction automatique des pages légales avec Ollama/qwen2.5
 * Traduit les 5 pages légales FR vers 10 langues cibles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_PAGES_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

// 11 langues supportées
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

// Langues à traduire (toutes sauf FR)
const LANGS_TO_TRANSLATE = TARGET_LANGS.filter(l => l.code !== 'fr');

// Fichiers pages légales
const LEGAL_FILES = [
  'mentions-legales.md',
  'confidentialite.md',
  'cookies.md',
  'cgv.md',
  'accessibilite.md'
];

// Configuration Ollama
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b'; // Modèle rapide 986 MB

// Prompt de traduction
function buildTranslationPrompt(sourceContent, targetLang, pageName) {
  const langInfo = TARGET_LANGS.find(l => l.code === targetLang);
  
  return `Tu es un traducteur juridique professionnel. Traduis la page légale suivante du français vers le ${langInfo.native} (${langInfo.name}).

RÈGLES STRICTES :
1. Garde EXACTEMENT la même structure Markdown (frontmatter YAML, titres, listes, liens)
2. Ne traduis PAS : noms propres (Kiki en Christ, Vercel Inc., RGPD, GA4, Meta Pixel), URLs, codes, adresses
3. Adapte les références légales au pays cible si pertinent (ex: "loi 1901" → équivalent local, "droit français" → droit local)
4. Garde les placeholders [Adresse], [Nom du responsable] tels quels
5. Les liens internes comme /fr/confidentialite/ deviennent /${targetLang}/confidentialite/
6. Réponds UNIQUEMENT avec le fichier Markdown complet, sans commentaires, sans markdown code fences

PAGE À TRADUIRE (${pageName}) :
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
        temperature: 0.1,
        top_p: 0.9,
        num_predict: 2048
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response.trim();
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
      // Retirer guillemets
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
function buildFrontmatter(fm, targetLang, translationKey) {
  const newFm = { ...fm };
  newFm.lang = targetLang;
  newFm.translationKey = translationKey;
  // Mettre à jour lastUpdated à aujourd'hui
  newFm.lastUpdated = new Date().toISOString().split('T')[0];
  
  const lines = ['---'];
  for (const [key, value] of Object.entries(newFm)) {
    const escaped = String(value).replace(/"/g, '\\"');
    lines.push(`${key}: "${escaped}"`);
  }
  lines.push('---');
  return lines.join('\n');
}

// Traduire une page
async function translatePage(fileName) {
  const sourcePath = path.join(LEGAL_PAGES_DIR, fileName);
  const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
  
  const { frontmatter, body } = parseFrontmatter(sourceContent);
  const pageName = frontmatter.title || fileName.replace('.md', '');
  const translationKey = frontmatter.translationKey || fileName.replace('.md', '');
  const pageSlug = frontmatter.pageSlug || fileName.replace('.md', '');
  
  console.log(`\n📄 Traduction : ${fileName} (${pageName})`);
  
  for (const lang of LANGS_TO_TRANSLATE) {
    const targetPath = path.join(LEGAL_PAGES_DIR, `${pageSlug}.${lang.code}.md`);
    
    // Vérifier si existe déjà
    if (fs.existsSync(targetPath)) {
      console.log(`  ⏭️  ${lang.code} : existe déjà, ignoré`);
      continue;
    }
    
    try {
      console.log(`  🔄 ${lang.code} (${lang.native})...`);
      
      const prompt = buildTranslationPrompt(sourceContent, lang.code, pageName);
      const translated = await callOllama(prompt);
      
      // Parser la réponse pour extraire frontmatter + body
      const { frontmatter: newFm, body: newBody } = parseFrontmatter(translated);
      
      // Reconstruire avec bon frontmatter
      const finalFm = buildFrontmatter(newFm || frontmatter, lang.code, translationKey);
      const finalContent = `${finalFm}\n\n${newBody || translated}`;
      
      fs.writeFileSync(targetPath, finalContent, 'utf-8');
      console.log(`  ✅ ${lang.code} : créé (${targetPath})`);
      
      // Pause pour éviter surcharge
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error) {
      console.error(`  ❌ ${lang.code} : erreur - ${error.message}`);
    }
  }
}

// Main
async function main() {
  console.log('🚀 Traduction automatique pages légales - Ollama/qwen2.5:1.5b');
  console.log(`📁 Répertoire : ${LEGAL_PAGES_DIR}`);
  console.log(`🌐 Langues cibles : ${LANGS_TO_TRANSLATE.map(l => l.code).join(', ')}`);
  console.log(`🤖 Modèle : ${MODEL}`);
  
  // Vérifier Ollama
  try {
    await fetch('http://localhost:11434/api/tags');
    console.log('✅ Ollama accessible');
  } catch {
    console.error('❌ Ollama non accessible sur localhost:11434');
    process.exit(1);
  }
  
  for (const file of LEGAL_FILES) {
    await translatePage(file);
  }
  
  console.log('\n🎉 Traduction terminée !');
  console.log('📋 Prochaines étapes :');
  console.log('   1. Vérifier les fichiers générés');
  console.log('   2. Relancer le build : npm run build');
  console.log('   3. Tester : npm run test:e2e');
}

main().catch(console.error);