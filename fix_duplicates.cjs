const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Strategy: Keep only the last (correct) bandeau for each language, remove the first (corrupted) one
// The pattern: each language has two bandeau entries, we want to keep the second one

let fixed = content;

// For each language, remove the first corrupted bandeau
// We'll do this by finding the pattern of double bandeau and removing the first one

// fr: only one bandeau (correct) - keep
// en: two bandeau at 11327 and 11346 - remove first (11327-11346)
// es: two at 20489 and 20508 - remove first
// de: two at 30021 and 30082 - remove first
// pt: two at 39564 and 39664 - remove first
// it: two at 48837 and 48973 - remove first
// ru: two at 56479 and 56653 - remove first
// zh: two at 63821 and 64050 - remove first
// hi: two at 69371 and 69630 - remove first

// Better approach: parse as JSON after fixing the duplicate keys
// But JSON.parse fails due to duplicate keys. Let's do string surgery.

// Find all bandeau positions
const positions = [];
let idx = 0;
while (true) {
  idx = content.indexOf('"bandeau":', idx);
  if (idx === -1) break;
  positions.push(idx);
  idx += 10;
}

console.log('Bandeau positions:', positions);
console.log('Count:', positions.length);

// The correct ones are at odd indices (1, 3, 5, 7, 9, 11, 13, 15, 17 in 1-based = 0, 2, 4, 6, 8, 10, 12, 14, 16 in 0-based)
// Wait, let's check: #1=0, #2=1, #3=2, #4=3, #5=4...
// Correct ones: 0, 2, 4, 6, 8, 10, 12, 14, 16 (even indices)
// Corrupted ones: 1, 3, 5, 7, 9, 11, 13, 15 (odd indices)

// For each corrupted one, remove from its start to the start of the next correct one
let result = content;
let removed = 0;

// Process in reverse order to not mess up indices
for (let i = positions.length - 2; i >= 1; i -= 2) {
  const start = positions[i] - removed;
  const end = positions[i + 1] - removed;
  
  // Find the actual start of the corrupted bandeau (might have preceding comma/newline)
  let actualStart = start;
  while (actualStart > 0 && (result[actualStart - 1] === '\n' || result[actualStart - 1] === ' ' || result[actualStart - 1] === ',')) {
    actualStart--;
  }
  
  // Find the end - should be right before the next bandeau
  // The corrupted bandeau ends with },\n    "sectionTitle" or similar
  // But it's merged. Let's find the closing } of the corrupted object
  let braceCount = 0;
  let actualEnd = start;
  let foundFirstBrace = false;
  for (let j = start; j < end; j++) {
    if (result[j] === '{') {
      braceCount++;
      foundFirstBrace = true;
    } else if (result[j] === '}') {
      braceCount--;
      if (foundFirstBrace && braceCount === 0) {
        actualEnd = j + 1;
        // Include trailing comma and whitespace
        while (actualEnd < result.length && (result[actualEnd] === ',' || result[actualEnd] === '\n' || result[actualEnd] === ' ' || result[actualEnd] === '\t')) {
          actualEnd++;
        }
        break;
      }
    }
  }
  
  console.log(`Removing corrupted bandeau ${i}: ${actualStart} to ${actualEnd}`);
  result = result.slice(0, actualStart) + result.slice(actualEnd);
  removed += actualEnd - actualStart;
}

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', result);
console.log('Done removing corrupted bandeaus');