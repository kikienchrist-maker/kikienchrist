// Cookie Banner Logic - Kiki en Christ
// Fichier statique servi par Vercel - chargé via <script src="/cookie-banner.js" defer>
// JavaScript pur (ES5 compatible), pas de TypeScript, pas d'import.meta

(function() {
  // ------------------------------------------------------------------
  // CONFIGURATION
  // ------------------------------------------------------------------
  var COOKIE_NAME = 'kikienchrist-consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an
  var COOKIE_DOMAIN = window.location.hostname.includes('localhost') ? 'localhost' : 'kikienchrist.vercel.app';

  // Clés des cookies tiers à nettoyer si refus
  var THIRD_PARTY_COOKIES = {
    analytics: ['_ga', '_ga_*', '_gid', '_gat'],
    marketing: ['_fbp', '_fbc', 'fr', 'xs', 'datr'],
    functional: ['__cf_bm', 'cf_clearance'],
  };

  // État
  var preferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  };

  var banner = null;
  var panel = null;
  var overlay = null;

  // ------------------------------------------------------------------
  // UTILITAIRES COOKIES
  // ------------------------------------------------------------------
  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; domain=' + COOKIE_DOMAIN + '; SameSite=Lax; Secure';
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + COOKIE_DOMAIN + '; SameSite=Lax; Secure';
  }

  function getConsentCookie(cookieName) {
    var cookie = document.cookie.split('; ').find(function(row) { return row.startsWith(cookieName + '='); });
    if (!cookie) return null;
    try {
      return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch (e) {
      return null;
    }
  }

  function saveConsent(cookieName) {
    var consentData = {
      necessary: preferences.necessary,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      functional: preferences.functional,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    setCookie(cookieName, JSON.stringify(consentData), 365);
    window.dispatchEvent(new CustomEvent('consent:updated', { detail: preferences }));
  }

  function loadConsent(cookieName) {
    var saved = getConsentCookie(cookieName);
    if (saved) {
      preferences.analytics = saved.analytics ?? false;
      preferences.marketing = saved.marketing ?? false;
      preferences.functional = saved.functional ?? false;
      updateCheckboxes();
      return true;
    }
    return false;
  }

  function updateCheckboxes() {
    var analyticsCheckbox = panel?.querySelector('#consent-analytics');
    var marketingCheckbox = panel?.querySelector('#consent-marketing');
    var functionalCheckbox = panel?.querySelector('#consent-functional');
    if (analyticsCheckbox) analyticsCheckbox.checked = preferences.analytics;
    if (marketingCheckbox) marketingCheckbox.checked = preferences.marketing;
    if (functionalCheckbox) functionalCheckbox.checked = preferences.functional;
  }

  function applyConsent() {
    if (typeof window.updateConsentMode === 'function') {
      window.updateConsentMode(preferences.analytics);
    }
    Object.keys(THIRD_PARTY_COOKIES).forEach(function(category) {
      if (!preferences[category]) {
        THIRD_PARTY_COOKIES[category].forEach(function(cookieName) {
          deleteCookie(cookieName);
          if (cookieName.endsWith('*')) {
            var prefix = cookieName.slice(0, -1);
            document.cookie.split('; ').forEach(function(cookie) {
              var name = cookie.split('=')[0];
              if (name.startsWith(prefix)) deleteCookie(name);
            });
          }
        });
      }
    });
  }

  // ------------------------------------------------------------------
  // ACTIONS UI
  // ------------------------------------------------------------------
  function acceptAll(cookieName) {
    preferences.analytics = true;
    preferences.marketing = true;
    preferences.functional = true;
    updateCheckboxes();
    saveConsent(cookieName);
    applyConsent();
    closeBanner();
  }

  function rejectAll(cookieName) {
    preferences.analytics = false;
    preferences.marketing = false;
    preferences.functional = false;
    updateCheckboxes();
    saveConsent(cookieName);
    applyConsent();
    closeBanner();
  }

  function savePreferences(cookieName) {
    var analyticsCheckbox = panel?.querySelector('#consent-analytics');
    var marketingCheckbox = panel?.querySelector('#consent-marketing');
    var functionalCheckbox = panel?.querySelector('#consent-functional');
    preferences.analytics = analyticsCheckbox?.checked ?? false;
    preferences.marketing = marketingCheckbox?.checked ?? false;
    preferences.functional = functionalCheckbox?.checked ?? false;
    saveConsent(cookieName);
    applyConsent();
    closePanel();
  }

  function openPanel() {
    if (!panel || !overlay || !banner) return;
    panel.hidden = false;
    overlay.hidden = false;
    banner.setAttribute('aria-hidden', 'true');
    var firstFocusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    if (!panel || !overlay || !banner) return;
    panel.hidden = true;
    overlay.hidden = true;
    banner.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = '';
    var customizeBtn = banner.querySelector('[data-action="customize"]');
    customizeBtn?.focus();
  }

  function closeBanner() {
    if (!banner || !overlay) return;
    banner.hidden = true;
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  // ------------------------------------------------------------------
  // INITIALISATION (au DOMContentLoaded)
  // ------------------------------------------------------------------
  function initCookieBanner() {
    banner = document.getElementById('cookie-banner');
    panel = document.getElementById('cookie-panel');
    overlay = document.getElementById('cookie-overlay');
    if (!banner || !panel || !overlay) {
      console.warn('[CookieBanner] Éléments DOM non trouvés', { banner: !!banner, panel: !!panel, overlay: !!overlay });
      return;
    }
    if (loadConsent(COOKIE_NAME)) {
      applyConsent();
      banner.hidden = true;
      overlay.hidden = true;
      return;
    }
    banner.querySelector('[data-action="accept-all"]')?.addEventListener('click', function() { acceptAll(COOKIE_NAME); });
    banner.querySelector('[data-action="reject-all"]')?.addEventListener('click', function() { rejectAll(COOKIE_NAME); });
    banner.querySelector('[data-action="customize"]')?.addEventListener('click', openPanel);
    panel.querySelector('[data-action="save-prefs"]')?.addEventListener('click', function() { savePreferences(COOKIE_NAME); });
    panel.querySelector('[data-action="close-panel"]')?.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (!panel?.hidden) closePanel();
        else if (!banner?.hidden) closeBanner();
      }
    });
    panel.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        var focusableElements = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var firstElement = focusableElements[0];
        var lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
    // Afficher bannière après court délai (pour LCP)
    setTimeout(function() {
      banner.hidden = false;
      overlay.hidden = false;
    }, 500);
  }

  // Attendre DOM prêt + hydratation Astro (MutationObserver sur body)
  function startInit() {
    // Si éléments déjà présents (hydratation rapide), initialiser direct
    if (document.getElementById('cookie-banner') && document.getElementById('cookie-panel') && document.getElementById('cookie-overlay')) {
      initCookieBanner();
      return;
    }
    // Sinon observer l'injection du slot par Astro
    var observer = new MutationObserver(function(mutations, obs) {
      if (document.getElementById('cookie-banner') && document.getElementById('cookie-panel') && document.getElementById('cookie-overlay')) {
        obs.disconnect();
        // Petit délai pour laisser le DOM se stabiliser
        setTimeout(initCookieBanner, 50);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Fallback sécurité : max 5s
    setTimeout(function() { observer.disconnect(); }, 5000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
  } else {
    startInit();
  }
})();