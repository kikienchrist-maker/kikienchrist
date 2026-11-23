#!/usr/bin/env node
/**
 * fix-ar-content-field.mjs — Remet content: | dans le frontmatter AR
 * (comme le FR) pour que Astro getCollection le trouve
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
  const frBody = frParsed.data.content || frParsed.content;

  const arRaw = fs.readFileSync(arPath, 'utf-8');
  const arParsed = matter(arRaw);

  if (!arParsed.data.content) {
    console.log(`🔧 ${page}-${TARGET_LANG}: ajout content: | dans frontmatter`);
    
    const fm = { ...arParsed.data };
    fm.content = frBody;
    
    const out = matter.stringify('', fm);
    fs.writeFileSync(arPath, out, 'utf-8');
    console.log(`   ✅ Frontmatter mis à jour`);
  } else {
    console.log(`⏭️  ${page}-${TARGET_LANG}: content déjà présent`);
  }
}

console.log('\n🎉 Champ content: | ajouté !');