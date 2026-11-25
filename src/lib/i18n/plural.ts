// src/lib/i18n/plural.ts
// Gestion pluriels CLDR + helpers pour messages ICU

import type { SupportedLocale } from './format';

// ──────────────────────────────────────────────
// Catégories pluriels CLDR
// ──────────────────────────────────────────────
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

// Règles simplifiées par locale (basées sur CLDR 43)
// Pour production : utiliser @formatjs/icu-plural-rules ou intl-pluralrules
const pluralRules: Record<SupportedLocale, (n: number) => PluralCategory> = {
  'fr-FR': n => (n === 0 || n === 1 ? 'one' : 'other'),
  'en-US': n => (n === 1 ? 'one' : 'other'),
  'es-ES': n => (n === 1 ? 'one' : 'other'),
  'pt-PT': n => (n === 1 ? 'one' : 'other'),
  'it-IT': n => (n === 1 ? 'one' : 'other'),
  'de-DE': n => (n === 1 ? 'one' : 'other'),
  'nl-NL': n => (n === 1 ? 'one' : 'other'),
  'pl-PL': n => {
    if (n === 1) return 'one';
    const mod10 = n % 10,
      mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'few';
    if (mod10 === 1 && mod100 !== 11) return 'one';
    return 'many'; // 0, 5-19, 100...
  },
  'ar-SA': n => {
    if (n === 0) return 'zero';
    if (n === 1) return 'one';
    if (n === 2) return 'two';
    const mod100 = n % 100;
    if (mod100 >= 3 && mod100 <= 10) return 'few';
    if (mod100 >= 11 && mod100 <= 99) return 'many';
    return 'other';
  },
  'zh-CN': () => 'other', // Chinois : pas de pluriel morphologique
  'hi-IN': n => (n === 1 ? 'one' : 'other'),
};

// ──────────────────────────────────────────────
// API publique
// ──────────────────────────────────────────────

/** Retourne la catégorie pluriel CLDR pour un nombre et une locale */
export function getPluralCategory(n: number, locale: SupportedLocale): PluralCategory {
  const rule = pluralRules[locale] || pluralRules['en-US'];
  return rule(n);
}

/** Sélectionne la bonne forme selon le nombre (style ICU simplifié) */
export function selectPlural<T>(
  count: number,
  forms: Partial<Record<PluralCategory, T>> & { other: T },
  locale: SupportedLocale
): T {
  const cat = getPluralCategory(count, locale);
  return forms[cat] ?? forms.other;
}

/** Helper pour messages ICU simples : {count, plural, one {# livre} other {# livres}} */
export function formatPluralMessage(
  count: number,
  message: string, // format ICU simplifié: "one {# item} other {# items}"
  locale: SupportedLocale
): string {
  const cat = getPluralCategory(count, locale);

  // Parse basique: "one {...} other {...}" → récupère la forme matching
  const regex = new RegExp(`(\\w+)\\s*\\{([^}]+)\\}`, 'g');
  const forms: Record<string, string> = {};
  let match;
  while ((match = regex.exec(message)) !== null) {
    forms[match[1]] = match[2].trim();
  }

  const template = forms[cat] || forms.other || message;
  return template.replace(/#/g, String(count));
}

/** Génère un message ICU complet pour inclusion dans JSON (format MessageFormat) */
export function createICUMessage(
  variable: string,
  branches: Record<PluralCategory, string>
): string {
  // Format: {variable, plural, zero {...} one {...} two {...} few {...} many {...} other {...}}
  const parts = ['zero', 'one', 'two', 'few', 'many', 'other']
    .filter(c => branches[c])
    .map(c => `${c} {${branches[c]}}`);
  return `{${variable}, plural, ${parts.join(' ')}}`;
}

// ──────────────────────────────────────────────
// Exemple d'utilisation dans translations JSON
// ──────────────────────────────────────────────
/*
{
  "blog": {
    "readingTime": "{count, plural, one {# minute de lecture} other {# minutes de lecture}}",
    "articlesCount": "{count, plural, one {# article} other {# articles}}",
    "commentsCount": "{count, plural, zero {Aucun commentaire} one {# commentaire} other {# commentaires}}"
  }
}
*/
