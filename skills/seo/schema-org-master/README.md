# schema-org-master

> **Schema.org JSON-LD Generator, Validator & Auditor for Maximum SEO**
>
> Build, validate, and audit Schema.org structured data with TypeScript-first fluent builders, Zod runtime validation, Google Rich Results compliance, and Astro integration.

## 🎯 Features

- **Fluent Builders** — Immutable, chainable TypeScript builders for all Schema.org types (Book, Product, Organization, WebSite, Article, FAQPage, etc.)
- **Kiki Extensions** — Custom properties for "Kiki en Christ" (book series, formats, prices, hooks, benefits)
- **Zod Validation** — Runtime validation with Google Rich Results required/recommended field checking
- **Astro Integration** — `<SchemaOrg />` component with auto-injection (WebSite, Organization, BreadcrumbList, FAQPage)
- **CLI Tools** — `generate`, `validate`, `audit`, `update-types` commands
- **JSON-LD Context** — Centralized `@context` management with `@graph` deduplication
- **Multilingual** — 11 languages (fr, en, es, pt, it, de, nl, pl, ar, ru, zh, hi) with hreflang, currency, locale helpers
- **Utils** — Currency conversion (EUR for EU), ISO 8601 dates, durations, reading time, language detection

## 📦 Installation

```bash
# Dans le projet Kiki en Christ
cd skills/seo/schema-org-master
npm install
```

## 🚀 Quick Start

### 1. Generate JSON-LD (TypeScript)

```typescript
import { SchemaOrg, createKikiBook } from 'schema-org-master';

// Book builder
const book = SchemaOrg.book({
  '@type': 'Book',
  name: 'Le visage de Dieu',
  isbn: '9791035977887',
  author: { name: 'Kiki en Christ', '@type': 'Person' },
  inLanguage: 'fr',
  numberOfPages: 331,
  datePublished: '2023-05-18',
})
  .description('Quête de spiritualité...')
  .offers([
    { price: 13.90, priceCurrency: 'EUR', availability: 'InStock', seller: 'Lulu' },
    { price: 3.99, priceCurrency: 'USD', availability: 'InStock', seller: 'Payhip' },
  ])
  .kikiSeries('Kiki en Christ')
  .kikiBookNumber(1)
  .kikiHook('Un livre pour ceux qui cherchent Dieu au-delà des dogmes.')
  .kikiBenefits(['Foi personnelle', 'Accessible partout', 'Garantie 30 jours'])
  .build();

// Output JSON-LD
console.log(book.toJsonLd({ pretty: true }));
```

### 2. Kiki Book Factory (Pre-configured)

```typescript
import { createKikiBook, KIKI_BOOKS_FR, KIKI_BOOK_HOOKS, KIKI_BOOK_BENEFITS } from 'schema-org-master';

// Générer livre 1 complet
const book1 = createKikiBook({
  ...KIKI_BOOKS_FR[1],
  kikiBookNumber: 1,
  kikiHook: KIKI_BOOK_HOOKS[1],
  kikiBenefits: KIKI_BOOK_BENEFITS[1],
});

// Générer les 4 livres
const allBooks = Object.keys(KIKI_BOOKS_FR).map(k => createKikiBook({
  ...KIKI_BOOKS_FR[k],
  kikiBookNumber: parseInt(k),
  kikiHook: KIKI_BOOK_HOOKS[k],
  kikiBenefits: KIKI_BOOK_BENEFITS[k],
}));
```

### 3. Validate JSON-LD

```typescript
import { validate, validateForGoogle } from 'schema-org-master';

// Validation basique
const result = validate(jsonLdObject);
if (!result.valid) {
  console.error(result.errors);
}

// Validation Google Rich Results
const googleResult = validateForGoogle(jsonLdObject);
if (!googleResult.richResultsEligible) {
  console.log('Missing required:', googleResult.missingRequiredFields);
  console.log('Missing recommended:', googleResult.missingRecommendedFields);
}
```

### 4. Astro Integration

```astro
---
// src/layouts/MainLayout.astro
import { SchemaOrg } from 'schema-org-master/integrations/astro';
import type { SchemaOrgProps } from 'schema-org-master/integrations/astro';

interface Props extends SchemaOrgProps {
  title: string;
}

const { title, ...schemaProps } = Astro.props;
---

<html lang={schemaProps.lang || 'fr'}>
  <head>
    <title>{title}</title>
    <slot name="head" />
  </head>
  <body>
    <SchemaOrg {...schemaProps} slot="head" />
    <slot />
  </body>
</html>
```

```astro
---
// src/pages/fr/livres/visage.astro
import MainLayout from '../../../layouts/MainLayout.astro';
import { createKikiBook, KIKI_BOOKS_FR } from 'schema-org-master';

const book = createKikiBook({
  ...KIKI_BOOKS_FR[1],
  kikiBookNumber: 1,
  kikiHook: 'Un livre pour ceux qui cherchent Dieu au-delà des dogmes.',
  kikiBenefits: ['Foi personnelle', 'Accessible partout', 'Garantie 30 jours'],
});
---

<MainLayout
  title="Le visage de Dieu"
  pageType="book"
  book={book}
  breadcrumbs={[
    { name: 'Accueil', url: 'https://kikienchrist.vercel.app/fr/' },
    { name: 'Livres', url: 'https://kikienchrist.vercel.app/fr/livres' },
    { name: 'Le visage de Dieu', url: 'https://kikienchrist.vercel.app/fr/livres/visage' },
  ]}
  lang="fr"
  canonicalUrl="https://kikienchrist.vercel.app/fr/livres/visage"
/>
```

### 5. CLI Commands

```bash
# Générer JSON-LD
npx schema-org generate Book --data '{"name":"Test","isbn":"9781234567897","author":{"name":"A"},"inLanguage":"fr","numberOfPages":100,"datePublished":"2024-01-01"}' --pretty

# Générer les 4 livres Kiki
npx schema-org generate allbooks --lang fr --output books.json

# Valider fichier local
npx schema-org validate --file schema.json --google --format console

# Valider URL déployée
npx schema-org validate --url https://kikienchrist.vercel.app/fr/ --google

# Audit complet site
npx schema-org audit --base-url https://kikienchrist.vercel.app --output-dir ./audit-results --format html

# Mettre à jour types TypeScript
npx schema-org update-types --output ../types/generated.ts
```

## 🏗️ Architecture

```
src/
├── core/
│   ├── src/
│   │   ├── index.ts                 # Exports publics
│   │   ├── types.ts                 # Types TypeScript (Schema.org + Kiki extensions)
│   │   ├── context.ts               # JSON-LD @context management
│   │   ├── builder/
│   │   │   ├── base.ts              # BaseBuilder + tous builders concrets
│   │   │   └── book.ts              # createKikiBook + helpers livres
│   │   ├── validator/
│   │   │   └── index.ts             # Zod schemas + Google rules
│   │   ├── injector/
│   │   │   └── index.ts             # injectSchemaOrg + extractors HTML
│   │   ├── utils/
│   │   │   ├── currency.ts          # Formatage, conversion, pays UE
│   │   │   ├── date.ts              # ISO 8601, durations, reading time
│   │   │   ├── lang.ts              # 11 langues, hreflang, détection
│   │   │   └── index.ts
│   │   └── cli/
│   │       ├── index.ts             # Commander.js entry
│   │       ├── generate.ts
│   │       ├── validate.ts
│   │       ├── audit.ts
│   │       └── update-types.ts
│   └── tests/
│       ├── builder.test.ts
│       ├── validator.test.ts
│       ├── utils.test.ts
│       ├── context.test.ts
│       └── injector.test.ts
└── integrations/
    └── astro/
        ├── components/
        │   ├── SchemaOrg.astro      # Composant principal
        │   ├── SchemaOrgHead.astro  # Injection via slot head
        │   └── SchemaOrgBody.astro  # Fallback body
        └── index.ts                 # Astro integration factory
```

## 📚 Supported Schema.org Types

| Type | Builder | Google Rich Results |
|------|---------|---------------------|
| Book | `SchemaOrg.book()` | ✅ Required: name, author, isbn, inLanguage |
| Product | `SchemaOrg.product()` | ✅ Required: name, offers |
| Organization | `SchemaOrg.organization()` | ✅ Required: name |
| WebSite | `SchemaOrg.website()` | ✅ Required: name, url |
| BreadcrumbList | `SchemaOrg.breadcrumb()` | ✅ Required: itemListElement |
| FAQPage | `SchemaOrg.faq()` | ✅ Required: mainEntity |
| Article/BlogPosting | `SchemaOrg.article()` | ✅ Required: headline, author, datePublished, image, publisher |
| Offer | `SchemaOrg.offer()` | ✅ Required: price, priceCurrency |
| Review | `SchemaOrg.review()` | ✅ Required: author, reviewBody, reviewRating, datePublished, itemReviewed |
| Person | `SchemaOrg.person()` | — |
| VideoObject | `SchemaOrg.video()` | — |
| AudioObject | `SchemaOrg.audiobook()` | — |
| Course | `SchemaOrg.course()` | — |
| Event | `SchemaOrg.event()` | — |

## 🌍 Multilingual Support

11 langues avec métadonnées complètes :

| Code | Native | Flag | Direction | Currency | Eurozone |
|------|--------|------|-----------|----------|----------|
| fr | Français | 🇫🇷 | LTR | EUR | ✅ |
| en | English | 🇺🇸 | LTR | USD | ❌ |
| es | Español | 🇪🇸 | LTR | EUR | ✅ |
| pt | Português | 🇵🇹 | LTR | EUR | ✅ |
| it | Italiano | 🇮🇹 | LTR | EUR | ✅ |
| de | Deutsch | 🇩🇪 | LTR | EUR | ✅ |
| nl | Nederlands | 🇳🇱 | LTR | EUR | ✅ |
| pl | Polski | 🇵🇱 | LTR | PLN | ❌ |
| ar | العربية | 🇸🇦 | RTL | SAR | ❌ |
| ru | Русский | 🇷🇺 | LTR | RUB | ❌ |
| zh | 中文 | 🇨🇳 | LTR | CNY | ❌ |
| hi | हिन्दी | 🇮🇳 | LTR | INR | ❌ |

## 💰 Currency Conversion

Auto-conversion EUR pour pays UE via cookie `user-country` ou géolocalisation :

```typescript
import { convertToEUR, shouldUseEUR, formatPrice } from 'schema-org-master';

const priceUSD = 3.99;
if (shouldUseEUR(userCountry)) {
  const priceEUR = convertToEUR(priceUSD, 'USD'); // ~3.67
  formatPrice(priceEUR, { currency: 'EUR' }); // "3,67 €"
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📝 TypeScript Types

Types générés depuis `schema-dts` + extensions Kiki manuelles :

```bash
npm run update-types
```

## 🔧 Configuration

### Global Config (Astro locals)

```typescript
// astro.config.mjs
import { schemaOrgIntegration } from 'schema-org-master/integrations/astro';

export default defineConfig({
  integrations: [
    schemaOrgIntegration({
      config: {
        globalData: {
          website: { name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app' },
          organization: { name: 'Kiki en Christ', url: 'https://kikienchrist.vercel.app', email: 'kikienchrist@gmail.com' },
        },
        defaultLang: 'fr',
      },
    }),
  ],
});
```

## 📄 License

MIT — Part of Kiki en Christ skills library.

## 🤝 Related Skills

- `markdown-sanitizer` — Frontmatter cleanup & slug regeneration
- `blog-translation` — 11-language blog translation pipeline
- `seo-audit-fix` — SEO issue detection & auto-fix
- `i18n-management` — Translation keys sync & validation
- `decap-cms-setup` — Netlify CMS configuration
- `vercel-blob-migration` — Image migration to Vercel Blob
- `github-actions-ci` — Complete CI/CD pipeline
- `ollama-client` — Local LLM translation
- `git-workflow` — Conventional commits & changelog
- `design-system-audit` — `.bq` namespace compliance