// Script de migration vers Vercel Blob
// Usage: node scripts/migrate-to-blob.js

import { ImageMigrator } from '../skills/infra/vercel-blob-migration/dist/migration.js';
import { BlobMigrationConfig } from '../skills/infra/vercel-blob-migration/dist/types.js';
import { resolve } from 'path';

async function main() {
  // Configuration - à remplir avec vos valeurs Vercel
  const config: BlobMigrationConfig = {
    token: process.env.BLOB_READ_WRITE_TOKEN || 'YOUR_VERCEL_BLOB_TOKEN',
    storeId: process.env.VERCEL_BLOB_STORE_ID || 'YOUR_STORE_ID',
    publicUrl: process.env.NEXT_PUBLIC_BLOB_URL || 'https://kikienchrist.vercel.app', // ou votre custom domain
    prefix: 'images/',
    concurrency: 3,
    dryRun: false, // Mettre true pour tester sans upload
  };

  if (config.token === 'YOUR_VERCEL_BLOB_TOKEN') {
    console.error('❌ ERREUR: Définissez BLOB_READ_WRITE_TOKEN dans les variables d\'environnement');
    console.log('   export BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx');
    console.log('   export VERCEL_BLOB_STORE_ID=store_xxxxx');
    console.log('   export NEXT_PUBLIC_BLOB_URL=https://your-cdn.vercel-storage.com');
    process.exit(1);
  }

  const migrator = new ImageMigrator(config);

  console.log('🚀 Migration des 4 couvertures de livres vers Vercel Blob...');
  console.log(`Source: ${resolve('public/images/books')}`);
  console.log(`Prefix: ${config.prefix}`);
  console.log('');

  try {
    const result = await migrator.migrateLocalFiles(
      resolve('public/images/books'),
      '**/*.{jpg,jpeg,png,webp,avif}'
    );

    // Sauver le rapport
    migrator.saveMappingReport(resolve('blob-mapping-report.json'));
    
    console.log('\n✅ Migration terminée !');
    console.log(`📊 Total: ${result.stats.total}`);
    console.log(`⬆️  Uploadés: ${result.stats.uploaded}`);
    console.log(`⏭️  Ignorés: ${result.stats.skipped}`);
    console.log(`❌ Échoués: ${result.stats.failed}`);
    console.log(`💾 Taille: ${(result.stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`⏱️  Durée: ${result.stats.duration}ms`);
    
    console.log('\n📋 Mappings:');
    for (const [source, mapping] of migrator.getMappings()) {
      console.log(`  ${source} → ${mapping.blobUrl}`);
    }

    if (result.errors.length > 0) {
      console.log('\n❌ Erreurs:');
      for (const err of result.errors) {
        console.log(`  ${err.originalUrl}: ${err.error}`);
      }
    }

    console.log('\n📄 Rapport sauvé: blob-mapping-report.json');
    console.log('\n🔧 Prochaine étape: Mettre à jour les références dans le code');
    console.log('   Remplacez /images/books/xxx par les nouvelles URLs Vercel Blob');

  } catch (error) {
    console.error('❌ Erreur migration:', error);
    process.exit(1);
  }
}

main();