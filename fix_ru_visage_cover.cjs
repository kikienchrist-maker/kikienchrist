const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Russian visage cover image - use ImgBB direct URL
data.ru.bookData.visage.coverImage = "https://i.ibb.co/chCbYZLy/Design-sans-titre-1-1.png";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Russian visage cover image');