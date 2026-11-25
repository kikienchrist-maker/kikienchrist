# @kikienchrist/markdown-sanitizer

> Nettoie, valide et corrige automatiquement les fichiers Markdown avec frontmatter YAML pour projets Astro multilingues.

## Fonctionnalités

- 🔧 **Auto-fix** : Corrige les erreurs courantes (types, slugs, catégories, tags échappés)
- 🌍 **i18n-ready** : Gère les slugs de traduction (`base-slug-lang`), `translationKey`, détection langue
- 📦 **Collections Astro** : Schémas Zod pour `blog`, `legalPages`, `books` compatibles `astro:content`
- 🔍 **Détection frontmatter imbriqué** : Extrait le frontmatter interne des blocs ````markdown` générés par Ollama/LLMs
- ✅ **Validation Zod** : Validation stricte avec messages d'erreur clairs
- 🏷️ **Slugification robuste** : ASCII, lowercase, stop words, unicité
- 📝 **CLI incluse** : `markdown-sanitizer [fichiers|dossiers]`

## Installation

```bash
cd skills/markdown-sanitizer
npm install
npm run build
```

## Usage

### CLI

```bash
# Traiter un fichier
markdown-sanitizer src/content/blog/fr-article.md

# Traiter un dossier récursivement
markdown-sanitizer -r src/content/blog

# Dry-run (pas d'écriture)
markdown-sanitizer --dry-run -r src/content

# Collection spécifique
markdown-sanitizer -c legal src/content/legalPages

# Langue source explicite
markdown-sanitizer --lang ar src/content/blog/ar-article.md
```

### API

```typescript
import { sanitizeMarkdown, serializeMarkdownClean, BlogFrontmatterSchema } from '@kikienchrist/markdown-sanitizer';

const content = `---
title: "Test"
lang: fr
tags: "[\\"tag1\\", \\"tag2\\"]"  // Double-échappé
---
# Body`;

const result = sanitizeMarkdown(content, {
  collection: 'blog',
  sourceLang: 'fr',
  knownBaseSlugs: ['mon-article'],
  autoFix: true,
});

if (result.success) {
  console.log(result.content); // Markdown corrigé
  console.log(result.frontmatter); // Frontmatter typé
  console.log(result.fixes); // ['tags corrigés', 'category ajoutée', ...]
}
```

## Schémas supportés

### Blog (`collection: 'blog'`)
```yaml
title: string (1-120)
description: string (10-300)
pubDate: ISO datetime
updatedDate: ISO datetime (optional)
author: string
lang: fr|en|es|pt|it|de|nl|pl|ar|ru|zh|hi
translationKey: string (optional)
category: prière|formation|témoignage|vie-chrétienne|famille|mission|actualité|ressource|discernement|jeûne|épreuves|guerre spirituelle|guérison|routine|jeunes|couple
tags: string[]
series: string (optional)
featured: boolean
draft: boolean
readingTime: number (minutes)
coverImage: string
ogImage: URL
slug: ASCII lowercase unique
```

### Legal Pages (`collection: 'legal'`)
```yaml
title: string
description: string
pageSlug: string (slug canonique)
lang: fr|en|es|pt|it|de|nl|pl|ar|ru|zh|hi
translationKey: string
lastUpdated: YYYY-MM-DD
version: string (optional)
slug: ASCII lowercase unique
```

### Books (`collection: 'book'`)
```yaml
id: string
title: string
description: string
priceEUR: number
coverImageFr|En|Es: string
pubDate: YYYY-MM-DD
category: Spiritualité|Prière|Théologie|Vie chrétienne|Jeunesse
tags: string[]
```

## Problèmes résolus automatiquement

| Problème | Solution |
|----------|----------|
| Tags double-échappés `["\\"tag\\""]` | Parsé JSON → `["tag"]` |
| Frontmatter imbriqué (Ollama) | Extrait du bloc ````markdown` |
| Catégorie invalide | Mapping → `vie-chrétienne` |
| Slug avec accents/majuscules | `slugify` ASCII lowercase |
| Booléens en string `"true"` | Convertis en `true` |
| Nombres en string `"10"` | Convertis en `10` |
| Champs requis manquants | Défauts sensés ajoutés |
| `series: "undefined"` | Corrigé → `apprendre-à-prier` |

## Tests

```bash
npm test        # Tests unitaires
npm run lint    # ESLint
```

## Architecture

```
src/
├── schemas.ts      # Schémas Zod (blog, legal, book)
├── parser.ts       # Parse Markdown + frontmatter (nested support)
├── slugify.ts      # Slugification + validation
├── sanitizer.ts    # Pipeline principal (parse → normalize → validate → fix → serialize)
├── cli.ts          # Interface ligne de commande (commander.js)
└── index.ts        # Exports publics
```

## Intégration CI/CD

```yaml
# .github/workflows/sanitize.yml
- name: Sanitize Markdown
  run: |
    cd skills/markdown-sanitizer
    npm ci && npm run build
    node dist/cli.js -r ../../src/content/blog --auto-fix
```

## Licence

MIT