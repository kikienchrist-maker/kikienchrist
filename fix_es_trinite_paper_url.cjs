const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish trinite paper (Lulu) URL
const paperOffer = data.es.bookData.trinite.offers.find(o => o.seller.name === 'Lulu');
if (paperOffer) {
  paperOffer.url = "https://www.lulu.com/shop/kiki-en-christ/los-secretos-de-la-trinidad-revelados-al-fin-una-cr%C3%ADtica-contundente/paperback/product-kygr49.html?q=Kiki+en+Christ+&page=1&pageSize=4";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish trinite paper URL');