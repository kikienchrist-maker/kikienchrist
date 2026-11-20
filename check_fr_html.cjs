const fs = require('fs');
const fr = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/fr/index.html', 'utf8');

// Find any button with Lulu
const matches = fr.matchAll(/<a[^>]*class="btn[^"]*"[^>]*href="[^"]*lulu[^"]*"[^>]*>([^<]+)<\/a>/g);
for (const match of matches) {
  console.log('Full text:', match[1].trim());
  console.log('---');
}