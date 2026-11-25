#!/usr/bin/env node
/**
 * Corrige les tags YAML - approche ligne par ligne sans regex complexe
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

function fixTagsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Détecter ligne tags avec double échappement
    if (trimmed.startsWith('tags:') && trimmed.includes('\\"')) {
      console.log(`[FOUND] ${path.basename(filePath)} line ${i}: ${trimmed.substring(0, 80)}...`);
      
      // Extraire le contenu entre [ et ] 
      const start = trimmed.indexOf('[');
      const end = trimmed.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        let tagsContent = trimmed.substring(start + 1, end);
        // Remplacer \\" par " (deux backslashes littéraux -> un guillemet)
        tagsContent = tagsContent.replace(/\\\\"/g, '"');
        console.log(`  Cleaned: [${tagsContent.substring(0, 80)}...]`);
        
        try {
          const tags = JSON.parse(`[${tagsContent}]`);
          const newLine = `tags: [${tags.map(t => `"${t}"`).join(', ')}]`;
          lines[i] = newLine;
          modified = true;
          console.log(`  [FIXED] -> ${newLine}`);
        } catch (e) {
          console.error(`  [ERROR] JSON parse failed: ${e.message}`);
          console.error(`  Content: ${tagsContent}`);
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    return true;
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