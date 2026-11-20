const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Italian visage cover image - use ImgBB direct URL
data.it.bookData.visage.coverImage = "https://i.ibb.co/C3QMY5g5/Design-sans-titre-1-1.png";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Italian visage cover image');