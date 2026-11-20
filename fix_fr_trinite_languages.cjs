const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix French trinite languages - 9 languages
data.fr.bookData.trinite.languages = [
  { "code": "fr", "name": "Français", "fmt": "Papier · Ebook · Audio" },
  { "code": "en", "name": "English", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Español", "fmt": "Papel · Ebook · Audio" },
  { "code": "pt", "name": "Português", "fmt": "Papel · Ebook · Audio" },
  { "code": "de", "name": "Deutsch", "fmt": "Buch · Ebook · Audio" },
  { "code": "it", "name": "Italiano", "fmt": "Carta · Ebook" },
  { "code": "ru", "name": "Русский", "fmt": "Бумага · Ebook" },
  { "code": "zh", "name": "中文", "fmt": "纸书 · 电子书" },
  { "code": "hi", "name": "हिंदी", "fmt": "Ebook · Audio" }
];
data.fr.bookData.trinite.languagesLabel = "9 langues disponibles";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed French trinite languages');