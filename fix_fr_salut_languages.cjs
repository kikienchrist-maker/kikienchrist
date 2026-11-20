const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix French salut languages - 0 languages (remove dropdown entirely)
data.fr.bookData.salut.languages = [];
data.fr.bookData.salut.languagesLabel = "";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed French salut languages (empty)');