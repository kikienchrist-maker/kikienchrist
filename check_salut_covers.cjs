const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Check salut coverImage for all languages
Object.keys(data).forEach(lang => {
  if (data[lang].bookData && data[lang].bookData.salut) {
    console.log(`${lang} salut coverImage: ${data[lang].bookData.salut.coverImage}`);
  }
});