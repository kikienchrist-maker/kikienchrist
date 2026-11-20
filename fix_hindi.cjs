const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const idx = content.indexOf('अंतिम युद्ध');
const section = content.slice(idx, idx+600);
const newSection = section.replace(
  '"offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/cxuzQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details?id=AQAAAEAy2ESYZM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]',
  '"offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/mva21", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_%E0%A4%86%E0%A4%96_%E0%A4%B0_%E0%A4%B2%E0%A4%A1_%E0%A4%88_%E0%A4%B5_%E0%A4%B5_%E0%A4%B5_%E0%A4%B8_%E0%A4%B0%E0%A4%95%E0%A4%B8%E0%A4%A8?id=AQAAAEAy_FO8cM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]'
);
fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', content.replace(section, newSection));
console.log('Done');