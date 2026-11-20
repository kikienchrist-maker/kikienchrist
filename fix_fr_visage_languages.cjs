const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix French visage languages - 5 languages
data.fr.bookData.visage.languages = [
  { "code": "fr", "name": "Français", "fmt": "Papier · Ebook · Audio" },
  { "code": "en", "name": "English", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Español", "fmt": "Papel · Ebook · Audio" },
  { "code": "pt", "name": "Português", "fmt": "Papel · Ebook · Audio" },
  { "code": "de", "name": "Deutsch", "fmt": "Buch · Ebook · Audio" }
];
data.fr.bookData.visage.languagesLabel = "5 langues disponibles";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed French visage languages');