// Use a more robust approach - manually reconstruct the file
const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Since the JSON has duplicate keys, let's extract the correct bandeau for each language
// and rebuild the file cleanly

// The correct bandeau values (from the second occurrence of each language):
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

// Parse the JSON with a custom parser that handles duplicates by keeping last
// We'll use a simple state machine
function parseJsonWithDuplicates(str) {
  const result = {};
  let i = 0;
  let currentLang = null;
  
  while (i < str.length) {
    // Skip whitespace
    while (i < str.length && /\s/.test(str[i])) i++;
    if (i >= str.length) break;
    
    if (str[i] === '{') {
      // Start of object - could be root or nested
      i++;
      continue;
    }
    if (str[i] === '}') {
      i++;
      continue;
    }
    if (str[i] === '"') {
      // Parse key
      i++; // skip "
      let key = '';
      while (i < str.length && str[i] !== '"') {
        if (str[i] === '\\' && i + 1 < str.length) {
          key += str[i + 1];
          i += 2;
        } else {
          key += str[i];
          i++;
        }
      }
      i++; // skip closing "
      
      // Skip whitespace and colon
      while (i < str.length && /\s/.test(str[i])) i++;
      if (str[i] === ':') i++;
      while (i < str.length && /\s/.test(str[i])) i++;
      
      if (str[i] === '{') {
        // Nested object - if key is a language code, track it
        if (/^[a-z]{2}$/.test(key)) {
          currentLang = key;
        }
        i++;
        continue;
      }
      
      if (str[i] === '"') {
        // String value
        i++;
        let value = '';
        while (i < str.length && str[i] !== '"') {
          if (str[i] === '\\' && i + 1 < str.length) {
            value += str[i + 1];
            i += 2;
          } else {
            value += str[i];
            i++;
          }
        }
        i++; // skip closing "
        
        // If we're in a bandeau section for a language, capture it
        // But this is too complex for a quick fix
      }
    }
    i++;
  }
  return result;
}

// Simpler approach: Use regex to replace each language's bandeau section
// Each language section has a predictable structure

const langs = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];
let fixed = content;

langs.forEach(lang => {
  const t = correctBandeau[lang];
  const newBandeau = `"bandeau": {\n      "paper": "${t.paper}",\n      "ebook": "${t.ebook}",\n      "audio": "${t.audio}"\n    }`;
  
  // Find the language section and replace its bandeau
  // Pattern: "lang": { ... "bandeau": { ... } ... }
  // We'll find the last occurrence of "bandeau" within this language section
  
  const langStart = fixed.indexOf(`"${lang}":`);
  if (langStart === -1) return;
  
  // Find the next language start or end of object
  let nextLangStart = fixed.length;
  const allLangs = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];
  for (const l of allLangs) {
    if (l === lang) continue;
    const idx = fixed.indexOf(`"${l}":`, langStart);
    if (idx !== -1 && idx > langStart && idx < nextLangStart) {
      nextLangStart = idx;
    }
  }
  
  // Within this language section, find all bandeau occurrences
  let bandeauIdx = fixed.indexOf('"bandeau":', langStart);
  let lastBandeauIdx = -1;
  while (bandeauIdx !== -1 && bandeauIdx < nextLangStart) {
    lastBandeauIdx = bandeauIdx;
    bandeauIdx = fixed.indexOf('"bandeau":', bandeauIdx + 1);
  }
  
  if (lastBandeauIdx !== -1) {
    // Find the end of this bandeau object
    let braceCount = 0;
    let endIdx = lastBandeauIdx;
    let foundBrace = false;
    for (let j = lastBandeauIdx; j < nextLangStart; j++) {
      if (fixed[j] === '{') {
        braceCount++;
        foundBrace = true;
      } else if (fixed[j] === '}') {
        braceCount--;
        if (foundBrace && braceCount === 0) {
          endIdx = j + 1;
          // Include trailing comma/whitespace
          while (endIdx < fixed.length && (fixed[endIdx] === ',' || /\s/.test(fixed[endIdx]))) {
            endIdx++;
          }
          break;
        }
      }
    }
    
    // Replace
    fixed = fixed.slice(0, lastBandeauIdx) + newBandeau + fixed.slice(endIdx);
    console.log(`Fixed ${lang} bandeau`);
  }
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Done');