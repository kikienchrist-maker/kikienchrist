/**
 * GA4 Analytics Module - Kiki en Christ
 * Respecte le consentement RGPD (cookie kikienchrist-consent)
 * Toutes les fonctions sont no-op si consentement non donné ou GA4 non configuré.
 */

// Types pour les événements GA4 recommandés
export interface GA4EventParams {
  // Paramètres communs
  language?: string;
  page_path?: string;
  page_title?: string;

  // Événements e-commerce / livres
  item_id?: string;
  item_name?: string;
  item_category?: string;
  item_variant?: string; // 'paper' | 'ebook' | 'audio'
  price?: number;
  currency?: string; // 'EUR' | 'USD'
  quantity?: number;

  // Événements engagement
  link_url?: string;
  link_text?: string;
  link_domain?: string;
  file_name?: string;
  file_extension?: string;
  scroll_depth?: number; // 25, 50, 75, 100
  video_title?: string;
  video_provider?: string; // 'youtube' | 'vimeo' | 'self'
  video_duration?: number;
  form_name?: string;
  form_location?: string;
  search_term?: string;
  search_results_count?: number;

  // Custom
  [key: string]: unknown;
}

// Clé de stockage du consentement
const CONSENT_COOKIE_NAME = import.meta.env.PUBLIC_COOKIE_CONSENT_NAME || 'kikienchrist-consent';
const GA4_MEASUREMENT_ID = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID;

/**
 * Vérifie si l'utilisateur a accepté les cookies analytiques
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof document === 'undefined') return false; // SSR

  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!cookie) return false;

  try {
    const consent = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    return consent.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Vérifie si GA4 est configuré
 */
export function isGA4Configured(): boolean {
  return Boolean(GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX');
}

/**
 * Initialise GA4 (injecte le script gtag)
 * À appeler une seule fois au chargement de la page (dans MainLayout)
 */
export function initGA4(): void {
  if (typeof window === 'undefined') return; // SSR guard
  if (!isGA4Configured()) return;
  if (window.gtagInitialized) return; // Déjà initialisé

  // Initialisation de la dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Consent mode v2 par défaut (refusé jusqu'à acceptation)
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  // Chargement du script GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Configuration GA4
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false, // Nous gérons page_view manuellement
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  window.gtagInitialized = true;
}

/**
 * Met à jour le Consent Mode v2 selon le choix utilisateur
 * À appeler après acceptation/refus de la bannière
 */
export function updateConsentMode(analyticsAccepted: boolean): void {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: analyticsAccepted ? 'granted' : 'denied',
    ad_storage: 'denied', // Pas de pub pour l'instant
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/**
 * Envoie un événement GA4 si consentement donné
 */
function sendEvent(eventName: string, params: GA4EventParams = {}): void {
  if (typeof window === 'undefined') return; // SSR
  if (!hasAnalyticsConsent()) return; // RGPD: pas de tracking sans consentement
  if (!window.gtag) return;

  const enrichedParams: GA4EventParams = {
    ...params,
    language: params.language || document.documentElement.lang || 'fr',
    page_path: params.page_path || window.location.pathname,
    page_title: params.page_title || document.title,
  };

  window.gtag('event', eventName, enrichedParams);
}

/**
 * ============================================
 * ÉVÉNEMENTS STANDARDS GA4 (Enhanced Measurement + Custom)
 * ============================================
 */

/** Vue de page (appelée à chaque navigation SPA/MPA) */
export function trackPageView(params?: GA4EventParams): void {
  sendEvent('page_view', params);
}

/** Clic sur lien externe */
export function trackOutboundClick(url: string, linkText?: string): void {
  sendEvent('click', {
    event_category: 'engagement',
    event_label: 'outbound_link',
    link_url: url,
    link_text: linkText || url,
    link_domain: new URL(url).hostname,
  });
}

/** Clic sur lien interne (navigation) */
export function trackInternalClick(url: string, linkText?: string): void {
  sendEvent('click', {
    event_category: 'navigation',
    event_label: 'internal_link',
    link_url: url,
    link_text: linkText || url,
  });
}

/** Clic sur CTA (boutons d'action principaux) */
export function trackCTAClick(ctaName: string, location: string, destinationUrl?: string): void {
  sendEvent('click', {
    event_category: 'cta',
    event_label: ctaName,
    link_url: destinationUrl,
    link_text: ctaName,
    form_location: location, // ex: 'hero', 'book_card_1', 'footer'
  });
}

/** Profondeur de scroll (25, 50, 75, 100%) */
export function trackScrollDepth(depth: number): void {
  sendEvent('scroll', {
    event_category: 'engagement',
    event_label: `scroll_${depth}`,
    scroll_depth: depth,
  });
}

/** Téléchargement de fichier (PDF guide, etc.) */
export function trackFileDownload(fileName: string, fileUrl: string, fileType?: string): void {
  sendEvent('file_download', {
    event_category: 'engagement',
    event_label: fileName,
    file_name: fileName,
    file_extension: fileType || fileName.split('.').pop()?.toLowerCase(),
    link_url: fileUrl,
  });
}

/** Lecture vidéo */
export function trackVideoPlay(videoTitle: string, provider: string, videoUrl?: string): void {
  sendEvent('video_play', {
    event_category: 'media',
    event_label: videoTitle,
    video_title: videoTitle,
    video_provider: provider,
    link_url: videoUrl,
  });
}

/** Soumission formulaire (newsletter, contact) */
export function trackFormSubmit(formName: string, location: string, success: boolean = true): void {
  sendEvent(success ? 'form_submit' : 'form_error', {
    event_category: 'conversion',
    event_label: formName,
    form_name: formName,
    form_location: location,
    success,
  });
}

/** Inscription newsletter */
export function trackNewsletterSignup(location: string, success: boolean = true): void {
  trackFormSubmit('newsletter', location, success);
  if (success) {
    sendEvent('sign_up', {
      event_category: 'conversion',
      event_label: 'newsletter',
      method: 'email',
      form_location: location,
    });
  }
}

/** Clic sur lien d'achat livre (Lulu, Payhip, Google Play) */
export function trackBookPurchaseClick(bookId: string, bookTitle: string, seller: string, format: 'paper' | 'ebook' | 'audio', price?: number, currency: string = 'EUR'): void {
  sendEvent('select_item', {
    event_category: 'ecommerce',
    event_label: `${bookId}_${format}`,
    item_id: bookId,
    item_name: bookTitle,
    item_category: 'book',
    item_variant: format,
    price,
    currency,
    quantity: 1,
    link_text: `${seller} - ${format}`,
  });
}

/** Affichage fiche livre (impression) */
export function trackBookImpression(bookId: string, bookTitle: string, position: number): void {
  sendEvent('view_item', {
    event_category: 'ecommerce',
    event_label: bookId,
    item_id: bookId,
    item_name: bookTitle,
    item_category: 'book',
    index: position,
  });
}

/** Recherche interne */
export function trackSearch(searchTerm: string, resultsCount: number): void {
  sendEvent('search', {
    event_category: 'engagement',
    event_label: searchTerm,
    search_term: searchTerm,
    search_results_count: resultsCount,
  });
}

/** Partage social */
export function trackSocialShare(platform: string, contentUrl: string, contentTitle?: string): void {
  sendEvent('share', {
    event_category: 'social',
    event_label: platform,
    method: platform,
    content_type: 'page',
    link_url: contentUrl,
    link_text: contentTitle || contentUrl,
  });
}

/** Erreur JavaScript (pour Sentry + GA4) */
export function trackError(error: Error, context?: string): void {
  sendEvent('exception', {
    event_category: 'error',
    event_label: error.message,
    description: `${error.name}: ${error.message}${context ? ` | Context: ${context}` : ''}`,
    fatal: false,
  });
}

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    gtagInitialized: boolean;
  }
}