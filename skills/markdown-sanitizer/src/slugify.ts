/**
 * Utilitaires de slugification robustes
 * Compatible avec les exigences Astro (ASCII, unique, lowercase)
 */
import slugify from 'slugify';

// ──────────────────────────────────────────────
// Configuration par défaut
// ──────────────────────────────────────────────

export interface SlugifyOptions {
  /** Longueur max du slug */
  maxLength?: number;
  /** Séparateur */
  separator?: string;
  /** Supprimer les mots vides (stop words) */
  removeStopWords?: boolean;
  /** Liste personnalisée de mots vides */
  customStopWords?: string[];
  /** Autoriser les chiffres */
  allowNumbers?: boolean;
}

const DEFAULT_STOP_WORDS = [
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'dans', 'sur', 'au', 'aux',
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'en', 'con', 'por', 'para',
  'il', 'la', 'lo', 'le', 'gli', 'un', 'uno', 'una', 'e', 'o', 'ma', 'in', 'con', 'per', 'di',
  'der', 'die', 'das', 'den', 'ein', 'eine', 'und', 'oder', 'aber', 'in', 'auf', 'mit', 'von', 'zu',
  'de', 'het', 'een', 'en', 'of', 'voor', 'met', 'op', 'aan', 'van',
  'o', 'a', 'os', 'as', 'um', 'uma', 'e', 'ou', 'mas', 'em', 'com', 'por', 'para',
  'w', 'z', 'i', 'oraz', 'ale', 'lub', 'w', 'na', 'do', 'dla', 'od', 'przez',
  'ال', 'في', 'من', 'إلى', 'على', 'و', 'أو', 'لكن',
  'в', 'на', 'с', 'и', 'или', 'но', 'из', 'для', 'по', 'к',
  '在', '的', '和', '或', '但', '为', '以', '从', '到',
  'में', 'और', 'या', 'लेकिन', 'के', 'के लिए', 'से', 'को',
];

export function slugifyText(text: string, options: SlugifyOptions = {}): string {
  const {
    maxLength = 80,
    separator = '-',
    removeStopWords = false,
    customStopWords = [],
    allowNumbers = true,
  } = options;
  
  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Garder lettres, chiffres, espaces, tirets
    .replace(/\s+/g, ' ') // Normaliser espaces
    .trim();
  
  if (removeStopWords) {
    const stopWords = new Set([...DEFAULT_STOP_WORDS, ...customStopWords]);
    const words = slug.split(' ').filter(w => w && !stopWords.has(w));
    slug = words.join(' ');
  }
  
  if (!allowNumbers) {
    slug = slug.replace(/\d+/g, '');
  }
  
  slug = slugify(slug, { lower: true, strict: true, locale: 'en', trim: true });
  
  // Tronquer sans couper au milieu d'un mot
  if (slug.length > maxLength) {
    const truncated = slug.substring(0, maxLength);
    const lastSeparator = truncated.lastIndexOf(separator);
    slug = lastSeparator > maxLength * 0.7 ? truncated.substring(0, lastSeparator) : truncated;
  }
  
  return slug.replace(new RegExp(`${separator}+`, 'g'), separator).replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
}

/**
 * Génère un slug unique pour une traduction
 * Format: {baseSlug}-{lang} (ex: "entendre-voix-dieu-en")
 */
export function generateTranslationSlug(baseSlug: string, lang: string, isSourceLang: boolean = false): string {
  if (isSourceLang || lang === 'fr') {
    return baseSlug;
  }
  return `${baseSlug}-${lang}`;
}

/**
 * Valide qu'un slug respecte les contraintes Astro
 */
export function validateSlug(slug: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!slug) {
    errors.push('Slug vide');
    return { valid: false, errors };
  }
  
  if (slug.length > 100) {
    errors.push('Slug trop long (max 100 caractères)');
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug contient des caractères invalides (autorisé: a-z, 0-9, -)');
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('Slug ne doit pas commencer ou finir par un tiret');
  }
  
  if (slug.includes('--')) {
    errors.push('Slug contient des tirets doubles');
  }
  
  if (/^\d/.test(slug)) {
    errors.push('Slug ne doit pas commencer par un chiffre');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Extrait le slug de base depuis un slug de traduction
 * "entendre-voix-dieu-en" -> "entendre-voix-dieu"
 */
export function extractBaseSlug(translationSlug: string, knownBaseSlugs: string[] = []): string {
  // Essayer de matcher avec les slugs de base connus
  for (const base of knownBaseSlugs) {
    if (translationSlug === base || translationSlug.startsWith(`${base}-`)) {
      return base;
    }
  }
  
  // Fallback: retirer le suffixe de langue (2-3 lettres à la fin)
  const parts = translationSlug.split('-');
  const lastPart = parts[parts.length - 1];
  if (lastPart && (lastPart.length === 2 || lastPart.length === 3)) {
    // Probablement un code langue
    return parts.slice(0, -1).join('-');
  }
  
  return translationSlug;
}