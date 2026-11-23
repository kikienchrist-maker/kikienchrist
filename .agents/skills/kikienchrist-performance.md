---
name: kikienchrist-performance
description: "Optimisation Performance (Core Web Vitals, LCP, CLS, INP, images, fonts, cache, bundle size)"
version: "1.0"
---

# Skill: kikienchrist-performance

## Objectifs Core Web Vitals (CWV)
| Métrique | Bon | À améliorer | Mauvais | Cible Projet |
|----------|-----|-------------|---------|--------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5-4s | > 4s | **< 2.0s** |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1-0.25 | > 0.25 | **< 0.05** |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200-500ms | > 500ms | **< 150ms** |
| **TTFB** (Time to First Byte) | ≤ 800ms | 800-1800ms | > 1800ms | **< 500ms** (Edge) |

## État Actuel (2025-11-20)
- **Stack** : Astro Static Export + Vercel Edge → TTFB excellent (< 200ms)
- **JS** : Minimal (seul script égalisation hauteur + Netlify Forms) → INP faible
- **CSS** : Unique fichier `lafoidieu-design.css` (~60KB gzippé) → OK
- **Images** : **Point faible** — ImgBB direct (pas d'optimisation Vercel), pas de WebP/AVIF auto, pas de `srcset`
- **Fonts** : System UI stack (pas de web font) → **Excellent** (0 font load)
- **Cache** : `vercel.json` headers pour assets statiques → OK

## Optimisations Prioritaires

### 1. Images — **Impact LCP/CLS majeur**
**Problème** : Couvertures + Hero Fan = ImgBB direct (JPG/PNG, pas WebP, pas responsive, pas préload)

**Solutions** (par ordre d'impact) :

#### A. Vercel Image Optimization (Recommandé)
```bash
# 1. Migrer images sur Vercel Blob ou garder ImgBB + proxy
# 2. Utiliser composant <Image /> d'Astro (nécessite @astrojs/image + sharp)
npm install @astrojs/image sharp
```
```astro
// astro.config.mjs
import image from '@astrojs/image';
export default defineConfig({
  integrations: [image({ service: { entrypoint: 'astro/assets/services/sharp' } })]
});
```
```astro
// Dans Hero.astro / BookCard.astro
import { Image } from 'astro:assets';
import cover from '../assets/covers/visage-fr.jpg'; // Local ou remote

<Image src={cover} alt="Couverture" width={320} height={480} format="webp" loading="eager" />
```
**Gain** : WebP/AVIF auto, `srcset` responsive, dimensions fixes → **CLS ≈ 0**, LCP ↓

#### B. Préload Hero Image (LCP critique)
```astro
<!-- Dans MainLayout.astro head -->
<link rel="preload" as="image" href={fanImages[0]} type="image/webp" />
```
- `fanImages[0]` = 1ère miniature Hero (LCP candidate)
- Par langue → dynamic dans `[lang]/index.astro`

#### C. `width`/`height` explicites (Déjà fait sur `.cover`)
```html
<img class="cover" width="320" height="480" ... />
```
→ **Maintient** (empêche CLS)

#### D. Lazy-loading non-LCP
```html
<!-- Livre 2,3,4 : loading="lazy" -->
<img class="cover" loading="lazy" ... />
```
- Livre 1 (Hero + 1er livre) : `loading="eager"`

### 2. CSS — Déjà optimisé
- Fichier unique → 1 requête
- Tokens CSS → pas de duplication
- Pas de `@import` → pas de chaîne de chargement
- **Action** : Minifier (Vercel le fait auto) + `Cache-Control: immutable`

### 3. JavaScript — Minimal (Déjà bien)
- Script égalisation hauteur : ~1KB inline
- Pas de framework JS (React/Vue/Svelte) → **Excellent**
- **Action** : Vérifier `is:inline` vs fichier séparé (inline = pas de requête)

### 4. Fonts — System UI (Optimal)
```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```
- 0 requête font, 0 CLS font, 0 FOIT/FOUT
- **Ne pas changer** sauf besoin branding fort

### 5. Cache Headers (`vercel.json`)
```json
{
  "headers": [
    { "source": "/styles/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/images/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }] }
  ]
}
```
- HTML pages : `Cache-Control: public, max-age=0, must-revalidate` (défaut Vercel static)
- Middleware redirect : `Cache-Control: private, no-store` (critique i18n)

### 6. Compression
- Vercel : Brotli + Gzip auto (pas d'action)
- CSS/JS : déjà minifiés en build

## Audit Technique (Outils)

### Local
```bash
# Build + analyse bundle
npm run build
npx astro-bundle-analyzer  # si dispo

# Lighthouse CI local
npm install -g @lhci/cli
lhci autorun --url=http://localhost:4321
```

### Production (Vercel)
- **Speed Insights** : Dashboard → Speed Insights (RUM réel)
- **PageSpeed Insights** : `pagespeed.web.dev` (lab + field)
- **Lighthouse** : DevTools → Lighthouse (mobile/desktop)
- **WebPageTest** : `webpagetest.org` (détail waterfall)

### Métriques à surveiller
| Métrique | Outil | Fréquence |
|----------|-------|-----------|
| LCP/CLS/INP (p75) | Vercel Speed Insights | Hebdo |
| LCP/CLS/INP (lab) | PageSpeed Insights | Mensuel |
| TTFB | Vercel Analytics / Speed Insights | Hebdo |
| Bundle JS/CSS size | Build output / Vercel | À chaque deploy |

## Checklist Pré-Deploy Performance
- [ ] Images Hero Fan : `loading="eager"` + `width`/`height` + préload 1ère
- [ ] Couvertures livres 2-4 : `loading="lazy"` + `width`/`height`
- [ ] CSS : 1 fichier, minifié, cache immutable
- [ ] JS : Inline minimal, pas de bundle
- [ ] Fonts : System UI only
- [ ] TTFB < 500ms (Edge)
- [ ] LCP < 2.5s (cible 2.0s)
- [ ] CLS < 0.1 (cible 0.05)
- [ ] INP < 200ms (cible 150ms)

## Optimisations Futures (Backlog)
- [ ] Migrer images vers Vercel Blob + `@astrojs/image` (WebP/AVIF auto, srcset)
- [ ] Service Worker pour cache offline (Workbox via `@astrojs/service-worker`)
- [ ] Critical CSS inline (déjà quasi avec fichier unique)
- [ ] Resource Hints : `dns-prefetch` pour `i.ibb.co`, `payhip.com`, `lulu.com`
- [ ] Speculation Rules API (prerender pages langues probables)
- [ ] `priority` hints sur images LCP (`fetchpriority="high"`)

---
*Skill créé le 2025-11-20. Performance = UX + SEO + Conversion.*