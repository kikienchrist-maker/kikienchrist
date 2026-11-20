const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Hindi visage cover image - use ImgBB direct URL
data.hi.bookData.visage.coverImage = "https://i.ibb.co/d4q7KfNC/Design-sans-titre-1-1.png";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Hindi visage cover image');