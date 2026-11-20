const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Italian combat languages - 6 languages
data.it.bookData.combat.languages = [
  { "code": "fr", "name": "Francese", "fmt": "Brossura · Ebook · Audio" },
  { "code": "en", "name": "Inglese", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Spagnolo", "fmt": "Brossura · Ebook · Audio" },
  { "code": "pt", "name": "Portoghese", "fmt": "Brossura · Ebook · Audio" },
  { "code": "de", "name": "Tedesco", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Audio" }
];
data.it.bookData.combat.languagesLabel = "6 lingue disponibili";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Italian combat languages');