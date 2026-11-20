const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish visage cover image - use ImgBB direct URL
data.es.bookData.visage.coverImage = "https://i.ibb.co/20PKqZMT/frontcover-jpg.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish visage cover image URL (ImgBB)');