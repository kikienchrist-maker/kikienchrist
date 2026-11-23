---
name: kikienchrist-testing
description: "Stratégie de Tests (Unit, Intégration, E2E, Visual, Accessibilité, Performance) — Vitest, Playwright, Lighthouse CI"
version: "1.0"
---

# Skill: kikienchrist-testing

## Philosophie
**Tests = Confiance pour déployer vite.** Pas de couverture 100% — tester ce qui casse en prod (i18n, achat, SEO, perf).

---

## 1. Pyramide de Tests

| Niveau | Outil | Cible | Vitesse | Couverture |
|--------|-------|-------|---------|------------|
| **Unit** | Vitest | Utils (`i18n.ts`, `seo.ts`, `analytics.ts`), composants purs | < 1s | Logique critique |
| **Intégration** | Vitest + Astro | Pages `[lang]/index.astro` (rendu HTML, props, JSON-LD) | < 5s | Flux données |
| **E2E** | Playwright | Parcours utilisateur (redirect, achat, newsletter, blog) | 30-60s | Critiques business |
| **Visual** | Playwright + pixelmatch | Regression visuelle (Hero, BookCard, Blog, Mobile) | 60s | Design system |
| **Accessibilité** | axe-core / Lighthouse | WCAG 2.1 AA (automatisé) | 10s | Conformité |
| **Performance** | Lighthouse CI | CWV budgets (LCP<2.5s, CLS<0.1, INP<200ms) | 60s | Budgets perf |

---

## 2. Configuration

### `package.json` (Scripts Tests)
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "playwright test --project=visual",
    "test:a11y": "playwright test --project=a11y",
    "test:perf": "lhci autorun",
    "test:all": "npm run test && npm run test:e2e && npm run test:a11y"
  },
  "devDependencies": {
    "vitest": "^1.3.0",
    "@playwright/test": "^1.42.0",
    "@lhci/cli": "^0.12.0",
    "axe-core": "^4.8.0",
    "pixelmatch": "^5.3.0",
    "pngjs": "^7.0.0",
    "happy-dom": "^13.0.0"
  }
}
```

### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
});
```

### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://kikienchrist.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
      testMatch: '**/*.visual.spec.ts',
    },
    {
      name: 'a11y',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.a11y.spec.ts',
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### `lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": [
        "http://localhost:4321/fr/",
        "http://localhost:4321/en/",
        "http://localhost:4321/fr/blog/",
        "http://localhost:4321/fr/blog/test-article/"
      ],
      "settings": {
        "preset": "desktop",
        "headless": true,
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }],
      }
    },
    "upload": {
      "target": "temporary-public-storage",
    }
  }
}
```

---

## 3. Tests Unitaires (Vitest)

### `tests/setup.ts`
```typescript
import { vi } from 'vitest';

// Mock import.meta.env pour tests
Object.defineProperty(import.meta, 'env', {
  value: {
    PUBLIC_SITE_URL: 'https://kikienchrist.vercel.app',
    PUBLIC_GA_ID: 'G-TEST',
  },
  writable: true,
});

// Mock fetch pour tests API
global.fetch = vi.fn();
```

### `src/utils/i18n.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { detectLanguageFromHeader, SUPPORTED_LANGS, generateHreflangLinks } from '../utils/i18n';

describe('i18n utils', () => {
  describe('detectLanguageFromHeader', () => {
    it('returns fr for fr-FR,fr;q=0.9', () => {
      expect(detectLanguageFromHeader('fr-FR,fr;q=0.9,en-US;q=0.8')).toBe('fr');
    });
    it('returns en for en-US,en;q=0.9', () => {
      expect(detectLanguageFromHeader('en-US,en;q=0.9,fr;q=0.8')).toBe('en');
    });
    it('returns first supported for multiple', () => {
      expect(detectLanguageFromHeader('de-DE,de;q=0.9,fr-FR,fr;q=0.8')).toBe('de');
    });
    it('falls back to fr for unsupported', () => {
      expect(detectLanguageFromHeader('ja-JP,ja;q=0.9')).toBe('fr');
    });
    it('handles empty header', () => {
      expect(detectLanguageFromHeader('')).toBe('fr');
    });
  });

  describe('generateHreflangLinks', () => {
    it('generates 9 hreflang + x-default', () => {
      const links = generateHreflangLinks('/', 'fr');
      expect(links).toHaveLength(10);
      expect(links.some(l => l.includes('hreflang="x-default"'))).toBe(true);
      SUPPORTED_LANGS.forEach(lang => {
        expect(links.some(l => l.includes(`hreflang="${lang}"`))).toBe(true);
      });
    });
    it('uses correct base URL', () => {
      const links = generateHreflangLinks('/blog/test/', 'en');
      expect(links[0]).toContain('https://kikienchrist.vercel.app/en/blog/test/');
    });
  });
});
```

### `src/utils/seo.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { generateBookJsonLd, generateFAQJsonLd } from '../utils/seo';

describe('SEO JSON-LD generators', () => {
  describe('generateBookJsonLd', () => {
    it('creates valid Book schema with offers', () => {
      const book = {
        id: 'visage',
        name: 'Le visage de Dieu',
        isbn: '9791035977887',
        numberOfPages: 331,
        inLanguage: 'fr',
        image: 'https://i.ibb.co/cover.jpg',
        offers: [
          { price: '13.90', priceCurrency: 'EUR', url: 'https://lulu.com/fr/...', seller: { name: 'Lulu' }, availability: 'https://schema.org/InStock' },
          { price: '3.99', priceCurrency: 'USD', url: 'https://payhip.com/b/...', seller: { name: 'Payhip' }, availability: 'https://schema.org/InStock' },
        ],
      };
      const jsonLd = generateBookJsonLd(book, 'fr');
      const parsed = JSON.parse(jsonLd);
      
      expect(parsed['@type']).toBe('Book');
      expect(parsed.name).toBe('Le visage de Dieu');
      expect(parsed.isbn).toBe('9791035977887');
      expect(parsed.offers).toHaveLength(2);
      expect(parsed.offers[0].seller.name).toBe('Lulu');
    });
  });

  describe('generateFAQJsonLd', () => {
    it('creates valid FAQPage schema', () => {
      const faq = [
        { q: 'Comment commander ?', a: 'Cliquez sur les boutons...' },
        { q: 'Quels formats ?', a: 'Papier, Ebook, Audio...' },
      ];
      const jsonLd = generateFAQJsonLd(faq);
      const parsed = JSON.parse(jsonLd);
      
      expect(parsed['@type']).toBe('FAQPage');
      expect(parsed.mainEntity).toHaveLength(2);
      expect(parsed.mainEntity[0]['@type']).toBe('Question');
      expect(parsed.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });
  });
});
```

---

## 4. Tests Intégration (Astro + Vitest)

### `tests/integration/pages.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-astro'; // ou @astrojs/test
import FrIndex from '../../src/pages/[lang]/index.astro';

describe('[lang]/index.astro', () => {
  it('renders hero with translated title', async () => {
    const page = await render(FrIndex, { props: { locale: 'fr' } });
    expect(page.html()).toContain('Foi en Dieu'); // ou titre FR attendu
  });

  it('renders 4 book cards', async () => {
    const page = await render(FrIndex, { props: { locale: 'fr' } });
    const books = page.querySelectorAll('.book');
    expect(books).toHaveLength(4);
  });

  it('includes JSON-LD ItemList + 4 Books', async () => {
    const page = await render(FrIndex, { props: { locale: 'fr' } });
    const scripts = page.querySelectorAll('script[type="application/ld+json"]');
    const jsonLd = Array.from(scripts).map(s => JSON.parse(s.textContent));
    const itemList = jsonLd.find(j => j['@type'] === 'ItemList');
    expect(itemList).toBeDefined();
    expect(itemList.itemListElement).toHaveLength(4);
  });

  it('includes hreflang links for all 9 languages', async () => {
    const page = await render(FrIndex, { props: { locale: 'fr' } });
    const links = page.querySelectorAll('link[rel="alternate"][hreflang]');
    expect(links).toHaveLength(10); // 9 langs + x-default
  });
});
```

---

## 5. Tests E2E (Playwright)

### `tests/e2e/i18n.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

const LANGS = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];

test.describe('i18n - Language Detection & Redirect', () => {
  test('root redirects to detected language', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Doit rediriger vers /fr/ (défaut) ou langue navigateur
    await expect(page).toHaveURL(/\/fr\//);
  });

  LANGS.forEach(lang => {
    test(`/${lang}/ loads correctly`, async ({ page }) => {
      await page.goto(`/${lang}/`, { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      // Hero visible
      await expect(page.locator('.hero-title')).toBeVisible();
      // 4 livres
      await expect(page.locator('.books-grid .book')).toHaveCount(4);
      // Hero Fan 4 images
      await expect(page.locator('.fan img')).toHaveCount(4);
    });
  });

  test('language switcher navigates correctly', async ({ page }) => {
    await page.goto('/fr/');
    // Footer language switcher
    await page.click('footer a[hreflang="en"]');
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
```

### `tests/e2e/purchase.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test('book card paper button links to Lulu with correct locale', async ({ page }) => {
    await page.goto('/fr/');
    const firstBook = page.locator('.books-grid .book').first();
    const paperBtn = firstBook.locator('.btn-primary');
    await expect(paperBtn).toHaveAttribute('href', /lulu\.com\/fr\//);
  });

  test('book card ebook button links to Payhip', async ({ page }) => {
    await page.goto('/en/');
    const firstBook = page.locator('.books-grid .book').first();
    const ebookBtn = firstBook.locator('.btn-ghost').first();
    await expect(ebookBtn).toHaveAttribute('href', /payhip\.com/);
  });

  test('book card audio button links to Google Play', async ({ page }) => {
    await page.goto('/es/');
    const firstBook = page.locator('.books-grid .book').first();
    const audioBtn = firstBook.locator('.btn-ghost').nth(1);
    await expect(audioBtn).toHaveAttribute('href', /play\.google\.com/);
  });
});
```

### `tests/e2e/newsletter.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Newsletter Form', () => {
  test('form has Netlify Forms attributes', async ({ page }) => {
    await page.goto('/fr/');
    const form = page.locator('.leadbox form');
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form.locator('input[name="email"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('form submits to Netlify (preview)', async ({ page }) => {
    await page.goto('/fr/');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    // Netlify Forms redirect vers /success ou affiche message
    await expect(page.locator('.leadbox')).toContainText(/merci|inscrit|confirm/i);
  });
});
```

### `tests/e2e/blog.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('blog index lists articles', async ({ page }) => {
    await page.goto('/fr/blog/');
    await expect(page.locator('.blog-grid .blog-card')).toHaveCountGreaterThan(0);
  });

  test('article page has JSON-LD BlogPosting', async ({ page }) => {
    await page.goto('/fr/blog/comment-prier-quand-les-mots-manquent/');
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    const jsonLds = await Promise.all(scripts.map(s => s.textContent().then(JSON.parse)));
    const blogPosting = jsonLds.find(j => j['@type'] === 'BlogPosting');
    expect(blogPosting).toBeDefined();
    expect(blogPosting.headline).toBeTruthy();
    expect(blogPosting.inLanguage).toBe('fr');
  });
});
```

---

## 6. Tests Visuels (Regression)

### `tests/e2e/visual.spec.ts`
```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const BASELINE_DIR = 'tests/visual/baselines';
const DIFF_DIR = 'tests/visual/diffs';

function compareScreenshots(actual: Buffer, baselineName: string, threshold = 0.02) {
  const baselinePath = path.join(BASELINE_DIR, `${baselineName}.png`);
  if (!fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, actual);
    return { pass: true, message: 'Baseline created' };
  }
  const baseline = fs.readFileSync(baselinePath);
  const imgActual = PNG.sync.read(actual);
  const imgBaseline = PNG.sync.read(baseline);
  const { width, height } = imgActual;
  const diff = new PNG({ width, height });
  const mismatches = pixelmatch(imgActual.data, imgBaseline.data, diff.data, width, height, { threshold });
  const diffRatio = mismatches / (width * height);
  
  if (diffRatio > threshold) {
    fs.writeFileSync(path.join(DIFF_DIR, `${baselineName}.diff.png`), PNG.sync.write(diff));
    return { pass: false, message: `Visual regression: ${(diffRatio * 100).toFixed(2)}% diff` };
  }
  return { pass: true, message: 'OK' };
}

test.describe('Visual Regression', () => {
  const VIEWS = [
    { name: 'home-fr-desktop', url: '/fr/', viewport: { width: 1280, height: 720 } },
    { name: 'home-en-desktop', url: '/en/', viewport: { width: 1280, height: 720 } },
    { name: 'home-fr-mobile', url: '/fr/', viewport: { width: 375, height: 667 } },
    { name: 'book-card-fr', url: '/fr/', viewport: { width: 1280, height: 720 }, selector: '.books-grid .book:first-child' },
    { name: 'hero-fan-fr', url: '/fr/', viewport: { width: 1280, height: 720 }, selector: '.fan' },
    { name: 'blog-index-fr', url: '/fr/blog/', viewport: { width: 1280, height: 720 } },
  ];

  VIEWS.forEach(view => {
    test(view.name, async ({ page }) => {
      await page.setViewportSize(view.viewport);
      await page.goto(view.url, { waitUntil: 'networkidle' });
      // Attendre images chargées
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      const screenshot = view.selector 
        ? await page.locator(view.selector).screenshot()
        : await page.screenshot({ fullPage: false });
      
      const result = compareScreenshots(screenshot, view.name);
      expect(result.pass, result.message).toBe(true);
    });
  });
});
```

---

## 7. Tests Accessibilité (axe-core + Playwright)

### `tests/e2e/a11y.spec.ts`
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility WCAG 2.1 AA', () => {
  const PAGES = ['/fr/', '/en/', '/fr/blog/', '/fr/blog/test-article/'];

  PAGES.forEach(url => {
    test(`${url} - no violations`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' });
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'best-practice'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toHaveLength(0);
    });
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/fr/');
    // Tab through all interactive elements
    const focusable = await page.locator('a, button, input, select, summary, [tabindex]:not([tabindex="-1"])').all();
    for (const el of focusable) {
      await el.focus();
      await expect(el).toBeFocused();
      // Vérifier focus visible
      const box = await el.boundingBox();
      expect(box).toBeTruthy();
    }
  });

  test('skip link works', async ({ page }) => {
    await page.goto('/fr/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
}
```

---

## 8. CI/CD Pipeline (GitHub Actions)

### `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test
      - uses: codecov/codecov-action@v3
        if: always()

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist, retention-days: 1 }

  e2e-tests:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: test-results, retention-days: 7 }

  visual-tests:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:visual
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: visual-diffs, path: tests/visual/diffs, retention-days: 7 }

  a11y-tests:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:a11y

  perf-tests:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:perf

  deploy-preview:
    runs-on: ubuntu-latest
    needs: [e2e-tests, a11y-tests, visual-tests]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod=false'

  deploy-prod:
    runs-on: ubuntu-latest
    needs: [e2e-tests, a11y-tests, perf-tests]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod --force'
```

---

## 9. Checklist Qualité par PR

```markdown
# PR Template (.github/pull_request_template.md)

## Description
<!-- Ce que fait cette PR -->

## Tests
- [ ] `npm run test` passe (unit + integration)
- [ ] `npm run test:e2e` passe (chromium, firefox, webkit, mobile)
- [ ] `npm run test:a11y` passe (0 violations WCAG 2.1 AA)
- [ ] `npm run test:visual` passe (pas de régression visuelle)
- [ ] `npm run build` passe (0 erreurs TypeScript/Astro)

## Checklist Fonctionnelle
- [ ] i18n : 9 langues testées (redirect, contenu, URLs achat)
- [ ] Achat : Boutons Lulu/Payhip/GP pointent bons URLs par langue
- [ ] Newsletter : Formulaire Netlify valide
- [ ] Blog : Articles affichés + JSON-LD valide
- [ ] Mobile : ≤760px responsive OK
- [ ] Performance : Lighthouse CI ≥ 90 (perf, a11y, SEO)

## Déploiement
- [ ] Preview Vercel généré
- [ ] Test manuel sur Preview URL
- [ ] Approuvé pour merge
```

---

## 10. Métriques de Qualité (Objectifs)

| Métrique | Cible | Alerte |
|----------|-------|--------|
| **Couverture Unit** | ≥ 60% | < 50% |
| **Couverture E2E (parcours critiques)** | 100% (redirect, achat, newsletter, blog) | < 100% |
| **Violations Accessibilité** | 0 (WCAG 2.1 AA) | > 0 |
| **Régression Visuelle** | 0 diff > 2% | > 0 |
| **Lighthouse Performance** | ≥ 90 | < 85 |
| **Lighthouse Accessibilité** | ≥ 95 | < 90 |
| **Lighthouse SEO** | ≥ 90 | < 85 |
| **Temps Build + Tests CI** | < 10 min | > 15 min |

---
*Skill créé le 2025-11-20. Tests = filet de sécurité pour itérer vite sans casser.*