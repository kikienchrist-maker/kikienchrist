# Git Workflow Skill

Utilitaires complets pour workflow Git professionnel :
- **Conventional Commits** : Parsing, validation, formatage
- **Changelog Auto** : Génération depuis commits (conventional-changelog)
- **Semantic Release** : Versionning automatique, publication
- **Husky Hooks** : commit-msg, pre-commit, pre-push, prepare-commit-msg
- **Commitlint** : Validation messages au commit
- **Lint-staged** : Lint uniquement fichiers modifiés

## Installation

```bash
cd skills/utils/git-workflow
npm install
npm run build
```

## Usage CLI

```bash
# Valider un message de commit
git-workflow commit validate "feat(blog): ajout pagination"

# Formater un message
git-workflow commit format --type feat --scope blog --subject "ajout pagination" --breaking

# Template de commit
git-workflow commit template

# Lister types valides
git-workflow commit types

# Générer CHANGELOG.md
git-workflow changelog --write --from v1.0.0 --to HEAD

# Analyser commits pour version bump
git-workflow analyze v1.0.0..HEAD

# Lancer semantic-release
git-workflow release --dry-run
git-workflow release --branch main

# Gestion version
git-workflow version --show
git-workflow version --bump minor
git-workflow version --set 2.0.0

# Configurer hooks Husky + commitlint + lint-staged
git-workflow setup

# Générer configs individuellement
git-workflow config --all
git-workflow config --commitlint --lintstaged --husky --releaserc
```

## Configuration Projet

### 1. Setup complet (recommandé)
```bash
git-workflow setup
npm install
npm run prepare
```

Cela crée :
- `.husky/` : hooks commit-msg, pre-commit, pre-push, prepare-commit-msg
- `commitlint.config.js` : Règles conventional commits
- `.lintstagedrc.json` : Config lint-staged
- `package.json` : Scripts + devDependencies ajoutés

### 2. Commitlint Config
```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'perf', 'refactor', 'docs', 'style', 'test', 'chore', 'build', 'ci', 'revert']],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 72],
  },
};
```

### 3. Semantic Release Config (`.releaserc.json`)
```json
{
  "branches": ["main", "next", "beta", "alpha"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { "changelogFile": "CHANGELOG.md" }],
    ["@semantic-release/git", { "assets": ["CHANGELOG.md", "package.json"], "message": "chore(release): ${nextRelease.version}" }],
    "@semantic-release/github"
  ]
}
```

## Types de Commit Valides

| Type | Section | Visible | Usage |
|------|---------|---------|-------|
| `feat` | ✨ Features | Oui | Nouvelle fonctionnalité |
| `fix` | 🐛 Bug Fixes | Oui | Correction bug |
| `perf` | ⚡ Performance | Oui | Amélioration perf |
| `refactor` | ♻️ Refactoring | Oui | Refactor sans changement comportement |
| `docs` | 📚 Documentation | Oui | Documentation seulement |
| `revert` | ⏪ Reverts | Oui | Annulation commit |
| `style` | 💄 Styles | Non | Formatage, point-virgules |
| `test` | ✅ Tests | Non | Ajout/modif tests |
| `chore` | 🔧 Chores | Non | Maintenance, deps |
| `build` | 🏗️ Build | Non | Build system, deps |
| `ci` | 🤖 CI | Non | Config CI/CD |

## Scopes Recommandés

`core`, `content`, `infra`, `utils`, `blog`, `legal`, `i18n`, `seo`, `a11y`, `pwa`, `decap`, `vercel`, `netlify`, `astro`, `design`, `deps`, `security`, `release`

## Format Commit

```
<type>(<scope>): <subject>

<body>

<footer>
```

Exemples :
```
feat(blog): ajout pagination articles
fix(i18n)!: correction middleware langues

BREAKING CHANGE: middleware renommé
Refs: #123
```

## Version Bump Rules

| Commit Type | Bump |
|-------------|------|
| `BREAKING CHANGE` ou `!` | **major** |
| `feat` | **minor** |
| `fix`, `perf`, `refactor` | **patch** |
| `docs`, `style`, `test`, `chore`, `build`, `ci` | **none** |

## GitHub Actions pour Release

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Tests

```bash
npm test
```

## API Programmable

```typescript
import { 
  parseCommitMessage, 
  validateCommitMessage, 
  generateChangelog, 
  runSemanticRelease,
  setupGitWorkflow 
} from '@kikienchrist/git-workflow';

// Validation commit
const result = validateCommitMessage('feat(blog): ajout pagination');
if (!result.valid) console.error(result.errors);

// Changelog
const changelog = await generateChangelog({ from: 'v1.0.0', to: 'HEAD' });

// Release
const result = await runSemanticRelease({ dryRun: true });

// Setup projet
setupGitWorkflow('.');
```