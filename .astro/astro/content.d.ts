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
"ar/first-article.md": {
	id: "ar/first-article.md";
  slug: "ar/first-article";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"de/erster-artikel.md": {
	id: "de/erster-artikel.md";
  slug: "de/erster-artikel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"en/first-article.md": {
	id: "en/first-article.md";
  slug: "en/first-article";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"es/primer-articulo.md": {
	id: "es/primer-articulo.md";
  slug: "es/primer-articulo";
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
"fr/premiere-article.md": {
	id: "fr/premiere-article.md";
  slug: "fr/premiere-article";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"it/primo-articolo.md": {
	id: "it/primo-articolo.md";
  slug: "it/primo-articolo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"nl/eerste-artikel.md": {
	id: "nl/eerste-artikel.md";
  slug: "nl/eerste-artikel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pl/pierwszy-artykul.md": {
	id: "pl/pierwszy-artykul.md";
  slug: "pl/pierwszy-artykul";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pt/primeiro-artigo.md": {
	id: "pt/primeiro-artigo.md";
  slug: "pt/primeiro-artigo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};
"legalPages": {
"accessibilite-ar.md": {
	id: "accessibilite-ar.md";
  slug: "accessibilite-ar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-de.md": {
	id: "accessibilite-de.md";
  slug: "accessibilite-de";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-en.md": {
	id: "accessibilite-en.md";
  slug: "accessibilite-en";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-es.md": {
	id: "accessibilite-es.md";
  slug: "accessibilite-es";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-fr.md": {
	id: "accessibilite-fr.md";
  slug: "accessibilite-fr";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-hi.md": {
	id: "accessibilite-hi.md";
  slug: "accessibilite-hi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-it.md": {
	id: "accessibilite-it.md";
  slug: "accessibilite-it";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-nl.md": {
	id: "accessibilite-nl.md";
  slug: "accessibilite-nl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-pl.md": {
	id: "accessibilite-pl.md";
  slug: "accessibilite-pl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-pt.md": {
	id: "accessibilite-pt.md";
  slug: "accessibilite-pt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-ru.md": {
	id: "accessibilite-ru.md";
  slug: "accessibilite-ru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"accessibilite-zh.md": {
	id: "accessibilite-zh.md";
  slug: "accessibilite-zh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-ar.md": {
	id: "cgv-ar.md";
  slug: "cgv-ar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-de.md": {
	id: "cgv-de.md";
  slug: "cgv-de";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-en.md": {
	id: "cgv-en.md";
  slug: "cgv-en";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-es.md": {
	id: "cgv-es.md";
  slug: "cgv-es";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-fr.md": {
	id: "cgv-fr.md";
  slug: "cgv-fr";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-hi.md": {
	id: "cgv-hi.md";
  slug: "cgv-hi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-it.md": {
	id: "cgv-it.md";
  slug: "cgv-it";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-nl.md": {
	id: "cgv-nl.md";
  slug: "cgv-nl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-pl.md": {
	id: "cgv-pl.md";
  slug: "cgv-pl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-pt.md": {
	id: "cgv-pt.md";
  slug: "cgv-pt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-ru.md": {
	id: "cgv-ru.md";
  slug: "cgv-ru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cgv-zh.md": {
	id: "cgv-zh.md";
  slug: "cgv-zh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-ar.md": {
	id: "confidentialite-ar.md";
  slug: "confidentialite-ar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-de.md": {
	id: "confidentialite-de.md";
  slug: "confidentialite-de";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-en.md": {
	id: "confidentialite-en.md";
  slug: "confidentialite-en";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-es.md": {
	id: "confidentialite-es.md";
  slug: "confidentialite-es";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-fr.md": {
	id: "confidentialite-fr.md";
  slug: "confidentialite-fr";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-hi.md": {
	id: "confidentialite-hi.md";
  slug: "confidentialite-hi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-it.md": {
	id: "confidentialite-it.md";
  slug: "confidentialite-it";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-nl.md": {
	id: "confidentialite-nl.md";
  slug: "confidentialite-nl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-pl.md": {
	id: "confidentialite-pl.md";
  slug: "confidentialite-pl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-pt.md": {
	id: "confidentialite-pt.md";
  slug: "confidentialite-pt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-ru.md": {
	id: "confidentialite-ru.md";
  slug: "confidentialite-ru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"confidentialite-zh.md": {
	id: "confidentialite-zh.md";
  slug: "confidentialite-zh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-ar.md": {
	id: "cookies-ar.md";
  slug: "cookies-ar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-de.md": {
	id: "cookies-de.md";
  slug: "cookies-de";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-en.md": {
	id: "cookies-en.md";
  slug: "cookies-en";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-es.md": {
	id: "cookies-es.md";
  slug: "cookies-es";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-fr.md": {
	id: "cookies-fr.md";
  slug: "cookies-fr";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-hi.md": {
	id: "cookies-hi.md";
  slug: "cookies-hi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-it.md": {
	id: "cookies-it.md";
  slug: "cookies-it";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-nl.md": {
	id: "cookies-nl.md";
  slug: "cookies-nl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-pl.md": {
	id: "cookies-pl.md";
  slug: "cookies-pl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-pt.md": {
	id: "cookies-pt.md";
  slug: "cookies-pt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-ru.md": {
	id: "cookies-ru.md";
  slug: "cookies-ru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"cookies-zh.md": {
	id: "cookies-zh.md";
  slug: "cookies-zh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-ar.md": {
	id: "mentions-legales-ar.md";
  slug: "mentions-legales-ar";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-de.md": {
	id: "mentions-legales-de.md";
  slug: "mentions-legales-de";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-en.md": {
	id: "mentions-legales-en.md";
  slug: "mentions-legales-en";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-es.md": {
	id: "mentions-legales-es.md";
  slug: "mentions-legales-es";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-fr.md": {
	id: "mentions-legales-fr.md";
  slug: "mentions-legales-fr";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-hi.md": {
	id: "mentions-legales-hi.md";
  slug: "mentions-legales-hi";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-it.md": {
	id: "mentions-legales-it.md";
  slug: "mentions-legales-it";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-nl.md": {
	id: "mentions-legales-nl.md";
  slug: "mentions-legales-nl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-pl.md": {
	id: "mentions-legales-pl.md";
  slug: "mentions-legales-pl";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-pt.md": {
	id: "mentions-legales-pt.md";
  slug: "mentions-legales-pt";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-ru.md": {
	id: "mentions-legales-ru.md";
  slug: "mentions-legales-ru";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
"mentions-legales-zh.md": {
	id: "mentions-legales-zh.md";
  slug: "mentions-legales-zh";
  body: string;
  collection: "legalPages";
  data: InferEntrySchema<"legalPages">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"authors": Record<string, {
  id: string;
  collection: "authors";
  data: InferEntrySchema<"authors">;
}>;
"legal": Record<string, {
  id: string;
  collection: "legal";
  data: any;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
