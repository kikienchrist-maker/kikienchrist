// scripts/generate-pwa-icons.ts
// Génère toutes les tailles d'icônes PWA depuis un master (512x512)
// Usage: npx tsx scripts/generate-pwa-icons.ts

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const MASTER = 'public/icons/icon-master.png'; // 512x512 PNG à fournir
const OUT_DIR = 'public/icons';

// Couleur de fond #fdfcf8 (lafoidieu design system)
const BG_COLOR = { r: 253, g: 252, b: 248, alpha: 1 };

async function generateIcons() {
  // Vérifier si le master existe
  try {
    await fs.access(MASTER);
  } catch {
    console.error(`❌ Master icon not found: ${MASTER}`);
    console.log('   Créez un fichier 512x512 PNG à cet emplacement');
    console.log('   Ou modifiez MASTER dans le script pour pointer vers votre logo');
    process.exit(1);
  }
  
  await fs.mkdir(OUT_DIR, { recursive: true });
  
  console.log('🎨 Génération icônes PWA...');
  
  // Icônes standards
  for (const size of SIZES) {
    await sharp(MASTER)
      .resize(size, size, { fit: 'contain', background: BG_COLOR })
      .png()
      .toFile(path.join(OUT_DIR, `icon-${size}.png`));
    console.log(`  ✅ icon-${size}.png`);
  }
  
  // Versions maskable (safe zone 40% = 10% padding chaque côté)
  for (const size of SIZES) {
    const padding = Math.round(size * 0.1);
    const innerSize = size - padding * 2;
    
    await sharp(MASTER)
      .resize(innerSize, innerSize, { fit: 'contain' })
      .extend({ top: padding, bottom: padding, left: padding, right: padding, background: BG_COLOR })
      .png()
      .toFile(path.join(OUT_DIR, `icon-${size}-maskable.png`));
    console.log(`  ✅ icon-${size}-maskable.png`);
  }
  
  console.log('\n✅ Icônes générées dans public/icons/');
  console.log('📝 N\'oubliez pas d\'ajouter les screenshots dans public/screenshots/');
}

generateIcons().catch(console.error);