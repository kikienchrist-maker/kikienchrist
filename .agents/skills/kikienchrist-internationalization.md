---
name: kikienchrist-internationalization
description: "Internationalisation Avancée (i18n) — Routing, Détection, Formats, Pluriels, RTL, SEO Local, Hreflang, x-default"
version: "1.0"
---

# Skill: kikienchrist-internationalization

## État Actuel (Résumé)
- **9 langues** : `fr` (défaut), `en`, `es`, `de`, `pt`, `it`, `ru`, `zh`, `hi`
- **Routing** : `[lang]/index.astro` (Astro dynamic routes) + Middleware Edge redirect
- **Contenu** : `translations.json` (monolithique) → Split prévu pour CMS
- **Détection** : `Accept-Language` header + Cookie `preferred-lang` (1 an)
- **Fallback** : `_redirects` + Client-side JS
- **Hreflang** : 9 + `x-default` sur racine
- **JSON-LD** : Traduit par langue (`inLanguage`, `name`, `description`, `offers`)

---

## 1. Routing & URL Structure

### Pattern Actuel
```
https://kikienchrist.vercel.app/           → Redirect 302 vers /{lang}/
https://kikienchrist.vercel.app/fr/        → Page d'accueil FR
https://kikienchrist.vercel.app/en/        → Page d'accueil EN
https://kikienchrist.vercel.app/fr/blog/   → Index blog FR
https://kikienchrist.vercel.app/en/blog/how-to-pray/  → Article blog EN
```

### Trailing Slash (Obligatoire)
- `trailingSlash: 'always'` dans `astro.config.mjs`
- Toutes URLs se terminent par `/` → Cohérence + SEO + hreflang

### Middleware Matcher (Exclusions Critiques)
```typescript
// src/middleware.ts
export const config = {
  matcher: [
    '/((?!_next|api|styles|images|fonts|favicon|robots|sitemap|_vercel|blog/rss|admin).*)',
  ],
};
// Exclut : assets, API, admin CMS, RSS, Vercel internals
```

---

## 2. Détection Langue (Algorithme)

### Priorités (Ordre Décroissant)
1. **Cookie `preferred-lang`** (si valide ∈ SUPPORTED_LANGS) — Choix utilisateur explicite
2. **Header `Accept-Language`** — Parsing q-values, fallback première langue supportée
3. **`DEFAULT_LANG` (`fr`)** — Fallback final

### Implémentation (`src/utils/i18n.ts`)
```typescript
export function detectLanguageFromHeader(header: string): SupportedLang {
  const prefs = header.split(',').map(p => {
    const [lang, q] = p.split(';');
    return { lang: lang.trim().split('-')[0].toLowerCase(), q: q ? parseFloat(q.split('=')[1]) : 1 };
  }).sort((a, b) => b.q - a.q);
  
  for (const p of prefs) {
    if (SUPPORTED_LANGS.includes(p.lang as SupportedLang)) return p.lang as SupportedLang;
  }
  return DEFAULT_LANG;
}
```

### Cas Particuliers
| Scenario | Comportement |
|----------|--------------|
| `Accept-Language: fr-FR,fr;q=0.9,en;q=0.8` | → `fr` (q=1 > 0.9) |
| `Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8` | → `zh` (code base `zh` supporté) |
| `Accept-Language: ja-JP,ja;q=0.9` | → `fr` (fallback, `ja` non supporté) |
| Cookie `preferred-lang=es` + Header `en` | → `es` (cookie prime) |
| Cookie invalide (`xx`) + Header `de` | → `de` (cookie ignoré) |

---

## 3. Formats Locaux (Dates, Nombres, Devises)

### Utilitaires Recommandés (`src/utils/format.ts`)
```typescript
// Formats par langue
export const LOCALE_FORMATS: Record<SupportedLang, { locale: string; currency: string }> = {
  fr: { locale: 'fr-FR', currency: 'EUR' },
  en: { locale: 'en-US', currency: 'USD' },
  es: { locale: 'es-ES', currency: 'EUR' },
  de: { locale: 'de-DE', currency: 'EUR' },
  pt: { locale: 'pt-PT', currency: 'EUR' },
  it: { locale: 'it-IT', currency: 'EUR' },
  ru: { locale: 'ru-RU', currency: 'RUB' }, // Ou EUR si prix EUR
  zh: { locale: 'zh-CN', currency: 'CNY' }, // Ou USD
  hi: { locale: 'hi-IN', currency: 'INR' }, // Ou USD
};

export function formatPrice(price: string, lang: SupportedLang): string {
  const { locale, currency } = LOCALE_FORMATS[lang];
  const num = parseFloat(price);
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2 }).format(num);
}

export function formatDate(date: Date | string, lang: SupportedLang): string {
  const { locale } = LOCALE_FORMATS[lang];
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

export function formatNumber(num: number, lang: SupportedLang): string {
  const { locale } = LOCALE_FORMATS[lang];
  return new Intl.NumberFormat(locale).format(num);
}
```

### Usage dans Composants
```astro
---
import { formatPrice, formatDate } from '../../utils/format';
const price = '13.90';
const pubDate = '2025-12-01';
---
<p>Prix : {formatPrice(price, locale)}</p>  <!-- €13,90 (FR) / $13.90 (US) / 13,90 € (DE) -->
<time>{formatDate(pubDate, locale)}</time>  <!-- 1 décembre 2025 (FR) / December 1, 2025 (EN) -->
```

---

## 4. Pluriels (ICU MessageFormat)

### Problème Actuel
`metaSuffix: "pages"` / `"pages"` / `"páginas"` / `"Seiten"` — **Pas de pluriel** (singulier seulement).

### Solution : `@formatjs/intl-pluralrules` + Messages ICU
```bash
npm install @formatjs/intl-pluralrules
```

### Messages ICU dans `translations.json`
```json
"books": {
  "metaSuffix": {
    "one": "page",
    "other": "pages"
  }
  // FR: { "one": "page", "other": "pages" }
  // EN: { "one": "page", "other": "pages" }
  // ES: { "one": "página", "other": "páginas" }
  // ZH: { "other": "页" } (pas de pluriel)
  // HI: { "one": "पृष्ठ", "other": "पृष्ठ" }
}
```

### Helper Pluriel
```typescript
// src/utils/plural.ts
import { plural } from '@formatjs/intl-pluralrules';

export function getPluralMessage(messages: Record<string, string>, count: number, lang: SupportedLang): string {
  const category = plural(count, { locale: LOCALE_FORMATS[lang].locale });
  return messages[category] || messages.other || '';
}

// Usage
const pages = 331;
const suffix = getPluralMessage(t.books.metaSuffix, pages, locale); // "pages" (FR)
```

---

## 5. RTL (Right-to-Left) — Arabe, Hébreu, Persan

### Langues RTL Supportées
| Code | Langue | Script | RTL |
|------|--------|--------|-----|
| `ar` | Arabe | Arabe | ✅ |
| `he` | Hébreu | Hébreu | ✅ |
| `fa` | Persan | Arabe | ✅ |
| `ur` | Ourdou | Arabe | ✅ |

**Actuel** : Pas de langue RTL dans les 9 (`ru` = cyrillique LTR, `zh` = chinois LTR, `hi` = devanagari LTR).

### Préparation Futur (Si Ajout `ar`/`he`)
```css
/* lafoidieu-design.css — Ajout conditionnel */
[dir="rtl"] .book {
  direction: rtl;
}
[dir="rtl"] .book:nth-of-type(2n) > div:first-child { order: 1; } /* Inverser alternance */
[dir="rtl"] .book:nth-of-type(2n) > div:last-child { order: 2; }
[dir="rtl"] .fan .fan-1 { transform: rotate(6deg) translateY(4px); } /* Mirroir */
[dir="rtl"] .fan .fan-4 { transform: rotate(-6deg) translateY(4px); }
[dir="rtl"] .language-switcher { flex-direction: row-reverse; }
```

```astro
<!-- MainLayout.astro -->
<html lang={locale} dir={RTL_LANGS.includes(locale) ? 'rtl' : 'ltr'}>
```

---

## 6. SEO Local par Langue

### Meta Tags Traduit (Déjà Fait via `translations.json`)
- `title`, `description`, `og:title`, `og:description`, `og:locale`

### Mots-clés par Langue (À Ajouter dans `translations.json`)
```json
"seo": {
  "keywords": "spiritualité, prière, foi, livres chrétiens, développement personnel",
  "robots": "index, follow"
}
```

### Sitemap Hreflang (Auto via `@astrojs/sitemap`)
```xml
<url>
  <loc>https://kikienchrist.vercel.app/fr/</loc>
  <xhtml:link rel="alternate" hreflang="fr" href="https://kikienchrist.vercel.app/fr/" />
  <xhtml:link rel="alternate" hreflang="en" href="https://kikienchrist.vercel.app/en/" />
  ...
  <xhtml:link rel="alternate" hreflang="x-default" href="https://kikienchrist.vercel.app/" />
</url>
```

### Google Search Console par Langue
- Propriété **URL Prefix** : `https://kikienchrist.vercel.app/fr/`, `/en/`, etc.
- Soumettre sitemap par langue (filtré) ou global
- Surveiller indexation par langue

---

## 7. Hreflang Avancé

### Génération Dynamique (`src/utils/i18n.ts`)
```typescript
export function generateHreflangLinks(pathname: string, currentLang: SupportedLang): string[] {
  const base = 'https://kikienchrist.vercel.app';
  const links = SUPPORTED_LANGS.map(lang => 
    `<link rel="alternate" hreflang="${lang}" href="${base}/${lang}${pathname}" />`
  );
  // x-default sur racine (redirect middleware)
  links.push(`<link rel="alternate" hreflang="x-default" href="${base}/" />`);
  return links;
}
```

### Cas Particuliers
| Page | `pathname` | Hreflang |
|------|------------|----------|
| Home FR | `/` | `/fr/`, `/en/`, ..., `x-default` → `/` |
| Blog FR | `/blog/` | `/fr/blog/`, `/en/blog/`, ..., `x-default` → `/` |
| Article FR | `/blog/comment-prier/` | `/fr/blog/comment-prier/`, `/en/blog/how-to-pray/`, ... |
| Livre 4 (Salut - FR only) | `/fr/` | Hreflang normal (page existe) mais pas d'équivalent `/en/` pour ce livre |

### Validation Hreflang
```bash
# Outil : technicalseo.com/tools/hreflang/
# Vérifier : 
# - Tous codes ISO 639-1 valides
# - x-default présent
# - URLs canoniques (200 OK)
# - Réciprocité (si /fr/ link /en/, /en/ doit link /fr/)
```

---

## 8. Workflow Ajout Langue (Checklist Complète)

### Prérequis
- [ ] Traduction complète UI (`hero`, `books`, `bandeau`, `newsletter`, `faq`, `footer`, `cta`)
- [ ] Traduction 4 livres (`bookData` × 4 : `name`, `description`, `coverImage`, `offers`, `languages`, `languagesLabel`)
- [ ] 4 URLs ImgBB Hero Fan (`fanImages` dans `[lang]/index.astro`)
- [ ] URLs achat localisées vérifiées (Lulu `/xx/`, Payhip, GP)
- [ ] Formats locaux définis (`LOCALE_FORMATS` : locale, currency)
- [ ] Pluriels ICU définis (`metaSuffix`, `benefits` count, etc.)
- [ ] Code ajouté dans `SUPPORTED_LANGS` + `DEFAULT_LANG` si applicable

### Technique
- [ ] `src/utils/i18n.ts` : Ajouter dans `SUPPORTED_LANGS`
- [ ] `src/utils/format.ts` : Ajouter `LOCALE_FORMATS[lang]`
- [ ] `src/middleware.ts` : Matcher auto (via `SUPPORTED_LANGS` import)
- [ ] `astro.config.mjs` : Trailing slash + sitemap config
- [ ] `vercel.json` : Rewrites wildcard (pas de modif nécessaire)

### Test
- [ ] Build local : `npm run build` → Page générée
- [ ] Dev : `vercel dev` → `/xx/` accessible, redirect racine → `/xx/`
- [ ] Hero Fan : 4 images chargées
- [ ] BookCards : 4 livres, boutons URLs correctes, dropdown langues exact
- [ ] Newsletter : Formulaire fonctionnel (Netlify Forms)
- [ ] FAQ : Accordéon + JSON-LD
- [ ] Mobile : Responsive ≤760px
- [ ] SEO : Hreflang 10 links, canonical, JSON-LD valide
- [ ] Deploy Preview → Test complet

### Post-Deploy
- [ ] Search Console : Ajouter propriété `/xx/`
- [ ] Sitemap : Vérifier inclusion
- [ ] Analytics : Segment langue dans GA4/Vercel
- [ ] Monitoring : UptimeRobot + Checkly pour `/xx/`

---

## 9. Outils i18n Utiles

| Outil | Usage |
|-------|-------|
| **ICU MessageFormat** | Pluriels, genres, sélecteurs (`@formatjs/icu-messageformat-parser`) |
| **Intl.DateTimeFormat** | Dates localisées (natif JS) |
| **Intl.NumberFormat** | Nombres, devises localisés (natif JS) |
| **@formatjs/intl-pluralrules** | Catégories pluriel (one, few, many, other) |
| **hreflang Checker** | `technicalseo.com/tools/hreflang/` |
| **Google Translate API / DeepL API** | Traduction assistée (puis relecture humaine) |
| **Lokalise / Crowdin / Phrase** | TMS (Translation Management System) si volume gros |

---

*Skill créé le 2025-11-20. i18n = fondation multilingue robuste + SEO local + UX native.*