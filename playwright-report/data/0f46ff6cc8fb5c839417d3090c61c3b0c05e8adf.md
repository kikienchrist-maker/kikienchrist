# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Smoke Tests - Core Pages Load (HTTP 200) >> Category Priere FR loads successfully
- Location: tests\e2e\smoke.spec.ts:19:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Page snapshot

```yaml
- main [ref=e2]:
  - 'heading "404: Not Found" [level=1] [ref=e7]'
  - generic [ref=e8]: "Path: /fr/blog/categorie/priere/"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Smoke Tests - Core Pages Load (HTTP 200)', () => {
  4  |   const pages = [
  5  |     { path: '/fr/', name: 'Homepage FR' },
  6  |     { path: '/en/', name: 'Homepage EN' },
  7  |     { path: '/fr/blog/1/', name: 'Blog Index FR' },
  8  |     { path: '/en/blog/1/', name: 'Blog Index EN' },
  9  |     { path: '/fr/blog/priere-quotidienne-7-cles/', name: 'Blog Article FR' },
  10 |     { path: '/fr/blog/categorie/priere/', name: 'Category Priere FR' },
  11 |     { path: '/fr/mentions-legales/', name: 'Mentions Légales FR' },
  12 |     { path: '/fr/confidentialite/', name: 'Confidentialité FR' },
  13 |     { path: '/fr/cookies/', name: 'Cookies FR' },
  14 |     { path: '/fr/cgv/', name: 'CGV FR' },
  15 |     { path: '/fr/accessibilite/', name: 'Accessibilité FR' },
  16 |   ];
  17 | 
  18 |   for (const { path, name } of pages) {
  19 |     test(`${name} loads successfully`, async ({ page }) => {
  20 |       const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
> 21 |       expect(response?.status()).toBe(200);
     |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
  22 |       // Page has some content
  23 |       await expect(page.locator('body')).toBeVisible();
  24 |     });
  25 |   }
  26 | });
  27 | 
  28 | test.describe('Basic Accessibility Checks', () => {
  29 |   test('Homepage has lang attribute', async ({ page }) => {
  30 |     await page.goto('/fr/');
  31 |     const html = page.locator('html');
  32 |     await expect(html).toHaveAttribute('lang', 'fr');
  33 |   });
  34 | 
  35 |   test('Blog article has single h1', async ({ page }) => {
  36 |     await page.goto('/fr/blog/priere-quotidienne-7-cles/');
  37 |     const h1 = page.locator('h1');
  38 |     await expect(h1).toHaveCount(1);
  39 |   });
  40 | 
  41 |   test('Legal pages have main content area', async ({ page }) => {
  42 |     await page.goto('/fr/mentions-legales/');
  43 |     const main = page.locator('main, [role="main"], article').first();
  44 |     await expect(main).toBeVisible();
  45 |   });
  46 | });
  47 | 
  48 | test.describe('Cookie Consent (GA4)', () => {
  49 |   test('Cookie banner exists on first visit', async ({ page }) => {
  50 |     await page.goto('/fr/');
  51 |     const banner = page.locator('#cookie-banner, .cookie-banner, [role="dialog"]').first();
  52 |     // Banner may or may not exist depending on consent cookie
  53 |     // Just verify page loads without JS error
  54 |     await expect(page.locator('body')).toBeVisible();
  55 |   });
  56 | });
```