const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all cases where a string value is followed directly by a key (missing comma)
// Pattern: "  \n      "key":
let fixed = content.replace(
  /"\n      "(\w+)":/g,
  '",\n      "$1":'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed missing commas between key-value pairs');