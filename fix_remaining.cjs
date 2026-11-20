const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all corruptions of the form: }sectionKey -> },\n    "sectionKey"
const patterns = [
  { from: '}ectionTitle":', to: '},\n    "sectionTitle":' },
  { from: '}ectionIntro":', to: '},\n    "sectionIntro":' },
  { from: '}eriesPrefix":', to: '},\n    "seriesPrefix":' },
  { from: '}ook":', to: '},\n    "hook":' },
  { from: '}enefits":', to: '},\n    "benefits":' },
  { from: '}etaSuffix":', to: '},\n    "metaSuffix":' },
  { from: '}anguagesLabel":', to: '},\n    "languagesLabel":' },
  { from: '}anguages":', to: '},\n    "languages":' },
  { from: '}ewsletter":', to: '},\n    "newsletter":' },
  { from: '}escription":', to: '},\n    "description":' },
  { from: '}laceholder":', to: '},\n    "placeholder":' },
  { from: '}uttonText":', to: '},\n    "buttonText":' },
  { from: '}inyText":', to: '},\n    "tinyText":' },
  { from: '}aq":', to: '},\n    "faq":' },
  { from: '}tems":', to: '},\n    "items":' },
  { from: '}uestion":', to: '},\n    "question":' },
  { from: '}nswer":', to: '},\n    "answer":' },
  { from: '}ta":', to: '},\n    "cta":' },
  { from: '}ext":', to: '},\n    "text":' },
  { from: '}uttonHref":', to: '},\n    "buttonHref":' },
  { from: '}ooter":', to: '},\n    "footer":' },
  { from: '}av":', to: '},\n    "nav":' },
  { from: '}ocial":', to: '},\n    "social":' },
  { from: '}vailability":', to: '},\n    "availability":' },
  { from: '}opyright":', to: '},\n    "copyright":' },
  { from: '}ang":', to: '},\n    "lang":' },
  { from: '}ir":', to: '},\n    "dir":' },
  { from: '}ame":', to: '},\n    "name":' },
  { from: '}eta":', to: '},\n    "meta":' },
  { from: '}ookData":', to: '},\n    "bookData":' },
  { from: '}isage":', to: '},\n    "visage":' },
  { from: '}rinite":', to: '},\n    "trinite":' },
  { from: '}ombat":', to: '},\n    "combat":' },
  { from: '}alut":', to: '},\n    "salut":' },
  { from: '}overImage":', to: '},\n    "coverImage":' },
  { from: '}ffers":', to: '},\n    "offers":' },
  { from: '}rice":', to: '},\n    "price":' },
  { from: '}riceCurrency":', to: '},\n    "priceCurrency":' },
  { from: '}rl":', to: '},\n    "url":' },
  { from: '}eller":', to: '},\n    "seller":' },
  { from: '}vailability":', to: '},\n    "availability":' },
  { from: '}ame":', to: '},\n    "name":' },
  { from: '}ode":', to: '},\n    "code":' },
  { from: '}mt":', to: '},\n    "fmt":' },
];

let fixed = content;
patterns.forEach(p => {
  fixed = fixed.replace(new RegExp(p.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), p.to);
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed all remaining');