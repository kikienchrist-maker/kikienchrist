---
name: kikienchrist-cms-headless
description: "CMS Headless pour Contenu (Netlify CMS / CloudCannon / TinaCMS / Decap CMS) — Édition visuelle translations.json + Blog par non-techniciens"
version: "1.0"
---

# Skill: kikienchrist-cms-headless

## Objectif
Permettre à **non-techniciens** (traducteurs, marketeurs, auteur) d'éditer :
- `translations.json` (UI, livres, offres, Hero Fan)
- Articles blog (`src/content/blog/`)
- Sans toucher au code, sans Git, via interface visuelle.

---

## Options CMS Headless (Comparatif)

| CMS | Coût | Git Backend | Champs Répétables | Multilingue | Preview | Idéal Pour |
|-----|------|-------------|-------------------|-------------|---------|------------|
| **Decap CMS** (ex Netlify CMS) | Gratuit | GitHub/GitLab/Bitbucket | ✅ (list) | ✅ (collections par langue) | Netlify/Vercel Preview | **Recommandé** — Simple, gratuit, Git-based |
| **CloudCannon** | $0-300/mois | GitHub/GitLab | ✅ (array) | ✅ (locales) | CloudCannon + Netlify | Équipes non-tech, visuel fort, éditeurs WYSIWYG |
| **TinaCMS** | Gratuit (self-host) / $ | GitHub | ✅ (blocks) | ✅ (locale field) | Vercel/Netlify | Inline editing (clic sur page), React-based |
| **Sanity.io** | Gratuit ≤ 10k docs | Hosted (pas Git natif) | ✅ | ✅ | Sanity + Vercel | Contenu structuré complexe, APIs, écosystème |
| **Contentful** | Payant | Hosted | ✅ | ✅ | Contentful + Vercel | Enterprise, gros volumes |

---

## Recommandation : **Decap CMS** (Gratuit, Git-based, Simple)

### Pourquoi
- **Gratuit** open source (MIT)
- **Git-based** : Commits automatiques sur `main` → Déclenche CI/CD Vercel
- **Multilingue natif** : Collections par langue (`fr`, `en`, `es`...)
- **Champs répétés** : `list` pour `bookData`, `offers`, `languages`, `faq.items`, `blog posts`
- **Preview** : Netlify Deploy Previews ou Vercel Preview URLs
- **Auth** : GitHub/GitLab OAuth (équipe existante)
- **Pas de vendor lock-in** : Données = fichiers JSON/MD dans repo

---

## Configuration Decap CMS (`public/admin/`)

### Structure
```
public/admin/
├── index.html                    # Entry point Decap
├── config.yml                    # Configuration complète
├── locales/                      # Traductions interface CMS
│   ├── fr.yml
│   ├── en.yml
│   └── ...
└── preview-templates/            # Templates preview (optionnel)
    ├── index.html
    └── blog.html
```

### `public/admin/config.yml` (Complet)
```yaml
# Decap CMS Config pour Kiki en Christ
backend:
  name: github
  repo: ton-user/kikienchrist-vercel-sync  # ← Remplacer
  branch: main
  base_url: https://api.github.com
  auth_endpoint: github
  use_graphql: true

media_folder: public/images/uploads
public_folder: /images/uploads

site_url: https://kikienchrist.vercel.app
display_url: https://kikienchrist.vercel.app

locale: fr
locales: [fr, en, es, de, pt, it, ru, zh, hi]

# ─── COLLECTIONS ───

collections:
  # 1. TRADUCTIONS UI (par langue)
  - name: "ui-translations"
    label: "Traductions UI"
    folder: "src/data/translations"
    create: false
    delete: false
    slug: "{{locale}}"
    fields:
      - { label: "Langue", name: "locale", widget: "hidden", default: "fr" }
      - label: "Hero"
        name: "hero"
        widget: "object"
        fields:
          - { label: "Eyebrow", name: "eyebrow", widget: "string" }
          - { label: "Titre", name: "title", widget: "string" }
          - { label: "Sous-titre", name: "subtitle", widget: "text" }
          - { label: "CTA Principal", name: "ctaPrimary", widget: "string" }
          - { label: "CTA Secondaire", name: "ctaGhost", widget: "string" }
      - label: "Books Section"
        name: "books"
        widget: "object"
        fields:
          - { label: "Prefixe Série", name: "seriesPrefix", widget: "string" }
          - { label: "Accroche", name: "hook", widget: "text" }
          - { label: "Bénéfices (3)", name: "benefits", widget: "list", fields: [{ name: "item", widget: "string" }] }
          - { label: "Suffixe Pages", name: "metaSuffix", widget: "string" }
          - { label: "Label Langues", name: "languagesLabel", widget: "string" }
          - { label: "Langues Globales", name: "languages", widget: "list", fields: [
              { label: "Code", name: "code", widget: "string" },
              { label: "Nom", name: "name", widget: "string" },
              { label: "Format", name: "fmt", widget: "string" }
            ]}
      - label: "Bandeau Formats"
        name: "bandeau"
        widget: "object"
        fields:
          - { label: "Papier", name: "paper", widget: "string" }
          - { label: "Ebook", name: "ebook", widget: "string" }
          - { label: "Audio", name: "audio", widget: "string" }
      - label: "Newsletter"
        name: "newsletter"
        widget: "object"
        fields:
          - { label: "Titre", name: "title", widget: "string" }
          - { label: "Description", name: "description", widget: "text" }
          - { label: "Placeholder", name: "placeholder", widget: "string" }
          - { label: "Texte Bouton", name: "buttonText", widget: "string" }
          - { label: "Mentions RGPD", name: "tinyText", widget: "text" }
      - label: "FAQ"
        name: "faq"
        widget: "object"
        fields:
          - { label: "Titre", name: "title", widget: "string" }
          - { label: "Items", name: "items", widget: "list", fields: [
              { label: "Question", name: "q", widget: "string" },
              { label: "Réponse", name: "a", widget: "text" }
            ]}
      - label: "Footer"
        name: "footer"
        widget: "object"
        fields:
          - { label: "Navigation", name: "nav", widget: "list", fields: [{ name: "item", widget: "string" }] }
          - { label: "Droits", name: "rights", widget: "string" }
          - { label: "Made With", name: "madeWith", widget: "string" }
          - { label: "Language Switcher Label", name: "languageSwitcher.label", widget: "string" }
          - { label: "Language Switcher AriaLabel", name: "languageSwitcher.ariaLabel", widget: "string" }
      - label: "CTA Strip"
        name: "cta"
        widget: "object"
        fields:
          - { label: "Texte", name: "text", widget: "text" }
          - { label: "Texte Bouton", name: "buttonText", widget: "string" }
          - { label: "Href Bouton", name: "buttonHref", widget: "string" }

  # 2. LIVRES (bookData) — Par langue
  - name: "books"
    label: "Livres"
    folder: "src/data/books"
    create: true
    slug: "{{locale}}-{{slug}}"
    fields:
      - { label: "Langue", name: "locale", widget: "select", options: ["fr", "en", "es", "de", "pt", "it", "ru", "zh", "hi"] }
      - { label: "ID Livre", name: "bookId", widget: "select", options: ["visage", "trinite", "combat", "salut"] }
      - { label: "Titre", name: "name", widget: "string" }
      - { label: "Description", name: "description", widget: "text" }
      - { label: "Image Couverture (ImgBB URL)", name: "coverImage", widget: "string", pattern: ['^https://i\\.ibb\\.co/.*\\.(jpg|png)$', 'URL ImgBB invalide'] }
      - label: "Offres d'Achat"
        name: "offers"
        widget: "list"
        fields:
          - { label: "Prix", name: "price", widget: "string", pattern: ['^\\d+(\\.\\d{1,2})?$', 'Format: 13.90'] }
          - { label: "Devise", name: "priceCurrency", widget: "select", options: ["EUR", "USD"] }
          - { label: "URL", name: "url", widget: "string", pattern: ['^https://.*', 'URL invalide'] }
          - { label: "Vendeur", name: "seller.name", widget: "select", options: ["Lulu", "Payhip", "Google Play"] }
          - { label: "Disponibilité", name: "availability", widget: "hidden", default: "https://schema.org/InStock" }
      - { label: "Label Langues", name: "languagesLabel", widget: "string" }
      - label: "Langues Disponibles (pour CE livre)"
        name: "languages"
        widget: "list"
        fields:
          - { label: "Code", name: "code", widget: "select", options: ["fr", "en", "es", "de", "pt", "it", "ru", "zh", "hi"] }
          - { label: "Nom (dans langue courante)", name: "name", widget: "string" }
          - { label: "Formats", name: "fmt", widget: "string" }

  # 3. HERO FAN IMAGES (4 miniatures par langue)
  - name: "hero-fan"
    label: "Hero Fan Images"
    folder: "src/data/hero-fan"
    create: false
    delete: false
    slug: "{{locale}}"
    fields:
      - { label: "Langue", name: "locale", widget: "hidden", default: "fr" }
      - label: "Miniatures (ordre: Visage, Trinité, Combat, Salut)"
        name: "fanImages"
        widget: "list"
        fields:
          - { label: "URL ImgBB", name: "url", widget: "string", pattern: ['^https://i\\.ibb\\.co/.*\\.(jpg|png)$', 'URL ImgBB invalide'] }

  # 4. BLOG ARTICLES (Multilingue)
  - name: "blog"
    label: "Articles Blog"
    folder: "src/content/blog"
    create: true
    slug: "{{locale}}/{{slug}}"
    fields:
      - { label: "Langue", name: "lang", widget: "select", options: ["fr", "en", "es", "de", "pt", "it", "ru", "zh", "hi"] }
      - { label: "Titre", name: "title", widget: "string" }
      - { label: "Description (SEO)", name: "description", widget: "text" }
      - { label: "Date Publication", name: "pubDate", widget: "datetime", format: "YYYY-MM-DD" }
      - { label: "Auteur", name: "author", widget: "string", default: "Kiki en Christ" }
      - { label: "Tags", name: "tags", widget: "list", fields: [{ name: "tag", widget: "string" }] }
      - { label: "Image Hero", name: "image", widget: "image", required: false }
      - { label: "Canonical URL", name: "canonical", widget: "string", required: false }
      - { label: "Featured", name: "featured", widget: "boolean", default: false }
      - { label: "Contenu (Markdown)", name: "body", widget: "markdown" }

# ─── GLOBAL SETTINGS (Optionnel) ───
# Pour config site-wide (ex: GA ID, Sentry DSN) — mais secrets pas ici !
# settings:
#   - label: "Site Settings"
#     name: "site"
#     fields:
#       - { label: "GA4 ID", name: "gaId", widget: "string" }
```

---

## Structure Fichiers Données (Adapter l'Existant)

### Actuel : `src/data/translations.json` (Monolithique)
### Pour Decap CMS : Split en fichiers par collection + langue

```
src/data/
├── translations/
│   ├── fr.json
│   ├── en.json
│   ├── es.json
│   ├── de.json
│   ├── pt.json
│   ├── it.json
│   ├── ru.json
│   ├── zh.json
│   └── hi.json
├── books/
│   ├── fr-visage.json
│   ├── fr-trinite.json
│   ├── fr-combat.json
│   ├── fr-salut.json
│   ├── en-visage.json
│   └── ... (36 fichiers = 9 langues × 4 livres)
└── hero-fan/
    ├── fr.json
    ├── en.json
    └── ... (9 fichiers)
```

### Migration Script (One-Time)
```javascript
// scripts/split-translations-for-cms.js
import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('src/data/translations.json', 'utf-8'));
const langs = Object.keys(data);

// 1. UI Translations
fs.mkdirSync('src/data/translations', { recursive: true });
langs.forEach(lang => {
  const { bookData, ...ui } = data[lang];
  fs.writeFileSync(`src/data/translations/${lang}.json`, JSON.stringify(ui, null, 2));
});

// 2. Books
fs.mkdirSync('src/data/books', { recursive: true });
langs.forEach(lang => {
  Object.entries(data[lang].bookData).forEach(([bookId, book]) => {
    fs.writeFileSync(`src/data/books/${lang}-${bookId}.json`, JSON.stringify({ locale: lang, bookId, ...book }, null, 2));
  });
});

// 3. Hero Fan
fs.mkdirSync('src/data/hero-fan', { recursive: true });
langs.forEach(lang => {
  // fanImages sont dans [lang]/index.astro → extraire manuellement ou script séparé
  // Pour l'instant : créer structure vide
  fs.writeFileSync(`src/data/hero-fan/${lang}.json`, JSON.stringify({ locale: lang, fanImages: [] }, null, 2));
});

console.log('✅ Migration done. Commit & push.');
```

### Adapter Code Astro (Chargeurs Dynamiques)
```typescript
// src/utils/cms-loaders.ts
import { glob } from 'astro/loaders';

export const uiTranslationsLoader = glob({ pattern: '**/*.json', base: './src/data/translations' });
export const booksLoader = glob({ pattern: '**/*.json', base: './src/data/books' });
export const heroFanLoader = glob({ pattern: '**/*.json', base: './src/data/hero-fan' });

// Dans astro.config.mjs → content.collections
// Utiliser ces loaders au lieu du gros translations.json
```

---

## Workflow Éditeur (Non-Technicien)

### 1. Accès
- URL : `https://kikienchrist.vercel.app/admin/` (servi depuis `public/admin/`)
- Auth : GitHub OAuth → Membre repo avec write access

### 2. Modifier Traduction UI
1. Menu "Traductions UI" → Choisir langue
2. Modifier champs (Hero, Books, FAQ, Footer...)
3. "Save" → Commit auto sur `main` → Vercel Preview Deploy
4. Review Preview URL → "Publish" → Merge → Prod Deploy

### 3. Modifier Livre
1. Menu "Livres" → "New Book Entry" ou éditer existant
2. Remplir : Titre, Description, URL ImgBB couverture, Offres (Lulu/Payhip/GP), Langues dispo
3. Save → Commit → Preview → Publish

### 4. Modifier Hero Fan
1. Menu "Hero Fan Images" → Langue
2. 4 URLs ImgBB (ordre Visage, Trinité, Combat, Salut)
2. Save → Commit → Preview

### 5. Écrire Article Blog
1. Menu "Articles Blog" → "New"
2. Choisir langue, remplir frontmatter + contenu Markdown
3. Upload image hero via Media Library
4. Save → Commit → Preview

---

## Preview Deploy (Critique pour Validation)

### Netlify (Recommandé pour Decap CMS)
- Décap CMS configuré pour Netlify Identity / Git Gateway
- Preview URLs auto : `https://deploy-preview-123--kikienchrist.netlify.app/fr/`

### Vercel (Alternative)
- Decap CMS peut utiliser Vercel Preview URLs via `vercel-action` commentaires PR
- Configurer `vercel.json` + GitHub Actions pour poster preview URL sur commit

---

## Sécurité & Gouvernance

### Rôles Decap CMS
```yaml
# Dans config.yml (si Git Gateway / Netlify Identity)
backend:
  name: git-gateway
  branch: main
  # Rôles : admin, editor, viewer
```

### Validation Côté CMS
- `pattern` sur champs URL (ImgBB, Lulu, Payhip, GP)
- `required` sur champs critiques
- `select` options limitées (seller, langues, devises)
- **Pas de validation métier** (ex: "URL existe vraiment") → Faire en CI build

### Secrets
- **JAMAIS** dans CMS (config.yml, collections)
- Secrets = Vercel Environment Variables uniquement
- CMS n'édite que `public/` + `src/data/` (contenu public)

---

## Migration Progressive (Sans Casser l'Existant)

### Phase 1 : Setup Decap CMS en Parallèle
1. Créer `public/admin/config.yml` + `index.html`
2. Deploy → Test `https://kikienchrist.vercel.app/admin/`
3. Valider édition UI + Livres + Hero Fan + Blog

### Phase 2 : Split `translations.json` (Script Migration)
1. Exécuter `scripts/split-translations-for-cms.js`
2. Adapter `src/pages/[lang]/index.astro` pour charger depuis nouveaux loaders
3. Test build local + toutes langues

### Phase 3 : Basculer Édition
1. Équipe utilise Decap CMS pour modifications
2. `translations.json` monolithique → Supprimé (gardé en archive Git)
3. CI/CD valide nouveaux formats

### Phase 4 : Nettoyage
- Supprimer ancien code chargement `translations.json`
- Documenter nouveaux workflows dans skills

---

## Coûts & Maintenance

| Poste | Coût |
|-------|------|
| **Decap CMS** | Gratuit (open source) |
| **Hébergement Admin** | Inclus dans Vercel Static (`public/admin/`) |
| **Auth GitHub** | Gratuit (OAuth App) |
| **Preview Deploys** | Vercel (inclus) ou Netlify (gratuit) |
| **Maintenance** | Mises à jour Decap CMS (npm update) |

---

*Skill créé le 2025-11-20. CMS Headless = autonomie éditeurs + workflow Git natif + zéro coût.*