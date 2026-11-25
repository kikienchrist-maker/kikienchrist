/**
 * CLI pour Decap CMS Setup
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { resolve } from 'path';
import type { GeneratorOptions, NetlifySetupOptions, PreviewConfigOptions } from './types.js';
import { generateDecapConfig, writeDecapConfig } from './generator.js';
import { writeNetlifyConfig, generateIdentityWidgetCode } from './netlify.js';
import { writePreviewConfig, writeAdminIndexHtml } from './preview.js';

const program = new Command();

program
  .name('decap-setup')
  .description('Configuration Decap CMS pour Netlify Identity/Git Gateway: collections, preview, netlify.toml')
  .version('1.0.0');

program
  .command('generate')
  .description('Génère config.yml Decap CMS')
  .option('-o, --output <dir>', 'Dossier de sortie', 'static/admin')
  .option('--site-url <url>', 'URL du site', 'https://kikienchrist.vercel.app')
  .option('--logo-url <url>', 'URL du logo', '')
  .option('--branch <branch>', 'Branche Git', 'main')
  .option('--repo <repo>', 'Repo GitHub (owner/repo)', '')
  .option('--simple', 'Mode publication simple (sans workflow éditorial)', false)
  .action(async (options) => {
    const spinner = ora('Génération config.yml...').start();
    
    try {
      const genOptions: GeneratorOptions = {
        outputDir: resolve(options.output),
        siteUrl: options.siteUrl,
        logoUrl: options.logoUrl || undefined,
        publishMode: options.simple ? 'simple' : 'editorial_workflow',
        backend: options.repo ? { repo: options.repo, branch: options.branch } : { branch: options.branch },
      };
      
      const config = generateDecapConfig(genOptions);
      writeDecapConfig(config, genOptions.outputDir);
      
      spinner.succeed(`config.yml généré: ${resolve(options.output, 'config.yml')}`);
      console.log(chalk.gray(`Collections: ${config.collections.map(c => c.name).join(', ')}`));
    } catch (error) {
      spinner.fail('Erreur génération');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('netlify')
  .description('Génère netlify.toml et _redirects pour Identity/Git Gateway')
  .option('-o, --output <dir>', 'Dossier de sortie', '.')
  .option('--site-url <url>', 'URL du site', 'https://kikienchrist.vercel.app')
  .action(async (options) => {
    const spinner = ora('Génération netlify.toml...').start();
    
    try {
      const netlifyOptions: NetlifySetupOptions = {
        outputDir: resolve(options.output),
        siteUrl: options.siteUrl,
      };
      
      writeNetlifyConfig(netlifyOptions);
      
      spinner.succeed(`netlify.toml et _redirects générés dans ${resolve(options.output)}`);
    } catch (error) {
      spinner.fail('Erreur génération');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('preview')
  .description('Génère templates de prévisualisation pour Decap CMS')
  .option('-o, --output <dir>', 'Dossier de sortie (racine projet)', '.')
  .option('--site-url <url>', 'URL du site', 'https://kikienchrist.vercel.app')
  .action(async (options) => {
    const spinner = ora('Génération preview templates...').start();
    
    try {
      const previewOptions: PreviewConfigOptions = {
        outputDir: resolve(options.output),
        siteUrl: options.siteUrl,
        collections: ['blog', 'legal', 'books'],
      };
      
      writePreviewConfig(previewOptions);
      writeAdminIndexHtml({ outputDir: resolve(options.output), siteUrl: options.siteUrl });
      
      spinner.succeed(`Templates de prévisualisation générés dans ${resolve(options.output, 'src/cms/preview-templates')}`);
      console.log(chalk.gray(`Admin index.html généré dans ${resolve(options.output, 'admin')}`));
    } catch (error) {
      spinner.fail('Erreur génération');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('identity-widget')
  .description('Affiche le code du widget Netlify Identity')
  .option('--site-url <url>', 'URL du site', 'https://kikienchrist.vercel.app')
  .action(async (options) => {
    const code = generateIdentityWidgetCode(options.siteUrl);
    console.log(chalk.bold('\n=== Netlify Identity Widget ==='));
    console.log(chalk.gray('À inclure dans <head> de vos pages (ex: MainLayout.astro):\n'));
    console.log(code);
  });

program
  .command('full')
  .description('Génère toute la configuration Decap CMS complète')
  .option('-o, --output <dir>', 'Dossier de sortie projet', '.')
  .option('--site-url <url>', 'URL du site', 'https://kikienchrist.vercel.app')
  .option('--logo-url <url>', 'URL du logo', '')
  .option('--branch <branch>', 'Branche Git', 'main')
  .option('--repo <repo>', 'Repo GitHub (owner/repo)', '')
  .option('--simple', 'Mode publication simple', false)
  .action(async (options) => {
    const spinner = ora('Génération configuration Decap CMS complète...').start();
    
    try {
      const projectRoot = resolve(options.output);
      const adminDir = join(projectRoot, 'static', 'admin');
      
      // 1. config.yml
      const config = generateDecapConfig({
        outputDir: adminDir,
        siteUrl: options.siteUrl,
        logoUrl: options.logoUrl || undefined,
        publishMode: options.simple ? 'simple' : 'editorial_workflow',
        backend: options.repo ? { repo: options.repo, branch: options.branch } : { branch: options.branch },
      });
      writeDecapConfig(config, adminDir);
      
      // 2. netlify.toml & _redirects
      writeNetlifyConfig({
        outputDir: projectRoot,
        siteUrl: options.siteUrl,
      });
      
      // 3. Preview templates & admin/index.html
      writePreviewConfig({
        outputDir: projectRoot,
        siteUrl: options.siteUrl,
        collections: ['blog', 'legal', 'books'],
      });
      writeAdminIndexHtml({ outputDir: projectRoot, siteUrl: options.siteUrl });
      
      spinner.succeed('Configuration Decap CMS complète générée !');
      
      console.log(chalk.bold('\n=== FICHIERS GÉNÉRÉS ==='));
      console.log(chalk.green(`  ${join(adminDir, 'config.yml')} - Config Decap CMS`));
      console.log(chalk.green(`  ${join(projectRoot, 'netlify.toml')} - Config Netlify Identity/Git Gateway`));
      console.log(chalk.green(`  ${join(projectRoot, '_redirects')} - Redirections admin`));
      console.log(chalk.green(`  ${join(projectRoot, 'src/cms/preview-templates/index.ts')} - Templates preview`));
      console.log(chalk.green(`  ${join(projectRoot, 'admin/index.html')} - Page admin`));
      
      console.log(chalk.bold('\n=== PROCHAINES ÉTAPES ==='));
      console.log('1. Déployer sur Netlify (connecter repo GitHub)');
      console.log('2. Activer Netlify Identity dans l\'interface Netlify');
      console.log('3. Activer Git Gateway dans Netlify > Settings > Identity > Git Gateway');
      console.log('4. Inviter utilisateurs via Netlify Identity > Invite users');
      console.log('5. Accéder à /admin/ pour tester');
      
    } catch (error) {
      spinner.fail('Erreur génération');
      console.error(error);
      process.exit(1);
    }
  });

function join(...paths: string[]): string {
  return paths.join('/').replace(/\/+/g, '/');
}

program.parse();