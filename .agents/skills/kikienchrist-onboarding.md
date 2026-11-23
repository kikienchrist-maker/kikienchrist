---
name: kikienchrist-onboarding
description: "Guide Onboarding Nouveau Développeur / IA — Setup Local, Architecture, Workflows, Premières Tâches"
version: "1.0"
---

# Skill: kikienchrist-onboarding

## Objectif
Permettre à un nouveau contributeur (humain ou IA) de **devenir productif en < 30 min** sur le projet Kiki en Christ.

---

## 1. Prérequis Système

| Outil | Version Min | Install |
|-------|-------------|---------|
| **Node.js** | 18.14.1+ | `nvm install 20` / `winget install OpenJS.NodeJS` |
| **npm** | 10.x | Inclus avec Node |
| **Git** | 2.40+ | `winget install Git.Git` |
| **Vercel CLI** | Latest | `npm i -g vercel` |
| **Éditeur** | VS Code recommandé | + Extensions : Astro, TypeScript, Tailwind (non utilisé), ESLint |

### Vérification
```bash
node --version    # v20.x.x
npm --version     # 10.x.x
git --version
vercel --version
```

---

## 2. Clone & Setup Local

```bash
# 1. Cloner (ou ouvrir dossier existant)
cd "C:\Users\Admin\Desktop\site web livres"
# Si repo Git : git clone <repo-url> kikienchrist-vercel-sync
cd kikienchrist-vercel-sync

# 2. Installer dépendances
npm install

# 3. Vérifier build local
npm run build
# → Doit générer 10 pages (9 langues + racine) dans dist/

# 4. Dev server (AVEC middleware Edge)
vercel dev
# → Ouvre http://localhost:3000
# → Test : / → redirect /fr/ (ou langue navigateur)
```

### Variables d'Environnement (Local)
Créer `.env.local` à la racine :
```bash
# .env.local (PAS commité)
PUBLIC_SITE_URL=http://localhost:3000
# PUBLIC_GA_ID=G-XXXXXXXXXX  # Optionnel local
# SENTRY_DSN=...             # Optionnel local
```

---

## 3. Architecture en 5 Minutes

### Concept Clé : **Une Seule Page × 9 Langues**
```
src/pages/[lang]/index.astro  →  Génère : /fr/, /en/, /es/, /de/, /pt/, /it/, /ru/, /zh/, /hi/
```

### Flux Données
```
translations.json (source unique)
    ↓
[lang]/index.astro (charge locale)
    ↓
Props → Composants (Hero, BookCard, Bandeau, Newsletter, FAQ, CTA, Footer)
    ↓
HTML statique + JSON-LD traduit + hreflang
```

### Fichiers Critiques (Ne Pas Toucher Sans Raisons)
| Fichier | Rôle | Risque si Modifié |
|---------|------|-------------------|
| `src/middleware.ts` | Détection langue + redirect | Casse i18n entier |
| `src/utils/i18n.ts` | Utilitaires partagés (langues, détection) | Casse middleware + hreflang |
| `src/layouts/MainLayout.astro` | Shell HTML + hreflang + CSS | Casse SEO + design global |
| `src/components/BookCard.astro` | Carte livre + script hauteur | Casse conversion achat |
| `src/data/translations.json` | **TOUT le contenu** | Casse tout texte/URLs |

---

## 4. Workflows Quotidiens

### A. Modifier du Contenu (Textes, URLs, Prix)
```bash
# 1. Ouvrir src/data/translations.json
# 2. Trouver la langue + section (hero, books, bookData, etc.)
# 3. Modifier valeur (respecter structure JSON)
# 4. Sauvegarder
# 5. Build + Deploy
npm run build && vercel --prod --force
```
**Skills** : `kikienchrist-translations`, `kikienchrist-i18n-urls`, `kikienchrist-hero-fan`

### B. Ajouter une Langue
```bash
# 1. translations.json : Copier bloc "fr" → nouvelle langue (ex: "nl")
# 2. Traduire TOUTES les clés (UI + 4 livres)
# 3. src/utils/i18n.ts : Ajouter "nl" dans SUPPORTED_LANGS
# 4. [lang]/index.astro : Ajouter fanImages (4 URLs ImgBB)
# 5. Build + Deploy --force
# 6. Test /nl/ (desktop + mobile)
```
**Skill** : `kikienchrist-tech-stack` (section Workflow)

### C. Mettre à Jour un Livre (Couverture, Prix, Formats)
```bash
# 1. translations.json → bookData[livre] : Maj 9 langues
# 2. Vérifier URLs sur WordPress boutique (lafoidieu.wordpress.com/boutique/)
# 3. [lang]/index.astro : Maj fanImages si couv. changée
# 4. Build + Deploy --force
# 5. Test boutons achat sur 3-4 langues
```
**Skills** : `kikienchrist-translations`, `kikienchrist-book-cards`, `kikienchrist-i18n-urls`

### D. Déployer (Routine)
```bash
npm run build && vercel --prod --force
```
**Skill** : `kikienchrist-deploy`

### E. Audit Pré-Deploy (Qualité)
```bash
# Checklist complète
skill("kikienchrist-content-audit")
# Puis déploiement
```

---

## 5. Premiers Tests (Validation Setup)

### Test 1 : Build Réussi
```bash
npm run build
# ✅ "10 pages built in XXXms"
# ✅ Pas d'erreurs TypeScript / Astro
```

### Test 2 : Dev Server + Middleware
```bash
vercel dev
# Ouvrir http://localhost:3000/
# ✅ Redirect vers /fr/ (ou langue navigateur)
# ✅ /fr/ affiche Hero + 4 livres + Newsletter + FAQ + Footer
```

### Test 3 : Langues
```bash
# Dans vercel dev, tester :
http://localhost:3000/fr/
http://localhost:3000/en/
http://localhost:3000/es/
# ✅ Chaque page : titre traduit, boutons URLs correctes, Hero Fan 4 images
```

### Test 4 : Mobile (Responsive)
```bash
# DevTools → Device Toolbar → iPhone 14 / Galaxy S21
# ✅ 1 colonne, couvertures centrées, fan 90px, lisible
```

### Test 5 : Accessibilité Rapide
```bash
# DevTools → Lighthouse → Accessibility
# ✅ Score ≥ 90
# ✅ Tab navigation : skip link, focus visible, accordéon clavier
```

---

## 6. Outils de Développement Utiles

### VS Code Extensions Recommandées
- **Astro** (officiel) — Syntax highlighting, IntelliSense
- **TypeScript Hero** — Organize imports, refactoring
- **Error Lens** — Inline errors
- **GitLens** — Git blame, history inline
- **REST Client** — Test API (`*.http` files)

### Fichiers `.http` pour Tests (Créer `tests.http`)
```http
### Test Redirect Racine
GET https://kikienchrist.vercel.app/
### Test Page FR
GET https://kikienchrist.vercel.app/fr/
### Test Hreflang
GET https://kikienchrist.vercel.app/fr/
### Test Sitemap
GET https://kikienchrist.vercel.app/sitemap.xml
### Test Middleware avec Header Accept-Language
GET https://kikienchrist.vercel.app/
Accept-Language: en-US,en;q=0.9
```

### Debug Middleware Local
```bash
# Logs Vercel dev
vercel dev 2>&1 | grep -i middleware
# Ou ajouter console.log dans middleware.ts (visible dans terminal vercel dev)
```

---

## 7. Ressources Clés (Signets)

| Ressource | URL | Usage |
|-----------|-----|-------|
| **Projet Vercel** | `vercel.com/.../kikienchrist-vercel-sync` | Déploiements, logs, analytics, domaines |
| **WordPress Boutique** | `lafoidieu.wordpress.com/boutique/` | Source vérité URLs achat |
| **ImgBB** | `ibb.co` / `imgbb.com` | Upload couvertures/Hero Fan |
| **Search Console** | `search.google.com/search-console` | SEO, indexation, sitemap |
| **Vercel Analytics** | `vercel.com/.../analytics` | Trafic, CWV (RUM) |
| **Speed Insights** | `vercel.com/.../speed-insights` | Performance détaillée |
| **Sentry (si config)** | `sentry.io/.../kikienchrist` | Erreurs production |
| **UptimeRobot** | `uptimerobot.com` | Monitoring dispo |

---

## 8. Première Semaine — Objectifs

| Jour | Objectif | Validation |
|------|----------|------------|
| **J1** | Setup local + Build + Deploy test | `vercel dev` OK, deploy preview OK |
| **J2** | Modifier un texte (ex: Hero subtitle FR) → Deploy | Changement visible en prod |
| **J3** | Changer une URL achat (Lulu) → Test clic | Bouton ouvre bonne page |
| **J4** | Audit complet pré-deploy (`content-audit`) | Checklist 100% verte |
| **J5** | Lire tous les skills (index) + comprendre archi | Expliquer flux données à un pair |
| **J6-7** | Tâche réelle assignée (ex: maj livre, nouvelle langue) | PR/Deploy réussi |

---

## 9. Pièges Courants (À Éviter)

| Piège | Symptôme | Prévention |
|-------|----------|------------|
| **Oublier `--force`** | Vieux cache servi, changements invisibles | Toujours `vercel --prod --force` |
| **Modifier code au lieu de JSON** | Texte en dur dans composants | **TOUT** dans `translations.json` |
| **URLs achat non localisées** | Bouton FR sur site EN | Vérifier `bookData[livre].offers` par langue |
| **Hero Fan URLs invalides** | Images cassées Hero | Format `https://i.ibb.co/XXXXXX/fichier.jpg` |
| **JSON invalide** | Build fail | Valider JSON avant commit (VS Code + `npm run build`) |
| **Middleware return 204** | Pas de redirect | `return NextResponse.next()` ou `void` |
| **Cache Vercel sur redirect** | Mauvaise langue servie | `Cache-Control: private, no-store` sur redirect |

---

## 10. Support & Escalade

| Question | Ressource |
|----------|-----------|
| **Comment faire X ?** | Skills pertinents (`skill("nom")`) |
| **Pourquoi ça casse ?** | `kikienchrist-tech-stack` (Dépannage) + Vercel Logs + Sentry |
| **Urgent production** | `kikienchrist-emergency-runbook` |
| **Architecture / Décisions** | `PROJECT_CONTEXT.md` + `kikienchrist-tech-stack` |
| **Design / CSS** | `kikienchrist-design-system` |
| **SEO / Performance** | `kikienchrist-seo` + `kikienchrist-performance` |

---
*Skill créé le 2025-11-20. Objectif : Autonomiser en 30 min, expert en 1 semaine.*