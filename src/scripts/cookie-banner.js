/**
 * Cookie Banner Logic - Kiki en Christ
 * Gestion du consentement RGPD / ePrivacy
 * Chargé en tant que module ES depuis CookieBanner.astro
 */

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface InitOptions {
  cookieName: string;
  locale: string;
}

// Configuration
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an
const COOKIE_DOMAIN = import.meta.env.PROD ? '.kikienchrist.vercel.app' : 'localhost';

// Clés des cookies tiers à nettoyer si refus
const THIRD_PARTY_COOKIES: Record<keyof Omit<ConsentPreferences, 'necessary'>, string[]> = {
  analytics: ['_ga', '_ga_*', '_gid', '_gat'],
  marketing: ['_fbp', '_fbc', 'fr', 'xs', 'datr'],
  functional: ['__cf_bm', 'cf_clearance'],
};

// État
let preferences: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

let banner: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let overlay: HTMLElement | null = null;

// ------------------------------------------------------------------
// UTILITAIRES COOKIES
// ------------------------------------------------------------------
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax; Secure`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${COOKIE_DOMAIN}; SameSite=Lax; Secure`;
}

function getConsentCookie(cookieName: string): ConsentPreferences | null {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${cookieName}=`));
  if (!cookie) return null;
  try {
    return JSON.parse(decodeURIComponent(cookie.split('=')[1])) as ConsentPreferences;
  } catch {
    return null;
  }
}

function saveConsent(cookieName: string): void {
  const consentData = {
    ...preferences,
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
  setCookie(cookieName, JSON.stringify(consentData), 365);

  // Déclencher événement pour mise à jour GA4 Consent Mode
  window.dispatchEvent(new CustomEvent('consent:updated', { detail: preferences }));
}

function loadConsent(cookieName: string): boolean {
  const saved = getConsentCookie(cookieName);
  if (saved) {
    preferences = { ...preferences, ...saved };
    updateCheckboxes();
    return true;
  }
  return false;
}

function updateCheckboxes(): void {
  const analyticsCheckbox = panel?.querySelector('#consent-analytics') as HTMLInputElement;
  const marketingCheckbox = panel?.querySelector('#consent-marketing') as HTMLInputElement;
  const functionalCheckbox = panel?.querySelector('#consent-functional') as HTMLInputElement;

  if (analyticsCheckbox) analyticsCheckbox.checked = preferences.analytics;
  if (marketingCheckbox) marketingCheckbox.checked = preferences.marketing;
  if (functionalCheckbox) functionalCheckbox.checked = preferences.functional;
}

function applyConsent(): void {
  // Mise à jour GA4 Consent Mode
  if (typeof window.updateConsentMode === 'function') {
    window.updateConsentMode(preferences.analytics);
  }

  // Nettoyer cookies tiers si refusés
  Object.entries(THIRD_PARTY_COOKIES).forEach(([category, cookies]) => {
    const prefKey = category as keyof Omit<ConsentPreferences, 'necessary'>;
    if (!preferences[prefKey]) {
      cookies.forEach(cookieName => {
        deleteCookie(cookieName);
        if (cookieName.endsWith('*')) {
          const prefix = cookieName.slice(0, -1);
          document.cookie.split('; ').forEach(cookie => {
            const [name] = cookie.split('=');
            if (name.startsWith(prefix)) {
              deleteCookie(name);
            }
          });
        }
      });
    }
  });
}

// ------------------------------------------------------------------
// ACTIONS UI
// ------------------------------------------------------------------
function acceptAll(cookieName: string): void {
  preferences = { necessary: true, analytics: true, marketing: true, functional: true };
  updateCheckboxes();
  saveConsent(cookieName);
  applyConsent();
  closeBanner();
}

function rejectAll(cookieName: string): void {
  preferences = { necessary: true, analytics: false, marketing: false, functional: false };
  updateCheckboxes();
  saveConsent(cookieName);
  applyConsent();
  closeBanner();
}

function savePreferences(cookieName: string): void {
  const analyticsCheckbox = panel?.querySelector('#consent-analytics') as HTMLInputElement;
  const marketingCheckbox = panel?.querySelector('#consent-marketing') as HTMLInputElement;
  const functionalCheckbox = panel?.querySelector('#consent-functional') as HTMLInputElement;

  preferences.analytics = analyticsCheckbox?.checked ?? false;
  preferences.marketing = marketingCheckbox?.checked ?? false;
  preferences.functional = functionalCheckbox?.checked ?? false;

  saveConsent(cookieName);
  applyConsent();
  closePanel();
}

function openPanel(): void {
  if (!panel || !overlay || !banner) return;

  panel.hidden = false;
  overlay.hidden = false;
  banner.setAttribute('aria-hidden', 'true');

  // Focus trap: premier élément focusable
  const firstFocusable = panel.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  (firstFocusable as HTMLElement)?.focus();

  document.body.style.overflow = 'hidden';
}

function closePanel(): void {
  if (!panel || !overlay || !banner) return;

  panel.hidden = true;
  overlay.hidden = true;
  banner.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = '';

  // Focus retour sur bouton "Personnaliser"
  const customizeBtn = banner.querySelector('[data-action="customize"]') as HTMLElement;
  customizeBtn?.focus();
}

function closeBanner(): void {
  if (!banner || !overlay) return;

  banner.hidden = true;
  overlay.hidden = true;
  document.body.style.overflow = '';
}

// ------------------------------------------------------------------
// INITIALISATION
// ------------------------------------------------------------------
export function initCookieBanner(options: InitOptions): void {
  const { cookieName, locale } = options;

  // Récupérer les éléments DOM
  banner = document.getElementById('cookie-banner');
  panel = document.getElementById('cookie-panel');
  overlay = document.getElementById('cookie-overlay');

  if (!banner || !panel || !overlay) {
    console.warn('[CookieBanner] Éléments DOM non trouvés');
    return;
  }

  // Si consentement déjà donné, ne pas afficher
  if (loadConsent(cookieName)) {
    applyConsent();
    banner.hidden = true;
    overlay.hidden = true;
    return;
  }

  // Event listeners
  banner.querySelector('[data-action="accept-all"]')?.addEventListener('click', () => acceptAll(cookieName));
  banner.querySelector('[data-action="reject-all"]')?.addEventListener('click', () => rejectAll(cookieName));
  banner.querySelector('[data-action="customize"]')?.addEventListener('click', openPanel);
  panel.querySelector('[data-action="save-prefs"]')?.addEventListener('click', () => savePreferences(cookieName));
  panel.querySelector('[data-action="close-panel"]')?.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Fermeture ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!panel?.hidden) closePanel();
      else if (!banner?.hidden) closeBanner();
    }
  });

  // Focus trap dans le panneau
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableElements = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Afficher bannière après un court délai (pour ne pas bloquer LCP)
  setTimeout(() => {
    banner.hidden = false;
    overlay.hidden = false;
  }, 500);
}