const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Also ensure French salut bandeau labels are empty
data.fr.bandeau.paper = "";
data.fr.bandeau.ebook = "";
data.fr.bandeau.audio = "";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed French salut bandeau labels (empty)');