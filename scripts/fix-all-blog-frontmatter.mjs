#!/usr/bin/env node
/**
 * Corrige TOUS les frontmatters blog (FR + traductions) pour conformité schéma
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
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return val.split(',').map(t => t.trim()).filter(t => t);
  }
  return [];
}

function extractInnerFrontmatter(content) {
  // Pattern 1: frontmatter imbriqué dans ```markdown
  if (content.includes('```markdown\n---')) {
    const markdownStart = content.indexOf('```markdown');
    const innerStart = content.indexOf('---', markdownStart);
    const innerEnd = content.indexOf('---', innerStart + 3);
    if (innerStart !== -1 && innerEnd !== -1) {
      const innerFmText = content.slice(innerStart + 3, innerEnd).trim();
      const markdownEnd = content.indexOf('```', innerEnd + 3);
      const bodyStart = markdownEnd !== -1 ? content.indexOf('\n', markdownEnd + 3) + 1 : innerEnd + 3;
      const body = content.slice(bodyStart).trim();
      
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
      return { frontmatter: innerFm, body, hadNested: true };
    }
  }
  
  // Pattern 2: frontmatter normal au début
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
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
    return { frontmatter, body, hadNested: false };
  }
  
  return { frontmatter: {}, body: content, hadNested: false };
}

function fixFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body, hadNested } = extractInnerFrontmatter(content);
  
  if (Object.keys(frontmatter).length === 0 && !hadNested) {
    console.log(`[SKIP] ${fileName} : pas de frontmatter detectable`);
    return false;
  }
  
  // Déterminer langue et slug de base
  const langMatch = fileName.match(/^([a-z]{2})-/);
  const lang = langMatch ? langMatch[1] : 'fr';
  const baseSlug = SLUG_MAP[`fr-${fileName.replace(/^[a-z]{2}-/, '')}`] || 
                   frontmatter.translationKey || 
                   frontmatter.slug || 
                   fileName.replace('.md', '');
  const newSlug = lang === 'fr' ? baseSlug : `${baseSlug}-${lang}`;
  
  // Catégorie
  let category = frontmatter.category || 'vie-chrétienne';
  if (!VALID_CATEGORIES.includes(category)) {
    category = CATEGORY_MAP[category] || 'vie-chrétienne';
  }
  
  // Série
  let series = frontmatter.series;
  if (series && !VALID_CATEGORIES.includes(series)) {
    series = 'apprendre-à-prier';
  }
  
  // Construire frontmatter propre avec BONS TYPES
  const newFm = {
    title: String(frontmatter.title || 'Sans titre'),
    slug: newSlug,
    lang: lang,
    pubDate: String(frontmatter.pubDate || new Date().toISOString()),
    updatedDate: new Date().toISOString(),
    description: String(frontmatter.description || ''),
    category: category,
    series: series,
    tags: parseTags(frontmatter.tags),
    coverImage: String(frontmatter.coverImage || '/images/blog/default-cover.jpg'),
    ogImage: String(frontmatter.ogImage || 'https://kikienchrist.vercel.app/og/blog/default.png'),
    readingTime: parseNumber(frontmatter.readingTime),
    author: String(frontmatter.author || 'kikienchrist'),
    featured: parseBool(frontmatter.featured),
    draft: parseBool(frontmatter.draft),
    translationKey: baseSlug
  };
  
  // YAML
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
  
  const action = hadNested ? 'REBUILT (nested)' : 'FIXED';
  console.log(`[${action}] ${fileName} : slug=${newSlug}, lang=${lang}, tags=arr, featured=bool, rt=num`);
  return true;
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
let fixed = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  if (fixFile(filePath, file)) fixed++;
}

console.log(`\nTermine : ${fixed} fichier(s) traités sur ${files.length}`);