#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

const counts = {};

for (const file of files) {
  const match = file.match(/^([a-z]{2})-(.+)\.md$/);
  if (match) {
    const slug = match[2];
    if (!counts[slug]) counts[slug] = [];
    counts[slug].push(match[1]);
  }
}

console.log('📊 Traductions par article :\n');
for (const [slug, langs] of Object.entries(counts).sort()) {
  const missing = ['fr','en','es','pt','it','de','nl','pl','ar','ru','zh','hi'].filter(l => !langs.includes(l));
  console.log(`  ${slug}: ${langs.length}/12 langues ${langs.sort().join(', ')}`);
  if (missing.length > 0) {
    console.log(`    ❌ Manquantes: ${missing.join(', ')}`);
  }
}

console.log('\n📈 Total fichiers:', files.length);
console.log('📝 Articles uniques:', Object.keys(counts).length);