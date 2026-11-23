/**
 * GA4 Initialization + Consent Mode v2
 * Module ES transpilé par Vite - import.meta.env fonctionne
 * Chargé depuis MainLayout.astro via <script type="module">
 */

// Récupération de l'ID GA4 depuis les variables d'env (injecté par Vite au build)
const GA4_ID = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID;

if (!GA4_ID || GA4_ID === 'G-XXXXXXXXXX') {
  if (import.meta.env.DEV) console.log('[GA4] Non configuré (PUBLIC_GA4_MEASUREMENT_ID manquant ou placeholder)');
  // On expose quand même updateConsentMode (no-op) pour éviter erreurs cookie banner
  window.updateConsentMode = () => {};
} else {
  // dataLayer & gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args);
  };

  // Consent Mode v2 par défaut (denied jusqu'à acceptation)
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  // Script GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Config GA4
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  // Exposer updateConsentMode pour le Cookie Banner
  window.updateConsentMode = (analyticsAccepted) => {
    if (!window.gtag) return;
    window.gtag('consent', 'update', {
      analytics_storage: analyticsAccepted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  // Écouter l'événement de mise à jour consentement
  window.addEventListener('consent:updated', (e) => {
    const prefs = e.detail;
    if (window.updateConsentMode) {
      window.updateConsentMode(prefs.analytics === true);
    }
  });

  // Page view initiale
  window.gtag('event', 'page_view', {
    page_path: window.location.pathname,
    page_title: document.title,
    language: document.documentElement.lang || 'fr',
  });

  window.gtagInitialized = true;
  if (import.meta.env.DEV) console.log('[GA4] Initialisé avec Consent Mode v2');
}