/**
 * Rapport Markdown pour documentation
 */
import type { AuditReport, PageAuditResult } from '../types.js';

export function generateMarkdownReport(report: AuditReport): string {
  const { summary, pages, timestamp, config } = report;
  const date = new Date(timestamp).toLocaleDateString('fr-FR');
  
  let md = `# 🔍 SEO Audit Report - ${date}\n\n`;
  md += `**Site:** ${config.baseUrl}  \n`;
  md += `**Date:** ${new Date(timestamp).toLocaleString('fr-FR')}  \n`;
  md += `**Pages auditées:** ${summary.auditedPages}/${summary.totalPages}  \n`;
  md += `**Score moyen:** ${summary.averageScore}/100  \n\n`;
  
  // Summary
  md += `## 📊 Résumé\n\n`;
  md += `| Métrique | Valeur |\n|----------|--------|\n`;
  md += `| Score global | ${summary.averageScore}/100 |\n`;
  md += `| Pages OK | ${summary.auditedPages - summary.failedPages} |\n`;
  md += `| Pages en erreur | ${summary.failedPages} |\n`;
  md += `| Pages à corriger | ${summary.pagesNeedingFix} |\n`;
  md += `| Performance (LH) | ${summary.lighthouseAverages.performance} |\n`;
  md += `| Accessibilité (LH) | ${summary.lighthouseAverages.accessibility} |\n`;
  md += `| Bonnes pratiques (LH) | ${summary.lighthouseAverages.bestPractices} |\n`;
  md += `| SEO (LH) | ${summary.lighthouseAverages.seo} |\n\n`;
  
  // Top issues
  md += `## ⚠️ Top Problèmes\n\n`;
  md += `| Problème | Catégorie | Sévérité | Pages |\n|----------|-----------|----------|-------|\n`;
  for (const item of summary.topIssues.slice(0, 15)) {
    md += `| ${item.issue.message} | ${item.issue.category} | ${item.issue.type} | ${item.count} |\n`;
  }
  md += `\n`;
  
  // Pages detail
  md += `## 📋 Détail par Page\n\n`;
  md += `| URL | Lang | Status | Score | Erreurs | Avertissements | Lighthouse | Fixes |\n`;
  md += `|-----|------|--------|-------|---------|----------------|------------|-------|\n`;
  
  for (const page of pages) {
    const errors = page.issues.filter(i => i.type === 'error').length;
    const warnings = page.issues.filter(i => i.type === 'warning').length;
    const infos = page.issues.filter(i => i.type === 'info').length;
    const autoFixes = page.fixes.filter(f => f.autoFixable).length;
    const manualFixes = page.fixes.filter(f => !f.autoFixable).length;
    
    const lh = page.lighthouse 
      ? `P:${page.lighthouse.performance} A:${page.lighthouse.accessibility} BP:${page.lighthouse.bestPractices} S:${page.lighthouse.seo}`
      : 'N/A';
    
    md += `| [${page.path}](${page.url}) | ${page.lang.toUpperCase()} | ${page.statusCode} | ${page.score}/100 | ${errors} | ${warnings} | ${lh} | ${autoFixes} auto / ${manualFixes} manuel |\n`;
  }
  
  md += `\n---\n\n`;
  md += `*Rapport généré automatiquement par @kikienchrist/seo-audit-fix*\n`;
  
  return md;
}

export function generateMarkdownFixes(report: AuditReport): string {
  let md = `# 🛠️ SEO Fixes Plan\n\n`;
  md += `Généré le ${new Date(report.timestamp).toLocaleString('fr-FR')}\n\n`;
  
  const pagesWithFixes = report.pages.filter(p => p.fixes.length > 0);
  
  for (const page of pagesWithFixes) {
    const autoFixes = page.fixes.filter(f => f.autoFixable);
    const manualFixes = page.fixes.filter(f => !f.autoFixable);
    
    if (autoFixes.length === 0 && manualFixes.length === 0) continue;
    
    md += `## ${page.path} (${page.lang.toUpperCase()}) - Score: ${page.score}/100\n\n`;
    md += `URL: ${page.url}\n\n`;
    
    if (autoFixes.length > 0) {
      md += `### ✅ Auto-fixables (${autoFixes.length})\n\n`;
      for (const fix of autoFixes) {
        md += `- **${fix.type.toUpperCase()}** ${fix.category}: ${fix.description}\n`;
        md += `  - Sélecteur: \`${fix.selector}\`\n`;
        md += `  - Actuel: \`${fix.currentValue || '(vide)'}\`\n`;
        md += `  - Nouveau: \`${fix.newValue}\`\n\n`;
      }
    }
    
    if (manualFixes.length > 0) {
      md += `### ⚠️ Manuels (${manualFixes.length})\n\n`;
      for (const fix of manualFixes) {
        md += `- **${fix.type.toUpperCase()}** ${fix.category}: ${fix.description}\n`;
        md += `  - Sélecteur: \`${fix.selector}\`\n`;
        md += `  - Actuel: \`${fix.currentValue || '(vide)'}\`\n`;
        md += `  - Nouveau: \`${fix.newValue}\`\n\n`;
      }
    }
  }
  
  return md;
}