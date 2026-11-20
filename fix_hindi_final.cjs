const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Find and replace Hindi combat offers - using the exact current text
let newContent = content.replace(
  '"offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/cxuzQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details?id=AQAAAEAy2ESYZM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]\n      },\n      "salut":',
  '"offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/mva21", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_%E0%A4%86%E0%A4%96_%E0%A4%B0_%E0%A4%B2%E0%A4%A1_%E0%A4%88_%E0%A4%B5_%E0%A4%B5_%E0%A4%B5_%E0%A4%B8_%E0%A4%B0%E0%A4%95%E0%A4%B8%E0%A4%A8?id=AQAAAEAy_FO8cM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]\n      },\n      "salut":'
);

// Fix Hindi Book 4 (Salut) - empty offers
newContent = newContent.replace(
  '"offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/jXRqE", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details?id=AQAAAEByGxlbeM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]\n      }\n    }',
  '"offers": []\n      }\n    }'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', newContent);
console.log('Done');