const fs = require('fs');

// Install json5 if needed, but let's try without first
// npm install json5

// Instead, let's manually construct the clean JSON from the known good translations
// We know the structure and the correct values for everything.

// The original file had 9 languages: fr, en, es, pt, de, it, ru, zh, hi
// Each has: lang, dir, name, meta, hero, bandeau, books, newsletter, faq, cta, footer, bookData

// Since we can't easily parse the corrupted file, let's read the CURRENT file 
// and use a more careful parsing approach.

const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Let's try to use the built-in JSON.parse with a reviver that handles duplicates
// by keeping the last value. But JSON.parse fails on duplicate keys.

// Alternative: Use a simple state machine to parse, keeping last value for duplicates
function parseLenient(jsonStr) {
  const stack = [];
  let current = {};
  stack.push(current);
  let i = 0;
  let key = null;
  let inString = false;
  let stringVal = '';
  let escapeNext = false;
  
  while (i < jsonStr.length) {
    const ch = jsonStr[i];
    
    if (inString) {
      if (escapeNext) {
        stringVal += ch;
        escapeNext = false;
      } else if (ch === '\\') {
        escapeNext = true;
      } else if (ch === '"') {
        inString = false;
        if (key === null) {
          key = stringVal;
        } else {
          // Value
          const top = stack[stack.length - 1];
          if (top && typeof top === 'object') {
            top[key] = stringVal;
          }
          key = null;
        }
        stringVal = '';
      } else {
        stringVal += ch;
      }
    } else {
      if (ch === '"') {
        inString = true;
        stringVal = '';
      } else if (ch === '{') {
        const newObj = {};
        const top = stack[stack.length - 1];
        if (key !== null && top && typeof top === 'object') {
          top[key] = newObj;
        }
        stack.push(newObj);
        key = null;
      } else if (ch === '}') {
        stack.pop();
        key = null;
      } else if (ch === '[') {
        const newArr = [];
        const top = stack[stack.length - 1];
        if (key !== null && top && typeof top === 'object') {
          top[key] = newArr;
        }
        stack.push(newArr);
        key = null;
      } else if (ch === ']') {
        stack.pop();
        key = null;
      } else if (ch === ':') {
        // Key already captured
      } else if (ch === ',') {
        key = null;
      }
      // Ignore whitespace, numbers, true, false, null for simplicity
    }
    i++;
  }
  
  return stack[0];
}

// This is too complex for a quick fix. Let me try a different approach:
// The file has 9 languages. The correct bandeau values are known.
// Let me just fix the specific corruptions one by one using precise string replacement.

// Actually, let's check if there's a way to get the original file.
// Since git is not available, let's try to use the fact that the ASTRO build worked before.

// Best approach: Use the fix_all_braces but EXCLUDE root-level }"lang":
// Root level languages: fr, en, es, pt, de, it, ru, zh, hi
// Only fix }"key" where key is NOT a language code

const langCodes = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];

let fixed = content;
// Fix }"key" but only if key is not a language code
fixed = fixed.replace(/}"(\w+)":/g, (match, key) => {
  if (langCodes.includes(key)) {
    return match; // Don't fix root-level language transitions
  }
  return '},\n    "' + key + '":';
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed with language exclusion');