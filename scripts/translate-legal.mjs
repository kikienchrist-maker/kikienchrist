#!/usr/bin/env node
/**
 * translate-legal.mjs — Traduction des pages légales FR → 10 langues via Ollama
 * Usage: node scripts/translate-legal.mjs
 * Prérequis: Ollama installé + `ollama serve` en cours + modèle `qwen2.5:7b` pullé
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

// Configuration
const SOURCE_LANG = 'fr';
const TARGET_LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
const PAGES = [
  'mentions-legales',
  'confidentialite',
  'cookies',
  'cgv',
  'accessibilite'
];

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b'; // Modèle multilingue 1.5B (986 MB) - plus rapide

// Prompt de traduction spécialisé juridique
const TRANSLATION_PROMPT = `Tu es un traducteur juridique professionnel spécialisé dans la localisation de documents légaux (mentions légales, politique de confidentialité, CGV, politique cookies, accessibilité) pour des sites web.

TRADUIS le contenu Markdown suivant du français vers la langue cible.
RÈGLES STRICTES :
1. NE TRADUIS PAS : les noms propres (Kiki en Christ, Vercel, Google Analytics, RGPD, CNIL, UE, France), les URLs, les emails, les placeholders entre [crochets], les balises HTML/Markdown (##, **, *, [], (), #, |, >, \`\`\`), les IDs d'ancres (#1-editeur-du-site), les tableaux Markdown (garde la structure | | |).
2. TRADUIS : tout le texte visible, les titres (## 1. Éditeur du site), les paragraphes, les items de liste, les cellules de tableau.
3. ADAPTE : les références légales (ex: "Loi Informatique et Libertés" → équivalent local si existe, sinon garde l'original avec note), les formats de date (JJ/MM/AAAA → format local).
4. GARDE : la structure Markdown IDENTIQUE (même nombre de lignes, même indentation, mêmes sauts de ligne).
5. FRONTMATTER : N'y touche PAS (title, pageSlug, lang, lastUpdated, version, requiredByLaw, jurisdiction).

LANGUE CIBLE : {TARGET_LANG}
CODE LANGUE : {LANG_CODE}

CONTENU À TRADUIRE :
{CONTENT}

Réponds UNIQUEMENT avec le contenu Markdown traduit, SANS frontmatter, SANS explications, SANS balises de code.`;

async function callOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.1, // Faible pour cohérence juridique
        top_p: 0.9,
        num_predict: 4096,
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.response.trim();
}

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { frontmatter: {}, body: content };
  
  const fmLines = fmMatch[1].split('\n');
  const frontmatter = {};
  for (const line of fmLines) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  const body = content.slice(fmMatch[0].length).trimStart();
  return { frontmatter, body };
}

function buildFrontmatter(fm) {
  let out = '---\n';
  for (const [key, value] of Object.entries(fm)) {
    const needsQuotes = typeof value === 'string' && (value.includes(':') || value.includes('#') || value.startsWith('['));
    out += `${key}: ${needsQuotes ? `"${value}"` : value}\n`;
  }
  out += '---\n';
  return out;
}

async function translatePage(pageSlug, targetLang) {
  const sourceFile = path.join(LEGAL_DIR, `${pageSlug}-${SOURCE_LANG}.md`);
  const targetFile = path.join(LEGAL_DIR, `${pageSlug}-${targetLang}.md`);

  if (!fs.existsSync(sourceFile)) {
    console.log(`⚠️  Source manquante: ${sourceFile}`);
    return false;
  }

  const sourceContent = fs.readFileSync(sourceFile, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(sourceContent);

  // Traduire le title
  const titlePrompt = `Traduis ce titre de page légale en ${targetLang} (code: ${targetLang}). Réponds UNIQUEMENT le titre traduit, sans guillemets, sans explication.\n\nTitre: "${frontmatter.title}"`;
  let translatedTitle;
  try {
    translatedTitle = await callOllama(titlePrompt);
  } catch (e) {
    console.log(`❌ Erreur traduction title ${pageSlug}.${targetLang}: ${e.message}`);
    return false;
  }

  // Traduire le body (contenu Markdown)
  const contentPrompt = TRANSLATION_PROMPT
    .replace('{TARGET_LANG}', targetLang)
    .replace('{LANG_CODE}', targetLang)
    .replace('{CONTENT}', body);

  let translatedBody;
  try {
    translatedBody = await callOllama(contentPrompt);
  } catch (e) {
    console.log(`❌ Erreur traduction body ${pageSlug}.${targetLang}: ${e.message}`);
    return false;
  }

  // Construire le nouveau frontmatter
  const newFrontmatter = {
    ...frontmatter,
    title: translatedTitle,
    lang: targetLang,
    lastUpdated: new Date().toISOString().split('T')[0], // Aujourd'hui
  };

  // Écrire le fichier cible
  const newContent = buildFrontmatter(newFrontmatter) + '\n' + translatedBody + '\n';
  fs.writeFileSync(targetFile, newContent, 'utf-8');
  
  console.log(`✅ ${pageSlug}.${targetLang}.md traduit (title: "${translatedTitle}")`);
  return true;
}

async function main() {
  console.log('🚀 Traduction pages légales FR → 10 langues via Ollama (qwen2.5:7b)');
  console.log(`📁 Source: ${LEGAL_DIR}`);
  console.log(`🎯 Cibles: ${TARGET_LANGS.join(', ')}`);
  console.log(`📄 Pages: ${PAGES.join(', ')}`);
  console.log('');

  // Vérifier Ollama
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (!res.ok) throw new Error('Ollama non accessible');
    const data = await res.json();
    const hasModel = data.models?.some(m => m.name.includes('qwen2.5:7b'));
    if (!hasModel) {
      console.log('⚠️ Modèle qwen2.5:7b non trouvé. Lance: ollama pull qwen2.5:7b');
      return;
    }
    console.log('✅ Ollama accessible, modèle qwen2.5:7b présent\n');
  } catch (e) {
    console.log('❌ Ollama non accessible sur localhost:11434. Lance: ollama serve');
    return;
  }

  let success = 0, fail = 0;
  
  for (const page of PAGES) {
    for (const lang of TARGET_LANGS) {
      const ok = await translatePage(page, lang);
      if (ok) success++; else fail++;
      // Petite pause pour ne pas surcharger
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n📊 Résultat: ${success} succès, ${fail} échecs`);
  if (fail > 0) console.log('⚠️ Relance le script pour réessayer les échecs.');
}

main().catch(console.error);