const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Parse the JSON
const data = JSON.parse(content);

// Update bandeau for each language
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

// Update each language's bandeau
Object.keys(terms).forEach(lang => {
  if (data[lang]) {
    data[lang].bandeau = terms[lang];
  }
});

// Write back
fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Done');