const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix root level: remove extra }, before language codes
const langCodes = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];

let fixed = content;
langCodes.forEach(lang => {
  // Pattern: }\n  },\n  "lang":
  fixed = fixed.replace(new RegExp(`}\\s*}\\s*,\\s*\\"${lang}\\":`, 'g'), `}\n  "${lang}":`);
  // Pattern: },\n  "lang":
  fixed = fixed.replace(new RegExp(`},\\s*\\"${lang}\\":`, 'g'), `\n  "${lang}":`);
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed root level');