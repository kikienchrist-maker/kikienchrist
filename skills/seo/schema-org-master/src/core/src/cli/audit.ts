// cli/audit.ts — Audit Command (schema-org-master)
// Audit complet site déployé + génère rapport

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateForGoogle, ValidationReporter } from '../validator';
import { parseJsonLd, extractJsonLdFromHtml } from '../context';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuditConfig {
  baseUrl: string;
  paths: string[];
  langCodes: string[];
  outputDir: string;
  format: 'console' | 'json' | 'html';
  google: boolean;
  concurrency: number;
}

interface AuditResult {
  url: string;
  lang: string;
  path: string;
  validation: ReturnType<typeof validateForGoogle>;
  pageType: string;
  timestamp: string;
}

export const auditCommand = new Command('audit')
  .description('Audit deployed site for Schema.org + Google Rich Results compliance')
  .requiredOption('-u, --base-url <url>', 'Base URL of deployed site (e.g., https://kikienchrist.vercel.app)')
  .option('-p, --paths <paths...>', 'Paths to audit (relative, e.g., / /fr/ /fr/blog /fr/livres)', ['/', '/fr/', '/en/', '/es/', '/fr/livres', '/fr/blog', '/fr/mentions-legales', '/fr/confidentialite', '/fr/cookies', '/fr/cgv', '/fr/accessibilite'])
  .option('-l, --langs <codes...>', 'Language codes to audit', ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'])
  .option('-o, --output-dir <dir>', 'Output directory for reports', './audit-results')
  .option('--format <type>', 'Report format', 'html')
  .option('--google', 'Validate for Google Rich Results', true)
  .option('--concurrency <n>', 'Parallel requests', '5')
  .option('--sitemap', 'Auto-discover paths from sitemap.xml', false)
  .action(async (options) => {
    try {
      const config: AuditConfig = {
        baseUrl: options.baseUrl.replace(/\/$/, ''),
        paths: options.paths,
        langCodes: options.langs,
        outputDir: options.outputDir,
        format: options.format,
        google: options.google,
        concurrency: parseInt(options.concurrency, 10),
      };

      // Auto-discover depuis sitemap si demandé
      if (options.sitemap) {
        console.log(chalk.blue('🗺️  Fetching sitemap...'));
        const sitemapPaths = await fetchSitemapPaths(config.baseUrl);
        config.paths = [...new Set([...config.paths, ...sitemapPaths])];
        console.log(chalk.gray(`Discovered ${sitemapPaths.length} additional paths`));
      }

      console.log(chalk.blue(`🔍 Starting audit of ${config.baseUrl}`));
      console.log(chalk.gray(`Paths: ${config.paths.length} | Langs: ${config.langCodes.length} | Concurrency: ${config.concurrency}`));

      // Construire URLs à auditer
      const urlsToAudit = buildAuditUrls(config);
      console.log(chalk.gray(`Total URLs: ${urlsToAudit.length}`));

      // Audit parallèle
      const results = await auditUrls(urlsToAudit, config);

      // Générer rapports
      await generateReports(results, config);

      // Résumé
      printSummary(results);
    } catch (error) {
      console.error(chalk.red('❌ Audit failed:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// BUILD AUDIT URLs
// ============================================================================

function buildAuditUrls(config: AuditConfig): Array<{ url: string; lang: string; path: string }> {
  const urls: Array<{ url: string; lang: string; path: string }> = [];

  for (const lang of config.langCodes) {
    for (const path of config.paths) {
      // Construire URL: baseUrl/lang/path
      // Si path commence par /, c'est absolu; sinon relatif à la langue
      let fullPath = path;
      if (!path.startsWith('/')) {
        fullPath = '/' + path;
      }
      // Ne pas doubler le /lang si path commence déjà par /lang/
      if (!fullPath.starts(`/${lang}/`) && fullPath !== '/') {
        fullPath = `/${lang}${fullPath}`;
      }
      const url = `${config.baseUrl}${fullPath}`;
      urls.push({ url, lang, path: fullPath });
    }
  }

  return urls;
}

// ============================================================================
// FETCH SITEMAP
// ============================================================================

async function fetchSitemapPaths(baseUrl: string): Promise<string[]> {
  try {
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    if (!response.ok) return [];

    const xml = await response.text();
    const paths: string[] = [];

    // Parser XML pour extraire <loc>
    const locRegex = /<loc>([\s\S]*?)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
      try {
        const url = new URL(match[1]);
        paths.push(url.pathname);
      } catch {}
    }

    return [...new Set(paths)];
  } catch {
    return [];
  }
}

// ============================================================================
// AUDIT URLS
// ============================================================================

async function auditUrls(
  urls: Array<{ url: string; lang: string; path: string }>,
  config: AuditConfig
): Promise<AuditResult[]> {
  const results: AuditResult[] = [];
  const queue = [...urls];
  const workers = Math.min(config.concurrency, queue.length);
  const active = new Set<Promise<void>>();

  const processQueue = async () => {
    while (queue.length > 0) {
      const item = queue.shift()!;
      try {
        const validation = await auditSingleUrl(item.url, config.google);
        const pageType = detectPageType(item.path);
        results.push({
          url: item.url,
          lang: item.lang,
          path: item.path,
          validation,
          pageType,
          timestamp: new Date().toISOString(),
        });
        // Progress
        const done = results.length;
        const total = urls.length;
        const pct = Math.round((done / total) * 100);
        process.stdout.write(`\r${chalk.cyan(`[${done}/${total} ${pct}%]`)} ${item.url.padEnd(80)}`);
      } catch (error) {
        results.push({
          url: item.url,
          lang: item.lang,
          path: item.path,
          validation: {
            valid: false,
            errors: [{ path: 'fetch', message: String(error), code: 'FETCH_ERROR', severity: 'error' }],
            warnings: [], suggestions: [], schemaType: 'unknown', timestamp: new Date().toISOString(),
            richResultsEligible: false, missingRequiredFields: [], missingRecommendedFields: [],
          },
          pageType: 'error',
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  // Lancer workers
  for (let i = 0; i < workers; i++) {
    active.add(processQueue());
  }

  await Promise.all(active);
  console.log(); // newline après progress

  return results;
}

async function auditSingleUrl(url: string, google: boolean): Promise<ReturnType<typeof validateForGoogle>> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'schema-org-master/0.1.0 (+https://kikienchrist.vercel.app)' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const html = await response.text();
  const schemas = extractJsonLdFromHtml(html);

  if (schemas.length === 0) {
    return {
      valid: false,
      errors: [{ path: 'json-ld', message: 'No JSON-LD found on page', code: 'NO_JSON_LD', severity: 'error' }],
      warnings: [], suggestions: [], schemaType: 'none', timestamp: new Date().toISOString(),
      richResultsEligible: false, missingRequiredFields: [], missingRecommendedFields: [],
    };
  }

  // Valider le premier schema principal (souvent @graph)
  const mainSchema = schemas[0];
  return google ? validateForGoogle(mainSchema) : validate(mainSchema);
}

function detectPageType(path: string): string {
  if (path === '/' || path.match(/^\/[a-z]{2}\/?$/)) return 'home';
  if (path.includes('/livres/') || path.includes('/books/')) return 'book';
  if (path.includes('/blog/') && !path.includes('/categorie/')) return 'article';
  if (path.includes('/categorie/') || path.includes('/category/')) return 'category';
  if (path.includes('/mentions-legales') || path.includes('/legal') || path.includes('/confidentialite') || path.includes('/privacy') || path.includes('/cookies') || path.includes('/cgv') || path.includes('/accessibilite')) return 'legal';
  if (path.includes('/recherche') || path.includes('/search')) return 'search';
  return 'other';
}

// ============================================================================
// GENERATE REPORTS
// ============================================================================

async function generateReports(results: AuditResult[], config: AuditConfig): Promise<void> {
  await fs.mkdir(config.outputDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // JSON report
  const jsonReport = {
    meta: {
      baseUrl: config.baseUrl,
      totalUrls: results.length,
      timestamp,
      passed: results.filter(r => r.validation.valid).length,
      failed: results.filter(r => !r.validation.valid).length,
      richResultsEligible: results.filter(r => r.validation.richResultsEligible).length,
    },
    results,
  };

  await fs.writeFile(
    path.join(config.outputDir, `audit-${timestamp}.json`),
    JSON.stringify(jsonReport, null, 2)
  );

  // HTML report
  if (config.format === 'html' || config.format === 'console') {
    const htmlReport = generateHtmlReport(results, config, timestamp);
    await fs.writeFile(
      path.join(config.outputDir, `audit-${timestamp}.html`),
      htmlReport
    );
    console.log(chalk.green(`\n📊 HTML report: ${config.outputDir}/audit-${timestamp}.html`));
  }

  // Console summary toujours affiché
  console.log(chalk.green(`\n📄 JSON report: ${config.outputDir}/audit-${timestamp}.json`));
}

function generateHtmlReport(results: AuditResult[], config: AuditConfig, timestamp: string): string {
  const passed = results.filter(r => r.validation.valid).length;
  const failed = results.filter(r => !r.validation.valid).length;
  const eligible = results.filter(r => r.validation.richResultsEligible).length;

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Schema.org Audit Report — ${config.baseUrl}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; max-width: 1400px; margin: 0 auto; padding: 1rem; background: #f9fafb; }
    header { background: #1f2937; color: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; }
    h1 { margin: 0; font-size: 1.5rem; }
    .meta { opacity: 0.8; font-size: 0.875rem; margin-top: 0.5rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .stat { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
    .stat-value { font-size: 2rem; font-weight: 700; }
    .stat.passed .stat-value { color: #10b981; }
    .stat.failed .stat-value { color: #ef4444; }
    .stat.eligible .stat-value { color: #3b82f6; }
    .stat-label { color: #6b7280; font-size: 0.875rem; }
    .filters { background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer; }
    .filter-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; color: #374151; position: sticky; top: 0; }
    tr:hover { background: #f9fafb; }
    .status { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .status.valid { background: #ecfdf5; color: #10b981; }
    .status.invalid { background: #fef2f2; color: #ef4444; }
    .status.eligible { background: #eff6ff; color: #3b82f6; }
    .url { font-family: monospace; font-size: 0.875rem; color: #3b82f6; text-decoration: none; }
    .url:hover { text-decoration: underline; }
    .errors { font-size: 0.75rem; color: #ef4444; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .page-type { text-transform: capitalize; color: #6b7280; font-size: 0.875rem; }
    .lang-badge { display: inline-block; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; background: #e5e7eb; }
    details { cursor: pointer; }
    summary { font-weight: 500; }
    .detail-content { padding: 0.5rem 0; font-size: 0.75rem; color: #4b5563; }
    .error-item { color: #ef4444; margin: 0.25rem 0; font-family: monospace; }
    .warning-item { color: #f59e0b; margin: 0.25rem 0; font-family: monospace; }
  </style>
</head>
<body>
  <header>
    <h1>Schema.org Audit Report</h1>
    <div class="meta">${config.baseUrl} — ${new Date(timestamp.replace(/-/g, ':')).toLocaleString()} — ${results.length} URLs auditées</div>
  </header>

  <div class="stats">
    <div class="stat passed"><div class="stat-value">${passed}</div><div class="stat-label">Valid</div></div>
    <div class="stat failed"><div class="stat-value">${failed}</div><div class="stat-label">Invalid</div></div>
    <div class="stat eligible"><div class="stat-value">${eligible}</div><div class="stat-label">Rich Results Eligible</div></div>
  </div>

  <div class="filters">
    <button class="filter-btn active" data-filter="all">All (${results.length})</button>
    <button class="filter-btn" data-filter="valid">Valid (${passed})</button>
    <button class="filter-btn" data-filter="invalid">Invalid (${failed})</button>
    <button class="filter-btn" data-filter="eligible">Rich Results (${eligible})</button>
  </div>

  <table id="results-table">
    <thead>
      <tr>
        <th>URL</th>
        <th>Lang</th>
        <th>Type</th>
        <th>Schema</th>
        <th>Status</th>
        <th>Rich Results</th>
        <th>Errors</th>
      </tr>
    </thead>
    <tbody>`;

  for (const result of results) {
    const v = result.validation;
    const schemaType = v.schemaType || 'unknown';
    const richEligible = v.richResultsEligible ? '✅' : '❌';
    const errorCount = v.errors.length;
    const warningCount = v.warnings.length;

    html += `
      <tr data-status="${v.valid ? 'valid' : 'invalid'}" data-eligible="${v.richResultsEligible ? 'eligible' : ''}">
        <td><a href="${result.url}" target="_blank" class="url">${result.path}</a></td>
        <td><span class="lang-badge">${result.lang}</span></td>
        <td class="page-type">${result.pageType}</td>
        <td>${schemaType}</td>
        <td><span class="status ${v.valid ? 'valid' : 'invalid'}">${v.valid ? 'Valid' : 'Invalid'}</span></td>
        <td><span class="status ${v.richResultsEligible ? 'eligible' : ''}">${richEligible}</span></td>
        <td class="errors">${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warningCount} warning${warningCount !== 1 ? 's' : ''}</td>
      </tr>
      <tr class="detail-row" style="display: none;">
        <td colspan="7">
          <div class="detail-content">
            <details open>
              <summary>Validation Details</summary>
              ${v.errors.length > 0 ? `
                <strong>Errors (${v.errors.length}):</strong>
                ${v.errors.map(e => `<div class="error-item">${e.path}: ${e.message} [${e.code}]</div>`).join('')}
              ` : '<em>No errors</em>'}
              ${v.warnings.length > 0 ? `
                <strong>Warnings (${v.warnings.length}):</strong>
                ${v.warnings.map(w => `<div class="warning-item">${w.path}: ${w.message} [${w.code}]</div>`).join('')}
              ` : ''}
              ${'missingRequiredFields' in v && (v as any).missingRequiredFields.length > 0 ? `
                <strong>Missing Required for Google:</strong>
                ${(v as any).missingRequiredFields.map((f: string) => `<div class="error-item">${f}</div>`).join('')}
              ` : ''}
              ${'missingRecommendedFields' in v && (v as any).missingRecommendedFields.length > 0 ? `
                <strong>Missing Recommended for Google:</strong>
                ${(v as any).missingRecommendedFields.map((f: string) => `<div class="warning-item">${f}</div>`).join('')}
              ` : ''}
            </details>
          </div>
        </td>
      </tr>`;
  }

  html += `
    </tbody>
  </table>

  <script>
    // Filtres
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('#results-table tbody tr').forEach((row, i) => {
          if (i % 2 === 0) { // ligne principale
            const status = row.dataset.status;
            const eligible = row.dataset.eligible;
            let show = true;
            if (filter === 'valid') show = status === 'valid';
            else if (filter === 'invalid') show = status === 'invalid';
            else if (filter === 'eligible') show = eligible === 'eligible';
            row.style.display = show ? '' : 'none';
            // Ligne détail
            const detailRow = row.nextElementSibling;
            if (detailRow) detailRow.style.display = show ? '' : 'none';
          }
        });
      });
    });

    // Toggle détails
    document.querySelectorAll('#results-table tbody tr:first-child td').forEach((_, i) => {
      // Géré par details/summary natif
    });
  </script>
</body>
</html>`;

  return html;
}

function printSummary(results: AuditResult[]): void {
  const passed = results.filter(r => r.validation.valid).length;
  const failed = results.filter(r => !r.validation.valid).length;
  const eligible = results.filter(r => r.validation.richResultsEligible).length;

  console.log(chalk.bold('\n📊 AUDIT SUMMARY'));
  console.log(chalk.green(`  ✅ Valid: ${passed}/${results.length}`));
  console.log(chalk.red(`  ❌ Invalid: ${failed}/${results.length}`));
  console.log(chalk.blue(`  🎯 Google Rich Results Eligible: ${eligible}/${results.length}`));

  // Par type de page
  const byType = new Map<string, { total: number; valid: number; eligible: number }>();
  for (const r of results) {
    const t = r.pageType;
    const cur = byType.get(t) || { total: 0, valid: 0, eligible: 0 };
    cur.total++;
    if (r.validation.valid) cur.valid++;
    if (r.validation.richResultsEligible) cur.eligible++;
    byType.set(t, cur);
  }

  console.log(chalk.bold('\nBy Page Type:'));
  for (const [type, stats] of byType) {
    const pct = Math.round((stats.valid / stats.total) * 100);
    console.log(`  ${type}: ${stats.valid}/${stats.total} (${pct}%) valid, ${stats.eligible} eligible`);
  }
}