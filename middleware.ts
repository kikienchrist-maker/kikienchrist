// Vercel Edge Middleware for automatic language detection and redirection
// This runs at the edge before static files are served
// Uses standard Web APIs only (no next/server)

const SUPPORTED_LANGS = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];
const DEFAULT_LANG = 'fr';
const COOKIE_NAME = 'preferred-lang';

/**
 * Extract language from Accept-Language header
 * e.g., "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" -> "fr"
 */
function getLanguageFromHeader(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LANG;

  const langs = acceptLanguage
    .split(',')
    .map(part => {
      const [lang, q] = part.trim().split(';');
      const quality = q ? parseFloat(q.split('=')[1]) : 1.0;
      return { lang: lang.trim().toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { lang } of langs) {
    const baseLang = lang.split('-')[0];
    if (SUPPORTED_LANGS.includes(baseLang)) {
      return baseLang;
    }
    if (SUPPORTED_LANGS.includes(lang)) {
      return lang;
    }
  }

  return DEFAULT_LANG;
}

/**
 * Get language from cookie if valid
 */
function getLanguageFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${COOKIE_NAME}=`)) {
      const value = cookie.substring(COOKIE_NAME.length + 1);
      if (SUPPORTED_LANGS.includes(value)) {
        return value;
      }
    }
  }
  return null;
}

/**
 * Check if path already has a language prefix
 */
function hasLangPrefix(pathname: string): boolean {
  const firstSegment = pathname.split('/')[1];
  return SUPPORTED_LANGS.includes(firstSegment);
}

export default async function middleware(request: Request): Promise<Response | void> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip middleware for:
  // - API routes
  // - Static assets (images, css, js, fonts, favicon, robots, sitemap)
  // - Already localized paths (they have /fr/, /en/, etc.)
  if (
    pathname.startsWith('/api/') ||
    pathname.match(/\.(css|js|map|ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot|xml|txt|json)$/i) ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap-index.xml' ||
    pathname.startsWith('/_astro/') ||
    hasLangPrefix(pathname)
  ) {
    // Return void/undefined to continue to static file
    return;
  }

  // Root path "/" or any non-localized path -> detect and redirect
  if (pathname === '/' || pathname === '') {
    // 1. Check cookie first (explicit user preference)
    const cookieLang = getLanguageFromCookie(request.headers.get('cookie'));
    if (cookieLang) {
      const redirectUrl = new URL(`/${cookieLang}/`, request.url);
      return Response.redirect(redirectUrl, 302);
    }

    // 2. Detect from Accept-Language header
    const headerLang = getLanguageFromHeader(request.headers.get('accept-language'));
    const redirectUrl = new URL(`/${headerLang}/`, request.url);
    return Response.redirect(redirectUrl, 302);
  }

  // For any other non-localized path, redirect to localized version
  // preserving the rest of the path
  const detectedLang = getLanguageFromHeader(request.headers.get('accept-language'));
  const targetPath = `/${detectedLang}${pathname}`;
  const redirectUrl = new URL(targetPath, request.url);
  return Response.redirect(redirectUrl, 302);
}

export const config = {
  matcher: ['/((?!api|_astro|.*\\..*).*)'],
};