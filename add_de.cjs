const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.de = {
  "lang": "de",
  "dir": "ltr",
  "name": "Deutsch",
  "meta": {
    "title": "Christliche Bücher für Ihren Glauben — Kiki en Christ",
    "description": "Vier Bücher für diejenigen, die Gott jenseits von Dogmen suchen. Taschenbuch, E-Book und Hörbuch, auf Deutsch und in bis zu 9 Sprachen. Versand in 3-5 Tagen.",
    "ogTitle": "Christliche Bücher für Ihren Glauben — Kiki en Christ",
    "ogDescription": "Vier Bücher für diejenigen, die Gott jenseits von Dogmen suchen. Taschenbuch, E-Book und Hörbuch, auf Deutsch und in bis zu 9 Sprachen. Versand in 3-5 Tagen."
  },
  "hero": {
    "eyebrow": "Neuerscheinung",
    "title": "Bücher für diejenigen, die Gott jenseits von Dogmen suchen",
    "subtitle": "Vier unabhängige Bücher. Taschenbuch, E-Book und Hörbuch. Erhältlich in 9 Sprachen. Registrieren Sie sich für den kostenlosen « 7 Gebete »-Leitfaden.",
    "ctaText": "Bücher entdecken",
    "ctaHref": "#bücher",
    "secondaryCtaText": "Kostenlosen Leitfaden erhalten",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "Buch",
    "ebook": "Ebook",
    "audio": "Audio"
  },
  "books": {
    "sectionTitle": "Vier Bücher, um Ihren Glauben zu stärken",
    "sectionIntro": "Jedes Buch steht für sich. Beginnen Sie mit dem, das Sie anspricht.",
    "seriesPrefix": "Buch",
    "hook": "Ein Buch für diejenigen, die Gott jenseits von Dogmen suchen.",
    "benefits": [
      "Ein persönlicher Glaube, ohne Vermittler",
      "Für jeden zugänglich, wo immer Sie sind",
      "30-Tage-Zufriedenheitsgarantie"
    ],
    "metaSuffix": "Seiten",
    "languagesLabel": "9 Sprachen verfügbar",
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
    "title": "Erhalten Sie « 7 Gebete » kostenlos",
    "description": "Ein PDF-Leitfaden, um das Beten zu lernen, besonders wenn Sie nicht wissen, wo Sie anfangen sollen.",
    "placeholder": "Ihre E-Mail",
    "buttonText": "Ich möchte den Leitfaden",
    "tinyText": "Kein Spam. Abmeldung mit 1 Klick. Ihre Daten bleiben privat."
  },
  "faq": {
    "title": "Häufige Fragen",
    "items": [
      {
        "question": "Sind diese Bücher an eine bestimmte Konfession gebunden?",
        "answer": "Nein. Sie sprechen jeden an, der Gott jenseits konfessioneller Etiketten sucht."
      },
      {
        "question": "Können sie in beliebiger Reihenfolge gelesen werden?",
        "answer": "Ja. Jedes Buch ist in sich abgeschlossen. Beginnen Sie mit dem, das Ihre aktuelle Frage berührt."
      },
      {
        "question": "Gibt es sie als Taschenbuch?",
        "answer": "Ja, als Taschenbuch bei Lulu. E-Books bei Payhip. Hörbücher bei Google Play. Links auf jeder Buchseite."
      },
      {
        "question": "Sind die Übersetzungen getreu?",
        "answer": "Jede Version wird von einem Muttersprachler geprüft. Die theologische Bedeutung bleibt erhalten."
      }
    ]
  },
  "cta": {
    "text": "Bereit, Ihren Weg zu beginnen? Wählen Sie das Buch, das Sie anspricht — der erste Schritt verändert alles.",
    "buttonText": "Alle 4 Bücher ansehen",
    "buttonHref": "#bücher"
  },
  "footer": {
    "nav": ["Start", "Bücher", "Newsletter", "FAQ", "Kontakt"],
    "social": ["Instagram", "Pinterest"],
    "availability": "Bücher erhältlich als Taschenbuch, E-Book und Hörbuch.",
    "copyright": "Kiki en Christ. Alle Rechte vorbehalten."
  },
  "bookData": {
    "visage": {
      "name": "Das Antlitz Gottes: die Suche nach Spiritualität und Transzendenz",
      "description": "Ein Buch für diejenigen, die Gott jenseits von Dogmen suchen.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": [
        { "price": "13.90", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/das-antlitz-gottes-die-suche-nach-spiritualitaet-und-transzendenz/paperback/product-g8k7nj.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/4J5kL", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_Das_Antlitz_Gottes?id=AQAAAECiySyJnM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "trinite": {
      "name": "Die Geheimnisse der Dreifaltigkeit endlich enthüllt: eine schonungslose Analyse",
      "description": "Ein Buch für diejenigen, die Gott jenseits von Dogmen suchen.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/die-geheimnisse-der-dreifaltigkeit-endlich-enthuellt-eine-schoenungslose-analyse/paperback/product-m4w9k2.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/8N2pQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_Die_Geheimnisse_der_Dreifaltigkeit?id=AQAAAEBi8HWwBM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "Der letzte Kampf: den Glauben bewahren",
      "description": "Ein Buch für diejenigen, die Gott jenseits von Dogmen suchen.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/der-letzte-kampf-den-glauben-bewahren/paperback/product-7kgm227.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/cxuzQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_Der_letzte_Kampf?id=AQAAAEAy2ESYZM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "salut": {
      "name": "Das Geheimnis der Erlösung",
      "description": "Ein Buch für diejenigen, die Gott jenseits von Dogmen suchen.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added German');