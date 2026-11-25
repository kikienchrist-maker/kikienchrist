// base.ts — BaseBuilder (schema-org-master)
// Builder fluent, immutable, type-safe pour tous les types Schema.org

import type {
  JsonLdObject,
  SupportedSchemaType,
  JsonLdContext,
} from '../types';
import { createContext, mergeJsonLdGraphs, stringifyJsonLd } from '../context';

// ============================================================================
// BASE BUILDER CLASS — Immutable Fluent Pattern
// ============================================================================

/**
 * Données internes du builder (privé)
 */
interface BuilderState<T extends SupportedSchemaType> {
  data: T;
  context: JsonLdContext;
}

/**
 * BaseBuilder — Classe de base pour tous les builders Schema.org
 * @template T Type Schema.org cible (Book, Product, Organization, etc.)
 *
 * @example
 * ```typescript
 * const book = new BookBuilder()
 *   .name("Le visage de Dieu")
 *   .isbn("9791035977887")
 *   .author({ name: "Kiki en Christ" })
 *   .build();
 * ```
 */
export abstract class BaseBuilder<T extends SupportedSchemaType> {
  protected readonly state: BuilderState<T>;

  /**
   * Crée un nouveau builder avec données initiales
   * @param initialData Données de base (doit inclure @type)
   * @param lang Langue pour @context (défaut: 'fr')
   */
  protected constructor(
    initialData: T,
    lang: string = 'fr'
  ) {
    this.state = {
      data: initialData,
      context: createContext(lang as any),
    };
  }

  /**
   * Crée une NOUVELLE instance avec données mises à jour (immutabilité)
   * @param updates Propriétés à mettre à jour
   */
  protected clone<U extends Partial<T>>(updates: U): this {
    const newData = { ...this.state.data, ...updates } as T;
    const newInstance = Object.create(Object.getPrototypeOf(this));
    newInstance.state = {
      data: newData,
      context: this.state.context,
    };
    return newInstance;
  }

  // ========================================================================
  // MÉTHODES COMMUNES — Disponibles sur tous les builders
  // ========================================================================

  /** Définit l'ID canonique (@id) */
  withId(id: string): this {
    return this.clone({ '@id': id } as Partial<T>);
  }

  /** Définit la langue du contenu (@language dans @context) */
  inLanguage(lang: string): this {
    return this.clone({
      inLanguage: lang,
      '@context': { ...this.state.context, '@language': lang },
    } as Partial<T>);
  }

  /** Ajoute une description */
  describedAs(description: string): this {
    return this.clone({ description } as Partial<T>);
  }

  /** Ajoute un nom alternatif */
  alsoKnownAs(...names: string[]): this {
    return this.clone({ alternateName: names } as Partial<T>);
  }

  /** Ajoute des mots-clés */
  withKeywords(...keywords: string[]): this {
    return this.clone({ keywords } as Partial<T>);
  }

  /** Ajoute une image (URL ou array) */
  withImage(image: string | string[]): this {
    return this.clone({ image } as Partial<T>);
  }

  /** Ajoute une URL canonique */
  withUrl(url: string): this {
    return this.clone({ url } as Partial<T>);
  }

  /** Ajoute @context custom */
  withContext(context: Partial<JsonLdContext>): this {
    return this.clone({
      '@context': { ...this.state.context, ...context },
    } as Partial<T>);
  }

  // ========================================================================
  // FINALISATION — Build & Output
  // ========================================================================

  /**
   * Finalise et retourne l'objet JSON-LD typé
   * @returns Objet Schema.org complet avec @id garanti
   */
  build(): T {
    const finalData = this.ensureId(this.state.data);
    return finalData;
  }

  /**
   * Finalise et retourne JSON-LD string (pretty par défaut)
   */
  toJsonLd(options: { pretty?: boolean; context?: JsonLdContext } = {}): string {
    const data = this.build();
    return stringifyJsonLd(data as Record<string, unknown>, { ...options, context: this.state.context });
  }

  /**
   * Finalise et retourne objet JSON-LD complet avec @context
   */
  toJsonLdObject(): JsonLdObject {
    const data = this.build();
    return {
      '@context': this.state.context,
      ...data,
    };
  }

  /**
   * Génère un @id déterministe si absent
   */
  private ensureId(data: T): T {
    if (data['@id']) return data;

    // Générer @id basé sur type + propriétés identifiantes
    const type = data['@type'];
    let idSuffix = '';

    if ('isbn' in data && data.isbn) {
      idSuffix = `isbn/${data.isbn}`;
    } else if ('url' in data && data.url) {
      idSuffix = `url/${encodeURIComponent(data.url as string)}`;
    } else if ('sku' in data && data.sku) {
      idSuffix = `sku/${data.sku}`;
    } else if ('gtin13' in data && data.gtin13) {
      idSuffix = `gtin/${data.gtin13}`;
    } else if ('name' in data && data.name) {
      idSuffix = `name/${encodeURIComponent(data.name as string)}`;
    } else {
      // Hash fallback
      const str = JSON.stringify(data);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      idSuffix = `hash/${Math.abs(hash).toString(36)}`;
    }

    return {
      ...data,
      '@id': `https://kikienchrist.vercel.app/#${type}/${idSuffix}`,
    } as T;
  }
}

// ============================================================================
// FACTORY FUNCTIONS — Entry points fluides
// ============================================================================

/**
 * SchemaOrg — Point d'entrée principal pour tous les builders
 * @example
 * ```typescript
 * import { SchemaOrg } from 'schema-org-master';
 *
 * const book = SchemaOrg.book({ name: "...", isbn: "..." }).build();
 * const org = SchemaOrg.organization({ name: "...", url: "..." }).build();
 * ```
 */
export const SchemaOrg = {
  /** Crée un BookBuilder */
  book: (data: Partial<SupportedSchemaType> & { '@type': 'Book' }) =>
    new BookBuilder(data),

  /** Crée un ProductBuilder */
  product: (data: Partial<SupportedSchemaType> & { '@type': 'Product' }) =>
    new ProductBuilder(data),

  /** Crée un OrganizationBuilder */
  organization: (data: Partial<SupportedSchemaType> & { '@type': 'Organization' }) =>
    new OrganizationBuilder(data),

  /** Crée un WebSiteBuilder */
  website: (data: Partial<SupportedSchemaType> & { '@type': 'WebSite' }) =>
    new WebSiteBuilder(data),

  /** Crée un BreadcrumbListBuilder */
  breadcrumb: (data: Partial<SupportedSchemaType> & { '@type': 'BreadcrumbList' }) =>
    new BreadcrumbListBuilder(data),

  /** Crée un FAQPageBuilder */
  faq: (data: Partial<SupportedSchemaType> & { '@type': 'FAQPage' }) =>
    new FAQPageBuilder(data),

  /** Crée un ArticleBuilder */
  article: (data: Partial<SupportedSchemaType> & { '@type': 'Article' }) =>
    new ArticleBuilder(data),

  /** Crée un OfferBuilder */
  offer: (data: Partial<SupportedSchemaType> & { '@type': 'Offer' }) =>
    new OfferBuilder(data),

  /** Crée un ReviewBuilder */
  review: (data: Partial<SupportedSchemaType> & { '@type': 'Review' }) =>
    new ReviewBuilder(data),

  /** Crée un PersonBuilder */
  person: (data: Partial<SupportedSchemaType> & { '@type': 'Person' }) =>
    new PersonBuilder(data),

  /** Crée un VideoObjectBuilder */
  video: (data: Partial<SupportedSchemaType> & { '@type': 'VideoObject' }) =>
    new VideoObjectBuilder(data),

  /** Crée un AudioObjectBuilder */
  audiobook: (data: Partial<SupportedSchemaType> & { '@type': 'AudioObject' }) =>
    new AudioObjectBuilder(data),

  /** Crée un CourseBuilder */
  course: (data: Partial<SupportedSchemaType> & { '@type': 'Course' }) =>
    new CourseBuilder(data),

  /** Crée un EventBuilder */
  event: (data: Partial<SupportedSchemaType> & { '@type': 'Event' }) =>
    new EventBuilder(data),

  /** Merge plusieurs schemas en un @graph unique */
  merge: (...schemas: JsonLdObject[]) => mergeJsonLdGraphs(...schemas),
};

// ============================================================================
// CONCRETE BUILDERS — Déclarations forward (implémentées dans fichiers dédiés)
// ============================================================================

// Import types pour les builders concrets
import type {
  KikiBook,
  KikiProduct,
  KikiOrganization,
  KikiWebSite,
  KikiBreadcrumbList,
  KikiFAQPage,
  KikiArticle,
  KikiOffer,
  KikiReview,
  PersonInput,
  OrganizationInput,
  OfferInput,
} from '../types';

// BookBuilder
class BookBuilder extends BaseBuilder<KikiBook> {
  constructor(data: Partial<KikiBook> & { '@type': 'Book' }) {
    super({ '@type': 'Book', ...data } as KikiBook);
  }

  name(name: string): this { return this.clone({ name }); }
  isbn(isbn: string): this { return this.clone({ isbn }); }
  author(author: PersonInput | string): this {
    const authorObj = typeof author === 'string' ? { name: author, '@type': 'Person' } : { '@type': 'Person', ...author };
    return this.clone({ author: authorObj } as Partial<KikiBook>);
  }
  numberOfPages(pages: number): this { return this.clone({ numberOfPages: pages }); }
  datePublished(date: string): this { return this.clone({ datePublished: date }); }
  publisher(pub: OrganizationInput): this {
    return this.clone({ publisher: { '@type': 'Organization', ...pub } } as Partial<KikiBook>);
  }
  offers(offers: OfferInput[]): this {
    return this.clone({ offers: offers.map(o => ({ '@type': 'Offer', ...o })) } as Partial<KikiBook>);
  }
  aggregateRating(rating: { ratingValue: number; reviewCount: number; bestRating?: number; worstRating?: number }): this {
    return this.clone({ aggregateRating: { '@type': 'AggregateRating', ...rating } } as Partial<KikiBook>);
  }
  review(reviews: Array<{ author: PersonInput; reviewBody: string; reviewRating: { ratingValue: number }; datePublished: string }>): this {
    return this.clone({ review: reviews.map(r => ({ '@type': 'Review', ...r })) } as Partial<KikiBook>);
  }
  genre(genre: string | string[]): this { return this.clone({ genre }); }
  keywords(keywords: string | string[]): this { return this.clone({ keywords }); }
  bookFormat(format: 'Paperback' | 'EBook' | 'Audiobook'): this { return this.clone({ bookFormat: format }); }
  inLanguage(lang: string): this { return this.clone({ inLanguage: lang }); }
  description(desc: string): this { return this.clone({ description: desc }); }
  image(img: string | string[]): this { return this.clone({ image: img }); }

  // Extensions Kiki
  kikiSeries(series: 'Kiki en Christ'): this { return this.clone({ kikiSeries: series }); }
  kikiBookNumber(num: 1 | 2 | 3 | 4): this { return this.clone({ kikiBookNumber: num }); }
  kikiHook(hook: string): this { return this.clone({ kikiHook: hook }); }
  kikiBenefits(benefits: readonly [string, string, string]): this { return this.clone({ kikiBenefits: benefits }); }
  kikiAvailableFormats(formats: readonly ('Paperback' | 'EBook' | 'Audiobook')[]): this { return this.clone({ kikiAvailableFormats: formats }); }
  kikiPrices(prices: Partial<Record<'Paperback' | 'EBook' | 'Audiobook', { amount: number; currency: string }>>): this { return this.clone({ kikiPrices: prices }); }
}

// ProductBuilder
class ProductBuilder extends BaseBuilder<KikiProduct> {
  constructor(data: Partial<KikiProduct> & { '@type': 'Product' }) {
    super({ '@type': 'Product', ...data } as KikiProduct);
  }
  name(name: string): this { return this.clone({ name }); }
  sku(sku: string): this { return this.clone({ sku }); }
  gtin13(gtin: string): this { return this.clone({ gtin13: gtin }); }
  brand(brand: { name: string } | string): this { return this.clone({ brand: typeof brand === 'string' ? { '@type': 'Brand', name: brand } : { '@type': 'Brand', ...brand } } as Partial<KikiProduct>); }
  category(category: string): this { return this.clone({ category }); }
  description(desc: string): this { return this.clone({ description: desc }); }
  image(img: string | string[]): this { return this.clone({ image: img }); }
  offers(offers: OfferInput[]): this { return this.clone({ offers: offers.map(o => ({ '@type': 'Offer', ...o })) } as Partial<KikiProduct>); }
  aggregateRating(rating: { ratingValue: number; reviewCount: number }): this { return this.clone({ aggregateRating: { '@type': 'AggregateRating', ...rating } } as Partial<KikiProduct>); }
  review(reviews: any[]): this { return this.clone({ review: reviews.map(r => ({ '@type': 'Review', ...r })) } as Partial<KikiProduct>); }

  // Extensions Kiki
  kikiBookRef(num: 1 | 2 | 3 | 4): this { return this.clone({ kikiBookRef: num }); }
  kikiFormat(fmt: 'Paperback' | 'EBook' | 'Audiobook'): this { return this.clone({ kikiFormat: fmt }); }
  kikiSeller(seller: 'Lulu' | 'Payhip' | 'Google Play'): this { return this.clone({ kikiSeller: seller }); }
  kikiOriginalPrice(price: { amount: number; currency: string }): this { return this.clone({ kikiOriginalPrice: price }); }
}

// OrganizationBuilder
class OrganizationBuilder extends BaseBuilder<KikiOrganization> {
  constructor(data: Partial<KikiOrganization> & { '@type': 'Organization' }) {
    super({ '@type': 'Organization', ...data } as KikiOrganization);
  }
  name(name: string): this { return this.clone({ name }); }
  url(url: string): this { return this.clone({ url }); }
  logo(logo: string): this { return this.clone({ logo }); }
  sameAs(urls: string[]): this { return this.clone({ sameAs: urls }); }
  email(email: string): this { return this.clone({ email }); }
  contactPoint(contact: { telephone: string; contactType: string; availableLanguage?: string[] }): this { return this.clone({ contactPoint: { '@type': 'ContactPoint', ...contact } } as Partial<KikiOrganization>); }
  founder(founder: string): this { return this.clone({ founder }); }

  // Extensions Kiki
  kikiFounder(name: string): this { return this.clone({ kikiFounder: name }); }
  kikiMission(mission: string): this { return this.clone({ kikiMission: mission }); }
  kikiBooksCount(count: 4): this { return this.clone({ kikiBooksCount: count }); }
  kikiLanguagesCount(count: 11): this { return this.clone({ kikiLanguagesCount: count }); }
  kikiContactEmail(email: 'kikienchrist@gmail.com'): this { return this.clone({ kikiContactEmail: email }); }
}

// WebSiteBuilder
class WebSiteBuilder extends BaseBuilder<KikiWebSite> {
  constructor(data: Partial<KikiWebSite> & { '@type': 'WebSite' }) {
    super({ '@type': 'WebSite', ...data } as KikiWebSite);
  }
  name(name: string): this { return this.clone({ name }); }
  url(url: string): this { return this.clone({ url }); }
  potentialAction(action: { '@type': 'SearchAction'; target: { '@type': 'EntryPoint'; urlTemplate: string }; queryInput: string }): this { return this.clone({ potentialAction: action }); }
  publisher(pub: { '@type': 'Organization'; name: string }): this { return this.clone({ publisher: pub }); }

  // Extensions Kiki
  kikiSupportedLanguages(langs: readonly string[]): this { return this.clone({ kikiSupportedLanguages: langs }); }
  kikiDefaultLanguage(lang: string): this { return this.clone({ kikiDefaultLanguage: lang }); }
}

// BreadcrumbListBuilder
class BreadcrumbListBuilder extends BaseBuilder<KikiBreadcrumbList> {
  constructor(data: Partial<KikiBreadcrumbList> & { '@type': 'BreadcrumbList' }) {
    super({ '@type': 'BreadcrumbList', ...data } as KikiBreadcrumbList);
  }
  itemListElement(items: Array<{ '@type': 'ListItem'; position: number; item: { '@id': string; name: string } }>): this {
    return this.clone({ itemListElement: items });
  }
  addItem(position: number, name: string, url: string): this {
    const current = this.state.data.itemListElement || [];
    return this.clone({
      itemListElement: [
        ...current,
        { '@type': 'ListItem', position, item: { '@id': url, name } },
      ],
    });
  }
}

// FAQPageBuilder
class FAQPageBuilder extends BaseBuilder<KikiFAQPage> {
  constructor(data: Partial<KikiFAQPage> & { '@type': 'FAQPage' }) {
    super({ '@type': 'FAQPage', ...data } as KikiFAQPage);
  }
  mainEntity(questions: Array<{ '@type': 'Question'; name: string; acceptedAnswer: { '@type': 'Answer'; text: string } }>): this {
    return this.clone({ mainEntity: questions });
  }
  addQuestion(question: string, answer: string): this {
    const current = this.state.data.mainEntity || [];
    return this.clone({
      mainEntity: [
        ...current,
        { '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } },
      ],
    });
  }
  kikiSource(source: 'legal' | 'blog' | 'manual'): this { return this.clone({ kikiSource: source }); }
  kikiDetectedQuestions(count: number): this { return this.clone({ kikiDetectedQuestions: count }); }
}

// ArticleBuilder
class ArticleBuilder extends BaseBuilder<KikiArticle> {
  constructor(data: Partial<KikiArticle> & { '@type': 'Article' }) {
    super({ '@type': 'Article', ...data } as KikiArticle);
  }
  headline(headline: string): this { return this.clone({ headline }); }
  author(author: PersonInput | string): this { return this.clone({ author: typeof author === 'string' ? { '@type': 'Person', name: author } : { '@type': 'Person', ...author } } as Partial<KikiArticle>); }
  datePublished(date: string): this { return this.clone({ datePublished: date }); }
  dateModified(date: string): this { return this.clone({ dateModified: date }); }
  image(img: string | string[]): this { return this.clone({ image: img }); }
  publisher(pub: OrganizationInput): this { return this.clone({ publisher: { '@type': 'Organization', ...pub } } as Partial<KikiArticle>); }
  mainEntityOfPage(url: string): this { return this.clone({ mainEntityOfPage: { '@type': 'WebPage', '@id': url } }); }
  articleSection(section: string): this { return this.clone({ articleSection: section }); }
  keywords(keywords: string | string[]): this { return this.clone({ keywords }); }
  description(desc: string): this { return this.clone({ description: desc }); }

  // Extensions Kiki
  kikiCategory(cat: string): this { return this.clone({ kikiCategory: cat }); }
  kikiTags(tags: readonly string[]): this { return this.clone({ kikiTags: tags }); }
  kikiReadingTimeMinutes(min: number): this { return this.clone({ kikiReadingTimeMinutes: min }); }
  kikiSeries(series: string): this { return this.clone({ kikiSeries: series }); }
  kikiPartNumber(num: number): this { return this.clone({ kikiPartNumber: num }); }
}

// OfferBuilder
class OfferBuilder extends BaseBuilder<KikiOffer> {
  constructor(data: Partial<KikiOffer> & { '@type': 'Offer' }) {
    super({ '@type': 'Offer', ...data } as KikiOffer);
  }
  price(price: number): this { return this.clone({ price }); }
  priceCurrency(currency: string): this { return this.clone({ priceCurrency: currency }); }
  availability(avail: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability'): this { return this.clone({ availability: `https://schema.org/${avail}` }); }
  seller(seller: OrganizationInput | string): this { return this.clone({ seller: typeof seller === 'string' ? { '@type': 'Organization', name: seller } : { '@type': 'Organization', ...seller } } as Partial<KikiOffer>); }
  url(url: string): this { return this.clone({ url }); }
  eligibleRegion(region: string | string[]): this { return this.clone({ eligibleRegion: region }); }
  priceValidUntil(date: string): this { return this.clone({ priceValidUntil: date }); }

  // Extensions Kiki
  kikiSeller(seller: 'Lulu' | 'Payhip' | 'Google Play'): this { return this.clone({ kikiSeller: seller }); }
  kikiFormat(fmt: 'Paperback' | 'EBook' | 'Audiobook'): this { return this.clone({ kikiFormat: fmt }); }
  kikiBookNumber(num: 1 | 2 | 3 | 4): this { return this.clone({ kikiBookNumber: num }); }
}

// ReviewBuilder
class ReviewBuilder extends BaseBuilder<KikiReview> {
  constructor(data: Partial<KikiReview> & { '@type': 'Review' }) {
    super({ '@type': 'Review', ...data } as KikiReview);
  }
  author(author: PersonInput): this { return this.clone({ author: { '@type': 'Person', ...author } } as Partial<KikiReview>); }
  reviewBody(body: string): this { return this.clone({ reviewBody: body }); }
  reviewRating(rating: { ratingValue: number; bestRating?: number; worstRating?: number }): this { return this.clone({ reviewRating: { '@type': 'Rating', ...rating } } as Partial<KikiReview>); }
  datePublished(date: string): this { return this.clone({ datePublished: date }); }
  itemReviewed(item: { '@type': 'Book'; name: string; '@id'?: string }): this { return this.clone({ itemReviewed: item } as Partial<KikiReview>); }

  // Extensions Kiki
  kikiBookNumber(num: 1 | 2 | 3 | 4): this { return this.clone({ kikiBookNumber: num }); }
  kikiVerifiedPurchase(verified: boolean): this { return this.clone({ kikiVerifiedPurchase: verified }); }
  kikiLanguage(lang: string): this { return this.clone({ kikiLanguage: lang }); }
}

// PersonBuilder
class PersonBuilder extends BaseBuilder<SupportedSchemaType> {
  constructor(data: Partial<SupportedSchemaType> & { '@type': 'Person' }) {
    super({ '@type': 'Person', ...data } as SupportedSchemaType);
  }
  name(name: string): this { return this.clone({ name }); }
  url(url: string): this { return this.clone({ url }); }
  sameAs(urls: string[]): this { return this.clone({ sameAs: urls }); }
  knowsAbout(topics: string[]): this { return this.clone({ knowsAbout: topics }); }
  worksFor(org: { '@type': 'Organization'; name: string }): this { return this.clone({ worksFor: org }); }
}

// VideoObjectBuilder
class VideoObjectBuilder extends BaseBuilder<SupportedSchemaType> {
  constructor(data: Partial<SupportedSchemaType> & { '@type': 'VideoObject' }) {
    super({ '@type': 'VideoObject', ...data } as SupportedSchemaType);
  }
  name(name: string): this { return this.clone({ name }); }
  description(desc: string): this { return this.clone({ description: desc }); }
  contentUrl(url: string): this { return this.clone({ contentUrl: url }); }
  embedUrl(url: string): this { return this.clone({ embedUrl: url }); }
  uploadDate(date: string): this { return this.clone({ uploadDate: date }); }
  duration(duration: string): this { return this.clone({ duration }); }
  thumbnailUrl(url: string | string[]): this { return this.clone({ thumbnailUrl: url }); }
  inLanguage(lang: string): this { return this.clone({ inLanguage: lang }); }
  transcript(text: string): this { return this.clone({ transcript: text }); }
}

// AudioObjectBuilder
class AudioObjectBuilder extends BaseBuilder<SupportedSchemaType> {
  constructor(data: Partial<SupportedSchemaType> & { '@type': 'AudioObject' }) {
    super({ '@type': 'AudioObject', ...data } as SupportedSchemaType);
  }
  name(name: string): this { return this.clone({ name }); }
  description(desc: string): this { return this.clone({ description: desc }); }
  contentUrl(url: string): this { return this.clone({ contentUrl: url }); }
  duration(duration: string): this { return this.clone({ duration }); }
  inLanguage(lang: string): this { return this.clone({ inLanguage: lang }); }
  transcript(text: string): this { return this.clone({ transcript: text }); }
  readBy(person: PersonInput): this { return this.clone({ readBy: { '@type': 'Person', ...person } } as Partial<SupportedSchemaType>); }
}

// CourseBuilder
class CourseBuilder extends BaseBuilder<SupportedSchemaType> {
  constructor(data: Partial<SupportedSchemaType> & { '@type': 'Course' }) {
    super({ '@type': 'Course', ...data } as SupportedSchemaType);
  }
  name(name: string): this { return this.clone({ name }); }
  description(desc: string): this { return this.clone({ description: desc }); }
  provider(org: OrganizationInput): this { return this.clone({ provider: { '@type': 'Organization', ...org } } as Partial<SupportedSchemaType>); }
  hasCourseInstance(instances: any[]): this { return this.clone({ hasCourseInstance: instances }); }
  teaches(skills: string[]): this { return this.clone({ teaches: skills }); }
}

// EventBuilder
class EventBuilder extends BaseBuilder<SupportedSchemaType> {
  constructor(data: Partial<SupportedSchemaType> & { '@type': 'Event' }) {
    super({ '@type': 'Event', ...data } as SupportedSchemaType);
  }
  name(name: string): this { return this.clone({ name }); }
  description(desc: string): this { return this.clone({ description: desc }); }
  startDate(date: string): this { return this.clone({ startDate: date }); }
  endDate(date: string): this { return this.clone({ endDate: date }); }
  eventStatus(status: string): this { return this.clone({ eventStatus: status }); }
  location(locations: any[]): this { return this.clone({ location: locations }); }
  offers(offers: OfferInput[]): this { return this.clone({ offers: offers.map(o => ({ '@type': 'Offer', ...o })) } as Partial<SupportedSchemaType>); }
  performer(performers: PersonInput[]): this { return this.clone({ performer: performers.map(p => ({ '@type': 'Person', ...p })) } as Partial<SupportedSchemaType>); }
}