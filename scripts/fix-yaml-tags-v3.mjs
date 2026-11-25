#!/usr/bin/env node
/**
 * Corrige les tags YAML : tags: "[\\"tag1\\", \\"tag2\\"]" -> tags: ["tag1", "tag2"]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

function fixTagsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Regex pour trouver la ligne tags corrompue
  const regex = /^tags:\s*\[((?:\\"[^"\\]*(?:\\.[^"\\]*)*\\"\s*,?\s*)+)\]\s*$/m;
  
  if (!regex.test(content)) {
    // Essayer pattern plus simple
    const simpleRegex = /^tags:\s*\[(.+)\]$/m;
    const match = content.match(simpleRegex);
    if (match && match[1].includes('\\"')) {
      console.log(`[MATCH SIMPLE] ${path.basename(filePath)}`);
      let tagsContent = match[1];
      // Remplacer \\" par "
      tagsContent = tagsContent.replace(/\\\\"/g, '"');
      try {
        const tags = JSON.parse(`[${tagsContent}]`);
        const newLine = `tags: [${tags.map(t => `"${t}"`).join(', ')}]`;
        content = content.replace(simpleRegex, newLine);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  [FIXED] -> ${newLine}`);
        return true;
      } catch (e) {
        console.error(`  [ERROR] JSON parse failed: ${e.message}`);
        console.error(`  Content: ${tagsContent}`);
      }
    }
    return false;
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