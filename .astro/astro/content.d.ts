declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"ar-entendre-voix-dieu.md": {
	id: "ar-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-ar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"en-entendre-voix-dieu.md": {
	id: "en-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-en";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"es-entendre-voix-dieu.md": {
	id: "es-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-es";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-entendre-voix-dieu.md": {
	id: "fr-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-guerre-spirituelle.md": {
	id: "fr-guerre-spirituelle.md";
  slug: "guerre-spirituelle-priere-autorite";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-jeuner-prier.md": {
	id: "fr-jeuner-prier.md";
  slug: "jeuner-prier";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-prier-guerison-7-cles.md": {
	id: "fr-prier-guerison-7-cles.md";
  slug: "prier-guerison-7-cles";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-couple.md": {
	id: "fr-priere-couple.md";
  slug: "priere-couple";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-enfants.md": {
	id: "fr-priere-enfants.md";
  slug: "apprendre-prier-enfants";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-impossible.md": {
	id: "fr-priere-impossible.md";
  slug: "priere-impossible-desert-spirituel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-jeunes.md": {
	id: "fr-priere-jeunes.md";
  slug: "priere-generation-z-jeunes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-maladie.md": {
	id: "fr-priere-maladie.md";
  slug: "priere-guerison-maladie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-matin-soir.md": {
	id: "fr-priere-matin-soir.md";
  slug: "priere-matin-soir-routine";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"fr-priere-quotidienne.md": {
	id: "fr-priere-quotidienne.md";
  slug: "priere-quotidienne-7-cles";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"it-entendre-voix-dieu.md": {
	id: "it-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-it";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"nl-entendre-voix-dieu.md": {
	id: "nl-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-nl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ru-entendre-voix-dieu.md": {
	id: "ru-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-ru";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"zh-entendre-voix-dieu.md": {
	id: "zh-entendre-voix-dieu.md";
  slug: "entendre-voix-dieu-zh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};
"books": {
"combat.md": {
	id: "combat.md";
  slug: "combat";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"livre-1.md": {
	id: "livre-1.md";
  slug: "livre-1";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"livre-2.md": {
	id: "livre-2.md";
  slug: "livre-2";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"livre-3.md": {
	id: "livre-3.md";
  slug: "livre-3";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"livre-4.md": {
	id: "livre-4.md";
  slug: "livre-4";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"salut.md": {
	id: "salut.md";
  slug: "salut";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"trinite.md": {
	id: "trinite.md";
  slug: "trinite";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
"visage.md": {
	id: "visage.md";
  slug: "visage";
  body: string;
  collection: "books";
  data: InferEntrySchema<"books">
} & { render(): Render[".md"] };
};
"legal": {
"accessibilite.md": {
	id: "accessibilite.md";
  slug: "accessibilite";
  body: string;
  collection: "legal";
  data: any
} & { render(): Render[".md"] };
"cgv.md": {
	id: "cgv.md";
  slug: "cgv";
  body: string;
  collection: "legal";
  data: any
} & { render(): Render[".md"] };
"confidentialite.md": {
	id: "confidentialite.md";
  slug: "confidentialite";
  body: string;
  collection: "legal";
  data: any
} & { render(): Render[".md"] };
"cookies.md": {
	id: "cookies.md";
  slug: "cookies";
  body: string;
  collection: "legal";
  data: any
} & { render(): Render[".md"] };
"mentions-legales.md": {
	id: "mentions-legales.md";
  slug: "mentions-legales";
  body: string;
  collection: "legal";
  data: any
} & { render(): Render[".md"] };
};
"legalPages": {
"accessibilite.ar.md": {
	id: "accessibilite.ar.md";
  slug: "accessibilitear";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.de.md": {
	id: "accessibilite.de.md";
  slug: "accessibilitede";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.en.md": {
	id: "accessibilite.en.md";
  slug: "accessibiliteen";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.es.md": {
	id: "accessibilite.es.md";
  slug: "accessibilitees";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.hi.md": {
	id: "accessibilite.hi.md";
  slug: "accessibilitehi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.it.md": {
	id: "accessibilite.it.md";
  slug: "accessibiliteit";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.md": {
	id: "accessibilite.md";
  slug: "accessibilite";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.nl.md": {
	id: "accessibilite.nl.md";
  slug: "accessibilitenl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.pl.md": {
	id: "accessibilite.pl.md";
  slug: "accessibilitepl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.pt.md": {
	id: "accessibilite.pt.md";
  slug: "accessibilitept";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.ru.md": {
	id: "accessibilite.ru.md";
  slug: "accessibiliteru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite.zh.md": {
	id: "accessibilite.zh.md";
  slug: "accessibilitezh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.ar.md": {
	id: "cgv.ar.md";
  slug: "cgvar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.de.md": {
	id: "cgv.de.md";
  slug: "cgvde";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.en.md": {
	id: "cgv.en.md";
  slug: "cgven";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.es.md": {
	id: "cgv.es.md";
  slug: "cgves";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.hi.md": {
	id: "cgv.hi.md";
  slug: "cgvhi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.it.md": {
	id: "cgv.it.md";
  slug: "cgvit";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.md": {
	id: "cgv.md";
  slug: "cgv";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.nl.md": {
	id: "cgv.nl.md";
  slug: "cgvnl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.pl.md": {
	id: "cgv.pl.md";
  slug: "cgvpl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.pt.md": {
	id: "cgv.pt.md";
  slug: "cgvpt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.ru.md": {
	id: "cgv.ru.md";
  slug: "cgvru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv.zh.md": {
	id: "cgv.zh.md";
  slug: "cgvzh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.ar.md": {
	id: "confidentialite.ar.md";
  slug: "confidentialitear";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.de.md": {
	id: "confidentialite.de.md";
  slug: "confidentialitede";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.en.md": {
	id: "confidentialite.en.md";
  slug: "confidentialiteen";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.es.md": {
	id: "confidentialite.es.md";
  slug: "confidentialitees";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.hi.md": {
	id: "confidentialite.hi.md";
  slug: "confidentialitehi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.it.md": {
	id: "confidentialite.it.md";
  slug: "confidentialiteit";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.md": {
	id: "confidentialite.md";
  slug: "confidentialite";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.nl.md": {
	id: "confidentialite.nl.md";
  slug: "confidentialitenl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.pl.md": {
	id: "confidentialite.pl.md";
  slug: "confidentialitepl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.pt.md": {
	id: "confidentialite.pt.md";
  slug: "confidentialitept";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.ru.md": {
	id: "confidentialite.ru.md";
  slug: "confidentialiteru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite.zh.md": {
	id: "confidentialite.zh.md";
  slug: "confidentialitezh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.ar.md": {
	id: "cookies.ar.md";
  slug: "cookiesar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.de.md": {
	id: "cookies.de.md";
  slug: "cookiesde";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.en.md": {
	id: "cookies.en.md";
  slug: "cookiesen";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.es.md": {
	id: "cookies.es.md";
  slug: "cookieses";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.hi.md": {
	id: "cookies.hi.md";
  slug: "cookieshi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.it.md": {
	id: "cookies.it.md";
  slug: "cookiesit";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.md": {
	id: "cookies.md";
  slug: "cookies";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.nl.md": {
	id: "cookies.nl.md";
  slug: "cookiesnl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.pl.md": {
	id: "cookies.pl.md";
  slug: "cookiespl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.pt.md": {
	id: "cookies.pt.md";
  slug: "cookiespt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.ru.md": {
	id: "cookies.ru.md";
  slug: "cookiesru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies.zh.md": {
	id: "cookies.zh.md";
  slug: "cookieszh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.ar.md": {
	id: "mentions-legales.ar.md";
  slug: "mentions-legalesar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.de.md": {
	id: "mentions-legales.de.md";
  slug: "mentions-legalesde";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.en.md": {
	id: "mentions-legales.en.md";
  slug: "mentions-legalesen";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.es.md": {
	id: "mentions-legales.es.md";
  slug: "mentions-legaleses";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.hi.md": {
	id: "mentions-legales.hi.md";
  slug: "mentions-legaleshi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.it.md": {
	id: "mentions-legales.it.md";
  slug: "mentions-legalesit";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.md": {
	id: "mentions-legales.md";
  slug: "mentions-legales";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.nl.md": {
	id: "mentions-legales.nl.md";
  slug: "mentions-legalesnl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.pl.md": {
	id: "mentions-legales.pl.md";
  slug: "mentions-legalespl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.pt.md": {
	id: "mentions-legales.pt.md";
  slug: "mentions-legalespt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.ru.md": {
	id: "mentions-legales.ru.md";
  slug: "mentions-legalesru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales.zh.md": {
	id: "mentions-legales.zh.md";
  slug: "mentions-legaleszh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"authors": {
"kikienchrist": {
	id: "kikienchrist";
  collection: "authors";
  data: InferEntrySchema<"authors">
};
};
"siteConfig": Record<string, {
  id: string;
  collection: "siteConfig";
  data: InferEntrySchema<"siteConfig">;
  rendered?: RenderedContent;
  filePath?: string;
  body?: string 
}>;
"translations": Record<string, {
  id: string;
  collection: "translations";
  data: InferEntrySchema<"translations">;
  rendered?: RenderedContent;
  filePath?: string;
  body?: string 
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
