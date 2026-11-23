---
name: kikienchrist-middleware
description: "Vercel Edge Middleware — détection langue (Accept-Language), redirect / → /{lang}/, cookie persistence, cache control"
version: "1.0"
---

# Skill: kikienchrist-middleware

## Fichier
`src/middleware.ts` — **Vercel Edge Runtime** (pas Node.js, pas Bun — Edge standard).

## Rôle
1. **Détecter** la langue préférée du visiteur (`Accept-Language` header)
2. **Rediriger** `/` (racine) → `/{lang}/` (302 Found)
3. **Persister** le choix via cookie `preferred-lang` (1 an, SameSite=Lax, Secure)
4. **Laisser passer** les chemins déjà localisés (`/fr/`, `/en/`, etc.) → `return` (void)
5. **Contrôler le cache** : `Cache-Control: private, no-store` sur les redirects (évite cache CDN)

## Code clé
```typescript
// src/middleware.ts
import { SUPPORTED_LANGS, DEFAULT_LANG, detectLanguageFromHeader } from './utils/i18n';

export const config = {
  matcher: ['/((?!_next|api|styles|images|fonts|favicon|robots|sitemap|_vercel).*)'],
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Déjà localisé ? (ex: /fr/, /en/...) → passer
  const localeMatch = pathname.match(/^\/(fr|en|es|de|pt|it|ru|zh|hi)\//);
  if (localeMatch) {
    // Mettre à jour cookie si langue différente
    const response = NextResponse.next();
    const cookieLang = request.cookies.get('preferred-lang')?.value;
    if (cookieLang !== localeMatch[1]) {
      response.cookies.set('preferred-lang', localeMatch[1], {
        maxAge: 31536000, // 1 an
        path: '/',
        sameSite: 'lax',
        secure: true,
      });
    }
    return response;
  }
  
  // Racine "/" → détecter langue + redirect
  if (pathname === '/' || pathname === '') {
    const acceptLang = request.headers.get('accept-language') || '';
    const detected = detectLanguageFromHeader(acceptLang);
    const preferred = request.cookies.get('preferred-lang')?.value;
    const targetLang = preferred && SUPPORTED_LANGS.includes(preferred) ? preferred : detected;
    
    const redirectUrl = new URL(`/${targetLang}/`, request.url);
    redirectUrl.search = url.search; // préserver query params
    
    return Response.redirect(redirectUrl, 302); // 302 = temporaire (SEO friendly)
  }
  
  // Autres chemins (assets, etc.) → passer
  return NextResponse.next();
}
```

## Utilitaires (`src/utils/i18n.ts`)
```typescript
export const SUPPORTED_LANGS = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];
export const DEFAULT_LANG = 'fr';

export function detectLanguageFromHeader(header: string): string {
  // Parse Accept-Language: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
  const prefs = header.split(',').map(p => {
    const [lang, q] = p.split(';');
    return { lang: lang.trim().split('-')[0].toLowerCase(), q: q ? parseFloat(q.split('=')[1]) : 1 };
  }).sort((a, b) => b.q - a.q);
  
  for (const p of prefs) {
    if (SUPPORTED_LANGS.includes(p.lang)) return p.lang;
  }
  return DEFAULT_LANG;
}

export function getLocalizedUrls(pathname: string) {
  // Génère URLs alternatives pour hreflang
}
```

## Fallback Statique (si Middleware désactivé / Static Export)
`public/_redirects` :
```
/ /fr/ 302
```
+ Script client dans `src/pages/index.astro` :
```javascript
<script>
  (() => {
    const langs = navigator.languages || [navigator.language];
    const supported = ['fr','en','es','de','pt','it','ru','zh','hi'];
    for (const l of langs) {
      const code = l.split('-')[0].toLowerCase();
      if (supported.includes(code)) {
        window.location.href = `/${code}/`;
        return;
      }
    }
    window.location.href = '/fr/';
  })();
</script>
```

## Cache Control (CRITIQUE)
- **Problème** : Vercel CDN met en cache les réponses 302 du middleware → visiteurs bloqués sur mauvaise langue
- **Fix** : Middleware retourne `Cache-Control: private, no-store` sur les redirects
  ```typescript
  const response = Response.redirect(redirectUrl, 302);
  response.headers.set('Cache-Control', 'private, no-store, must-revalidate');
  return response;
  ```
- **Sur chemins localisés** : `NextResponse.next()` sans header cache spécial (laissé au `vercel.json`)

## `vercel.json` (headers statiques)
```json
{
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }] },
    { "source": "/styles/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/images/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

## Debug / Test
```bash
# 1. Test local avec vercel dev
vercel dev
# Ouvrir http://localhost:3000/ → doit rediriger vers /fr/ (ou langue navigateur)

# 2. Test header Accept-Language (curl)
curl -H "Accept-Language: en-US,en;q=0.9" -I https://kikienchrist.vercel.app/
# Doit retourner: Location: https://kikienchrist.vercel.app/en/

# 3. Test cookie persistence
curl -H "Cookie: preferred-lang=es" -I https://kikienchrist.vercel.app/
# Doit retourner: Location: https://kikienchrist.vercel.app/es/

# 4. Vérifier pas de cache sur redirect
curl -I https://kikienchrist.vercel.app/ | grep -i cache-control
# Doit contenir: private, no-store
```

## Erreurs fréquentes
| Symptôme | Cause | Fix |
|----------|-------|-----|
| `204 No Content` sur `/fr/` | `return new Response(null, {status:204})` | `return` / `return NextResponse.next()` |
| Boucle redirect infinie | Middleware match `/fr/` → redirect | Exclure `/fr|en|es|...` dans matcher ou check `localeMatch` |
| Cache Vercel sert vieille langue | Pas de `Cache-Control: private, no-store` | Ajouter header sur Response.redirect |
| `NextResponse` not found | Import manquant | `import { NextResponse } from 'next/server'` (Edge compatible) |

## Points d'attention
- **Edge Runtime** = pas `fs`, pas `crypto` natif, pas `buffer` — utiliser Web APIs standards
- **Matcher** : exclure `_next`, `api`, `styles`, `images`, `fonts`, `favicon`, `robots`, `sitemap`, `_vercel`
- **Cookie** : `Secure` = true (HTTPS seulement), `SameSite: 'lax'` (permet navigation cross-site)
- **302 vs 301** : 302 = temporaire (Google suit mais garde URL d'origine en index) — correct pour i18n
- **`x-default`** : racine `/` = page de redirect, pas contenu → hreflang `x-default` sur `/`

---
*Skill créé le 2025-11-20. Middleware = cœur de l'i18n automatique.*