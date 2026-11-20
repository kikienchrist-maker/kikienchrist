const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish combat ebook (Payhip) URL
const ebookOffer = data.es.bookData.combat.offers.find(o => o.seller.name === 'Payhip');
if (ebookOffer) {
  ebookOffer.url = "https://payhip.com/b/7zUWJ";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish combat ebook URL');