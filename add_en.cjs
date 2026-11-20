const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Add English translation
data.en = {
  "lang": "en",
  "dir": "ltr",
  "name": "English",
  "meta": {
    "title": "Christian books to strengthen your faith — Kiki en Christ",
    "description": "Four books for those seeking God beyond dogma. Paperback, ebook, and audio, in English and up to 9 languages. Ships in 3-5 days.",
    "ogTitle": "Christian books to strengthen your faith — Kiki en Christ",
    "ogDescription": "Four books for those seeking God beyond dogma. Paperback, ebook, and audio, in English and up to 9 languages. Ships in 3-5 days."
  },
  "hero": {
    "eyebrow": "New Release",
    "title": "Books for those seeking God beyond dogma",
    "subtitle": "Four independent books. Paperback, ebook, and audio. Available in 9 languages. Sign up to receive the free « 7 Prayers » guide.",
    "ctaText": "Discover the books",
    "ctaHref": "#books",
    "secondaryCtaText": "Get the free guide",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "Paperback",
    "ebook": "Ebook",
    "audio": "Audio"
  },
  "books": {
    "sectionTitle": "Four books to strengthen your faith",
    "sectionIntro": "Each book stands alone. Start with the one that calls you.",
    "seriesPrefix": "Book",
    "hook": "A book for those seeking God beyond dogma.",
    "benefits": [
      "A personal faith, without intermediaries",
      "Accessible to everyone, wherever you are",
      "30-day satisfaction guarantee"
    ],
    "metaSuffix": "pages",
    "languagesLabel": "9 languages available",
    "languages": [
      { "code": "fr", "name": "Français", "fmt": "Papier · Ebook · Audio" },
      { "code": "en", "name": "English", "fmt": "Paperback · Ebook · Audio" },
      { "code": "es", "name": "Español", "fmt": "Papel · Ebook · Audio" },
      { "code": "pt", "name": "Português", "fmt": "Papel · Ebook · Audio" },
      { "code": "de", "name": "Deutsch", "fmt": "Buch · Ebook · Audio" },
      { "code": "it", "name": "Italiano", "fmt": "Carta · Ebook · Audio" },
      { "code": "ru", "name": "Русский", "fmt": "Бумага · Ebook · Аудио" },
      { "code": "zh", "name": "中文", "fmt": "纸书 · 电子书 · 有声书" },
      { "code": "hi", "name": "हिन्दी", "fmt": "कागज़ · ईबुक · ऑडियो" }
    ]
  },
  "newsletter": {
    "title": "Receive « 7 Prayers » for free",
    "description": "A PDF guide to help you start praying, especially when you don't know where to begin.",
    "placeholder": "Your email",
    "buttonText": "I want the guide",
    "tinyText": "No spam. Unsubscribe in 1 click. Your data stays private."
  },
  "faq": {
    "title": "Frequently asked questions",
    "items": [
      {
        "question": "Are these books tied to a specific denomination?",
        "answer": "No. They speak to anyone seeking God beyond denominational labels."
      },
      {
        "question": "Can they be read in any order?",
        "answer": "Yes. Each book is self-contained. Start with the one that resonates with your current question."
      },
      {
        "question": "Are they available in paperback?",
        "answer": "Yes, paperbacks on Lulu. Ebooks on Payhip. Audio on Google Play. Links are on each book's page."
      },
      {
        "question": "Are translations faithful?",
        "answer": "Each version is reviewed by a native speaker. The theological meaning is preserved."
      }
    ]
  },
  "cta": {
    "text": "Ready to begin your journey? Choose the book that resonates — the first step changes everything.",
    "buttonText": "View all 4 books",
    "buttonHref": "#books"
  },
  "footer": {
    "nav": ["Home", "Books", "Newsletter", "FAQ", "Contact"],
    "social": ["Instagram", "Pinterest"],
    "availability": "Books available in paperback, ebook, and audio.",
    "copyright": "Kiki en Christ. All rights reserved."
  },
  "bookData": {
    "visage": {
      "name": "The Face of God: The Quest for Spirituality and Transcendence",
      "description": "A book for those seeking God beyond dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": [
        { "price": "13.99", "priceCurrency": "USD", "url": "https://www.lulu.com/shop/kiki-en-christ/the-face-of-god-the-quest-for-spirituality-and-transcendence/paperback/product-57g8e9g.html?srsltid=AfmBOoqg3HaEAZa8UckvdiXAxyD1onG2MVzgP3__w_DH8vgEkCi-HdaD&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/gps0X", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_The_Face_of_God_The_Quest_for_Spiri?id=AQAAAEAyeGA4QM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "trinite": {
      "name": "The Secrets of the Trinity Revealed: A Hard-Hitting Review",
      "description": "A book for those seeking God beyond dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "USD", "url": "https://www.lulu.com/shop/kiki-en-christ/the-secrets-of-the-trinity-revealed-a-hard-hitting-review/paperback/product-p2wk4p.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/5RCis", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_The_secrets_of_the_Trinity_revealed?id=AQAAAEBi7BisaM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "The Last Battle: Keeping the Faith",
      "description": "A book for those seeking God beyond dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "USD", "url": "https://www.lulu.com/shop/kiki-en-christ/the-last-battle-keeping-the-faith/paperback/product-kv9kyj8.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/URhyp", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_The_Last_Battle_Keeping_the_Faith?id=AQAAAEAy2ESYZM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "salut": {
      "name": "The Mystery of Salvation",
      "description": "A book for those seeking God beyond dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added English');