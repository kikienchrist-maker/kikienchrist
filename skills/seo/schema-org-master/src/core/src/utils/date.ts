// utils/date.ts — Date/Time Formatting (schema-org-master)
// ISO 8601, Schema.org dates, durations

// ============================================================================
// ISO 8601 FORMATTING
// ============================================================================

/**
 * Formate une date en ISO 8601 complet (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param date Date object ou string parsable
 * @returns String ISO 8601 UTC
 */
export function toISO8601(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return d.toISOString();
}

/**
 * Formate une date en ISO 8601 date seulement (YYYY-MM-DD)
 */
export function toISODate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return d.toISOString().split('T')[0];
}

/**
 * Formate une date en ISO 8601 date-time local (YYYY-MM-DDTHH:mm:ss)
 * Sans timezone (pour Schema.org datePublished sans offset)
 */
export function toISODateTimeLocal(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Parse une date ISO 8601 vers Date object
 */
export function parseISO8601(dateStr: string): Date | null {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

// ============================================================================
// SCHEMA.ORG SPECIFIC FORMATS
// ============================================================================

/**
 * Formate pour Schema.org datePublished / dateModified
 * Recommandé: ISO 8601 complet avec timezone
 * @see https://schema.org/datePublished
 */
export function formatSchemaDate(date: Date | string | number): string {
  return toISO8601(date);
}

/**
 * Formate pour Schema.org startDate / endDate (Event)
 * Format: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
 */
export function formatSchemaEventDate(date: Date | string | number, includeTime = false): string {
  return includeTime ? toISODateTimeLocal(date) : toISODate(date);
}

/**
 * Formate pour Schema.org uploadDate (VideoObject)
 */
export function formatSchemaUploadDate(date: Date | string | number): string {
  return toISO8601(date);
}

/**
 * Formate pour Schema.org validFrom / priceValidUntil (Offer)
 */
export function formatSchemaOfferDate(date: Date | string | number): string {
  return toISODate(date);
}

// ============================================================================
// DURATION — ISO 8601 Duration (PT1H30M, P1Y2M, etc.)
// ============================================================================

export interface DurationParts {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * Convertit parties de durée vers string ISO 8601 (PnYnMnDTnHnMnS)
 * @example formatDuration({ hours: 1, minutes: 30 }) → "PT1H30M"
 * @example formatDuration({ days: 3 }) → "P3D"
 */
export function formatDuration(parts: DurationParts): string {
  const dateParts: string[] = [];
  const timeParts: string[] = [];

  if (parts.years) dateParts.push(`${parts.years}Y`);
  if (parts.months) dateParts.push(`${parts.months}M`);
  if (parts.days) dateParts.push(`${parts.days}D`);

  if (parts.hours) timeParts.push(`${parts.hours}H`);
  if (parts.minutes) timeParts.push(`${parts.minutes}M`);
  if (parts.seconds) timeParts.push(`${parts.seconds}S`);

  let result = 'P';
  if (dateParts.length > 0) {
    result += dateParts.join('');
  }
  if (timeParts.length > 0) {
    result += 'T' + timeParts.join('');
  }
  // Edge case: P only (durée nulle) → PT0S
  if (result === 'P') result = 'PT0S';

  return result;
}

/**
 * Parse ISO 8601 duration vers parties
 * @example parseDuration("PT1H30M") → { hours: 1, minutes: 30 }
 */
export function parseDuration(duration: string): DurationParts {
  const result: DurationParts = {};

  // Regex pour PnYnMnDTnHnMnS
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const match = duration.match(regex);

  if (!match) return result;

  const [, years, months, days, hours, minutes, seconds] = match;
  if (years) result.years = parseInt(years, 10);
  if (months) result.months = parseInt(months, 10);
  if (days) result.days = parseInt(days, 10);
  if (hours) result.hours = parseInt(hours, 10);
  if (minutes) result.minutes = parseInt(minutes, 10);
  if (seconds) result.seconds = parseInt(seconds, 10);

  return result;
}

/**
 * Formate durée lisible (ex: "1h 30min", "3 jours")
 */
export function formatDurationHuman(parts: DurationParts, locale = 'fr-FR'): string {
  const parts_: string[] = [];

  if (parts.years) parts_.push(`${parts.years} an${parts.years > 1 ? 's' : ''}`);
  if (parts.months) parts_.push(`${parts.months} mois`);
  if (parts.days) parts_.push(`${parts.days} jour${parts.days > 1 ? 's' : ''}`);
  if (parts.hours) parts_.push(`${parts.hours}h`);
  if (parts.minutes) parts_.push(`${parts.minutes}min`);
  if (parts.seconds) parts_.push(`${parts.seconds}s`);

  return parts_.join(' ') || '0s';
}

// ============================================================================
// RELATIVE TIME — "il y a 2 jours", "dans 3 heures"
// ============================================================================

/**
 * Formate temps relatif (FR par défaut)
 */
export function formatRelativeTime(
  from: Date | string | number,
  to: Date | string | number = new Date(),
  locale = 'fr-FR'
): string {
  const fromDate = from instanceof Date ? from : new Date(from);
  const toDate = to instanceof Date ? to : new Date(to);

  const diffMs = toDate.getTime() - fromDate.getTime();
  const diffSec = Math.abs(Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const isPast = diffMs > 0;

  if (diffSec < 60) {
    return isPast ? 'à l\'instant' : 'dans quelques secondes';
  }
  if (diffMin < 60) {
    return isPast ? `il y a ${diffMin} min` : `dans ${diffMin} min`;
  }
  if (diffHour < 24) {
    return isPast ? `il y a ${diffHour}h` : `dans ${diffHour}h`;
  }
  if (diffDay < 30) {
    return isPast ? `il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}` : `dans ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
  }
  if (diffMonth < 12) {
    return isPast ? `il y a ${diffMonth} mois` : `dans ${diffMonth} mois`;
  }
  return isPast ? `il y a ${diffYear} an${diffYear > 1 ? 's' : ''}` : `dans ${diffYear} an${diffYear > 1 ? 's' : ''}`;
}

// ============================================================================
// READING TIME — Temps de lecture estimé
// ============================================================================

/**
 * Calcule temps de lecture estimé (mots par minute)
 * @param text Texte à analyser
 * @param wordsPerMinute Mots par minute (défaut: 200)
 * @returns Minutes arrondies au supérieur
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Formate temps de lecture pour Schema.org timeRequired
 * @returns Durée ISO 8601 (ex: "PT5M")
 */
export function formatReadingTimeForSchema(text: string, wordsPerMinute = 200): string {
  const minutes = calculateReadingTime(text, wordsPerMinute);
  return formatDuration({ minutes });
}