const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix German trinite ebook (Payhip) URL
const ebookOffer = data.de.bookData.trinite.offers.find(o => o.seller.name === 'Payhip');
if (ebookOffer) {
  ebookOffer.url = "https://payhip.com/b/a4OrP";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed German trinite ebook URL');