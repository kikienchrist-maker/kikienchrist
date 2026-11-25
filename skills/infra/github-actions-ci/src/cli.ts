/**
 * CLI pour GitHub Actions CI/CD Generator
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { dump } from 'js-yaml';
import type { GHACIConfig, GeneratorOptions } from './types.js';
import { mergeConfig, DEFAULT_GHA_CONFIG } from './config.js';
import { generateWorkflow } from './generator.js';

const program = new Command();

program
  .name('gha-ci')
  .description('Générateur pipeline GitHub Actions CI/CD complet pour Astro/Vercel')
  .version('1.0.0');

program
  .command('generate')
  .description('Génère .github/workflows/ci.yml')
  .option('-o, --output <dir>', 'Dossier de sortie', '.github/workflows')
  .option('--project-name <name>', 'Nom du projet', 'kikienchrist')
  .option('--node-version <ver>', 'Version Node.js', '20')
  .option('--pnpm-version <ver>', 'Version pnpm', '9')
  .option('--enable-all', 'Activer tous les jobs', false)
  .option('--disable <jobs>', 'Jobs à désactiver (comma-separated)', '')
  .option('--vercel-project-id <id>', 'Vercel Project ID (secret ref)', '${{ secrets.VERCEL_PROJECT_ID }}')
  .option('--vercel-org-id <id>', 'Vercel Org ID (secret ref)', '${{ secrets.VERCEL_ORG_ID }}')
  .option('--lighthouse-perf <n>', 'Budget performance', '90')
  .option('--lighthouse-a11y <n>', 'Budget accessibilité', '95')
  .option('--lighthouse-bp <n>', 'Budget best practices', '90')
  .option('--lighthouse-seo <n>', 'Budget SEO', '90')
  .option('--dry-run', 'Afficher YAML sans écrire', false)
  .action(async (options) => {
    const spinner = ora('Génération workflow GitHub Actions...').start();
    
    try {
      const disabledJobs = options.disable.split(',').filter(Boolean);
      
      const userConfig: Partial<GHACIConfig> = {
        projectName: options.projectName,
        nodeVersion: options.nodeVersion,
        pnpmVersion: options.pnpmVersion,
        jobs: {
          lint: !disabledJobs.includes('lint'),
          typecheck: !disabledJobs.includes('typecheck'),
          unit: !disabledJobs.includes('unit'),
          build: !disabledJobs.includes('build'),
          e2e: !disabledJobs.includes('e2e'),
          a11y: !disabledJobs.includes('a11y'),
          lighthouse: !disabledJobs.includes('lighthouse'),
          security: !disabledJobs.includes('security'),
          deployPreview: !disabledJobs.includes('deploy-preview'),
          deployProduction: !disabledJobs.includes('deploy-production'),
        },
        secrets: {
          vercelToken: '${{ secrets.VERCEL_TOKEN }}',
          vercelOrgId: options.vercelOrgId,
          vercelProjectId: options.vercelProjectId,
        },
        lighthouse: {
          enabled: !disabledJobs.includes('lighthouse'),
          budgets: {
            performance: parseInt(options.lighthousePerf),
            accessibility: parseInt(options.lighthouseA11y),
            bestPractices: parseInt(options.lighthouseBp),
            seo: parseInt(options.lighthouseSeo),
          },
          urls: DEFAULT_GHA_CONFIG.lighthouse.urls,
        },
      };
      
      const config = mergeConfig(userConfig);
      const { workflowYml } = generateWorkflow(config);
      
      if (options.dryRun) {
        spinner.stop();
        console.log(chalk.bold('\n=== WORKFLOW YAML ===\n'));
        console.log(workflowYml);
      } else {
        const outputDir = resolve(options.output);
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }
        const outputPath = join(outputDir, 'ci.yml');
        writeFileSync(outputPath, workflowYml, 'utf-8');
        spinner.succeed(`Workflow généré: ${outputPath}`);
      }
      
    } catch (error) {
      spinner.fail('Erreur génération');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('lighthouse-config')
  .description('Génère lighthouserc.json')
  .option('-o, --output <file>', 'Fichier sortie', 'lighthouserc.json')
  .option('--perf <n>', 'Performance budget', '90')
  .option('--a11y <n>', 'Accessibilité budget', '95')
  .option('--bp <n>', 'Best practices budget', '90')
  .option('--seo <n>', 'SEO budget', '90')
  .action(async (options) => {
    const spinner = ora('Génération lighthouserc.json...').start();
    
    try {
      const config = {
        ci: {
          collect: {
            numberOfRuns: 3,
            startServerCommand: 'pnpm preview --port 4321',
            url: ['http://localhost:4321'],
            settings: {
              headless: true,
              preset: 'desktop',
            },
          },
          assert: {
            assertions: {
              'categories:performance': ['error', { minScore: parseInt(options.perf) / 100 }],
              'categories:accessibility': ['error', { minScore: parseInt(options.a11y) / 100 }],
              'categories:best-practices': ['error', { minScore: parseInt(options.bp) / 100 }],
              'categories:seo': ['error', { minScore: parseInt(options.seo) / 100 }],
            },
          },
          upload: {
            target: 'temporary-public-storage',
          },
        },
      };
      
      const yaml = require('js-yaml').dump(config, { lineWidth: 120, noRefs: true });
      writeFileSync(resolve(options.output), yaml, 'utf-8');
      
      spinner.succeed(`lighthouserc.json généré: ${resolve(options.output)}`);
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('playwright-config')
  .description('Génère playwright.config.ts')
  .option('-o, --output <file>', 'Fichier sortie', 'playwright.config.ts')
  .option('--base-url <url>', 'Base URL', 'http://localhost:4321')
  .option('--test-dir <dir>', 'Dossier tests', 'e2e')
  .action(async (options) => {
    const spinner = ora('Génération playwright.config.ts...').start();
    
    try {
      const config = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '${options.testDir}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'junit.xml' }],
  ],
  use: {
    baseURL: '${options.baseUrl}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm preview --port 4321',
    url: '${options.baseUrl}',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});`;
      
      writeFileSync(resolve(options.output), config, 'utf-8');
      spinner.succeed(`playwright.config.ts généré: ${resolve(options.output)}`);
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('full')
  .description('Génère toute la config CI/CD (workflow + lighthouse + playwright)')
  .option('-o, --output <dir>', 'Dossier racine projet', '.')
  .option('--project-name <name>', 'Nom projet', 'kikienchrist')
  .action(async (options) => {
    const spinner = ora('Génération config CI/CD complète...').start();
    
    try {
      const projectRoot = resolve(options.output);
      const workflowsDir = join(projectRoot, '.github', 'workflows');
      
      if (!existsSync(workflowsDir)) {
        mkdirSync(workflowsDir, { recursive: true });
      }
      
      // 1. Workflow CI/CD
      const userConfig: Partial<GHACIConfig> = {
        projectName: options.projectName,
      };
      const config = mergeConfig(userConfig);
      const { workflowYml } = generateWorkflow(config);
      writeFileSync(join(workflowsDir, 'ci.yml'), workflowYml, 'utf-8');
      
      // 2. lighthouserc.json
      const lighthouseConfig = {
        ci: {
          collect: { numberOfRuns: 3, startServerCommand: 'pnpm preview --port 4321', url: ['http://localhost:4321'] },
          assert: {
            assertions: {
              'categories:performance': ['error', { minScore: 0.9 }],
              'categories:accessibility': ['error', { minScore: 0.95 }],
              'categories:best-practices': ['error', { minScore: 0.9 }],
              'categories:seo': ['error', { minScore: 0.9 }],
            },
          },
          upload: { target: 'temporary-public-storage' },
        },
      };
      writeFileSync(join(projectRoot, 'lighthouserc.json'), dump(lighthouseConfig), 'utf-8');
      
      // 3. playwright.config.ts
      const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['junit', { outputFile: 'junit.xml' }]],
  use: { baseURL: 'http://localhost:4321', trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: { command: 'pnpm preview --port 4321', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI, timeout: 120000 },
});`;
      writeFileSync(join(projectRoot, 'playwright.config.ts'), playwrightConfig, 'utf-8');
      
      spinner.succeed('Config CI/CD complète générée !');
      
      console.log(chalk.bold('\n=== FICHIERS GÉNÉRÉS ==='));
      console.log(chalk.green(`  ${join(workflowsDir, 'ci.yml')} - Pipeline CI/CD complet`));
      console.log(chalk.green(`  ${join(projectRoot, 'lighthouserc.json')} - Budgets Lighthouse`));
      console.log(chalk.green(`  ${join(projectRoot, 'playwright.config.ts')} - Config Playwright`));
      
      console.log(chalk.bold('\n=== SECRETS REQUIS (GitHub Settings > Secrets) ==='));
      console.log('  VERCEL_TOKEN');
      console.log('  VERCEL_ORG_ID');
      console.log('  VERCEL_PROJECT_ID');
      console.log('  (Optionnel) NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID');
      console.log('  (Optionnel) LHCI_GITHUB_APP_TOKEN pour Lighthouse CI');
      console.log('  (Optionnel) CODECOV_TOKEN pour couverture');
      
      console.log(chalk.bold('\n=== PROCHAINES ÉTAPES ==='));
      console.log('1. Ajouter secrets dans GitHub Repository Settings > Secrets > Actions');
      console.log('2. Créer dossier e2e/ avec tests Playwright');
      console.log('3. Pousser sur GitHub → Pipeline se lance automatiquement');
      console.log('4. Vérifier onglet Actions pour suivi');
      
    } catch (error) {
      spinner.fail('Erreur');
      console.error(error);
      process.exit(1);
    }
  });

program.parse();