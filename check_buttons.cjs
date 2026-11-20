const fs = require('fs');
const langs = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];

langs.forEach(lang => {
  const html = fs.readFileSync(`C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/${lang}/index.html`, 'utf8');
  // Find the paper button (btn-primary with Lulu)
  const match = html.match(/btn-primary[^>]*>([^<]+)\s*—\s*Lulu/);
  console.log(`${lang}: ${match ? match[1].trim() : 'NOT FOUND'}`);
});