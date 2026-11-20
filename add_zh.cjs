const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.zh = {
  "lang": "zh",
  "dir": "ltr",
  "name": "中文",
  "meta": {
    "title": "坚固信心的基督教书籍 — Kiki en Christ",
    "description": "为寻求超越教条之神的人而写的四本书。平装、电子书和有声书，提供中文及多达 9 种语言。3-5 天发货。",
    "ogTitle": "坚固信心的基督教书籍 — Kiki en Christ",
    "ogDescription": "为寻求超越教条之神的人而写的四本书。平装、电子书和有声书，提供中文及多达 9 种语言。3-5 天发货。"
  },
  "hero": {
    "eyebrow": "新书",
    "title": "为寻求超越教条之神的人而写的书",
    "subtitle": "四本独立的书。平装、电子书和有声书。提供 9 种语言。注册赠送 « 7 个祷告 » 指南。",
    "ctaText": "发现这些书",
    "ctaHref": "#shu",
    "secondaryCtaText": "免费获取指南",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "纸书",
    "ebook": "电子书",
    "audio": "有声书"
  },
  "books": {
    "sectionTitle": "四本书坚固你的信心",
    "sectionIntro": "每本书都是独立的。从呼唤你的那一本开始。",
    "seriesPrefix": "书",
    "hook": "为寻求超越教条之神的人而写的书。",
    "benefits": [
      "个人的信仰，无中介",
      "人人可得，无论身在何处",
      "30 天满意保证"
    ],
    "metaSuffix": "页",
    "languagesLabel": "提供 9 种语言",
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
    "title": "免费获取 « 7 个祷告 »",
    "description": "一份 PDF 指南，帮助你开始祷告，尤其是当你不知道从何开始时。",
    "placeholder": "你的邮箱",
    "buttonText": "我要指南",
    "tinyText": "无垃圾邮件。一键退订。你的隐私受保护。"
  },
  "faq": {
    "title": "常见问题",
    "items": [
      {
        "question": "这些书是否属于特定教派？",
        "answer": "不是。它们面向所有在教派标签之外寻求上帝的人。"
      },
      {
        "question": "可以按任何顺序阅读吗？",
        "answer": "可以。每本书都是独立的。从与你当下问题共鸣的那本开始。"
      },
      {
        "question": "有平装版吗？",
        "answer": "有，在 Lulu 平装。电子书在 Payhip。有声书在 Google Play。链接在每书页面。"
      },
      {
        "question": "翻译是否忠实？",
        "answer": "每个版本都经母语者审核。神学含义得以保留。"
      }
    ]
  },
  "cta": {
    "text": "准备好开始你的旅程？选择呼唤你的那本书 — 第一步改变一切。",
    "buttonText": "查看全部 4 本书",
    "buttonHref": "#shu"
  },
  "footer": {
    "nav": ["首页", "书籍", "通讯", "常见问题", "联系"],
    "social": ["Instagram", "Pinterest"],
    "availability": "书籍提供平装、电子书和有声书版本。",
    "copyright": "Kiki en Christ. 保留所有权利。"
  },
  "bookData": {
    "visage": {
      "name": "神的面容：对灵性与超越的追寻",
      "description": "为寻求超越教条之神的人而写的书。",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": []
    },
    "trinite": {
      "name": "三一奥秘终揭晓：深刻评析",
      "description": "为寻求超越教条之神的人而写的书。",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/8N2pQ", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "最后的争战：守住信心",
      "description": "为寻求超越教条之神的人而写的书。",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": []
    },
    "salut": {
      "name": "救恩的奥秘",
      "description": "为寻求超越教条之神的人而写的书。",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added Chinese');