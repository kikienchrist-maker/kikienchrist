const fs = require('fs');
const hi = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/dist/hi/index.html', 'utf8');
const jsonldMatch = hi.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonldMatch) {
  console.log(jsonldMatch[1].slice(0, 3000));
}