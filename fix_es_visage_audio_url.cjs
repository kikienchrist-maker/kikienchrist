const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix Spanish visage audio (Google Play) URL
const audioOffer = data.es.bookData.visage.offers.find(o => o.seller.name === 'Google Play');
if (audioOffer) {
  audioOffer.url = "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_El_rostro_de_Dios_la_b%C3%BAsqueda_de_la?id=AQAAAEAyeCA4AM";
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed Spanish visage audio URL');