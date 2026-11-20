const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Portuguese visage paper (Lulu) URL
const paperOffer = data.pt.bookData.visage.offers.find(o => o.seller.name === 'Lulu');
if (paperOffer) {
  paperOffer.url = "https://www.lulu.com/shop/kiki-en-christ/a-face-de-deus-a-busca-pela-espiritualidade-e-transcend%C3%AAncia/paperback/product-rme76r2.html?q=kiki+en+christ+&page=1&pageSize=4";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Portuguese visage paper URL');