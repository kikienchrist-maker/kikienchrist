/**
 * Générateur de workflow GitHub Actions - Version simplifiée
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { dump } from 'js-yaml';
import type { GHACIConfig, WorkflowOutput } from './types.js';

export function generateWorkflow(config: GHACIConfig): WorkflowOutput {
  const workflow = buildWorkflow(config);
  const yaml = dump(workflow, { lineWidth: 120, noRefs: true });
  return { workflowYml: yaml, filesGenerated: ['.github/workflows/ci.yml'] };
}

function buildWorkflow(config: GHACIConfig): any {
  const { jobs: enabledJobs } = config;
  const jobs: Record<string, any> = {};

  // 1. Lint
  if (enabledJobs.lint) {
    jobs.lint = {
      name: 'Lint',
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 10,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Run ESLint', run: 'pnpm lint' },
        { name: 'Run Prettier Check', run: 'pnpm prettier:check' },
      ],
    };
  }

  // 2. TypeCheck
  if (enabledJobs.typecheck) {
    jobs.typecheck = {
      name: 'TypeCheck',
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 10,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Run TypeScript Check', run: 'pnpm typecheck' },
        { name: 'Run Astro Check', run: 'pnpm astro check' },
      ],
    };
  }

  // 3. Unit Tests
  if (enabledJobs.unit) {
    jobs.unit = {
      name: 'Unit Tests',
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 15,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Run Unit Tests', run: 'pnpm test --run --reporter=junit --outputFile=junit.xml' },
        { name: 'Upload coverage', uses: 'codecov/codecov-action@v4', with: { files: './coverage/lcov.info', 'fail-ci-if-error': false } },
      ],
    };
  }

  // 4. Build
  if (enabledJobs.build) {
    const buildNeeds: string[] = [];
    if (enabledJobs.lint) buildNeeds.push('lint');
    if (enabledJobs.typecheck) buildNeeds.push('typecheck');
    if (enabledJobs.unit) buildNeeds.push('unit');
    
    jobs.build = {
      name: 'Build',
      needs: buildNeeds.length > 0 ? buildNeeds : undefined,
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 20,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Build Astro', run: 'pnpm build' },
        { name: 'Upload build artifact', uses: 'actions/upload-artifact@v4', with: { name: 'dist', path: 'dist', 'retention-days': 7 } },
      ],
    };
  }

  // 5. E2E Tests
  if (enabledJobs.e2e) {
    jobs.e2e = {
      name: 'E2E Tests',
      needs: ['build'],
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 30,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Download build artifact', uses: 'actions/download-artifact@v4', with: { name: 'dist', path: 'dist' } },
        { name: 'Install Playwright', run: 'pnpm exec playwright install --with-deps' },
        { name: 'Start Preview Server', run: 'pnpm preview --port 4321 &', shell: 'bash' },
        { name: 'Wait for server', run: 'sleep 10 && curl -f http://localhost:4321 || exit 1' },
        { name: 'Run Playwright Tests', run: 'pnpm exec playwright test --reporter=junit --output=junit.xml' },
        { name: 'Upload E2E Report', uses: 'actions/upload-artifact@v4', with: { name: 'playwright-report', path: 'playwright-report', 'retention-days': 7 } },
        { name: 'Upload JUnit Results', uses: 'actions/upload-artifact@v4', with: { name: 'e2e-junit', path: 'junit.xml', 'retention-days': 7 } },
      ],
    };
  }

  // 6. Accessibility
  if (enabledJobs.a11y) {
    jobs.a11y = {
      name: 'Accessibility',
      needs: ['build'],
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 20,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Download build artifact', uses: 'actions/download-artifact@v4', with: { name: 'dist', path: 'dist' } },
        { name: 'Start Preview Server', run: 'pnpm preview --port 4321 &', shell: 'bash' },
        { name: 'Wait for server', run: 'sleep 10' },
        { name: 'Run Axe-core Tests', run: 'pnpm exec playwright test e2e/a11y --reporter=junit --output=junit.xml' },
        { name: 'Upload A11y Report', uses: 'actions/upload-artifact@v4', with: { name: 'a11y-report', path: 'a11y-results', 'retention-days': 7 } },
      ],
    };
  }

  // 7. Lighthouse CI
  if (enabledJobs.lighthouse) {
    jobs.lighthouse = {
      name: 'Lighthouse CI',
      needs: ['build'],
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 20,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Download build artifact', uses: 'actions/download-artifact@v4', with: { name: 'dist', path: 'dist' } },
        { name: 'Start Preview Server', run: 'pnpm preview --port 4321 &', shell: 'bash' },
        { name: 'Wait for server', run: 'sleep 15' },
        { name: 'Run Lighthouse CI', uses: 'treosh/lighthouse-ci-action@v11', with: { 
          urls: config.lighthouse.urls.join(' '),
          budgetPath: './lighthouserc.json',
          uploadArtifacts: true,
        } },
        { name: 'Upload Lighthouse Report', uses: 'actions/upload-artifact@v4', with: { name: 'lighthouse-report', path: '.lighthouseci', 'retention-days': 7 } },
      ],
    };
  }

  // 8. Security Audit
  if (enabledJobs.security) {
    jobs.security = {
      name: 'Security Audit',
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 15,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Run npm audit', if: "contains(security.tools, 'npm-audit')", run: 'pnpm audit --audit-level=high' },
        { name: 'Run CodeQL Analysis', if: "contains(security.tools, 'codeql')", uses: 'github/codeql-action/init@v3', with: { languages: 'typescript', queries: 'security-extended' } },
        { name: 'Perform CodeQL Analysis', if: "contains(security.tools, 'codeql')", uses: 'github/codeql-action/analyze@v3' },
      ],
    };
  }

  // 9. Deploy Preview
  if (enabledJobs.deployPreview) {
    const deployNeeds = ['build'];
    if (enabledJobs.e2e) deployNeeds.push('e2e');
    if (enabledJobs.a11y) deployNeeds.push('a11y');
    if (enabledJobs.lighthouse) deployNeeds.push('lighthouse');
    if (enabledJobs.security) deployNeeds.push('security');
    
    jobs.deploy_preview = {
      name: 'Deploy Preview',
      needs: deployNeeds,
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 10,
      if: "github.event_name == 'pull_request' || github.event_name == 'workflow_dispatch'",
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Download build artifact', uses: 'actions/download-artifact@v4', with: { name: 'dist', path: 'dist' } },
        { name: 'Deploy to Vercel Preview', uses: 'amondnet/vercel-action@v25', with: {
          'vercel-token': config.secrets.vercelToken,
          'vercel-org-id': config.secrets.vercelOrgId,
          'vercel-project-id': config.secrets.vercelProjectId,
          'vercel-args': '--prod=false',
        } },
      ],
    };
  }

  // 10. Deploy Production
  if (enabledJobs.deployProduction) {
    jobs.deploy_production = {
      name: 'Deploy Production',
      needs: ['deploy_preview'],
      'runs-on': 'ubuntu-latest',
      'timeout-minutes': 10,
      if: "github.ref == 'refs/heads/main' && github.event_name == 'push'",
      environment: 'production',
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        { name: 'Setup pnpm', uses: 'pnpm/action-setup@v4', with: { version: config.pnpmVersion } },
        { name: 'Setup Node', uses: 'actions/setup-node@v4', with: { 'node-version': config.nodeVersion, cache: 'pnpm' } },
        { name: 'Install dependencies', run: 'pnpm install --frozen-lockfile' },
        { name: 'Download build artifact', uses: 'actions/download-artifact@v4', with: { name: 'dist', path: 'dist' } },
        { name: 'Deploy to Vercel Production', uses: 'amondnet/vercel-action@v25', with: {
          'vercel-token': config.secrets.vercelToken,
          'vercel-org-id': config.secrets.vercelOrgId,
          'vercel-project-id': config.secrets.vercelProjectId,
          'vercel-args': '--prod',
        } },
      ],
    };
  }

  return {
    name: `${config.projectName} CI/CD`,
    on: {
      push: { branches: [config.branches.main, config.branches.develop].filter(Boolean) },
      pull_request: { branches: [config.branches.main, config.branches.develop].filter(Boolean) },
      workflow_dispatch: {
        inputs: {
          deploy_target: {
            type: 'choice',
            description: 'Deployment target',
            options: ['preview', 'production'],
            required: false,
            default: 'preview',
          },
        },
      },
    },
    env: {
      NODE_VERSION: config.nodeVersion,
      PNPM_VERSION: config.pnpmVersion,
      ASTRO_TELEMETRY_DISABLED: '1',
      VERCEL_TOKEN: config.secrets.vercelToken,
      VERCEL_ORG_ID: config.secrets.vercelOrgId,
      VERCEL_PROJECT_ID: config.secrets.vercelProjectId,
      NETLIFY_AUTH_TOKEN: config.secrets.netlifyAuthToken || '',
      NETLIFY_SITE_ID: config.secrets.netlifySiteId || '',
      LHCI_GITHUB_APP_TOKEN: config.secrets.lighthouseToken || '',
      CODECOV_TOKEN: config.secrets.codecovToken || '',
    },
    permissions: {
      contents: 'read',
      pages: 'write',
      id_token: 'write',
      deployments: 'write',
      statuses: 'write',
      checks: 'write',
      pull_requests: 'write',
    },
    jobs,
  };
}