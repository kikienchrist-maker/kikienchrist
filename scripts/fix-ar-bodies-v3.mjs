#!/usr/bin/env node
/**
 * fix-ar-bodies-v3.mjs — Trouve la 2ème occurrence de --- (fin frontmatter)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const TARGET_LANG = 'ar';

function getBodyAfterSecondDashes(content) {
  let count = 0;
  let pos = 0;
  while (pos < content.length && count < 2) {
    const idx = content.indexOf('\n---', pos);
    if (idx === -1) break;
    count++;
    pos = idx + 4; // après "\n---"
    if (count === 2) return content.slice(pos).trimStart();
  }
  return '';
}

for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  const arPath = path.join(LEGAL_DIR, `${page}-${TARGET_LANG}.md`);
  
  if (!fs.existsSync(frPath) || !fs.existsSync(arPath)) continue;

  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frBody = getBodyAfterSecondDashes(frRaw);

  const arRaw = fs.readFileSync(arPath, 'utf-8');
  const arBody = getBodyAfterSecondDashes(arRaw);

  if (!arBody || arBody.trim().length < 100) {
    console.log(`🔧 ${page}-${TARGET_LANG}: body vide (${arBody?.length || 0} chars) -> copie FR (${frBody.length} chars)`);
    
    // Trouver fin frontmatter AR (2ème ---)
    let count = 0;
    let pos = 0;
    while (pos < arRaw.length && count < 2) {
      const idx = arRaw.indexOf('\n---', pos);
      if (idx === -1) break;
      count++;
      pos = idx + 4;
    }
    const fmPart = arRaw.slice(0, pos - 4); // jusqu'au 2ème ---
    const out = fmPart + '\n\n' + frBody + '\n';
    fs.writeFileSync(arPath, out, 'utf-8');
    console.log(`   ✅ Corrigé`);
  } else {
    console.log(`⏭️  ${page}-${TARGET_LANG}: body déjà présent (${arBody.length} chars)`);
  }
}

console.log('\n🎉 Bodies AR corrigés !');