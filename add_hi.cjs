const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

data.hi = {
  "lang": "hi",
  "dir": "ltr",
  "name": "हिन्दी",
  "meta": {
    "title": "आपके विश्वास को मजबूत करने के लिए ईसाई किताबें — Kiki en Christ",
    "description": "उन लोगों के लिए चार किताबें जो सिद्धांतों से परे परमेश्वर को खोजते हैं। पेपरबैक, ईबुक और ऑडियोबुक, हिन्दी में और 9 भाषाओं तक। 3-5 दिनों में डिलीवरी।",
    "ogTitle": "आपके विश्वास को मजबूत करने के लिए ईसाई किताबें — Kiki en Christ",
    "ogDescription": "उन लोगों के लिए चार किताबें जो सिद्धांतों से परे परमेश्वर को खोजते हैं। पेपरबैक, ईबुक और ऑडियोबुक, हिन्दी में और 9 भाषाओं तक। 3-5 दिनों में डिलीवरी।"
  },
  "hero": {
    "eyebrow": "नई किताब",
    "title": "उन लोगों के लिए किताबें जो सिद्धांतों से परे परमेश्वर को खोजते हैं",
    "subtitle": "चार स्वतंत्र किताबें। पेपरबैक, ईबुक और ऑडियोबुक। 9 भाषाओं में उपलब्ध। मुफ्त « 7 प्रार्थनाएँ » गाइड पाने के लिए रजिस्टर करें।",
    "ctaText": "किताबें खोजें",
    "ctaHref": "#kitabein",
    "secondaryCtaText": "मुफ्त गाइड प्राप्त करें",
    "secondaryCtaHref": "#newsletter"
  },
  "bandeau": {
    "paper": "कागज़",
    "ebook": "ईबुक",
    "audio": "ऑडियो"
  },
  "books": {
    "sectionTitle": "आपके विश्वास को मजबूत करने के लिए चार किताबें",
    "sectionIntro": "हर किताब अपने आप में पूरी है। उसे चुनें जो आपको बुलाती है।",
    "seriesPrefix": "किताब",
    "hook": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",
    "benefits": [
      "व्यक्तिगत विश्वास, बिना मध्यस्थ के",
      "सभी के लिए सुलभ, जहाँ भी आप हों",
      "30 दिन की संतुष्टि गारंटी"
    ],
    "metaSuffix": "पृष्ठ",
    "languagesLabel": "9 भाषाएँ उपलब्ध",
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
    "title": "मुफ्त में « 7 प्रार्थनाएँ » प्राप्त करें",
    "description": "प्रार्थना शुरू करने में मदद के लिए एक PDF गाइड, खासकर जब आप नहीं जानते कि कहाँ से शुरू करें।",
    "placeholder": "आपका ईमेल",
    "buttonText": "मुझे गाइड चाहिए",
    "tinyText": "कोई स्पैम नहीं। एक क्लिक में अनसब्सक्राइब। आपका डेटा निजी रहता है।"
  },
  "faq": {
    "title": "अक्सर पूछे जाने वाले प्रश्न",
    "items": [
      {
        "question": "क्या ये किताबें किसी विशेष संप्रदाय से जुड़ी हैं?",
        "answer": "नहीं। वे उन सभी लोगों के लिए हैं जो संप्रदायिक लेबल से परे परमेश्वर को खोजते हैं।"
      },
      {
        "question": "क्या इन्हें किसी भी क्रम में पढ़ा जा सकता है?",
        "answer": "हाँ। हर किताब स्वतंत्र है। उस किताब से शुरू करें जो आपके वर्तमान प्रश्न से मेल खाती है।"
      },
      {
        "question": "क्या ये पेपरबैक में उपलब्ध हैं?",
        "answer": "हाँ, लुलु पर पेपरबैक। पेहिप पर ईबुक। गूगल प्ले पर ऑडियोबुक। लिंक हर किताब के पेज पर हैं।"
      },
      {
        "question": "क्या अनुवाद वफादार हैं?",
        "answer": "हर संस्करण की समीक्षा एक मूल वक्ता द्वारा की गई है। धार्मिक अर्थ संरक्षित है।"
      }
    ]
  },
  "cta": {
    "text": "अपनी यात्रा शुरू करने के लिए तैयार हैं? वह किताब चुनें जो आपको बुलाती है — पहला कदम सब कुछ बदल देता है।",
    "buttonText": "सभी 4 किताबें देखें",
    "buttonHref": "#kitabein"
  },
  "footer": {
    "nav": ["होम", "किताबें", "न्यूज़लेटर", "FAQ", "संपर्क"],
    "social": ["Instagram", "Pinterest"],
    "availability": "किताबें पेपरबैक, ईबुक और ऑडियोबुक में उपलब्ध।",
    "copyright": "Kiki en Christ. सर्वाधिकार सुरक्षित।"
  },
  "bookData": {
    "visage": {
      "name": "परमेश्वर का चेहरा: आध्यात्मिकता और पारमार्थिकता की खोज",
      "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg",
      "offers": []
    },
    "trinite": {
      "name": "त्रिएकता के रहस्य अंततः प्रकट: एक तीखी आलोचना",
      "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg",
      "offers": [
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/GgHdc", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_%E0%A4%9F_%E0%A4%B0_%E0%A4%A8_%E0%A4%9F_%E0%A4%95_%E0%A4%B0%E0%A4%B9%E0%A4%B8_%E0%A4%AF_%E0%A4%85_%E0%A4%A4%E0%A4%A4_%E0%A4%AA_%E0%A4%B0%E0%A4%95%E0%A4%9F_%E0%A4%B9_%E0%A4%8F_%E0%A4%8F%E0%A4%95_%E0%A4%B6?id=AQAAAEAyZmomSM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "combat": {
      "name": "अंतिम युद्ध: विश्वास को बनाए रखना",
      "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg",
      "offers": [
        { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/mva21", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
        { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/store/audiobooks/details/KIKI_EN_CHRIST_%E0%A4%86%E0%A4%96_%E0%A4%B0_%E0%A4%B2%E0%A4%A1_%E0%A4%88_%E0%A4%B5_%E0%A4%B5_%E0%A4%B5_%E0%A4%B8_%E0%A4%B0%E0%A4%95%E0%A4%B8%E0%A4%A8?id=AQAAAEAy_FO8cM&hl=en_CA", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
      ]
    },
    "salut": {
      "name": "उद्धार का रहस्य",
      "description": "उन लोगों के लिए एक किताब जो सिद्धांतों से परे परमेश्वर को खोजते हैं।",
      "coverImage": "https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg",
      "offers": []
    }
  }
};

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Added Hindi');