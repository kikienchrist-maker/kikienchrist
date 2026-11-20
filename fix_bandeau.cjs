const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Mapping of language code to paper term (from fmt field)
const paperTerms = {
  fr: 'Papier',
  en: 'Paperback',
  es: 'Papel',
  pt: 'Papel',
  de: 'Buch',
  it: 'Carta',
  ru: 'Бумага',
  zh: '纸书',
  hi: 'कागज़'
};

const ebookTerms = {
  fr: 'Ebook',
  en: 'Ebook',
  es: 'Ebook',
  pt: 'Ebook',
  de: 'Ebook',
  it: 'Ebook',
  ru: 'Ebook',
  zh: '电子书',
  hi: 'ईबुक'
};

const audioTerms = {
  fr: 'Audio',
  en: 'Audio',
  es: 'Audio',
  pt: 'Audio',
  de: 'Audio',
  it: 'Audio',
  ru: 'Аудио',
  zh: '有声书',
  hi: 'ऑडियो'
};

let newContent = content;

// Replace all bandeau sections
Object.keys(paperTerms).forEach(lang => {
  const paperTerm = paperTerms[lang];
  const ebookTerm = ebookTerms[lang];
  const audioTerm = audioTerms[lang];
  
  const oldPattern = new RegExp(
    `"bandeau": \\s*\\{[\\s\\S]*?"paper"\\s*:\\s*"[^"]*"[\\s\\S]*?"ebook"\\s*:\\s*"[^"]*"[\\s\\S]*?"audio"\\s*:\\s*"[^"]*"[\\s\\S]*?\\}`,
    'g'
  );
  
  // More targeted: replace the specific bandeau for this language
  // Find the bandeau that appears after this language's section
  const langIdx = newContent.indexOf(`"code": "${lang}"`);
  if (langIdx >= 0) {
    // Find the bandeau after this language code
    const sectionStart = newContent.indexOf('"bandeau":', langIdx);
    if (sectionStart >= 0) {
      const sectionEnd = newContent.indexOf('}', sectionStart) + 1;
      const oldBandeau = newContent.slice(sectionStart, sectionEnd);
      const newBandeau = `"bandeau": {
      "paper": "${paperTerm}",
      "ebook": "${ebookTerm}",
      "audio": "${audioTerm}"
    }`;
      newContent = newContent.replace(oldBandeau, newBandeau);
    }
  }
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', newContent);
console.log('Done');