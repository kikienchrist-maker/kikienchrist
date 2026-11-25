/**
 * Runner CLI pour l'audit
 */
import { extractTokensFromCSS, extractBQClassesFromCSS } from './token-extractor.js';
import { auditComponents } from './component-auditor.js';
import { generateReport, printReport } from './report-generator.js';
import type { DesignSystemReport } from './types.js';

export async function runAudit(projectRoot: string = '.'): Promise<DesignSystemReport> {
  const cssPath = `${projectRoot}/src/styles/lafoidieu-design.css`;
  
  console.log('🔍 Extracting design tokens...');
  const rawTokens = extractTokensFromCSS(cssPath);
  const tokens = rawTokens.map(t => ({
    name: t.name,
    value: t.value,
    category: t.category as any,
    file: cssPath,
    line: t.line,
  }));
  console.log(`  Found ${tokens.length} tokens`);
  
  console.log('🔍 Extracting .bq classes from CSS...');
  const bqClasses = extractBQClassesFromCSS(cssPath);
  console.log(`  Found ${bqClasses.length} .bq classes`);
  
  console.log('🔍 Auditing components...');
  const components = await auditComponents(projectRoot);
  console.log(`  Audited ${components.length} components`);
  
  console.log('📋 Generating report...');
  const report = generateReport(tokens, components, projectRoot);
  printReport(report);
  
  return report;
}