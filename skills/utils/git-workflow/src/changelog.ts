/**
 * Génération de changelog automatique
 */
/// <reference types="./types.d.ts" />
import { generateChangelogRaw } from './changelog-wrapper.js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { ChangelogConfig, CommitMessage } from './types.js';
import { DEFAULT_CHANGELOG_CONFIG } from './config.js';

export interface ChangelogOptions {
  preset?: string;
  outputFile?: string;
  sameFile?: boolean;
  from?: string;
  to?: string;
  context?: Record<string, any>;
  commitPartial?: string;
  releaseCount?: number;
}

export async function generateChangelog(options: ChangelogOptions = {}): Promise<string> {
  const config = { ...DEFAULT_CHANGELOG_CONFIG, ...options };
  
  const changelog = await generateChangelogRaw({
    preset: config.preset,
    releaseCount: options.releaseCount,
    from: options.from,
    to: options.to,
    context: config.context,
    commitPartial: config.commitPartial,
    lernaPackages: false,
  });
  
  return changelog;
}

export async function writeChangelog(changelog: string, outputFile: string = 'CHANGELOG.md', sameFile: boolean = true): Promise<void> {
  let finalContent = changelog;
  
  if (sameFile && existsSync(outputFile)) {
    const existing = readFileSync(outputFile, 'utf-8');
    // Insérer après le premier titre # Changelog
    const lines = existing.split('\n');
    const headerIndex = lines.findIndex(l => l.startsWith('# '));
    if (headerIndex >= 0) {
      finalContent = lines.slice(0, headerIndex + 1).join('\n') + '\n\n' + changelog + '\n\n' + lines.slice(headerIndex + 1).join('\n');
    } else {
      finalContent = '# Changelog\n\n' + changelog + '\n\n' + existing;
    }
  }
  
  writeFileSync(outputFile, finalContent, 'utf-8');
}

export async function updateChangelog(options: ChangelogOptions = {}): Promise<string> {
  const changelog = await generateChangelog(options);
  await writeChangelog(changelog, options.outputFile || 'CHANGELOG.md', options.sameFile ?? true);
  return changelog;
}

export function generateChangelogFromCommits(commits: CommitMessage[], version: string, date: string = new Date().toISOString().split('T')[0]): string {
  const sections: Record<string, CommitMessage[]> = {};
  
  for (const commit of commits) {
    const section = getSectionForType(commit.type);
    if (!sections[section]) sections[section] = [];
    sections[section].push(commit);
  }
  
  let changelog = `## [${version}] - ${date}\n\n`;
  
  const sectionOrder = ['✨ Features', '🐛 Bug Fixes', '⚡ Performance', '♻️ Refactoring', '📚 Documentation', '⏪ Reverts', '🔧 Chores', '🏗️ Build', '🤖 CI'];
  
  for (const section of sectionOrder) {
    if (sections[section] && sections[section].length > 0) {
      changelog += `### ${section}\n\n`;
      for (const commit of sections[section]) {
        const scope = commit.scope ? `(${commit.scope})` : '';
        const breaking = commit.breaking ? ' **BREAKING**' : '';
        changelog += `- ${commit.type}${scope}: ${commit.subject}${breaking}\n`;
        if (commit.body) {
          changelog += `  ${commit.body.replace(/\n/g, '\n  ')}\n`;
        }
      }
      changelog += '\n';
    }
  }
  
  return changelog;
}

function getSectionForType(type: string): string {
  const typeMap: Record<string, string> = {
    feat: '✨ Features',
    fix: '🐛 Bug Fixes',
    perf: '⚡ Performance',
    refactor: '♻️ Refactoring',
    docs: '📚 Documentation',
    revert: '⏪ Reverts',
    chore: '🔧 Chores',
    build: '🏗️ Build',
    ci: '🤖 CI',
    style: '💄 Styles',
    test: '✅ Tests',
  };
  return typeMap[type] || type;
}