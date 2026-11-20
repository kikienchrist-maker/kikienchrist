const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Chinese salut languages - 1 language (French only)
data.zh.bookData.salut.languages = [
  { "code": "fr", "name": "法语", "fmt": "平装 · 电子书 · 有声书" }
];
data.zh.bookData.salut.languagesLabel = "1 种语言可用";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Chinese salut languages (1 language)');