const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

const langs = ['fr', 'en', 'es', 'pt', 'de', 'it', 'ru', 'zh', 'hi'];
langs.forEach(lang => {
  const idx = content.indexOf(`"${lang}":`);
  if (idx >= 0) {
    const section = content.slice(idx, idx + 400);
    const bandeauIdx = section.indexOf('"bandeau":');
    if (bandeauIdx >= 0) {
      console.log(`=== ${lang} ===`);
      console.log(section.slice(bandeauIdx, bandeauIdx + 150));
      console.log();
    }
  }
});