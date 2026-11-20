const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English salut languages - only French
data.en.bookData.salut.languages = [
  { "code": "fr", "name": "French", "fmt": "Paperback · Ebook · Audio" }
];

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed English salut languages');