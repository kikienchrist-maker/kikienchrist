/**
 * Configuration par défaut pour Git Workflow
 */
import type { ConventionalCommitConfig, ChangelogConfig, ReleaseConfig, CommitType } from './types.js';

export const CONVENTIONAL_COMMIT_TYPES: CommitType[] = [
  { type: 'feat', section: '✨ Features', hidden: false },
  { type: 'fix', section: '🐛 Bug Fixes', hidden: false },
  { type: 'perf', section: '⚡ Performance', hidden: false },
  { type: 'refactor', section: '♻️ Refactoring', hidden: false },
  { type: 'docs', section: '📚 Documentation', hidden: false },
  { type: 'style', section: '💄 Styles', hidden: true },
  { type: 'test', section: '✅ Tests', hidden: true },
  { type: 'chore', section: '🔧 Chores', hidden: true },
  { type: 'build', section: '🏗️ Build', hidden: true },
  { type: 'ci', section: '🤖 CI', hidden: true },
  { type: 'revert', section: '⏪ Reverts', hidden: false },
];

export const DEFAULT_CONVENTIONAL_CONFIG: ConventionalCommitConfig = {
  types: CONVENTIONAL_COMMIT_TYPES,
  scopes: ['core', 'content', 'infra', 'utils', 'blog', 'legal', 'i18n', 'seo', 'a11y', 'pwa', 'decap', 'vercel', 'netlify', 'astro', 'design', 'deps', 'security', 'release'],
  allowBreakingChanges: true,
  subjectPattern: '^[a-z].*[^.]$',
  subjectMaxLength: 72,
};

export const DEFAULT_CHANGELOG_CONFIG: ChangelogConfig = {
  preset: 'conventionalcommits',
  outputFile: 'CHANGELOG.md',
  sameFile: true,
};

export const DEFAULT_RELEASE_CONFIG: ReleaseConfig = {
  branches: ['main', 'next', 'next-major', 'beta', 'alpha'],
  plugins: [
    { name: '@semantic-release/commit-analyzer', options: { preset: 'conventionalcommits' } },
    { name: '@semantic-release/release-notes-generator', options: { preset: 'conventionalcommits' } },
    { name: '@semantic-release/changelog', options: { changelogFile: 'CHANGELOG.md' } },
    { name: '@semantic-release/npm', options: { npmPublish: false } },
    { name: '@semantic-release/git', options: { assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'], message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}' } },
    { name: '@semantic-release/github', options: { assets: 'CHANGELOG.md' } },
  ],
  repositoryUrl: 'https://github.com/kikienchrist/kikienchrist-vercel-sync.git',
  tagFormat: 'v${version}',
};

export const COMMITLINT_CONFIG = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', CONVENTIONAL_COMMIT_TYPES.map(t => t.type)],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};

export const HUSKY_HOOKS = {
  'commit-msg': 'commitlint --edit $1',
  'pre-commit': 'lint-staged',
  'pre-push': 'npm run typecheck && npm run test',
  'prepare-commit-msg': 'exec < /dev/tty && git commit --edit -m "$(cat $1)" || true',
};

export const LINT_STAGED_CONFIG = {
  '*.{ts,tsx,js,jsx,json,md,css,html,astro}': ['prettier --write', 'eslint --fix'],
  '*.{ts,tsx}': ['tsc --noEmit'],
};

export function getCommitTypes(): CommitType[] {
  return CONVENTIONAL_COMMIT_TYPES;
}

export function getScopes(): string[] {
  return DEFAULT_CONVENTIONAL_CONFIG.scopes;
}