const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.es = {
  "lang": "es",
  "dir": "ltr",
  "name": "Español",
  "meta": {
    "title": "Libros cristianos para fortalecer tu fe — Kiki en Christ",
    "description": "Cuatro libros para quienes buscan a Dios más allá del dogma. Tapa blanda, ebook y audio, en español y hasta 9 idiomas. Envío en 3-5 días.",
    "ogTitle": "Libros cristianos para fortalecer tu fe — Kiki en Christ",
    "ogDescription": "Cuatro libros para quienes buscan a Dios más allá del dogma. Tapa blanda, ebook y audio, en español y hasta 9 idiomas. Envío en 3-5 días."
  },
  "hero": {
    "eyebrow": "Novedad",
    "title": "Libros para quienes buscan a Dios más allá del dogma",
    "subtitle": "Cuatro libros independientes. Tapa blanda, ebook y audio. Disponibles en 9 idiomas. Regístrate para recibir la guía gratis « 7 oraciones ».",
    "ctaText": "Descubrir los libros",
    "ctaHref": "#libros",
    "secondaryCtaText": "Obtener la guía gratis",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "Papel",
    "ebook": "Ebook",
    "audio": "Audio"
  },
  "books": {
    "sectionTitle": "Cuatro obras para fortalecer tu fe",
    "sectionIntro": "Cada libro basta por sí mismo. Empieza por el que te llama.",
    "seriesPrefix": "Libro",
    "hook": "Un libro para quienes buscan a Dios más allá del dogma.",
    "benefits": [
      "Una fe personal, sin intermediarios",
      "Accesible para todos, estés donde estés",
      "Garantía de satisfacción 30 días"
    ],
    "metaSuffix": "páginas",
    "languagesLabel": "9 idiomas disponibles",
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
    "title": "Recibe « 7 oraciones » gratis",
    "description": "Una guía PDF para iniciarte en la oración, especialmente cuando no sabes por dónde empezar.",
    "placeholder": "Tu email",
    "buttonText": "Quiero la guía",
    "tinyText": "Sin spam. Baja en 1 clic. Tus datos quedan privados."
  },
  "faq": {
    "title": "Preguntas frecuentes",
    "items": [
      {
        "question": "¿Estos libros están ligados a una confesión concreta?",
        "answer": "No. Se dirigen a cualquiera que busque a Dios más allá de etiquetas confesionales."
      },
      {
        "question": "¿Pueden leerse en cualquier orden?",
        "answer": "Sí. Cada obra es autónoma. Empieza por la que resuene con tu pregunta actual."
      },
      {
        "question": "¿Existen en tapa blanda?",
        "answer": "Sí, en Lulu. Ebooks en Payhip. Audio en Google Play. Los enlaces están en cada ficha."
      },
      {
        "question": "¿Son fieles las traducciones?",
        "answer": "Cada versión es revisada por un nativo. Se preserva el sentido teológico."
      }
    ]
  },
  "cta": {
    "text": "¿Listo para empezar tu camino? Elige el libro que resuene — el primer paso lo cambia todo.",
    "buttonText": "Ver los 4 libros",
    "buttonHref": "#libros"
  },
  "footer": {
    "nav": ["Inicio", "Libros", "Newsletter", "FAQ", "Contacto"],
    "social": ["Instagram", "Pinterest"],
    "availability": "Libros disponibles en papel, ebook y audio.",
    "copyright": "Kiki en Christ. Todos los derechos reservados."
  },
  "bookData": {
    "visage": {
      "name": "El rostro de Dios: la búsqueda de la espiritualidad y la trascendencia",
      "description": "Un libro para quienes buscan a Dios más allá del dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": [
        { "price": "12.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/el-rostro-de-dios-la-busqueda-de-la-espiritualidad-y-la-trascendencia/paperback/product-g8k7nj.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/4J5kL", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_El_rostro_de_Dios?id=AQAAAECiySyJnM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "trinite": {
      "name": "Los secretos de la Trinidad por fin revelados: una crítica contundente",
      "description": "Un libro para quienes buscan a Dios más allá del dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/los-secretos-de-la-trinidad-por-fin-revelados-una-critica-contundente/paperback/product-m4w9k2.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/8N2pQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_Los_secretos_de_la_Trinidad?id=AQAAAEBi8HWwBM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "La última batalla: mantener la fe",
      "description": "Un libro para quienes buscan a Dios más allá del dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/la-ultima-batalla-mantener-la-fe/paperback/product-7kgm227.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/cxuzQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_La_ultima_batalla?id=AQAAAEAy2ESYZM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "salut": {
      "name": "El misterio de la Salvación",
      "description": "Un libro para quienes buscan a Dios más allá del dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added Spanish');