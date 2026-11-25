/**
 * Middleware i18n pour Astro - Généré automatiquement
 * Détecte la langue préférée et définit le cookie
 */
import { defineMiddleware } from 'astro:middleware';

const SUPPORTED_LANGS = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
const DEFAULT_LANG = 'fr';
const COOKIE_NAME = 'preferred-lang';
const COOKIE_MAX_AGE = 31536000;
const LANG_REGIONS = {
  fr: 'FR',
  en: 'US',
  es: 'ES',
  pt: 'PT',
  it: 'IT',
  de: 'DE',
  nl: 'NL',
  pl: 'PL',
  ar: 'SA',
  ru: 'RU',
  zh: 'CN',
  hi: 'IN',
  'x-default': 'FR',
};

function getLangFromPath(pathname: string): string | null {
  // Format: /fr/... ou /fr
  const match = pathname.match(/^\/([a-z-]{2,3})(?:\/|$)/);
  if (match && SUPPORTED_LANGS.includes(match[1])) {
    return match[1];
  }
  return null;
}

function getAcceptLanguage(headers: Headers): string | null {
  const acceptLang = headers.get('accept-language');
  if (!acceptLang) return null;

  // Parser Accept-Language: "fr-FR,fr;q=0.9,en;q=0.8"
  const prefs = acceptLang
    .split(',')
    .map(part => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.split('-')[0], quality: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const pref of prefs) {
    if (SUPPORTED_LANGS.includes(pref.lang)) {
      return pref.lang;
    }
  }
  return null;
}

function getCookieLang(headers: Headers): string | null {
  const cookie = headers.get('cookie');
  if (!cookie) return null;

  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (match && SUPPORTED_LANGS.includes(match[1])) {
    return match[1];
  }
  return null;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, redirect, locals } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Langue depuis l'URL (priorité haute)
  const pathLang = getLangFromPath(pathname);

  // 2. Langue depuis le cookie
  const cookieLang = getCookieLang(request.headers);

  // 3. Langue depuis Accept-Language (auto-détection)
  const acceptLang = getAcceptLanguage(request.headers);

  // Déterminer la langue finale
  let lang = pathLang || cookieLang || acceptLang || DEFAULT_LANG;

  // Valider
  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = DEFAULT_LANG;
  }

  // Stocker dans locals pour usage dans les composants
  locals.lang = lang;
  locals.supportedLangs = SUPPORTED_LANGS;
  locals.defaultLang = DEFAULT_LANG;
  locals.langRegions = LANG_REGIONS;

  // Définir le cookie si pas déjà présent ou différent
  const existingCookie = cookies.get(COOKIE_NAME);
  if (!existingCookie || existingCookie.value !== lang) {
    cookies.set(COOKIE_NAME, lang, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: true, // HTTPS seulement en prod
    });
  }

  // Redirection racine vers langue par défaut
  if (pathname === '/' || pathname === '') {
    return redirect(`/${DEFAULT_LANG}/`, 302);
  }

  // Redirection si pas de langue dans l'URL et pas racine
  if (!pathLang && pathname !== '/' && pathname !== '') {
    // Vérifier si c'est une route statique (assets, etc.)
    const staticPaths = [
      '/images/',
      '/fonts/',
      '/icons/',
      '/_astro/',
      '/robots.txt',
      '/sitemap.xml',
      '/rss.xml',
      '/manifest.webmanifest',
      '/sw.js',
      '/workbox-',
    ];
    const isStatic = staticPaths.some(p => pathname.startsWith(p));

    if (!isStatic) {
      return redirect(`/${lang}${pathname}`, 302);
    }
  }

  return next();
});
