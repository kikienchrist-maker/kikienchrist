/**
 * Pipeline principal SEO Audit & Fix
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import pLimit from 'p-limit';
import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import type {
  SEOConfig,
  PageAuditResult,
  AuditReport,
  AuditSummary,
  SEOIssue,
  SEOFix,
  LangCode,
  FixResult,
} from './types.js';
import { DEFAULT_CONFIG } from './config.js';
import {
  auditMeta,
  auditSchema,
  auditHreflang,
  auditContent,
  auditLighthouseForPage,
} from './auditors/index.js';
import {
  generateMetaFixes,
  generateHreflangFixes,
  generateSchemaFixes,
  generateContentFixes,
} from './fixers/index.js';
import {
  generateHtmlReport,
  generateJsonReport,
  generateJsonSummary,
  generateMarkdownReport,
  generateMarkdownFixes,
} from './reporters/index.js';
import {
  fetchPageHtml,
  parseHtml,
  extractLangFromUrl,
  normalizeUrl,
  isInternalUrl,
  getPageType,
  sleep,
  chunkArray,
} from './utils.js';

export class SEOPipeline {
  private config: SEOConfig;
  private visitedUrls: Set<string> = new Set();
  private pageResults: PageAuditResult[] = [];
  private sitemapUrls: string[] = [];

  constructor(config: Partial<SEOConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async run(options: {
    urls?: string[];
    runLighthouse?: boolean;
    lighthousePreset?: 'desktop' | 'mobile';
    outputDir?: string;
    generateReports?: boolean;
  } = {}): Promise<AuditReport> {
    const {
      urls,
      runLighthouse = false,
      lighthousePreset = 'mobile',
      outputDir = './seo-audit-report',
      generateReports = true,
    } = options;

    const spinner = ora('Démarrage SEO Audit...').start();
    
    // 1. Découvrir URLs (sitemap + crawl)
    await this.discoverUrls(urls);
    spinner.succeed(`${this.sitemapUrls.length} URLs découvertes`);

    // 2. Auditer chaque page
    await this.auditPages(runLighthouse, lighthousePreset);
    
    // 3. Générer résumé
    const summary = this.generateSummary();
    
    // 4. Rapports
    if (generateReports) {
      await this.generateReports(outputDir, summary);
    }

    const report: AuditReport = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary,
      pages: this.pageResults,
    };

    return report;
  }

  private async discoverUrls(providedUrls?: string[]): Promise<void> {
    if (providedUrls && providedUrls.length > 0) {
      this.sitemapUrls = providedUrls;
      return;
    }

    // Essayer sitemap.xml
    try {
      const sitemapUrl = `${this.config.baseUrl}/sitemap.xml`;
      const response = await axios.get(sitemapUrl, { timeout: this.config.requestTimeoutMs });
      const urls = this.parseSitemap(response.data);
      this.sitemapUrls = urls.filter(u => this.shouldAuditUrl(u));
      return;
    } catch {
      // Fallback: crawl depuis homepage
    }

    // Crawl basique depuis homepage
    await this.crawlFromHomepage();
  }

  private parseSitemap(xml: string): string[] {
    const urls: string[] = [];
    const locMatches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (locMatches) {
      for (const match of locMatches) {
        const url = match.replace(/<\/?loc>/g, '').trim();
        urls.push(url);
      }
    }
    return urls;
  }

  private shouldAuditUrl(url: string): boolean {
    try {
      const parsed = new URL(url, this.config.baseUrl);
      // Exclure patterns
      for (const pattern of this.config.excludePatterns) {
        if (parsed.pathname.includes(pattern)) return false;
      }
      // Seulement URLs du même domaine
      const baseParsed = new URL(this.config.baseUrl);
      return parsed.hostname === baseParsed.hostname;
    } catch {
      return false;
    }
  }

  private async crawlFromHomepage(): Promise<void> {
    const queue = [this.config.baseUrl];
    const maxPages = 300;
    
    while (queue.length > 0 && this.sitemapUrls.length < maxPages) {
      const url = queue.shift()!;
      if (this.visitedUrls.has(url)) continue;
      this.visitedUrls.add(url);
      
      if (!this.shouldAuditUrl(url)) continue;
      
      const { html, statusCode } = await fetchPageHtml(url, this.config);
      if (statusCode !== 200 || !html) continue;
      
      this.sitemapUrls.push(url);
      
      // Extraire liens internes
      const dom = parseHtml(html);
      const links = this.extractInternalLinks(dom, url);
      for (const link of links) {
        if (!this.visitedUrls.has(link) && this.shouldAuditUrl(link)) {
          queue.push(link);
        }
      }
      
      await sleep(100); // Politesse
    }
  }

  private extractInternalLinks(dom: JSDOM, baseUrl: string): string[] {
    const links = dom.window.document.querySelectorAll('a[href]');
    const urls: string[] = [];
    
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      try {
        const absolute = new URL(href, baseUrl).toString();
        if (isInternalUrl(absolute, this.config.baseUrl) && this.shouldAuditUrl(absolute)) {
          urls.push(absolute);
        }
      } catch {
        // Ignorer URLs invalides
      }
    }
    
    return urls;
  }

  private async auditPages(runLighthouse: boolean, lighthousePreset: 'desktop' | 'mobile'): Promise<void> {
    const spinner = ora(`Audit de ${this.sitemapUrls.length} pages...`).start();
    const limit = pLimit(this.config.maxConcurrency);
    let completed = 0;

    const chunks = chunkArray(this.sitemapUrls, this.config.maxConcurrency * 2);
    
    for (const chunk of chunks) {
      const promises = chunk.map(url => limit(() => this.auditSinglePage(url, runLighthouse, lighthousePreset)));
      await Promise.all(promises);
      completed += chunk.length;
      spinner.text = `Audit en cours (${completed}/${this.sitemapUrls.length})...`;
    }

    spinner.succeed(`${this.pageResults.length} pages auditées`);
  }

  private async auditSinglePage(
    url: string, 
    runLighthouse: boolean, 
    lighthousePreset: 'desktop' | 'mobile'
  ): Promise<void> {
    const { html, statusCode, loadTimeMs } = await fetchPageHtml(url, this.config);
    
    if (statusCode !== 200 || !html) {
      this.pageResults.push(this.createFailedResult(url, statusCode, loadTimeMs));
      return;
    }

    const dom = parseHtml(html);
    const lang = extractLangFromUrl(url, this.config.supportedLangs) || this.config.defaultLang;
    
    const result: PageAuditResult = {
      url,
      lang,
      path: new URL(url).pathname,
      statusCode,
      loadTimeMs,
      meta: { title: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              description: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              canonical: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogTitle: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogDescription: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogImage: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogType: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogUrl: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterCard: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterTitle: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterDescription: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterImage: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              robots: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              viewport: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              charset: { present: false, value: null, expected: null, valid: false, issues: [] } as any },
      schema: { present: false, types: [], valid: false, errors: [], warnings: [], jsonLd: [] },
      hreflang: { present: false, tags: [], bidirectional: false, hasXDefault: false, missingLangs: [], issues: [] },
      content: { h1Count: 0, h1Text: null, h1Unique: false, imagesTotal: 0, imagesWithAlt: 0, imagesMissingAlt: [], linksTotal: 0, linksBroken: [], readingTimePresent: false, readingTimeValue: null, wordCount: 0, structure: [] },
      score: 0,
      issues: [],
      fixes: [],
    };

    // Audits
    result.meta = auditMeta(dom, url, lang, result);
    result.schema = auditSchema(dom, url, result);
    result.hreflang = auditHreflang(dom, url, lang, result);
    result.content = await auditContent(dom, url, lang, this.config.baseUrl, result);
    
    // Lighthouse (optionnel, plus lent)
    if (runLighthouse) {
      result.lighthouse = await auditLighthouseForPage(url, this.config.lighthouseThresholds, result);
    }

    // Calculer score
    result.score = this.calculatePageScore(result);
    
    // Générer fixes
    result.fixes = [
      ...generateMetaFixes(result),
      ...generateHreflangFixes(result),
      ...generateSchemaFixes(result),
      ...generateContentFixes(result),
    ];

    this.pageResults.push(result);
  }

  private createFailedResult(url: string, statusCode: number, loadTimeMs: number): PageAuditResult {
    return {
      url,
      lang: this.config.defaultLang,
      path: new URL(url).pathname,
      statusCode,
      loadTimeMs,
      meta: { title: { present: false, value: null, expected: null, valid: false, issues: ['Page inaccessible'] } as any,
              description: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              canonical: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogTitle: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogDescription: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogImage: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogType: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              ogUrl: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterCard: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterTitle: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterDescription: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              twitterImage: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              robots: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              viewport: { present: false, value: null, expected: null, valid: false, issues: [] } as any,
              charset: { present: false, value: null, expected: null, valid: false, issues: [] } as any },
      schema: { present: false, types: [], valid: false, errors: ['Page inaccessible'], warnings: [], jsonLd: [] },
      hreflang: { present: false, tags: [], bidirectional: false, hasXDefault: false, missingLangs: [], issues: [] },
      content: { h1Count: 0, h1Text: null, h1Unique: false, imagesTotal: 0, imagesWithAlt: 0, imagesMissingAlt: [], linksTotal: 0, linksBroken: [], readingTimePresent: false, readingTimeValue: null, wordCount: 0, structure: [] },
      score: 0,
      issues: [{ type: 'error', category: 'technical', message: `Page inaccessible (HTTP ${statusCode})` }],
      fixes: [],
    };
  }

  private calculatePageScore(result: PageAuditResult): number {
    const checks = [
      { valid: result.meta.title.valid, weight: 10 },
      { valid: result.meta.description.valid, weight: 10 },
      { valid: result.meta.canonical.valid, weight: 8 },
      { valid: result.meta.ogTitle.valid, weight: 5 },
      { valid: result.meta.ogDescription.valid, weight: 5 },
      { valid: result.meta.ogImage.valid, weight: 5 },
      { valid: result.meta.ogType.valid, weight: 3 },
      { valid: result.meta.ogUrl.valid, weight: 3 },
      { valid: result.meta.viewport.valid, weight: 3 },
      { valid: result.meta.charset.valid, weight: 2 },
      { valid: result.schema.valid, weight: 10 },
      { valid: result.hreflang.present && result.hreflang.bidirectional && result.hreflang.hasXDefault, weight: 10 },
      { valid: result.content.h1Unique && result.content.h1Count === 1, weight: 8 },
      { valid: result.content.imagesMissingAlt.length === 0, weight: 5 },
      { valid: result.content.linksBroken.length === 0, weight: 5 },
      { valid: result.content.readingTimePresent, weight: 3 },
      { valid: result.content.wordCount >= 300, weight: 3 },
    ];

    if (result.lighthouse) {
      checks.push(
        { valid: result.lighthouse.performance >= this.config.lighthouseThresholds.performance, weight: 5 },
        { valid: result.lighthouse.accessibility >= this.config.lighthouseThresholds.accessibility, weight: 5 },
        { valid: result.lighthouse.bestPractices >= this.config.lighthouseThresholds.bestPractices, weight: 3 },
        { valid: result.lighthouse.seo >= this.config.lighthouseThresholds.seo, weight: 5 },
      );
    }

    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const earnedWeight = checks.filter(c => c.valid).reduce((sum, c) => sum + c.weight, 0);
    
    return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  }

  private generateSummary(): AuditSummary {
    const auditedPages = this.pageResults.length;
    const failedPages = this.pageResults.filter(p => p.statusCode >= 400 || p.score === 0).length;
    const averageScore = auditedPages > 0 
      ? Math.round(this.pageResults.reduce((sum, p) => sum + p.score, 0) / auditedPages)
      : 0;
    
    const pagesNeedingFix = this.pageResults.filter(p => p.fixes.some(f => f.autoFixable)).length;

    // Distribution scores
    const scoreDistribution: Record<string, number> = {
      '90-100': 0, '80-89': 0, '70-79': 0, '60-69': 0, '50-59': 0, '0-49': 0,
    };
    for (const page of this.pageResults) {
      if (page.score >= 90) scoreDistribution['90-100'] = (scoreDistribution['90-100'] || 0) + 1;
      else if (page.score >= 80) scoreDistribution['80-89'] = (scoreDistribution['80-89'] || 0) + 1;
      else if (page.score >= 70) scoreDistribution['70-79'] = (scoreDistribution['70-79'] || 0) + 1;
      else if (page.score >= 60) scoreDistribution['60-69'] = (scoreDistribution['60-69'] || 0) + 1;
      else if (page.score >= 50) scoreDistribution['50-59'] = (scoreDistribution['50-59'] || 0) + 1;
      else scoreDistribution['0-49'] = (scoreDistribution['0-49'] || 0) + 1;
    }

    // Helper: extract all issues from a page's audit results
    function extractPageIssues(page: PageAuditResult): SEOIssue[] {
      const issues: SEOIssue[] = [];
      
      // Meta issues
      const metaFields = [
        'title', 'description', 'canonical', 'ogTitle', 'ogDescription', 'ogImage',
        'ogType', 'ogUrl', 'twitterCard', 'twitterTitle', 'twitterDescription',
        'twitterImage', 'robots', 'viewport', 'charset'
      ] as const;
      
      for (const field of metaFields) {
        const fieldAudit = page.meta[field];
        if (fieldAudit && fieldAudit.issues && fieldAudit.issues.length > 0) {
          for (const msg of fieldAudit.issues) {
            const isError = msg.includes('manquant') || msg.includes('invalide') || msg.includes('trop court') || msg.includes('trop long');
            issues.push({
              type: isError ? 'error' : 'warning',
              category: 'meta',
              message: `${field}: ${msg}`,
              selector: getMetaSelector(field),
              currentValue: fieldAudit.value || undefined,
              expectedValue: fieldAudit.expected || undefined,
            });
          }
        }
      }
      
      // Schema issues
      for (const err of page.schema.errors) {
        issues.push({ type: 'error', category: 'schema', message: err });
      }
      for (const warn of page.schema.warnings) {
        issues.push({ type: 'warning', category: 'schema', message: warn });
      }
      
      // Hreflang issues
      for (const msg of page.hreflang.issues) {
        issues.push({ type: 'error', category: 'hreflang', message: msg });
      }
      
      // Content issues
      for (const struct of page.content.structure) {
        issues.push({ type: 'warning', category: 'content', message: struct.message, selector: struct.selector });
      }
      if (page.content.h1Count === 0) {
        issues.push({ type: 'error', category: 'content', message: 'H1 manquant' });
      } else if (page.content.h1Count > 1) {
        issues.push({ type: 'error', category: 'content', message: `H1 multiples (${page.content.h1Count})` });
      }
      for (const img of page.content.imagesMissingAlt) {
        issues.push({ type: 'warning', category: 'content', message: `Image sans alt: ${img}`, selector: `img[src="${img}"]` });
      }
      for (const link of page.content.linksBroken) {
        issues.push({ type: 'error', category: 'content', message: `Lien cassé: ${link.url} (${link.error})`, selector: `a[href="${link.url}"]` });
      }
      if (!page.content.readingTimePresent && page.content.wordCount > 0) {
        issues.push({ type: 'info', category: 'content', message: 'Temps de lecture manquant' });
      }
      
      return issues;
    }
    
    function getMetaSelector(field: string): string {
      const selectors: Record<string, string> = {
        title: 'title',
        description: 'meta[name="description"]',
        canonical: 'link[rel="canonical"]',
        ogTitle: 'meta[property="og:title"]',
        ogDescription: 'meta[property="og:description"]',
        ogImage: 'meta[property="og:image"]',
        ogType: 'meta[property="og:type"]',
        ogUrl: 'meta[property="og:url"]',
        twitterCard: 'meta[name="twitter:card"]',
        twitterTitle: 'meta[name="twitter:title"]',
        twitterDescription: 'meta[name="twitter:description"]',
        twitterImage: 'meta[name="twitter:image"]',
        robots: 'meta[name="robots"]',
        viewport: 'meta[name="viewport"]',
        charset: 'meta[charset]',
      };
      return selectors[field] || field;
    }

    // Issues by category/severity
    const issuesByCategory: Record<string, number> = {};
    const issuesBySeverity: Record<string, number> = {};
    const issueCounts: Map<string, { issue: SEOIssue; count: number }> = new Map();
    
    for (const page of this.pageResults) {
      const pageIssues = extractPageIssues(page);
      for (const issue of pageIssues) {
        issuesByCategory[issue.category] = (issuesByCategory[issue.category] || 0) + 1;
        issuesBySeverity[issue.type] = (issuesBySeverity[issue.type] || 0) + 1;
        
        const key = `${issue.category}:${issue.message}`;
        const existing = issueCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          issueCounts.set(key, { issue, count: 1 });
        }
      }
    }

    const topIssues = Array.from(issueCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Lighthouse averages
    const lhPages = this.pageResults.filter(p => p.lighthouse);
    const lighthouseAverages = {
      performance: lhPages.length > 0 ? Math.round(lhPages.reduce((s, p) => s + (p.lighthouse?.performance || 0), 0) / lhPages.length) : 0,
      accessibility: lhPages.length > 0 ? Math.round(lhPages.reduce((s, p) => s + (p.lighthouse?.accessibility || 0), 0) / lhPages.length) : 0,
      bestPractices: lhPages.length > 0 ? Math.round(lhPages.reduce((s, p) => s + (p.lighthouse?.bestPractices || 0), 0) / lhPages.length) : 0,
      seo: lhPages.length > 0 ? Math.round(lhPages.reduce((s, p) => s + (p.lighthouse?.seo || 0), 0) / lhPages.length) : 0,
    };

    return {
      totalPages: this.sitemapUrls.length,
      auditedPages,
      failedPages,
      averageScore,
      scoreDistribution,
      issuesByCategory,
      issuesBySeverity,
      topIssues,
      lighthouseAverages,
      pagesNeedingFix,
    };
  }

  private async generateReports(outputDir: string, summary: AuditSummary): Promise<void> {
    const spinner = ora('Génération des rapports...').start();
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const report: AuditReport = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary,
      pages: this.pageResults,
    };

    // HTML Report
    const htmlReport = generateHtmlReport(report);
    writeFileSync(join(outputDir, 'report.html'), htmlReport);

    // JSON Report
    const jsonReport = generateJsonReport(report);
    writeFileSync(join(outputDir, 'report.json'), jsonReport);

    // JSON Summary (pour CI)
    const jsonSummary = generateJsonSummary(report);
    writeFileSync(join(outputDir, 'summary.json'), jsonSummary);

    // Markdown Report
    const mdReport = generateMarkdownReport(report);
    writeFileSync(join(outputDir, 'report.md'), mdReport);

    // Markdown Fixes Plan
    const mdFixes = generateMarkdownFixes(report);
    writeFileSync(join(outputDir, 'fixes-plan.md'), mdFixes);

    spinner.succeed(`Rapports générés dans ${outputDir}/`);
  }
}

// Fonction utilitaire pour usage direct
export async function runSEOAudit(options: {
  baseUrl?: string;
  urls?: string[];
  runLighthouse?: boolean;
  outputDir?: string;
  thresholds?: SEOConfig['lighthouseThresholds'];
} = {}): Promise<AuditReport> {
  const config: Partial<SEOConfig> = {
    baseUrl: options.baseUrl || 'https://kikienchrist.vercel.app',
    lighthouseThresholds: options.thresholds || DEFAULT_CONFIG.lighthouseThresholds,
  };

  const pipeline = new SEOPipeline(config);
  return pipeline.run({
    urls: options.urls,
    runLighthouse: options.runLighthouse || false,
    outputDir: options.outputDir || './seo-audit-report',
  });
}