const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Portuguese trinite languages - 9 languages
data.pt.bookData.trinite.languages = [
  { "code": "fr", "name": "Francês", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "en", "name": "Inglês", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Espanhol", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "pt", "name": "Português", "fmt": "Capa comum · Ebook · Áudio" },
  { "code": "de", "name": "Alemão", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "it", "name": "Italiano", "fmt": "Capa comum · Ebook" },
  { "code": "ru", "name": "Russo", "fmt": "Capa comum · Ebook" },
  { "code": "zh", "name": "Chinês", "fmt": "Capa comum · Ebook" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Áudio" }
];
data.pt.bookData.trinite.languagesLabel = "9 idiomas disponíveis";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Portuguese trinite languages');