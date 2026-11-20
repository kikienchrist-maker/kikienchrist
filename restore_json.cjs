const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix the corrupted section around position 11300
// The corruption is: "paper": "क"bandeau": {  "paper": "Paperback", ...
// Should be: "paper": "Paperback", "ebook": "Ebook", "audio": "Audio" }

let fixed = content.replace(
  /"paper": "क"bandeau": \{\s*"paper": "Paperback",\s*"ebook": "Ebook",\s*"audio": "Audio"\s*\}/,
  '"bandeau": {\n      "paper": "Paperback",\n      "ebook": "Ebook",\n      "audio": "Audio"\n    }'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed corruption');