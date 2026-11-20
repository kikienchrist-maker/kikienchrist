const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix French salut languages - 1 language (French only)
data.fr.bookData.salut.languages = [
  { "code": "fr", "name": "Français", "fmt": "Papier · Ebook · Audio" }
];
data.fr.bookData.salut.languagesLabel = "1 langue disponible";

// Also restore bandeau labels for French (since book 4 has French formats)
data.fr.bandeau.paper = "Papier";
data.fr.bandeau.ebook = "Ebook";
data.fr.bandeau.audio = "Audio";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed French salut languages (1 language) + bandeau labels');