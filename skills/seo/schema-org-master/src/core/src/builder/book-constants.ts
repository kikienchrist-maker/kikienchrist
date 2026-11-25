// book-constants.ts — Constantes livres Kiki (schema-org-master)
// Données pré-remplies pour les 4 livres + hooks + benefits

import type { BookInput, KikiBookNumber } from '../types';

// ============================================================================
// DONNÉES LIVRES FR
// ============================================================================

/** Données pré-remplies pour les 4 livres Kiki (FR) */
export const KIKI_BOOKS_FR: Record<KikiBookNumber, Omit<BookInput, 'kikiBookNumber' | 'kikiHook' | 'kikiBenefits'>> = {
  1: {
    name: "Le visage de Dieu : la quête de la spiritualité et de la transcendance",
    isbn: "9791035977887",
    author: "Kiki en Christ",
    inLanguage: "fr",
    numberOfPages: 331,
    datePublished: "2023-05-18",
    description: "Une exploration profonde de la spiritualité et de la transcendance pour ceux qui cherchent Dieu au-delà des dogmes et des religions instituées.",
    image: "/images/books/visage-fr.jpg",
    publisher: { name: "Kiki en Christ", url: "https://kikienchrist.vercel.app" },
    offers: [
      { price: 13.90, priceCurrency: "EUR", availability: "InStock", seller: "Lulu", url: "https://www.lulu.com/fr/shop/kiki-en-christ/le-visage-de-dieu-la-quete-de-la-spiritualite-et-de-la-transcendance/paperback/product-z6gg2r.html" },
      { price: 3.99, priceCurrency: "USD", availability: "InStock", seller: "Payhip", url: "https://payhip.com/b/XnmIq" },
      { price: 5.49, priceCurrency: "USD", availability: "InStock", seller: "Google Play", url: "https://play.google.com/store/audiobooks/details?id=AQAAAECiySyJnM" },
    ],
  },
  2: {
    name: "Les secrets de la Trinité enfin dévoilés : une critique percutante",
    isbn: "9781445771212",
    author: "Kiki en Christ",
    inLanguage: "fr",
    numberOfPages: 214,
    datePublished: "2024-11-10",
    description: "Une analyse théologique audacieuse de la doctrine de la Trinité, ses origines historiques et ses implications pour la foi contemporaine.",
    image: "/images/books/trinite-fr.png",
    publisher: { name: "Kiki en Christ", url: "https://kikienchrist.vercel.app" },
    offers: [
      { price: 14.90, priceCurrency: "EUR", availability: "InStock", seller: "Lulu", url: "https://www.lulu.com/fr/shop/kiki-en-christ/les-secrets-de-la-trinite-enfin-devoiles-une-critique-percutante/paperback/product-nk9wg4.html" },
      { price: 4.99, priceCurrency: "USD", availability: "InStock", seller: "Payhip", url: "https://payhip.com/b/..." },
      { price: 6.49, priceCurrency: "USD", availability: "InStock", seller: "Google Play", url: "https://play.google.com/store/books/details/..." },
    ],
  },
  3: {
    name: "Le dernier Combat : garder la Foi",
    isbn: "9781326838447",
    author: "Kiki en Christ",
    inLanguage: "fr",
    numberOfPages: 85,
    datePublished: "2024-04-26",
    description: "Un guide spirituel pour traverser les épreuves et garder la foi vivante face aux tempêtes de la vie.",
    image: "/images/books/combat-fr.jpg",
    publisher: { name: "Kiki en Christ", url: "https://kikienchrist.vercel.app" },
    offers: [
      { price: 9.90, priceCurrency: "EUR", availability: "InStock", seller: "Lulu", url: "https://www.lulu.com/fr/shop/kiki-en-christ/le-dernier-combat-garder-la-foi/paperback/product-7kgm227.html" },
      { price: 2.99, priceCurrency: "USD", availability: "InStock", seller: "Payhip", url: "https://payhip.com/b/..." },
      { price: 4.49, priceCurrency: "USD", availability: "InStock", seller: "Google Play", url: "https://play.google.com/store/books/details/..." },
    ],
  },
  4: {
    name: "Le mystère du Salut",
    isbn: "9781326838447",
    author: "Kiki en Christ",
    inLanguage: "fr",
    numberOfPages: 214,
    datePublished: "2024-11-10",
    description: "Une méditation profonde sur le salut, la grâce et la rédemption à la lumière de l'Écriture.",
    image: "/images/books/salut-fr.jpg",
    publisher: { name: "Kiki en Christ", url: "https://kikienchrist.vercel.app" },
    offers: [
      { price: 12.90, priceCurrency: "EUR", availability: "InStock", seller: "Lulu", url: "https://www.lulu.com/fr/shop/kiki-en-christ/le-mystere-du-salut/paperback/product-nvg4d9k.html" },
      { price: 3.49, priceCurrency: "USD", availability: "InStock", seller: "Payhip", url: "https://payhip.com/b/..." },
      { price: 5.99, priceCurrency: "USD", availability: "InStock", seller: "Google Play", url: "https://play.google.com/store/books/details/..." },
    ],
  },
};

/** Hooks marketing par livre */
export const KIKI_BOOK_HOOKS: Record<KikiBookNumber, string> = {
  1: "Un livre pour ceux qui cherchent Dieu au-delà des dogmes.",
  2: "La vérité sur la Trinité que l'Église ne vous dit pas.",
  3: "Comment garder la foi quand tout s'effondre.",
  4: "Le salut n'est pas ce que vous croyez.",
};

/** Bénéfices par livre (3 par livre) */
export const KIKI_BOOK_BENEFITS: Record<KikiBookNumber, readonly [string, string, string]> = {
  1: [
    "Une foi personnelle, sans intermédiaire",
    "Accessible à tous, où que vous soyez",
    "Garantie satisfait ou remboursé 30 jours",
  ],
  2: [
    "Comprendre la Trinité sans jargon théologique",
    "Basé sur l'Écriture et l'histoire",
    "Libre de toute doctrine imposée",
  ],
  3: [
    "Force spirituelle dans l'adversité",
    "Outils concrets pour prier et méditer",
    "Communauté de soutien incluse",
  ],
  4: [
    "Vision claire du salut biblique",
    "Libération de la culpabilité religieuse",
    "Paix intérieure durable",
  ],
};