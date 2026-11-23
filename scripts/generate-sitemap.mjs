#!/usr/bin/env node
/**
 * generate-sitemap.mjs — Génère sitemap.xml manuellement depuis dist/
 * Contournement bug @astrojs/sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const SITE_URL = 'https://kikienchrist.vercel.app';
const OUTPUT_FILE = path.join(DIST_DIR, 'sitemap.xml');

// Pages à exclure (optionnel)
const EXCLUDE_PATTERNS = [
  '/404',
  '/500',
];

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file === 'index.html') {
      // Convertir chemin en URL
      const relativePath = path.relative(DIST_DIR, fullPath);
      const urlPath = '/' + relativePath.replace(/\\/g, '/').replace('/index.html', '/');
      fileList.push(urlPath);
    }
  }
  
  return fileList;
}

function generateSitemap() {
  console.log('🔍 Scan dist/ pour générer sitemap.xml...');
  
  const urls = getAllHtmlFiles(DIST_DIR);
  console.log(`📄 ${urls.length} pages trouvées`);
  
  // Filtrer exclusions
  const filteredUrls = urls.filter(url => 
    !EXCLUDE_PATTERNS.some(pattern => url.includes(pattern))
  );
  
  const today = new Date().toISOString().split('T')[0];
  
  const sitemapEntries = filteredUrls.map(url => {
    const fullUrl = `${SITE_URL}${url}`;
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('\n');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>`;
  
  fs.writeFileSync(OUTPUT_FILE, sitemap);
  console.log(`✅ sitemap.xml généré : ${OUTPUT_FILE}`);
  console.log(`📊 ${filteredUrls.length} URLs incluses`);
}

generateSitemap();