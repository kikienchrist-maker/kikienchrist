---
name: kikienchrist-analytics
description: "Analytics & Tracking (Vercel Analytics, Speed Insights, GA4, événements conversion, RGPD)"
version: "1.0"
---

# Skill: kikienchrist-analytics

## Stack Analytics Actuelle
| Outil | Status | Usage |
|-------|--------|-------|
| **Vercel Analytics** | ✅ Activé (gratuit) | Page views, Core Web Vitals (RUM), referrers, géo |
| **Vercel Speed Insights** | ✅ Activé (gratuit) | LCP, CLS, FID/INP, TTFB réels utilisateurs |
| **Google Analytics 4** | ❌ Non installé | Événements custom, funnels, audiences, ecommerce |
| **Search Console** | ✅ Configuré | Indexation, requêtes, erreurs, sitemap |

## Vercel Analytics (Déjà en place)
- **Activation** : Dashboard Vercel → Project → Analytics → Enable
- **Script** : Injecté automatiquement par Vercel (pas de code à ajouter)
- **Données** : 
  - Pages vues / visiteurs uniques
  - Core Web Vitals (p75 mobile/desktop)
  - Top pages, referrers, pays, devices
  - Temps réel (dernières 30 min)
- **RGPD** : Anonymisé par défaut, pas de cookies, pas de consentement requis

## Vercel Speed Insights (Déjà en place)
- **Activation** : Dashboard → Speed Insights → Enable
- **Métriques** : LCP, CLS, INP, TTFB (percentiles 75/95)
- **Segmentation** : Par page, device, pays, connexion
- **Budget** : Gratuit jusqu'à 10k events/mois

## Google Analytics 4 — À installer (Recommandé)

### 1. Création propriété GA4
- `analytics.google.com` → Admin → Créer propriété → "Kiki en Christ"
- Flux de données → Web → `https://kikienchrist.vercel.app`
- **Measurement ID** : `G-XXXXXXXXXX`

### 2. Installation (Astro)
**Option A : Script dans `MainLayout.astro` (head)**
```astro
---
const GA_ID = import.meta.env.PUBLIC_GA_ID; // dans .env
---
<head>
  ...
  {GA_ID && (
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{GA_ID}', { anonymize_ip: true });
    </script>
  )}
</head>
```

**Option B : `@astrojs/ga-analytics` (officiel)**
```bash
npm install @astrojs/ga-analytics
```
```astro
// astro.config.mjs
import gaAnalytics from '@astrojs/ga-analytics';
export default defineConfig({
  integrations: [gaAnalytics({ id: 'G-XXXXXXXXXX' })]
});
```

### 3. Événements Conversion (Custom Events)
```javascript
// Dans composants (BookCard, Newsletter, CTAStrip)
function trackEvent(eventName, params = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, params);
  }
  // Aussi vers Vercel Analytics (automatique via data-layer)
  if (window.va) window.va('track', eventName, params);
}

// Exemples :
// Clic bouton achat
trackEvent('purchase_click', {
  book_id: 'visage',
  format: 'paper', // 'paper' | 'ebook' | 'audio'
  seller: 'Lulu',
  language: 'fr',
  value: 13.90,
  currency: 'EUR'
});

// Soumission newsletter
trackEvent('newsletter_signup', {
  source: 'leadbox',
  language: 'fr'
});

// Ouverture FAQ
trackEvent('faq_open', {
  question_id: 'shipping',
  language: 'fr'
});

// Changement langue
trackEvent('language_change', {
  from: 'fr',
  to: 'en'
});
```

### 4. Ecommerce GA4 (Optionnel)
```javascript
// Pour suivi revenus réels (si intégration backend)
gtag('event', 'purchase', {
  transaction_id: 'order_123',
  value: 13.90,
  currency: 'EUR',
  items: [{
    item_id: 'visage_paper_fr',
    item_name: 'Le visage de Dieu (Papier)',
    affiliation: 'Lulu',
    price: 13.90,
    quantity: 1
  }]
});
```

## RGPD / Consentement
| Outil | Cookies | Consentement requis | Action |
|-------|---------|---------------------|--------|
| Vercel Analytics | Non | Non | OK par défaut |
| Speed Insights | Non | Non | OK par défaut |
| GA4 | Oui (`_ga`, `_ga_*`) | **OUI** (ePrivacy) | Banner cookie requis |

### Banner Cookie (si GA4 installé)
```astro
<!-- CookieBanner.astro -->
<script is:inline>
  // Simple : vérifier localStorage consent
  const hasConsent = localStorage.getItem('cookie-consent') === 'true';
  if (!hasConsent) {
    // Afficher banner (HTML/CSS dans composant)
    document.getElementById('cookie-banner')?.classList.remove('hidden');
  }
  
  window.acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    document.getElementById('cookie-banner')?.classList.add('hidden');
    // Charger GA4 seulement après consentement
    if (!window.gtagLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
      document.head.appendChild(script);
      window.gtagLoaded = true;
    }
  };
</script>
```

## Search Console (Déjà configuré)
- **Propriété** : `https://kikienchrist.vercel.app` (URL prefix)
- **Sitemap** : `https://kikienchrist.vercel.app/sitemap.xml` soumis
- **Surveillance** : 
  - Erreurs d'indexation (404, redirect, blocked)
  - Requêtes top (impressions, clics, CTR, position)
  - Pages performantes / à améliorer
  - Core Web Vitals (données Chrome UX Report)

## Dashboard Unifié (Recommandé)
Créer un **Looker Studio** (ex Data Studio) connectant :
- Vercel Analytics (via BigQuery export ou API)
- GA4 (connecteur natif)
- Search Console (connecteur natif)
- **KPIs** : Visiteurs, Taux conversion (clics achat / visiteurs), Revenus estimés, CWV, Position moyenne

## Checklist Mensuelle
- [ ] Vercel Analytics : tendances trafic (pic/saisonnalité)
- [ ] Speed Insights : CWV p75 < seuils (LCP<2.5s, CLS<0.1, INP<200ms)
- [ ] GA4 : Événements `purchase_click` par livre/format/langue
- [ ] Search Console : Nouvelles erreurs, requêtes en croissance
- [ ] Funnel : Visiteurs → Clic achat → Conversion réelle (via plateformes)

## Variables d'environnement (`.env`)
```bash
# .env (local) / Vercel Dashboard → Settings → Environment Variables
PUBLIC_GA_ID=G-XXXXXXXXXX
# Pas de secret côté client pour GA4
```

---
*Skill créé le 2025-11-20. Analytics = données pour décisions business + SEO.*