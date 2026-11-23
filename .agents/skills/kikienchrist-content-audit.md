---
name: kikienchrist-content-audit
description: "Audit complet du contenu (translations.json, Hero Fan, BookCards, FAQ, Newsletter) — checklist qualité avant deploy"
version: "1.0"
---

# Skill: kikienchrist-content-audit

## Objectif
Vérification systématique de **TOUT le contenu visible** avant chaque déploiement majeur.

## 1. translations.json — Structure & Cohérence

### Clés obligatoires par langue (9 langues)
```json
{
  "fr": { "hero": {}, "books": {}, "bandeau": {}, "newsletter": {}, "faq": {}, "footer": {}, "cta": {}, "bookData": {} },
  "en": { ... },  // MÊME structure
  "es": { ... },
  "de": { ... },
  "pt": { ... },
  "it": { ... },
  "ru": { ... },
  "zh": { ... },
  "hi": { ... }
}
```

### Checklist structure
- [ ] 9 langues présentes
- [ ] Chaque langue a les 8 sections racine
- [ ] Pas de clé manquante (comparer à `fr` comme référence)
- [ ] JSON valide (pas de trailing comma, guillemets droits)
- [ ] Encodage UTF-8 (caractères spéciaux : `é`, `ñ`, `ü`, `中文`, `हिन्दी`, `русский`)

## 2. Hero Section (par langue)

### Champs requis (`hero`)
- [ ] `eyebrow` : label court ("Nouveauté", "New", "Novedad"...)
- [ ] `title` : H1 principal (traduit, < 70 chars idéal)
- [ ] `subtitle` : description (traduit, < 160 chars pour meta desc)
- [ ] `ctaPrimary` : "Découvrir les livres" / "Discover the books"...
- [ ] `ctaGhost` : "Obtenir le guide gratuit" / "Get the free guide"...

### Hero Fan Images (4 miniatures)
- [ ] `fanImages` dans `[lang]/index.astro` = 4 URLs ImgBB valides
- [ ] Ordre : Visage, Trinité, Combat, Salut
- [ ] Résolution correcte (ratio ~2:3)
- [ ] FR : OK si Lulu thumbs (384px) — sinon ImgBB

## 3. Books Section (par langue)

### Champs `books` (UI commune)
- [ ] `seriesPrefix` : "Livre" / "Book" / "Libro" / "Buch" / "Livro" / "Libro" / "Книга" / "书" / "पुस्तक"
- [ ] `hook` : phrase d'accroche commune
- [ ] `benefits` : array 3 strings (bullets)
- [ ] `metaSuffix` : "pages" / "pages" / "páginas" / "Seiten" / "páginas" / "pagine" / "стр." / "页" / "पृष्ठ"
- [ ] `languagesLabel` : "X langues disponibles" (global, fallback)

### Champs `bookData` (PAR LIVRE × PAR LANGUE) — **CRITIQUE**
Pour chaque livre (`visage`, `trinite`, `combat`, `salut`) × 9 langues :
- [ ] `name` : Titre **traduit** (pas FR sur site EN)
- [ ] `description` : Hook **traduit** (différent de `books.hook` si spécifique)
- [ ] `coverImage` : URL ImgBB **directe** (`.jpg`/`.png`), haute résol
- [ ] `offers` : Array d'objets **seulement pour formats existants** :
  - [ ] `price` + `priceCurrency` corrects
  - [ ] `url` **testée** (clic → page produit langue/format OK)
  - [ ] `seller.name` exact : `"Lulu"` / `"Payhip"` / `"Google Play"`
  - [ ] `availability` : `"https://schema.org/InStock"`
- [ ] `languagesLabel` : "X langues disponibles" **spécifique au livre**
- [ ] `languages` : Array `LanguageItem[]` **réel** pour ce livre :
  - [ ] `code` : ISO 639-1 (`fr`, `en`, `es`...)
  - [ ] `name` : Nom langue **dans la langue courante** (ex: sur site EN → `English`, sur site ES → `Inglés`)
  - [ ] `fmt` : Formats **localisés** (`Papier · Ebook · Audio` / `Paper · Ebook · Audio`...)

## 4. Bandeau Formats (par langue)
- [ ] `paper` : "Papier — Lulu" / "Paper — Lulu" / "Papel — Lulu"...
- [ ] `ebook` : "Ebook — Payhip" / "Ebook — Payhip" / "Ebook — Payhip"...
- [ ] `audio` : "Audio — Google Play" / "Audio — Google Play" / "Audio — Google Play"...

## 5. Newsletter (par langue)
- [ ] `title` : "Recevez « 7 prières » gratuitement" / trad
- [ ] `description` : Texte descriptif
- [ ] `placeholder` : "Votre email" / "Your email" / "Tu email"...
- [ ] `buttonText` : "Je veux le guide" / "I want the guide"...
- [ ] `tinyText` : Mentions RGPD (spam, désinscription, confidentialité)

## 6. FAQ (par langue)
- [ ] `title` : "Questions fréquentes" / trad
- [ ] `items` : Array 4+ objets `{ q: "", a: "" }`
- [ ] Même nombre d'items dans toutes les langues
- [ ] Réponses < 300 chars (recommandé Google FAQ schema)
- [ ] JSON-LD `FAQPage` généré (vérifier dans HTML)

## 7. Footer (par langue)
- [ ] `nav` : Array labels navigation (ex: `["Accueil", "Livres", "Newsletter", "FAQ", "Contact"]`)
- [ ] `rights` : "© 2025 Kiki en Christ. Tous droits réservés." / trad
- [ ] `madeWith` : "Fait avec foi et Astro." / trad
- [ ] `languageSwitcher.label` : "Langue" / "Language" / "Idioma"...
- [ ] `languageSwitcher.ariaLabel` : "Changer de langue" / trad

## 8. CTA Strip (par langue)
- [ ] `text` : Texte d'accroche
- [ ] `buttonText` : "Voir les 4 livres" / "View the 4 books"...
- [ ] `buttonHref` : `#livres` (ancre vers section livres)

## 9. Hero Fan Images — État par langue (2025-11-20)
| Langue | Livre 1 | Livre 2 | Livre 3 | Livre 4 | Total |
|--------|---------|---------|---------|---------|-------|
| FR | Lulu | Lulu | Lulu | Lulu | 0/4 ImgBB |
| EN | ✅ | ✅ | ✅ | ✅ | 4/4 |
| ES | ✅ | ✅ | ✅ | ✅ | 4/4 |
| DE | ✅ | ✅ | ✅ | ✅ | 4/4 |
| PT | ✅ | ✅ | ✅ | ✅ | 4/4 |
| IT | ✅ | ✅ | ✅ | ✅ | 4/4 |
| RU | ✅ | ✅ | ✅ | ✅ | 4/4 |
| ZH | ✅ | ✅ | ✅ | ✅ | 4/4 |
| HI | ✅ | ✅ | ✅ | ✅ | 4/4 |

## 10. Test Visuel Rapide (Post-Deploy)
Ouvrir chaque langue : `/fr/`, `/en/`, `/es/`, `/de/`, `/pt/`, `/it/`, `/ru/`, `/zh/`, `/hi/`
- [ ] Hero : titre, sous-titre, 2 boutons, 4 miniatures visibles
- [ ] Bandeau formats : 3 labels corrects
- [ ] 4 cartes livres : titre, hook, bullets, meta, prix, 3 boutons, dropdown langues
- [ ] Dropdown : clic → liste liens langues → clic lien → va vers `/{lang}/`
- [ ] Boutons achat : clic → ouvre page produit **bonne langue/format**
- [ ] Newsletter : champ email, bouton, mentions RGPD
- [ ] FAQ : 4+ items, accordéon ouvrant/fermant
- [ ] Footer : nav, mentions, language switcher fonctionnel
- [ ] Mobile (≤760px) : 1 col, couv. centrée, fan 90px, lisible

## Commandes audit automatisé
```bash
# 1. Structure translations.json
cd "C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync"
node -e "const t=require('./src/data/translations.json'); console.log('Langues:', Object.keys(t).length); console.log('Sections FR:', Object.keys(t.fr));"

# 2. Vérifier bookData complet
node -e "const t=require('./src/data/translations.json'); Object.keys(t).forEach(l=>{ const b=t[l].bookData; console.log(l, Object.keys(b).map(k=>k+'='+Object.keys(b[k]).join(','))); });"

# 3. Build + check HTML
npm run build
# Ouvrir dist/fr/index.html → chercher: hreflang, JSON-LD Book, JSON-LD FAQ, canonical, meta tags
```

## Sign-off déploy
```
✅ translations.json structure OK
✅ Hero Fan 4/4 (sauf FR 0/4 connu)
✅ BookData 4 livres × 9 langues complet
✅ Offres URLs testées clic
✅ Dropdown langues par livre exact
✅ FAQ JSON-LD valide
✅ Newsletter Netlify Forms ready
✅ Mobile responsive OK
✅ Build sans erreur
✅ Deploy --force OK
→ GO PROD
```

---
*Skill créé le 2025-11-20. Audit = zéro surprise en prod.*