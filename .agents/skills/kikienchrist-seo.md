---
name: kikienchrist-seo
description: "Audit et optimisation SEO (hreflang, JSON-LD, sitemap, performance, Core Web Vitals)"
version: "1.0"
---

# Skill: kikienchrist-seo

## Checklist SEO Technique (à chaque deploy)

### 1. Hreflang (critique pour 9 langues)
- **Implémentation** : `generateHreflangLinks()` dans `src/layouts/MainLayout.astro`
- **Vérifier** dans HTML rendu (`view-source:https://kikienchrist.vercel.app/fr/`) :
  ```html
  <link rel="alternate" hreflang="fr" href="https://kikienchrist.vercel.app/fr/" />
  <link rel="alternate" hreflang="en" href="https://kikienchrist.vercel.app/en/" />
  <link rel="alternate" hreflang="es" href="https://kikienchrist.vercel.app/es/" />
  <link rel="alternate" hreflang="de" href="https://kikienchrist.vercel.app/de/" />
  <link rel="alternate" hreflang="pt" href="https://kikienchrist.vercel.app/pt/" />
  <link rel="alternate" hreflang="it" href="https://kikienchrist.vercel.app/it/" />
  <link rel="alternate" hreflang="ru" href="https://kikienchrist.vercel.app/ru/" />
  <link rel="alternate" hreflang="zh" href="https://kikienchrist.vercel.app/zh/" />
  <link rel="alternate" hreflang="hi" href="https://kikienchrist.vercel.app/hi/" />
  <link rel="alternate" hreflang="x-default" href="https://kikienchrist.vercel.app/" />
  ```
- **x-default** = racine `/` (redirect middleware)

### 2. JSON-LD Structured Data (Book + ItemList)
- **Dans** `[lang]/index.astro` → `<script type="application/ld+json">`
- **Vérifier** : 
  - `ItemList` avec 4 `ListItem` → `Book`
  - Chaque `Book` a : `name` (traduit), `isbn`, `numberOfPages`, `inLanguage` (code langue), `bookFormat`, `image` (ImgBB 1500px), `author`, `description` (traduit), `offers` (array 3 : Lulu, Payhip, Google Play)
  - `offers` : `price`, `priceCurrency`, `url` (localisée), `seller.name`, `availability`
- **Tester** : Google Rich Results Test (`search.google.com/test/rich-results`)

### 3. Sitemap.xml
- Généré à la build (vérifier `dist/sitemap.xml`)
- Doit contenir 10 URLs : `/`, `/fr/`, `/en/`, `/es/`, `/de/`, `/pt/`, `/it/`, `/ru/`, `/zh/`, `/hi/`
- `lastmod` = date build
- `changefreq` weekly, `priority` 1.0 pour `/`, 0.8 pour langues

### 4. Robots.txt
- `public/robots.txt` (créer si absent) :
  ```
  User-agent: *
  Allow: /
  Sitemap: https://kikienchrist.vercel.app/sitemap.xml
  ```

### 5. Meta tags par page
Dans `MainLayout.astro` (head) :
- `<title>` : traduit (via `translations.json` → `hero.title` + site name)
- `<meta name="description">` : traduit (`hero.subtitle`)
- `<meta property="og:title">`, `og:description`, `og:image` (Hero fan 1ère image), `og:url`, `og:locale`, `og:type=website`
- `<meta name="twitter:card"> summary_large_image`
- `<link rel="canonical">` : URL courante (`https://kikienchrist.vercel.app/{lang}/`)

### 6. Performance / Core Web Vitals
- **LCP** : Hero image (fan-1) → `loading="eager"` + préload si possible
- **CLS** : Dimensions fixes sur images (`width="320" height="480"` sur `.cover`)
- **FID/INP** : Pas de JS bloquant au-dessus du fold (middleware Edge + static HTML)
- **Images** : WebP/AVIF via Vercel Image Optimization ? (actuellement ImgBB direct)
- **Cache** : `vercel.json` → headers `Cache-Control: public, max-age=31536000, immutable` pour assets statiques

### 7. Accessibilité (a11y) = SEO indirect
- `alt` sur toutes images (couvertures : `alt="Couverture : {titre}"`)
- Hiérarchie headings : `h1` (hero) → `h2` (section livres) → `h3` (titres livres)
- `lang` sur `<html lang="{locale}">`
- Focus visible sur liens/boutons
- Contraste couleurs (tokens CSS `--ink` / `--paper`)

## Outils de test
| Outil | URL | Quoi tester |
|-------|-----|-------------|
| Google Rich Results | `search.google.com/test/rich-results` | JSON-LD Book/ItemList |
| hreflang Checker | `technicalseo.com/tools/hreflang/` | Hreflang valides |
| PageSpeed Insights | `pagespeed.web.dev` | Core Web Vitals (mobile/desktop) |
| Search Console | `search.google.com/search-console` | Indexation, erreurs, sitemap |
| Vercel Analytics | `vercel.com/.../analytics` | Real User Metrics (RUM) |

## Commandes audit rapide
```bash
# 1. Build local + vérif HTML
cd "C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync"
npm run build
# Ouvrir dist/fr/index.html → chercher hreflang, JSON-LD, meta tags

# 2. Test prod (après deploy)
curl -s https://kikienchrist.vercel.app/fr/ | grep -i "hreflang\|ld+json\|canonical\|og:"

# 3. Vérifier sitemap
curl -s https://kikienchrist.vercel.app/sitemap.xml | head -30
```

## Points critiques actuels
1. **Images Hero Fan** : ImgBB direct (pas optimisé Vercel) → LCP potentiellement lent
2. **Pas de préload** pour hero image → ajouter `<link rel="preload" as="image" href="...">` dans `MainLayout.astro`
3. **JSON-LD** : Vérifier que `inLanguage` = code ISO (fr, en, es...) pas nom complet
4. **Hreflang** : `x-default` sur racine `/` (middleware redirect) — correct
5. **Sitemap** : Doit inclure `/` (x-default) + 9 langues

## Améliorations futures
- [ ] Vercel Image Optimization pour couvertures + hero fan
- [ ] Preload hero image (fan-1) par langue
- [ ] `robots.txt` dans `public/`
- [ ] Breadcrumbs JSON-LD (`BreadcrumbList`)
- [ ] `Organization` / `Person` JSON-LD (Kiki en Christ)
- [ ] FAQ JSON-LD (`FAQPage`) — déjà structure accordéon, ajouter schema
- [ ] Monitoring Search Console (alertes erreurs)

---
*Skill créé le 2025-11-20. À lancer après chaque deploy majeur.*