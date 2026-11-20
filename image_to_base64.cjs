const fs = require('fs');
const path = 'C:/Users/Admin/Desktop/COUVERTURES/VISAGE DE DIEU/EN/frontcover.jpg.jpg';

const buffer = fs.readFileSync(path);
const base64 = buffer.toString('base64');
const mimeType = 'image/jpeg';
const dataUri = `data:${mimeType};base64,${base64}`;

// Save to file for easy copy-paste
fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/cover_base64.txt', dataUri);

console.log('Base64 length:', base64.length);
console.log('Data URI saved to cover_base64.txt');
console.log('First 100 chars:', dataUri.substring(0, 100));