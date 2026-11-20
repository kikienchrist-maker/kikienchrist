const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix Chinese: }"30 天满意保证" -> },\n      "benefits": [\n        "30 天满意保证"
let fixed = content.replace(
  '}"30 天满意保证"',
  '},\n      "benefits": [\n        "30 天满意保证"'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed Chinese benefits');