const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Chinese visage cover image - use ImgBB direct URL
data.zh.bookData.visage.coverImage = "https://i.ibb.co/spDxjH4h/Design-sans-titre-1-1.png";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Chinese visage cover image');