/**
 * Génération de hooks Husky et configs lint-staged
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { COMMITLINT_CONFIG, HUSKY_HOOKS, LINT_STAGED_CONFIG } from './config.js';

export function generateHuskyHooks(hooksDir: string = '.husky'): void {
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir, { recursive: true });
  }
  
  // commit-msg
  writeFileSync(
    join(hooksDir, 'commit-msg'),
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${HUSKY_HOOKS['commit-msg']}
`,
    'utf-8'
  );
  
  // pre-commit
  writeFileSync(
    join(hooksDir, 'pre-commit'),
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${HUSKY_HOOKS['pre-commit']}
`,
    'utf-8'
  );
  
  // pre-push
  writeFileSync(
    join(hooksDir, 'pre-push'),
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${HUSKY_HOOKS['pre-push']}
`,
    'utf-8'
  );
  
  // prepare-commit-msg
  writeFileSync(
    join(hooksDir, 'prepare-commit-msg'),
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${HUSKY_HOOKS['prepare-commit-msg']}
`,
    'utf-8'
  );
}

export function generateCommitlintConfig(outputPath: string = 'commitlint.config.js'): void {
  const config = `module.exports = ${JSON.stringify(COMMITLINT_CONFIG, null, 2)};`;
  writeFileSync(outputPath, config, 'utf-8');
}

export function generateLintStagedConfig(outputPath: string = '.lintstagedrc.json'): void {
  writeFileSync(outputPath, JSON.stringify(LINT_STAGED_CONFIG, null, 2), 'utf-8');
}

export function generatePackageJsonScripts(packageJsonPath: string = 'package.json'): void {
  if (!existsSync(packageJsonPath)) return;
  
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  pkg.scripts = {
    ...pkg.scripts,
    'prepare': 'husky install',
    'commitlint': 'commitlint --edit',
    'lint-staged': 'lint-staged',
    'changelog': 'conventional-changelog -p conventionalcommits -i CHANGELOG.md -s',
    'release': 'semantic-release',
    'release:dry': 'semantic-release --dry-run',
  };
  
  pkg.devDependencies = {
    ...pkg.devDependencies,
    '@commitlint/cli': '^19.0.0',
    '@commitlint/config-conventional': '^19.0.0',
    'husky': '^9.0.0',
    'lint-staged': '^15.0.0',
    'semantic-release': '^24.0.0',
    '@semantic-release/changelog': '^6.0.0',
    '@semantic-release/git': '^10.0.0',
    '@semantic-release/github': '^10.0.0',
    '@semantic-release/npm': '^12.0.0',
    '@semantic-release/release-notes-generator': '^6.0.0',
    'conventional-changelog-cli': '^5.0.0',
  };
  
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf-8');
}

export function setupGitWorkflow(projectRoot: string = '.'): void {
  generateHuskyHooks(join(projectRoot, '.husky'));
  generateCommitlintConfig(join(projectRoot, 'commitlint.config.js'));
  generateLintStagedConfig(join(projectRoot, '.lintstagedrc.json'));
  generatePackageJsonScripts(join(projectRoot, 'package.json'));
  
  console.log('Git workflow configuré:');
  console.log('  - .husky/ hooks créés');
  console.log('  - commitlint.config.js créé');
  console.log('  - .lintstagedrc.json créé');
  console.log('  - package.json mis à jour avec scripts');
}