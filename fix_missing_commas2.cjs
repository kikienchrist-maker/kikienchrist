const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all cases: "  "key": -> ", "key":
let fixed = content.replace(
  /"\s*"(\w+)":/g,
  '",\n      "$1":'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed missing commas v2');