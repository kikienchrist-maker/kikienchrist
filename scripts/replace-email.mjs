#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGAL_PAGES_DIR = path.join(__dirname, '..', 'src/content/legalPages');

const files = fs.readdirSync(LEGAL_PAGES_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(LEGAL_PAGES_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('kikienchrist@gmail.com')) {
    content = content.replace(/kikienchrist@gmail\.com/g, 'kikienchrist@gmail.com');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${file} : email remplacé`);
  }
}

console.log('\nTerminé !');