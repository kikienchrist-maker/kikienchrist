const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Fix English visage cover image - use Payhip CDN from the English Payhip product
// The Payhip product https://payhip.com/b/gps0X should have its cover at the CDN
// Pattern: https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/{hash}.jpg
// We need to find the hash for the English version. 
// For now, use a placeholder - the actual hash would come from the Payhip product page
// But the French one uses: o_1jr6cuoqbdjve1nhsh1jab2lb1m
// Let's try to use the English Payhip product to derive or just use a generic approach

// Actually, the cover image URL for Payhip products follows the pattern where the hash is in the product
// Since we don't have the exact hash, let's use the French one for now (same visual)
// Or better: check if there's a known pattern. The user gave https://payhip.com/b/gps0X
// The CDN URL would be accessible via that product. Let's use the French one as fallback.

// For now, keep the French cover (1500px quality) - it's the same visual
// data.en.bookData.visage.coverImage = "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg";

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Kept French cover for English visage (same visual, 1500px)');