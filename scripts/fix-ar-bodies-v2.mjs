#!/usr/bin/env node
/**
 * fix-ar-bodies-v2.mjs — Copie le body FR (après ---) pour les 3 fichiers AR vides
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const TARGET_LANG = 'ar';

function getBodyAfterFrontmatter(content) {
  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!fmMatch) return '';
  return content.slice(fmMatch[0].length);
}

for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  const arPath = path.join(LEGAL_DIR, `${page}-${TARGET_LANG}.md`);
  
  if (!fs.existsSync(frPath) || !fs.existsSync(arPath)) continue;

  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frBody = getBodyAfterFrontmatter(frRaw);

  const arRaw = fs.readFileSync(arPath, 'utf-8');
  const arBody = getBodyAfterFrontmatter(arRaw);

  if (!arBody || arBody.trim().length < 100) {
    console.log(`🔧 ${page}-${TARGET_LANG}: body vide (${arBody?.length || 0} chars) -> copie FR (${frBody.length} chars)`);
    
    // Lire frontmatter AR existant
    const fmMatch = arRaw.match(/^---\n([\s\S]*?)\n---/);
    let fmLines = fmMatch ? fmMatch[1].split('\n') : [];
    let out = '---\n';
    for (const line of fmLines) {
      if (line.trim() && !line.startsWith('content:')) {
        out += line + '\n';
      }
    }
    out += '---\n\n' + frBody + '\n';
    fs.writeFileSync(arPath, out, 'utf-8');
    console.log(`   ✅ Corrigé`);
  } else {
    console.log(`⏭️  ${page}-${TARGET_LANG}: body déjà présent (${arBody.length} chars)`);
  }
}

console.log('\n🎉 Bodies AR corrigés avec body FR !');