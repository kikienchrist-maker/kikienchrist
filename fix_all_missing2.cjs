const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all cases: }"Value",\n      "key": OR }"Value",\n      "key": (with or without newline)
// Pattern: }"([^"]+)",\s*"(sectionIntro|seriesPrefix|hook)":
let fixed = content.replace(
  /}"([^"]+)",\s*"(sectionIntro|seriesPrefix|hook)":/g,
  '},\n      "sectionTitle": "$1",\n      "$2":'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed all missing sectionTitle v2');