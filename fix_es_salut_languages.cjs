const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish salut languages - only French
data.es.bookData.salut.languages = [
  { "code": "fr", "name": "Francés", "fmt": "Papel · Ebook · Audio" }
];
data.es.bookData.salut.languagesLabel = "1 idioma disponible";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish salut languages');