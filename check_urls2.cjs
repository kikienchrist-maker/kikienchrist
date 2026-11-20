const fs = require('fs');

// Check Spanish
const es = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/es/index.html', 'utf8');
const esMatches = es.match(/Lulu.*?https?:\/\/[^"]+/g);
console.log('=== SPANISH ===');
if (esMatches) esMatches.forEach(m => console.log(m.slice(0, 150)));

// Check French
const fr = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/fr/index.html', 'utf8');
const frMatches = fr.match(/Lulu.*?https?:\/\/[^"]+/g);
console.log('\n=== FRENCH ===');
if (frMatches) frMatches.forEach(m => console.log(m.slice(0, 150)));

// Check Hindi
const hi = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/hi/index.html', 'utf8');
const hiMatches = hi.match(/Lulu.*?https?:\/\/[^"]+/g);
console.log('\n=== HINDI ===');
if (hiMatches) hiMatches.forEach(m => console.log(m.slice(0, 150)));