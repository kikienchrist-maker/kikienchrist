const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix German visage languages - 5 languages
data.de.bookData.visage.languages = [
  { "code": "fr", "name": "Französisch", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "en", "name": "Englisch", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "Spanisch", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "pt", "name": "Portugiesisch", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "de", "name": "Deutsch", "fmt": "Taschenbuch · Ebook · Audio" }
];
data.de.bookData.visage.languagesLabel = "5 Sprachen verfügbar";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed German visage languages');