const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix Italian: }Inizia -> },\n      "sectionTitle": "Inizia
let fixed = content.replace(
  '}Inizia con quello che ti chiama.",\n      "seriesPrefix":',
  '},\n      "sectionTitle": "Inizia con quello che ti chiama.",\n      "seriesPrefix":'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed Italian');