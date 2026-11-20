const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix German combat audio (Google Play) URL
const audioOffer = data.de.bookData.combat.offers.find(o => o.seller.name === 'Google Play');
if (audioOffer) {
  audioOffer.url = "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_Die_letzte_Schlacht_Den_Glauben_bew?id=AQAAAEAyPCV8BM&hl=en_CA";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed German combat audio URL');