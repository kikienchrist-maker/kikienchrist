---
name: kikienchrist-astro-integrations
description: "Intégrations Astro Officielles & Communautaires (Sitemap, Image, RSS, PWA, MDX, Tailwind, Partytown, View Transitions)"
version: "1.0"
---

# Skill: kikienchrist-astro-integrations

## Intégrations Actuelles (Déjà Configurées)

| Intégration | Package | Version | Config | Status |
|-------------|---------|---------|--------|--------|
| **Sitemap** | `@astrojs/sitemap` | 3.1.x | `astro.config.mjs` | ✅ Actif |
| **Image** | `@astrojs/image` | 0.18.x | `astro.config.mjs` (sharp) | ✅ Configuré (pas encore utilisé) |
| **TypeScript Check** | `@astrojs/check` | 0.9.x | `package.json` script | ✅ Actif |

---

## Intégrations Recommandées (Prochaines Étapes)

### 1. RSS Feed — `@astrojs/rss` (Priorité Haute pour Blog)
```bash
npm install @astrojs/rss
```
```javascript
// astro.config.mjs
import rss from '@astrojs/rss';

export default defineConfig({
  integrations: [rss()],
  // ...
});

// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const items = posts
    .filter(p => p.data.lang === 'fr') // Ou générer par langue
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .map(post => ({
      title: post.data.title,
      link: `/fr/blog/${post.slug}/`,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
    }));

  return rss({
    title: 'Kiki en Christ — Articles',
    description: 'Ressources spirituelles, guides de prière, réflexions sur la foi.',
    site: context.site,
    items,
    customData: `<language>fr</language>`,
    stylesheet: '/styles/rss.xsl', // Optionnel : joli rendu navigateur
  });
}
```
**Génère** : `/rss.xml` (fr) → Étendre pour 9 langues (`/fr/rss.xml`, `/en/rss.xml`...)

### 2. PWA — `@astrojs/pwa` (Priorité Moyenne)
```bash
npm install @astrojs/pwa
```
```javascript
// astro.config.mjs
import pwa from '@astrojs/pwa';

export default defineConfig({
  integrations: [pwa({
    manifest: {
      name: 'Kiki en Christ',
      short_name: 'Kiki en Christ',
      description: '4 livres pour approfondir votre foi. Ressources spirituelles gratuites.',
      theme_color: '#b8860b', // --gold-ink
      background_color: '#fdfbf7', // --paper
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      // Cache first pour assets statiques
      // Network first pour HTML (toujours frais)
    },
  })],
});
```
**Avantages** : Installation mobile, offline reading (articles blog), push notifications futures.

### 3. MDX — `@astrojs/mdx` (Si contenu riche blog)
```bash
npm install @astrojs/mdx
```
```javascript
// astro.config.mjs
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  // Permet .mdx dans src/content/blog/ avec composants React/Vue/Svelte dans markdown
});
```
**Usage** : `<NewsletterSignup />` dans article, `<BookCard id="visage" />`, graphiques interactifs.

### 4. Partytown — `@astrojs/partytown` (Si GA4/tiers lourds)
```bash
npm install @astrojs/partytown
```
```javascript
// astro.config.mjs
import partytown from '@astrojs/partytown';

export default defineConfig({
  integrations: [partytown({
    config: {
      forward: ['dataLayer.push'], // GA4 events
    },
  })],
});
```
**Avantage** : Déplace GA4, Sentry, chat widgets vers Web Worker → **INP amélioré**, main thread libre.

### 5. View Transitions — `@astrojs/view-transitions` (UX Navigation)
```bash
npm install @astrojs/view-transitions
```
```javascript
// astro.config.mjs
import viewTransitions from '@astrojs/view-transitions';

export default defineConfig({
  integrations: [viewTransitions()],
});

// Dans MainLayout.astro
<head>
  <view-transitions />
  ...
</head>

// Composants avec transition
<ViewTransitions fallback="animate">
  <main id="main-content"><slot /></main>
</ViewTransitions>
```
**Effet** : Transitions fluides entre pages (SPA feel) sans JS framework.

### 6. Sitemap Avancé — Configuration Complète
```javascript
// astro.config.mjs (sitemap config étendue)
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [sitemap({
    filter: (page) => {
      // Exclure pages non-indexables
      return !page.includes('/draft/') && !page.includes('/private/');
    },
    changefreq: 'weekly',
    priority: (page) => {
      if (page.endsWith('/')) return 1.0; // Homepages
      if (page.includes('/blog/')) return 0.8;
      return 0.6;
    },
    lastmod: new Date(),
    // xhtml:link hreflang auto-généré si i18n configuré
  })],
});
```

### 7. Image Optimisation — Utilisation Réelle
```astro
--- 
// Composant Hero.astro ou BlogPost.astro
import { Image } from 'astro:assets';
import heroImage from '../assets/images/blog/priere-debutant.jpg';
---

<Image 
  src={heroImage} 
  alt="Prière du matin" 
  width={1200} 
  height={630}
  format="avif" 
  quality={80}
  loading="eager"
  inferSize={true}
/>
```
**Génère** : `<picture>` avec AVIF, WebP, JPEG fallback + `srcset` responsive + dimensions fixes → **CLS = 0**.

---

## Intégrations à Éviter (Pour Ce Projet)

| Intégration | Raison |
|-------------|--------|
| `@astrojs/tailwind` | Design System CSS vanilla existant (tokens, composants) — Tailwind ajouterait complexité sans gain |
| `@astrojs/react` / `@astrojs/vue` / `@astrojs/svelte` | Pas de composants interactifs complexes — Astro natif + JS vanilla suffit |
| `@astrojs/prefetch` | Site statique + Edge Middleware → Prefetch peu utile, navigation déjà instantanée |
| `@astrojs/vercel` (adapter) | Déjà sur Vercel avec Edge Middleware natif — Adapter redondant |

---

## Workflow Ajout Intégration

```bash
# 1. Installer
npm install @astrojs/<integration>

# 2. Configurer astro.config.mjs
# 3. Test local
npm run build && npm run preview

# 4. Vérifier : Build OK, pas de régression visuelle/perf
# 5. Deploy preview
vercel

# 6. Test prod (Preview URL)
# 7. Deploy prod
npm run build && vercel --prod --force
```

---

## Checklist Intégration (Avant Merge)

- [ ] `npm run build` passe
- [ ] `npm run check` passe (TypeScript)
- [ ] `npm run test` passe (si tests affectés)
- [ ] Pas de régression Lighthouse (perf/a11y/SEO)
- [ ] Fonctionne sur 9 langues (si i18n impacté)
- [ ] Documentation mise à jour (skill `tech-stack` + `astro-integrations`)

---
*Skill créé le 2025-11-20. Intégrations = levier puissance Astro sans complexité.*