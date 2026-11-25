// A/B Testing GA4 Tracking Helper
// Pushes experiment events to dataLayer for GA4 + Consent Mode v2

interface ABEventData {
  experiment_id: string;
  variant: 'a' | 'b';
  user_id?: string;
  page_path: string;
  timestamp: number;
}

declare global {
  interface Window {
    dataLayer: any[];
    __AB_VARIANTS__: Record<string, 'a' | 'b'>;
    gtag: (...args: any[]) => void;
  }
}

// Initialize dataLayer if not exists
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.__AB_VARIANTS__ = window.__AB_VARIANTS__ || {};
}

/**
 * Track experiment assignment (called once per experiment per session)
 */
export function trackExperimentAssignment(
  experimentId: string,
  variant: 'a' | 'b',
  userId?: string
): void {
  if (typeof window === 'undefined') return;

  const eventData: ABEventData = {
    experiment_id: experimentId,
    variant,
    user_id: userId,
    page_path: window.location.pathname,
    timestamp: Date.now(),
  };

  // Push to GA4 dataLayer
  window.dataLayer.push({
    event: 'ab_experiment',
    ...eventData,
  });

  // Also send as custom event for other analytics
  window.dispatchEvent(new CustomEvent('ab:experiment', { detail: eventData }));

  // Store in sessionStorage to avoid duplicate tracking
  const storageKey = `ab_tracked_${experimentId}`;
  if (!sessionStorage.getItem(storageKey)) {
    sessionStorage.setItem(storageKey, variant);
  }
}

/**
 * Track conversion event for experiment
 */
export function trackExperimentConversion(
  experimentId: string,
  conversionEvent: string,
  value?: number
): void {
  if (typeof window === 'undefined') return;

  const variant = window.__AB_VARIANTS__?.[experimentId];
  if (!variant) return; // User not in experiment

  window.dataLayer.push({
    event: conversionEvent,
    experiment_id: experimentId,
    variant,
    value,
    page_path: window.location.pathname,
    timestamp: Date.now(),
  });
}

/**
 * Auto-track all active experiments on page load
 * Call this in a layout/component that runs on every page
 */
export function trackActiveExperiments(): void {
  if (typeof window === 'undefined') return;

  const variants = window.__AB_VARIANTS__;
  if (!variants) return;

  for (const [experimentId, variant] of Object.entries(variants)) {
    const storageKey = `ab_tracked_${experimentId}`;
    if (!sessionStorage.getItem(storageKey)) {
      trackExperimentAssignment(experimentId, variant);
    }
  }
}

// Expose globally for inline script in MainLayout
if (typeof window !== 'undefined') {
  (window as any).trackActiveExperiments = trackActiveExperiments;
}

/**
 * Get current variant for an experiment (client-side)
 */
export function getVariant(experimentId: string): 'a' | 'b' | null {
  if (typeof window === 'undefined') return null;
  return window.__AB_VARIANTS__?.[experimentId] || null;
}

/**
 * Check if user is in experiment (assigned to treatment)
 */
export function isInTreatment(experimentId: string): boolean {
  return getVariant(experimentId) === 'b';
}
