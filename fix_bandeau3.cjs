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

// Split by bandeau sections and replace each one
let newContent = content;
let count = 0;

// Find all bandeau sections and replace sequentially
const bandeauRegex = /"bandeau":\s*\{[\s\S]*?\}/g;
let match;
let lastIndex = 0;
const languages = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];

while ((match = bandeauRegex.exec(content)) !== null) {
  if (count < languages.length) {
    const lang = languages[count];
    const t = terms[lang];
    const newBandeau = `"bandeau": {
      "paper": "${t.paper}",
      "ebook": "${t.ebook}",
      "audio": "${t.audio}"
    }`;
    newContent = newContent.slice(0, match.index) + newBandeau + newContent.slice(match.index + match[0].length);
    console.log(`Replaced ${lang} bandeau at index ${match.index}`);
    count++;
  }
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', newContent);
console.log(`Done, replaced ${count} bandeau sections`);