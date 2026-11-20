const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Russian visage languages - 5 languages
data.ru.bookData.visage.languages = [
  { "code": "fr", "name": "Французский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "en", "name": "Английский", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Испанский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "pt", "name": "Португальский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "de", "name": "Немецкий", "fmt": "Taschenbuch · Ebook · Audio" }
];
data.ru.bookData.visage.languagesLabel = "5 языков доступно";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Russian visage languages');