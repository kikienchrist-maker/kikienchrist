# Kiki en Christ — Site Multilingue Livres Chrétiens

Site statique multilingue (9 langues) pour la vente de livres chrétiens, construit avec **Astro 4.16**, déployé sur **Vercel**.

## 🌍 Langues Supportées
- Français (fr) — *Par défaut*
- English (en)
- Español (es)
- Português (pt)
- Italiano (it)
- Deutsch (de)
- Nederlands (nl)
- Polski (pl)
- العربية (ar) — *RTL*

## 🏗️ Stack Technique
- **Framework**: Astro 4.16 (Static Site Generation)
- **Langage**: TypeScript (strict mode)
- **Styling**: CSS Custom Properties (`lafoidieu-design.css`) — Mobile-first, pas de framework CSS
- **Images**: ImgBB / Payhip CDN + `@astrojs/image` (optimisation Avif/WebP)
- **Déploiement**: Vercel (Edge Middleware pour i18n)
- **Formulaires**: Netlify Functions (Newsletter → MailerLite)
- **Analytics**: Vercel Analytics + Speed Insights
- **Tests**: Vitest (unit) + Playwright (E2E + a11y)
- **CI/CD**: GitHub Actions

## 📁 Structure du Projet

```
kikienchrist-vercel-sync/
├── src/
│   ├── components/           # Composants Astro réutilisables
│   │   ├── blog/            # Composants Blog (12 composants)
│   │   ├── Breadcrumb.astro
│   │   ├── NewsletterForm.astro
│   │   ├── Pagination.astro
│   │   ├── ReadingProgress.astro
│   │   ├── SocialShare.astro
│   │   └── TableOfContents.astro
│   ├── content/
│   │   ├── config.ts        # Collections Astro (blog, authors, legalPages)
│   │   ├── blog/            # Articles Markdown par langue
│   │   │   ├── fr/
│   │   │   ├── en/
│   │   │   ├── es/
│   │   │   ├── pt/
│   │   │   ├── it/
│   │   │   ├── de/
│   │   │   ├── nl/
│   │   │   ├── pl/
│   │   │   └── ar/
│   │   ├── authors/         # Données auteurs (JSON)
│   │   └── legalPages/      # Pages légales multilingues (Markdown)
│   ├── data/
│   │   └── translations.json # Tout le contenu UI (9 langues)
│   ├── layouts/
│   │   └── MainLayout.astro # Layout principal + SEO + JSON-LD
│   ├── pages/
│   │   ├── [lang]/          # Routes dynamiques par langue
│   │   │   ├── index.astro  # Page d'accueil
│   │   │   ├── blog/        # Blog (index, article, catégorie, tag, série)
│   │   │   ├── livres/      # Catalogue livres
│   │   │   └── ...          # Autres pages
│   │   └── rss.xml.js       # Flux RSS
│   ├── styles/
│   │   └── lafoidieu-design.css # Design system complet
│   └── utils/
│       ├── blog.ts          # Utilitaires blog (JSON-LD, related posts, etc.)
│       └── blog.test.ts     # Tests unitaires
├── netlify/
│   └── functions/
│       ├── newsletter.js    # Inscription newsletter (MailerLite)
│       └── newsletter.test.js
├── tests/
│   ├── e2e/                 # Tests Playwright
│   │   └── blog.spec.ts
│   └── unit/                # Tests Vitest
├── public/
│   ├── admin/               # Decap CMS (à configurer)
│   └── images/              # Assets statiques
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Pipeline CI/CD principal
│   │   └── blog-ci.yml      # Pipeline blog spécifique
│   └── lighthouse/
│       ├── ci-budget.json   # Budgets Lighthouse (site)
│       └── blog-budget.json # Budgets Lighthouse (blog)
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── vercel.json              # Config Vercel (headers, rewrites)
```

## 🚀 Commandes

```bash
# Développement
npm run dev          # Serveur dev (localhost:4321)
npm run start        # Alias dev

# Build & Preview
npm run build        # Build production (dist/)
npm run preview      # Preview build local

# Qualité
npm run lint         # ESLint
npm run lint:fix     # ESLint + auto-fix
npm run format       # Prettier
npm run check        # Astro content validation + TypeScript
npm run sync         # Astro sync (génère types)

# Tests
npm run test         # Vitest (unit)
npm run test:watch   # Vitest watch mode
npm run test:coverage # Couverture de code
npm run test:e2e     # Playwright (E2E)
npm run test:a11y    # Tests accessibilité

# Déploiement
npm run deploy       # Build + Vercel prod
npm run deploy:preview # Build + Vercel preview
```

## 📝 Collections de Contenu (Astro Content Collections)

### Blog (`src/content/blog/{lang}/`)
Articles Markdown avec frontmatter Zod-validé :
```yaml
---
title: "Titre Article"
description: "Description SEO (10-300 chars)"
pubDate: "2025-11-20T07:00:00+01:00"  # ISO 8601 avec TZ
updatedDate: "2025-11-21T07:00:00+01:00"
author: "Nom Auteur"
authorRole: "Rôle"
lang: "fr"  # fr|en|es|pt|it|de|nl|pl|ar
translationKey: "clé-traduction"  # Lie les versions multilingues
category: "prière"  # prière|formation|témoignage|vie-chrétienne|famille|mission|actualité|ressource
tags: ["tag1", "tag2"]
series: "Nom Série"
seriesOrder: 1
featured: true
draft: false
readingTime: 8
isLeadMagnet: true
leadMagnetTitle: "Titre Lead Magnet"
leadMagnetDescription: "Description"
leadMagnetFile: "https://.../guide.pdf"
relatedPodcastEpisode: "ep-001"
relatedVideo: "https://youtube.com/..."
canonicalURL: "https://kikienchrist.com/fr/blog/..."
ogImage: "https://ik.imagekit.io/..."
ogTitle: "Titre OG"
ogDescription: "Desc OG"
structuredData:
  type: "BlogPosting"
  wordCount: 1850
---
```

### Auteurs (`src/content/authors/`)
Fichiers JSON par auteur.

### Pages Légales (`src/content/legalPages/`)
Markdown multilingue pour mentions légales, confidentialité, cookies, CGV, accessibilité.

## 🔧 Configuration i18n

### Middleware Vercel (`middleware.ts`)
- Détecte `Accept-Language`
- Définit cookie `preferred-lang`
- Redirige `/` → `/{lang}/`

### Hreflang + x-default
Dans `MainLayout.astro` pour chaque page.

### Fallback
`_redirects` + script client pour navigateurs sans JS.

## 📚 Blog MVP — Fonctionnalités

| Fonctionnalité | Composant | Statut |
|---|---|---|
| Collections Astro (Zod) | `src/content/config.ts` | ✅ |
| Article complet (SEO, JSON-LD) | `BlogPost.astro` | ✅ |
| Index avec filtres/pagination | `BlogIndex.astro` | ✅ |
| Carte article réutilisable | `BlogPostCard.astro` | ✅ |
| Articles liés (scoring) | `RelatedPosts.astro` | ✅ |
| Filtre catégories + compteurs | `CategoryFilter.astro` | ✅ |
| Nuage de tags | `TagCloud.astro` | ✅ |
| Table des matières auto | `TableOfContents.astro` | ✅ |
| Barre progression lecture | `ReadingProgress.astro` | ✅ |
| Pagination accessible | `Pagination.astro` | ✅ |
| Fil d'Ariane + JSON-LD | `Breadcrumb.astro` | ✅ |
| Partage social (Web Share API) | `SocialShare.astro` | ✅ |
| Newsletter (Netlify + MailerLite) | `NewsletterForm.astro` | ✅ |
| Lead Magnets (PDF download) | Intégré | ✅ |
| Routes dynamiques (9 langues) | `[lang]/blog/[...slug].astro` | ✅ |
| Tests unitaires (Vitest) | `blog.test.ts` | ✅ |
| Tests E2E (Playwright) | `blog.spec.ts` | ✅ |
| CI/CD GitHub Actions | `blog-ci.yml` | ✅ |

## 🎨 Design System (`lafoidieu-design.css`)

Variables CSS personnalisées :
- **Couleurs**: `--color-ink`, `--color-paper`, `--color-gold`, `--color-gold-dark`, `--color-gold-light`, `--color-success`, `--color-error`, `--color-border`
- **Typographie**: `--font-sans`, `--font-serif`, `--text-xs` à `--text-5xl`
- **Espacement**: `--space-xs` à `--space-3xl`
- **Border Radius**: `--radius-sm` à `--radius-full`
- **Ombres**: `--shadow-sm` à `--shadow-xl`
- **Transitions**: `--transition-fast` à `--transition-slow`
- **Breakpoints**: Mobile-first (480, 768, 1024, 1280px)

## 🔒 Sécurité & Secrets

**Aucun secret dans le repo.** Variables d'environnement Vercel :
- `PUBLIC_*` → côté client (ex: `PUBLIC_SITE_URL`)
- Autres → côté serveur uniquement (API keys, DB urls)

## 📦 Déploiement

```bash
# Production
npm run deploy
# ou
npm run build && vercel --prod --force

# Preview (PR)
npm run deploy:preview
```

## 🧪 Tests

```bash
# Unit (Vitest)
npm run test

# E2E (Playwright) - nécessite build + preview server
npm run build && npm run preview &
npm run test:e2e

# Accessibilité (axe-core via Playwright)
npm run test:e2e -- --project=chromium-a11y
```

## 📊 Monitoring

- **Vercel Analytics** : Trafic, Web Vitals
- **Vercel Speed Insights** : Performance Core Web Vitals
- **Sentry** : Error tracking (à configurer)
- **Lighthouse CI** : Budgets performance/SEO/a11y dans CI

## 📖 Documentation Complète

Voir `.agents/skills/` pour 43 compétences détaillées :
- Déploiement, traductions, middleware, SEO, design system
- Blog MVP, newsletter, paiements, légal, accessibilité
- Content strategy, email marketing, automation, disaster recovery
- Et bien plus...

## 🤝 Contribution

1. Fork & clone
2. `npm ci`
3. Créer branche `feature/nom`
4. Développer + tests
5. `npm run check` + `npm run test`
6. PR vers `main`

## 📄 Licence

Propriétaire — Kiki en Christ. Tous droits réservés.

---

**Site live** : https://kikienchrist.vercel.app  
**Source boutique** : https://lafoidieu.wordpress.com/boutique/  
**Contact** : équipe@kikienchrist.com