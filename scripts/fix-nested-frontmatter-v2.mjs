#!/usr/bin/env node
/**
 * Corrige les frontmatters imbriqués - version avec types corrects
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

const CATEGORY_MAP = {
  'الاستدلال': 'discernement',
  'تعلم الصلح': 'apprendre-à-prier',
  'التمييز': 'discernement',
  'الصلاة': 'prière',
  'الروح القدس': 'prière',
};

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') return val.toLowerCase() === 'true';
  return false;
}

function parseNumber(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    return isNaN(n) ? 10 : n;
  }
  return 10;
}

function parseTags(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    // Essayer de parser comme JSON
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    // Sinon, split par virgule
    return val.split(',').map(t => t.trim()).filter(t => t);
  }
  return [];
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  // Détecter frontmatter imbriqué
  if (!content.startsWith('---') || !content.includes('```markdown\n---')) {
    return false;
  }
  
  console.log(`[FIXING] ${fileName}`);
  
  const firstEnd = content.indexOf('\n---', 3);
  if (firstEnd === -1) return false;
  
  const markdownStart = content.indexOf('```markdown');
  if (markdownStart === -1) return false;
  
  const innerStart = content.indexOf('---', markdownStart);
  if (innerStart === -1) return false;
  
  const innerEnd = content.indexOf('---', innerStart + 3);
  if (innerEnd === -1) return false;
  
  const innerFmText = content.slice(innerStart + 3, innerEnd).trim();
  
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
  
  const markdownEnd = content.indexOf('```', innerEnd + 3);
  const bodyStart = markdownEnd !== -1 ? content.indexOf('\n', markdownEnd + 3) + 1 : innerEnd + 3;
  const body = content.slice(bodyStart).trim();
  
  // Catégorie
  let category = innerFm.category || 'vie-chrétienne';
  if (!VALID_CATEGORIES.includes(category)) {
    category = CATEGORY_MAP[category] || 'vie-chrétienne';
  }
  
  // Série
  let series = innerFm.series;
  if (series && !VALID_CATEGORIES.includes(series)) {
    series = 'apprendre-à-prier';
  }
  
  const langMatch = fileName.match(/^([a-z]{2})-/);
  const lang = langMatch ? langMatch[1] : 'fr';
  
  // Slug de base canonique (depuis translationKey ou slug du fichier FR)
  const baseSlug = innerFm.translationKey || innerFm.slug || fileName.replace(/\.[a-z]{2}\.md$/, '').replace(/^[a-z]{2}-/, '');
  const newSlug = lang === 'fr' ? baseSlug : `${baseSlug}-${lang}`;
  
  // Construire frontmatter avec BONS TYPES
  const newFm = {
    title: String(innerFm.title || 'Sans titre'),
    slug: newSlug,
    lang: lang,
    pubDate: String(innerFm.pubDate || new Date().toISOString()),
    updatedDate: new Date().toISOString(),
    description: String(innerFm.description || ''),
    category: category,
    series: series,
    tags: parseTags(innerFm.tags),
    coverImage: String(innerFm.coverImage || '/images/blog/default-cover.jpg'),
    ogImage: String(innerFm.ogImage || 'https://kikienchrist.vercel.app/og/blog/default.png'),
    readingTime: parseNumber(innerFm.readingTime),
    author: String(innerFm.author || 'kikienchrist'),
    featured: parseBool(innerFm.featured),
    draft: parseBool(innerFm.draft),
    translationKey: innerFm.translationKey || baseSlug
  };
  
  // YAML avec types préservés
  const lines = ['---'];
  for (const [key, value] of Object.entries(newFm)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(', ')}]`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value).replace(/"/g, '\\"')}"`);
    }
  }
  lines.push('---');
  
  const newContent = `${lines.join('\n')}\n\n${body}`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`  [OK] slug=${newSlug}, lang=${lang}, tags=array, featured=bool, readingTime=number`);
  return true;
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md') && !f.startsWith('fr-'));
let fixed = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  if (fixFile(filePath)) fixed++;
}

console.log(`\nTermine : ${fixed} fichier(s) corrige(s)`);