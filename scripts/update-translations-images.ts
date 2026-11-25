// scripts/update-translations-images.ts
// Met à jour translations.json avec les nouvelles URLs Vercel Blob
// Usage: npx tsx scripts/update-translations-images.ts

import fs from 'fs/promises';
import path from 'path';
import migrationReport from './migration-report.json';

async function main() {
  const translationsPath = path.join(process.cwd(), 'src/data/translations.json');
  
  if (!fs.existsSync(translationsPath)) {
    console.error('❌ translations.json non trouvé');
    process.exit(1);
  }
  
  const content = await fs.readFile(translationsPath, 'utf-8');
  const translations = JSON.parse(content);
  
  let replaced = 0;
  
  // Parcours récursif pour remplacer toutes les URLs correspondantes
  function replaceUrls(obj: any): any {
    if (typeof obj === 'string') {
      if (migrationReport[obj]) {
        replaced++;
        return migrationReport[obj];
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(replaceUrls);
    }
    if (obj && typeof obj === 'object') {
      const newObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key] = replaceUrls(value);
      }
      return newObj;
    }
    return obj;
  }
  
  const updated = replaceUrls(translations);
  
  if (replaced === 0) {
    console.log('ℹ️  Aucune URL à remplacer (mapping vide ou déjà à jour)');
    return;
  }
  
  await fs.writeFile(translationsPath, JSON.stringify(updated, null, 2));
  console.log(`✅ translations.json mis à jour: ${replaced} URL(s) remplacée(s)`);
}

main().catch(console.error);