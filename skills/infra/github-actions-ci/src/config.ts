/**
 * Configuration par défaut pour GitHub Actions CI/CD
 */
import type { GHACIConfig } from './types.js';

export const DEFAULT_GHA_CONFIG: GHACIConfig = {
  projectName: 'kikienchrist',
  nodeVersion: '20',
  pnpmVersion: '9',
  astroVersion: '4.16',
  branches: {
    main: 'main',
    develop: 'develop',
    feature: 'feature/*',
  },
  jobs: {
    lint: true,
    typecheck: true,
    unit: true,
    build: true,
    e2e: true,
    a11y: true,
    lighthouse: true,
    security: true,
    deployPreview: true,
    deployProduction: true,
  },
  secrets: {
    vercelToken: '${{ secrets.VERCEL_TOKEN }}',
    vercelOrgId: '${{ secrets.VERCEL_ORG_ID }}',
    vercelProjectId: '${{ secrets.VERCEL_PROJECT_ID }}',
  },
  vercel: {
    enabled: true,
    projectId: '${{ secrets.VERCEL_PROJECT_ID }}',
    orgId: '${{ secrets.VERCEL_ORG_ID }}',
    previewDomain: 'kikienchrist.vercel.app',
    productionDomain: 'kikienchrist.vercel.app',
  },
  lighthouse: {
    enabled: true,
    budgets: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 90,
    },
    urls: [
      '/',
      '/fr/',
      '/fr/blog/',
      '/fr/mentions-legales/',
      '/fr/confidentialite/',
    ],
  },
  playwright: {
    enabled: true,
    browsers: ['chromium', 'firefox', 'webkit'],
    baseUrl: 'http://localhost:4321',
    testDir: 'e2e',
    retries: 2,
    timeout: 60000,
    projects: [
      { name: 'Desktop Chrome', use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } } },
      { name: 'Desktop Firefox', use: { browserName: 'firefox', viewport: { width: 1280, height: 720 } } },
      { name: 'Desktop Safari', use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } } },
      { name: 'Mobile Chrome', use: { browserName: 'chromium', viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true } },
      { name: 'Mobile Safari', use: { browserName: 'webkit', viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true } },
    ],
  },
  accessibility: {
    enabled: true,
    tool: 'axe-core',
    wcagLevel: 'AA',
    thresholds: {
      critical: 0,
      serious: 0,
      moderate: 5,
      minor: 10,
    },
    urls: [
      '/',
      '/fr/',
      '/fr/blog/',
      '/fr/mentions-legales/',
    ],
  },
  security: {
    enabled: true,
    tools: ['npm-audit', 'codeql'],
    severityThreshold: 'high',
    failOnVulnerabilities: true,
  },
};

function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
        targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }
  return result;
}

export function mergeConfig(userConfig: Partial<GHACIConfig>): GHACIConfig {
  return deepMerge(DEFAULT_GHA_CONFIG, userConfig) as GHACIConfig;
}