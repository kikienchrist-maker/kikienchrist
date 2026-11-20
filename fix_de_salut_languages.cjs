const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix German salut languages - 1 language (French only)
data.de.bookData.salut.languages = [
  { "code": "fr", "name": "Französisch", "fmt": "Taschenbuch · Ebook · Audio" }
];
data.de.bookData.salut.languagesLabel = "1 Sprache verfügbar";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed German salut languages (1 language)');