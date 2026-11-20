const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix missing commas after bandeau objects
// Pattern: }\n    "books" -> },\n    "books"
let fixed = content.replace(/}\n    "books":/g, '},\n    "books":');
fixed = fixed.replace(/}\n    "newsletter":/g, '},\n    "newsletter":');
fixed = fixed.replace(/}\n    "faq":/g, '},\n    "faq":');
fixed = fixed.replace(/}\n    "cta":/g, '},\n    "cta":');
fixed = fixed.replace(/}\n    "footer":/g, '},\n    "footer":');
fixed = fixed.replace(/}\n    "bookData":/g, '},\n    "bookData":');
fixed = fixed.replace(/}\n    "meta":/g, '},\n    "meta":');
fixed = fixed.replace(/}\n    "lang":/g, '},\n    "lang":');
fixed = fixed.replace(/}\n    "dir":/g, '},\n    "dir":');
fixed = fixed.replace(/}\n    "name":/g, '},\n    "name":');

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed commas');