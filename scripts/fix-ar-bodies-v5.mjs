#!/usr/bin/env node
/**
 * fix-ar-bodies-v5.mjs — gray-matter pour lire, écriture manuelle pour sortir
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const TARGET_LANG = 'ar';

for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  const arPath = path.join(LEGAL_DIR, `${page}-${TARGET_LANG}.md`);
  
  if (!fs.existsSync(frPath) || !fs.existsSync(arPath)) continue;

  // Lire FR avec gray-matter (gère content: |)
  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frParsed = matter(frRaw);
  const frBody = frParsed.content;

  // Lire AR avec gray-matter
  const arRaw = fs.readFileSync(arPath, 'utf-8');
  const arParsed = matter(arRaw);
  const arBody = arParsed.content;

  console.log(`📄 ${page}: FR body=${frBody.length} chars, AR body=${arBody.length} chars`);

  if (!arBody || arBody.trim().length < 100) {
    console.log(`🔧 ${page}-${TARGET_LANG}: body vide -> copie FR`);
    
    // Écrire manuellement: frontmatter AR (sans content:) + body FR
    const fm = arParsed.data;
    let out = '---\n';
    for (const [key, value] of Object.entries(fm)) {
      if (key === 'content') continue;
      if (typeof value === 'string') out += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
      else if (typeof value === 'boolean') out += `${key}: ${value ? 'true' : 'false'}\n`;
      else if (Array.isArray(value)) out += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
      else out += `${key}: ${value}\n`;
    }
    out += '---\n\n' + frBody + '\n';
    fs.writeFileSync(arPath, out, 'utf-8');
    console.log(`   ✅ Corrigé (${frBody.length} chars)`);
  } else {
    console.log(`⏭️  ${page}-${TARGET_LANG}: body déjà présent`);
  }
}

console.log('\n🎉 Bodies AR corrigés avec gray-matter !');