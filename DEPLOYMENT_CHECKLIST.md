# 📋 Kiki en Christ - Check-list de déploiement complet

## ✅ Prérequis validés (Code prêt)

- [x] **Astro 4.16** - Static export configuré
- [x] **TypeScript strict** - Aucun erreur
- [x] **Tests** - 167 tests schema-org-master + tests unitaires passent
- [x] **Lint/Prettier** - Configuré avec husky/lint-staged
- [x] **Build** - `pnpm build` génère `dist/` correctement

---

## 🏗️ Infrastructure à configurer (Actions requises)

### 1. GitHub Repository

- [ ] Créer repo `kikienchrist` (public ou private)
- [ ] Push code: `git remote add origin https://github.com/USER/kikienchrist.git && git push -u origin main`
- [ ] Configurer **Branch protection** sur `main` (requis PR + checks)

### 2. GitHub Secrets (Settings → Secrets → Actions)

| Secret                  | Requis    | Source                                               |
| ----------------------- | --------- | ---------------------------------------------------- |
| `VERCEL_TOKEN`          | ✅ Oui    | vercel.com/account/tokens                            |
| `VERCEL_ORG_ID`         | ✅ Oui    | `vercel inspect` ou dashboard                        |
| `VERCEL_PROJECT_ID`     | ✅ Oui    | Dashboard projet Vercel                              |
| `NETLIFY_AUTH_TOKEN`    | ✅ Oui    | netlify.com/user/applications#personal-access-tokens |
| `NETLIFY_SITE_ID`       | ✅ Oui    | Site settings → General → Site ID                    |
| `LHCI_GITHUB_APP_TOKEN` | Optionnel | lhci.io → GitHub App                                 |
| `CODECOV_TOKEN`         | Optionnel | codecov.io → Repository settings                     |

### 3. Netlify (pour Decap CMS)

- [ ] **Connecter repo** : app.netlify.com/start → GitHub → `kikienchrist`
- [ ] **Build settings** :
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: `20` (via `.nvmrc` ou `package.json`)
- [ ] **Deploy** → Attendre premier deploy réussi
- [ ] **Custom domain** (optionnel) : `kikienchrist.netlify.app` ou domaine propre

### 4. Netlify Identity + Git Gateway (CRITIQUE pour CMS)

- [ ] **Enable Identity** : Site Settings → Identity → Enable Identity
- [ ] **Registration** : "Email only" ou "Email + GitHub/Google"
- [ ] **Enable Git Gateway** : Identity → Services → Git Gateway → Enable
- [ ] **Invite users** : Identity → Invite users → votre email
- [ ] **Tester** : `https://VOTRE-SITE.netlify.app/admin/` → Login → Créer article

### 5. Vercel (Production hosting)

- [ ] **Import project** : vercel.com/new → GitHub → `kikienchrist`
- [ ] **Framework preset** : Astro (auto-détecté)
- [ ] **Build command** : `npm run build`
- [ ] **Output directory** : `dist`
- [ ] **Environment Variables** : Ajouter tous les secrets ci-dessus
- [ ] **Deploy** → `https://kikienchrist.vercel.app`

### 6. Vercel Blob (Images CDN)

- [ ] **Create Store** : vercel.com/dashboard/stores → Create → `kikienchrist-images`
- [ ] **Create Token** : Store → Settings → Tokens → Create → Read/Write
- [ ] **Variables d'env** : Ajouter à Vercel + GitHub Secrets
  - `BLOB_READ_WRITE_TOKEN`
  - `VERCEL_BLOB_STORE_ID`
  - `NEXT_PUBLIC_BLOB_URL` (ex: `https://kikienchrist.vercel-storage.com`)
- [ ] **Migration** : `export BLOB_READ_WRITE_TOKEN=... && node scripts/migrate-to-blob.js`
- [ ] **Mise à jour code** : Remplacer `/images/books/` par URLs Vercel Blob dans `src/pages/[lang]/index.astro`

---

## 🌍 Contenu multilingue

### Blog - Traductions (10 articles × 11 langues = 110 fichiers)

| Article (FR)       | en  | es  | pt  | de  | it  | nl  | pl  | ar  | ru  | zh  | hi  | Statut |
| ------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ |
| entendre-voix-dieu | ✅  | ✅  | ❌  | ❌  | ✅  | ✅  | ❌  | ✅  | ✅  | ✅  | ❌  | 7/11   |
| guerre-spirituelle | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| jeuner-prier       | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-couple      | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-enfants     | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-impossible  | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-jeunes      | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-maladie     | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-matin-soir  | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |
| priere-quotidienne | ❌  | ❌  | ❌  | ⏳  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | 0/11   |

**⏳ = En cours via job background (en/es/pt/de)**

**Actions** :

- [ ] Attendre fin job actuel (en/es/pt/de pour 9 articles)
- [ ] Lancer: `cd skills/content/blog-translation && node dist/cli.js --target-langs it,nl,pl,ar,ru,zh,hi --concurrency 1`
- [ ] Relecture humaine recommandée (qualité LLM variable)

### i18n UI Strings (11 langues)

| Langue | Fichier               | Statut              |
| ------ | --------------------- | ------------------- |
| fr     | src/data/i18n/fr.json | ✅ Complet          |
| en     | src/data/i18n/en.json | ✅ Complet          |
| es     | src/data/i18n/es.json | ✅ Complet          |
| pt     | src/data/i18n/pt.json | ✅ Complet          |
| de     | src/data/i18n/de.json | ✅ Complet          |
| it     | src/data/i18n/it.json | ✅ Complet          |
| nl     | src/data/i18n/nl.json | ⚠️ Placeholder vide |
| pl     | src/data/i18n/pl.json | ⚠️ Placeholder vide |
| ar     | src/data/i18n/ar.json | ⚠️ Placeholder vide |
| ru     | src/data/i18n/ru.json | ⚠️ Placeholder vide |
| zh     | src/data/i18n/zh.json | ⚠️ Placeholder vide |
| hi     | src/data/i18n/hi.json | ⚠️ Placeholder vide |

**Actions** :

- [ ] Générer via skill `i18n-management` ou traduction manuelle
- [ ] Intégrer dans `MainLayout.astro` pour remplacer `translations.json`

### Pages légales (5 pages × 11 langues = 55 fichiers)

- [x] FR : 5/5 (mentions-legales, confidentialite, cookies, cgv, accessibilite)
- [x] Traductions Ollama existantes dans `src/content/legalPages/*.{lang}.md`
- [ ] Vérifier exactitude juridique (relecture humaine recommandée)
- [ ] Migrer vers Decap CMS collections `legal`

---

## 🔧 Configuration technique

### Variables d'environnement (.env.example → .env.production)

- [ ] `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- [ ] `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
- [ ] `BLOB_READ_WRITE_TOKEN`, `VERCEL_BLOB_STORE_ID`, `NEXT_PUBLIC_BLOB_URL`
- [ ] `OLLAMA_HOST`, `OLLAMA_MODEL` (pour traductions auto)
- [ ] `FIRSTPROMOTER_API_KEY`, `FIRSTPROMOTER_WEBHOOK_SECRET`
- [ ] `MAILERLITE_API_KEY`, `CONTACT_EMAIL`
- [ ] `GA_MEASUREMENT_ID`, `META_PIXEL_ID`
- [ ] `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_SITE_KEY`

### Domaine & DNS

- [ ] Domaine principal : `kikienchrist.com` (ou .fr)
- [ ] DNS : A record → Vercel IP / CNAME → `cname.vercel-dns.com`
- [ ] SSL : Auto (Vercel/Netlify)
- [ ] Redirection www → non-www (ou inversement)

### Analytics & Tracking

- [ ] GA4 : `GA_MEASUREMENT_ID` configuré + Consent Mode v2
- [ ] Meta Pixel : `META_PIXEL_ID` + events (Purchase, Lead, ViewContent)
- [ ] Search Console : Propriété domaine vérifiée
- [ ] Sitemap : Auto-généré via `astro-sitemap` ou `sitemap.xml` custom

---

## ✅ Tests post-déploiement

### Smoke tests (Playwright E2E)

- [ ] Homepage `/fr/` charge (200)
- [ ] Toutes langues `/en/`, `/es/`, etc. chargent
- [ ] Livres page `/fr/livres/` affiche 4 livres
- [ ] Blog index `/fr/blog/` affiche articles
- [ ] Article unique `/fr/blog/entendre-voix-dieu/` charge
- [ ] Pages légales accessibles
- [ ] Newsletter form submit (Netlify Forms)
- [ ] Language switcher fonctionne
- [ ] Cookie consent banner affiché + fonctionnel

### Performance (Lighthouse CI)

- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90

### SEO Audit

- [ ] Meta titles/descriptions uniques par page
- [ ] Canonical URLs correctes
- [ ] Hreflang tags présents
- [ ] Schema.org : WebSite, Organization, Breadcrumb, Book, Article, FAQPage
- [ ] Open Graph / Twitter Cards valides
- [ ] Robots.txt permet crawl
- [ ] Sitemap.xml valide

### Accessibilité (axe-core)

- [ ] Aucune violation critique
- [ ] Contraste ≥ 4.5:1
- [ ] Navigation clavier complète
- [ ] ARIA labels corrects
- [ ] Focus visible

---

## 🚀 Lancement

### Soft launch (preview)

- [ ] Deploy preview Netlify/Vercel
- [ ] Partager lien preview pour relecture
- [ ] Valider contenu + traductions
- [ ] Corriger bugs identifiés

### Production launch

- [ ] Merge PR → main
- [ ] GitHub Actions : Build + Tests + Deploy production
- [ ] Vérifier `https://kikienchrist.vercel.app`
- [ ] Vérifier `https://kikienchrist.netlify.app/admin/` (CMS)
- [ ] Annoncer sur réseaux sociaux / newsletter
- [ ] Monitorer erreurs (Sentry/LogRocket si configuré)

---

## 📞 Contacts & Ressources

- **Email** : kikienchrist@gmail.com
- **Repo** : github.com/USER/kikienchrist
- **Vercel** : vercel.com/USER/kikienchrist
- **Netlify** : app.netlify.com/sites/kikienchrist
- **Decap CMS** : https://kikienchrist.netlify.app/admin/
- **Vercel Blob** : vercel.com/USER/stores/kikienchrist-images

---

_Généré automatiquement - Mettre à jour au fur et à mesure du déploiement_
