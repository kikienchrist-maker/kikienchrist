/**
 * Rapport JSON pour CI/CD
 */
import type { AuditReport } from '../types.js';

export function generateJsonReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}

export function generateJsonSummary(report: AuditReport): string {
  const summary = {
    timestamp: report.timestamp,
    baseUrl: report.config.baseUrl,
    totalPages: report.summary.totalPages,
    auditedPages: report.summary.auditedPages,
    failedPages: report.summary.failedPages,
    averageScore: report.summary.averageScore,
    pagesNeedingFix: report.summary.pagesNeedingFix,
    lighthouseAverages: report.summary.lighthouseAverages,
    issuesByCategory: report.summary.issuesByCategory,
    issuesBySeverity: report.summary.issuesBySeverity,
    topIssues: report.summary.topIssues.slice(0, 20).map(item => ({
      message: item.issue.message,
      category: item.issue.category,
      severity: item.issue.type,
      count: item.count,
    })),
    failedUrls: report.pages
      .filter(p => p.statusCode >= 400 || p.score < 50)
      .map(p => ({ url: p.url, status: p.statusCode, score: p.score })),
  };
  
  return JSON.stringify(summary, null, 2);
}