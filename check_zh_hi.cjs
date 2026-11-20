const fs = require('fs');

// Check Chinese
const zh = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/zh/index.html', 'utf8');
const zhMatch = zh.match(/btn-primary[^>]*>([^<]+)/);
console.log('ZH buttons:', zhMatch ? zhMatch[1] : 'none');

// Check Hindi
const hi = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/hi/index.html', 'utf8');
const hiMatch = hi.match(/btn-primary[^>]*>([^<]+)/);
console.log('HI buttons:', hiMatch ? hiMatch[1] : 'none');