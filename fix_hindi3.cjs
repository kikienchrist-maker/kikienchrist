const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix Hindi Book 3 (Combat) - update offers
let newContent = content.replace(
  '"combat": {\n        "name": "अंतिम युद्ध: विश्वास को बनाए रखना",\n        "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",\n        "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",\n        "offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/cxuzQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details?id=AQAAAEAy2ESYZM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]\n      },',
  '"combat": {\n        "name": "अंतिम युद्ध: विश्वास को बनाए रखना",\n        "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",\n        "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",\n        "offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/mva21", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_%E0%A4%86%E0%A4%96_%E0%A4%B0_%E0%A4%B2%E0%A4%A1_%E0%A4%88_%E0%A4%B5_%E0%A4%B5_%E0%A4%B5_%E0%A4%B8_%E0%A4%B0%E0%A4%95%E0%A4%B8%E0%A4%A8?id=AQAAAEAy_FO8cM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]\n      },'
);

// Fix Hindi Book 4 (Salut) - empty offers
newContent = newContent.replace(
  '"salut": {\n        "name": "उद्धार का रहस्य",\n        "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",\n        "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",\n        "offers": [\n          { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/jXRqE", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },\n          { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details?id=AQAAAEByGxlbeM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }\n        ]\n      }',
  '"salut": {\n        "name": "उद्धार का रहस्य",\n        "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",\n        "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",\n        "offers": []\n      }'
);

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', newContent);
console.log('Done');