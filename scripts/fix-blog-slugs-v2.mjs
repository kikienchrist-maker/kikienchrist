#!/usr/bin/env node
/**
 * Corrige les slugs - version corrigée pour guerre-spirituelle
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

// Mapping correct : fichier FR -> slug de base canonique
const SLUG_MAP = {
  'fr-entendre-voix-dieu.md': 'entendre-voix-dieu',
  'fr-guerre-spirituelle.md': 'guerre-spirituelle-priere-autorite',
  'fr-jeuner-prier.md': 'jeuner-prier',
  'fr-priere-couple.md': 'priere-couple',
  'fr-priere-enfants.md': 'apprendre-prier-enfants',
  'fr-priere-impossible.md': 'priere-impossible-desert-spirituel',
  'fr-priere-jeunes.md': 'priere-generation-z-jeunes',
  'fr-priere-maladie.md': 'priere-guerison-maladie',
  'fr-priere-matin-soir.md': 'priere-matin-soir-routine',
  'fr-priere-quotidienne.md': 'priere-quotidienne-7-cles'
};

// Inverse : slug de base -> fichier FR source
const REVERSE_MAP = {};
for (const [file, slug] of Object.entries(SLUG_MAP)) {
  REVERSE_MAP[slug] = file;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };
  const fmText = match[1];
  const frontmatter = {};
  fmText.split('\n').forEach(line => {
    const [key, ...valParts] = line.split(':');
    if (key && valParts.length) {
      let val = valParts.join(':').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[key.trim()] = val;
    }
  });
  const body = content.slice(match[0].length).trim();
  return { frontmatter, body };
}

function buildFrontmatter(fm) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fm)) {
    if (key === 'tags' && Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'string') {
      const escaped = String(value).replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const match = file.match(/^([a-z]{2})-(.+)\.md$/);
  if (!match) continue;
  
  const lang = match[1];
  const currentSlug = match[2];
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Trouver le slug de base canonique
  let translationKey = null;
  
  // 1. Si c'est un fichier FR source
  if (SLUG_MAP[file]) {
    translationKey = SLUG_MAP[file];
  }
  // 2. Sinon, chercher par le slug actuel (pour les fichiers traduits)
  else {
    // Essayer de matcher avec les slugs connus
    for (const [baseSlug, sourceFile] of Object.entries(REVERSE_MAP)) {
      if (currentSlug.startsWith(baseSlug) || baseSlug.startsWith(currentSlug.replace(`-${lang}`, ''))) {
        translationKey = baseSlug;
        break;
      }
    }
    // Fallback : utiliser le slug actuel sans suffixe de langue
    if (!translationKey) {
      translationKey = currentSlug.replace(`-${lang}`, '');
    }
  }
  
  // Nouveau slug unique
  const newSlug = lang === 'fr' ? translationKey : `${translationKey}-${lang}`;
  
  // Mettre à jour
  frontmatter.slug = newSlug;
  frontmatter.translationKey = translationKey;
  
  const newFm = buildFrontmatter(frontmatter);
  const newContent = `${newFm}\n\n${body}`;
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`[OK] ${file} : slug="${newSlug}", translationKey="${translationKey}"`);
}

console.log('\nTermine !');