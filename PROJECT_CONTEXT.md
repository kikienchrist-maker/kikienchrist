# Kiki en Christ — Contexte Projet (pour IA)

## Vue d'ensemble
Site web multilingue (9 langues) pour 4 livres spirituels ("Foi en Dieu").
- **URL prod** : https://kikienchrist.vercel.app/
- **Stack** : Astro v4.16 (static export) + Vercel Edge Middleware + Vercel Deploy
- **Langues** : fr (défaut), en, es, de, pt, it, ru, zh, hi
- **Architecture** : `[lang]/index.astro` (route dynamique) + `translations.json` (tout le contenu)

## Structure clé
```
src/
├── pages/
│   ├── index.astro          # Fallback racine + redirect client-side
│   └── [lang]/index.astro   # Page localisée (SEULE page rendue x9)
├── components/
│   ├── BookCard.astro       # Carte livre (props traduites + script égalisation hauteur)
│   ├── Hero.astro           # Hero + "fan" 4 miniatures (URLs ImgBB par locale)
│   ├── BandeauFormats.astro # Labels formats (Papier/Ebook/Audio) traduits
│   ├── Newsletter.astro     # Capture email (Netlify Forms)
│   ├── FAQ.astro            # Accordion FAQ
│   ├── CTAStrip.astro       # Bandeau CTA
│   └── Footer.astro         # Footer + Language Switcher (inline)
├── layouts/
│   └── MainLayout.astro     # HTML shell + hreflang alternates
├── data/
│   └── translations.json    # TOUT le contenu (UI + livres + meta + offres + Hero fan)
├── utils/
│   └── i18n.ts              # SUPPORTED_LANGS, detectLanguageFromHeader, hreflang
├── middleware.ts            # Vercel Edge: détecte Accept-Language, redirect / → /{lang}/
└── styles/ (copié dans public/styles/)
    └── lafoidieu-design.css # Design system complet (tokens, composants, responsive)
```

## Données livres (4 livres)
| ID | Titre FR | Pages | ISBN | Langues dispo |
|----|----------|-------|------|---------------|
| `visage` | Le visage de Dieu : la quête de la spiritualité et de la transcendance | 331 | 9791035977887 | FR, EN, ES, PT, DE (tous formats) |
| `trinite` | Les secrets de la Trinité enfin dévoilés : une critique percutante | 146 | 9781447566359 | FR, EN, ES, PT, DE, IT, RU, ZH, HI (varie selon format) |
| `combat` | Le dernier Combat : garder la Foi | 85 | 9781445771212 | FR, EN, ES, PT, DE, HI |
| `salut` | Le mystère du Salut | 214 | 9781326838447 | FR uniquement |

## Sources d'achat (URLs par langue dans `translations.json` → `bookData[].offers`)
- **Lulu** (Papier) : `lulu.com/shop/...` + variantes `/fr/shop/...`
- **Payhip** (Ebook) : `payhip.com/b/XXXX` — **couvertures 1500px** via `payhip.com/cdn-cgi/image/width=1500/...`
- **Google Play** (Audio) : `play.google.com/store/audiobooks/details?id=...`

**Source canonique** : https://lafoidieu.wordpress.com/boutique/ (WordPress boutique)

## Hero "Fan" (4 miniatures au-dessus du bouton "Découvrir les livres")
- Configuré dans `[lang]/index.astro` → `fanImages` (array 4 URLs ImgBB par locale)
- **Toutes les 9 langues faites** (FR 0/4 skip, EN 4/4, ES 4/4, DE 4/4, PT 4/4, IT 4/4, RU 4/4, ZH 4/4, HI 4/4)
- Images ImgBB directes (`.jpg`/`.png`), haute résolution

## SEO / i18n
- **Middleware Vercel Edge** : `Accept-Language` → redirect 302 `/` → `/{lang}/` + cookie `preferred-lang` (1 an)
- **Fallback statique** : `public/_redirects` + script client dans `index.astro`
- **Hreflang** : `generateHreflangLinks()` dans `MainLayout.astro` → `<link rel="alternate" hreflang="..." href="...">`
- **JSON-LD** : `ItemList` + 4 `Book` avec métadonnées **traduites** (titre, description, image, offres) par langue
- **Sitemap** : généré à la build (astro-sitemap ou manuel)

## Design System (lafoidieu-design.css)
- **Tokens CSS** : `--ink`, `--paper`, `--line`, `--gold-ink`, `--accent`, `--radius`, `--shadow`, etc.
- **Composants** : `.book` (grid 320px/1fr), `.btn`, `.band`, `.fan`, `.cover`, `.prices`, `.langs`, etc.
- **Responsive** : 
  - Desktop ≥981px : 2 col (320px + 1fr), alternance ordre pair/impair
  - Tablette 761-980px : 2 col (250px + 1fr)
  - Mobile ≤760px : 1 col (couverture centrée max 290px)
- **Égalisation hauteur cartes** : script JS inline dans `[lang]/index.astro` (après `#books-grid`) → mesure `getBoundingClientRect()` après chargement images + applique `height: maxHeight` à toutes les `.book`

## Déploiement
```bash
cd kikienchrist-vercel-sync
npm run build && vercel --prod --force
```
- Build statique → `dist/`
- Vercel Edge Middleware actif sur prod
- Cache bust : `--force` pour bypass cache Vercel

## Commandes utiles
```bash
# Build local
npm run build

# Dev local (avec middleware via `vercel dev`)
vercel dev

# Déployer prod (force rebuild)
npm run build && vercel --prod --force

# Vérifier CSS compilé
cat dist/styles/lafoidieu-design.css | grep -A2 ".bq .book"
```

## Points d'attention / Known Issues
1. **Hauteur cartes** : JS requis (CSS `grid-auto-rows: 1fr` ne marche pas sans hauteur parent contrainte)
2. **Images Hero Fan** : URLs ImgBB en dur dans `[lang]/index.astro` → mettre à jour là si changement
3. **Traductions** : TOUT dans `translations.json` — ne pas toucher au code pour changer du texte
4. **URLs d'achat** : Vérifier existence sur WordPress boutique avant d'ajouter une langue/format
5. **Livre 4 (Salut)** : FR uniquement — pas d'URLs autres langues
6. **Cache Vercel** : Middleware met `Cache-Control: private, no-store` sur redirect → `--force` recommandé

## Fichiers à ne PAS modifier sans raison
- `middleware.ts` (logique détection langue critique)
- `utils/i18n.ts` (utilitaires partagés)
- `layouts/MainLayout.astro` (hreflang + shell HTML)
- `components/BookCard.astro` (structure carte + script JS hauteur)

## Workflow "Ajouter une langue / mettre à jour un livre"
1. Mettre à jour `translations.json` (nouvelle langue + `bookData` complet)
2. Ajouter URLs ImgBB Hero Fan dans `[lang]/index.astro` (`fanImages`)
3. Vérifier URLs achat sur WordPress boutique
4. `npm run build && vercel --prod --force`
5. Test `/fr/`, `/en/`, `/xx/` (desktop + mobile)

---
*Ce fichier sert de référence rapide pour toute IA reprenant le projet. À jour au 2025-11-20.*