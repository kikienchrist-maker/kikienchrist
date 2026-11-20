const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish trinite languages - 9 languages
data.es.bookData.trinite.languages = [
  { "code": "fr", "name": "Francés", "fmt": "Papel · Ebook · Audio" },
  { "code": "en", "name": "Inglés", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Español", "fmt": "Papel · Ebook · Audio" },
  { "code": "pt", "name": "Portugués", "fmt": "Papel · Ebook · Audio" },
  { "code": "de", "name": "Alemán", "fmt": "Buch · Ebook · Audio" },
  { "code": "it", "name": "Italiano", "fmt": "Carta · Ebook" },
  { "code": "ru", "name": "Ruso", "fmt": "Бумага · Ebook" },
  { "code": "zh", "name": "Chino", "fmt": "纸书 · 电子书" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Audio" }
];
data.es.bookData.trinite.languagesLabel = "9 idiomas disponibles";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish trinite languages');