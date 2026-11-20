const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Italian trinite languages - 9 languages
data.it.bookData.trinite.languages = [
  { "code": "fr", "name": "Francese", "fmt": "Brossura · Ebook · Audio" },
  { "code": "en", "name": "Inglese", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Spagnolo", "fmt": "Brossura · Ebook · Audio" },
  { "code": "pt", "name": "Portoghese", "fmt": "Brossura · Ebook · Audio" },
  { "code": "de", "name": "Tedesco", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "it", "name": "Italiano", "fmt": "Brossura · Ebook" },
  { "code": "ru", "name": "Russo", "fmt": "Brossura · Ebook" },
  { "code": "zh", "name": "Cinese", "fmt": "Brossura · Ebook" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Audio" }
];
data.it.bookData.trinite.languagesLabel = "9 lingue disponibili";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Italian trinite languages');