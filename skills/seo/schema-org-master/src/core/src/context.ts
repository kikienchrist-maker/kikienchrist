// context.ts — JSON-LD Context Management (schema-org-master)
// Centralise la gestion du @context pour compactage et cohérence

import type { JsonLdContext, KikiLangCode } from './types';

// ============================================================================
// CONTEXTE PAR DÉFAUT — Optimisé pour Schema.org + extensions Kiki
// ============================================================================

/**
 * Contexte de base Schema.org avec vocabulaire officiel
 * @see https://schema.org/docs/jsonld.html#context
 */
export const BASE_SCHEMA_CONTEXT: JsonLdContext = {
  '@vocab': 'https://schema.org/',
  '@language': 'fr', // défaut, sera overridé par langue page

  // Extensions Kiki — mapped vers propriétés Schema.org existantes
  // Note: Ces aliases permettent le compactage dans JSON-LD final
  kikiSeries: 'name',
  kikiBookNumber: 'position',
  kikiHook: 'description',
  kikiBenefits: 'featureList',
  kikiAvailableFormats: 'offers',
  kikiPrices: 'priceSpecification',
  kikiBookRef: 'isBasedOn',
  kikiFormat: 'bookFormat',
  kikiSeller: 'seller',
  kikiOriginalPrice: 'priceSpecification',
  kikiFounder: 'founder',
  kikiMission: 'mission',
  kikiBooksCount: 'numberOfItems',
  kikiLanguagesCount: 'availableLanguage',
  kikiContactEmail: 'email',
  kikiSupportedLanguages: 'availableLanguage',
  kikiDefaultLanguage: 'inLanguage',
  kikiDetectedQuestions: 'mainEntity',
  kikiCategory: 'articleSection',
  kikiTags: 'keywords',
  kikiReadingTimeMinutes: 'timeRequired',
  kikiSeriesPart: 'hasPart',
  kikiPartNumber: 'position',
  kikiVerifiedPurchase: 'verifiedPurchase',
  kikiLanguage: 'inLanguage',
  kikiReviewCount: 'reviewCount',
  kikiRatingDistribution: 'ratingValue',
};

// ============================================================================
// CONTEXTE PAR LANGUE — @language dynamique
// ============================================================================

/**
 * Crée un contexte pour une langue donnée
 * @param lang Code langue BCP 47 (ex: 'fr', 'en', 'es', ...)
 */
export function createContext(lang: KikiLangCode = 'fr'): JsonLdContext {
  return {
    ...BASE_SCHEMA_CONTEXT,
    '@language': lang,
  };
}

/**
 * Contexte minimal pour production (sans extensions Kiki non-standard)
 * Utilisé quand on veut du JSON-LD pur Schema.org validé Google
 */
export function createStrictContext(lang: KikiLangCode = 'fr'): JsonLdContext {
  return {
    '@vocab': 'https://schema.org/',
    '@language': lang,
  };
}

// ============================================================================
// CONTEXT MERGING — Pour @graph multiples
// ============================================================================

/**
 * Merge plusieurs contextes en un seul (déduplication, priorité au dernier)
 */
export function mergeContexts(...contexts: (JsonLdContext | string)[]): JsonLdContext {
  const merged: JsonLdContext = {
    '@vocab': 'https://schema.org/',
    '@language': 'fr',
  };

  for (const ctx of contexts) {
    if (typeof ctx === 'string') continue; // URL contexte externe ignorée ici
    Object.assign(merged, ctx);
  }

  return merged;
}

// ============================================================================
// COMPACTAGE — Utilitaires pour JSON-LD compact
// ============================================================================

/**
 * Compacte un objet JSON-LD en utilisant le contexte
 * Remplace les URLs complètes par les termes courts du @context
 */
export function compactJsonLd(
  obj: Record<string, unknown>,
  context: JsonLdContext = BASE_SCHEMA_CONTEXT
): Record<string, unknown> {
  const compacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Chercher alias court dans le contexte
    const shortKey = findShortKey(key, context);
    compacted[shortKey] = compactValue(value, context);
  }

  return compacted;
}

function findShortKey(fullKey: string, context: JsonLdContext): string {
  // Si clé déjà courte (pas d'URL), la garder
  if (!fullKey.startsWith('http') && !fullKey.includes(':')) {
    return fullKey;
  }

  // Chercher dans le contexte inverse
  for (const [short, expanded] of Object.entries(context)) {
    if (short.startsWith('@')) continue; // @vocab, @language
    if (expanded === fullKey || expanded === `https://schema.org/${fullKey}`) {
      return short;
    }
  }

  // Fallback: extraire le nom local de l'URL
  const hashIndex = fullKey.lastIndexOf('#');
  const slashIndex = fullKey.lastIndexOf('/');
  const start = Math.max(hashIndex, slashIndex) + 1;
  return fullKey.slice(start);
}

function compactValue(value: unknown, context: JsonLdContext): unknown {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(v => compactValue(v, context));
  }

  if (typeof value === 'object') {
    const compacted: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      compacted[findShortKey(k, context)] = compactValue(v, context);
    }
    return compacted;
  }

  return value;
}

// ============================================================================
// EXPANSION — Inverse du compactage (pour validation)
// ============================================================================

/**
 * Étend un objet compacté vers URLs complètes Schema.org
 */
export function expandJsonLd(
  obj: Record<string, unknown>,
  context: JsonLdContext = BASE_SCHEMA_CONTEXT
): Record<string, unknown> {
  const expanded: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = expandKey(key, context);
    expanded[fullKey] = expandValue(value, context);
  }

  return expanded;
}

function expandKey(shortKey: string, context: JsonLdContext): string {
  if (shortKey.startsWith('@')) return shortKey;
  if (shortKey.includes(':')) return shortKey; // déjà CURIE

  const expanded = context[shortKey];
  if (expanded && typeof expanded === 'string') {
    return expanded.startsWith('http') ? expanded : `https://schema.org/${expanded}`;
  }

  return `https://schema.org/${shortKey}`;
}

function expandValue(value: unknown, context: JsonLdContext): unknown {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(v => expandValue(v, context));
  }

  if (typeof value === 'object') {
    const expanded: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      expanded[expandKey(k, context)] = expandValue(v, context);
    }
    return expanded;
  }

  return value;
}

// ============================================================================
// SERIALIZATION — JSON-LD string output
// ============================================================================

/**
 * Sérialise en JSON-LD string (pretty ou compact)
 */
export function stringifyJsonLd(
  obj: Record<string, unknown>,
  options: { pretty?: boolean; context?: JsonLdContext } = {}
): string {
  const { pretty = true, context = BASE_SCHEMA_CONTEXT } = options;

  // Ajouter @context si absent
  const output = {
    '@context': context,
    ...obj,
  };

  return JSON.stringify(output, null, pretty ? 2 : 0);
}

/**
 * Parse et valide un JSON-LD string
 */
export function parseJsonLd(jsonString: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('JSON-LD root must be an object');
    }
    return parsed as Record<string, unknown>;
  } catch (e) {
    throw new Error(`Invalid JSON-LD: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ============================================================================
// GRAPH MANAGEMENT — @graph merging & deduplication
// ============================================================================

import type { SupportedSchemaType, JsonLdObject } from './types';

/**
 * Merge plusieurs JsonLdObject en un seul @graph dédupliqué par @id
 */
export function mergeJsonLdGraphs(...graphs: JsonLdObject[]): JsonLdObject {
  const nodeMap = new Map<string, SupportedSchemaType>();
  let finalContext = BASE_SCHEMA_CONTEXT;

  for (const graph of graphs) {
    if (!graph) continue;

    // Capturer le contexte du premier graph qui en a un
    if (graph['@context'] && finalContext === BASE_SCHEMA_CONTEXT) {
      finalContext = graph['@context'];
    }

    // Si objet a @graph, merger ses éléments
    if (graph['@graph'] && Array.isArray(graph['@graph'])) {
      for (const node of graph['@graph']) {
        addNode(nodeMap, node as SupportedSchemaType);
      }
    }
    // Sinon, c'est un nœud unique (avec @type au root)
    else if (graph['@type']) {
      addNode(nodeMap, graph as SupportedSchemaType);
    }
  }

  // Construire le @graph final
  const finalGraph = Array.from(nodeMap.values());

  return {
    '@context': finalContext,
    '@graph': finalGraph,
  };
}

function addNode(map: Map<string, SupportedSchemaType>, node: SupportedSchemaType): void {
  const id = node['@id'] || generateNodeId(node);

  // Si nœud existe déjà, merger (shallow merge pour propriétés simples)
  if (map.has(id)) {
    const existing = map.get(id)!;
    map.set(id, mergeNodes(existing, node));
  } else {
    map.set(id, { ...node, '@id': id } as SupportedSchemaType);
  }
}

function generateNodeId(node: SupportedSchemaType): string {
  // Générer un @id déterministe basé sur type + propriétés clés
  const type = node['@type'];
  const keys = ['name', 'isbn', 'url', 'sku', 'gtin13', 'email', 'position'];

  for (const key of keys) {
    const val = (node as Record<string, unknown>)[key];
    if (val && typeof val === 'string') {
      return `https://kikienchrist.vercel.app/#${type}/${val}`;
    }
  }

  // Fallback: hash du contenu
  const str = JSON.stringify(node);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `https://kikienchrist.vercel.app/#${type}/${Math.abs(hash).toString(36)}`;
}

function mergeNodes(
  existing: SupportedSchemaType,
  incoming: SupportedSchemaType
): SupportedSchemaType {
  // Merge shallow: incoming écrase existing pour propriétés non-objets
  // Pour objets/arrays, on pourrait faire du deep merge mais gardons simple
  return { ...existing, ...incoming } as SupportedSchemaType;
}