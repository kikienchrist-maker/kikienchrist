const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Italian combat cover image - use ImgBB direct URL
data.it.bookData.combat.coverImage = "https://i.ibb.co/hRgzNs32/FOI-sans-criture.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Italian combat cover image');