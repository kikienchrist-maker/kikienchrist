const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Russian combat languages - 6 languages
data.ru.bookData.combat.languages = [
  { "code": "fr", "name": "Французский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "en", "name": "Английский", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Испанский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "pt", "name": "Португальский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "de", "name": "Немецкий", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "hi", "name": "Хинди", "fmt": "Электронная · Аудио" }
];
data.ru.bookData.combat.languagesLabel = "6 языков доступно";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Russian combat languages');