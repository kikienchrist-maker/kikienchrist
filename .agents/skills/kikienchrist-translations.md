---
name: kikienchrist-translations
description: "Gestion des traductions (UI, livres, métadonnées, URLs achat) via translations.json"
version: "1.0"
---

# Skill: kikienchrist-translations

## Principe
**TOUT le contenu textuel + URLs + métadonnées livres** est dans `src/data/translations.json`.
Le code (`[lang]/index.astro`, composants) ne contient **aucun texte en dur** — tout passe par props traduites.

## Structure `translations.json`
```json
{
  "fr": {
    "hero": { "eyebrow": "...", "title": "...", "subtitle": "...", "ctaPrimary": "...", "ctaGhost": "..." },
    "books": { "seriesPrefix": "Livre", "hook": "...", "benefits": [...], "metaSuffix": "pages", "languagesLabel": "9 langues disponibles", "languages": [...] },
    "bandeau": { "paper": "Papier — Lulu", "ebook": "Ebook — Payhip", "audio": "Audio — Google Play" },
    "newsletter": { "title": "...", "description": "...", "placeholder": "...", "buttonText": "...", "tinyText": "..." },
    "faq": { "title": "...", "items": [{ "q": "...", "a": "..." }] },
    "footer": { "nav": [...], "rights": "...", "madeWith": "...", "languageSwitcher": { "label": "Langue", "ariaLabel": "Changer de langue" } },
    "cta": { "text": "...", "buttonText": "...", "buttonHref": "#livres" },
    "bookData": {
      "visage": { "name": "...", "description": "...", "coverImage": "https://i.ibb.co/...", "offers": [...], "languagesLabel": "5 langues disponibles", "languages": [...] },
      "trinite": { ... },
      "combat": { ... },
      "salut": { ... }
    }
  },
  "en": { ... },
  "es": { ... },
  ...
}
```

## Ajouter / Modifier une traduction

### 1. UI (hero, books, bandeau, newsletter, faq, footer, cta)
- Trouver la clé dans la langue cible (ex: `fr.hero.title`)
- Modifier la valeur
- **Dupliquer pour les 8 autres langues** (même structure, texte traduit)

### 2. Livre (bookData) — **Critique**
Pour chaque livre (`visage`, `trinite`, `combat`, `salut`) et chaque langue :
```json
"bookData": {
  "visage": {
    "name": "Titre TRADUIT",
    "description": "Description TRADUITE (hook)",
    "coverImage": "https://i.ibb.co/.../couverture-traduite.jpg",
    "offers": [
      { "price": "13.90", "priceCurrency": "EUR", "url": "https://www.lulu.com/.../url-localisée", "seller": { "name": "Lulu" }, "availability": "https://schema.org/InStock" },
      { "price": "3.99", "priceCurrency": "USD", "url": "https://payhip.com/b/XXXX", "seller": { "name": "Payhip" }, "availability": "https://schema.org/InStock" },
      { "price": "5.49", "priceCurrency": "USD", "url": "https://play.google.com/.../audio-localisé", "seller": { "name": "Google Play" }, "availability": "https://schema.org/InStock" }
    ],
    "languagesLabel": "X langues disponibles",
    "languages": [
      { "code": "fr", "name": "Français", "fmt": "Papier · Ebook · Audio" },
      { "code": "en", "name": "English", "fmt": "Paper · Ebook · Audio" },
      ...
    ]
  }
}
```
**Règles :**
- `offers` : **UNIQUEMENT les URLs qui existent** pour cette langue (source : WordPress boutique `lafoidieu.wordpress.com/boutique/`)
- `coverImage` : URL ImgBB directe (`.jpg`/`.png`) — **pas** Lulu thumbnail (384px)
- `languages` : liste **réelle** des langues dispo pour CE livre (pas les 9 globalement)
- `languagesLabel` : texte localisé "X languages available" / "X langues disponibles"

### 3. Hero Fan Images (miniatures)
Dans `src/pages/[lang]/index.astro` → variable `fanImages` (array 4 URLs ImgBB) :
```js
const fanImages = locale === 'fr' ? [
  "https://i.ibb.co/.../visage-fr.jpg",
  "https://i.ibb.co/.../trinite-fr.jpg",
  "https://i.ibb.co/.../combat-fr.jpg",
  "https://i.ibb.co/.../salut-fr.jpg"
] : locale === 'en' ? [ ... ] : ...
```
- Ordre = Livre 1, 2, 3, 4 (gauche → droite)
- 9 langues déjà faites (FR skip, EN/ES/DE/PT/IT/RU/ZH/HI ok)

## Workflow complet "Nouvelle langue / Maj livre"

1. **Ouvrir** `src/data/translations.json`
2. **Copier** bloc `fr` → nouvelle langue (ex: `nl` pour néerlandais)
3. **Traduire** toutes les clés UI (`hero`, `books`, `bandeau`, `newsletter`, `faq`, `footer`, `cta`)
4. **Remplir** `bookData` pour les 4 livres :
   - Titres/descriptions traduits
   - `coverImage` ImgBB par langue
   - `offers` URLs **réelles** (vérifier WordPress boutique)
   - `languages` / `languagesLabel` précis par livre
5. **Ajouter** `fanImages` dans `[lang]/index.astro` (4 URLs ImgBB)
6. **Ajouter** la langue dans `src/utils/i18n.ts` → `SUPPORTED_LANGS` + `DEFAULT_LANG`
7. **Build + Deploy** : `npm run build && vercel --prod --force`
8. **Tester** `/nl/` (desktop + mobile)

## Vérifications obligatoires avant deploy
- [ ] JSON valide (pas de virgule trailing, guillemets corrects)
- [ ] Toutes les 9 langues ont même structure clés
- [ ] `offers` URLs testées (clic → page produit correcte)
- [ ] `coverImage` charge (ouvrir URL navigateur)
- [ ] `fanImages` 4 URLs valides
- [ ] `languages` par livre = réalité (pas de langue fantôme)

## Source de vérité URLs achat
**https://lafoidieu.wordpress.com/boutique/** → clic droit "Copier l'adresse du lien" sur chaque bouton langue/format.

---
*Skill créé le 2025-11-20. À utiliser pour toute modif de contenu textuel/URLs.*