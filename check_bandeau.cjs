const fs = require('fs');
const langs = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];

langs.forEach(lang => {
  const html = fs.readFileSync(`C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/${lang}/index.html`, 'utf8');
  const match = html.match(/<div class="band"[^>]*>([\s\S]*?)<\/div>/);
  if (match) {
    const inner = match[1];
    // Extract the three items
    const items = inner.match(/<span>([^<]+)<\/span>|<strong>([^<]+)<\/strong>/g);
    if (items) {
      console.log(`${lang}: ${items.map(i => i.replace(/<\/?[^>]+>/g, '')).join(' | ')}`);
    }
  }
});