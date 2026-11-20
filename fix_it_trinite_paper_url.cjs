const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Italian trinite paper (Lulu) URL
const paperOffer = data.it.bookData.trinite.offers.find(o => o.seller.name === 'Lulu');
if (paperOffer) {
  paperOffer.url = "https://www.lulu.com/shop/kiki-en-christ/i-segreti-della-trinit%C3%A0-finalmente-svelati-una-critica-potente/paperback/product-5r5dp7.html?q=Kiki+en+Christ+&page=1&pageSize=4";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Italian trinite paper URL');