# schema-org-master — Recherche & Veille (Étape 1/7)

> **Objectif** : Créer le générateur JSON-LD Schema.org le plus complet, typé et maintenable pour Astro/TypeScript — référencé comme "gold standard" par la communauté.

---

## 📚 Sources Officielles & Spécifications

| Source | URL | Utilité |
|--------|-----|---------|
| **Schema.org Full Hierarchy** | https://schema.org/docs/full.html | Hiérarchie complète types/propriétés |
| **Schema.org JSON-LD Context** | https://schema.org/version/latest/schemaorg-current-https.jsonld | Context @vocab, @type, propriétés |
| **Google Rich Results Types** | https://developers.google.com/search/docs/appearance/structured-data | Types supportés par Google + exigences |
| **Google Rich Results Test** | https://search.google.com/test/rich-results | Validation officielle |
| **Schema.org GitHub** | https://github.com/schemaorg/schemaorg | Issues, extensions, releases |
| **JSON-LD 1.1 Spec** | https://www.w3.org/TR/json-ld11/ | Syntaxe, @context, @graph, framing |
| **Google Search Central Blog** | https://developers.google.com/search/blog | Annonces nouveaux types, changements |

---

## 🎯 Types Schema.org Prioritaires (Google-Ready)

| Priorité | Type | Usage Kiki en Christ | Propriétés critiques |
|----------|------|---------------------|---------------------|
| **P0** | `WebSite` | Site global | `url`, `name`, `potentialAction` (SearchAction), `publisher` |
| **P0** | `Organization` | Éditeur/Édition | `name`, `url`, `logo`, `sameAs[]`, `contactPoint`, `founder` |
| **P0** | `Book` | **Chaque livre** (4 livres × 11 langues) | `name`, `author`, `isbn`, `bookFormat`, `inLanguage`, `datePublished`, `publisher`, `offers`, `description`, `image`, `numberOfPages`, `genre`, `keywords`, `aggregateRating`, `review`, `workExample` |
| **P0** | `Product` | Offres commerciales (Papier/Ebook/Audio) | `name`, `offers`, `sku`, `gtin13` (ISBN), `brand`, `category`, `description`, `image` |
| **P0** | `Offer` | Prix par plateforme | `price`, `priceCurrency`, `availability`, `seller`, `url`, `validFrom`, `priceValidUntil`, `eligibleRegion` |
| **P0** | `BreadcrumbList` | Navigation toutes pages | `itemListElement[]` (ListItem → position, item, name) |
| **P0** | `FAQPage` | Pages FAQ + Legal (FAQ détectées) | `mainEntity[]` (Question → acceptedAnswer) |
| **P1** | `Article` / `BlogPosting` | Blog (10 articles FR + traductions) | `headline`, `author`, `datePublished`, `dateModified`, `image`, `publisher`, `mainEntityOfPage`, `keywords`, `articleSection` |
| **P1** | `ItemList` | Pages listing (blog index, livres) | `itemListElement[]` (ListItem → position, item) |
| **P1** | `Review` / `AggregateRating` | Avis lecteurs sur livres | `reviewRating`, `author`, `datePublished`, `reviewBody`, `itemReviewed` |
| **P2** | `Person` | Auteur (Kiki en Christ) | `name`, `url`, `sameAs[]`, `knowsAbout[]`, `worksFor` |
| **P2** | `VideoObject` / `Audiobook` | Versions audio/vidéo | `duration`, `contentUrl`, `embedUrl`, `transcript`, `inLanguage` |
| **P2** | `Course` | Formations éventuelles | `hasCourseInstance`, `educationalLevel`, `teaches` |
| **P2** | `Event` | Lancements, dédicaces | `startDate`, `endDate`, `location`, `offers`, `performer` |

---

## 🔬 Benchmarks — Outils Existants (Analyse Concurrents)

| Outil | Forces | Faiblesses | Decision |
|-------|--------|------------|----------|
| **schema-dts** (npm) | Types TypeScript auto-générés depuis Schema.org, à jour | Pas de runtime, pas de validation, pas d'API builder | **Dépendance core** pour types |
| **structured-data-testing-tool** (Google) | Validation officielle | API privée, pas d'automatisation facile | CLI validation seulement |
| **jsonld.js** | Parsing/frame/compact JSON-LD | Lourd, ancien, maintenance faible | Pas utilisé |
| **seo-schema** (React) | Builder fluide, types | React-only, pas Astro, API limitée | Inspiration API seulement |
| **astro-schema-org** (community) | Intégration Astro | Incomplet, pas maintenu, types faibles | Pas utilisé |
| **Yoast/RankMath (WP)** | Complet, UI, validation | WP-only, pas portable | Référence fonctionnelle seulement |

**Décision架构** : **Wrapper typé sur `schema-dts`** + **Builder fluide immutable** + **Validateur runtime** + **Injecteur Astro** + **CLI**.

---

## 🏗️ Architecture Décisions (Étape 2 Preview)

### Core Types (basés sur `schema-dts`)
```typescript
// types.ts — Re-export sélectif + extensions Kiki
import type { Book, Product, Offer, Organization, WebSite, Article, ... } from 'schema-dts';

export interface KikiBook extends Book {
  // Extensions métier
  kikiSeries?: string;        // "Kiki en Christ"
  kikiBookNumber?: number;    // 1, 2, 3, 4
  kikiHook?: string;          // Accroche marketing
  kikiBenefits?: string[];    // 3 bénéfices
}
```

### Builder API (Fluent, Immutable)
```typescript
// builder.ts
const bookSchema = SchemaOrg
  .book({ name: "...", isbn: "...", author: {...} })
  .withOffers([paperOffer, ebookOffer, audioOffer])
  .withPublisher(orgSchema)
  .withAggregateRating(4.8, 127)
  .inLanguage('fr')
  .build(); // → JsonLdObject
```

### Validateur
```typescript
// validator.ts
validate(schema, { strict: true, googleRichResults: true })
// → { valid: boolean, errors: [], warnings: [], suggestions: [] }
```

### Injecteur Astro
```astro
<!-- SchemaOrg.astro -->
<SchemaOrg @types={['WebSite', 'Organization', 'Book']} @data={bookData} />
<!-- Auto-injecte dans <head> + <body> via slots -->
```

### CLI
```bash
schema-org generate --type Book --lang fr --output jsonld
schema-org validate --url https://kikienchrist.vercel.app/fr/
schema-org audit --dir dist/ --report html
```

---

## 🧪 Stratégie de Tests

| Niveau | Outil | Couverture |
|--------|-------|------------|
| **Unit** | Vitest | 100% builder, validator, types |
| **Snapshot** | Vitest + @vitest/snapshot | JSON-LD output stable pour chaque type |
| **Integration** | Playwright | Pages réelles → validation Google Rich Results Test API |
| **Visual** | Chromatic | Rendering structured data dans DevTools |
| **Perf** | Lighthouse CI | Impact bundle size, parsing time |
| **A11y** | axe-core | ARIA sur injected scripts |

---

## 📦 Dépendances Planifiées

| Dépendance | Version | Raison |
|------------|---------|--------|
| `schema-dts` | ^1.1.0 | Types TypeScript officiels Schema.org |
| `zod` | ^3.22.0 | Validation runtime schémas |
| `commander` | ^12.0.0 | CLI |
| `chalk` | ^5.3.0 | CLI output coloré |
| `glob` | ^10.3.0 | Audit fichiers |
| `vitest` | ^1.0.0 | Tests |
| `@types/node` | ^20.0.0 | Types Node |

---

## 🚧 Risques & Mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| `schema-dts` types incomplets pour extensions | Moyenne | Moyen | Wrapper avec `z.object().passthrough()` + tests de regression |
| Google change exigences Rich Results | Faible | Élevé | Monitoring RSS Google Search Central Blog + tests CI hebdo |
| Bundle size trop gros (types) | Moyenne | Faible | Tree-shaking, export sélectif, `types` only en dev |
| Maintenance types Schema.org versions | Moyenne | Moyen | Script update auto via GitHub Actions (schedule weekly) |

---

## ✅ Prochaines Étapes (Validation Étape 1)

- [x] Sources officielles documentées
- [x] Types priorisés selon impact SEO Kiki en Christ
- [x] Benchmark outils existants → décision architecture
- [x] Architecture core décidée (types, builder, validator, injector, CLI)
- [x] Stratégie tests définie
- [x] Dépendances listées
- [x] Risques identifiés

→ **Prêt pour Étape 2 : Architecture détaillée + `types.ts` + `ARCHITECTURE.md`**