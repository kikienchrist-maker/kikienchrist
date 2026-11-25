#!/usr/bin/env node
/**
 * Corrige les tags YAML corrompus : tags: "[\"tag1\", \"tag2\"]" -> tags: ["tag1", "tag2"]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

function fixTagsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Pattern exact : tags: "[\\"tag1\\", \\"tag2\\"]"
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match: tags: "[\"tag1\", \"tag2\"]"  (avec backslashes littéraux)
    if (line.trim().startsWith('tags:') && line.includes('\\"')) {
      // Extraire le contenu entre [ et ]
      const match = line.match(/tags:\s*\[(.+)\]/);
      if (match) {
        let tagsContent = match[1];
        // Remplacer \\" par "
        tagsContent = tagsContent.replace(/\\"/g, '"');
        // Parser JSON
        try {
          const tags = JSON.parse(`[${tagsContent}]`);
          // Reconstruire ligne YAML propre
          lines[i] = `tags: [${tags.map(t => `"${t}"`).join(', ')}]`;
          modified = true;
          console.log(`[FIXED] ${path.basename(filePath)} : ${lines[i]}`);
        } catch (e) {
          console.error(`[ERROR] ${path.basename(filePath)} : JSON parse failed - ${e.message}`);
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