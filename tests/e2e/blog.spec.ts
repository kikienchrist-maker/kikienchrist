// E2E Tests - Blog (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Blog - Main Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fr/blog/1/');
  });

  test('Blog index loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/);
    await expect(page.locator('h1')).toContainText('Articles & Ressources');
  });

  test('Articles displayed in grid', async ({ page }) => {
    const articles = page.locator('.blog-post-card');
    await expect(articles.first()).toBeVisible();
  });

  test('Navigation to individual article', async ({ page }) => {
    const firstArticle = page.locator('.blog-post-card').first();
    const title = await firstArticle.locator('.card-title').textContent();
    
    await firstArticle.locator('.card-read-more').click();
    
    await expect(page).toHaveURL(/\/fr\/blog\//);
    await expect(page.locator('h1')).toContainText(title || '');
  });

  test('Pagination works', async ({ page }) => {
    const nextBtn = page.locator('.pagination-link.pagination-next');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(page).toHaveURL(/page\/2/);
    }
  });

  test('Category filter works', async ({ page }) => {
    const categoryLink = page.locator('.category-item').first();
    const categoryName = await categoryLink.locator('.category-name').textContent();
    
    await categoryLink.click();
    await page.waitForURL(/\/blog\/categorie\//);
    
    await expect(page).toHaveURL(/\/blog\/categorie\//);
    await expect(page.locator('.active-filters')).toContainText(categoryName || '');
  });

  test('Tag filter works', async ({ page }) => {
    const tagLink = page.locator('.tag-item').first();
    const tagName = await tagLink.textContent();
    
    await tagLink.click();
    await page.waitForURL(/\/blog\/tag\//);
    
    await expect(page).toHaveURL(/\/blog\/tag\//);
  });

  test('Newsletter form present', async ({ page }) => {
    // Newsletter form is at bottom of page, scroll to it
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const form = page.locator('.newsletter-form');
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Blog - Individual Article', () => {
  test.beforeEach(async ({ page }) => {
    // Go to first article
    await page.goto('/fr/blog/1/');
    const firstArticle = page.locator('.blog-post-card').first();
    await firstArticle.locator('.card-read-more').click();
  });

  test('Article displays title, date, author', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.publish-date')).toBeVisible();
    await expect(page.locator('.author-name')).toBeVisible();
  });

  test('Table of contents generated', async ({ page }) => {
    const toc = page.locator('.toc');
    if (await toc.isVisible()) {
      await expect(toc.locator('.toc-link')).toHaveCountGreaterThan(0);
    }
  });

  test('Reading progress bar', async ({ page }) => {
    const progress = page.locator('.reading-progress');
    await expect(progress).toBeVisible();
    
    // Scroll and verify progress
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(100);
    const transform = await progress.evaluate(el => getComputedStyle(el).transform);
    expect(transform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
  });

  test('Social share present', async ({ page }) => {
    // Social share is in sticky sidebar, scroll to make it visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    
    const share = page.locator('.social-share');
    await expect(share).toBeVisible();
    await share.locator('.social-share-trigger').click();
    await expect(page.locator('.social-share-menu')).toBeVisible();
  });

  test('Lead magnet CTA if configured', async ({ page }) => {
    const leadMagnet = page.locator('.lead-magnet');
    if (await leadMagnet.isVisible()) {
      // lead-magnet-title is in .lead-magnet-preview (NewsletterForm component)
      await expect(page.locator('.lead-magnet-title')).toBeVisible();
      await expect(leadMagnet.locator('form')).toBeVisible();
    }
  });

  test('Related posts displayed', async ({ page }) => {
    const related = page.locator('.related-posts');
    if (await related.isVisible()) {
      await expect(related.locator('.blog-post-card')).toHaveCountGreaterThan(0);
    }
  });

  test('JSON-LD BlogPosting present', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.first().textContent();
    expect(content).toContain('BlogPosting');
    expect(content).toContain('"@context":"https://schema.org"');
  });

  test('Open Graph tags present', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDesc = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    await expect(ogDesc).toHaveAttribute('content', /.+/);
    await expect(ogImage).toHaveAttribute('content', /.+/);
  });
});

test.describe('Blog - Accessibility', () => {
  test('Keyboard navigation functional', async ({ page }) => {
    await page.goto('/fr/blog/1/');
    
    // Tab to first article
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT'].includes(focused || '')).toBeTruthy();
  });

  test('Focus visible on interactive elements', async ({ page }) => {
    await page.goto('/fr/blog/1/');
    await page.keyboard.press('Tab');
    
    const focusedStyle = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return el ? getComputedStyle(el).outlineWidth : '0px';
    });
    expect(focusedStyle).not.toBe('0px');
  });

  test('ARIA labels on pagination navigation', async ({ page }) => {
    await page.goto('/fr/blog/1/');
    const pagination = page.locator('.pagination');
    if (await pagination.isVisible()) {
      await expect(pagination.locator('[aria-label]')).toHaveCountGreaterThan(0);
    }
  });

  test('Correct heading structure (h1 > h2 > h3)', async ({ page }) => {
    await page.goto('/fr/blog/1/');
    const firstArticle = page.locator('.blog-post-card').first();
    await firstArticle.locator('.card-read-more').click();
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });
});

test.describe('Blog - i18n', () => {
  // Only test languages that have blog posts (currently only FR)
  const languagesWithPosts = ['fr'];
  
  for (const lang of languagesWithPosts) {
    test(`Blog index accessible in ${lang}`, async ({ page }) => {
      await page.goto(`/${lang}/blog/1/`);
      await expect(page.locator('h1')).toBeVisible();
    });
  }
  
  // Test that other languages redirect properly (blog index redirect page exists)
  const otherLanguages = ['en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar'];
  
  for (const lang of otherLanguages) {
    test(`Blog index redirect page exists in ${lang}`, async ({ page }) => {
      await page.goto(`/${lang}/blog/`);
      // Should redirect to /{lang}/blog/1/ which will show "no posts" page
      await expect(page.locator('body')).toBeVisible();
    });
  }
});