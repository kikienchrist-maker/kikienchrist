const fs = require('fs');
const fr = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/fr/index.html', 'utf8');

// Find the full button HTML
const matches = fr.matchAll(/<a class="btn btn-small btn-primary"[^>]*href="[^"]*lulu[^"]*"[^>]*>([^<]+)\s*—\s*Lulu<\/a>/g);
for (const match of matches) {
  console.log('Button text:', match[1].trim());
  console.log('---');
}