const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const idx = content.indexOf('"bandeau":');
console.log(content.slice(idx, idx+100));