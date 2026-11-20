const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix the corrupted section - there's missing comma and newline
let fixed = content.replace(
  /"audio": "Audio"\s*\}"nTitle"/g,
  '"audio": "Audio"\n    },\n    "sectionTitle"'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed corruption 2');