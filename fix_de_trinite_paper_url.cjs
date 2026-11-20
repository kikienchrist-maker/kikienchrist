const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix German trinite paper (Lulu) URL
const paperOffer = data.de.bookData.trinite.offers.find(o => o.seller.name === 'Lulu');
if (paperOffer) {
  paperOffer.url = "https://www.lulu.com/shop/kiki-en-christ/die-geheimnisse-der-dreifaltigkeit-endlich-enth%C3%BCllt-eine-eindringliche-kritik/paperback/product-7424g6.html?q=Kiki+en+Christ+&page=1&pageSize=4";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed German trinite paper URL');