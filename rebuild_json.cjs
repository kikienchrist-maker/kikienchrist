const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// The file has duplicate keys and corruption. 
// Let's use a more robust approach: extract each language section using regex
// and rebuild cleanly.

// First, let's find the boundaries of each language section
const langs = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];

// Find start of each language
const langPositions = {};
langs.forEach(lang => {
  const idx = content.indexOf(`"${lang}":`);
  if (idx >= 0) langPositions[lang] = idx;
});

console.log('Language positions:', langPositions);

// Find end of file (after last language)
const lastLang = 'hi';
const lastPos = langPositions[lastLang];
const endPos = content.lastIndexOf('}', lastPos) + 1; // Not reliable

// Better: parse by finding matching braces for each language
// But given time, let's use the fact that the CORRECT bandeau values are known
// and the rest of the translations are fine.

// Approach: Use the correct bandeau values and fix the file by replacing
// each language's entire bandeau section cleanly.

const correctBandeau = {
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

// For each language, find its section and replace the ENTIRE bandeau block (including duplicates)
let fixed = content;

langs.forEach(lang => {
  const t = correctBandeau[lang];
  const newBandeau = `"bandeau": {\n      "paper": "${t.paper}",\n      "ebook": "${t.ebook}",\n      "audio": "${t.audio}"\n    }`;
  
  const langStart = fixed.indexOf(`"${lang}":`);
  if (langStart === -1) return;
  
  // Find the end of this language section (next language or end of root)
  let nextLangStart = fixed.length;
  for (const l of langs) {
    if (l === lang) continue;
    const idx = fixed.indexOf(`"${l}":`, langStart);
    if (idx !== -1 && idx > langStart && idx < nextLangStart) {
      nextLangStart = idx;
    }
  }
  
  // Within this language section, find ALL bandeau occurrences and replace the entire span
  // from first bandeau to end of last bandeau
  let firstBandeau = fixed.indexOf('"bandeau":', langStart);
  let lastBandeau = -1;
  let searchIdx = langStart;
  while (true) {
    const idx = fixed.indexOf('"bandeau":', searchIdx);
    if (idx === -1 || idx >= nextLangStart) break;
    lastBandeau = idx;
    searchIdx = idx + 1;
  }
  
  if (firstBandeau !== -1 && lastBandeau !== -1) {
    // Find the end of the last bandeau object
    let braceCount = 0;
    let endIdx = lastBandeau;
    let foundBrace = false;
    for (let j = lastBandeau; j < nextLangStart; j++) {
      if (fixed[j] === '{') {
        braceCount++;
        foundBrace = true;
      } else if (fixed[j] === '}') {
        braceCount--;
        if (foundBrace && braceCount === 0) {
          endIdx = j + 1;
          // Include trailing comma/whitespace up to next key
          while (endIdx < fixed.length && (fixed[endIdx] === ',' || /\s/.test(fixed[endIdx]))) {
            endIdx++;
          }
          break;
        }
      }
    }
    
    // Also include from firstBandeau backwards to catch any preceding comma/whitespace
    let startIdx = firstBandeau;
    while (startIdx > langStart && (fixed[startIdx - 1] === ',' || /\s/.test(fixed[startIdx - 1]))) {
      startIdx--;
    }
    
    console.log(`Replacing ${lang}: ${startIdx} to ${endIdx}`);
    fixed = fixed.slice(0, startIdx) + newBandeau + fixed.slice(endIdx);
  }
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Done rebuilding');