const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

let idx = 0;
let count = 0;
while (true) {
  idx = content.indexOf('"bandeau":', idx);
  if (idx === -1) break;
  count++;
  console.log(`=== Bandeau #${count} at ${idx} ===`);
  console.log(content.slice(idx, idx + 150));
  console.log();
  idx += 10;
}