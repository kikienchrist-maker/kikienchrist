#!/usr/bin/env node
/** Supprime le doublon "Blog" dans footer.nav */

import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/translations.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const blogWords = ['Blog', 'Блог', '博客', 'ब्लॉग'];

Object.keys(data).forEach(lang => {
  const nav = data[lang]?.footer?.nav;
  if (!nav) return;
  // Garder seulement la première occurrence de chaque mot blog
  const seen = new Set();
  const deduped = nav.filter(item => {
    if (blogWords.includes(item)) {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    }
    return true;
  });
  data[lang].footer.nav = deduped;
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ Doublons supprimés');