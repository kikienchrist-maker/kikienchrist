import fs from 'fs';
import path from 'path';

const srcDir = 'src/content/legalPages';
const langs = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

// Read all FR files
const frFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('-fr.md'));

console.log(`Found ${frFiles.length} FR files`);

for (const frFile of frFiles) {
  const frPath = path.join(srcDir, frFile);
  let content = fs.readFileSync(frPath, 'utf-8');
  
  // Extract base name (e.g., "mentions-legales")
  const baseName = frFile.replace('-fr.md', '');
  
  for (const lg of langs) {
    // Replace lang: "fr" with lang: "lg"
    const newContent = content.replace(/^lang: "fr"/m, `lang: "${lg}"`);
    
    const newFileName = `${baseName}-${lg}.md`;
    const newPath = path.join(srcDir, newFileName);
    
    fs.writeFileSync(newPath, newContent, 'utf-8');
    console.log(`Created: ${newFileName}`);
  }
}

console.log('Done!');
const total = fs.readdirSync(srcDir).filter(f => f.endsWith('.md')).length;
console.log(`Total files: ${total}`);