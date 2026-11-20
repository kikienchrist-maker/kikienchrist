const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English trinite cover image - use ImgBB direct URL
data.en.bookData.trinite.coverImage = "https://i.ibb.co/4nT6s7vR/frontcover-jpg.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Updated English trinite cover image URL (ImgBB)');