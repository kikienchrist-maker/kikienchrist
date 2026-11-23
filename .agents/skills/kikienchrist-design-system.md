---
name: kikienchrist-design-system
description: "Design System 'La Foi en Dieu' — tokens CSS, composants, responsive, thèmes, accessibilité"
version: "1.0"
---

# Skill: kikienchrist-design-system

## Fichier principal
`public/styles/lafoidieu-design.css` (copié depuis `src/styles/lafoidieu-design.css` à la build)

## Architecture
- **Tokens CSS** (custom properties) → racine `:root` + `.bq` scope
- **Composants** : `.btn`, `.book`, `.band`, `.fan`, `.cover`, `.leadbox`, `.faq`, `.cta-strip`, `.footer`
- **Layout** : `.wrap` (max-width 1120px), `.bq` (body wrapper), `.books-grid` (grid cartes)
- **Responsive** : Breakpoints 980px, 760px, 480px (mobile-first dans composants, desktop-first dans tokens)

## Tokens CSS (extrait)
```css
:root {
  /* Couleurs */
  --ink: #1c1a17;           /* Texte principal */
  --paper: #fdfbf7;         /* Fond principal */
  --cream: #f7f3ec;         /* Fond secondaire (leadbox) */
  --line: #e8e1d5;          /* Bordures */
  --gold-ink: #b8860b;      /* Accent or (eyebrow, liens hover) */
  --accent: #c46b1a;        /* Accent tertiaire (boutons primary) */
  --muted: #8a7d6b;         /* Texte secondaire */
  --focus: #c46b1a;         /* Focus ring */
  
  /* Espacement */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;
  --space-2xl: 80px;
  
  /* Typo */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: Georgia, Cambria, 'Times New Roman', serif;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 22px;
  --text-2xl: 30px;
  --text-3xl: 42px;
  
  /* Ombres */
  --shadow-sm: 0 1px 2px rgba(28,26,23,.08);
  --shadow-md: 0 4px 12px rgba(28,26,23,.12);
  --shadow-lg: 0 18px 44px -26px rgba(28,26,23,.38);
  --shadow-xl: 0 30px 64px -30px rgba(28,26,23,.46);
  
  /* Rayons */
  --radius: 8px;
  --radius-lg: 14px;
  --radius-full: 100px;
  
  /* Transitions */
  --transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Composants clés

### `.book` (Carte livre)
```css
.bq .book {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: clamp(28px, 4vw, 52px);
  align-items: start;
  padding: clamp(24px, 3.4vw, 42px);
  margin: 0 0 28px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: inset 0 1px 0 #fff, var(--shadow-lg);
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}
.bq .book:hover {
  transform: translateY(-3px);
  box-shadow: inset 0 1px 0 #fff, var(--shadow-xl);
  border-color: #dcd2bf;
}
/* Responsive */
@media (max-width: 980px) { .bq .book { grid-template-columns: 250px 1fr; gap: 30px; } }
@media (max-width: 760px) { 
  .bq .book { grid-template-columns: 1fr; padding: 24px 22px 28px; }
  .bq .book > div:first-child { max-width: 290px; margin: 0 auto 4px; }
  .bq .book .series { display: block; width: fit-content; margin: 0 auto 16px; }
  .bq .book h3 { text-align: center; }
}
```

### `.btn` (Boutons)
```css
.bq .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font: 700 14px/1 var(--font-sans); text-decoration: none; border-radius: var(--radius); padding: 14px 24px; transition: all var(--transition); border: 1px solid transparent; cursor: pointer; }
.bq .btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.bq .btn-primary:hover { background: #b05d16; border-color: #b05d16; transform: translateY(-1px); box-shadow: var(--shadow-md); }
.bq .btn-ghost { background: transparent; color: var(--ink); border-color: var(--line); }
.bq .btn-ghost:hover { background: var(--cream); border-color: var(--gold-ink); color: var(--gold-ink); }
.bq .btn-small { padding: 10px 16px; font-size: 13px; }
```

### `.fan` (Hero miniatures)
```css
.fan { display: flex; justify-content: center; gap: 0; margin: 32px 0; perspective: 800px; }
.fan img { width: 120px; height: 180px; object-fit: cover; border-radius: 4px; box-shadow: var(--shadow-lg); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
.fan .fan-1 { transform: rotate(-6deg) translateY(4px); z-index: 1; }
.fan .fan-2 { transform: rotate(-2deg) translateY(2px); z-index: 2; margin-left: -24px; }
.fan .fan-3 { transform: rotate(2deg) translateY(2px); z-index: 3; margin-left: -24px; }
.fan .fan-4 { transform: rotate(6deg) translateY(4px); z-index: 4; margin-left: -24px; }
.fan:hover img { transform: rotate(0deg) translateY(0) scale(1.02); margin-left: 0; z-index: 10; }
@media (max-width: 760px) { .fan img { width: 90px; height: 135px; } .fan img + img { margin-left: -18px; } }
```

### `.band` (Bandeau formats)
```css
.band { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin: 24px 0 32px; padding: 16px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.band span { font: 600 13px/1 var(--font-sans); color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
.band strong { color: var(--ink); font-weight: 700; }
```

## Responsive Breakpoints
| Breakpoint | Cible | Changements |
|------------|-------|-------------|
| `≥981px` | Desktop | 2 col livres (320px + 1fr), alternance ordre pair/impair, fan 120px |
| `761-980px` | Tablette | 2 col livres (250px + 1fr), fan 120px |
| `≤760px` | Mobile | 1 col livres (couv. centrée max 290px), fan 90px, stack formulaires |
| `≤480px` | Petit mobile | Padding réduit, typo smaller, boutons full-width |

## Accessibilité
- **Focus visible** : `outline: 2px solid var(--focus); outline-offset: 2px;` sur tous `:focus-visible`
- **Contraste** : `--ink` (#1c1a17) sur `--paper` (#fdfbf7) = 14.8:1 (AAA)
- **Reduced motion** : `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }`
- **Print** : `@media print { .btn, .cta-strip, .band { display: none; } .book { box-shadow: none; border-color: #ccc; page-break-inside: avoid; } }`

## Thèmes / Variantes
- **Light only** (pas de dark mode) — design "papier ancien"
- **Couleur accent** : `--gold-ink` (or) pour liens/eyebrow, `--accent` (terracotta) pour boutons primary
- **Police** : System UI stack (performance, pas de web font)

## Intégration Astro
- Import global dans `src/layouts/MainLayout.astro` :
  ```astro
  <link rel="stylesheet" href="/styles/lafoidieu-design.css" />
  ```
- Composants utilisent classes `.bq .composant` (scope `.bq` sur `<body class="bq">`)

## Checklist modifications design
- [ ] Modifier tokens `:root` → propage partout
- [ ] Tester 4 breakpoints (desktop, tablette, mobile, petit mobile)
- [ ] Vérifier focus visible (Tab navigation)
- [ ] Vérifier reduced motion
- [ ] Vérifier print
- [ ] Build + deploy (`npm run build && vercel --prod --force`)

---
*Skill créé le 2025-11-20. Design System = cohérence visuelle + maintenabilité + accessibilité native.*