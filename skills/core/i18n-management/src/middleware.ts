/**
 * Génération du middleware i18n pour Astro
 */
import type { I18nConfig, LangCode } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS, DEFAULT_LANG, LANG_REGIONS } from './config.js';

export interface MiddlewareOptions {
  cookieName: string;
  cookieMaxAge: number;
  defaultLang: LangCode;
  supportedLangs: LangCode[];
  enableAutoDetect: boolean;
}

export const DEFAULT_MIDDLEWARE_OPTIONS: MiddlewareOptions = {
  cookieName: 'preferred-lang',
  cookieMaxAge: 60 * 60 * 24 * 365, // 1 an
  defaultLang: DEFAULT_LANG,
  supportedLangs: UI_LANGS,
  enableAutoDetect: true,
};

/**
 * Génère le code du middleware Astro
 */
export function generateMiddlewareCode(options: MiddlewareOptions = DEFAULT_MIDDLEWARE_OPTIONS): string {
  const { cookieName, cookieMaxAge, defaultLang, supportedLangs, enableAutoDetect } = options;
  const langsArray = JSON.stringify(supportedLangs);
  const langRegions = JSON.stringify(LANG_REGIONS);
  
  return `/**
 * Middleware i18n pour Astro - Généré automatiquement
 * Détecte la langue préférée et définit le cookie
 */
import { defineMiddleware } from 'astro:middleware';

const SUPPORTED_LANGS = ${langsArray};
const DEFAULT_LANG = '${defaultLang}';
const COOKIE_NAME = '${cookieName}';
const COOKIE_MAX_AGE = ${cookieMaxAge};
const LANG_REGIONS = ${langRegions};

function getLangFromPath(pathname: string): string | null {
  // Format: /fr/... ou /fr
  const match = pathname.match(/^\\/([a-z-]{2,3})(?:\\/|$)/);
  if (match && SUPPORTED_LANGS.includes(match[1])) {
    return match[1];
  }
  return null;
}

function getAcceptLanguage(headers: Headers): string | null {
  const acceptLang = headers.get('accept-language');
  if (!acceptLang) return null;
  
  // Parser Accept-Language: "fr-FR,fr;q=0.9,en;q=0.8"
  const prefs = acceptLang.split(',').map(part => {
    const [lang, q] = part.trim().split(';q=');
    return { lang: lang.split('-')[0], quality: q ? parseFloat(q) : 1 };
  }).sort((a, b) => b.quality - a.quality);
  
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
  
  const match = cookie.match(new RegExp(\`\${COOKIE_NAME}=([^;]+)\`));
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
  const acceptLang = ${enableAutoDetect ? 'getAcceptLanguage(request.headers)' : 'null'};
  
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
    return redirect(\`/\${DEFAULT_LANG}/\`, 302);
  }
  
  // Redirection si pas de langue dans l'URL et pas racine
  if (!pathLang && pathname !== '/' && pathname !== '') {
    // Vérifier si c'est une route statique (assets, etc.)
    const staticPaths = ['/images/', '/fonts/', '/icons/', '/_astro/', '/robots.txt', '/sitemap.xml', '/rss.xml', '/manifest.webmanifest', '/sw.js', '/workbox-'];
    const isStatic = staticPaths.some(p => pathname.startsWith(p));
    
    if (!isStatic) {
      return redirect(\`/\${lang}\${pathname}\`, 302);
    }
  }
  
  return next();
};
`;
}

/**
 * Génère le code du middleware pour Edge (Vercel/Netlify)
 */
export function generateEdgeMiddlewareCode(options: MiddlewareOptions = DEFAULT_MIDDLEWARE_OPTIONS): string {
  const { cookieName, cookieMaxAge, defaultLang, supportedLangs, enableAutoDetect } = options;
  const langsArray = JSON.stringify(supportedLangs);
  
  return `/**
 * Edge Middleware i18n pour Vercel/Netlify - Généré automatiquement
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LANGS = ${langsArray};
const DEFAULT_LANG = '${defaultLang}';
const COOKIE_NAME = '${cookieName}';

function getLangFromPath(pathname: string): string | null {
  const match = pathname.match(/^\\/([a-z-]{2,3})(?:\\/|$)/);
  if (match && SUPPORTED_LANGS.includes(match[1])) {
    return match[1];
  }
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathLang = getLangFromPath(pathname);
  const cookieLang = request.cookies.get(COOKIE_NAME)?.value || null;
  const acceptLang = ${enableAutoDetect ? 'request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || null' : 'null'};
  
  let lang = pathLang || cookieLang || acceptLang || DEFAULT_LANG;
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  
  // Redirection racine
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = \`/\${DEFAULT_LANG}/\`;
    return NextResponse.redirect(url);
  }
  
  // Redirection si pas de langue
  if (!pathLang && pathname !== '/') {
    const staticPaths = ['/images/', '/fonts/', '/icons/', '/_astro/', '/robots.txt', '/sitemap.xml', '/rss.xml', '/manifest.webmanifest', '/sw.js', '/workbox-'];
    const isStatic = staticPaths.some(p => pathname.startsWith(p));
    
    if (!isStatic) {
      const url = request.nextUrl.clone();
      url.pathname = \`/\${lang}\${pathname}\`;
      const response = NextResponse.redirect(url);
      response.cookies.set(COOKIE_NAME, lang, { path: '/', maxAge: ${cookieMaxAge}, sameSite: 'lax', secure: true });
      return response;
    }
  }
  
  // Définir cookie si absent
  const response = NextResponse.next();
  if (!request.cookies.has(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, lang, { path: '/', maxAge: ${cookieMaxAge}, sameSite: 'lax', secure: true });
  }
  
  // Headers pour composants
  response.headers.set('x-preferred-lang', lang);
  response.headers.set('x-supported-langs', SUPPORTED_LANGS.join(','));
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
`;
}