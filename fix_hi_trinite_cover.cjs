const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Hindi trinite cover image - use ImgBB direct URL
data.hi.bookData.trinite.coverImage = "https://i.ibb.co/JWRnXz34/frontcover-jpg.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Hindi trinite cover image');