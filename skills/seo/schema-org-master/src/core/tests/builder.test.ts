// builder.test.ts — Unit Tests for Builders (schema-org-master)
import { describe, it, expect } from 'vitest';
import { SchemaOrg, createKikiBook, KIKI_BOOKS_FR, KIKI_BOOK_HOOKS, KIKI_BOOK_BENEFITS } from '../src/index';

describe('BaseBuilder — Fluent Immutable API', () => {
  it('should create Book with required fields', () => {
    const book = SchemaOrg.book({
      '@type': 'Book',
      name: 'Test Book',
      isbn: '9781234567897',
      author: { name: 'Author', '@type': 'Person' },
      inLanguage: 'fr',
      numberOfPages: 100,
      datePublished: '2024-01-01',
    }).build();

    expect(book['@type']).toBe('Book');
    expect(book.name).toBe('Test Book');
    expect(book.isbn).toBe('9781234567897');
    expect(book['@id']).toBeDefined();
    expect(book['@id']).toContain('isbn/9781234567897');
  });

  it('should be immutable — clone returns new instance', () => {
    const builder1 = SchemaOrg.book({ '@type': 'Book', name: 'Book 1' });
    const builder2 = builder1.name('Book 2');

    expect(builder1.state.data.name).toBe('Book 1');
    expect(builder2.state.data.name).toBe('Book 2');
    expect(builder1).not.toBe(builder2);
  });

  it('should chain multiple methods', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Base' })
      .isbn('9781234567897')
      .author({ name: 'Author', '@type': 'Person' })
      .inLanguage('en')
      .numberOfPages(200)
      .datePublished('2024-01-01')
      .description('A test book')
      .build();

    expect(book.name).toBe('Base');
    expect(book.isbn).toBe('9781234567897');
    expect(book.author).toEqual({ name: 'Author', '@type': 'Person' });
    expect(book.inLanguage).toBe('en');
    expect(book.numberOfPages).toBe(200);
    expect(book.description).toBe('A test book');
  });

  it('should generate @id from name if no isbn/url/sku', () => {
    const book = SchemaOrg.book({
      '@type': 'Book',
      name: 'Unique Book Title',
      author: { name: 'Author', '@type': 'Person' },
      inLanguage: 'fr',
      numberOfPages: 100,
      datePublished: '2024-01-01',
    }).build();

    expect(book['@id']).toContain('name/');
    expect(book['@id']).toContain('Unique%20Book%20Title');
  });

  it('should generate @id from URL if provided', () => {
    const book = SchemaOrg.book({
      '@type': 'Book',
      name: 'Test',
      author: { name: 'A', '@type': 'Person' },
      inLanguage: 'fr',
      numberOfPages: 1,
      datePublished: '2024-01-01',
      url: 'https://example.com/book',
    }).build();

    expect(book['@id']).toContain('url/');
  });
});

describe('BookBuilder — Specialized Methods', () => {
  it('should set author as string (auto-wrap Person)', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .author('John Doe')
      .build();

    expect(book.author).toEqual({ '@type': 'Person', name: 'John Doe' });
  });

  it('should set publisher with Organization', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .publisher({ name: 'My Pub', url: 'https://pub.com' })
      .build();

    expect(book.publisher).toEqual({ '@type': 'Organization', name: 'My Pub', url: 'https://pub.com' });
  });

  it('should set offers array with Offer extensions', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .offers([
        { price: 10, priceCurrency: 'EUR', availability: 'InStock', seller: 'Lulu', url: 'https://lulu.com' },
        { price: 5, priceCurrency: 'USD', availability: 'InStock', seller: 'Payhip', url: 'https://payhip.com' },
      ])
      .build();

    expect(book.offers).toHaveLength(2);
    expect(book.offers![0]).toMatchObject({ price: 10, priceCurrency: 'EUR', '@type': 'Offer' });
    expect(book.offers![1]).toMatchObject({ price: 5, priceCurrency: 'USD', '@type': 'Offer' });
  });

  it('should set aggregateRating', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .aggregateRating({ ratingValue: 4.5, reviewCount: 100 })
      .build();

    expect(book.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      reviewCount: 100,
    });
  });

  it('should set review array', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .review([
        { author: { name: 'Reviewer' }, reviewBody: 'Great!', reviewRating: { ratingValue: 5 }, datePublished: '2024-06-01' },
      ])
      .build();

    expect(book.review).toHaveLength(1);
    expect(book.review![0].reviewBody).toBe('Great!');
  });

  it('should set Kiki extensions', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .kikiSeries('Kiki en Christ')
      .kikiBookNumber(1)
      .kikiHook('Test hook')
      .kikiBenefits(['Benefit 1', 'Benefit 2', 'Benefit 3'] as any)
      .build();

    expect(book.kikiSeries).toBe('Kiki en Christ');
    expect(book.kikiBookNumber).toBe(1);
    expect(book.kikiHook).toBe('Test hook');
    expect(book.kikiBenefits).toEqual(['Benefit 1', 'Benefit 2', 'Benefit 3']);
  });
});

describe('createKikiBook — Factory Helper', () => {
  it('should generate complete Kiki book with all fields', () => {
    const book = createKikiBook({
      ...KIKI_BOOKS_FR[1],
      kikiBookNumber: 1,
      kikiHook: KIKI_BOOK_HOOKS[1],
      kikiBenefits: KIKI_BOOK_BENEFITS[1],
    }).build();

    expect(book['@type']).toBe('Book');
    expect(book.name).toContain('visage de Dieu');
    expect(book.isbn).toBe('9791035977887');
    expect(book.author).toEqual({ '@type': 'Person', name: 'Kiki en Christ' });
    expect(book.publisher).toEqual({ '@type': 'Organization', name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app' });
    expect(book.offers).toHaveLength(3);
    expect(book.kikiBookNumber).toBe(1);
    expect(book.kikiHook).toBe('Un livre pour ceux qui cherchent Dieu au-delà des dogmes.');
    expect(book.kikiBenefits).toHaveLength(3);
    expect(book.kikiAvailableFormats).toEqual(['Paperback', 'EBook', 'Audiobook']);
    expect(book.kikiPrices).toHaveProperty('Paperback');
    expect(book.kikiPrices).toHaveProperty('EBook');
    expect(book.kikiPrices).toHaveProperty('Audiobook');
  });

  it('should infer kikiFormat from seller', () => {
    const book = createKikiBook({
      ...KIKI_BOOKS_FR[1],
      kikiBookNumber: 1,
      kikiHook: KIKI_BOOK_HOOKS[1],
      kikiBenefits: KIKI_BOOK_BENEFITS[1],
    }).build();

    const luluOffer = book.offers!.find((o: any) => o.kikiSeller === 'Lulu');
    const payhipOffer = book.offers!.find((o: any) => o.kikiSeller === 'Payhip');
    const googleOffer = book.offers!.find((o: any) => o.kikiSeller === 'Google Play');

    expect(luluOffer?.kikiFormat).toBe('Paperback');
    expect(payhipOffer?.kikiFormat).toBe('EBook');
    expect(googleOffer?.kikiFormat).toBe('Audiobook');
  });

  it('should generate all 4 books', () => {
    const books = Object.keys(KIKI_BOOKS_FR).map(k => createKikiBook({
      ...KIKI_BOOKS_FR[k as keyof typeof KIKI_BOOKS_FR],
      kikiBookNumber: parseInt(k) as 1|2|3|4,
      kikiHook: KIKI_BOOK_HOOKS[parseInt(k) as 1|2|3|4],
      kikiBenefits: KIKI_BOOK_BENEFITS[parseInt(k) as 1|2|3|4],
    }).build());

    expect(books).toHaveLength(4);
    expect(books[0].kikiBookNumber).toBe(1);
    expect(books[1].kikiBookNumber).toBe(2);
    expect(books[2].kikiBookNumber).toBe(3);
    expect(books[3].kikiBookNumber).toBe(4);
  });
});

describe('ProductBuilder', () => {
  it('should create Product with Kiki extensions', () => {
    const product = SchemaOrg.product({ '@type': 'Product', name: 'Book 1 Paperback' })
      .sku('BOOK1-PB')
      .gtin13('9791035977887')
      .brand('Kiki en Christ')
      .category('Books')
      .offers([{ price: 13.90, priceCurrency: 'EUR', availability: 'InStock', seller: 'Lulu' }])
      .kikiBookRef(1)
      .kikiFormat('Paperback')
      .kikiSeller('Lulu')
      .build();

    expect(product['@type']).toBe('Product');
    expect(product.sku).toBe('BOOK1-PB');
    expect(product.gtin13).toBe('9791035977887');
    expect(product.brand).toEqual({ '@type': 'Brand', name: 'Kiki en Christ' });
    expect(product.kikiBookRef).toBe(1);
    expect(product.kikiFormat).toBe('Paperback');
    expect(product.kikiSeller).toBe('Lulu');
  });
});

describe('OrganizationBuilder', () => {
  it('should create Organization with Kiki extensions', () => {
    const org = SchemaOrg.organization({ '@type': 'Organization', name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app' })
      .logo('https://kikienchrist.vercel.app/logo.png')
      .sameAs(['https://twitter.com/kikienchrist'])
      .email('kikienchrist@gmail.com')
      .contactPoint({ telephone: '+33123456789', contactType: 'customer service' })
      .kikiFounder('Kiki en Christ')
      .kikiMission('Foi personnelle libre')
      .kikiBooksCount(4)
      .kikiLanguagesCount(11)
      .kikiContactEmail('kikienchrist@gmail.com')
      .build();

    expect(org['@type']).toBe('Organization');
    expect(org.kikiFounder).toBe('Kiki en Christ');
    expect(org.kikiMission).toBe('Foi personnelle libre');
    expect(org.kikiBooksCount).toBe(4);
    expect(org.kikiLanguagesCount).toBe(11);
    expect(org.kikiContactEmail).toBe('kikienchrist@gmail.com');
  });
});

describe('WebSiteBuilder', () => {
  it('should create WebSite with search action', () => {
    const ws = SchemaOrg.website({ '@type': 'WebSite', name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app' })
      .potentialAction({
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://kikienchrist.vercel.app/search?q={search_term_string}' },
        queryInput: 'required name=search_term_string',
      })
      .kikiSupportedLanguages(['fr', 'en', 'es'])
      .kikiDefaultLanguage('fr')
      .build();

    expect(ws['@type']).toBe('WebSite');
    expect(ws.potentialAction).toBeDefined();
    expect(ws.kikiSupportedLanguages).toEqual(['fr', 'en', 'es']);
    expect(ws.kikiDefaultLanguage).toBe('fr');
  });
});

describe('FAQPageBuilder', () => {
  it('should create FAQPage with addQuestion chain', () => {
    const faq = SchemaOrg.faq({ '@type': 'FAQPage' })
      .addQuestion('Q1?', 'A1')
      .addQuestion('Q2?', 'A2')
      .kikiSource('legal')
      .kikiDetectedQuestions(2)
      .build();

    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(2);
    expect(faq.mainEntity[0].name).toBe('Q1?');
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('A1');
    expect(faq.kikiSource).toBe('legal');
    expect(faq.kikiDetectedQuestions).toBe(2);
  });
});

describe('ArticleBuilder', () => {
  it('should create Article with Kiki extensions', () => {
    const article = SchemaOrg.article({ '@type': 'Article', headline: 'Test Article', inLanguage: 'fr' })
      .author('Author Name')
      .datePublished('2024-01-01')
      .dateModified('2024-01-02')
      .publisher({ name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app' })
      .kikiCategory('spiritualité')
      .kikiTags(['foi', 'dieu'])
      .kikiReadingTimeMinutes(5)
      .build();

    expect(article['@type']).toBe('Article');
    expect(article.headline).toBe('Test Article');
    expect(article.author).toEqual({ '@type': 'Person', name: 'Author Name' });
    expect(article.kikiCategory).toBe('spiritualité');
    expect(article.kikiTags).toEqual(['foi', 'dieu']);
    expect(article.kikiReadingTimeMinutes).toBe(5);
  });
});

describe('OfferBuilder', () => {
  it('should create Offer with availability URL', () => {
    const offer = SchemaOrg.offer({ '@type': 'Offer', price: 10, priceCurrency: 'EUR' })
      .availability('InStock')
      .seller('Lulu')
      .url('https://lulu.com/book')
      .kikiSeller('Lulu')
      .kikiFormat('Paperback')
      .kikiBookNumber(1)
      .build();

    expect(offer['@type']).toBe('Offer');
    expect(offer.availability).toBe('https://schema.org/InStock');
    expect(offer.seller).toEqual({ '@type': 'Organization', name: 'Lulu' });
    expect(offer.kikiSeller).toBe('Lulu');
  });
});

describe('ReviewBuilder', () => {
  it('should create Review with Kiki extensions', () => {
    const review = SchemaOrg.review({ '@type': 'Review' })
      .author({ name: 'Reviewer' })
      .reviewBody('Excellent livre')
      .reviewRating({ ratingValue: 5 })
      .datePublished('2024-06-01')
      .itemReviewed({ '@type': 'Book', name: 'Book 1', '@id': 'https://example.com/book1' })
      .kikiBookNumber(1)
      .kikiVerifiedPurchase(true)
      .kikiLanguage('fr')
      .build();

    expect(review['@type']).toBe('Review');
    expect(review.reviewBody).toBe('Excellent livre');
    expect(review.reviewRating.ratingValue).toBe(5);
    expect(review.kikiBookNumber).toBe(1);
    expect(review.kikiVerifiedPurchase).toBe(true);
    expect(review.kikiLanguage).toBe('fr');
  });
});

describe('toJsonLd / toJsonLdObject', () => {
  it('should output JSON-LD string with @context', () => {
    const book = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .isbn('9781234567897')
      .build();

    // toJsonLd est une méthode du builder, pas de l'objet buildé
    const builder = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .isbn('9781234567897');
    const jsonLd = builder.toJsonLd({ pretty: true });
    expect(jsonLd).toContain('"@context"');
    expect(jsonLd).toContain('"@type": "Book"');
    expect(jsonLd).toContain('"isbn": "9781234567897"');
  });

  it('should output JSON-LD object', () => {
    const builder = SchemaOrg.book({ '@type': 'Book', name: 'Test', inLanguage: 'fr', numberOfPages: 1, datePublished: '2024-01-01' })
      .isbn('9781234567897');
    const obj = builder.toJsonLdObject();
    expect(obj['@context']).toBeDefined();
    expect(obj['@type']).toBe('Book');
    expect(obj.isbn).toBe('9781234567897');
  });
});