const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English combat audio URL
data.en.bookData.combat.offers.find(o => o.seller.name === 'Google Play').url = 
  "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_The_Last_Battle_Keeping_the_Faith?id=AQAAAEAyOGx4TM&hl=en_CA";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed English combat audio URL');