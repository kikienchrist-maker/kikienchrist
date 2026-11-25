#!/usr/bin/env node
/**
 * Corrige les frontmatters imbriqués dans les fichiers blog traduits
 * (générés par Ollama avec bloc markdown contenant un frontmatter)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

const VALID_CATEGORIES = [
  'prière', 'formation', 'témoignage', 'vie-chrétienne',
  'famille', 'mission', 'actualité', 'ressource',
  'discernement', 'jeûne', 'épreuves', 'guerre spirituelle',
  'guérison', 'routine', 'jeunes', 'couple'
];

// Mapping catégories traduites -> canoniques
const CATEGORY_MAP = {
  'الاستدلال': 'discernement',
  'تعلم الصلح': 'apprendre-à-prier',
  'التمييز': 'discernement',
  'الصلاة': 'prière',
  'الروح القدس': 'prière',
  // Ajouter au besoin
};

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  // Détecter frontmatter imbriqué : commence par --- puis contient ```markdown\n---
  if (!content.startsWith('---') || !content.includes('```markdown\n---')) {
    return false; // Pas de problème détecté
  }
  
  console.log(`[FIXING] ${fileName} : frontmatter imbrique detecte`);
  
  // Trouver le premier --- (début outer)
  const firstEnd = content.indexOf('\n---', 3);
  if (firstEnd === -1) return false;
  
  // Trouver ```markdown
  const markdownStart = content.indexOf('```markdown');
  if (markdownStart === -1) return false;
  
  // Trouver le --- interne (après ```markdown)
  const innerStart = content.indexOf('---', markdownStart);
  if (innerStart === -1) return false;
  
  // Trouver la fin du frontmatter interne
  const innerEnd = content.indexOf('---', innerStart + 3);
  if (innerEnd === -1) return false;
  
  // Extraire le frontmatter interne
  const innerFmText = content.slice(innerStart + 3, innerEnd).trim();
  
  // Parser le frontmatter interne
  const innerFm = {};
  innerFmText.split('\n').forEach(line => {
    const [key, ...valParts] = line.split(':');
    if (key && valParts.length) {
      let val = valParts.join(':').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      innerFm[key.trim()] = val;
    }
  });
  
  // Trouver la fin du bloc markdown ```
  const markdownEnd = content.indexOf('```', innerEnd + 3);
  const bodyStart = markdownEnd !== -1 ? content.indexOf('\n', markdownEnd + 3) + 1 : innerEnd + 3;
  const body = content.slice(bodyStart).trim();
  
  // Valider/corriger catégorie
  if (innerFm.category && !VALID_CATEGORIES.includes(innerFm.category)) {
    innerFm.category = CATEGORY_MAP[innerFm.category] || 'vie-chrétienne';
  }
  
  // Série
  if (innerFm.series && !VALID_CATEGORIES.includes(innerFm.series)) {
    innerFm.series = 'apprendre-à-prier';
  }
  
  // Reconstruire frontmatter propre
  const langMatch = fileName.match(/^([a-z]{2})-/);
  const lang = langMatch ? langMatch[1] : 'fr';
  
  // Slug unique
  const baseSlug = innerFm.translationKey || innerFm.slug || fileName.replace('.md', '');
  const newSlug = lang === 'fr' ? baseSlug : `${baseSlug}-${lang}`;
  
  const newFm = {
    ...innerFm,
    slug: newSlug,
    lang: lang,
    translationKey: innerFm.translationKey || baseSlug,
    updatedDate: new Date().toISOString()
  };
  
  // S'assurer que les champs requis existent
  if (!newFm.title) newFm.title = innerFm.title || 'Sans titre';
  if (!newFm.description) newFm.description = innerFm.description || '';
  if (!newFm.pubDate) newFm.pubDate = innerFm.pubDate || new Date().toISOString();
  if (!newFm.category) newFm.category = 'vie-chrétienne';
  if (!newFm.tags) newFm.tags = [];
  if (!newFm.coverImage) newFm.coverImage = '/images/blog/default-cover.jpg';
  if (!newFm.ogImage) newFm.ogImage = 'https://kikienchrist.vercel.app/og/blog/default.png';
  if (!newFm.readingTime) newFm.readingTime = 10;
  if (!newFm.author) newFm.author = 'kikienchrist';
  if (!newFm.featured) newFm.featured = false;
  if (!newFm.draft) newFm.draft = false;
  
  // Construire YAML
  const lines = ['---'];
  for (const [key, value] of Object.entries(newFm)) {
    if (key === 'tags' && Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'string') {
      const escaped = String(value).replace(/"/g, '\\"');
      lines.push(`${key}: "${escaped}"`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value).replace(/"/g, '\\"')}"`);
    }
  }
  lines.push('---');
  
  const newContent = `${lines.join('\n')}\n\n${body}`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  [OK] ${fileName} : corrige (slug=${newSlug}, lang=${lang})`);
  return true;
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') && !f.startsWith('fr-'));
let fixed = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  if (fixFile(filePath)) fixed++;
}

console.log(`\nTermine : ${fixed} fichier(s) corrige(s) sur ${files.length} fichiers non-FR`);