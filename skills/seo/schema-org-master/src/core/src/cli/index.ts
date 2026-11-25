// cli/index.ts — CLI Entry Point (schema-org-master)
// Commander.js v12+ avec sous-commandes

import { Command } from 'commander';
import chalk from 'chalk';
import { generateCommand } from './generate';
import { validateCommand } from './validate';
import { auditCommand } from './audit';
import { updateTypesCommand } from './update-types';

const program = new Command();

program
  .name('schema-org')
  .description('Schema.org JSON-LD Generator, Validator & Auditor for Maximum SEO')
  .version('0.1.0', '-v, --version', 'Display version')
  .addCommand(generateCommand)
  .addCommand(validateCommand)
  .addCommand(auditCommand)
  .addCommand(updateTypesCommand)
  .configureHelp({
    sortSubcommands: true,
    subcommandTerm: () => 'command',
  });

// Global options
program
  .option('-c, --config <path>', 'Config file path')
  .option('--verbose', 'Verbose output')
  .option('--quiet', 'Quiet output (errors only)')
  .hook('preAction', (thisCommand, actionCommand) => {
    // Merge global options into action command
    const opts = thisCommand.opts();
    if (opts.verbose) process.env.VERBOSE = 'true';
    if (opts.quiet) process.env.QUIET = 'true';
  });

// Error handling
program.exitOverride((err) => {
  if (err.code === 'commander.helpDisplayed' || err.code === 'commander.versionDisplayed') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), err.message);
  process.exit(1);
});

// Parse
program.parseAsync(process.argv).catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});

export { program };