# GitHub Actions CI/CD Generator Skill

Générateur de pipeline CI/CD complet pour projets Astro/Vercel avec 8-10 jobs parallèles.

## Fonctionnalités

- 🔍 **Lint** : ESLint + Prettier
- 🔬 **TypeCheck** : TypeScript + `astro check`
- 🧪 **Unit Tests** : Vitest + couverture Codecov
- 🏗️ **Build** : Astro static export + artifact upload
- 🎭 **E2E Tests** : Playwright (Chrome, Firefox, Safari, Mobile)
- ♿ **Accessibilité** : axe-core / Playwright a11y
- 🚀 **Lighthouse CI** : Budgets perf/a11y/bp/seo (90/95/90/90)
- 🔒 **Security** : npm audit + CodeQL
- 🚀 **Deploy Preview** : Vercel Preview sur PR
- 🌍 **Deploy Production** : Vercel Production sur push main

## Installation

```bash
cd skills/infra/github-actions-ci
npm install
npm run build
```

## Usage CLI

```bash
# Génération complète (workflow + lighthouse + playwright)
gha-ci full -o .

# Génération workflow seul
gha-ci generate -o .github/workflows --project-name kikienchrist

# Config Lighthouse seul
gha-ci lighthouse-config -o lighthouserc.json

# Config Playwright seul
gha-ci playwright-config -o playwright.config.ts

# Dry-run (afficher YAML)
gha-ci generate --dry-run
```

## Fichiers générés par `gha-ci full`

```
├── .github/workflows/ci.yml          # Pipeline CI/CD complet
├── lighthouserc.json                 # Budgets Lighthouse CI
├── playwright.config.ts              # Config Playwright multi-navigateur
└── e2e/                              # À créer: tests Playwright
```

## Jobs du pipeline

| Job | Dépendances | Description |
|-----|-------------|-------------|
| `lint` | - | ESLint + Prettier check |
| `typecheck` | - | TypeScript + `astro check` |
| `unit` | - | Vitest unit tests + coverage |
| `build` | lint, typecheck, unit | Build Astro + upload artifact |
| `e2e` | build | Playwright tests multi-browser |
| `a11y` | build | Tests accessibilité axe-core |
| `lighthouse` | build | Lighthouse CI budgets |
| `security` | - | npm audit + CodeQL |
| `deploy_preview` | build, e2e, a11y, lighthouse, security | Vercel Preview |
| `deploy_production` | deploy_preview | Vercel Production (main only) |

## Secrets GitHub requis

Dans **Settings > Secrets and variables > Actions** :

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Token Vercel (Settings > Tokens) |
| `VERCEL_ORG_ID` | Org ID Vercel (Settings > General) |
| `VERCEL_PROJECT_ID` | Project ID Vercel (Settings > General) |
| `NETLIFY_AUTH_TOKEN` | (Optionnel) Token Netlify |
| `NETLIFY_SITE_ID` | (Optionnel) Site ID Netlify |
| `LHCI_GITHUB_APP_TOKEN` | (Optionnel) Token Lighthouse CI |
| `CODECOV_TOKEN` | (Optionnel) Token Codecov |

## Budgets Lighthouse (lighthouserc.json)

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

## Playwright Config

- 5 projets : Desktop Chrome/Firefox/Safari + Mobile Chrome/Safari
- WebServer auto-start pour `pnpm preview`
- Rapports HTML + JUnit
- Traces + screenshots + vidéos sur échec

## Tests d'accessibilité

Dans `e2e/a11y/` :
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/fr/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toHaveLength(0);
});
```

## Déclencheurs

- **Push** sur `main` / `develop` → Pipeline complet + Deploy Production (main seulement)
- **Pull Request** vers `main` / `develop` → Pipeline complet + Deploy Preview
- **Workflow Dispatch** → Manuel avec choix preview/production

## Tests

```bash
npm test
```

## API Programmable

```typescript
import { mergeConfig, generateWorkflow } from '@kikienchrist/github-actions-ci';

const config = mergeConfig({
  projectName: 'mon-projet',
  jobs: { e2e: false },
  lighthouse: { budgets: { performance: 85 } },
});

const { workflowYml } = generateWorkflow(config);
// Écrire workflowYml dans .github/workflows/ci.yml
```