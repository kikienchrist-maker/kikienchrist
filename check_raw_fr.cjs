const fs = require('fs');
const fr = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/fr/index.html', 'utf8');

// Find any occurrence of "papier_lulu" or similar
const matches = fr.match(/papier_?lulu/gi);
console.log('Found:', matches);

// Also check for "Papier Lulu" with space
const matches2 = fr.match(/Papier\s+Lulu/gi);
console.log('Found "Papier Lulu":', matches2);

// Check exact button HTML
const btnMatches = fr.matchAll(/<a class="btn btn-small btn-primary"[^>]*href="[^"]*lulu[^"]*"[^>]*>([^<]+)<\/a>/g);
for (const m of btnMatches) {
  console.log('Button inner:', JSON.stringify(m[1]));
}