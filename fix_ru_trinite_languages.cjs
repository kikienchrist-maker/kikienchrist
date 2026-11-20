const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Russian trinite languages - 9 languages
data.ru.bookData.trinite.languages = [
  { "code": "fr", "name": "Французский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "en", "name": "Английский", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Испанский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "pt", "name": "Португальский", "fmt": "Мягкая обложка · Электронная · Аудио" },
  { "code": "de", "name": "Немецкий", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "it", "name": "Итальянский", "fmt": "Мягкая обложка · Электронная" },
  { "code": "ru", "name": "Русский", "fmt": "Мягкая обложка · Электронная" },
  { "code": "zh", "name": "Китайский", "fmt": "Мягкая обложка · Электронная" },
  { "code": "hi", "name": "Хинди", "fmt": "Электронная · Аудио" }
];
data.ru.bookData.trinite.languagesLabel = "9 языков доступно";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Russian trinite languages');