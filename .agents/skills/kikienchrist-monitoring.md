---
name: kikienchrist-monitoring
description: "Monitoring & Alerting (Uptime, Performance, Erreurs, Business) — Vercel, Sentry, UptimeRobot, Logs"
version: "1.0"
---

# Skill: kikienchrist-monitoring

## Stack Monitoring Recommandée

| Outil | Type | Coût | Couverture |
|-------|------|------|------------|
| **Vercel Analytics + Speed Insights** | RUM + Perf | Gratuit (10k/mois) | CWV, trafic, géo, referrers |
| **Vercel Logs** | Server/Edge logs | Inclus | Middleware, build, fonctions |
| **Sentry** | Error tracking | Gratuit (5k erreurs/mois) | Exceptions JS/TS, performance |
| **UptimeRobot** | Uptime monitoring | Gratuit (50 monitors) | Disponibilité HTTP(S) |
| **Checkly** | Synthetic monitoring | Gratuit (10k runs/mois) | API, user flows, SSL, DNS |
| **Google Search Console** | SEO/Indexation | Gratuit | Erreurs crawl, sitemap, requêtes |
| **Statuspage.io** | Public status | Gratuit (1 page) | Communication incidents |

## 1. Vercel (Natif — Déjà Actif)

### Analytics
- Dashboard → Project → Analytics → **Enable**
- Données : Page views, visiteurs, CWV (p75), top pages, referrers, pays, devices
- **Alertes** : Pas natives → utiliser Speed Insights + webhook

### Speed Insights
- Dashboard → Speed Insights → **Enable**
- Métriques : LCP, CLS, INP, TTFB (p50/p75/p95)
- **Alertes** : Pas natives → exporter vers BigQuery ou webhook custom

### Logs (Middleware + Build)
- Dashboard → Project → **Logs** (onglet)
- Filtres : `middleware`, `build`, `function`, `edge`
- **Rétention** : 30 jours (gratuit), 1 an (Pro)
- **Export** : CLI `vercel logs <deployment-url>` ou API

### Webhooks Vercel (Pour alertes custom)
```bash
# Settings → Git → Deploy Hooks → Create
# URL → envoyer vers Slack/Discord/PagerDuty/Zapier
```
Events : `deployment.created`, `deployment.ready`, `deployment.error`, `deployment.canceled`

## 2. Sentry (Error Tracking — Recommandé)

### Installation
```bash
npm install @sentry/astro
```
```astro
// astro.config.mjs
import sentry from '@sentry/astro';
export default defineConfig({
  integrations: [sentry({
    dsn: import.meta.env.SENTRY_DSN,
    tracesSampleRate: 0.1, // 10% transactions
    profilesSampleRate: 0.1,
  })]
});
```

### Configuration `.env`
```bash
SENTRY_DSN=https://xxxx@sentry.io/xxxx
SENTRY_ORG=my-org
SENTRY_PROJECT=kikienchrist
```

### Capture Erreurs Middleware (Edge)
```typescript
// src/middleware.ts
import * as Sentry from '@sentry/astro';

export default async function middleware(request: Request) {
  try {
    // ... logique middleware
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
```

### Alertes Sentry
- **Alert Rules** : Settings → Alerts → New Alert Rule
- Conditions recommandées :
  - `Event count > 10 in 5 minutes` → Critical
  - `New issue` → Warning
  - `Regressed issue` → Warning
- **Notifications** : Email, Slack, Discord, PagerDuty, Opsgenie, Webhook

## 3. UptimeRobot (Disponibilité — Simple & Gratuit)

### Configuration
1. `uptimerobot.com` → Add New Monitor
2. Type : **HTTP(s)**
3. URL : `https://kikienchrist.vercel.app/fr/` (ou `/` pour redirect)
4. Intervalle : **5 minutes** (gratuit)
5. Alertes : Email + Webhook (Slack/Discord)

### Monitors Recommandés
| URL | Intervalle | Alertes |
|-----|------------|---------|
| `https://kikienchrist.vercel.app/` | 5 min | Down > 2 checks |
| `https://kikienchrist.vercel.app/fr/` | 5 min | Down > 2 checks |
| `https://kikienchrist.vercel.app/en/` | 10 min | Down > 2 checks |
| `https://kikienchrist.vercel.app/sitemap.xml` | 30 min | Down > 1 check |
| `https://kikienchrist.vercel.app/robots.txt` | 60 min | Down > 1 check |

### Webhook Slack/Discord
```json
// UptimeRobot → My Settings → Alert Contacts → Add Alert Contact → Webhook
{
  "url": "https://hooks.slack.com/services/XXX/YYY/ZZZ",
  "method": "POST",
  "headers": { "Content-Type": "application/json" },
  "body": "{\"text\": \"🚨 *{monitorFriendlyName}* is {alertType}! {monitorURL}\"}"
}
```

## 4. Checkly (Synthetic Monitoring — User Flows)

### Pourquoi
- Teste **parcours utilisateur** (pas juste HTTP 200)
- Ex: "Arriver sur `/fr/` → voir Hero → cliquer 'Découvrir' → voir 4 livres → cliquer 'Papier' → Lulu s'ouvre"

### Configuration
```bash
npm install -g @checkly/cli
checkly login
```

### Check Example (`checks/homepage.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test('Homepage FR loads and shows 4 books', async ({ page }) => {
  await page.goto('https://kikienchrist.vercel.app/fr/');
  
  // Hero visible
  await expect(page.locator('.hero-title')).toBeVisible();
  
  // 4 miniatures Hero Fan
  await expect(page.locator('.fan img')).toHaveCount(4);
  
  // Section livres
  await expect(page.locator('#livres')).toBeVisible();
  
  // 4 cartes .book
  await expect(page.locator('.books-grid .book')).toHaveCount(4);
  
  // Bouton Papier livre 1 → lien Lulu
  const paperBtn = page.locator('.book[data-book-id="visage"] .btn-primary');
  await expect(paperBtn).toHaveAttribute('href', /lulu\.com/);
});
```

### Alertes Checkly
- **Frequency** : 10 min (gratuit)
- **Retries** : 2 (évite faux positifs)
- **Locations** : Paris, Frankfurt, New York (3 régions gratuites)
- **Notifications** : Slack, Email, PagerDuty, Webhook

## 5. Logs Centralisés (Optionnel — Pour Scale)

### Vercel → Better Stack / Logtail / Datadog
- Vercel Logs Drain → Settings → Log Drains → Add
- **Better Stack** (ex Logtail) : Gratuit 1GB/mois, requêtes SQL, alertes
- **Datadog** : Payant, enterprise

### Requêtes Utiles (Better Stack)
```sql
-- Erreurs middleware 5 dernières min
SELECT * FROM logs 
WHERE source = 'middleware' AND level = 'error' 
AND timestamp > now() - interval '5 minutes';

-- Temps réponse middleware p95
SELECT percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) 
FROM logs WHERE source = 'middleware' AND timestamp > now() - interval '1 hour';

-- Déploiements échoués
SELECT * FROM logs WHERE source = 'build' AND level = 'error';
```

## 6. Dashboard Unifié (Grafana Cloud / Better Stack)

### Métriques Clés (KPIs)
| KPI | Source | Seuil Alerte |
|-----|--------|--------------|
| **Disponibilité** | UptimeRobot | < 99.9% sur 24h |
| **LCP p75 mobile** | Vercel Speed Insights | > 2.5s |
| **CLS p75** | Vercel Speed Insights | > 0.1 |
| **INP p75** | Vercel Speed Insights | > 200ms |
| **Taux erreur JS** | Sentry | > 1% sessions |
| **Déploiements échoués** | Vercel Webhook | > 0 par jour |
| **Trafic organique** | Search Console | -20% vs semaine préc. |
| **Clics achat (événement)** | GA4 / Vercel Analytics | -30% vs semaine préc. |

## 7. Runbook Incidents (Procédures)

### Incident Type : Site Down (UptimeRobot alert)
1. Vérifier Vercel Dashboard → Deployments (dernier = error ?)
2. Vérifier Logs Vercel → Middleware / Build errors
3. Vérifier Sentry → Nouvelles erreurs critiques
4. Rollback : `vercel rollback <deployment-url>` ou redeploy commit précédent
5. Communiquer : Statuspage.io + Slack #alerts

### Incident Type : CWV Dégradé (Speed Insights / Lighthouse)
1. Identifier page(s) impactée(s)
2. Vérifier changements récents (images, CSS, JS, fonts)
3. Lighthouse local → comparer waterfall
4. Fix → Deploy → Surveiller 24h

### Incident Type : Erreurs JS en Production (Sentry)
1. Ouvrir Issue Sentry → Stack trace + contexte
2. Reproduire local si possible
3. Hotfix → Deploy `--force`
4. Marquer "Resolved" dans Sentry après verify

### Incident Type : Trafic/Conversion Chute (GA4 / Search Console)
1. Vérifier Search Console → Erreurs crawl / Indexation
2. Vérifier GA4 → Source/medium changement
3. Vérifier référents (backlinks perdus ?)
4. Action : SEO fix, contenu, technique

## Checklist Mensuelle Monitoring
- [ ] UptimeRobot : 100% uptime (ou incidents documentés)
- [ ] Vercel Speed Insights : CWV p75 dans cibles
- [ ] Sentry : 0 erreurs non résolues critiques
- [ ] Checkly : Tous checks passent (user flows OK)
- [ ] Search Console : 0 erreurs critiques nouvelles
- [ ] Vercel Logs : Pas d'erreurs middleware récurrentes
- [ ] Alertes : Toutes configurées + testées (Slack/Email reçus)

---
*Skill créé le 2025-11-20. Monitoring = sérénité + réactivité + données business.*