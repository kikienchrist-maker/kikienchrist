---
name: kikienchrist-tech-stack
description: "Référence Technique Complète (Stack, Architecture, Commandes, Config, Dépannage, Workflows) — Version Étendue"
version: "1.1"
---

# Skill: kikienchrist-tech-stack

## Stack Technique

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| **Framework** | Astro | 4.16.x | SSG (Static Site Generation) + i18n routing + Content Collections |
| **Langage** | TypeScript | 5.3+ | Type safety (config, middleware, utils, collections) |
| **Styling** | CSS Vanilla | - | Design System `lafoidieu-design.css` (tokens, composants, responsive) |
| **Deploy** | Vercel | - | Edge Middleware, Static Hosting, Analytics, Speed Insights, Blob Storage |
| **Runtime Edge** | Vercel Edge | Standard | Middleware détection langue (Pas Node.js — Web APIs only) |
| **Forms** | Netlify Forms | - | Newsletter (zero-JS, build-time detection) |
| **Images** | ImgBB + Payhip CDN + Vercel Blob (futur) | - | Couvertures (1500px), Hero Fan, Blog images optimisées |
| **Data** | JSON + Markdown (Collections) | - | `translations.json` (source unique vérité) + `src/content/blog/` |
| **Schema.org** | JSON-LD | - | Book, ItemList, FAQPage, BlogPosting, BreadcrumbList, WebSite |
| **Package Manager** | npm | 10.x | Dépendances |
| **Node** | Node.js | ≥18.14.1 | Build local + Vercel |
| **Email** | MailerLite / Brevo / ConvertKit | - | Newsletter automation (via webhook Netlify) |
| **Monitoring** | Vercel Analytics + Speed Insights + Sentry + UptimeRobot | - | RUM, CWV, Error tracking, Uptime |
| **Social** | Buffer / Later / Metricool | - | Planification réseaux sociaux |

## Architecture Fichiers (Complète)

```
kikienchrist-vercel-sync/
├── public/
│   ├── styles/
│   │   └── lafoidieu-design.css          # Design System (copié de src/styles à la build)
│   ├── _redirects                         # Fallback statique i18n (racine → /fr/)
│   ├── robots.txt                         # (à créer)
│   ├── images/
│   │   ├── blog/                          # Images blog optimisées (WebP/AVIF)
│   │   └── backups/                       # Backup ImgBB (local)
│   └── fonts/                             # (si web fonts futures)
├── src/
│   ├── pages/
│   │   ├── index.astro                    # Racine / → redirect client + fallback _redirects
│   │   ├── [lang]/
│   │   │   ├── index.astro                # SEULE page rendue ×9 (fr/en/es/de/pt/it/ru/zh/hi)
│   │   │   └── blog/
│   │   │       ├── index.astro            # Index blog par langue
│   │   │       └── [slug].astro           # Article blog (BlogPost.astro)
│   │   └── rss.xml.js                     # Génération RSS multilingue
│   ├── components/
│   │   ├── Hero.astro                     # Hero + Fan 4 miniatures
│   │   ├── BookCard.astro                 # Carte livre (props traduites)
│   │   ├── BandeauFormats.astro           # Labels formats (Papier/Ebook/Audio)
│   │   ├── Newsletter.astro               # Netlify Forms
│   │   ├── FAQ.astro                      # Accordion + JSON-LD FAQPage
│   │   ├── CTAStrip.astro                 # CTA vers section livres
│   │   ├── Footer.astro                   # Footer + Language Switcher (inline)
│   │   ├── BlogCard.astro                 # Carte article blog
│   │   ├── BlogPost.astro                 # Article complet + JSON-LD BlogPosting
│   │   ├── LanguageSwitcher.astro         # Sélecteur langue (réutilisable)
│   │   └── SkipLink.astro                 # Accessibilité (skip to main)
│   ├── layouts/
│   │   └── MainLayout.astro               # HTML shell + hreflang + CSS global + meta tags
│   ├── content/
│   │   └── blog/                          # Astro Collections (Markdown multilingue)
│   │       ├── fr/
│   │       ├── en/
│   │       ├── es/
│   │       ├── de/
│   │       ├── pt/
│   │       ├── it/
│   │       ├── ru/
│   │       ├── zh/
│   │       └── hi/
│   ├── data/
│   │   └── translations.json              # TOUT le contenu UI + Livres + Offres + Hero Fan
│   ├── utils/
│   │   ├── i18n.ts                        # SUPPORTED_LANGS, detectLanguageFromHeader, hreflang
│   │   ├── seo.ts                         # Génération JSON-LD, meta tags, sitemap helpers
│   │   ├── image.ts                       # Helpers optimisation images (Vercel Blob)
│   │   └── analytics.ts                   # Event tracking helpers (GA4, Vercel)
│   ├── middleware.ts                      # Vercel Edge Middleware (détection langue + redirect)
│   └── styles/
│       └── lafoidieu-design.css           # Source Design System
├── astro.config.mjs                       # Config Astro (i18n, collections, integrations)
├── package.json                           # Dépendances + scripts
├── vercel.json                            # Headers, rewrites, config Vercel
├── tsconfig.json                          # TypeScript config
├── .env.example                           # Template variables d'env
└── PROJECT_CONTEXT.md                     # Contexte projet (racine)
```

## Commandes Essentielles

### Développement Local
```bash
cd "C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync"

# Install deps
npm install

# Dev server (AVEC middleware Edge via vercel dev)
vercel dev
# → http://localhost:3000 (middleware actif)
# → Test i18n : Header Accept-Language ou cookie preferred-lang

# Dev server Astro seul (SANS middleware)
npm run dev
# → http://localhost:4321 (pas de redirect i18n auto)

# Build production local
npm run build        # → dist/ (10 pages + blog + rss + sitemap)

# Preview build local
npm run preview      # Sert dist/ sur localhost:4321

# TypeScript check
npx astro check

# Lint
npm run lint
```

### Déploiement
```bash
# Build + Deploy Production (FORCE = bypass cache Vercel)
npm run build && vercel --prod --force

# Deploy Preview (branch/PR automatique via Git push)
vercel
# ou push sur main → Vercel Git Integration

# Rollback
vercel rollback <deployment-url>
# ou redeploy commit précédent
vercel redeploy <deployment-id>

# Logs déploiement
vercel logs <deployment-url>
vercel logs <deployment-url> --filter=middleware
vercel logs <deployment-url> --since=1h
```

### Content & Blog
```bash
# Nouvel article blog (template)
# Créer src/content/blog/fr/mon-article.md avec frontmatter

# Vérifier collections
npx astro check  # Valide schemas Zod

# Générer sitemap/RSS (auto au build)
npm run build
```

---

## Configuration Clés

### `astro.config.mjs` (Complet)
```javascript
import { defineConfig } from 'astro/config';
import { glob } from 'astro/loaders';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image'; // Pour optimisation images futures

export default defineConfig({
  site: 'https://kikienchrist.vercel.app',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
  vite: {
    build: { cssCodeSplit: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/fr/') && !page.endsWith('/en/') /* ... toutes langues */, // Inclure toutes
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    image({ service: { entrypoint: 'astro/assets/services/sharp' } }), // Pour @astrojs/image
  ],
  content: {
    collections: {
      blog: {
        loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
        schema: ({ z }) => ({
          title: z.string(),
          description: z.string(),
          pubDate: z.date(),
          author: z.string().default('Kiki en Christ'),
          tags: z.array(z.string()).default([]),
          image: z.string().optional(),
          canonical: z.string().optional(),
          lang: z.enum(['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi']).default('fr'),
          featured: z.boolean().default(false),
        }),
      },
    },
  },
});
```

### `vercel.json` (Complet)
```json
{
  "headers": [
    { "source": "/styles/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/images/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }] },
    { "source": "/blog/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600, must-revalidate" }] }
  ],
  "rewrites": [
    { "source": "/:lang/(.*)", "destination": "/:lang/index.html" },
    { "source": "/:lang/blog/:slug", "destination": "/:lang/blog/:slug/index.html" }
  ],
  "crons": []
}
```

### `package.json` (Scripts Complets)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint src --ext .astro,.ts,.js",
    "format": "prettier --write src/",
    "deploy": "npm run build && vercel --prod --force",
    "deploy:preview": "vercel",
    "content:validate": "npx astro check"
  },
  "engines": { "node": ">=18.14.1" },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@astrojs/image": "^0.18.0",
    "@astrojs/sitemap": "^3.1.0",
    "astro": "^4.16.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "prettier-plugin-astro": "^0.13.0",
    "sharp": "^0.33.0",
    "typescript": "^5.3.0"
  }
}
```

### `tsconfig.json`
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["astro/client"]
  }
}
```

### `.env.example` (Template)
```bash
# Variables publiques (exposées côté client via import.meta.env.PUBLIC_*)
PUBLIC_SITE_URL=https://kikienchrist.vercel.app
PUBLIC_GA_ID=G-XXXXXXXXXX

# Secrets (UNIQUEMENT server/edge — JAMAIS PUBLIC_*)
SENTRY_DSN=https://xxxx@sentry.io/xxxx
MAILERLITE_API_KEY=xxxx
NETLIFY_FORM_WEBHOOK_SECRET=xxxx
```

---

## Middleware Edge (Critique — `src/middleware.ts`)

### Code Complet Référence
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import { SUPPORTED_LANGS, DEFAULT_LANG, detectLanguageFromHeader } from './utils/i18n';

export const config = {
  matcher: [
    '/((?!_next|api|styles|images|fonts|favicon|robots|sitemap|_vercel|blog/rss).*)',
  ],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // 1. Déjà localisé (/fr/, /en/, /fr/blog/...) → Pass through
  const localeMatch = pathname.match(/^\/(fr|en|es|de|pt|it|ru|zh|hi)(\/|$)/);
  if (localeMatch) {
    const response = NextResponse.next();
    const currentLang = localeMatch[1];
    const cookieLang = request.cookies.get('preferred-lang')?.value;
    
    // Mettre à jour cookie si navigation manuelle vers autre langue
    if (cookieLang !== currentLang && SUPPORTED_LANGS.includes(currentLang)) {
      response.cookies.set('preferred-lang', currentLang, {
        maxAge: 31536000,
        path: '/',
        sameSite: 'lax',
        secure: true,
      });
    }
    return response;
  }
  
  // 2. Racine "/" → Détecter langue + Redirect 302
  if (pathname === '/' || pathname === '') {
    const acceptLang = request.headers.get('accept-language') || '';
    const detected = detectLanguageFromHeader(acceptLang);
    const preferred = request.cookies.get('preferred-lang')?.value;
    const targetLang = preferred && SUPPORTED_LANGS.includes(preferred) ? preferred : detected;
    
    const redirectUrl = new URL(`/${targetLang}/`, request.url);
    redirectUrl.search = url.search;
    
    const response = NextResponse.redirect(redirectUrl, 302);
    // CRITIQUE : Empêcher cache CDN sur redirect
    response.headers.set('Cache-Control', 'private, no-store, must-revalidate');
    return response;
  }
  
  // 3. Autres (assets, etc.) → Pass through
  return NextResponse.next();
}
```

### `src/utils/i18n.ts` (Complet)
```typescript
// src/utils/i18n.ts
export const SUPPORTED_LANGS = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: SupportedLang = 'fr';

export function detectLanguageFromHeader(header: string): SupportedLang {
  const prefs = header.split(',').map(p => {
    const [lang, q] = p.split(';');
    return { lang: lang.trim().split('-')[0].toLowerCase(), q: q ? parseFloat(q.split('=')[1]) : 1 };
  }).sort((a, b) => b.q - a.q);
  
  for (const p of prefs) {
    if (SUPPORTED_LANGS.includes(p.lang as SupportedLang)) return p.lang as SupportedLang;
  }
  return DEFAULT_LANG;
}

export function generateHreflangLinks(pathname: string, currentLang: SupportedLang): string[] {
  const base = 'https://kikienchrist.vercel.app';
  const links = SUPPORTED_LANGS.map(lang => 
    `<link rel="alternate" hreflang="${lang}" href="${base}/${lang}${pathname}" />`
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${base}/" />`);
  return links;
}

export function getLocalizedUrls(pathname: string) {
  const base = 'https://kikienchrist.vercel.app';
  return SUPPORTED_LANGS.reduce((acc, lang) => {
    acc[lang] = `${base}/${lang}${pathname}`;
    return acc;
  }, {} as Record<SupportedLang, string>);
}
```

---

## Data Flow (Contenu)

```
translations.json (source unique UI + Livres)
    ↓
src/pages/[lang]/index.astro (getStaticPaths → 9 pages)
    ↓
Props traduites → Composants (Hero, BookCard, Bandeau, Newsletter, FAQ, CTA, Footer)
    ↓
HTML statique ×9 + JSON-LD traduit + hreflang + meta tags

src/content/blog/ (Markdown multilingue)
    ↓
getStaticPaths → Pages blog × langues
    ↓
BlogPost.astro → Article + JSON-LD BlogPosting + hreflang
```

---

## Workflows Opérationnels

### 1. Déployer (Routine)
```bash
npm run build && vercel --prod --force
# Vérifier : 10+ pages built, pas d'erreurs
# Test prod : /fr/, /en/, /blog/, redirect racine
```

### 2. Modifier Contenu (Textes, Prix, URLs)
```bash
# 1. Éditer src/data/translations.json
# 2. Valider JSON (VS Code + npm run build)
# 3. Deploy
npm run build && vercel --prod --force
```

### 3. Ajouter Langue
```bash
# 1. translations.json : Copier "fr" → nouvelle langue (traduire tout)
# 2. src/utils/i18n.ts : Ajouter dans SUPPORTED_LANGS
# 3. [lang]/index.astro : Ajouter fanImages (4 URLs ImgBB)
# 4. Middleware matcher : Vérifier exclusion (auto si SUPPORTED_LANGS utilisé)
# 5. Deploy --force
# 6. Test /xx/ (desktop + mobile)
```

### 4. Mise à Jour Livre
```bash
# 1. translations.json → bookData[livre] : Maj 9 langues (name, description, coverImage, offers, languages, languagesLabel)
# 2. Vérifier URLs offers sur WordPress boutique
# 3. [lang]/index.astro → fanImages : Maj si couv. changée
# 4. Deploy --force
# 5. Test boutons achat 3-4 langues
```

### 5. Nouvel Article Blog
```bash
# 1. Créer src/content/blog/fr/mon-article.md (frontmatter complet)
# 2. Traduire vers 8 autres langues (dossiers src/content/blog/xx/)
# 3. Images : Optimiser → public/images/blog/ (ou Vercel Blob)
# 4. npm run build (valide collections)
# 5. Deploy
```

### 6. Audit Complet Pré-Deploy
```bash
skill("kikienchrist-content-audit")
# Puis deploy si tout vert
```

---

## Dépannage Courant (Étendu)

| Problème | Diagnostic | Solution |
|----------|------------|----------|
| **Build fail : `Expected ")" but found ";"`** | Syntaxe JSON-LD dans `[lang]/index.astro` | Vérifier brackets `{}` vs `[]`, virgules, template literals |
| **`Could not resolve "../layouts/MainLayout.astro"`** | Import path relatif incorrect | Depuis `[lang]/index.astro` → `../../layouts/MainLayout.astro` |
| **Middleware 204 / pas de redirect** | `return new Response(null, {status:204})` | `return NextResponse.next()` ou `void` |
| **Images Hero Fan cassées** | URLs ImgBB invalides | Format `https://i.ibb.co/XXXXXX/fichier.jpg` (direct, pas page HTML) |
| **Hauteurs cartes inégales** | Script JS non exécuté | Vérifier `#books-grid` + script après `</section>` + `setTimeout` |
| **Cache Vercel sert vieille version** | Middleware/HTML en cache | `vercel --prod --force` |
| **Boutons achat → URL FR sur site EN** | `offers` pas localisé dans `translations.json` | Remplir `bookData[livre].offers` par langue |
| **Dropdown montre 9 langues pour Salut** | `languages` global au lieu de par livre | Vérifier `bookData[salut].languages` = FR only |
| **Label "Papier" en FR sur site EN** | Extraction `fmt` ratée | Vérifier `languages.find(l => l.code === book.inLanguage)` |
| **Collection blog invalide** | Frontmatter ne match pas schema Zod | `npx astro check` → corriger types/dates |
| **RSS/Sitemap manquant** | Integration `@astrojs/sitemap` mal configurée | Vérifier `astro.config.mjs` + `site` URL |
| **Fonts externes chargées** | `@import` ou `<link>` dans CSS/HTML | Purger → System UI stack only |

---

## Performance Checklist Build
- [ ] `npm run build` → 10+ pages générées (9 langues + racine + blog + rss)
- [ ] `dist/styles/lafoidieu-design.css` : 1 fichier, minifié, < 70KB gzippé
- [ ] `dist/_astro/*.js` : JS minimal (pas de bundle framework)
- [ ] Images : `width`/`height` explicites sur TOUS `<img>`
- [ ] `vercel.json` : Headers cache immutable sur assets statiques
- [ ] Middleware : `Cache-Control: private, no-store` sur redirect
- [ ] Sitemap.xml : 10+ URLs + blog articles + `lastmod` + `xhtml:link` hreflang
- [ ] RSS feeds : `/fr/rss.xml`, `/en/rss.xml`... valides

---

## Variables d'Environnement (Vercel Dashboard)
```
Settings → Environment Variables

PUBLIC_SITE_URL = https://kikienchrist.vercel.app
PUBLIC_GA_ID = G-XXXXXXXXXX          # GA4 Measurement ID

SENTRY_DSN = https://xxx@sentry.io/xxx
MAILERLITE_API_KEY = xxx
NETLIFY_FORM_WEBHOOK_SECRET = xxx
```

---

*Skill mis à jour le 2025-11-20 (v1.1) — Ajout Astro Collections, Blog, RSS, Sitemap, Config complète, Middleware complet.*