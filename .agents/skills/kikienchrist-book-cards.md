---
name: kikienchrist-book-cards
description: "Composant BookCard — props traduites, offres localisées, dropdown langues, script égalisation hauteur"
version: "1.0"
---

# Skill: kikienchrist-book-cards

## Composant
`src/components/BookCard.astro` — Carte livre réutilisable, **100% pilotée par props** (pas de texte en dur).

## Props (interface)
```typescript
interface Book {
  id: string;           // 'visage' | 'trinite' | 'combat' | 'salut'
  position: number;     // 1-4
  name: string;         // Titre TRADUIT
  isbn: string;
  numberOfPages: number;
  inLanguage: string;   // Code langue (fr, en, es...)
  image: string;        // URL ImgBB couverture (1500px)
  offers: Offer[];      // 3 offres max (Lulu, Payhip, Google Play)
}

interface Offer {
  price: string;
  priceCurrency: string; // 'EUR' | 'USD'
  url: string;           // URL LOCALISÉE (vérifiée WordPress boutique)
  seller: { name: 'Lulu' | 'Payhip' | 'Google Play' };
  availability: string;  // 'https://schema.org/InStock'
}

interface Props {
  book: Book;
  isEven?: boolean;           // Pour alternance ordre responsive
  seriesPrefix?: string;      // "Livre" / "Book" / "Libro" / "Buch"...
  hook?: string;              // Description courte (accroche)
  benefits?: string[];        // 3 bullets points
  metaSuffix?: string;        // "pages" / "pages" / "páginas" / "Seiten"...
  languagesLabel?: string;    // "5 langues disponibles" / "5 languages available"...
  languages?: LanguageItem[]; // Dropdown langues DISPONIBLES POUR CE LIVRE
}

interface LanguageItem {
  code: string;   // 'fr', 'en', 'es'...
  name: string;   // 'Français', 'English', 'Español'...
  fmt: string;    // 'Papier · Ebook · Audio' / 'Paper · Ebook · Audio'...
}
```

## Utilisation dans `[lang]/index.astro`
```astro
---
const translated = bookData[book.id];
const translatedBook = {
  ...book,
  name: translated?.name || book.name,
  inLanguage: locale,
  image: translated?.coverImage || book.image,
  offers: translated?.offers || book.offers
};

<BookCard
  book={translatedBook}
  seriesPrefix={booksTrans.seriesPrefix}
  hook={translated?.description || booksTrans.hook}
  benefits={booksTrans.benefits}
  metaSuffix={booksTrans.metaSuffix}
  languagesLabel={translated?.languagesLabel || booksTrans.languagesLabel}
  languages={translated?.languages || booksTrans.languages}
/>
---
```

## Logique interne (BookCard.astro)
1. **Filtre offres** par seller : `getPaperOffer()` (Lulu), `getEbookOffer()` (Payhip), `getAudioOffer()` (Google Play)
2. **Label "Papier" localisé** : extrait du `fmt` de la langue courante (`languages.find(l => l.code === book.inLanguage)?.fmt.split(' · ')[0]`)
3. **Affichage prix** : format `XX.XX DEVISE` (split price/currency)
4. **Boutons** : `.btn-primary` pour Papier, `.btn-ghost` pour Ebook/Audio
5. **Dropdown langues** : `<details><summary>{languagesLabel}</summary><div class="langs">{languages.map(...)}</div></details>`
   - Liens vers `/{lang.code}/` (page d'accueil langue)

## Égalisation hauteur (JS inline dans `[lang]/index.astro`)
Le script **n'est PAS dans BookCard** (évite duplication 4x) — il est **une seule fois** après `#books-grid` dans la page parente.

```javascript
// Dans [lang]/index.astro après </section>
<script>
(function() {
  function equalize() {
    const grid = document.getElementById('books-grid');
    if (!grid) return;
    const books = grid.querySelectorAll('.book');
    if (books.length === 0) return;
    
    books.forEach(b => b.style.height = 'auto');
    
    const imgs = Array.from(grid.querySelectorAll('.cover'));
    Promise.all(imgs.map(img => img.complete && img.naturalHeight ? Promise.resolve() : new Promise(r => {
      img.onload = img.onerror = r;
      setTimeout(r, 3000);
    }))).then(() => {
      requestAnimationFrame(() => {
        let maxH = 0;
        books.forEach(b => { const h = b.getBoundingClientRect().height; if (h > maxH) maxH = h; });
        if (maxH > 0) books.forEach(b => b.style.height = maxH + 'px');
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(equalize, 0));
  } else {
    setTimeout(equalize, 0);
  }
  window.addEventListener('load', () => setTimeout(equalize, 0));
  window.addEventListener('resize', () => setTimeout(equalize, 0));
})();
</script>
```

## Styles (lafoidieu-design.css + BookCard.astro scoped)
```css
/* Global .bq .book dans lafoidieu-design.css */
.bq .book { /* grid 320px/1fr, padding, shadow, hover */ }

/* Scoped dans BookCard.astro pour alternance responsive */
<style is:global>
  .book:nth-of-type(2n) > div:first-child { order: 2; }
  .book:nth-of-type(2n) > div:last-child { order: 1; }
  @media (min-width: 981px) { .book:nth-of-type(2n) { grid-template-columns: 1fr 320px; } }
  @media (min-width: 761px) and (max-width: 980px) { .book:nth-of-type(2n) { grid-template-columns: 1fr 250px; } }
</style>
```

## Données par livre (traductions.json → bookData)
| Livre | ID | Langues dispo (réelles) | Formats |
|-------|-----|------------------------|---------|
| Visage | `visage` | FR, EN, ES, PT, DE | Tous (Lulu, Payhip, GP) |
| Trinité | `trinite` | FR, EN, ES, PT, DE, IT, RU, ZH, HI | Variables (Lulu: pas ZH; GP: pas IT,RU,ZH,HI) |
| Combat | `combat` | FR, EN, ES, PT, DE, HI | Tous (Lulu, Payhip, GP) |
| Salut | `salut` | FR seulement | Tous (Lulu, Payhip, GP) |

**Règle d'or** : `languages` + `offers` = **UNIQUEMENT ce qui existe vraiment** (source WordPress boutique).

## Checklist nouvelle carte / maj livre
- [ ] `bookData[livre]` complet dans `translations.json` (9 langues)
- [ ] `coverImage` = ImgBB direct (pas Lulu thumb)
- [ ] `offers` = 3 URLs testées (clic → page produit correcte langue/format)
- [ ] `languages` = liste réelle (pas fantasme)
- [ ] `languagesLabel` = texte localisé exact
- [ ] `seriesPrefix` / `hook` / `benefits` / `metaSuffix` traduits
- [ ] Test `/fr/`, `/en/`, etc. : boutons cliquables, dropdown ouvre, liens langues marchent

## Debug courant
| Problème | Cause | Fix |
|----------|-------|-----|
| Bouton "Papier" → URL FR sur site EN | `offers` pas localisé dans `bookData` | Remplir `offers` par langue dans `translations.json` |
| Dropdown montre 9 langues pour Salut | `languages` global au lieu de par livre | `translated?.languages || booksTrans.languages` → vérifier `bookData[salut].languages` |
| Hauteurs inégales | JS pas exécuté / images pas chargées | Vérifier `#books-grid` + script après `</section>` + `setTimeout` |
| Label "Papier" en FR sur site EN | Extraction `fmt` ratée | Vérifier `languages.find(l => l.code === book.inLanguage)` |

---
*Skill créé le 2025-11-20. BookCard = composant critique (conversion achat).*