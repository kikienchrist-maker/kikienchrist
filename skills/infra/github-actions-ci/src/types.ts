/**
 * Types pour GitHub Actions CI/CD
 */

export interface GHACIConfig {
  projectName: string;
  nodeVersion: string;
  pnpmVersion: string;
  astroVersion: string;
  branches: {
    main: string;
    develop?: string;
    feature?: string;
  };
  jobs: JobConfig;
  secrets: SecretConfig;
  vercel: VercelConfig;
  netlify?: NetlifyConfig;
  lighthouse: LighthouseConfig;
  playwright: PlaywrightConfig;
  accessibility: AccessibilityConfig;
  security: SecurityConfig;
}

export interface JobConfig {
  lint: boolean;
  typecheck: boolean;
  unit: boolean;
  build: boolean;
  e2e: boolean;
  a11y: boolean;
  lighthouse: boolean;
  security: boolean;
  deployPreview: boolean;
  deployProduction: boolean;
}

export interface SecretConfig {
  vercelToken: string;
  vercelOrgId: string;
  vercelProjectId: string;
  netlifyAuthToken?: string;
  netlifySiteId?: string;
  lighthouseToken?: string;
  codecovToken?: string;
  npmToken?: string;
}

export interface VercelConfig {
  enabled: boolean;
  projectId: string;
  orgId: string;
  previewDomain?: string;
  productionDomain?: string;
  aliasDomains?: string[];
}

export interface NetlifyConfig {
  enabled: boolean;
  siteId: string;
  authToken: string;
}

export interface LighthouseConfig {
  enabled: boolean;
  budgets: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  urls: string[];
  ciToken?: string;
}

export interface PlaywrightConfig {
  enabled: boolean;
  browsers: ('chromium' | 'firefox' | 'webkit')[];
  baseUrl: string;
  testDir: string;
  retries: number;
  timeout: number;
  projects?: PlaywrightProject[];
}

export interface PlaywrightProject {
  name: string;
  use: {
    browserName: 'chromium' | 'firefox' | 'webkit';
    viewport?: { width: number; height: number };
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
  };
}

export interface AccessibilityConfig {
  enabled: boolean;
  tool: 'axe-core' | 'pa11y' | 'lighthouse';
  wcagLevel: 'A' | 'AA' | 'AAA';
  thresholds: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  urls: string[];
}

export interface SecurityConfig {
  enabled: boolean;
  tools: ('npm-audit' | 'snyk' | 'trivy' | 'codeql')[];
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  failOnVulnerabilities: boolean;
}

export interface WorkflowOutput {
  workflowYml: string;
  filesGenerated: string[];
}

export interface GeneratorOptions {
  outputDir: string;
  config: Partial<GHACIConfig>;
  dryRun?: boolean;
}