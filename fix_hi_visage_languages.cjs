const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Hindi visage languages - 5 languages
data.hi.bookData.visage.languages = [
  { "code": "fr", "name": "फ्रेंच", "fmt": "पेपरबैक · ईबुक · ऑडियो" },
  { "code": "en", "name": "अंग्रेज़ी", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "स्पैनिश", "fmt": "पेपरबैक · ईबुक · ऑडियो" },
  { "code": "pt", "name": "पुर्तगाली", "fmt": "पेपरबैक · ईबुक · ऑडियो" },
  { "code": "de", "name": "जर्मन", "fmt": "Taschenbuch · Ebook · Audio" }
];
data.hi.bookData.visage.languagesLabel = "5 भाषाएँ उपलब्ध";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Hindi visage languages');