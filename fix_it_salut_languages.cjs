const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Italian salut languages - 1 language (French only)
data.it.bookData.salut.languages = [
  { "code": "fr", "name": "Francese", "fmt": "Brossura · Ebook · Audio" }
];
data.it.bookData.salut.languagesLabel = "1 lingua disponibile";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Italian salut languages (1 language)');