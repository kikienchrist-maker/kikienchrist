/**
 * Utilitaires pour conventional commits
 */
/// <reference types="./types.d.ts" />
import { parseCommitMessage as parseRaw } from './parser.js';
import type { CommitMessage, ConventionalCommitConfig, CommitType } from './types.js';
import { DEFAULT_CONVENTIONAL_CONFIG, CONVENTIONAL_COMMIT_TYPES } from './config.js';

export function parseCommitMessage(message: string): CommitMessage {
  const parsed = parseRaw(message);
  
  return {
    type: parsed.type || '',
    scope: parsed.scope,
    subject: parsed.subject || '',
    body: parsed.notes?.map((n: any) => n.text).join('\n\n') || parsed.body || '',
    footer: parsed.footer?.map((f: any) => f.token).join('\n') || '',
    breaking: !!parsed.breaking,
    raw: message,
  };
}

export function formatCommitMessage(commit: Partial<CommitMessage> & { type: string; subject: string }): string {
  let message = `${commit.type}`;
  
  if (commit.scope) {
    message += `(${commit.scope})`;
  }
  
  if (commit.breaking) {
    message += '!';
  }
  
  message += `: ${commit.subject}`;
  
  if (commit.body) {
    message += `\n\n${commit.body}`;
  }
  
  if (commit.footer) {
    message += `\n\n${commit.footer}`;
  }
  
  return message;
}

export function validateCommitMessage(message: string, config: ConventionalCommitConfig = DEFAULT_CONVENTIONAL_CONFIG): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseCommitMessage(message);
  
  // Vérifier type
  const validTypes = config.types.map(t => t.type);
  if (!validTypes.includes(parsed.type)) {
    errors.push(`Type invalide: "${parsed.type}". Types valides: ${validTypes.join(', ')}`);
  }
  
  // Vérifier scope
  if (parsed.scope && !config.scopes.includes(parsed.scope)) {
    errors.push(`Scope invalide: "${parsed.scope}". Scopes valides: ${config.scopes.join(', ')}`);
  }
  
  // Vérifier subject
  if (!parsed.subject) {
    errors.push('Subject vide');
  } else {
    if (parsed.subject.length > config.subjectMaxLength) {
      errors.push(`Subject trop long (max ${config.subjectMaxLength} caractères): ${parsed.subject.length}`);
    }
    if (!config.subjectPattern) {
      // Pattern par défaut: commence par minuscule, ne finit pas par point
      if (!/^[a-z]/.test(parsed.subject)) {
        errors.push('Subject doit commencer par une minuscule');
      }
      if (/\.$/.test(parsed.subject)) {
        errors.push('Subject ne doit pas finir par un point');
      }
    }
  }
  
  // Vérifier breaking change
  if (parsed.breaking && !config.allowBreakingChanges) {
    errors.push('Breaking changes non autorisés');
  }
  
  return { valid: errors.length === 0, errors };
}

export function getCommitTypes(): CommitType[] {
  return CONVENTIONAL_COMMIT_TYPES;
}

export function getTypeSection(type: string): string {
  const typeInfo = CONVENTIONAL_COMMIT_TYPES.find(t => t.type === type);
  return typeInfo?.section || type;
}

export function isHiddenType(type: string): boolean {
  const typeInfo = CONVENTIONAL_COMMIT_TYPES.find(t => t.type === type);
  return typeInfo?.hidden ?? true;
}

export function generateCommitTemplate(): string {
  const types = CONVENTIONAL_COMMIT_TYPES.filter(t => !t.hidden).map(t => `${t.type}: ${t.section}`).join('\n');
  const scopes = DEFAULT_CONVENTIONAL_CONFIG.scopes.join(', ');
  
  return `# Types:
# ${types}
#
# Scopes: ${scopes}
#
# Format: <type>(<scope>): <subject>
# Exemple: feat(blog): ajout pagination articles
#          fix(i18n)!: correction middleware langues
#
# Body (optionnel): motivation et description
# Footer (optionnel): BREAKING CHANGE: description / Refs: #123
`;
}