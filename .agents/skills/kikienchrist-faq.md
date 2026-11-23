---
name: kikienchrist-faq
description: "Gestion FAQ (accordion accessible, JSON-LD FAQPage, traduction via translations.json)"
version: "1.0"
---

# Skill: kikienchrist-faq

## Composant
`src/components/FAQ.astro` — Accordion accessible (`<details>`/`<summary>`) + JSON-LD `FAQPage`.

## Props (via `translations.json` → `faq`)
```json
"faq": {
  "title": "Questions fréquentes",
  "items": [
    { "q": "Comment commander ?", "a": "Cliquez sur le bouton « Papier » pour Lulu, « Ebook » pour Payhip, « Audio » pour Google Play." },
    { "q": "Quels formats ?", "a": "Papier (broché), Ebook (PDF/EPUB), Audio (MP3). Disponibilité variable selon langue." },
    { "q": "Livraison ?", "a": "Lulu imprime à la demande (5-10 jours). Ebook/Audio : téléchargement instantané." },
    { "q": "Remboursement ?", "a": "Garantie 30 jours satisfait ou remboursé sur Lulu et Payhip." }
  ]
}
```

## HTML généré
```html
<div class="faq" id="faq">
  <h2>{title}</h2>
  <details class="faq-item" open>
    <summary>{q}</summary>
    <div class="faq-answer">{a}</div>
  </details>
  ...
  <!-- JSON-LD FAQPage injecté par le composant -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } },
      ...
    ]
  }
  </script>
</div>
```

## Accessibilité (WCAG 2.1 AA)
- `<details>`/`<summary>` = natif, support clavier (Enter/Espace), focus visible
- `open` sur le premier item = visible par défaut
- `id="faq"` + `aria-labelledby` possible sur `<h2>`
- Contraste : tokens CSS `--ink` / `--muted` / `--paper`

## Style (lafoidieu-design.css)
```css
.faq { margin-top: 48px; }
.faq h2 { font-size: clamp(22px, 3vw, 30px); margin: 0 0 24px; }
.faq-item { border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); margin-bottom: 12px; overflow: hidden; }
.faq-item summary { padding: 18px 24px; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after { content: "+"; font-size: 1.2em; transition: transform 0.2s; }
.faq-item[open] summary::after { transform: rotate(45deg); }
.faq-answer { padding: 0 24px 24px; color: var(--muted); line-height: 1.7; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
```

## JSON-LD FAQPage (SEO)
- Injecté **après** l'accordion dans le même composant
- Structure : `FAQPage` → `mainEntity[]` → `Question` + `acceptedAnswer` → `Answer`
- **Contenu identique** au HTML visible (pas de cloaking)
- Test : Google Rich Results Test → doit détecter `FAQPage` avec 4+ questions

## Traduction
- **Tout dans `translations.json`** → clé `faq.items[]` par langue
- Ordre identique dans toutes les langues (même questions, réponses traduites)
- Si question n'existe pas dans une langue → fallback FR ou masquer l'item

## Améliorations possibles
- [ ] Anchors deeplink : `<details id="faq-1">` + liens `#faq-1` depuis autres pages
- [ ] `FAQPage` JSON-LD avec `author` / `publisher` (Organization Kiki en Christ)
- [ ] Recherche FAQ côté client (filter input)
- [ ] Catégorisation (Général, Commande, Formats, Livraison)
- [ ] Analytics : event `faq_open` / `faq_close` (data-layer GTM)

## Checklist avant deploy
- [ ] `translations.json` : toutes langues ont même nombre d'items
- [ ] Réponses < 300 caractères (recommandé Google)
- [ ] JSON-LD valide (tester sur `search.google.com/test/rich-results`)
- [ ] Accordion fonctionne clavier (Tab → Enter → contenu visible)
- [ ] Style cohérent (tokens CSS, pas de valeurs en dur)

---
*Skill créé le 2025-11-20. FAQ = trust signal + SEO (rich snippets) + UX.*