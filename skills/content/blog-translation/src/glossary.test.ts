import { describe, it, expect } from 'vitest';
import { getFlatGlossary, getGlossaryForContext, isGlossaryTerm, getGlossaryTranslation, GLOSSARY } from './glossary.js';

describe('glossary', () => {
  it('has all categories', () => {
    expect(Object.keys(GLOSSARY)).toEqual(
      expect.arrayContaining(['names', 'bible_books', 'theology', 'bible_refs', 'ui'])
    );
  });

  it('getFlatGlossary merges all categories', () => {
    const flat = getFlatGlossary();
    expect(flat['Jésus']).toBe('Jésus');
    expect(flat['Genèse']).toBe('Genèse');
    expect(flat['salut']).toBe('salut');
    expect(flat['Jean 3:16']).toBe('Jean 3:16');
    expect(flat['Accueil']).toBe('Accueil');
    expect(Object.keys(flat).length).toBeGreaterThan(150);
  });

  it('getGlossaryForContext returns correct category', () => {
    const names = getGlossaryForContext('names');
    expect(names['Jésus']).toBe('Jésus');
    expect(names['Dieu']).toBe('Dieu');
    
    const theology = getGlossaryForContext('theology');
    expect(theology['salut']).toBe('salut');
    expect(theology['trinité']).toBe('trinité');
  });

  it('isGlossaryTerm detects known terms', () => {
    expect(isGlossaryTerm('Jésus')).toBe(true);
    expect(isGlossaryTerm('salut')).toBe(true);
    expect(isGlossaryTerm('Jean 3:16')).toBe(true);
    expect(isGlossaryTerm('terme_inconnu_xyz')).toBe(false);
  });

  it('getGlossaryTranslation returns correct mapping', () => {
    expect(getGlossaryTranslation('Jésus')).toBe('Jésus');
    expect(getGlossaryTranslation('salut')).toBe('salut');
    expect(getGlossaryTranslation('inconnu')).toBeUndefined();
  });
});