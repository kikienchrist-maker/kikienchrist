const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Portuguese combat languages - 6 languages
data.pt.bookData.combat.languages = [
  { "code": "fr", "name": "Francês", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "en", "name": "Inglês", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Espanhol", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "pt", "name": "Português", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "de", "name": "Alemão", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Áudio" }
];
data.pt.bookData.combat.languagesLabel = "6 idiomas disponíveis";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Portuguese combat languages');