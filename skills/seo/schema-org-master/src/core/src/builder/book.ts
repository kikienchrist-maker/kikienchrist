// book.ts — BookBuilder Specialized (schema-org-master)
// Builder dédié aux livres avec helpers métier Kiki en Christ

import { SchemaOrg } from './base';
import { KIKI_BOOK_HOOKS, KIKI_BOOK_BENEFITS } from './book-constants';
import type {
  KikiBook,
  BookInput,
  OfferInput,
  PersonInput,
  OrganizationInput,
  AggregateRatingInput,
  ReviewInput,
  KikiBookNumber,
  KikiLangCode,
  KikiBookFormat,
  KikiSeller,
} from '../types';

// ============================================================================
// BOOK BUILDER — API spécialisée pour livres Kiki en Christ
// ============================================================================

/**
 * Crée un BookBuilder pré-configuré pour Kiki en Christ
 * @param input Données minimales du livre
 * @returns BookBuilder chainable
 *
 * @example
 * ```typescript
 * const book = createKikiBook({
 *   name: "Le visage de Dieu",
 *   isbn: "9791035977887",
 *   author: "Kiki en Christ",
 *   inLanguage: "fr",
 *   numberOfPages: 331,
 *   datePublished: "2023-05-18",
 *   description: "Quête de spiritualité...",
 *   image: "/images/books/visage-fr.jpg",
 *   publisher: { name: "Kiki en Christ", url: "https://kikienchrist.vercel.app" },
 *   offers: [
 *     { price: 13.90, priceCurrency: "EUR", availability: "InStock", seller: "Lulu", url: "..." },
 *     { price: 3.99, priceCurrency: "USD", availability: "InStock", seller: "Payhip", url: "..." },
 *   ],
 *   kikiBookNumber: 1,
 *   kikiHook: "Un livre pour ceux qui cherchent Dieu au-delà des dogmes.",
 *   kikiBenefits: ["Foi personnelle", "Accessible partout", "Garantie 30 jours"],
 * });
 * ```
 */
export function createKikiBook(input: BookInput): ReturnType<typeof SchemaOrg.book> {
  const { kikiBookNumber, kikiHook, kikiBenefits, publisher, offers, author, ...bookData } = input;

  // Construire les offres avec extensions Kiki
  const offersWithKiki = offers.map((offer, idx) => {
    const format = inferFormatFromSeller(offer.seller);
    return {
      ...offer,
      seller: typeof offer.seller === 'string'
        ? { '@type': 'Organization', name: offer.seller }
        : { '@type': 'Organization', ...offer.seller },
      kikiSeller: offer.seller as KikiSeller,
      kikiFormat: format,
      kikiBookNumber,
    };
  });

  return SchemaOrg.book({
    '@type': 'Book',
    ...bookData,
    author: typeof author === 'string'
      ? { '@type': 'Person', name: author }
      : { '@type': 'Person', ...author },
    publisher: { '@type': 'Organization', ...publisher },
    offers: offersWithKiki,
    // Extensions Kiki
    kikiSeries: 'Kiki en Christ',
    kikiBookNumber,
    kikiHook,
    kikiBenefits,
    kikiAvailableFormats: offersWithKiki.map(o => o.kikiFormat),
    kikiPrices: Object.fromEntries(
      offersWithKiki.map(o => [o.kikiFormat, { amount: o.price, currency: o.priceCurrency }])
    ),
  });
}

/**
 * Infère le format livre depuis le vendeur
 */
function inferFormatFromSeller(seller: string | OrganizationInput): KikiBookFormat {
  const name = typeof seller === 'string' ? seller : seller.name;
  switch (name) {
    case 'Lulu': return 'Paperback';
    case 'Payhip': return 'EBook';
    case 'Google Play': return 'Audiobook';
    default: return 'Paperback';
  }
}

// ============================================================================
// HELPERS SPÉCIFIQUES LIVRES KIKI
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

/**
 * Génère les 4 livres complets d'un coup (pour sitemap, page livres, etc.)
 */
export function generateAllKikiBooks(lang: KikiLangCode = 'fr'): ReturnType<typeof SchemaOrg.book>[] {
  return (Object.keys(KIKI_BOOKS_FR) as KikiBookNumber[]).map(num => {
    const base = KIKI_BOOKS_FR[num];
    return createKikiBook({
      ...base,
      kikiBookNumber: num,
      kikiHook: KIKI_BOOK_HOOKS[num],
      kikiBenefits: KIKI_BOOK_BENEFITS[num],
    });
  });
}

// Ré-exporter les constantes (déjà exportées depuis index.ts)
// export { KIKI_BOOKS_FR, KIKI_BOOK_HOOKS, KIKI_BOOK_BENEFITS } from './book-constants';

// ============================================================================
// BOOK SERIES / COLLECTION SCHEMA
// ============================================================================

/**
 * Génère le schema pour la série complète "Kiki en Christ"
 * @returns ItemList avec les 4 livres
 */
export function createKikiBookSeries(): ReturnType<typeof SchemaOrg.breadcrumb> {
  // Note: ItemListBuilder pas encore créé, on utilise SchemaOrg.breadcrumb comme base
  // TODO: Créer ItemListBuilder dédié
  return SchemaOrg.breadcrumb({
    '@type': 'ItemList',
    name: "Collection Kiki en Christ",
    description: "4 livres pour une foi personnelle, libre et profonde",
    numberOfItems: 4,
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@type': 'Book', name: KIKI_BOOKS_FR[1].name, '@id': `https://kikienchrist.vercel.app/#Book/isbn/${KIKI_BOOKS_FR[1].isbn}` } },
      { '@type': 'ListItem', position: 2, item: { '@type': 'Book', name: KIKI_BOOKS_FR[2].name, '@id': `https://kikienchrist.vercel.app/#Book/isbn/${KIKI_BOOKS_FR[2].isbn}` } },
      { '@type': 'ListItem', position: 3, item: { '@type': 'Book', name: KIKI_BOOKS_FR[3].name, '@id': `https://kikienchrist.vercel.app/#Book/isbn/${KIKI_BOOKS_FR[3].isbn}` } },
      { '@type': 'ListItem', position: 4, item: { '@type': 'Book', name: KIKI_BOOKS_FR[4].name, '@id': `https://kikienchrist.vercel.app/#Book/isbn/${KIKI_BOOKS_FR[4].isbn}` } },
    ],
  });
}

// ============================================================================
// MULTILINGUE — Génération par langue
// ============================================================================

/**
 * Génère un livre dans une langue donnée (nécessite données traduites)
 * TODO: Intégrer avec blog-translation skill pour données réelles
 */
export function createKikiBookForLang(
  bookNumber: KikiBookNumber,
  lang: KikiLangCode,
  translatedData: Partial<BookInput>
): ReturnType<typeof SchemaOrg.book> {
  const base = KIKI_BOOKS_FR[bookNumber];

  // Pour l'instant, fallback FR si pas de traduction
  // À remplacer par vraies données traduites
  return createKikiBook({
    ...base,
    ...translatedData,
    inLanguage: lang,
    kikiBookNumber: bookNumber,
    kikiHook: KIKI_BOOK_HOOKS[bookNumber],
    kikiBenefits: KIKI_BOOK_BENEFITS[bookNumber],
  });
}