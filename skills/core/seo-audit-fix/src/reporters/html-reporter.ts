/**
 * Rapport HTML interactif
 */
import type { AuditReport, PageAuditResult, SEOIssue, SEOFix } from '../types.js';

export function generateHtmlReport(report: AuditReport): string {
  const { summary, pages, timestamp, config } = report;
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SEO Audit Report - ${new Date(timestamp).toLocaleDateString('fr-FR')}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; color: #333; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { background: #1a1a2e; color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    h1 { margin: 0 0 10px; font-size: 28px; }
    .meta { opacity: 0.8; font-size: 14px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .card h3 { margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; }
    .card .value { font-size: 36px; font-weight: bold; }
    .card .value.good { color: #27ae60; }
    .card .value.warning { color: #f39c12; }
    .card .value.error { color: #e74c3c; }
    .card .value.neutral { color: #3498db; }
    .section { background: white; border-radius: 8px; padding: 20px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { margin: 0 0 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #555; }
    tr:hover { background: #f8f9fa; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-error { background: #fadbd8; color: #c0392b; }
    .badge-warning { background: #fef9e7; color: #b7950b; }
    .badge-info { background: #d6eaf8; color: #2980b9; }
    .badge-success { background: #d5f5e3; color: #27ae60; }
    .score-bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
    .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .score-bar-fill.good { background: #27ae60; }
    .score-bar-fill.warning { background: #f39c12; }
    .score-bar-fill.error { background: #e74c3c; }
    .details { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
    .details.open { max-height: 500px; }
    .issue-list { margin: 10px 0; padding-left: 20px; }
    .issue-item { margin: 5px 0; font-size: 14px; }
    .fix-list { margin: 10px 0; padding-left: 20px; }
    .fix-item { margin: 5px 0; font-size: 13px; color: #555; }
    .fix-item.auto { color: #27ae60; }
    .filter-bar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .filter-btn { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
    .filter-btn.active { background: #1a1a2e; color: white; border-color: #1a1a2e; }
    .lang-badge { background: #e8f0fe; color: #1a73e8; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
    .hidden { display: none !important; }
    .lighthouse-scores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
    .lh-score { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .lh-score .label { font-size: 11px; text-transform: uppercase; color: #666; }
    .lh-score .value { font-size: 24px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔍 SEO Audit Report</h1>
      <div class="meta">
        Site: ${config.baseUrl} | 
        Date: ${new Date(timestamp).toLocaleString('fr-FR')} | 
        Pages auditées: ${summary.auditedPages}/${summary.totalPages} | 
        Score moyen: ${summary.averageScore}/100
      </div>
    </header>
    
    <div class="summary-grid">
      <div class="card">
        <h3>Score Global</h3>
        <div class="value ${getScoreClass(summary.averageScore)}">${summary.averageScore}/100</div>
        <div class="score-bar"><div class="score-bar-fill ${getScoreClass(summary.averageScore)}" style="width: ${summary.averageScore}%"></div></div>
      </div>
      <div class="card">
        <h3>Pages OK</h3>
        <div class="value good">${summary.auditedPages - summary.failedPages}</div>
      </div>
      <div class="card">
        <h3>Pages en erreur</h3>
        <div class="value error">${summary.failedPages}</div>
      </div>
      <div class="card">
        <h3>Pages à corriger</h3>
        <div class="value warning">${summary.pagesNeedingFix}</div>
      </div>
    </div>
    
    <div class="section">
      <h2>📊 Scores Lighthouse Moyens</h2>
      <div class="lighthouse-scores">
        <div class="lh-score">
          <div class="label">Performance</div>
          <div class="value ${getLhClass(summary.lighthouseAverages.performance)}">${summary.lighthouseAverages.performance}</div>
        </div>
        <div class="lh-score">
          <div class="label">Accessibilité</div>
          <div class="value ${getLhClass(summary.lighthouseAverages.accessibility)}">${summary.lighthouseAverages.accessibility}</div>
        </div>
        <div class="lh-score">
          <div class="label">Bonnes Pratiques</div>
          <div class="value ${getLhClass(summary.lighthouseAverages.bestPractices)}">${summary.lighthouseAverages.bestPractices}</div>
        </div>
        <div class="lh-score">
          <div class="label">SEO</div>
          <div class="value ${getLhClass(summary.lighthouseAverages.seo)}">${summary.lighthouseAverages.seo}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>⚠️ Top Problèmes</h2>
      <table>
        <thead>
          <tr><th>Problème</th><th>Catégorie</th><th>Sévérité</th><th>Pages affectées</th></tr>
        </thead>
        <tbody>
          ${summary.topIssues.map(item => `
            <tr>
              <td>${escapeHtml(item.issue.message)}</td>
              <td><span class="badge badge-info">${item.issue.category}</span></td>
              <td><span class="badge badge-${item.issue.type}">${item.issue.type}</span></td>
              <td>${item.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="section">
      <h2>📋 Détail par Page</h2>
      <div class="filter-bar">
        <button class="filter-btn active" data-filter="all">Toutes</button>
        <button class="filter-btn" data-filter="error">Erreurs</button>
        <button class="filter-btn" data-filter="warning">Avertissements</button>
        <button class="filter-btn" data-filter="needs-fix">À corriger</button>
        ${[...new Set(pages.map(p => p.lang))].map(l => `
          <button class="filter-btn" data-filter="lang" data-lang="${l}">${l.toUpperCase()}</button>
        `).join('')}
      </div>
      <table id="pages-table">
        <thead>
          <tr>
            <th>URL</th>
            <th>Lang</th>
            <th>Status</th>
            <th>Score</th>
            <th>Issues</th>
            <th>Lighthouse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pages.map(page => `
            <tr data-lang="${page.lang}" data-has-error="${page.issues.some(i => i.type === 'error')}" data-has-warning="${page.issues.some(i => i.type === 'warning')}" data-needs-fix="${page.fixes.some(f => f.autoFixable)}">
              <td><a href="${page.url}" target="_blank">${escapeHtml(page.path)}</a></td>
              <td><span class="lang-badge">${page.lang.toUpperCase()}</span></td>
              <td>${page.statusCode}</td>
              <td>
                <div class="score-bar"><div class="score-bar-fill ${getScoreClass(page.score)}" style="width: ${page.score}%"></div></div>
                <small>${page.score}/100</small>
              </td>
              <td>
                <span class="badge badge-error">${page.issues.filter(i => i.type === 'error').length}</span>
                <span class="badge badge-warning">${page.issues.filter(i => i.type === 'warning').length}</span>
                <span class="badge badge-info">${page.issues.filter(i => i.type === 'info').length}</span>
              </td>
              <td>
                ${page.lighthouse ? `
                  P:${page.lighthouse.performance} A:${page.lighthouse.accessibility} BP:${page.lighthouse.bestPractices} S:${page.lighthouse.seo}
                ` : '<span style="color:#999">Non testé</span>'}
              </td>
              <td>
                <button class="toggle-details" data-url="${page.url}">Détails</button>
                ${page.fixes.some(f => f.autoFixable) ? '<span class="badge badge-success">Auto-fixable</span>' : ''}
              </td>
            </tr>
            <tr class="details" id="details-${page.url.replace(/[^a-zA-Z0-9]/g, '-')}">
              <td colspan="7">
                <div style="padding: 20px;">
                  <h4>Issues (${page.issues.length})</h4>
                  <ul class="issue-list">
                    ${page.issues.map(issue => `
                      <li class="issue-item">
                        <span class="badge badge-${issue.type}">${issue.type.toUpperCase()}</span>
                        <span class="badge badge-info">${issue.category}</span>
                        ${escapeHtml(issue.message)}
                        ${issue.selector ? `<br><small>Sélecteur: ${escapeHtml(issue.selector)}</small>` : ''}
                        ${issue.currentValue ? `<br><small>Actuel: ${escapeHtml(issue.currentValue)}</small>` : ''}
                        ${issue.expectedValue ? `<br><small>Attendu: ${escapeHtml(issue.expectedValue)}</small>` : ''}
                      </li>
                    `).join('')}
                  </ul>
                  <h4>Fixes proposés (${page.fixes.length})</h4>
                  <ul class="fix-list">
                    ${page.fixes.map(fix => `
                      <li class="fix-item ${fix.autoFixable ? 'auto' : ''}">
                        <strong>${fix.type.toUpperCase()}</strong> ${fix.category} - ${fix.description}
                        ${fix.autoFixable ? ' ✅ Auto' : ' ⚠️ Manuel'}
                        <br><small>Sélecteur: ${escapeHtml(fix.selector)} | Nouveau: ${escapeHtml(fix.newValue.substring(0, 100))}${fix.newValue.length > 100 ? '...' : ''}</small>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <script>
    // Filtres
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const lang = btn.dataset.lang;
        document.querySelectorAll('#pages-table tbody tr:not(.details)').forEach(row => {
          let show = true;
          if (filter === 'error') show = row.dataset.hasError === 'true';
          else if (filter === 'warning') show = row.dataset.hasWarning === 'true';
          else if (filter === 'needs-fix') show = row.dataset.needsFix === 'true';
          else if (filter === 'lang') show = row.dataset.lang === lang;
          row.style.display = show ? '' : 'none';
          // Cacher détails si ligne masquée
          const detailId = 'details-' + row.cells[0].textContent.replace(/[^a-zA-Z0-9]/g, '-');
          const detailRow = document.getElementById(detailId);
          if (detailRow && !show) detailRow.classList.remove('open');
        });
      });
    });
    
    // Toggle détails
    document.querySelectorAll('.toggle-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        const detailId = 'details-' + url.replace(/[^a-zA-Z0-9]/g, '-');
        const detailRow = document.getElementById(detailId);
        if (detailRow) {
          detailRow.classList.toggle('open');
          btn.textContent = detailRow.classList.contains('open') ? 'Masquer' : 'Détails';
        }
      });
    });
  </script>
</body>
</html>`;
}

function getScoreClass(score: number): string {
  if (score >= 80) return 'good';
  if (score >= 60) return 'warning';
  return 'error';
}

function getLhClass(score: number): string {
  if (score >= 90) return 'good';
  if (score >= 70) return 'warning';
  return 'error';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}