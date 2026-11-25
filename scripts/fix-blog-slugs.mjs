#!/usr/bin/env node
/**
 * Corrige les slugs dupliqués dans la collection blog
 * Chaque traduction aura un slug unique: {slug-base}-{lang}
 * translationKey lie les versions
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

const ARTICLE_SLUGS = {
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

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content, raw: match?.[0] };
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
  return { frontmatter, body, raw: match[0] };
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

// Traiter tous les fichiers
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const match = file.match(/^([a-z]{2})-(.+)\.md$/);
  if (!match) continue;
  
  const lang = match[1];
  const baseSlug = match[2];
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Identifier l'article de référence (FR)
  const sourceFile = Object.entries(ARTICLE_SLUGS).find(([k, v]) => v === baseSlug);
  const translationKey = sourceFile ? sourceFile[1] : baseSlug;
  
  // Nouveau slug unique par langue
  const newSlug = lang === 'fr' ? translationKey : `${translationKey}-${lang}`;
  
  // Mettre à jour frontmatter
  frontmatter.slug = newSlug;
  frontmatter.translationKey = translationKey;
  
  // Reconstruire
  const newFm = buildFrontmatter(frontmatter);
  const newContent = `${newFm}\n\n${body}`;
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`[OK] ${file} : slug = "${newSlug}", translationKey = "${translationKey}"`);
}

console.log('\nTermine ! Verification...');