const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.ru = {
  "lang": "ru",
  "dir": "ltr",
  "name": "Русский",
  "meta": {
    "title": "Христианские книги для укрепления вашей веры — Kiki en Christ",
    "description": "Четыре книги для тех, кто ищет Бога за пределами догм. Мягкая обложка, электронная книга и аудиокнига, на русском и до 9 языков. Доставка за 3-5 дней.",
    "ogTitle": "Христианские книги для укрепления вашей веры — Kiki en Christ",
    "ogDescription": "Четыре книги для тех, кто ищет Бога за пределами догм. Мягкая обложка, электронная книга и аудиокнига, на русском и до 9 языков. Доставка за 3-5 дней."
  },
  "hero": {
    "eyebrow": "Новинка",
    "title": "Книги для тех, кто ищет Бога за пределами догм",
    "subtitle": "Четыре независимые книги. Мягкая обложка, электронная книга и аудиокнига. Доступны на 9 языках. Зарегистрируйтесь, чтобы получить бесплатное руководство « 7 молитв ».",
    "ctaText": "Узнать о книгах",
    "ctaHref": "#knigi",
    "secondaryCtaText": "Получить руководство бесплатно",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "Бумага",
    "ebook": "Ebook",
    "audio": "Аудио"
  },
  "books": {
    "sectionTitle": "Четыре книги для укрепления вашей веры",
    "sectionIntro": "Каждая книга самостоятельна. Начните с той, что зовёт вас.",
    "seriesPrefix": "Книга",
    "hook": "Книга для тех, кто ищет Бога за пределами догм.",
    "benefits": [
      "Личная вера без посредников",
      "Доступна каждому, где бы вы ни были",
      "Гарантия возврата в течение 30 дней"
    ],
    "metaSuffix": "стр.",
    "languagesLabel": "9 языков доступно",
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
    "title": "Получите « 7 молитв » бесплатно",
    "description": "PDF-руководство, как начать молиться, особенно когда не знаете, с чего начать.",
    "placeholder": "Ваш email",
    "buttonText": "Хочу руководство",
    "tinyText": "Нет спама. Отписка в 1 клик. Ваши данные остаются приватными."
  },
  "faq": {
    "title": "Частые вопросы",
    "items": [
      {
        "question": "Эти книги привязаны к определённому исповеданию?",
        "answer": "Нет. Они адресованы всем, кто ищет Бога за пределами конфессиональных ярлыков."
      },
      {
        "question": "Можно ли читать их в любом порядке?",
        "answer": "Да. Каждая книга автономна. Начните с той, что откликается на ваш текущий вопрос."
      },
      {
        "question": "Есть ли они в мягкой обложке?",
        "answer": "Да, на Lulu. Электронные книги на Payhip. Аудиокниги на Google Play. Ссылки на каждой странице книги."
      },
      {
        "question": "Сохраняют ли переводы верность?",
        "answer": "Каждая версия проверена носителем языка. Богословский смысл сохранён."
      }
    ]
  },
  "cta": {
    "text": "Готовы начать свой путь? Выберите книгу, которая откликается — первый шаг меняет всё.",
    "buttonText": "Посмотреть все 4 книги",
    "buttonHref": "#knigi"
  },
  "footer": {
    "nav": ["Главная", "Книги", "Newsletter", "FAQ", "Контакты"],
    "social": ["Instagram", "Pinterest"],
    "availability": "Книги доступны в мягкой обложке, электронном и аудио формате.",
    "copyright": "Kiki en Christ. Все права защищены."
  },
  "bookData": {
    "visage": {
      "name": "Лик Бога: поиск духовности и трансцендентности",
      "description": "Книга для тех, кто ищет Бога за пределами догм.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": []
    },
    "trinite": {
      "name": "Тайны Троицы наконец раскрыты: пронзительный разбор",
      "description": "Книга для тех, кто ищет Бога за пределами догм.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/tainy-troitsy-nakonets-raskryty-pronizitelnyy-razbor/paperback/product-m4w9k2.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/8N2pQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "Последняя битва: сохранить веру",
      "description": "Книга для тех, кто ищет Бога за пределами догм.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": []
    },
    "salut": {
      "name": "Тайна спасения",
      "description": "Книга для тех, кто ищет Бога за пределами догм.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added Russian');