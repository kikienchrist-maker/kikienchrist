const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all cases where }"key" should be },\n    "key"
let fixed = content.replace(/}"books":/g, '},\n    "books":');
fixed = fixed.replace(/}"newsletter":/g, '},\n    "newsletter":');
fixed = fixed.replace(/}"faq":/g, '},\n    "faq":');
fixed = fixed.replace(/}"cta":/g, '},\n    "cta":');
fixed = fixed.replace(/}"footer":/g, '},\n    "footer":');
fixed = fixed.replace(/}"bookData":/g, '},\n    "bookData":');
fixed = fixed.replace(/}"meta":/g, '},\n    "meta":');
fixed = fixed.replace(/}"lang":/g, '},\n    "lang":');
fixed = fixed.replace(/}"dir":/g, '},\n    "dir":');
fixed = fixed.replace(/}"name":/g, '},\n    "name":');

// Also fix the reverse: "key":{ where previous was }
fixed = fixed.replace(/}"bandeau":/g, '},\n    "bandeau":');

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed bytes');