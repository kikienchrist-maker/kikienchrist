#!/usr/bin/env node
/**
 * fix-ar-bodies.mjs — Copie le body FR pour les 3 fichiers AR vides
 * (traduction arabe a échoué, on met le FR en attendant)
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

  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frParsed = matter(frRaw);
  const frBody = frParsed.content;

  const arRaw = fs.readFileSync(arPath, 'utf-8');
  const arParsed = matter(arRaw);
  const arBody = arParsed.content;

  // Si body AR vide ou très court, remplacer par body FR
  if (!arBody || arBody.trim().length < 100) {
    console.log(`🔧 ${page}-${TARGET_LANG}: body vide (${arBody?.length || 0} chars) -> copie FR (${frBody.length} chars)`);
    const newContent = matter.stringify(frBody, arParsed.data);
    // matter.stringify met le body dans content: | -> il faut le remettre après ---
    const fm = matter.stringify('', arParsed.data).replace('---\n', '').replace(/^content: \|[\s\S]*$/m, '').trim();
    // Plus simple: rebuild manuellement
    let out = '---\n';
    for (const [key, value] of Object.entries(arParsed.data)) {
      if (key === 'content') continue;
      if (typeof value === 'string') out += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
      else if (typeof value === 'boolean') out += `${key}: ${value ? 'true' : 'false'}\n`;
      else if (Array.isArray(value)) out += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
      else out += `${key}: ${value}\n`;
    }
    out += '---\n\n' + frBody + '\n';
    fs.writeFileSync(arPath, out, 'utf-8');
    console.log(`   ✅ Corrigé`);
  } else {
    console.log(`⏭️  ${page}-${TARGET_LANG}: body déjà présent (${arBody.length} chars)`);
  }
}

console.log('\n🎉 Bodies AR corrigés !');