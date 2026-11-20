const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.it = {
  "lang": "it",
  "dir": "ltr",
  "name": "Italiano",
  "meta": {
    "title": "Libri cristiani per rafforzare la tua fede — Kiki en Christ",
    "description": "Quattro libri per chi cerca Dio oltre i dogmi. Brossura, ebook e audiolibro, in italiano e fino a 9 lingue. Spedizione in 3-5 giorni.",
    "ogTitle": "Libri cristiani per rafforzare la tua fede — Kiki en Christ",
    "ogDescription": "Quattro libri per chi cerca Dio oltre i dogmi. Brossura, ebook e audiolibro, in italiano e fino a 9 lingue. Spedizione in 3-5 giorni."
  },
  "hero": {
    "eyebrow": "Novità",
    "title": "Libri per chi cerca Dio oltre i dogmi",
    "subtitle": "Quattro libri indipendenti. Brossura, ebook e audiolibro. Disponibili in 9 lingue. Iscriviti per ricevere la guida gratis « 7 preghiere ».",
    "ctaText": "Scopri i libri",
    "ctaHref": "#libri",
    "secondaryCtaText": "Ottieni la guida gratis",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "Carta",
    "ebook": "Ebook",
    "audio": "Audio"
  },
  "books": {
    "sectionTitle": "Quattro opere per rafforzare la tua fede",
    "sectionIntro": "Ogni libro basta a se stesso. Inizia con quello che ti chiama.",
    "seriesPrefix": "Libro",
    "hook": "Un libro per chi cerca Dio oltre i dogmi.",
    "benefits": [
      "Una fede personale, senza intermediari",
      "Accessibile a tutti, ovunque tu sia",
      "Garanzia soddisfatti o rimborsati 30 giorni"
    ],
    "metaSuffix": "pagine",
    "languagesLabel": "9 lingue disponibili",
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
    "title": "Ricevi « 7 preghiere » gratis",
    "description": "Una guida PDF per iniziare a pregare, soprattutto quando non sai da dove cominciare.",
    "placeholder": "La tua email",
    "buttonText": "Voglio la guida",
    "tinyText": "Niente spam. Disiscrizione in 1 clic. I tuoi dati restano privati."
  },
  "faq": {
    "title": "Domande frequenti",
    "items": [
      {
        "question": "Questi libri sono legati a una confessione specifica?",
        "answer": "No. Si rivolgono a chiunque cerchi Dio oltre le etichette confessionali."
      },
      {
        "question": "Possono essere letti in qualsiasi ordine?",
        "answer": "Sì. Ogni opera è autonoma. Inizia con quella che risuona con la tua domanda attuale."
      },
      {
        "question": "Esistono in brossura?",
        "answer": "Sì, su Lulu. Ebook su Payhip. Audiolibri su Google Play. I link sono in ogni scheda."
      },
      {
        "question": "Le traduzioni sono fedeli?",
        "answer": "Ogni versione è rivista da un madrelingua. Il senso teologico è preservato."
      }
    ]
  },
  "cta": {
    "text": "Pronto a iniziare il tuo cammino? Scegli il libro che risuona — il primo passo cambia tutto.",
    "buttonText": "Vedi i 4 libri",
    "buttonHref": "#libri"
  },
  "footer": {
    "nav": ["Home", "Libri", "Newsletter", "FAQ", "Contatto"],
    "social": ["Instagram", "Pinterest"],
    "availability": "Libri disponibili in brossura, ebook e audiolibro.",
    "copyright": "Kiki en Christ. Tutti i diritti riservati."
  },
  "bookData": {
    "visage": {
      "name": "Il volto di Dio: la ricerca della spiritualità e della trascendenza",
      "description": "Un libro per chi cerca Dio oltre i dogmi.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": []
    },
    "trinite": {
      "name": "I segreti della Trinità finalmente svelati: una critica incisiva",
      "description": "Un libro per chi cerca Dio oltre i dogmi.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/i-segreti-della-trinita-finalmente-svelati-una-critica-incisiva/paperback/product-m4w9k2.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/8N2pQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "L'ultima battaglia: mantenere la fede",
      "description": "Un libro per chi cerca Dio oltre i dogmi.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": []
    },
    "salut": {
      "name": "Il mistero della Salvezza",
      "description": "Un libro per chi cerca Dio oltre i dogmi.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added Italian');