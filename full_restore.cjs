const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');

// Fix all corruptions of the form: "paper"bandeau": { -> "bandeau": {
let fixed = content.replace(/"paper"bandeau": \{\s*/g, '"bandeau": {\n      ');

// Fix the }nTitle -> },\n    "sectionTitle"
fixed = fixed.replace(/}nTitle":/g, '},\n    "sectionTitle":');

// Fix any }nIntro -> },\n    "sectionIntro"
fixed = fixed.replace(/}nIntro":/g, '},\n    "sectionIntro":');

// Fix any }nSeries -> },\n    "seriesPrefix"
fixed = fixed.replace(/}nSeries":/g, '},\n    "seriesPrefix":');

// Fix any }nHook -> },\n    "hook"
fixed = fixed.replace(/}nHook":/g, '},\n    "hook":');

// Fix any }nBenefits -> },\n    "benefits"
fixed = fixed.replace(/}nBenefits":/g, '},\n    "benefits":');

// Fix any }nMeta -> },\n    "metaSuffix"
fixed = fixed.replace(/}nMeta":/g, '},\n    "metaSuffix":');

// Fix any }nLanguagesLabel -> },\n    "languagesLabel"
fixed = fixed.replace(/}nLanguagesLabel":/g, '},\n    "languagesLabel":');

// Fix any }nLanguages -> },\n    "languages"
fixed = fixed.replace(/}nLanguages":/g, '},\n    "languages":');

// Fix any }nNewsletter -> },\n    "newsletter"
fixed = fixed.replace(/}nNewsletter":/g, '},\n    "newsletter":');

// Fix any }nTitle (newsletter) -> },\n    "title"
fixed = fixed.replace(/}nTitle":/g, '},\n    "title":');

// Fix any }nDescription -> },\n    "description"
fixed = fixed.replace(/}nDescription":/g, '},\n    "description":');

// Fix any }nPlaceholder -> },\n    "placeholder"
fixed = fixed.replace(/}nPlaceholder":/g, '},\n    "placeholder":');

// Fix any }nButtonText -> },\n    "buttonText"
fixed = fixed.replace(/}nButtonText":/g, '},\n    "buttonText":');

// Fix any }nTinyText -> },\n    "tinyText"
fixed = fixed.replace(/}nTinyText":/g, '},\n    "tinyText":');

// Fix any }nFaq -> },\n    "faq"
fixed = fixed.replace(/}nFaq":/g, '},\n    "faq":');

// Fix any }nItems -> },\n    "items"
fixed = fixed.replace(/}nItems":/g, '},\n    "items":');

// Fix any }nQuestion -> },\n    "question"
fixed = fixed.replace(/}nQuestion":/g, '},\n    "question":');

// Fix any }nAnswer -> },\n    "answer"
fixed = fixed.replace(/}nAnswer":/g, '},\n    "answer":');

// Fix any }nCta -> },\n    "cta"
fixed = fixed.replace(/}nCta":/g, '},\n    "cta":');

// Fix any }nText -> },\n    "text"
fixed = fixed.replace(/}nText":/g, '},\n    "text":');

// Fix any }nButtonHref -> },\n    "buttonHref"
fixed = fixed.replace(/}nButtonHref":/g, '},\n    "buttonHref":');

// Fix any }nFooter -> },\n    "footer"
fixed = fixed.replace(/}nFooter":/g, '},\n    "footer":');

// Fix any }nNav -> },\n    "nav"
fixed = fixed.replace(/}nNav":/g, '},\n    "nav":');

// Fix any }nSocial -> },\n    "social"
fixed = fixed.replace(/}nSocial":/g, '},\n    "social":');

// Fix any }nAvailability -> },\n    "availability"
fixed = fixed.replace(/}nAvailability":/g, '},\n    "availability":');

// Fix any }nCopyright -> },\n    "copyright"
fixed = fixed.replace(/}nCopyright":/g, '},\n    "copyright":');

// Fix any }nLang -> },\n    "lang"
fixed = fixed.replace(/}nLang":/g, '},\n    "lang":');

// Fix any }nDir -> },\n    "dir"
fixed = fixed.replace(/}nDir":/g, '},\n    "dir":');

// Fix any }nName -> },\n    "name"
fixed = fixed.replace(/}nName":/g, '},\n    "name":');

// Fix any }nMeta (meta) -> },\n    "meta"
fixed = fixed.replace(/}nMeta":/g, '},\n    "meta":');

// Fix any }nBookData -> },\n    "bookData"
fixed = fixed.replace(/}nBookData":/g, '},\n    "bookData":');

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', fixed);
console.log('Fixed all corruptions');