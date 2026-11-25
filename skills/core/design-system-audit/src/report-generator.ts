/**
 * Génération de rapport d'audit
 */
import type { DesignToken, ComponentAudit, DesignSystemReport } from './types.js';

export function generateReport(
  tokens: DesignToken[],
  components: ComponentAudit[],
  projectRoot: string
): DesignSystemReport {
  const bqCompliant = components.filter(c => c.score >= 80).length;
  const nonCompliant = components.filter(c => c.score < 80).length;
  const avgScore = components.length > 0 
    ? components.reduce((sum, c) => sum + c.score, 0) / components.length 
    : 0;
  
  // Find tokens used in components but not defined
  const usedTokens = new Set<string>();
  for (const comp of components) {
    for (const cls of comp.bqClassesUsed) {
      // Convert class to potential token (e.g., bq-btn-primary -> --color-btn-primary)
      const tokenName = cls.replace('bq-', '').replace(/-([a-z])/g, (_, l) => l.toUpperCase());
      usedTokens.add(`--${cls.replace('bq-', '')}`);
    }
  }
  
  const definedTokens = new Set(tokens.map(t => `--${t.name}`));
  const missingTokens = [...usedTokens].filter(t => !definedTokens.has(t));
  const unusedTokens = [...definedTokens].filter(t => !usedTokens.has(t));
  
  return {
    tokens,
    components,
    summary: {
      totalComponents: components.length,
      bqCompliant,
      nonCompliant,
      avgScore: Math.round(avgScore * 100) / 100,
      missingTokens: missingTokens.slice(0, 20),
      unusedTokens: unusedTokens.slice(0, 20),
    },
  };
}

export function printReport(report: DesignSystemReport): void {
  console.log('\n=== DESIGN SYSTEM AUDIT REPORT ===\n');
  
  console.log(`📊 Summary:`);
  console.log(`  Components audited: ${report.summary.totalComponents}`);
  console.log(`  ✅ .bq compliant (≥80): ${report.summary.bqCompliant}`);
  console.log(`  ❌ Non-compliant (<80): ${report.summary.nonCompliant}`);
  console.log(`  Average score: ${report.summary.avgScore}/100`);
  
  if (report.summary.missingTokens.length > 0) {
    console.log(`\n⚠️  Missing tokens (used in components but not defined):`);
    for (const token of report.summary.missingTokens) {
      console.log(`  - ${token}`);
    }
  }
  
  if (report.summary.unusedTokens.length > 0) {
    console.log(`\n📦 Unused tokens (defined but not used):`);
    for (const token of report.summary.unusedTokens) {
      console.log(`  - ${token}`);
    }
  }
  
  console.log(`\n🔍 Component details:`);
  for (const comp of report.components.sort((a, b) => a.score - b.score)) {
    const status = comp.score >= 80 ? '✅' : comp.score >= 50 ? '⚠️' : '❌';
    console.log(`\n  ${status} ${comp.componentName} (${comp.score}/100)`);
    console.log(`     File: ${comp.file}`);
    if (comp.bqClassesUsed.length > 0) {
      console.log(`     .bq classes: ${comp.bqClassesUsed.join(', ')}`);
    }
    if (comp.nonBqClassesUsed.length > 0) {
      console.log(`     ❌ Non-.bq classes: ${comp.nonBqClassesUsed.slice(0, 5).join(', ')}`);
    }
    if (comp.inlineStyles.length > 0) {
      console.log(`     ❌ Inline styles: ${comp.inlineStyles.length}`);
    }
    for (const issue of comp.issues) {
      console.log(`     - ${issue}`);
    }
  }
}