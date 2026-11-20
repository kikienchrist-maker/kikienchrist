const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English combat languages - 6 languages: fr, en, es, pt, de (all formats) + hi (ebook+audio only)
data.en.bookData.combat.languages = [
  { "code": "fr", "name": "French", "fmt": "Paperback · Ebook · Audio" },
  { "code": "en", "name": "English", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Spanish", "fmt": "Papel · Ebook · Audio" },
  { "code": "pt", "name": "Portuguese", "fmt": "Papel · Ebook · Audio" },
  { "code": "de", "name": "German", "fmt": "Buch · Ebook · Audio" },
  { "code": "hi", "name": "Hindi", "fmt": "Ebook · Audio" }
];
data.en.bookData.combat.languagesLabel = "6 languages available";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed English combat languages');