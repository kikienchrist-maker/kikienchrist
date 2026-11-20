const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Russian trinite paper (Lulu) URL
const paperOffer = data.ru.bookData.trinite.offers.find(o => o.seller.name === 'Lulu');
if (paperOffer) {
  paperOffer.url = "https://www.lulu.com/shop/kiki-en-christ/%D1%82%D0%B0%D0%B9%D0%BD%D1%8B-%D1%82%D1%80%D0%BE%D0%B8%D1%86%D1%8B-%D0%BD%D0%B0%D0%BA%D0%BE%D0%BD%D0%B5%D1%86-%D1%82%D0%BE-%D0%BF%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D0%BB-%D0%BD%D0%B5%D0%BB%D0%B8%D1%86%D0%B5%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%BD%D0%B0%D1%8F-%D0%BA%D1%80%D0%B8%D1%82%D0%B8%D0%BA%D0%B0/paperback/product-574gnv2.html?q=kiki+en+christ+&page=1&pageSize=4";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Russian trinite paper URL');