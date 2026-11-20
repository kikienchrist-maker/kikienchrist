const fs = require('fs');
const langs = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];

langs.forEach(lang => {
  const html = fs.readFileSync(`C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/${lang}/index.html`, 'utf8');
  const uiMatches = html.match(/href="https?:\/\/[^"]*(lulu|payhip|play\.google)[^"]*"/g);
  console.log(`\n=== ${lang.toUpperCase()} UI Purchase Links ===`);
  if (uiMatches) {
    uiMatches.forEach((m, i) => console.log(`${i+1}. ${m}`));
  } else {
    console.log('  (none)');
  }
  
  // Check JSON-LD offers
  const jsonldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonldMatch) {
    const json = jsonldMatch[1];
    const offerMatches = json.match(/"url":"https?:\/\/[^"]+"/g);
    console.log(`\n  JSON-LD Offers:`);
    if (offerMatches) {
      offerMatches.forEach((m, i) => console.log(`    ${i+1}. ${m}`));
    } else {
      console.log('    (none)');
    }
  }
});