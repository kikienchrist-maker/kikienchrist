# schema-org-master — Architecture (Étape 2/7)

> **Objectif** : Architecture modulaire, testable, extensible — zero coupling framework, full TypeScript strict.

---

## 📁 Structure Finale

```
schema-org-master/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── CHANGELOG.md
├── RESEARCH.md
├── ARCHITECTURE.md
├── src/
│   ├── index.ts                    # Exports publics
│   ├── types.ts                    # Types core + extensions Kiki
│   ├── context.ts                  # @context JSON-LD management
│   ├── builder/
│   │   ├── index.ts                # SchemaOrg builder entry
│   │   ├── base.ts                 # BaseBuilder (fluent, immutable)
│   │   ├── book.ts                 # BookBuilder
│   │   ├── product.ts              # ProductBuilder
│   │   ├── organization.ts         # OrganizationBuilder
│   │   ├── website.ts              # WebSiteBuilder
│   │   ├── breadcrumb.ts           # BreadcrumbBuilder
│   │   ├── faq.ts                  # FAQBuilder
│   │   ├── article.ts              # ArticleBuilder
│   │   ├── offer.ts                # OfferBuilder
│   │   ├── review.ts               # ReviewBuilder
│   │   ├── person.ts               # PersonBuilder
│   │   ├── video.ts                # VideoObjectBuilder
│   │   ├── audiobook.ts            # AudiobookBuilder
│   │   └── course.ts               # CourseBuilder
│   ├── validator/
│   │   ├── index.ts                # Validator entry
│   │   ├── schemas.ts              # Zod schemas par type
│   │   ├── google.ts               # Google Rich Results rules
│   │   └── reporter.ts             # Error/warning/suggestion formatting
│   ├── injector/
│   │   ├── index.ts                # Astro injector
│   │   ├── head.ts                 # <head> injection
│   │   ├── body.ts                 # <body> injection (fallback)
│   │   └── slots.ts                # Slot overrides
│   ├── cli/
│   │   ├── index.ts                # Commander entry
│   │   ├── generate.ts             # generate command
│   │   ├── validate.ts             # validate command
│   │   ├── audit.ts                # audit command
│   │   └── update-types.ts         # update-types command (schema-dts sync)
│   └── utils/
│       ├── jsonld.ts               # JSON-LD serialization (compact, pretty)
│       ├── merge.ts                # @graph merging, deduplication
│       ├── currency.ts             # ISO 4217, formatting
│       ├── date.ts                 # ISO 8601, Schema.org dates
│       └── lang.ts                 # BCP 47, ISO 639-1 mapping
├── integrations/
│   └── astro/
│       ├── index.ts                # Astro integration entry
│       ├── components/
│       │   ├── SchemaOrg.astro     # Main component
│       │   ├── SchemaOrgHead.astro # Head injection
│       │   └── SchemaOrgBody.astro # Body injection
│       └── types.d.ts              # Astro component props types
├── tests/
│   ├── unit/
│   │   ├── builder/
│   │   ├── validator/
│   │   ├── injector/
│   │   └── utils/
│   ├── integration/
│   │   └── astro.test.ts
│   ├── snapshots/
│   │   └── *.snap.ts
│   └── e2e/
│       └── playwright/
├── docs/
│   ├── api/
│   ├── guides/
│   └── examples/
└── scripts/
    └── update-schema-dts.ts        # Auto-update types from schema.org
```

---

## 🔑 Patterns Architecturaux

### 1. **Immutable Fluent Builder**
```typescript
// Chaque méthode retourne une NOUVELLE instance (pas de mutation)
class BookBuilder extends BaseBuilder<Book> {
  withAuthor(author: Person): BookBuilder {
    return new BookBuilder({ ...this.data, author });
  }
  build(): JsonLdObject { return this.finalize(); }
}
```

### 2. **Discriminated Union pour @type**
```typescript
type SchemaType =
  | { '@type': 'Book'; ... }
  | { '@type': 'Product'; ... }
  | { '@type': '@graph'; '@graph': SchemaType[] };
```

### 3. **Zod pour Runtime Validation**
```typescript
const BookSchema = z.object({
  '@type': z.literal('Book'),
  '@id': z.string().url().optional(),
  name: z.string().min(1),
  isbn: z.string().regex(/^(?:\d{10}|\d{13})$/),
  // ...
});
```

### 4. **Context Management Centralisé**
```typescript
const DEFAULT_CONTEXT = {
  '@vocab': 'https://schema.org/',
  '@language': 'fr',
  Book: 'https://schema.org/Book',
  // ... aliases courts pour compactage
};
```

### 5. **Deduplication @graph**
```typescript
// Merge multiple schemas → single @graph with deduped @id
function mergeGraphs(...schemas: JsonLdObject[]): JsonLdObject {
  const map = new Map<string, JsonLdObject>();
  for (const s of schemas) {
    if (s['@graph']) {
      for (const item of s['@graph']) map.set(item['@id']!, item);
    } else {
      map.set(s['@id']!, s);
    }
  }
  return { '@context': DEFAULT_CONTEXT, '@graph': [...map.values()] };
}
```

---

## 📦 Exports Publics (`src/index.ts`)

```typescript
// Types
export type {
  JsonLdObject,
  SchemaType,
  BookSchema,
  ProductSchema,
  // ... all types
} from './types';

// Builders
export { SchemaOrg } from './builder'; // Entry point fluent
export { BookBuilder } from './builder/book';
// ... all builders

// Validator
export { validate, validateForGoogle } from './validator';

// Injector (Astro)
export { injectSchemaOrg } from './injector';

// Utils
export { formatCurrency, formatDate, formatLang } from './utils';
```

---

## 🎯 API Publique — Exemples d'Usage

### Génération Simple
```typescript
import { SchemaOrg } from 'schema-org-master';

const bookJsonLd = SchemaOrg
  .book({
    name: "Le visage de Dieu",
    isbn: "9791035977887",
    author: { name: "Kiki en Christ" },
    inLanguage: "fr",
  })
  .withOffers([
    SchemaOrg.offer({ price: 13.90, priceCurrency: "EUR", seller: "Lulu", url: "..." }),
    SchemaOrg.offer({ price: 3.99, priceCurrency: "USD", seller: "Payhip", url: "..." }),
  ])
  .withPublisher(SchemaOrg.organization({ name: "Kiki en Christ", url: "https://..." }))
  .withAggregateRating(4.8, 127)
  .build();
```

### Validation
```typescript
import { validateForGoogle } from 'schema-org-master';

const result = validateForGoogle(bookJsonLd);
if (!result.valid) {
  console.error(result.errors); // Erreurs bloquantes Google
  console.warn(result.warnings); // Avertissements
}
```

### Injection Astro (dans Layout)
```astro
---
import { SchemaOrg } from 'schema-org-master/integrations/astro';
---
<SchemaOrg
  types={['WebSite', 'Organization']}
  data={{
    website: { name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app' },
    organization: { name: 'Kiki en Christ', logo: '/logo.png', sameAs: [...] }
  }}
/>
```

### CLI
```bash
# Générer JSON-LD pour un livre
schema-org generate --type Book --data '{"name":"...","isbn":"..."}' --lang fr --pretty

# Valider une page déployée
schema-org validate --url https://kikienchrist.vercel.app/fr/ --google

# Auditer tout le site (dist/)
schema-org audit --dir dist --output report.html --google
```

---

## 🔄 Flux de Données (Data Flow)

```
User Input (TS objects)
       │
       ▼
┌──────────────────┐
│   Builders       │  →  Immutable JsonLdObject (typed)
│   (fluent API)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Validator      │  →  ValidationResult { valid, errors, warnings }
│   (Zod + Google) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Merger         │  →  Single @graph (deduped @id)
│   (injector)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Serializer     │  →  String (compact JSON-LD)
│   (jsonld.ts)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Injector       │  →  <script type="application/ld+json"> in <head>
│   (Astro)        │
└──────────────────┘
```

---

## 🧪 Test Matrix

| Module | Unit | Snapshot | Integration | E2E |
|--------|------|----------|-------------|-----|
| `types.ts` | ✅ | ❌ | ❌ | ❌ |
| `builder/*` | ✅ 100% | ✅ | ❌ | ❌ |
| `validator/*` | ✅ 100% | ✅ | ✅ | ❌ |
| `injector/*` | ✅ 90% | ❌ | ✅ | ✅ |
| `cli/*` | ✅ 80% | ❌ | ❌ | ✅ |
| `utils/*` | ✅ 100% | ❌ | ❌ | ❌ |
| Astro components | ❌ | ❌ | ✅ | ✅ |

---

## 📋 Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "integrations/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## 🚀 Prochaines Étapes (Validation Étape 2)

- [x] Structure dossiers définie
- [x] Patterns architecturaux documentés
- [x] Exports publics listés
- [x] API publique avec exemples
- [x] Flux de données décrit
- [x] Matrice de tests définie
- [x] tsconfig strict configuré

→ **Prêt pour Étape 3 : Core Engine — `types.ts` + `context.ts` + `builder/base.ts` + premiers builders**