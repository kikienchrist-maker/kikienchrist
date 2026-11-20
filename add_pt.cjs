const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.pt = {
  "lang": "pt",
  "dir": "ltr",
  "name": "Português",
  "meta": {
    "title": "Livros cristãos para fortalecer a sua fé — Kiki en Christ",
    "description": "Quatro livros para quem busca a Deus além do dogma. Capa comum, ebook e áudio, em português e até 9 idiomas. Envio em 3-5 dias.",
    "ogTitle": "Livros cristãos para fortalecer a sua fé — Kiki en Christ",
    "ogDescription": "Quatro livros para quem busca a Deus além do dogma. Capa comum, ebook e áudio, em português e até 9 idiomas. Envio em 3-5 dias."
  },
  "hero": {
    "eyebrow": "Novidade",
    "title": "Livros para quem busca a Deus além do dogma",
    "subtitle": "Quatro livros independentes. Capa comum, ebook e áudio. Disponíveis em 9 idiomas. Inscreva-se para receber o guia grátis « 7 orações ».",
    "ctaText": "Descobrir os livros",
    "ctaHref": "#livros",
    "secondaryCtaText": "Obter o guia grátis",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "Papel",
    "ebook": "Ebook",
    "audio": "Audio"
  },
  "books": {
    "sectionTitle": "Quatro obras para fortalecer a sua fé",
    "sectionIntro": "Cada livro basta por si mesmo. Comece pelo que o chama.",
    "seriesPrefix": "Livro",
    "hook": "Um livro para quem busca a Deus além do dogma.",
    "benefits": [
      "Uma fé pessoal, sem intermediários",
      "Acessível a todos, onde quer que esteja",
      "Garantia de satisfação 30 dias"
    ],
    "metaSuffix": "páginas",
    "languagesLabel": "9 idiomas disponíveis",
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
    "title": "Receba « 7 orações » grátis",
    "description": "Um guia PDF para começar a orar, especialmente quando não sabe por onde começar.",
    "placeholder": "Seu email",
    "buttonText": "Quero o guia",
    "tinyText": "Sem spam. Cancelar em 1 clique. Seus dados ficam privados."
  },
  "faq": {
    "title": "Perguntas frequentes",
    "items": [
      {
        "question": "Estes livros estão ligados a uma confissão específica?",
        "answer": "Não. Dirigem-se a quem busca a Deus além de rótulos confessionais."
      },
      {
        "question": "Podem ser lidos em qualquer ordem?",
        "answer": "Sim. Cada obra é autónoma. Comece pela que ressoa com a sua questão actual."
      },
      {
        "question": "Existem em capa comum?",
        "answer": "Sim, na Lulu. Ebooks na Payhip. Áudio no Google Play. Links em cada ficha."
      },
      {
        "question": "As traduções são fiéis?",
        "answer": "Cada versão é revista por um nativo. O sentido teológico é preservado."
      }
    ]
  },
  "cta": {
    "text": "Pronto para começar o seu caminho? Escolha o livro que ressoa — o primeiro passo muda tudo.",
    "buttonText": "Ver os 4 livros",
    "buttonHref": "#livros"
  },
  "footer": {
    "nav": ["Início", "Livros", "Newsletter", "FAQ", "Contacto"],
    "social": ["Instagram", "Pinterest"],
    "availability": "Livros disponíveis em papel, ebook e áudio.",
    "copyright": "Kiki en Christ. Todos os direitos reservados."
  },
  "bookData": {
    "visage": {
      "name": "O rosto de Deus: a busca pela espiritualidade e transcendência",
      "description": "Um livro para quem busca a Deus além do dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": [
        { "price": "12.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/o-rosto-de-deus-a-busca-pela-espiritualidade-e-transcendencia/paperback/product-g8k7nj.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/4J5kL", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_O_rosto_de_Deus?id=AQAAAECiySyJnM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "trinite": {
      "name": "Os segredos da Trindade enfim revelados: uma crítica contundente",
      "description": "Um livro para quem busca a Deus além do dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/os-segredos-da-trindade-enfim-revelados-uma-critica-contundente/paperback/product-m4w9k2.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/8N2pQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_Os_segredos_da_Trindade?id=AQAAAEBi8HWwBM", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "A última batalha: manter a fé",
      "description": "Um livro para quem busca a Deus além do dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": [
        { "price": "9.99", "priceCurrency": "EUR", "url": "https://www.lulu.com/shop/kiki-en-christ/a-ultima-batalha-manter-a-fe/paperback/product-7kgm227.html?q=Kiki+en+Christ+&page=1&pageSize=4", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/cxuzQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_A_ultima_batalha?id=AQAAAEAy2ESYZM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "salut": {
      "name": "O mistério da Salvação",
      "description": "Um livro para quem busca a Deus além do dogma.",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added Portuguese');