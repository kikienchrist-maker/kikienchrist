const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Portuguese salut languages - 1 language (French only)
data.pt.bookData.salut.languages = [
  { "code": "fr", "name": "Francês", "fmt": "Capa comum · Ebook · Áudio" }
];
data.pt.bookData.salut.languagesLabel = "1 idioma disponível";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Portuguese salut languages (1 language)');