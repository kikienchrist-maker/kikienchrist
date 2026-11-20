const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English visage cover image - use ImgBB direct URL
data.en.bookData.visage.coverImage = "https://i.ibb.co/DPGr4yYJ/frontcover-jpg.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Updated English visage cover image URL (ImgBB)');