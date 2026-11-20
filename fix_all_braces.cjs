const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all cases where }"key" should be },\n    "key"
// Use regex to find }" followed by word chars and "
let fixed = content.replace(/}"(\w+)":/g, '},\n    "$1":');

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed all }"key" patterns');