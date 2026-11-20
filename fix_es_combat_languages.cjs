const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish combat languages - 6 languages
data.es.bookData.combat.languages = [
  { "code": "fr", "name": "Francés", "fmt": "Papel · Ebook · Audio" },
  { "code": "en", "name": "Inglés", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Español", "fmt": "Papel · Ebook · Audio" },
  { "code": "pt", "name": "Portugués", "fmt": "Papel · Ebook · Audio" },
  { "code": "de", "name": "Alemán", "fmt": "Buch · Ebook · Audio" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Audio" }
];
data.es.bookData.combat.languagesLabel = "6 idiomas disponibles";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish combat languages');