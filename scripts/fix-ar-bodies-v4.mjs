#!/usr/bin/env node
/**
 * fix-ar-bodies-v4.mjs — Split robuste sur --- (CRLF ou LF)
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
  // Normaliser CRLF -> LF
  const normalized = content.replace(/\r\n/g, '\n');
  // Trouver la 2ème occurrence de \n---\n
  const parts = normalized.split('\n---\n');
  if (parts.length >= 3) {
    // parts[0] = avant 1er ---, parts[1] = frontmatter, parts[2] = body (+ éventuel 3ème ---)
    return parts.slice(2).join('\n---\n').trimStart();
  }
  return '';
}

for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  const arPath = path.join(LEGAL_DIR, `${page}-${TARGET_LANG}.md`);
  
  if (!fs.existsSync(frPath) || !fs.existsSync(arPath)) continue;

  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frBody = getBodyAfterFrontmatter(frRaw);

  const arRaw = fs.readFileSync(arPath, 'utf-8');
  const arBody = getBodyAfterFrontmatter(arRaw);

  console.log(`📄 ${page}: FR body=${frBody.length} chars, AR body=${arBody.length} chars`);

  if (!arBody || arBody.trim().length < 100) {
    console.log(`🔧 ${page}-${TARGET_LANG}: body vide -> copie FR`);
    
    const normalizedAr = arRaw.replace(/\r\n/g, '\n');
    const parts = normalizedAr.split('\n---\n');
    if (parts.length >= 2) {
      // Reconstituer frontmatter (parts[0] + --- + parts[1] + ---)
      const fmPart = parts[0] + '\n---\n' + parts[1] + '\n---';
      const out = fmPart + '\n\n' + frBody + '\n';
      fs.writeFileSync(arPath, out, 'utf-8');
      console.log(`   ✅ Corrigé`);
    }
  } else {
    console.log(`⏭️  ${page}-${TARGET_LANG}: body déjà présent`);
  }
}

console.log('\n🎉 Bodies AR corrigés !');