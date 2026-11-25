#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src/content/blog');

const filePath = path.join(BLOG_DIR, 'fr-jeuner-prier.md');
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim().startsWith('tags:')) {
    console.log(`Line ${i}: "${line}"`);
    console.log(`  includes backslash: ${line.includes('\\')}`);
    console.log(`  includes escaped quote: ${line.includes('\\"')}`);
    console.log(`  char codes:`, [...line].map((c, idx) => `${idx}:${c.charCodeAt(0)}(${c})`));
    break;
  }
}