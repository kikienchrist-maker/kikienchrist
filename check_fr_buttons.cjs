const fs = require('fs');
const fr = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/fr/index.html', 'utf8');

// Find all Lulu buttons
const matches = fr.matchAll(/btn-primary[^>]*>([^<]+)\s*—\s*Lulu/g);
for (const match of matches) {
  console.log(match[1].trim());
}