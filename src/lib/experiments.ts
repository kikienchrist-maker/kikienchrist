// A/B Experiment Definitions (shared between middleware & components)
// Single source of truth for experiment metadata

export interface ExperimentVariant {
  key: 'a' | 'b';
  label: string;
  description: string;
}

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  trafficPercent: number;
  variants: {
    a: ExperimentVariant;
    b: ExperimentVariant;
  };
  startDate?: string; // ISO date
  endDate?: string;
  primaryMetric: string; // GA4 event name
  segments?: string[]; // e.g., 'new-visitor', 'mobile', 'fr'
}

export const EXPERIMENTS: Record<string, ExperimentConfig> = {
  'hero-cta-v1': {
    id: 'hero-cta-v1',
    name: 'Hero CTA Button Text',
    description: 'Test different CTA copy on homepage hero',
    status: 'running',
    trafficPercent: 50,
    variants: {
      a: { key: 'a', label: 'Control', description: 'Découvrir les livres' },
      b: { key: 'b', label: 'Treatment', description: 'Commencer ma lecture' },
    },
    primaryMetric: 'cta_click',
    segments: ['fr', 'en'],
  },
  'book-price-display': {
    id: 'book-price-display',
    name: 'Book Price Display Format',
    description: 'Test showing promo price vs regular price prominently',
    status: 'running',
    trafficPercent: 30,
    variants: {
      a: { key: 'a', label: 'Control', description: 'Prix normal barré + promo' },
      b: { key: 'b', label: 'Treatment', description: 'Seulement prix promo en gros' },
    },
    primaryMetric: 'book_purchase_click',
    segments: ['fr', 'en', 'es'],
  },
  'newsletter-form-position': {
    id: 'newsletter-form-position',
    name: 'Newsletter Form Position',
    description: 'Test inline vs sidebar newsletter form on blog pages',
    status: 'running',
    trafficPercent: 40,
    variants: {
      a: { key: 'a', label: 'Control', description: 'Sidebar (current)' },
      b: { key: 'b', label: 'Treatment', description: 'Inline après premier article' },
    },
    primaryMetric: 'newsletter_signup',
    segments: ['fr', 'en'],
  },
};

// Helper to get variant config for a given experiment
export function getVariantConfig(experimentId: string, variantKey: 'a' | 'b'): ExperimentVariant {
  return (
    EXPERIMENTS[experimentId]?.variants[variantKey] || {
      key: variantKey,
      label: variantKey,
      description: '',
    }
  );
}

// Helper to check if experiment is active
export function isExperimentActive(experimentId: string): boolean {
  const exp = EXPERIMENTS[experimentId];
  if (!exp || exp.status !== 'running') return false;
  if (exp.startDate && new Date(exp.startDate) > new Date()) return false;
  if (exp.endDate && new Date(exp.endDate) < new Date()) return false;
  return true;
}
