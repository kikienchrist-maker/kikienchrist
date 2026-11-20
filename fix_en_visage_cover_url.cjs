const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English visage cover image - use uploaded tmpfiles.org direct URL
data.en.bookData.visage.coverImage = "https://tmpfiles.org/dl/wxAitqSFe1XW/frontcover.jpg.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Updated English visage cover image URL');