---
name: kikienchrist-automation-workflows
description: "Automatisation & Workflows (Zapier/Make, GitHub Actions, Netlify Functions, Vercel Edge, Cron Jobs, Alerting, Runbooks Opérationnels)"
version: "1.0"
---

# Skill: kikienchrist-automation-workflows

## Objectif
Éliminer les **tâches manuelles répétitives**, garantir **fiabilité** (déploys, backups, sync), et créer **alertes proactives** — Tout en gardant le contrôle et la compréhension.

---

## 1. Architecture Automatisation

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   DÉCLENCHEURS  │───▶│   ORCHESTRATEURS │───▶│     ACTIONS        │
├─────────────────┤    ├──────────────────┤    ├────────────────────┤
│ • Git Push      │    │ • GitHub Actions │    │ • Build & Deploy   │
│ • Schedule      │    │ • Zapier / Make  │    │ • Tests & Checks   │
│ (Cron)          │    │ • Netlify Func   │    │ • Sync Données     │
│ • Webhooks      │    │ • Vercel Edge    │    │ • Notifications    │
│ (Forms, Sales,  │    │ • Custom Scripts │    │ • Alertes          │
│  Affiliates)    │    │                  │    │ • Rapports         │
│ • Alertes       │    │                  │    │ • Maintenance      │
│ (Monitoring)    │    │                  │    │ • Cleanup          │
└─────────────────┘    └──────────────────┘    └────────────────────┘
```

---

## 2. GitHub Actions — CI/CD Principal (Source de Vérité)

### Workflow Complet : `.github/workflows/ci-cd.yml`
```yaml
name: CI/CD — Kiki en Christ

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:  # Déclenchement manuel
  schedule:
    - cron: '0 2 * * 0'  # Hebdo dimanche 2h UTC (build de maintenance)

env:
  NODE_VERSION: '20'
  ASTRO_TELEMETRY_DISABLED: 1

jobs:
  # ─── 1. VALIDATION DONNÉES ───
  validate-data:
    name: Validate Translations & Data
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'npm' }
      - run: npm ci
      - name: Validate translations.json (Zod)
        run: npm run validate:translations
      - name: Validate build output structure
        run: npm run validate:build-structure  # Script custom

  # ─── 2. TYPESCRIPT & LINT ───
  typecheck-lint:
    name: TypeScript Check + Lint
    runs-on: ubuntu-latest
    needs: validate-data
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'npm' }
      - run: npm ci
      - run: npm run check      # astro check (TypeScript)
      - run: npm run lint       # eslint + prettier --check

  # ─── 3. TESTS ───
  test:
    name: Tests (Unit + Integration + E2E + A11y + Perf)
    runs-on: ubuntu-latest
    needs: typecheck-lint
    strategy:
      matrix:
        test-suite: [unit, integration, e2e, a11y, perf]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'npm' }
      - run: npm ci
      - name: Build for testing
        run: npm run build
      - name: Run ${{ matrix.test-suite }} tests
        run: npm run test:${{ matrix.test-suite }}
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:4321
      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.test-suite }}-results
          path: test-results/${{ matrix.test-suite }}/**

  # ─── 4. BUILD PRODUCTION ───
  build:
    name: Build Production
    runs-on: ubuntu-latest
    needs: [validate-data, typecheck-lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ env.NODE_VERSION }}, cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
          retention-days: 7

  # ─── 5. DEPLOY PREVIEW ───
  deploy-preview:
    name: Deploy Preview (Vercel)
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name != 'schedule'  # Pas de preview pour build hebdo
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - uses: amondnet/vercel-action@v25
        id: vercel-preview
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--scope=${{ secrets.VERCEL_ORG_ID }}'
          working-directory: ./dist
      - name: Comment PR with Preview URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deploy: ${{ steps.vercel-preview.outputs.url }}'
            })

  # ─── 6. DEPLOY PRODUCTION ───
  deploy-prod:
    name: Deploy Production (Vercel --prod --force)
    runs-on: ubuntu-latest
    needs: [build, deploy-preview]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod --force --scope=${{ secrets.VERCEL_ORG_ID }}'
          working-directory: ./dist
      - name: Notify Success (Slack/Email)
        if: success()
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"✅ Production deployed: https://kikienchrist.vercel.app"}' \
            ${{ secrets.SLACK_WEBHOOK_URL }}

  # ─── 7. POST-DEPLOY VALIDATION ───
  post-deploy-check:
    name: Post-Deploy Health Check
    runs-on: ubuntu-latest
    needs: deploy-prod
    steps:
      - name: Wait for propagation
        run: sleep 30
      - name: Check 9 languages + root
        run: |
          for lang in fr en es de pt it ru zh hi; do
            curl -sf "https://kikienchrist.vercel.app/$lang/" > /dev/null || exit 1
            echo "✅ $lang OK"
          done
          curl -sf "https://kikienchrist.vercel.app/" > /dev/null && echo "✅ Root redirect OK"
      - name: Check sitemap
        run: curl -sf "https://kikienchrist.vercel.app/sitemap.xml" | grep -q "<url>" || exit 1
      - name: Check critical pages (GA4, Sentry)
        run: |
          curl -sf "https://kikienchrist.vercel.app/fr/" | grep -q "gtag\|clarity" || echo "⚠️ Analytics missing"
```

### Secrets GitHub (Repository Settings → Secrets → Actions)
| Secret | Description | Source |
|--------|-------------|--------|
| `VERCEL_TOKEN` | Token d'accès Vercel | Vercel Account Settings → Tokens |
| `VERCEL_ORG_ID` | ID Organisation Vercel | `vercel inspect` ou Dashboard |
| `VERCEL_PROJECT_ID` | ID Projet Vercel | `vercel inspect` ou Dashboard |
| `SLACK_WEBHOOK_URL` | Webhook Slack notifications | Slack Apps → Incoming Webhooks |
| `PAYHIP_WEBHOOK_SECRET` | Secret validation webhook Payhip | Payhip Dashboard > Webhooks |
| `FIRSTPROMOTER_API_KEY` | API Key FirstPromoter | FirstPromoter Dashboard |
| `MAILERLITE_API_KEY` | API Key MailerLite | MailerLite Dashboard > API |
| `SENTRY_DSN` | DSN Sentry (optionnel) | Sentry Project Settings |

---

## 3. Zapier / Make — Workflows Métier (No-Code)

### Scénarios Prioritaires

| # | Workflow | Trigger | Actions | Outil |
|---|----------|---------|---------|-------|
| **1** | **Nouvel Article Blog → Réseaux Sociaux** | RSS Feed (nouvel item) | 1. Créer visuel Canva (template) 2. Rédiger légende (OpenAI) 3. Programmer Buffer (IG, FB, LI, Pinterest) | **Make** (plus puissant) |
| **2** | **Nouvelle Inscription NL → Séquence Bienvenue + Tag** | Netlify Form (webhook) | 1. MailerLite: Create/Update subscriber + tags 2. Notifier Slack 3. Logger Google Sheets | **Zapier** (simple) |
| **3** | **Nouvelle Vente Payhip → Tag Client + Commission Affilié** | Payhip Webhook (`sale.completed`) | 1. MailerLite: Tag `status:customer` + `purchased:book` 2. FirstPromoter: Enregistrer conversion 3. Google Sheets: Log vente | **Make** (multi-étapes) |
| **4** | **Nouvel Avis 5⭐ → Partage Social + Témoignage Site** | Google Forms / Typeform / Email parsing | 1. Créer visuel Canva (citation + photo) 2. Poster Buffer (IG Story + Feed) 3. Ajouter à page "Témoignages" (Decap CMS / JSON) | **Make** |
| **5** | **Alerte Monitoring → Incident Response** | UptimeRobot / Checkly / Sentry (webhook) | 1. Créer incident PagerDuty / Opsgenie 2. Notifier Slack #alerts 3. Logger Notion "Incident Log" | **Zapier** |
| **6** | **Backup Hebdo → Google Drive** | Schedule (Dimanche 3h) | 1. Exécuter script `backup.sh` (git + translations + skills) 2. Zip + Upload Google Drive / Dropbox 3. Notifier Slack | **Zapier** (Schedule + Webhook vers script) |
| **7** | **Rapport Mensuel Auto → Email + Slack** | Schedule (1er du mois 9h) | 1. Requêter GA4 (API) + Vercel Analytics + Payhip/Lulu/GP (CSV) 2. Générer Looker Studio PDF / Google Slides 3. Envoyer email (Gmail) + Poster Slack | **Make** (complexe) |

### Exemple Make Scenario : "Blog → Social" (Blueprint)
```json
{
  "name": "Blog to Social Media",
  "flow": [
    { "module": "RSS", "action": "Watch RSS Feed Items", "config": { "url": "https://kikienchrist.vercel.app/rss.xml" }},
    { "module": "OpenAI", "action": "Create Completion", "config": { "prompt": "Write 3 social captions (IG, FB, Pinterest) for blog post: {{title}}. Tone: inspiring, spiritual. Include CTA: 'Read more → link'. Hashtags: #foi #priere #spiritualite. Lang: {{lang}}", "model": "gpt-4o-mini" }},
    { "module": "Canva", "action": "Create Design from Template", "config": { "template_id": "blog-teaser-fr", "data": { "title": "{{title}}", "excerpt": "{{excerpt}}", "image_url": "{{image_url}}" }}},
    { "module": "Buffer", "action": "Create Post", "config": { "profiles": ["ig", "fb", "pinterest"], "text": "{{openai_result.ig}}", "media": "{{canva_result.url}}", "scheduled_at": "{{next_optimal_slot}}" }},
    { "module": "Slack", "action": "Post Message", "config": { "channel": "#social-media", "text": "✅ New blog post scheduled: {{title}}" }}
  ]
}
```

---

## 4. Netlify Functions — Serverless Métier (TypeScript)

### Liste Fonctions Actuelles / Prévues
| Fonction | Fichier | Trigger | Responsabilité |
|----------|---------|---------|----------------|
| **Newsletter Webhook** | `netlify/functions/newsletter.ts` | Netlify Form POST | Valider, MailerLite, Tags, Langue |
| **Payhip Webhook** | `netlify/functions/payhip-webhook.ts` | Payhip `sale.completed` | Tag MailerLite, FirstPromoter, Log |
| **Affiliate Click** | `netlify/functions/affiliate-click.ts` | Clic lien affilié (redirect) | Cookie 60j, Log click, Redirect |
| **Contact Form** | `netlify/functions/contact.ts` | Formulaire contact | Validation, Email (MailerLite/Resend), Slack |
| **Cookie Consent** | `netlify/functions/cookie-consent.ts` | POST consentement | Logger consentement (RGPD proof) |
| **Sitemap Ping** | `netlify/functions/sitemap-ping.ts` | Schedule (quotidien) | Ping Google/Bing sitemap |
| **Health Check** | `netlify/functions/health.ts` | UptimeRobot / Cron | Vérifier 9 langues + APIs critiques |

### Déploiement Netlify Functions
```bash
# 1. netlify.toml (racine)
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  external_node_modules = ["@netlify/functions"]

# 2. package.json scripts
"build:functions": "netlify deploy --build --functions=netlify/functions"

# 3. Déploiement auto via Netlify (connecté GitHub) OU manuel
netlify deploy --prod --functions=netlify/functions
```

---

## 5. Vercel Edge Middleware — Automatisation Runtime

### Cas d'Usage Actuels (`src/middleware.ts`)
| Fonction | Description |
|----------|-------------|
| **i18n Redirect** | Détection langue → Cookie → Redirect `/` → `/{lang}/` |
| **A/B Testing** | Assignation variante (cookie) → Header `x-exp-*` pour composants |
| **Security Headers** | CSP, HSTS, X-Frame-Options, Referrer-Policy (Edge = rapide) |
| **Bot Protection** | Bloquer user-agents malveillants connus (optionnel) |
| **Geo Redirect** (futur) | Pays → Langue par défaut (ex: BR → pt, MX → es) |

### Exemple : Security Headers Edge
```typescript
// src/middleware.ts (extrait)
const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP_POLICY, // Défini dans skill security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default async function middleware(request: Request) {
  const response = NextResponse.next();
  
  // Appliquer headers sécurité à TOUTES les réponses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // ... logique i18n, A/B, etc.
  
  return response;
}
```

---

## 6. Cron Jobs & Maintenance (Scripts Planifiés)

### Scripts Exécutables (`scripts/`)
| Script | Fréquence | Description | Déclencheur |
|--------|-----------|-------------|-------------|
| `validate-translations.js` | À chaque build | Zod schema `translations.json` | GitHub Actions |
| `validate-build.js` | Post-build | Vérifier 9 langues, hreflang, JSON-LD, CSS | GitHub Actions |
| `backup.sh` | Hebdo (Dimanche) | Git + translations + skills + config → Local/Drive | Zapier Schedule + Webhook |
| `check-broken-links.js` | Hebdo | Crawl site → Détecter 404 internes/externes | GitHub Actions (schedule) |
| `check-ssl-expiry.js` | Mensuel | Vérifier certificats (Vercel, domaines custom) | GitHub Actions (schedule) |
| `reconcile-sales.js` | Mensuel (5 du mois) | Télécharger CSV Lulu/Payhip/GP → Google Sheets | Make Schedule |
| `generate-monthly-report.js` | Mensuel (1er 9h) | GA4 + Vercel + Ventes → Looker Studio / Slack | Make Schedule |
| `update-sitemap-ping.js` | Quotidien (6h) | Ping Google/Bing + IndexNow (si configuré) | Netlify Function (cron) |
| `cleanup-old-previews.js` | Hebdo | Supprimer Vercel preview deployments > 30j | GitHub Actions (schedule) |

### Exemple : `scripts/check-broken-links.js`
```javascript
// scripts/check-broken-links.js
import { crawl } from 'node-crawler';  // ou custom fetch + parse

const BASE = 'https://kikienchrist.vercel.app';
const LANGS = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];

async function checkLinks() {
  const broken = [];
  
  for (const lang of LANGS) {
    const urls = await crawl(`${BASE}/${lang}/`);
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'HEAD', timeout: 5000 });
        if (!res.ok && res.status !== 405) { // 405 = HEAD non supporté
          broken.push({ url, status: res.status, lang });
        }
      } catch (e) {
        broken.push({ url, error: e.message, lang });
      }
    }
  }
  
  if (broken.length > 0) {
    console.error('🔴 BROKEN LINKS:', JSON.stringify(broken, null, 2));
    // Envoyer alerte Slack/Email
    process.exit(1);
  } else {
    console.log('✅ All links OK');
  }
}

checkLinks();
```

---

## 7. Alerting & Runbooks Opérationnels

### Niveaux Alerte
| Niveau | Déclencheur | Canal | Délai Réponse | Exemple |
|--------|-------------|-------|---------------|---------|
| **P0 - Critique** | Site down (UptimeRobot), Build failed (GA), Sentry error rate > 10% | Slack #alerts + SMS + Call (PagerDuty) | < 15 min | Prod down, Deploy failed |
| **P1 - Urgent** | LCP > 4s (Vercel), 5xx > 1% (Vercel), SSL expiring < 30j | Slack #alerts + Email | < 1h | Perf degrade, Certificat |
| **P2 - Attention** | Broken links, Sitemap vide, Analytics drop > 50%, Backup failed | Slack #ops | < 4h | Maintenance |
| **P3 - Info** | Nouveau déploiement, Nouvelle vente, Nouvel affilié, Nouveau commentaire | Slack #activity | - | Visibilité |

### Runbook Template (Notion / GitBook / Markdown)
```markdown
# Runbook: [Nom Incident] — P[0-3]

## 1. Symptômes
- [Ce qu'on observe : métriques, logs, alertes]

## 2. Diagnostic Rapide (5 min)
- [Commandes à lancer : `curl`, `vercel logs`, `sentry`, `gh actions`]

## 3. Causes Probables
- [Liste ordonnée par probabilité]

## 4. Actions de Contournement (Workaround)
- [Ex: Rollback Vercel, Disable middleware, Static fallback]

## 5. Résolution Définitive
- [Étapes précises + commandes]

## 6. Validation Post-Fix
- [Tests à faire : URLs, métriques, user journey]

## 7. Communication
- [Intervenants, canaux, template message client si impact]

## 8. Post-Mortem (Si P0/P1)
- [Rendez-vous 48h + Document : Timeline, Root Cause, Action Items]
```

### Runbooks Existants (À Créer/Maintenir)
| Runbook | Skill Référence | Priorité |
|---------|-----------------|----------|
| **Site Down / 5xx** | `emergency-runbook` + `monitoring` | P0 |
| **Deploy Failed / Rollback** | `deploy` + `emergency-runbook` | P0 |
| **Middleware Error (i18n broken)** | `middleware` + `emergency-runbook` | P0 |
| **Analytics/Tracking Broken** | `analytics` + `monitoring` | P1 |
| **Payments Webhook Failed** | `payments-ecommerce` + `monitoring` | P1 |
| **SEO Drop / Indexation** | `seo` + `monitoring` | P2 |
| **Accessibility Regression** | `accessibility` + `testing` | P2 |
| **Backup Failed** | `data-pipeline` | P2 |

---

## 8. Checklist Automatisation (Trimestrielle)

| Vérification | Fréquence | Responsable |
|--------------|-----------|-------------|
| GitHub Actions : Tous workflows verts (main) | Quotidien (auto) | GitHub Actions |
| Netlify Functions : Déployées + Logs propres | Hebdo | Vous |
| Zapier/Make : Scénarios actifs + Pas d'erreurs | Hebdo | Vous |
| Vercel Edge Middleware : Pas d'erreurs 5xx | Quotidien (Vercel Analytics) | Vous |
| Cron Jobs : Exécutés + Résultats OK | Selon fréquence | Vous |
| Alerting : Canaux fonctionnels (test mensuel) | Mensuel | Vous |
| Runbooks : À jour (dernière révision < 90j) | Trimestriel | Vous |
| Documentation workflows : Synchronisée avec code | À chaque changement | Vous |

---

*Skill créé le 2025-11-20. Automatisation = temps libéré pour stratégie + fiabilité opérationnelle.*