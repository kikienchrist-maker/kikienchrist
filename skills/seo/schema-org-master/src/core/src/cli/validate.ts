// cli/validate.ts — Validate Command (schema-org-master)
// Valide JSON-LD local ou URL déployée

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validate, validateForGoogle, ValidationReporter } from '../validator';
import { parseJsonLd } from '../context';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const validateCommand = new Command('validate')
  .description('Validate JSON-LD against Schema.org + Google Rich Results rules')
  .argument('[input]', 'JSON-LD file, directory, or URL to validate')
  .option('-u, --url <url>', 'Validate deployed URL (fetches HTML, extracts JSON-LD)')
  .option('-f, --file <path>', 'Validate local JSON-LD file')
  .option('-d, --dir <path>', 'Validate all JSON-LD files in directory (recursive)')
  .option('--google', 'Validate for Google Rich Results eligibility', true)
  .option('--format <type>', 'Output format: console, json, html', 'console')
  .option('--output <path>', 'Output file for json/html format')
  .option('--pattern <glob>', 'File pattern for directory scan', '**/*.{json,html,astro}')
  .action(async (input: string | undefined, options) => {
    try {
      let results: any[] = [];

      // 1. Valider URL déployée
      if (options.url) {
        console.log(chalk.blue(`🔍 Fetching ${options.url}...`));
        const html = await fetchHtml(options.url);
        const schemas = extractJsonLdFromHtml(html);
        console.log(chalk.gray(`Found ${schemas.length} JSON-LD script(s)`));

        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];
          const result = options.google ? validateForGoogle(schema) : validate(schema);
          result.schemaIndex = i;
          results.push(result);
        }
      }
      // 2. Valider fichier unique
      else if (options.file) {
        const content = await fs.readFile(options.file, 'utf-8');
        const schema = parseJsonLd(content);
        const result = options.google ? validateForGoogle(schema) : validate(schema);
        results.push(result);
      }
      // 3. Valider répertoire
      else if (options.dir) {
        const files = await findFiles(options.dir, options.pattern);
        console.log(chalk.blue(`📁 Scanning ${files.length} files in ${options.dir}...`));

        for (const file of files) {
          try {
            const content = await fs.readFile(file, 'utf-8');
            const schema = parseJsonLd(content);
            const result = options.google ? validateForGoogle(schema) : validate(schema);
            (result as any).file = file;
            results.push(result);
          } catch (e) {
            results.push({
              valid: false,
              errors: [{ path: 'file', message: `Failed to parse: ${e}`, code: 'PARSE_ERROR', severity: 'error' }],
              warnings: [], suggestions: [], schemaType: 'unknown', timestamp: new Date().toISOString(),
              file,
            });
          }
        }
      }
      // 4. Argument positionnel (fichier ou dir)
      else if (input) {
        const stat = await fs.stat(input);
        if (stat.isDirectory()) {
          // Traiter comme --dir
          const files = await findFiles(input, options.pattern);
          for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            const schema = parseJsonLd(content);
            const result = options.google ? validateForGoogle(schema) : validate(schema);
            (result as any).file = file;
            results.push(result);
          }
        } else {
          // Traiter comme --file
          const content = await fs.readFile(input, 'utf-8');
          const schema = parseJsonLd(content);
          const result = options.google ? validateForGoogle(schema) : validate(schema);
          results.push(result);
        }
      } else {
        console.error(chalk.red('❌ No input provided. Use --url, --file, --dir, or positional argument.'));
        process.exit(1);
      }

      // Afficher résultats
      const format = options.format;
      let output = '';

      if (format === 'json') {
        output = JSON.stringify(results, null, 2);
      } else if (format === 'html') {
        output = generateHtmlReport(results);
      } else {
        output = results.map(r => ValidationReporter.formatConsole(r)).join('\n\n');
      }

      if (options.output) {
        await fs.writeFile(options.output, output, 'utf-8');
        console.log(chalk.green(`\n✅ Report saved to ${options.output}`));
      } else {
        console.log('\n' + output);
      }

      // Exit code basé sur validité
      const hasErrors = results.some(r => !r.valid);
      if (hasErrors) {
        console.log(chalk.red('\n❌ Validation failed'));
        process.exit(1);
      } else {
        console.log(chalk.green('\n✅ All valid'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Validation failed:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// HELPERS
// ============================================================================

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'schema-org-master/0.1.0 (+https://kikienchrist.vercel.app)' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.text();
}

function extractJsonLdFromHtml(html: string): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed && typeof parsed === 'object') {
        schemas.push(parsed);
      }
    } catch {
      // Ignorer scripts invalides
    }
  }
  return schemas;
}

async function findFiles(dir: string, pattern: string): Promise<string[]> {
  const glob = await import('glob');
  return glob.glob(pattern, { cwd: dir, absolute: true, nodir: true });
}

function generateHtmlReport(results: any[]): string {
  const passed = results.filter(r => r.valid).length;
  const failed = results.filter(r => !r.valid).length;

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Schema.org Validation Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    .summary { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .stat { padding: 1rem; border-radius: 8px; color: white; }
    .stat.passed { background: #10b981; }
    .stat.failed { background: #ef4444; }
    .result { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem; padding: 1rem; }
    .result.valid { border-left: 4px solid #10b981; }
    .result.invalid { border-left: 4px solid #ef4444; }
    .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .schema-type { font-weight: 600; color: #1f2937; }
    .file-path { font-size: 0.875rem; color: #6b7280; }
    .error { color: #ef4444; font-family: monospace; font-size: 0.875rem; margin: 0.25rem 0; }
    .warning { color: #f59e0b; font-family: monospace; font-size: 0.875rem; margin: 0.25rem 0; }
    .code { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.75rem; }
  </style>
</head>
<body>
  <h1>Schema.org Validation Report</h1>
  <div class="summary">
    <div class="stat passed">✅ ${passed} Passed</div>
    <div class="stat failed">❌ ${failed} Failed</div>
  </div>`;

  for (const result of results) {
    const file = (result as any).file || '';
    const schemaIndex = (result as any).schemaIndex !== undefined ? ` [#${(result as any).schemaIndex}]` : '';
    html += `
  <div class="result ${result.valid ? 'valid' : 'invalid'}">
    <div class="result-header">
      <span class="schema-type">${result.schemaType}${schemaIndex}</span>
      ${file ? `<span class="file-path">${file}</span>` : ''}
    </div>`;

    if (result.errors.length > 0) {
      html += '<div class="errors"><strong>Errors:</strong>';
      for (const e of result.errors) {
        html += `<div class="error">${e.path}: ${e.message} <span class="code">${e.code}</span></div>`;
      }
      html += '</div>';
    }

    if (result.warnings.length > 0) {
      html += '<div class="warnings"><strong>Warnings:</strong>';
      for (const w of result.warnings) {
        html += `<div class="warning">${w.path}: ${w.message} <span class="code">${w.code}</span></div>`;
      }
      html += '</div>';
    }

    if ('richResultsEligible' in result) {
      const g = result as any;
      html += `<div style="margin-top: 0.5rem; padding: 0.5rem; background: ${g.richResultsEligible ? '#ecfdf5' : '#fef2f2'}; border-radius: 4px;">`;
      html += `<strong>Google Rich Results: </strong><span style="color: ${g.richResultsEligible ? '#10b981' : '#ef4444'}">${g.richResultsEligible ? 'Eligible' : 'Not Eligible'}</span>`;
      if (g.missingRequiredFields.length > 0) {
        html += `<br><strong>Missing required:</strong> ${g.missingRequiredFields.join(', ')}`;
      }
      if (g.missingRecommendedFields.length > 0) {
        html += `<br><strong>Missing recommended:</strong> ${g.missingRecommendedFields.join(', ')}`;
      }
      html += '</div>';
    }

    html += '</div>';
  }

  html += '</body></html>';
  return html;
}