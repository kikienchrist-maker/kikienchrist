const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Hindi salut languages - 1 language (French only)
data.hi.bookData.salut.languages = [
  { "code": "fr", "name": "फ्रेंच", "fmt": "पेपरबैक · ईबुक · ऑडियो" }
];
data.hi.bookData.salut.languagesLabel = "1 भाषा उपलब्ध";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Hindi salut languages (1 language)');