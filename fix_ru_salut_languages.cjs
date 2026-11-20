const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Russian salut languages - 1 language (French only)
data.ru.bookData.salut.languages = [
  { "code": "fr", "name": "Французский", "fmt": "Мягкая обложка · Электронная · Аудио" }
];
data.ru.bookData.salut.languagesLabel = "1 язык доступен";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Russian salut languages (1 language)');