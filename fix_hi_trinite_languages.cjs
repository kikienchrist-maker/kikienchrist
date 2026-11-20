const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Hindi trinite languages - 9 languages
data.hi.bookData.trinite.languages = [
  { "code": "fr", "name": "फ्रेंच", "fmt": "पेपरबैक · ईबुक · ऑडियो" },
  { "code": "en", "name": "अंग्रेज़ी", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "स्पैनिश", "fmt": "पेपरबैक · ईबुक · ऑडियो" },
  { "code": "pt", "name": "पुर्तगाली", "fmt": "पेपरबैक · ईबुक · ऑडियो" },
  { "code": "de", "name": "जर्मन", "fmt": "Taschenbuch · Ebook · Audio" },
  { "code": "it", "name": "इतालवी", "fmt": "पेपरबैक · ईबुक" },
  { "code": "ru", "name": "रूसी", "fmt": "पेपरबैक · ईबुक" },
  { "code": "zh", "name": "चीनी", "fmt": "पेपरबैक · ईबुक" },
  { "code": "hi", "name": "हिंदी", "fmt": "ईबुक · ऑडियो" }
];
data.hi.bookData.trinite.languagesLabel = "9 भाषाएँ उपलब्ध";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Hindi trinite languages');