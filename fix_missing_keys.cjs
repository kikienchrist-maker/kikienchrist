const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// The pattern: }\n      "Value",\n      "sectionIntro":
// Should be: },\n      "sectionTitle": "Value",\n      "sectionIntro":

// Fix for each language's books section
const fixes = [
  // After bandeau, the next key should be sectionTitle
  { pattern: /}\n      "([^"]+)",\n      "sectionIntro":/g, replacement: '},\n      "sectionTitle": "$1",\n      "sectionIntro":' },
  { pattern: /}\n      "([^"]+)",\n      "seriesPrefix":/g, replacement: '},\n      "sectionTitle": "$1",\n      "seriesPrefix":' },
  { pattern: /}\n      "([^"]+)",\n      "hook":/g, replacement: '},\n      "sectionTitle": "$1",\n      "hook":' },
];

let fixed = content;
fixes.forEach(f => {
  fixed = fixed.replace(f.pattern, f.replacement);
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed missing sectionTitle keys');