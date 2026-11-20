const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', 'utf8');
const data = JSON.parse(content);

// Update bandeau cover images for all 9 languages to match their respective book covers
const updates = {
  fr: {
    visage: "https://i.ibb.co/C3QMY5g5/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/HT0VRnk5/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/hRgzNs32/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"  // Using combat as placeholder for salut
  },
  en: {
    visage: "https://i.ibb.co/C3QMY5g5/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/HT0VRnk5/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/hRgzNs32/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  es: {
    visage: "https://i.ibb.co/C3QMY5g5/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/HT0VRnk5/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/hRgzNs32/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  de: {
    visage: "https://i.ibb.co/chCbYZLy/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/DDQpYQD4/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  pt: {
    visage: "https://i.ibb.co/C3QMY5g5/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/HT0VRnk5/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/hRgzNs32/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  it: {
    visage: "https://i.ibb.co/C3QMY5g5/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/HT0VRnk5/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/hRgzNs32/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  ru: {
    visage: "https://i.ibb.co/chCbYZLy/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/DDQpYQD4/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  zh: {
    visage: "https://i.ibb.co/spDxjH4h/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/G4mdTkrG/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/TDzmmTB7/FOI-sans-criture.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  },
  hi: {
    visage: "https://i.ibb.co/d4q7KfNC/Design-sans-titre-1-1.png",
    trinite: "https://i.ibb.co/JWRnXz34/frontcover-jpg.jpg",
    combat: "https://i.ibb.co/pvf26vZZ/frontcover-jpg.jpg",
    salut: "https://i.ibb.co/cS2dLK83/FOI-sans-criture.jpg"
  }
};

Object.keys(data).forEach(lang => {
  if (updates[lang] && data[lang].bookData) {
    data[lang].bookData.visage.coverImage = updates[lang].visage;
    data[lang].bookData.trinite.coverImage = updates[lang].trinite;
    data[lang].bookData.combat.coverImage = updates[lang].combat;
    data[lang].bookData.salut.coverImage = updates[lang].salut;
  }
});

fs.writeFileSync('C:/Users/Admin/Desktop/kikienchrist-vercel-sync/src/data/translations.json', JSON.stringify(data, null, 2));
console.log('Fixed bandeau cover images for all 9 languages');