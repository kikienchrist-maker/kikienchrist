const fs = require('fs');
const hi = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/hi/index.html', 'utf8');
const jsonldMatch = hi.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonldMatch) {
  const json = jsonldMatch[1];
  const salutIdx = json.indexOf('उद्धार का रहस्य');
  console.log(json.slice(salutIdx, salutIdx + 500));
}