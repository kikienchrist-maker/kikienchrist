const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Mapping of language code to localized terms
const terms = {
  fr: { paper: 'Papier', ebook: 'Ebook', audio: 'Audio' },
  en: { paper: 'Paperback', ebook: 'Ebook', audio: 'Audio' },
  es: { paper: 'Papel', ebook: 'Ebook', audio: 'Audio' },
  pt: { paper: 'Papel', ebook: 'Ebook', audio: 'Audio' },
  de: { paper: 'Buch', ebook: 'Ebook', audio: 'Audio' },
  it: { paper: 'Carta', ebook: 'Ebook', audio: 'Audio' },
  ru: { paper: 'Бумага', ebook: 'Ebook', audio: 'Аудио' },
  zh: { paper: '纸书', ebook: '电子书', audio: '有声书' },
  hi: { paper: 'कागज़', ebook: 'ईबुक', audio: 'ऑडियो' }
};

// Find all bandeau sections and replace them
let newContent = content;
const languages = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];

languages.forEach(lang => {
  const t = terms[lang];
  const newBandeau = `"bandeau": {
      "paper": "${t.paper}",
      "ebook": "${t.ebook}",
      "audio": "${t.audio}"
    }`;
  
  // Find the bandeau for this language by locating the language section
  // Each language has a structure: "fr": { "bandeau": {...}, "books": {...} }
  const langPattern = new RegExp(`"${lang}": \\s*\\{ \\s* "bandeau": \\s* \\{ [\\s\\S]*? \\} \\s* \\}`);
  const match = newContent.match(langPattern);
  
  if (match) {
    const oldSection = match[0];
    const newSection = oldSection.replace(
      /"bandeau":\s*\{[\s\S]*?\}/,
      newBandeau
    );
    newContent = newContent.replace(oldSection, newSection);
    console.log(`Updated ${lang}`);
  } else {
    console.log(`NOT FOUND: ${lang}`);
  }
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', newContent);
console.log('Done');