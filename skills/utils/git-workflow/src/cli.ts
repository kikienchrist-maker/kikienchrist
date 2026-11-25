/**
 * CLI pour Git Workflow
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { parseCommitMessage, validateCommitMessage, formatCommitMessage, generateCommitTemplate, getCommitTypes } from './commit.js';
import { generateChangelog, updateChangelog, generateChangelogFromCommits } from './changelog.js';
import { runSemanticRelease, writeReleaseConfig, getCurrentVersion, setVersion, calculateNextVersion, analyzeCommitsForRelease } from './release.js';
import { setupGitWorkflow } from './hooks.js';
import { DEFAULT_CONVENTIONAL_CONFIG } from './config.js';
import { execa } from 'execa';

const program = new Command();

program
  .name('git-workflow')
  .description('Utilitaires Git: conventional commits, changelog, semantic release, hooks')
  .version('1.0.0');

program
  .command('commit')
  .description('Valider ou formater un message de commit')
  .argument('<message>', 'Message de commit')
  .option('-v, --validate', 'Valider seulement', false)
  .option('-f, --format', 'Formater le message', false)
  .option('--type <type>', 'Type (feat, fix, etc.)')
  .option('--scope <scope>', 'Scope')
  .option('--subject <subject>', 'Sujet')
  .option('--body <body>', 'Corps')
  .option('--breaking', 'Breaking change', false)
  .action(async (message, options) => {
    if (options.format) {
      const formatted = formatCommitMessage({
        type: options.type || 'feat',
        scope: options.scope,
        subject: options.subject || message,
        body: options.body,
        breaking: options.breaking,
      });
      console.log(chalk.green(formatted));
      return;
    }
    
    if (options.validate || !options.type) {
      const result = validateCommitMessage(message, DEFAULT_CONVENTIONAL_CONFIG);
      if (result.valid) {
        console.log(chalk.green('✓ Commit valide'));
        console.log(chalk.gray(JSON.stringify(parseCommitMessage(message), null, 2)));
      } else {
        console.log(chalk.red('✗ Commit invalide:'));
        result.errors.forEach(e => console.log(chalk.red(`  - ${e}`)));
        process.exit(1);
      }
    }
  });

program
  .command('template')
  .description('Afficher template de commit')
  .action(() => {
    console.log(generateCommitTemplate());
  });

program
  .command('types')
  .description('Lister types de commit valides')
  .action(() => {
    const types = getCommitTypes();
    console.log(chalk.bold('\nTypes de commit:'));
    for (const t of types) {
      if (!t.hidden) {
        console.log(`  ${chalk.cyan(t.type)}: ${t.section}`);
      }
    }
  });

program
  .command('changelog')
  .description('Générer ou mettre à jour CHANGELOG.md')
  .option('-o, --output <file>', 'Fichier sortie', 'CHANGELOG.md')
  .option('-f, --from <tag>', 'Depuis tag')
  .option('-t, --to <tag>', 'Jusqu\'à tag')
  .option('-c, --count <n>', 'Nombre de releases', '0')
  .option('--write', 'Écrire dans fichier', false)
  .action(async (options) => {
    const spinner = ora('Génération changelog...').start();
    
    try {
      if (options.write) {
        await updateChangelog({
          outputFile: options.output,
          from: options.from,
          to: options.to,
          releaseCount: parseInt(options.count) || undefined,
        });
        spinner.succeed(`CHANGELOG.md mis à jour: ${options.output}`);
      } else {
        const changelog = await generateChangelog({
          outputFile: options.output,
          from: options.from,
          to: options.to,
          releaseCount: parseInt(options.count) || undefined,
        });
        spinner.succeed('Changelog généré');
        console.log(changelog);
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('release')
  .description('Lancer semantic-release')
  .option('--dry-run', 'Mode simulation', false)
  .option('--branch <branch>', 'Branche', 'main')
  .option('--prerelease <tag>', 'Tag prerelease (beta, alpha)')
  .option('--skip-publish', 'Ne pas publier npm', false)
  .option('--skip-git', 'Ne pas push git', false)
  .option('--debug', 'Mode debug', false)
  .action(async (options) => {
    const spinner = ora(options.dryRun ? 'Simulation release...' : 'Release en cours...').start();
    
    try {
      const result = await runSemanticRelease({
        dryRun: options.dryRun,
        branch: options.branch,
        prerelease: options.prerelease,
        skipPublish: options.skipPublish,
        skipGit: options.skipGit,
        debug: options.debug,
      });
      
      if (result.success) {
        spinner.succeed(options.dryRun ? 'Simulation réussie' : 'Release publiée');
        if (result.version) console.log(chalk.green(`Version: ${result.version}`));
        if (result.notes) console.log(chalk.gray(result.notes));
      } else {
        spinner.fail('Release échouée');
        console.error(chalk.red(result.error));
        process.exit(1);
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('version')
  .description('Gestion version')
  .option('--bump <type>', 'Type bump (major, minor, patch)', 'patch')
  .option('--set <version>', 'Définir version exacte')
  .option('--show', 'Afficher version actuelle', false)
  .action(async (options) => {
    const current = getCurrentVersion();
    
    if (options.show) {
      console.log(chalk.cyan(`Version actuelle: ${current}`));
      return;
    }
    
    let nextVersion: string;
    if (options.set) {
      nextVersion = options.set;
    } else {
      nextVersion = calculateNextVersion(current, { type: options.bump as any, version: '', previousVersion: current });
    }
    
    console.log(chalk.gray(`Actuelle: ${current}`));
    console.log(chalk.green(`Nouvelle: ${nextVersion}`));
    
    setVersion(nextVersion);
    console.log(chalk.green('package.json mis à jour'));
  });

program
  .command('analyze')
  .description('Analyser commits pour version bump')
  .argument('[range]', 'Range git (ex: v1.0.0..HEAD)', 'HEAD')
  .action(async (range) => {
    const spinner = ora('Analyse commits...').start();
    
    try {
      const { stdout } = await execa('git', ['log', '--pretty=format:%s', range]);
      const commits = stdout.split('\n').filter(Boolean).map(message => ({ message }));
      
      const bump = analyzeCommitsForRelease(commits);
      const current = getCurrentVersion();
      const next = calculateNextVersion(current, bump);
      
      spinner.succeed('Analyse terminée');
      console.log(chalk.bold('\nRésultat:'));
      console.log(`  Version actuelle: ${chalk.cyan(current)}`);
      console.log(`  Bump: ${chalk.yellow(bump.type)}`);
      console.log(`  Prochaine version: ${chalk.green(next)}`);
      console.log(`  Commits analysés: ${commits.length}`);
      
      // Détail par type
      const types: Record<string, number> = {};
      for (const c of commits) {
        const parsed = parseCommitMessage(c.message);
        types[parsed.type] = (types[parsed.type] || 0) + 1;
      }
      console.log('\nPar type:');
      for (const [type, count] of Object.entries(types)) {
        console.log(`  ${type}: ${count}`);
      }
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('setup')
  .description('Configurer hooks Husky + commitlint + lint-staged')
  .option('-d, --dir <dir>', 'Racine projet', '.')
  .action(async (options) => {
    const spinner = ora('Configuration Git workflow...').start();
    
    try {
      setupGitWorkflow(options.dir);
      spinner.succeed('Git workflow configuré');
      console.log(chalk.bold('\nProchaines étapes:'));
      console.log('1. npm install (pour installer husky, commitlint, lint-staged)');
      console.log('2. npm run prepare (installe hooks Husky)');
      console.log('3. Tester: git commit -m "feat(test): essai"');
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Générer fichiers de config')
  .option('--commitlint', 'Générer commitlint.config.js', false)
  .option('--lintstaged', 'Générer .lintstagedrc.json', false)
  .option('--husky', 'Générer hooks Husky', false)
  .option('--releaserc', 'Générer .releaserc.json', false)
  .option('--all', 'Tout générer', false)
  .action(async (options) => {
    const { generateCommitlintConfig, generateLintStagedConfig, generateHuskyHooks } = await import('./hooks.js');
    if (options.all || options.commitlint) generateCommitlintConfig();
    if (options.all || options.lintstaged) generateLintStagedConfig();
    if (options.all || options.husky) generateHuskyHooks();
    if (options.all || options.releaserc) writeReleaseConfig({} as any);
    console.log(chalk.green('Configs générées'));
  });

program.parse();