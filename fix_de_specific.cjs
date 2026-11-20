const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix German: }Glauben -> },\n      "sectionTitle": "Glauben
let fixed = content.replace(
  '}Glauben zu stärken",\n      "sectionIntro":',
  '},\n      "sectionTitle": "Glauben zu stärken",\n      "sectionIntro":'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed German');