#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGAL_DIR = path.join(__dirname, '..', 'src/content/legal');

if (!fs.existsSync(LEGAL_DIR)) {
  console.log('Répertoire legal non trouvé');
  process.exit(0);
}

const files = fs.readdirSync(LEGAL_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(LEGAL_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('contact@kikienchrist.com')) {
    content = content.replace(/contact@kikienchrist\.com/g, 'kikienchrist@gmail.com');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${file} : email remplacé`);
  }
}

console.log('\nTerminé !');