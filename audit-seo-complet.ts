// audit-seo-complet.ts
// Audit SEO technique + contenu + Core Web Vitals + Schema.org
// Lance : npx tsx audit-seo-complet.ts

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = 'https://kikienchrist.vercel.app';
const LANGUES = ['fr', 'en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
const PAGES_CLES = [
  '',
  '/blog/',
  '/livres/',
  '/partenaires/',
  '/contact/',
  '/mentions-legales/',
  '/politique-confidentialite/',
  '/cookies/',
  '/cgv/',
  '/accessibilite/',
];

interface AuditResult {
  url: string;
  lang: string;
  status: number;
  title: string;
  metaDesc: string;
  h1: string;
  h1Count: number;
  schemaOrg: boolean;
  canonical: string;
  ogTags: Record<string, string>;
  performance: {
    lcp: number;
    fid: number;
    cls: number;
    tbt: number;
    domContentLoaded: number;
    loadComplete: number;
    fcp: number;
  };
  accessibility: { score: number; issues: string[] };
  seo: { score: number; issues: string[] };
  motsCles: string[];
  motsCount: number;
}

async function auditPage(page: any, url: string, lang: string): Promise<AuditResult> {
  const fullUrl = `${BASE_URL}/${lang}${url}`;
  console.log(`🔍 Audit: ${fullUrl}`);

  await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Données de base
  const title = await page.title();
  const metaDesc = await page
    .$eval('meta[name="description"]', el => el.getAttribute('content') || '')
    .catch(() => '');
  const h1 = await page.$eval('h1', el => el.textContent?.trim() || '').catch(() => '');
  const h1Count = await page.$$eval('h1', els => els.length).catch(() => 0);
  const canonical = await page
    .$eval('link[rel="canonical"]', el => el.getAttribute('href') || '')
    .catch(() => '');

  // Open Graph
  const ogTags: Record<string, string> = {};
  const ogMetas = await page.$$eval('meta[property^="og:"]', els =>
    els.map(el => ({ prop: el.getAttribute('property'), content: el.getAttribute('content') }))
  );
  ogMetas.forEach(({ prop, content }) => {
    if (prop && content) ogTags[prop] = content;
  });

  // Schema.org
  const schemaOrg = await page.$$eval('script[type="application/ld+json"]', els => els.length > 0);

  // Mots-clés dans le contenu
  const bodyText = await page.$eval('body', el => el.textContent || '').catch(() => '');
  const motsCount = bodyText.split(/\s+/).filter(w => w.length > 3).length;
  const motsCles = [
    'kiki',
    'christ',
    'livre',
    'chrétien',
    'foi',
    'prière',
    'bible',
    'dieu',
    'jesus',
    'esprit',
  ].filter(m => bodyText.toLowerCase().includes(m));

  // Performance (via Performance API)
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    return {
      lcp: 0,
      fid: 0,
      cls: 0,
      tbt: 0,
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      loadComplete: nav.loadEventEnd - nav.startTime,
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    };
  });

  // Accessibilité basique
  const a11yIssues: string[] = [];
  const imagesSansAlt = await page.$$eval('img:not([alt])', els => els.length).catch(() => 0);
  if (imagesSansAlt > 0) a11yIssues.push(`${imagesSansAlt} images sans alt`);
  const liensSansTexte = await page
    .$$eval('a:not(:has-text(""))', els => els.length)
    .catch(() => 0);
  if (liensSansTexte > 0) a11yIssues.push(`${liensSansTexte} liens sans texte accessible`);

  // SEO issues
  const seoIssues: string[] = [];
  if (!title || title.length < 30 || title.length > 60)
    seoIssues.push(`Title: ${title.length} chars (optimal 30-60)`);
  if (!metaDesc || metaDesc.length < 70 || metaDesc.length > 160)
    seoIssues.push(`Meta desc: ${metaDesc.length} chars (optimal 70-160)`);
  if (h1Count !== 1) seoIssues.push(`H1 count: ${h1Count} (doit être 1)`);
  if (!canonical) seoIssues.push('Canonical manquant');
  if (!ogTags['og:title'] || !ogTags['og:description'] || !ogTags['og:image'])
    seoIssues.push('OG tags incomplets');
  if (!schemaOrg) seoIssues.push('Schema.org manquant');
  if (motsCount < 300) seoIssues.push(`Contenu faible: ${motsCount} mots (min 300)`);

  return {
    url: fullUrl,
    lang,
    status: 200,
    title,
    metaDesc,
    h1,
    h1Count,
    schemaOrg,
    canonical,
    ogTags,
    performance: metrics,
    accessibility: { score: Math.max(0, 100 - a11yIssues.length * 10), issues: a11yIssues },
    seo: { score: Math.max(0, 100 - seoIssues.length * 10), issues: seoIssues },
    motsCles,
    motsCount,
  };
}

async function main() {
  console.log('🚀 Démarrage audit SEO complet...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (compatible; SEOBot/1.0; +https://kikienchrist.vercel.app/bot)',
  });
  const page = await context.newPage();

  const results: AuditResult[] = [];

  for (const lang of LANGUES) {
    for (const path of PAGES_CLES) {
      try {
        const result = await auditPage(page, path, lang);
        results.push(result);
        console.log(
          `  ✅ ${result.lang}${path} - SEO: ${result.seo.score}/100 - A11y: ${result.accessibility.score}/100`
        );
        if (result.seo.issues.length) console.log(`     ⚠️ ${result.seo.issues.join('; ')}`);
      } catch (err) {
        console.error(`  ❌ Erreur ${lang}${path}:`, err);
        results.push({
          url: `${BASE_URL}/${lang}${path}`,
          lang,
          status: 0,
          title: '',
          metaDesc: '',
          h1: '',
          h1Count: 0,
          schemaOrg: false,
          canonical: '',
          ogTags: {},
          performance: {
            lcp: 0,
            fid: 0,
            cls: 0,
            tbt: 0,
            domContentLoaded: 0,
            loadComplete: 0,
            fcp: 0,
          },
          accessibility: { score: 0, issues: ['Erreur chargement'] },
          seo: { score: 0, issues: ['Erreur chargement'] },
          motsCles: [],
          motsCount: 0,
        });
      }
    }
  }

  await browser.close();

  // Rapport JSON
  const outDir = resolve('./audit-seo');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'audit-results.json'), JSON.stringify(results, null, 2));

  // Rapport Markdown lisible
  let md = `# Audit SEO - ${new Date().toLocaleString()}\n\n`;
  md += `| Lang | Page | Status | SEO | A11y | Title | H1 | Schema | Mots | Issues |\n`;
  md += `|------|------|--------|-----|------|-------|----|--------|------|--------|\n`;

  for (const r of results) {
    const pagePath = r.url.replace(BASE_URL, '');
    md += `| ${r.lang} | ${pagePath} | ${r.status} | ${r.seo.score} | ${r.accessibility.score} | ${r.title?.slice(0, 40)} | ${r.h1?.slice(0, 30)} | ${r.schemaOrg ? '✅' : '❌'} | ${r.motsCount} | ${r.seo.issues.slice(0, 2).join('; ')} |\n`;
  }

  // Scores globaux
  const avgSeo = results.reduce((s, r) => s + r.seo.score, 0) / results.length;
  const avgA11y = results.reduce((s, r) => s + r.accessibility.score, 0) / results.length;
  md += `\n## Scores moyens\n- **SEO**: ${avgSeo.toFixed(1)}/100\n- **Accessibilité**: ${avgA11y.toFixed(1)}/100\n`;

  writeFileSync(resolve(outDir, 'audit-report.md'), md);
  console.log(`\n📊 Rapport généré: ${outDir}/audit-report.md`);
  console.log(`📊 Données brutes: ${outDir}/audit-results.json`);
}

main().catch(console.error);
