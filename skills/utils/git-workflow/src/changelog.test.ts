/**
 * Tests pour changelog.ts
 */
import { describe, it, expect } from 'vitest';
import { generateChangelogFromCommits } from './changelog.js';
import { parseCommitMessage } from './commit.js';

describe('changelog', () => {
  describe('generateChangelogFromCommits', () => {
    it('génère changelog groupé par section', () => {
      const commits = [
        parseCommitMessage('feat(blog): ajout pagination'),
        parseCommitMessage('feat(i18n): support arabe'),
        parseCommitMessage('fix(seo): meta description manquante'),
        parseCommitMessage('fix(a11y): contraste boutons'),
        parseCommitMessage('docs(readme): mise à jour installation'),
        parseCommitMessage('chore(deps): mise à jour dépendances'),
      ];
      
      const changelog = generateChangelogFromCommits(commits, '1.2.0', '2024-01-15');
      
      expect(changelog).toContain('## [1.2.0] - 2024-01-15');
      expect(changelog).toContain('### ✨ Features');
      expect(changelog).toContain('### 🐛 Bug Fixes');
      expect(changelog).toContain('### 📚 Documentation');
      expect(changelog).toContain('### 🔧 Chores');
      expect(changelog).toContain('feat(blog): ajout pagination');
      expect(changelog).toContain('fix(seo): meta description manquante');
    });

    it('gère breaking changes', () => {
      const commits = [
        parseCommitMessage('fix(api)!: changement signature'),
      ];
      
      const changelog = generateChangelogFromCommits(commits, '2.0.0', '2024-01-15');
      expect(changelog).toContain('**BREAKING**');
    });

    it('gère commits sans scope', () => {
      const commits = [
        parseCommitMessage('feat: fonctionnalité globale'),
      ];
      
      const changelog = generateChangelogFromCommits(commits, '1.1.0', '2024-01-15');
      expect(changelog).toContain('feat: fonctionnalité globale');
      expect(changelog).not.toContain('()');
    });
  });
});