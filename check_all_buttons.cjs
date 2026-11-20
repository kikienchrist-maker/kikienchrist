const fs = require('fs');
const langs = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];

langs.forEach(lang => {
  const html = fs.readFileSync(`C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/${lang}/index.html`, 'utf8');
  const matches = html.matchAll(/<a class="btn btn-small btn-primary"[^>]*href="[^"]*lulu[^"]*"[^>]*>([^<]+)<\/a>/g);
  for (const match of matches) {
    console.log(`${lang}: "${match[1].trim()}"`);
  }
});