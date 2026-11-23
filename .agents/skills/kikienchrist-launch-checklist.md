---
name: kikienchrist-launch-checklist
description: "Checklist Lancement Complet (Technique, Contenu, Marketing, Légal, Monitoring, Équipe) — Validation Pré/Post Go-Live"
version: "1.0"
---

# Skill: kikienchrist-launch-checklist

## Objectif
Garantir un **lancement sans faille** (nouveau site, nouvelle langue, nouvelle feature majeure, refonte) via validation systématique de tous les critères critiques.

---

## 1. Phases de Lancement

| Phase | Moment | Objectif | Durée |
|-------|--------|----------|-------|
| **Pré-Lancement (T-2 semaines)** | Code freeze + Tests complets | Zéro régression, tout vert | 1 semaine |
| **Pré-Lancement (T-1 jour)** | Déploiement Preview + Validation manuelle | Dernière vérification humaine | 2-4h |
| **Jour J (Go-Live)** | Merge main → Deploy Prod --force | Bascule production | 15-30 min |
| **Post-Lancement (T+1h)** | Validation smoke tests + Monitoring | Confirmer santé système | 30 min |
| **Post-Lancement (T+24h)** | Métriques business + Alertes | Valider impact réel | 1h |
| **Post-Lancement (T+7j)** | Bilan complet + Rétrospective | Apprendre, documenter | 2h |

---

## 2. Checklist Technique (Pré-Lancement)

### Code & Build
- [ ] **Build local** : `npm run build` → Succès (0 erreurs, 0 warnings critiques)
- [ ] **TypeScript** : `npm run check` → 0 erreurs
- [ ] **Lint** : `npm run lint` → 0 erreurs (warnings acceptés si justifiés)
- [ ] **Tests** : `npm run test` → 100% pass (unit, integration, e2e, a11y, perf)
- [ ] **Validation données** : `npm run validate:translations` + `npm run validate:build` → OK
- [ ] **Bundle size** : JS total < 100KB gzippé, CSS < 50KB gzippé
- [ ] **Dependencies** : `npm audit` → 0 critical/high (ou documentés + plan fix)

### Architecture & Config
- [ ] **astro.config.mjs** : `output: 'static'`, `trailingSlash: 'always'`, intégrations OK
- [ ] **vercel.json** : Rewrites wildcard, headers sécurité, functions config
- [ ] **Middleware** : `src/middleware.ts` compilé, matcher correct (exclut assets, api, admin, rss)
- [ ] **Environment Variables** : Toutes définies sur Vercel (Production + Preview)
- [ ] **Domaine** : `kikienchrist.vercel.app` + domaine custom (si applicable) → DNS OK, SSL OK

### Performance & Core Web Vitals
- [ ] **Lighthouse CI** : Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90
- [ ] **LCP** : < 2.5s (mobile 3G simulé)
- [ ] **CLS** : < 0.1
- [ ] **INP** : < 200ms
- [ ] **Images** : Hero préchargées (`fetchpriority="high"`), AVIF/WebP, dimensions fixes
- [ ] **Fonts** : `font-display: swap`, préconnect, subset si possible
- [ ] **Cache** : `Cache-Control: public, max-age=31536000, immutable` sur assets hashés

### SEO Technique
- [ ] **Sitemap** : `sitemap.xml` généré, 9 langues + root, `<lastmod>` récent
- [ ] **Hreflang** : 9 langues + `x-default` sur toutes pages (head + sitemap)
- [ ] **Canonical** : Auto-référent sur chaque page langue
- [ ] **Robots.txt** : `User-agent: *` + `Allow: /` + `Sitemap: https://.../sitemap.xml`
- [ ] **JSON-LD** : Book (4 livres), ItemList, FAQPage, BlogPosting (si blog), Organization — Valide (Rich Results Test)
- [ ] **Meta tags** : Title < 60c, Description < 160c, OG/Twitter complets, `lang` attribute
- [ ] **Structured Data Testing** : Google Rich Results Test → 0 erreurs, 0 warnings critiques

### Sécurité & Headers
- [ ] **CSP** : Report-Only → Enforcing (selon maturité) — `script-src 'self' 'unsafe-inline'` minimal
- [ ] **HSTS** : `max-age=31536000; includeSubDomains; preload`
- [ ] **X-Frame-Options** : `DENY`
- [ ] **X-Content-Type-Options** : `nosniff`
- [ ] **Referrer-Policy** : `strict-origin-when-cross-origin`
- [ ] **Permissions-Policy** : Restrictif (camera=(), microphone=(), geolocation=())
- [ ] **Secrets** : Aucun secret dans repo (`.env*` dans `.gitignore`), tous sur Vercel/Netlify
- [ ] **Dependabot** : Activé + PRs auto-merge pour patch/minor

### Accessibilité (WCAG 2.1 AA)
- [ ] **Skip Link** : Présent, fonctionnel, visible focus
- [ ] **Heading Order** : H1 unique → H2 → H3 (pas de saut)
- [ ] **Alt Text** : Toutes images (décoratives = `alt=""`)
- [ ] **Contraste** : ≥ 4.5:1 (texte), ≥ 3:1 (UI)
- [ ] **Focus Visible** : `:focus-visible` sur tous éléments interactifs (outline 3px gold)
- [ ] **Form Labels** : Newsletter `<label for="email">` ou `aria-label`
- [ ] **Language Switcher** : `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-label`
- [ ] **ARIA** : Accordéon FAQ (`aria-expanded`, `aria-controls`, `id` uniques)

### i18n & Contenu (9 Langues)
- [ ] **Toutes langues générées** : `/fr/`, `/en/`, `/es/`, `/de/`, `/pt/`, `/it/`, `/ru/`, `/zh/`, `/hi/`
- [ ] **Redirect racine** : `/` → `/{lang}/` (Middleware + Cookie + `_redirects` fallback)
- [ ] **Hero Fan** : 4 images ImgBB par langue (FR = Lulu thumbs OK)
- [ ] **BookCards** : 4 livres, boutons URLs correctes (Lulu/Payhip/GP + UTM), dropdown langues exact
- [ ] **Newsletter** : Formulaire Netlify fonctionnel (honeypot, redirect, email test reçu)
- [ ] **FAQ** : Accordéon accessible, JSON-LD FAQPage valide
- [ ] **CTA Strip** : Lien vers `#livres` ou page boutique
- [ ] **Footer** : Nav, droits, made with, language switcher
- [ ] **Traductions complètes** : Aucune clé manquante dans `translations.json` (script validation)

---

## 3. Checklist Contenu & Marketing (Pré-Lancement)

### Pages Légales (Obligatoires RGPD/LCEN)
- [ ] `/mentions-legales/` (9 langues) — Éditeur, Hébergeur, PI, Responsabilité, Droit applicable
- [ ] `/confidentialite/` (9 langues) — RGPD Art.12-14, traitements, droits, transferts, DPO, CNIL
- [ ] `/cookies/` (9 langues) — ePrivacy, catégories, consentement, banner CMP, gestion
- [ ] `/cgv/` (9 langues) — Code Conso, plateformes vendeurs, rétractation, garanties, médiation
- [ ] `/accessibilite/` (9 langues) — Déclaration RGAA 4.1, état, non-conformités, roadmap, contact

### Contenu Principal
- [ ] **Hero** : Eyebrow, Titre, Sous-titre, CTA Primary/Ghost — Traduits, percutants
- [ ] **Livres** : 4 livres × 9 langues = 36 fiches (Titre, Description, Couverture, Offres, Langues)
- [ ] **URLs Achat** : Vérifiées manuellement sur Lulu/Payhip/GP (9 langues × 3 formats × 4 livres = 108 URLs)
- [ ] **Bandeau Formats** : Papier/Ebook/Audio — Traduits
- [ ] **FAQ** : 5-8 questions pertinentes par langue
- [ ] **CTA Final** : Texte + Bouton + Lien — Aligné objectif business

### Assets Marketing Prêts
- [ ] **Lead Magnet PDF** : "7 Prières" — 9 versions, hébergées (Vercel Blob/Netlify), liens testés
- [ ] **Email Séquence Bienvenue** : 5 emails configurés dans MailerLite (FR + 8 langues)
- [ ] **Social Templates** : Canva Kit marque + 6 templates × 9 langues
- [ ] **Affiliate Kit** : Dashboard FirstPromoter, bannières, emails, lead magnet co-brandé
- [ ] **Press Kit** : One-pager, logos, bios, photos auteur, stats clés, contact presse

### Tracking & Analytics
- [ ] **GA4** : Property créée, Enhanced Measurement ON, User-ID OFF, Data Retention 14 mois
- [ ] **GA4 Events** : `newsletter_signup`, `book_click`, `purchase_click`, `download_lead_magnet`, `language_change` — Testés
- [ ] **Vercel Analytics** : Activé + Speed Insights
- [ ] **Microsoft Clarity** : Project ID ajouté, masking PII
- [ ] **Sentry** : DSN configuré, Source Maps uploadées, Alertes (error rate > 1%)
- [ ] **UptimeRobot** : 5 monitors (9 langues + root) — 5 min interval, alertes Slack/Email
- [ ] **Checkly** : 3 synthetic checks (Home FR, Home EN, Purchase flow) — 10 min interval
- [ ] **UTM Standards** : Documenté, appliqué sur tous liens (social, email, affiliés, ads)

---

## 4. Checklist Équipe & Opérations (Pré-Lancement)

### Rôles & Responsabilités (Jour J)
| Rôle | Personne | Responsabilité | Contact Urgence |
|------|----------|----------------|-----------------|
| **Release Manager** | Vous | Décision Go/No-Go, merge, deploy, communication | Tel/Slack |
| **Tech Lead** | Vous | Surveillance build, logs, rollback si besoin | Tel/Slack |
| **Content Lead** | Vous/Équipe | Validation finale contenu toutes langues | Slack |
| **Marketing Lead** | Vous/Équipe | Lancement campaigns (email, social, affiliés) | Slack |
| **Support** | Vous/Équipe | Surveillance tickets, réseaux, formulaires | Slack/Email |

### Communication Interne
- [ ] **Channel Slack #launch** : Créé, membres invités
- [ ] **Runbook Incident** : Accessible (Notion/GitBook) — Liens vers `emergency-runbook`
- [ ] **Checklist Partagée** : Notion/GitHub Project — Cochée en temps réel

### Communication Externe (Pré-rédigée)
- [ ] **Annonce Newsletter** : "Nouveau site / nouvelle langue / nouvelle feature" — Prête à envoyer
- [ ] **Posts Sociaux** : 3 variants (IG, FB, LI) — Programmés Buffer
- [ ] **Message Affiliés** : Email + Kit partage — Prêt à envoyer
- [ ] **Communiqué Presse** (si majeur) : Envoyé liste médias J-1

---

## 5. Jour J — Procédure Go-Live

### Timeline (15-30 min)
```
T-30 min  : Freeze merge (branche main verrouillée sur GitHub)
T-15 min  : Dernière review PR #launch — Approbation Release Manager + Tech Lead
T-0       : Merge PR → GitHub Actions CI/CD déclenché
T+2 min   : Build + Tests (surveiller GitHub Actions — ~5-8 min)
T+8 min   : Deploy Preview généré (Vercel) — Vérification rapide URL preview
T+10 min  : **GO/NO-GO** — Si tests verts + preview OK → Deploy Prod
T+12 min  : `vercel --prod --force` (ou auto via GitHub Actions environment: production)
T+15 min  : Propagation CDN (attendre 30-60s)
T+16 min  : **SMOKE TESTS** (voir section 6)
T+20 min  : **ANNONCE** — Newsletter + Social + Affiliés + Slack #launch "🚀 LIVE"
T+30 min  : Surveillance métriques (Vercel Analytics, GA4 Realtime, Sentry, UptimeRobot)
```

### Critères Go/No-Go (Non Négociables)
| Critère | Go | No-Go → Rollback |
|---------|----|------------------|
| **Build + Tests CI** | ✅ Tous verts | ❌ Tout rouge → Fix + Rebuild |
| **Preview Deploy** | ✅ 9 langues accessibles, pas d'erreur console | ❌ Erreur 5xx, page blanche, contenu cassé |
| **Smoke Tests (T+16)** | ✅ Tous passent (voir §6) | ❌ Échec critique → Rollback immédiat |
| **Secrets/Env** | ✅ Toutes variables présentes prod | ❌ Manquante → Ajouter + Redeploy |

### Rollback Procédure (< 5 min)
```bash
# 1. Vercel Dashboard → Deployments → Précédent réussi → "Promote to Production"
# OU
git revert <merge-commit> && git push origin main
# GitHub Actions redéploie automatiquement le dernier commit stable
```

---

## 6. Smoke Tests Post-Deploy (T+16 min — Obligatoires)

### Automatisés (Script)
```bash
# scripts/smoke-test.sh
BASE="https://kikienchrist.vercel.app"
LANGS=("fr" "en" "es" "de" "pt" "it" "ru" "zh" "hi")

for lang in "${LANGS[@]}"; do
  # 1. Page d'accueil accessible
  curl -sf "$BASE/$lang/" > /dev/null || { echo "❌ $lang HOME"; exit 1; }
  
  # 2. Contenu critique présent
  curl -sf "$BASE/$lang/" | grep -q "class=\"book\"" || { echo "❌ $lang BookCards"; exit 1; }
  curl -sf "$BASE/$lang/" | grep -q 'href="https://www.lulu.com' || { echo "❌ $lang Lulu links"; exit 1; }
  curl -sf "$BASE/$lang/" | grep -q 'hreflang' || { echo "❌ $lang Hreflang"; exit 1; }
  curl -sf "$BASE/$lang/" | grep -q 'application/ld+json' || { echo "❌ $lang JSON-LD"; exit 1; }
  
  # 3. Newsletter form
  curl -sf "$BASE/$lang/" | grep -q 'name="email"' || { echo "❌ $lang Newsletter form"; exit 1; }
  
  echo "✅ $lang OK"
done

# 4. Root redirect
curl -sf "$BASE/" | grep -q "302\|301" && echo "✅ Root redirect" || echo "⚠️ Root redirect"

# 5. Sitemap
curl -sf "$BASE/sitemap.xml" | grep -q "<url>" && echo "✅ Sitemap" || echo "❌ Sitemap"

# 6. RSS (si blog)
curl -sf "$BASE/rss.xml" | grep -q "<item>" && echo "✅ RSS" || echo "ℹ️ RSS (pas encore)"

echo "🎉 ALL SMOKE TESTS PASSED"
```

### Manuels (Vous — 5 min)
- [ ] Ouvrir `https://kikienchrist.vercel.app/fr/` → Mobile (responsive), Desktop
- [ ] Cliquer 1 bouton Lulu → Nouvel onglet → Page produit correcte
- [ ] Cliquer 1 bouton Payhip → Page produit correcte
- [ ] S'inscrire newsletter (email test) → Email reçu + MailerLite contact créé
- [ ] Changer langue via switcher → URL + Contenu + Cookie mis à jour
- [ ] Ouvrir DevTools Console → 0 erreurs JS, 0 erreurs CSP (Report-Only OK)

---

## 7. Post-Lancement (T+1h, T+24h, T+7j)

### T+1 Heure — Validation Métriques Temps Réel
- [ ] **GA4 Realtime** : Visiteurs actifs > 0, Events `page_view` + `scroll` + `click` feu
- [ ] **Vercel Analytics** : 0 erreurs 5xx, LCP/CLS/INP dans verts
- [ ] **Sentry** : 0 nouvelles erreurs (ou < 5 mineures)
- [ ] **UptimeRobot** : Tous monitors UP
- [ ] **Newsletter** : Inscriptions fonctionnelles (test email propre)
- [ ] **Réseaux Sociaux** : Posts publiés, liens cliquables, pas de 404

### T+24 Heures — Impact Business
- [ ] **Trafic** : Sessions GA4 vs moyenne (cible : +20% si annonce)
- [ ] **Inscriptions NL** : Nombre vs objectif (cible : 50+ si lancement majeur)
- [ ] **Clics Achat** : `book_click` events GA4 → Taux clic > 5%
- [ ] **Ventes** : Dashboards Lulu/Payhip/GP → Ventes jour J
- [ ] **Affiliés** : Premiers clics/conversions trackés
- [ ] **Erreurs** : Sentry + Vercel logs → 0 critiques, < 10 mineures

### T+7 Jours — Bilan & Rétrospective
- [ ] **Métriques Consolidées** : Tableau comparatif J-7 vs J-1 vs J+7
- [ ] **Incidents** : Liste + Résolution + Actions préventives
- [ ] **Feedback** : Utilisateurs (réseaux, email, formulaire), Équipe (rétro 30 min)
- [ ] **Documentation** : Mise à jour skills, runbooks, checklists
- [ ] **Prochaines Actions** : Backlog priorisé (technique, contenu, marketing)

---

## 8. Checklist Spécifique par Type de Lancement

### Nouvelle Langue (ex: ajout `ar` / `he`)
- [ ] Checklist Technique complète (surtout i18n, Hero Fan, BookCards, URLs)
- [ ] Traduction complète validée (relecteur natif)
- [ ] Search Console : Propriété `/ar/` ajoutée + Sitemap soumis
- [ ] GA4 : Segment langue créé
- [ ] MailerLite : Groupe `lang:ar` + Séquence bienvenue AR
- [ ] Social : Templates Canva AR créés

### Nouveau Livre (Livre 5)
- [ ] `bookData` ajouté dans 9 langues (translations.json)
- [ ] Couverture ImgBB uploadée (4 formats : hero, card, social, thumb)
- [ ] ISBN obtenu (Lulu gratuit / Payhip / GP)
- [ ] Produits créés sur 3 plateformes (Lulu, Payhip, GP) → URLs testées
- [ ] BookCard générée automatiquement (vérifier grille 5 livres → CSS ajusté si besoin)
- [ ] JSON-LD Book + ItemList mis à jour
- [ ] FAQ mise à jour (questions spécifiques nouveau livre)
- [ ] Lead Magnet / Email séquence / Social posts créés

### Refonte Design Majeure
- [ ] Design System mis à jour (`lafoidieu-design.css` + tokens)
- [ ] Tests visuels (Chromatic / Playwright visual) → 0 régressions
- [ ] Accessibilité : Audit complet (axe + manuel)
- [ ] Performance : Lighthouse CI ≥ seuils
- [ ] Mobile : Tests réels appareils (iOS Safari, Android Chrome)
- [ ] Anciennes pages : Redirects 301 si URLs changées

---

*Skill créé le 2025-11-20. Launch Checklist = zéro surprise, confiance maximale, équipe alignée.*