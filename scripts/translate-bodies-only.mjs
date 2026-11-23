#!/usr/bin/env node
/**
 * translate-bodies-only.mjs — Traduit seulement le body Markdown (FR -> 10 langues)
 * Garde le frontmatter existant (déjà propre avec titres corrigés)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const SOURCE_LANG = 'fr';
const TARGET_LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'qwen2.5:1.5b';

const TRANSLATION_PROMPT = `Tu es un traducteur juridique professionnel. TRADUIS le contenu Markdown suivant du français vers {TARGET_LANG}.

RÈGLES STRICTES :
1. NE TRADUIS PAS : noms propres (Kiki en Christ, Vercel, Google Analytics, RGPD, CNIL, UE, France), URLs, emails, placeholders [crochets], balises Markdown/HTML (##, **, *, [], (), #, |, >, \`\`\`), IDs d'ancres (#1-editeur-du-site), tableaux Markdown (garde structure | | |).
2. TRADUIS : tout texte visible, titres (## 1. Éditeur du site), paragraphes, items de liste, cellules de tableau.
3. ADAPTE : références légales (ex: "Loi Informatique et Libertés" -> équivalent local si existe), formats de date (JJ/MM/AAAA -> format local).
4. GARDE : structure Markdown IDENTIQUE (même lignes, indentation, sauts de ligne).

LANGUE CIBLE : {TARGET_LANG}
CODE : {LANG_CODE}

CONTENU :
{CONTENT}

Réponds UNIQUEMENT le Markdown traduit, SANS explications, SANS balises de code.`;

async function callOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, options: { temperature: 0.1, top_p: 0.9, num_predict: 8192 } })
  });
  if (!response.ok) throw new Error(`Ollama ${response.status}: ${await response.text()}`);
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
    if (key && rest.length) frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
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

async function translateBody(page, lang) {
  const sourceFile = path.join(LEGAL_DIR, `${page}-${SOURCE_LANG}.md`);
  const targetFile = path.join(LEGAL_DIR, `${page}-${lang}.md`);

  if (!fs.existsSync(sourceFile) || !fs.existsSync(targetFile)) return false;

  const sourceContent = fs.readFileSync(sourceFile, 'utf-8');
  const { body: frBody } = parseFrontmatter(sourceContent);

  const targetContent = fs.readFileSync(targetFile, 'utf-8');
  const { frontmatter: tgtFm, body: tgtBody } = parseFrontmatter(targetContent);

  // Si body déjà présent et non-vide, skip
  if (tgtBody && tgtBody.length > 100) {
    console.log(`⏭️  ${page}-${lang}: body déjà présent (${tgtBody.length} chars)`);
    return true;
  }

  console.log(`🔄 Traduction body ${page}-${lang}...`);
  const prompt = TRANSLATION_PROMPT.replace('{TARGET_LANG}', lang).replace('{LANG_CODE}', lang).replace('{CONTENT}', frBody);
  
  try {
    const translatedBody = await callOllama(prompt);
    const newContent = buildFrontmatter(tgtFm) + '\n' + translatedBody + '\n';
    fs.writeFileSync(targetFile, newContent, 'utf-8');
    console.log(`✅ ${page}-${lang}: body traduit (${translatedBody.length} chars)`);
    return true;
  } catch (e) {
    console.log(`❌ ${page}-${lang}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Traduction bodies seulement (FR -> 10 langues) via Ollama qwen2.5:1.5b');
  
  // Vérifier Ollama
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    const data = await res.json();
    if (!data.models?.some(m => m.name.includes('qwen2.5:1.5b'))) {
      console.log('❌ Modèle qwen2.5:1.5b non trouvé');
      return;
    }
    console.log('✅ Ollama prêt\n');
  } catch { console.log('❌ Ollama non accessible'); return; }

  let success = 0, skipped = 0, failed = 0;
  
  for (const page of PAGES) {
    for (const lang of TARGET_LANGS) {
      const ok = await translateBody(page, lang);
      if (ok) success++; else failed++;
      if (!ok) skipped++;
      await new Promise(r => setTimeout(r, 300));
    }
  }
  console.log(`\n📊 Résultat: ${success} traités, ${skipped} déjà présents, ${failed} échecs`);
}

main().catch(console.error);