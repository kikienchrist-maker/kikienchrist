#!/usr/bin/env node
/**
 * Corrige les tags YAML corrompus (double échappement) dans tous les fichiers blog
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

function fixTagsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Pattern pour détecter tags corrompus: tags: "[\"tag1\", \"tag2\"]"
  const corruptedPattern = /^tags:\s*\[\\"([^\\"]+)(?:\\",\s*\\"([^\\"]+))*\\"\]/m;
  
  if (corruptedPattern.test(content)) {
    // Extraire les tags
    const match = content.match(/^tags:\s*\[(.+)\]$/m);
    if (match) {
      let tagsStr = match[1];
      // Nettoyer les échappements
      tagsStr = tagsStr.replace(/\\"/g, '"');
      // Parser comme JSON pour récupérer l'array
      try {
        const tags = JSON.parse(`[${tagsStr}]`);
        // Reconstruire ligne YAML correcte
        const newTagsLine = `tags: [${tags.map(t => `"${t}"`).join(', ')}]`;
        content = content.replace(/^tags:\s*\[.+\]$/m, newTagsLine);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[FIXED] ${path.basename(filePath)} : tags corriges`);
        return true;
      } catch (e) {
        console.error(`[ERROR] ${path.basename(filePath)} : impossible de parser tags - ${e.message}`);
      }
    }
  }
  return false;
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
let fixed = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  if (fixTagsInFile(filePath)) fixed++;
}

console.log(`\nTermine : ${fixed} fichier(s) corrige(s) sur ${files.length}`);