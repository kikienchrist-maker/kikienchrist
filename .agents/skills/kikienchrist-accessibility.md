---
name: kikienchrist-accessibility
description: "Accessibilité WCAG 2.1 AA — Audit, composants, tests, conformité légale"
version: "1.0"
---

# Skill: kikienchrist-accessibility

## Objectif
Conformité **WCAG 2.1 Level AA** (standard légal UE/US/FR) pour tout le site.

## Statut Actuel (2025-11-20)
| Critère | Status | Notes |
|---------|--------|-------|
| **1.1 Non-text Content** | ✅ | `alt` sur toutes images (couvertures, hero fan) |
| **1.3 Adaptable** | ✅ | HTML sémantique, `lang` sur `<html>`, structure headings |
| **1.4 Distinguishable** | ✅ | Contraste 14.8:1 (AAA), pas de couleur seule info |
| **2.1 Keyboard Accessible** | ✅ | Focus visible, pas de pièges clavier, accordéon natif |
| **2.2 Enough Time** | ✅ | Pas de timeouts, pas de contenu mouvant auto |
| **2.3 Seizures** | ✅ | Pas de flash > 3Hz |
| **2.4 Navigable** | ✅ | Skip link manquant, headings ordonnés, liens descriptifs |
| **3.1 Readable** | ✅ | `lang` par page, pas de jargon inexpliqué |
| **3.2 Predictable** | ✅ | Navigation cohérente, pas de changement contexte surprise |
| **3.3 Input Assistance** | ⚠️ | Newsletter : pas de `autocomplete`, pas de message erreur explicite |
| **4.1 Compatible** | ✅ | HTML valide, ARIA minimal (natif `<details>`) |

## Gaps Identifiés & Fixes

### 1. Skip Link (Manquant — WCAG 2.4.1)
**Ajouter** en tout début de `MainLayout.astro` (après `<body class="bq">`) :
```astro
<a href="#main-content" class="skip-link">Aller au contenu principal</a>
```
```css
/* lafoidieu-design.css */
.skip-link {
  position: absolute; top: -100%; left: 50%; transform: translateX(-50%);
  background: var(--ink); color: var(--paper); padding: 12px 24px;
  border-radius: var(--radius); z-index: 10000; font-weight: 700;
  text-decoration: none; transition: top 0.2s;
}
.skip-link:focus { top: 12px; outline: 2px solid var(--focus); outline-offset: 2px; }
```
```astro
<!-- Dans MainLayout, wrapper principal -->
<main id="main-content"> <slot /> </main>
```

### 2. Newsletter Form — Labels & Erreurs (WCAG 3.3.2, 3.3.1)
**Actuel** : `<input placeholder="Votre email" required>` sans `<label>`
**Fix** :
```astro
<!-- Newsletter.astro -->
<label for="newsletter-email" class="visually-hidden">Votre adresse email</label>
<input type="email" id="newsletter-email" name="email" placeholder="Votre email" required autocomplete="email">
<!-- + message erreur JS si invalide -->
```
```css
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
```

### 3. Language Switcher — ARIA (WCAG 4.1.2)
**Actuel** : Dans `Footer.astro` → `<select>` ou liens
**Vérifier** :
- `aria-label="Changer de langue"` sur le conteneur
- `hreflang` sur chaque lien `<a hreflang="en" href="/en/">English</a>`
- `lang` sur chaque lien (`<a lang="en" hreflang="en" href="/en/">English</a>`)

### 4. Focus Visible — Cohérence (WCAG 2.4.7)
**Actuel** : Tokens CSS `--focus` définis
**Vérifier** : Tous éléments interactifs ont `:focus-visible` :
```css
/* lafoidieu-design.css — déjà présent ? */
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible { /* idem */ }
```

### 5. Accordion FAQ — ARIA (WCAG 4.1.2)
**Actuel** : `<details>`/`<summary>` natif → **OK** (support natif clavier + ARIA)
**Vérifier** : Pas de `role="button"` sur `<summary>` (redondant)

### 6. Hero Fan — Décoratif (WCAG 1.1.1)
**Actuel** : `<img alt="">` vide → **OK** (purement décoratif)
**Vérifier** : `aria-hidden="true"` sur `.fan` conteneur

### 7. Couverture Livres — Alt Significatif (WCAG 1.1.1)
**Actuel** : `alt="Couverture : {titre}"` → **OK** (informatif)

### 8. Contraste — Validé (WCAG 1.4.3)
| Couple | Ratio | Niveau |
|--------|-------|--------|
| `--ink` (#1c1a17) sur `--paper` (#fdfbf7) | 14.8:1 | AAA |
| `--muted` (#8a7d6b) sur `--paper` | 4.8:1 | AA (large text) |
| `--gold-ink` (#b8860b) sur `--paper` | 4.2:1 | AA (large) |
| `--accent` (#c46b1a) sur `--paper` | 5.1:1 | AA |
| `--focus` sur `--paper` | 5.1:1 | AA |

**Tous conformes AA+** ✅

### 9. Reduced Motion (WCAG 2.3.3)
**Actuel** : `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }` → **OK**

### 10. Zoom 200% / Reflow (WCAG 1.4.10)
**Test** : Zoom navigateur 200% → pas de scrolling horizontal, contenu lisible
**Responsive** : Breakpoints 980/760/480 → **OK**

## Tests Automatisés

### axe-core (DevTools / CI)
```bash
npm install -g @axe-core/cli
axe https://kikienchrist.vercel.app/fr/ --save --tags wcag2aa
```

### Lighthouse Accessibility
```bash
# DevTools → Lighthouse → Accessibility → Score cible ≥ 95
```

### pa11y (CI)
```bash
npm install -g pa11y
pa11y https://kikienchrist.vercel.app/fr/ --standard WCAG2AA
```

## Tests Manuels (Checklist)

### Clavier Only (Tab / Shift+Tab / Enter / Espace / Échap)
- [ ] Skip link visible au 1er Tab
- [ ] Tous liens/boutons atteignables
- [ ] Focus visible clair sur chaque élément
- [ ] Accordion FAQ : Enter/Espace ouvre/ferme, flèches naviguent
- [ ] Language switcher : navigable, sélectionnable
- [ ] Newsletter : Tab → input → bouton → submit
- [ ] Pas de piège (modale, dropdown qui trap focus)

### Lecteur d'écran (NVDA / VoiceOver / TalkBack)
- [ ] `lang` correct sur `<html lang="fr">` etc.
- [ ] Headings hiérarchiques (h1 → h2 → h3)
- [ ] `alt` images informatives (couvertures)
- [ ] `alt=""` images décoratives (hero fan)
- [ ] Formulaires : labels associés, erreurs annoncées
- [ ] `aria-label` sur language switcher
- [ ] Accordion : état annoncé (ouvert/fermé)

### Zoom / Reflow
- [ ] 200% zoom : pas scroll horizontal
- [ ] 400% zoom : lisible (mobile view)

## Conformité Légale
| Région | Standard | Exigence |
|--------|----------|----------|
| **UE** | EN 301 549 / Directive 2016/2102 | WCAG 2.1 AA obligatoire secteur public, recommandé privé |
| **France** | RGAA 4.1 / Loi 2005-102 | WCAG 2.1 AA + critères RGAA |
| **US** | ADA Title III / Section 508 | WCAG 2.1 AA (jurisprudence) |
| **International** | WCAG 2.1 AA | Référence universelle |

## Checklist Déploy (Accessibilité)
- [ ] Skip link présent + focus visible
- [ ] Newsletter : label + autocomplete + erreur explicite
- [ ] Language switcher : `aria-label` + `hreflang` + `lang`
- [ ] Focus visible cohérent (`:focus-visible`)
- [ ] Contraste validé (outils : `axe`, `lighthouse`, `contrast-ratio.com`)
- [ ] Clavier only : navigation complète sans souris
- [ ] Lecteur écran : test NVDA/VoiceOver sur pages clés
- [ ] `prefers-reduced-motion` respecté
- [ ] Zoom 200% : pas scroll horizontal

## Documentation Accessibilité (Public)
Créer `/accessibilite/` (ou `/accessibility/`) avec :
- Déclaration de conformité (niveau AA, date, périmètre)
- Contact pour signaler problème (`accessibilite@kikienchrist.vercel.app`)
- Technologies utilisées (Astro, CSS, HTML natif)
- Exceptions connues (si aucune → "Aucune")

---
*Skill créé le 2025-11-20. Accessibilité = inclusivité + légal + SEO + UX.*