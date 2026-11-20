const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const idx = content.indexOf('अंतिम युद्ध');
const section = content.slice(idx, idx+600);
console.log(section);