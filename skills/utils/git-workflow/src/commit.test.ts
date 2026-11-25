/**
 * Tests pour commit.ts
 */
import { describe, it, expect } from 'vitest';
import { parseCommitMessage, validateCommitMessage, formatCommitMessage, getCommitTypes, getTypeSection, isHiddenType } from './commit.js';

describe('commit', () => {
  describe('parseCommitMessage', () => {
    it('parse commit simple', () => {
      const result = parseCommitMessage('feat(blog): ajout pagination');
      expect(result.type).toBe('feat');
      expect(result.scope).toBe('blog');
      expect(result.subject).toBe('ajout pagination');
      expect(result.breaking).toBe(false);
    });

    it('parse commit avec breaking', () => {
      const result = parseCommitMessage('fix(i18n)!: correction middleware');
      expect(result.type).toBe('fix');
      expect(result.scope).toBe('i18n');
      expect(result.breaking).toBe(true);
    });

    it('parse commit sans scope', () => {
      const result = parseCommitMessage('docs: mise à jour readme');
      expect(result.type).toBe('docs');
      expect(result.scope).toBeNull();
      expect(result.subject).toBe('mise à jour readme');
    });
  });

  describe('validateCommitMessage', () => {
    it('valide commit correct', () => {
      const result = validateCommitMessage('feat(blog): ajout pagination');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejette type invalide', () => {
      const result = validateCommitMessage('invalid(scope): sujet');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Type invalide'))).toBe(true);
    });

    it('rejette scope invalide', () => {
      const result = validateCommitMessage('feat(invalide): sujet');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Scope invalide'))).toBe(true);
    });

    it('rejette subject vide', () => {
      const result = validateCommitMessage('feat(): ');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Subject vide'))).toBe(true);
    });

    it('rejette subject trop long', () => {
      const longSubject = 'a'.repeat(80);
      const result = validateCommitMessage(`feat: ${longSubject}`);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('trop long'))).toBe(true);
    });

    it('accepte subject majuscule (sentence-case)', () => {
      const result = validateCommitMessage('feat: Subject avec majuscule');
      // sentence-case autorise majuscule au début
      expect(result.valid).toBe(true);
    });

    it('accepte subject avec point final', () => {
      const result = validateCommitMessage('feat: sujet avec point.');
      // Le pattern par défaut n'interdit pas le point final
      expect(result.valid).toBe(true);
    });
  });

  describe('formatCommitMessage', () => {
    it('formate commit simple', () => {
      const result = formatCommitMessage({ type: 'feat', scope: 'blog', subject: 'ajout pagination' });
      expect(result).toBe('feat(blog): ajout pagination');
    });

    it('formate commit breaking', () => {
      const result = formatCommitMessage({ type: 'fix', scope: 'i18n', subject: 'correction', breaking: true });
      expect(result).toBe('fix(i18n)!: correction');
    });

    it('formate commit avec body', () => {
      const result = formatCommitMessage({ 
        type: 'feat', 
        subject: 'nouveau', 
        body: 'Description détaillée' 
      });
      expect(result).toContain('feat: nouveau');
      expect(result).toContain('Description détaillée');
    });
  });

  describe('getCommitTypes', () => {
    it('retourne types standards', () => {
      const types = getCommitTypes();
      expect(types.some(t => t.type === 'feat')).toBe(true);
      expect(types.some(t => t.type === 'fix')).toBe(true);
      expect(types.some(t => t.type === 'docs')).toBe(true);
    });
  });

  describe('getTypeSection', () => {
    it('retourne section pour type connu', () => {
      expect(getTypeSection('feat')).toBe('✨ Features');
      expect(getTypeSection('fix')).toBe('🐛 Bug Fixes');
    });
  });

  describe('isHiddenType', () => {
    it('identifie types cachés', () => {
      expect(isHiddenType('style')).toBe(true);
      expect(isHiddenType('test')).toBe(true);
      expect(isHiddenType('chore')).toBe(true);
      expect(isHiddenType('feat')).toBe(false);
      expect(isHiddenType('fix')).toBe(false);
    });
  });
});