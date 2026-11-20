const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Chinese visage languages - 5 languages
data.zh.bookData.visage.languages = [
  { "code": "fr", "name": "法语", "fmt": "平装 · 电子书 · 有声书" },
  { "code": "en", "name": "英语", "fmt": "Paperback · Ebook · Audio" },
  { "code": "es", "name": "西班牙语", "fmt": "平装 · 电子书 · 有声书" },
  { "code": "pt", "name": "葡萄牙语", "fmt": "平装 · 电子书 · 有声书" },
  { "code": "de", "name": "德语", "fmt": "Taschenbuch · Ebook · Audio" }
];
data.zh.bookData.visage.languagesLabel = "5 种语言可用";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Chinese visage languages');