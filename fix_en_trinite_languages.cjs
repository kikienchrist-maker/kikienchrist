const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English trinite languages - 9 languages
data.en.bookData.trinite.languages = [
  { "code": "fr", "name": "French", "fmt": "Paperback · Ebook · Audio" },
  { "code": "en", "name": "English", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Spanish", "fmt": "Papel · Ebook · Audio" },
  { "code": "pt", "name": "Portuguese", "fmt": "Papel · Ebook · Audio" },
  { "code": "de", "name": "German", "fmt": "Buch · Ebook · Audio" },
  { "code": "it", "name": "Italian", "fmt": "Carta · Ebook" },
  { "code": "ru", "name": "Russian", "fmt": "Бумага · Ebook" },
  { "code": "zh", "name": "Chinese", "fmt": "纸书 · 电子书" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Audio" }
];
data.en.bookData.trinite.languagesLabel = "9 languages available";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed English trinite languages');