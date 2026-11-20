const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/en/index.html', 'utf8');
const matches = content.match(/Lulu.*?https?:\/\/[^"]+/g);
if (matches) matches.forEach(m => console.log(m.slice(0, 120)));