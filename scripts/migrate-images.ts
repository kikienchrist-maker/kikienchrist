// scripts/migrate-images.ts
// Migration ImgBB / URLs externes → Vercel Blob
// Usage: npx tsx scripts/migrate-images.ts (nécessite BLOB_READ_WRITE_TOKEN dans .env.local)

import { uploadImage } from '../src/lib/blob';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import 'dotenv/config';

// ⚠️ REMPLIR : mapping des URLs actuelles → { folder, filename cible }
const IMGBB_MAPPING: Record<string, { folder: 'books' | 'blog' | 'og' | 'lead-magnets'; filename: string }> = {
  // Couvertures livres (exemples - à compléter avec vos vraies URLs ImgBB)
  'https://i.ibb.co/WWj7kDZD/frontcover-jpg.jpg': { folder: 'books', filename: 'visage-cover.jpg' },
  // 'https://i.ibb.co/xxx/trinite-cover.jpg': { folder: 'books', filename: 'trinite-cover.jpg' },
  // 'https://i.ibb.co/xxx/salut-cover.jpg': { folder: 'books', filename: 'salut-cover.jpg' },
  // 'https://i.ibb.co/xxx/combat-cover.jpg': { folder: 'books', filename: 'combat-cover.jpg' },
  
  // OG images blog (exemples)
  // 'https://i.ibb.co/xxx/og-article1.jpg': { folder: 'og', filename: 'article1-og.jpg' },
  
  // Lead magnets
  // 'https://i.ibb.co/xxx/guide-priere.pdf': { folder: 'lead-magnets', filename: 'guide-priere.pdf' },
};

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log('🚀 Migration ImgBB → Vercel Blob...');
  
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN manquant dans .env.local');
    console.log('   Créez un store Vercel Blob, puis ajoutez le token dans .env.local');
    process.exit(1);
  }
  
  const results: Record<string, string> = {};
  let success = 0, failed = 0;
  
  for (const [imgbbUrl, { folder, filename }] of Object.entries(IMGBB_MAPPING)) {
    try {
      console.log(`  ⬇️  Downloading ${filename} from ${imgbbUrl}...`);
      const buffer = await downloadImage(imgbbUrl);
      
      console.log(`  ⬆️  Uploading to Vercel Blob (${folder}/${filename})...`);
      const result = await uploadImage(buffer, filename, folder);
      
      results[imgbbUrl] = result.url;
      console.log(`  ✅ ${filename} → ${result.url}`);
      success++;
    } catch (err) {
      console.error(`  ❌ ${filename}:`, err);
      failed++;
    }
  }
  
  // Sauvegarder le mapping pour mise à jour translations.json / books data
  const reportPath = path.join(process.cwd(), 'scripts', 'migration-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  console.log(`\n📊 Résultats: ${success} succès, ${failed} échecs`);
  console.log(`📋 Rapport sauvé dans ${reportPath}`);
  console.log('🔄 Prochaine étape: npm run update:images (met à jour translations.json)');
}

main().catch(console.error);