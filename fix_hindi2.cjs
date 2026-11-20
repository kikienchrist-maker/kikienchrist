const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const idx = content.indexOf('उद्धार का रहस्य');
const section = content.slice(idx, idx+500);
const newSection = section.replace(
  '"offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/jXRqE", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details?id=AQAAAEByGxlbeM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]',
  '"offers": []'
);
fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', content.replace(section, newSection));
console.log('Done');