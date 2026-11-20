const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix root level: ensure proper commas between language objects
// Pattern: }\n  "lang": -> },\n  "lang":
const langCodes = ['en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi']; // fr is first

let fixed = content;
langCodes.forEach(lang => {
  // Ensure there's a comma before each language (except fr)
  fixed = fixed.replace(new RegExp(`}\\s*\\n\\s*\\"${lang}\\":`, 'g'), `},\n  "${lang}":`);
  // Also handle: }\n  "lang":
  fixed = fixed.replace(new RegExp(`}\\s*\\"${lang}\\":`, 'g'), `},\n  "${lang}":`);
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed root commas');