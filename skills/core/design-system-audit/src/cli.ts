#!/usr/bin/env node
/**
 * CLI pour Design System Audit
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { runAudit } from './cli-runner.js';

const program = new Command();

program
  .name('design-audit')
  .description('Audit design system compliance (.bq namespace)')
  .version('1.0.0');

program
  .option('-r, --root <dir>', 'Project root directory', '.')
  .option('--json', 'Output JSON report')
  .action(async (options) => {
    try {
      const report = await runAudit(options.root);
      
      if (options.json) {
        console.log(JSON.stringify(report, null, 2));
      }
      
      if (report.summary.nonCompliant > 0) {
        console.log(chalk.red(`\n❌ ${report.summary.nonCompliant} component(s) need fixes`));
        process.exit(1);
      } else {
        console.log(chalk.green('\n✅ All components compliant!'));
        process.exit(0);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv);