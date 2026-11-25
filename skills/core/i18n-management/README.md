# i18n Management Skill

Gestion centralisée de l'internationalisation pour 11 langues (fr, en, es, pt, it, de, nl, pl, ar, ru, zh, hi).

## Fonctionnalités

- 🔄 **Synchronisation bidirectionnelle** : `translations.json` ↔ `src/data/i18n/*.json` (format Decap CMS)
- ✅ **Validation complète** : Cohérence, clés manquantes, ICU MessageFormat, clés orphelines
- 🛣️ **Analyse routes** : Détection routes `[lang]`, routes statiques par langue, traductions manquantes
- 🔧 **Génération middleware** : Astro middleware + Edge middleware (Vercel/Netlify)
- 🔍 **Extraction clés** : Scan code source pour trouver `t('key')`, `translate('key')`, etc.
- 📊 **Statistiques** : Taux de complétion par langue, routes couvertes

## Installation

```bash
cd skills/core/i18n-management
npm install
npm run build
```

## Usage CLI

```bash
# Validation complète
i18n-manage validate
i18n-manage validate --fix  # correction auto

# Synchronisation
i18n-manage sync                    # bidirectionnel
i18n-manage sync --direction master-to-split
i18n-manage sync --direction split-to-master

# Middleware
i18n-manage middleware              # Astro middleware
i18n-manage middleware --edge       # Edge (Vercel/Netlify)
i18n-manage middleware -o src/middleware.ts

# Routes
i18n-manage routes                  # analyse
i18n-manage routes --output routes-analysis.json

# Extraction
i18n-manage extract                 # scan src/
i18n-manage extract --update-master # met à jour translations.json
i18n-manage extract -s src/components

# Statistiques
i18n-manage stats
```

## Architecture des fichiers

```
src/data/
├── translations.json          # Master - toutes les clés + toutes les langues
└── i18n/                      # Split pour Decap CMS
    ├── fr.json
    ├── en.json
    ├── es.json
    ... (11 fichiers)
```

### Format `translations.json` (Master)
```json
{
  "version": "1.0.0",
  "updatedAt": "2026-01-15T10:30:00Z",
  "entries": [
    {
      "key": "nav.home",
      "values": {
        "fr": "Accueil",
        "en": "Home",
        "es": "Inicio",
        ...
      },
      "description": "Navigation principale",
      "category": "navigation"
    }
  ]
}
```

### Format `i18n/fr.json` (Split)
```json
{
  "lang": "fr",
  "translations": {
    "nav.home": "Accueil",
    "nav.about": "À propos"
  },
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

## Intégration Decap CMS

Les fichiers split `i18n/*.json` sont compatibles Decap CMS (backend Git Gateway). Configuration `decap-cms/config.yml` :

```yaml
collections:
  - name: "translations"
    label: "Traductions"
    folder: "src/data/i18n"
    create: true
    fields:
      - {label: "Langue", name: "lang", widget: "hidden", default: "fr"}
      - {label: "Traductions", name: "translations", widget: "object"}
```

## ICU MessageFormat

Support des pluriels ICU par langue :
- FR/EN/ES/PT/IT/DE/NL/HI : 2 formes (singulier/pluriel)
- PL : 3 formes
- AR : 6 formes
- RU : 3 formes
- ZH : 1 forme (invariable)

Exemple :
```json
{
  "key": "blog.articles_count",
  "values": {
    "fr": "{count, plural, one {# article} other {# articles}}",
    "en": "{count, plural, one {# article} other {# articles}}",
    "pl": "{count, plural, one {# artykuł} few {# artykuły} other {# artykułów}}",
    "ar": "{count, plural, zero {# مقال} one {# مقال} two {# مقالين} few {# مقالات} many {# مقال} other {# مقال}}"
  }
}
```

## API Programmable

```typescript
import { 
  validateTranslationsFile, 
  syncMasterToSplit, 
  generateMiddlewareCode,
  analyzeRoutes,
  extractTranslationKeys 
} from '@kikienchrist/i18n-management';

// Validation
const result = validateTranslationsFile(masterFile, config);

// Sync
syncMasterToSplit(masterFile, i18nDir, config);

// Middleware
const code = generateMiddlewareCode({ cookieName: 'lang', defaultLang: 'fr' });

// Routes
const analysis = analyzeRoutes(config);

// Extraction
const extracted = extractTranslationKeys('src', config);
```

## Tests

```bash
npm test
```

## Catégories de traduction

- `common` : UI commune (boutons, labels)
- `navigation` : Menu, breadcrumbs
- `blog` : Articles, catégories, auteurs
- `legal` : Mentions légales, CGV, cookies
- `books` : Livres, descriptions
- `forms` : Formulaires, validation
- `seo` : Meta tags, schema.org
- `accessibility` : ARIA, labels écran
- `errors` : Messages d'erreur
- `newsletter` : Inscription, confirmation
- `pwa` : Install, offline, notifications
- `affiliation` : Liens partenaires, tracking

## Configuration

Par défaut, utilise :
- `basePath`: `process.cwd()`
- `translationsFile`: `src/data/translations.json`
- `i18nDir`: `src/data/i18n`
- `middlewareFile`: `src/middleware.ts`
- `routesDir`: `src/pages`

Personnalisable via fichier config ou options CLI.