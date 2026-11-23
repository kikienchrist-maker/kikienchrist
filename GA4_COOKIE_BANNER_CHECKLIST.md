# GA4 + Cookie Banner RGPD - Checklist de validation

## ✅ Implémentation réalisée

### 1. Variables d'environnement (`.env.example`)
- [x] `PUBLIC_GA4_MEASUREMENT_ID` - ID de mesure GA4 (format G-XXXXXXXXXX)
- [x] `PUBLIC_COOKIE_CONSENT_NAME` - Nom du cookie consentement (`kikienchrist-consent`)
- [x] `PUBLIC_CONSENT_MAX_AGE_DAYS` - Durée max consentement (365 jours)

### 2. Module Analytics (`src/lib/analytics.ts`)
- [x] `initGA4()` - Initialisation GA4 + Consent Mode v2 (default: denied)
- [x] `updateConsentMode(granted)` - Mise à jour consentement (appelé par Cookie Banner)
- [x] `hasAnalyticsConsent()` - Lecture cookie consentement
- [x] `isGA4Configured()` - Vérification config
- [x] Événements typés :
  - [x] `trackPageView()`
  - [x] `trackCTAClick(ctaName, location, url)`
  - [x] `trackBookPurchaseClick(bookId, title, seller, format, price, currency)`
  - [x] `trackBookImpression(bookId, title, position)`
  - [x] `trackNewsletterSignup(location, success)`
  - [x] `trackScrollDepth(depth)`
  - [x] `trackOutboundClick(url, text)`
  - [x] `trackSocialShare(platform, url, title)`
  - [x] `trackError(error, context)`
  - [x] `trackFileDownload(name, url, type)`
  - [x] `trackVideoPlay(title, provider, url)`
  - [x] `trackSearch(term, resultsCount)`

### 3. Cookie Banner (`src/components/CookieBanner.astro` + `public/scripts/cookie-banner.js`)
- [x] Bannière bottom-fixed avec 3 boutons : Accepter tout / Refuser tout / Personnaliser
- [x] Panneau modal préférences : Nécessaires / Analytics / Marketing / Fonctionnels
- [x] Cookies nécessaires toujours activés (non désactivables)
- [x] Sauvegarde cookie 1 an (`kikienchrist-consent`) avec timestamp + version
- [x] Nettoyage cookies tiers si refus (GA4 `_ga*`, marketing `_fbp*`, etc.)
- [x] Accessibilité : ARIA labels, focus trap, ESC pour fermer, focus visible
- [x] Responsive : modal plein écran mobile, animations respectent `prefers-reduced-motion`
- [x] Dark mode support via variables CSS
- [x] Événement `consent:updated` dispatché pour GA4 Consent Mode
- [x] Script externe ES module (pas de script inline complexe)

### 4. Traductions 9 langues (`src/data/translations.json`)
- [x] Français (fr)
- [x] Anglais (en)
- [x] Espagnol (es)
- [x] Allemand (de)
- [x] Portugais (pt)
- [x] Italien (it)
- [x] Russe (ru)
- [x] Chinois (zh)
- [x] Hindi (hi)

### 5. Intégration MainLayout (`src/layouts/MainLayout.astro`)
- [x] Import `CookieBanner` + `getTranslations`
- [x] GA4 init inline script avec Consent Mode v2 default denied
- [x] `window.updateConsentMode` exposé pour Cookie Banner
- [x] Écouteur `consent:updated` → mise à jour GA4
- [x] Page view initiale envoyée
- [x] Preconnect GA4 domains

### 6. CSP Vercel (`vercel.json`)
- [x] `script-src` : `https://www.googletagmanager.com`
- [x] `connect-src` : `https://www.google-analytics.com`, `https://region1.google-analytics.com`

### 7. Utils (`src/utils/translations.ts`)
- [x] `getTranslations(locale)` - charge traduction complète
- [x] `getTranslationSection(locale, section)` - charge section spécifique

---

## 🧪 Tests manuels à effectuer

### Développement local (`npm run preview`)
```bash
# 1. Build
npm run build

# 2. Preview
npm run preview
# Ouvrir http://localhost:4321/fr/
```

### Checklist navigateur

#### 1. Première visite (pas de cookie consentement)
- [ ] Bannière cookie apparaît en bas après ~500ms
- [ ] Texte dans la bonne langue (selon `/fr/`, `/en/`, etc.)
- [ ] 3 boutons visibles : "Tout accepter", "Tout refuser", "Personnaliser"
- [ ] Clic "Personnaliser" ouvre le panneau modal
- [ ] Panneau affiche 4 catégories : Nécessaires, Analytics, Marketing, Fonctionnels
- [ ] Nécessaires : coché + désactivé (grisé)
- [ ] Analytics / Marketing / Fonctionnels : décochés par défaut
- [ ] Fermeture panneau (X, overlay, ESC) fonctionne
- [ ] Focus trap dans le panneau (Tab/Shift+Tab)

#### 2. Acceptation "Tout accepter"
- [ ] Clic "Tout accepter" → bannière disparaît
- [ ] Cookie `kikienchrist-consent` créé (vérifier DevTools > Application > Cookies)
- [ ] Cookie contient : `{"necessary":true,"analytics":true,"marketing":true,"functional":true,"timestamp":"...","version":"1.0"}`
- [ ] GA4 Consent Mode mis à jour : `analytics_storage: 'granted'`
- [ ] Script GA4 chargé (`googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`)
- [ ] `page_view` envoyé dans dataLayer (DevTools > Console > dataLayer)

#### 3. Refus "Tout refuser"
- [ ] Clic "Tout refuser" → bannière disparaît
- [ ] Cookie créé avec `analytics: false, marketing: false, functional: false`
- [ ] GA4 Consent Mode : `analytics_storage: 'denied'`
- [ ] Cookies GA4 (`_ga`, `_ga_*`, `_gid`, `_gat`) supprimés
- [ ] Aucun hit GA4 envoyé

#### 4. Personnalisation (Analytics seulement)
- [ ] Clic "Personnaliser" → panneau ouvre
- [ ] Cocher "Analytics" seulement → "Enregistrer"
- [ ] Cookie reflète choix : `analytics: true, marketing: false, functional: false`
- [ ] GA4 Consent Mode : `analytics_storage: 'granted'`
- [ ] Cookies marketing/func supprimés

#### 5. Persistance (rechargement page)
- [ ] Recharger la page → bannière NE réapparaît PAS
- [ ] Cookie toujours présent
- [ ] GA4 Consent Mode appliqué automatiquement au chargement

#### 6. Multilingue
- [ ] Tester `/fr/`, `/en/`, `/es/`, `/de/`, `/pt/`, `/it/`, `/ru/`, `/zh/`, `/hi/`
- [ ] Textes bannière/panneau dans la bonne langue
- [ ] Direction RTL pour `ar`/`he` (si ajouté plus tard)

#### 7. Événements GA4 (via Console)
```javascript
// Dans la console navigateur, après acceptation analytics :
// Vérifier que dataLayer reçoit les événements
dataLayer.filter(e => e[0] === 'event')
```

- [ ] `page_view` à chaque navigation
- [ ] `click` sur CTA livres (boutons "Acheter", "Voir détails")
- [ ] `click` sur liens externes (Lulu, Payhip, Google Play)
- [ ] `scroll` aux seuils 25/50/75/100% (si implémenté)
- [ ] `form_submit` newsletter
- [ ] `sign_up` newsletter succès

#### 8. Accessibilité (axe-core / Lighthouse)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Pas d'erreurs axe-core critiques
- [ ] Navigation clavier complète
- [ ] Contraste suffisant (WCAG AA)

#### 9. Performance
- [ ] Script GA4 chargé en `async`
- [ ] Cookie Banner n'impacte pas LCP (apparaît après 500ms)
- [ ] Taille `cookie-banner.js` < 10 KB gzippé

---

## 🚀 Déploiement Vercel

### Variables d'environnement à configurer (Vercel Dashboard > Settings > Environment Variables)
| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` (votre vrai ID) | Production, Preview |
| `PUBLIC_COOKIE_CONSENT_NAME` | `kikienchrist-consent` | Production, Preview |
| `PUBLIC_CONSENT_MAX_AGE_DAYS` | `365` | Production, Preview |

### Déploiement
```bash
# Build local pour vérification
npm run build

# Déploiement production
vercel --prod --force
```

### Vérification post-déploiement
- [ ] `https://kikienchrist.vercel.app/fr/` - bannière apparaît
- [ ] Consentement accepté → hits visibles dans GA4 Real-time
- [ ] CSP headers corrects (pas d'erreurs console CSP)
- [ ] Cookies `Secure; SameSite=Lax` en HTTPS

---

## 📝 Notes importantes

### Consent Mode v2 (Google)
- **Default** : `analytics_storage: 'denied'` (avant interaction utilisateur)
- **Update** : `analytics_storage: 'granted'` après "Tout accepter" ou "Analytics" coché
- **Pas de `ad_storage`** : pas de pub pour l'instant (resté `denied`)
- **IP anonymisée** : `anonymize_ip: true` dans config GA4

### Conformité RGPD / ePrivacy
- ✅ Consentement **libre** (bouton "Tout refuser" aussi visible qu'"Accepter")
- ✅ Consentement **éclairé** (description par catégorie, lien mentions légales)
- ✅ Consentement **spécifique** (granulaire par catégorie)
- ✅ Consentement **révocable** (bannière réapparaît si cookie supprimé)
- ✅ Preuve de consentement : cookie avec timestamp + version
- ✅ Durée max 13 mois (configuré à 365 jours)

### Cookies tiers gérés
| Catégorie | Cookies nettoyés si refus |
|-----------|---------------------------|
| Analytics | `_ga`, `_ga_*`, `_gid`, `_gat` |
| Marketing | `_fbp`, `_fbc`, `fr`, `xs`, `datr` |
| Fonctionnels | `__cf_bm`, `cf_clearance` |

---

## 🔧 Prochaines étapes possibles

1. **Server-side GA4 events** (Measurement Protocol) via Netlify Functions / Vercel Edge Functions pour :
   - Achats confirmés (webhook Payhip)
   - Inscriptions newsletter confirmées
   - Données enrichies (valeur client, etc.)

2. **Google Tag Manager (GTM)** au lieu de gtag direct :
   - Conteneur GTM pour gestion centralisée
   - Variables, triggers, tags sans redéploiement

3. **A/B Testing** consentement :
   - Tester formulations bannière
   - Mesurer taux d'acceptation

4. **Analytics alternatives** (respect vie privée) :
   - Plausible, Matomo, Umami en fallback

5. **Documentation utilisateur** :
   - Page `/cookies/` détaillée
   - Tableau finalités / durées / tiers