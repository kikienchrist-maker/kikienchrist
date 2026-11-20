const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Portuguese visage languages - 5 languages
data.pt.bookData.visage.languages = [
  { "code": "fr", "name": "Francês", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "en", "name": "Inglês", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Espanhol", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "pt", "name": "Português", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "de", "name": "Alemão", "fmt": "Taschenbuch · Ebook · Audio" }
];
data.pt.bookData.visage.languagesLabel = "5 idiomas disponíveis";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Portuguese visage languages');