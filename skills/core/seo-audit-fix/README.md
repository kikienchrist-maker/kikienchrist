# @kikienchrist/seo-audit-fix

> Audit SEO complet + auto-fix pour sites Astro statiques.
> Audite: Lighthouse (Perf, A11y, BP, SEO), Meta tags, Schema.org, Hreflang, Contenu.
> Génère rapports HTML/JSON/Markdown + plan de corrections auto-applicables.

## Fonctionnalités

- 🕷️ **Découverte URLs** : Via sitemap.xml + crawl intelligent (max 300 pages)
- 🔍 **Audit multi-dimensionnel** :
  - **Meta** : Title, description, canonical, OG, Twitter, viewport, charset
  - **Schema.org** : WebSite, Organization, Article, BreadcrumbList, FAQPage, Blog, Book...
  - **Hreflang** : Bidirectionnel, x-default, 11 langues supportées
  - **Contenu** : H1 unique, images alt, liens cassés, readingTime, structure, mots-clés
  - **Lighthouse** : Performance, Accessibilité, Bonnes pratiques, SEO (optionnel)
- 🛠️ **Auto-fix intelligent** : Génère corrections pour Meta, Hreflang, Schema (applicables via script)
- 📊 **Rapports multiples** : HTML interactif, JSON (CI/CD), Markdown (docs), Plan de fixes
- ⚡ **Parallélisation** : `p-limit` configurable (défaut: 5)
- 🎯 **Seuils configurables** : Lighthouse ≥ 90/95/90/90 (perf/a11y/bp/seo)

## Installation

```bash
cd skills/core/seo-audit-fix
npm install
npm run build
```

## Usage

### CLI

```bash
# Audit complet du site déployé (découverte auto via sitemap)
seo-audit --url https://kikienchrist.vercel.app

# Avec Lighthouse (plus lent, ~30s/page)
seo-audit --url https://kikienchrist.vercel.app --lighthouse

# URLs spécifiques seulement
seo-audit --urls "https://kikienchrist.vercel.app/fr/,https://kikienchrist.vercel.app/en/blog/"

# Seuils personnalisés
seo-audit --performance 85 --accessibility 90 --best-practices 85 --seo 85

# Dossier de sortie personnalisé
seo-audit -o ./my-audit-report
```

### API

```typescript
import { runSEOAudit, SEOPipeline } from '@kikienchrist/seo-audit-fix';

// Simple
const report = await runSEOAudit({
  baseUrl: 'https://kikienchrist.vercel.app',
  runLighthouse: true,
  outputDir: './seo-audit-report',
});

// Avancé
const pipeline = new SEOPipeline({
  baseUrl: 'https://kikienchrist.vercel.app',
  lighthouseThresholds: { performance: 90, accessibility: 95, bestPractices: 90, seo: 90 },
  excludePatterns: ['/404', '/admin', '/private'],
  maxConcurrency: 10,
});

const report = await pipeline.run({
  urls: ['https://kikienchrist.vercel.app/fr/', 'https://kikienchrist.vercel.app/en/'],
  runLighthouse: true,
  lighthousePreset: 'desktop',
  outputDir: './seo-audit-report',
});
```

## Rapports générés

| Fichier | Description |
|---------|-------------|
| `report.html` | Rapport interactif avec filtres, détails dépliables, scores visuels |
| `report.json` | Données complètes pour analyse programmatique |
| `summary.json` | Résumé léger pour CI/CD (GitHub Actions, etc.) |
| `report.md` | Documentation Markdown |
| `fixes-plan.md` | Plan de corrections (auto-fixables vs manuels) |

## Intégration CI/CD

```yaml
# .github/workflows/seo-audit.yml
name: SEO Audit
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 0'  # Hebdomadaire

jobs:
  seo-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Install SEO Audit
        run: |
          cd skills/core/seo-audit-fix
          npm ci && npm run build
      - name: Run SEO Audit
        run: |
          node dist/cli.js --url https://kikienchrist.vercel.app --lighthouse -o ./seo-report
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: seo-audit-report
          path: skills/core/seo-audit-fix/seo-audit-report/
      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const summary = JSON.parse(fs.readFileSync('skills/core/seo-audit-fix/seo-audit-report/summary.json'));
            const body = `## 🔍 SEO Audit Results\n\n**Score moyen:** ${summary.averageScore}/100\n**Pages:** ${summary.auditedPages}\n**Erreurs:** ${summary.failedPages}\n\n### Top issues\n${summary.topIssues.slice(0,5).map(i => `- [${i.severity}] ${i.message} (${i.count} pages)`).join('\n')}`;
            github.rest.issues.createComment({ issue_number: context.issue.number, owner: context.repo.owner, repo: context.repo.repo, body });
```

## Architecture

```
src/
├── types.ts              # Types TypeScript complets
├── config.ts             # Config par défaut, règles, seuils
├── utils.ts              # Utilitaires (fetch, parse, DOM, URLs)
├── auditors/
│   ├── meta-auditor.ts       # Title, description, OG, Twitter, canonical...
│   ├── schema-auditor.ts     # JSON-LD: WebSite, Organization, Article, Breadcrumb, FAQ...
│   ├── hreflang-auditor.ts   # Bidirectionnel, x-default, 11 langues
│   ├── content-auditor.ts    # H1, images alt, liens, readingTime, structure
│   ├── lighthouse-auditor.ts # Lighthouse CI via npx
│   └── index.ts
├── fixers/
│   ├── meta-fixer.ts         # Génère corrections meta
│   ├── hreflang-fixer.ts     # Génère hreflang complets
│   ├── schema-fixer.ts       # Génère JSON-LD
│   ├── content-fixer.ts      # H1, alt, readingTime...
│   └── index.ts
├── reporters/
│   ├── html-reporter.ts      # HTML interactif
│   ├── json-reporter.ts      # JSON + summary CI
│   ├── markdown-reporter.ts  # MD + fixes plan
│   └── index.ts
├── seo-pipeline.ts       # Orchestration: discover → audit → fix → report
├── cli.ts                # Interface ligne de commande
└── index.ts              # Exports publics
```

## Prérequis

- Node.js ≥ 20
- Pour Lighthouse: Chrome/Chromium installé (`npx lighthouse` gère l'installation)

## Langues supportées

FR, EN, ES, PT, IT, DE, NL, PL, AR, RU, ZH, HI + x-default

## Licence

MIT