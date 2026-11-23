---
name: kikienchrist-emergency-runbook
description: "Procédures d'Urgence (Rollback, Site Down, Erreurs Critiques, Sécurité) — Actions Immédiates"
version: "1.0"
---

# Skill: kikienchrist-emergency-runbook

## Principes
1. **Agir vite** : Temps = argent/réputation
2. **Communiquer** : Slack #alerts + Statuspage si impact public
3. **Documenter** : Chaque action dans incident log (Notion/GitHub Issues)
4. **Post-mortem** : Sous 48h pour incidents critiques

---

## 1. Site Down / Indisponible (UptimeRobot Alert)

### Diagnostic Rapide (≤ 2 min)
```bash
# 1. Vérifier Vercel Dashboard → Deployments
#    - Dernier déploiement = ERROR ? → Rollback immédiat
#    - Dernier déploiement = READY ? → Problème infra Vercel / DNS

# 2. Test direct
curl -I https://kikienchrist.vercel.app/fr/
#    - 200 OK → Problème monitoring (faux positif)
#    - 5xx / timeout → Vercel Edge / Middleware error
#    - 404 → Routing cassé (middleware/rewrites)
#    - DNS fail → Problème domaine/Vercel

# 3. Vercel Logs → Middleware / Function errors
vercel logs <deployment-url> --since=10m
```

### Actions Immédiates

#### A. Dernier Déploiement = ERREUR (Build Failed)
```bash
# Rollback vers déploiement précédent stable
vercel rollback <previous-stable-deployment-url>
# OU redeploy commit précédent
vercel redeploy <deployment-id-of-last-working>
```
→ **Temps visé : < 3 min**

#### B. Déploiement OK mais 5xx sur pages
```bash
# 1. Vérifier Middleware logs
vercel logs <deployment-url> --filter=middleware

# 2. Erreur TypeScript/Edge Runtime courante :
#    - "NextResponse not found" → Import manquant
#    - "crypto not available" → Web Crypto API uniquement
#    - "fs not available" → Pas d'accès fichier en Edge

# 3. Hotfix minimal → Deploy --force
git revert <bad-commit>  # si commit identifié
# OU fix direct + push
npm run build && vercel --prod --force
```
→ **Temps visé : < 10 min**

#### C. Problème DNS / Domaine
- Vérifier Vercel Dashboard → Settings → Domains
- `kikienchrist.vercel.app` doit être **Primary**
- Custom domain (`kikienchrist.com` ?) → Vérifier CNAME/A records
- **Action** : Attendre propagation (max 48h) ou revert DNS

#### D. Incident Vercel Global
- Vérifier `status.vercel.com` / Twitter @vercelstatus
- Si incident confirmé → **Attendre + Communiquer**
- Pas d'action possible côté code

---

## 2. Erreur Critique Production (Sentry Alert)

### Triage (≤ 5 min)
1. Ouvrir Issue Sentry → **Stack trace + Contexte (release, environment, user)**
2. **Régression ?** (marqué "regressed") → Rollback immédiat
3. **Nouvelle erreur ?** → Évaluer impact :
   - **Critique** : Checkout/Paiement, Redirect i18n, Formulaire → Hotfix urgent
   - **Majeure** : Affichage partiel, JSON-LD invalide, Images cassées → Fix < 1h
   - **Mineure** : Warning console, a11y mineur → Backlog

### Hotfix Critique (Checkout/Redirect/Forms)
```bash
# 1. Identifier commit fautif (Sentry → Release → Commit)
# 2. Revert local
git revert <commit-sha>
# 3. Build + Deploy FORCE
npm run build && vercel --prod --force
# 4. Vérifier Sentry → "Mark Resolved" après confirm
# 5. Poster dans #alerts : "Hotfix deployed for <issue>, monitoring"
```

### Erreur Middleware i18n (Redirect Loop / Wrong Language)
```bash
# Symptômes : Boucle redirect, mauvaise langue, 204 No Content
# Cause fréquente : matcher trop large, localeMatch raté, return 204

# Fix rapide : Vérifier src/middleware.ts
# - matcher exclut bien /fr|en|es|de|pt|it|ru|zh|hi/
# - return NextResponse.next() (pas Response 204)
# - Cache-Control: private, no-store sur redirect
npm run build && vercel --prod --force
```

---

## 3. Performance Dégradée (CWV Alert)

### Détection
- Vercel Speed Insights : LCP p75 > 2.5s / CLS > 0.1 / INP > 200ms
- Lighthouse CI fail
- Search Console "Core Web Vitals" alert

### Diagnostic Rapide
```bash
# 1. Pages impactées (Speed Insights → By Page)
# 2. Changements récents (git log --oneline -20)
# 3. Lighthouse local sur page concernée
npx lighthouse https://kikienchrist.vercel.app/fr/ --view
```

### Causes Fréquentes & Fixes
| Cause | Symptôme | Fix Rapide |
|-------|----------|------------|
| Nouvelles images non optimisées | LCP ↑ | Remplacer par WebP/AVIF, ajouter `width`/`height`, préload Hero |
| CSS ajouté sans minification | LCP/CLS ↑ | Build vérifie minification, `vercel.json` cache immutable |
| JS ajouté (analytics, chat) | INP ↑ | Différer (defer), charger après interaction, ou supprimer |
| Font externe ajoutée | CLS/LCP ↑ | Revenir à System UI stack |
| Middleware lent | TTFB ↑ | Optimiser `detectLanguageFromHeader`, réduire logs |

### Rollback Performance
```bash
# Si régression identifiée sur commit récent
git revert <commit-sha>
npm run build && vercel --prod --force
```

---

## 4. Problème Sécurité / Données

### Fuite Clé API / Secret (GA4, Sentry, Netlify)
```bash
# 1. RÉVOQUER IMMÉDIATEMENT
#    - GA4 : Admin → Data Streams → Delete stream → Recréer (nouveau G-XXXX)
#    - Sentry : Settings → Projects → DSN → Regenerate
#    - Netlify : Site Settings → Forms → Reset form endpoint
#    - Vercel : Settings → Environment Variables → Update/Delete

# 2. Rotate dans Vercel Dashboard → Settings → Environment Variables
# 3. Deploy --force pour propager nouveaux secrets
npm run build && vercel --prod --force

# 4. Audit accès : qui a vu le secret ? (Git history, logs Vercel)
```

### Contenu Malveillant Injecté (XSS, Spam Forms)
- Netlify Forms : Vérifier submissions → Delete spam
- Si XSS via `translations.json` → Audit commit history, revert
- Headers sécurité : `X-Content-Type-Options: nosniff` (déjà dans `vercel.json`)

---

## 5. Perte Données / Contenu

### `translations.json` Corrompu / Supprimé
```bash
# 1. Git history
git log --oneline -10 -- src/data/translations.json
git show <last-good-commit>:src/data/translations.json > src/data/translations.json

# 2. Si pas de git (local only) → Récupérer depuis Vercel build logs
#    Vercel Dashboard → Deployments → Build Logs → "Downloading build output"
#    Extraire dist/... ou chercher dans logs les données

# 3. Rebuild + Deploy
npm run build && vercel --prod --force
```

### Images Hero Fan / Couvertures Perdues (ImgBB)
- ImgBB = tiers, pas de garantie
- **Backup** : Télécharger toutes images ImgBB → Stocker local (`public/images/backups/`) + Git LFS ou Vercel Blob
- **Migration future** : Vercel Blob + `@astrojs/image` (skill `performance`)

---

## 6. Communication Incident

### Canaux
| Canal | Usage | Audience |
|-------|-------|----------|
| **Slack #alerts** | Temps réel, coordination équipe | Devs, Ops |
| **Statuspage.io** | Public, transparent | Visiteurs, clients |
| **Email (si critique)** | Direction, stakeholders | Management |
| **GitHub Issue** | Post-mortem, tracking | Équipe technique |

### Templates Messages

#### Slack #alerts (Début Incident)
```
🚨 INCIDENT - <TYPE> - <SEVERITY>
**Quoi** : <Description 1 ligne>
**Impact** : <Utilisateurs affectés / Fonctionnalités>
**Début** : <Heure UTC>
**Status** : Investigating
**Lead** : @<nom>
**Lien** : <Sentry/Vercel/UptimeRobot URL>
```

#### Statuspage (Public)
```
**Incident** : <Titre clair>
**Impact** : <Partiel / Majeur / Critique>
**Début** : <Date/Heure locale>
**Mise à jour** : Nous investiguons. Prochaine mise à jour dans 30 min.
```

#### Résolution (Slack + Statuspage)
```
✅ RÉSOLU - <TYPE>
**Durée** : <X min/h>
**Cause** : <Root cause 1 phrase>
**Fix** : <Action prise>
**Prévention** : <Mesure pour éviter récurrence>
**Post-mortem** : Lien GitHub Issue (sous 48h)
```

---

## 7. Checklist Post-Incident (Sous 48h)

- [ ] **Root Cause Analysis** (5 Whys)
- [ ] **Timeline** précise (détection → résolution)
- [ ] **Impact** quantifié (utilisateurs, revenus, SEO)
- [ ] **Action Items** préventifs (assignés, datés)
- [ ] **Documentation** mise à jour (skills, runbooks, architecture)
- [ ] **Partage** équipe (réunion 15 min ou async écrit)

---

## Contacts Urgence
| Rôle | Nom | Contact |
|------|-----|---------|
| **Tech Lead** | *Toi* | Slack / Téléphone |
| **Vercel Support** | - | `vercel.com/support` (Pro plan) |
| **Sentry Support** | - | `sentry.io/support` |
| **Domain Registrar** | - | Dashboard registrar |
| **Netlify Support** | - | `netlify.com/support` |

---
*Skill créé le 2025-11-20. À garder accessible (offline + online). Imprimer version courte pour portefeuille.*