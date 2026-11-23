---
name: kikienchrist-accessibility-advanced
description: "Accessibilité Avancée (WCAG 2.2 AAA ciblé, Tests Utilisateurs Handicap, Technologies d'Assistance, Conformance Reporting, Legal Compliance EU/US, Design System Inclusif, CI/CD Accessibility Gates)"
version: "1.0"
---

# Skill: kikienchrist-accessibility-advanced

## Objectif
Atteindre **l'excellence en accessibilité** — Au-delà de la conformité légale (WCAG 2.1 AA), viser **WCAG 2.2 AAA** sur les critères critiques, impliquer **utilisateurs en situation de handicap** tout au long du cycle, documenter la conformité pour **audits légaux (RGAA, EN 301 549, Section 508, ADA)**, et industrialiser les tests dans **CI/CD**.

---

## 1. Niveaux de Conformité & Cibles

| Niveau | Critères | Cible Kiki en Christ | Statut Actuel | Échéance |
|--------|----------|---------------------|---------------|----------|
| **WCAG 2.1 A** | 30 critères | **100%** (Obligatoire légal) | ✅ Validé | Maintenu |
| **WCAG 2.1 AA** | 20 critères | **100%** (Standard légal EU/US) | ✅ Validé | Maintenu |
| **WCAG 2.2 AA** | 9 nouveaux critères (2.1 → 2.2) | **100%** | 🟡 En cours | Q1 2026 |
| **WCAG 2.2 AAA** | 28 critères (sélectifs) | **Critères critiques uniquement** (Voir §2) | 🔴 Non commencé | Q3 2026 |
| **RGAA 4.1** | 106 critères (France) | **100% AA + Critiques AAA** | 🟡 En cours | Q1 2026 |
| **EN 301 549 v3.2.1** | Harmonisé EU | **Conforme** (Marchés publics) | 🔴 Non commencé | Q2 2026 |
| **Section 508 / ADA** | US Federal | **Conforme** (Risque litige) | 🟡 Partiel | Q1 2026 |

### Critères AAA Ciblés (Sélection Stratégique)
| Critère | Description | Pourquoi Critique | Implémentation |
|---------|-------------|-------------------|----------------|
| **1.4.6 Contraste Amélioré** | 7:1 (texte) / 4.5:1 (large text) | Lisibilité seniors, malvoyants | Tokens design system `--ink-on-paper: #1a1a1a` (12:1) |
| **1.4.9 Images de Texte** | Pas d'images de texte (sauf logo/essential) | Zoom, traduction, lecteur écran | Remplacer hero text images par CSS + Webfonts |
| **2.1.3 Clavier (Pas d'exception)** | Tout fonctionnel clavier sans exception | Utilisateurs moteurs, lecteurs écran | Audit complet raccourcis, focus management |
| **2.2.3 Pas de Timing** | Pas de limite de temps (sauf temps réel) | Cognitif, moteurs | Supprimer timeouts formulaires, carousel auto-pause |
| **2.2.6 Interruptions** | Reportable / Supprimable | Cognitif, attention | Notifications non-modales, préférences utilisateur |
| **2.3.3 Seuil de Clignotement** | ≤ 3 flash/seuil, zone petite | Photosensibilité (Épilepsie) | Interdire animations clignotantes, `prefers-reduced-motion` |
| **2.4.8 Localisation** | Informations position (breadcrumbs, titre, heading) | Orientation, navigation | Breadcrumbs ARIA, Heading structure stricte |
| **2.4.9 Liens Seuls (But)** | But compréhensible hors contexte | Lecteurs écran (Liste liens) | `aria-label` / Texte lien explicite |
| **2.4.10 Titres de Section** | Titres descriptifs pour toutes sections | Structure, navigation | H1-H6 sémantiques, pas de sauts |
| **3.1.3 Mots Inhabituels** | Définition (glossaire, tooltip, lien) | Cognitif, apprentissage, traduction | Glossaire théologique intégré (Tooltip + Page) |
| **3.1.5 Niveau de Lecture** | Niveau secondaire inférieur (ou version simple) | Accessibilité cognitive | Version "Facile à lire" (FALC) pages clés |
| **3.2.5 Changement sur Demande** | Pas de changement contexte auto | Cognitif, lecteurs écran | Pas de redirect auto, pas de popup auto |
| **3.3.5 Aide** | Aide contextuelle (champs complexes) | Formulaires, recherche | `aria-describedby` + Icône aide + Tooltip |
| **3.3.6 Prévention Erreurs (Tous)** | Réversible / Vérifié / Confirmé | Tous formulaires critiques | Double confirmation achat, suppression, inscription |

---

## 2. Tests Utilisateurs Handicap (User Testing Inclusif)

### Panel Utilisateurs Représentatif (Minimum 5 profils × 2 = 10 utilisateurs)
| Profil | Handicap | Technologies d'Assistance | Scénarios Test | Rémunération |
|--------|----------|---------------------------|----------------|--------------|
| **Aveugle** | Cécité totale | NVDA (Windows) / VoiceOver (Mac/iOS) + Braille display | Navigation complète, Achat livre, Inscription NL, Podcast, Communauté | 80€/session (1h) |
| **Malvoyant** | Basse vision (≤ 1/10) | ZoomText / Windows Magnifier / iOS Zoom + Contraste élevé | Lisibilité, Redimensionnement 200-400%, Mode contraste, Navigation | 80€/session (1h) |
| **Moteur** | Paralysie / Tremblements / Amputation | Clavier seul / Switch control / Voice Control (Dragon) / Eye tracking | Navigation clavier, Focus visible, Raccourcis, Formulaires, Drag-drop alternatives | 80€/session (1h) |
| **Auditif** | Surdité / Malentendant | Sous-titres / Transcription / Langue des signes (LSF/ASL) | Vidéo (sous-titres), Podcast (transcription), Live (sous-titres temps réel) | 80€/session (1h) |
| **Cognitif** | Dyslexie / TDAH / Autisme / Troubles apprentissage | Lecteur immersif (Immersive Reader) / Police dyslexie / Réducteur distraction | Lisibilité, Structure claire, Pas d'interruptions, Langage simple, Temps suffisant | 80€/session (1h) |
| **Senior** | 65+ (Multi-handicaps légers) | Combinaison ci-dessus + Simplicité | Parcours complet "Première visite → Achat" | 80€/session (1h) |

### Protocole Test (Session 60-90 min)
```
1. Accueil & Consentement (10 min) : Explication, Enregistrement (Écran + Audio + Caméra optionnel), Consentement RGPD
2. Présentation Contexte (5 min) : "Imaginez que vous cherchez un livre sur la prière..."
3. Scénarios Guidés (45-60 min) — 3-4 tâches critiques :
   - Tâche 1 : Trouver et acheter "Le Combat Spirituel" en version numérique
   - Tâche 2 : S'inscrire à la newsletter + Télécharger le guide "7 Prières"
   - Tâche 3 : Écouter l'épisode 5 du podcast + Lire la transcription
   - Tâche 4 : Rejoindre la communauté Discord + Poster une demande de prière
4. Débriefing Libre (15 min) : "Ce qui a bien marché", "Ce qui vous a bloqué", "Suggestions"
5. Questionnaire Standardisé (5 min) : SUS (System Usability Scale) + UAQ (User Accessibility Questionnaire)
```

### Métriques Collectées
| Métrique | Cible | Outil |
|----------|-------|-------|
| **Taux Réussite Tâche** | ≥ 90% | Observation + Enregistrement |
| **Temps Tâche** | ≤ 2x temps utilisateur expert | Chronomètre |
| **Erreurs Critiques** | 0 par tâche | Observation |
| **SUS Score** | ≥ 80 (Excellent) | Questionnaire |
| **UAQ Score** | ≥ 4/5 | Questionnaire |
| **Charge Cognitive (NASA-TLX)** | ≤ 40 | Questionnaire |

### Fréquence & Intégration
- **Trimestriel** : Panel complet (10 users) — Sprint "Accessibilité" dédié
- **Mensuel** : 2-3 utilisateurs (Rotation profils) — Validation features nouvelles
- **Continu** : Feedback communautaire (Discord #accessibilité, Email, Forum) → Backlog priorisé

---

## 3. Technologies d'Assistance — Matrice de Test

| Technologie | Plateforme | Version Test | Config Spécifique | Pages Critiques |
|-------------|------------|--------------|-------------------|-----------------|
| **NVDA** | Windows 10/11 | Latest + 1 anterior | Firefox/Chrome, Parole: Français (Microsoft Hortense) | Toutes |
| **JAWS** | Windows | Latest (Licence) | Chrome/Edge, Eloquence/Vocalizer | Achat, Formulaires |
| **VoiceOver** | macOS / iOS | Latest | Safari, Voix: Amélie (FR) / Samantha (EN) | Toutes (Mobile critique) |
| **TalkBack** | Android | Latest | Chrome, Voix: Google FR/EN | Toutes (Mobile) |
| **ZoomText** | Windows | Latest | Grossissement 200-400%, Contraste élevé, Pointeur gros | Hero, Livre, Formulaires |
| **Windows Magnifier** | Windows | Built-in | Plein écran / Lentille / Ancré, Inversion couleurs | Toutes |
| **Dragon NaturallySpeaking** | Windows | Latest | Commandes vocales navigation, dictée formulaires | Recherche, Formulaires, Communauté |
| **Voice Control (iOS/macOS)** | Apple | Built-in | Numérotation éléments, Grille, Commandes personnalisées | Mobile critique |
| **Switch Control** | iOS/macOS/Android | Built-in | 1-2 switches, Balayage automatique/manuel | Navigation, Formulaires |
| **Eye Tracking (Tobii)** | Windows | Lab only | Calibration, Dwell click, Clavier visuel | Recherche avancée |
| **Immersive Reader / Read Aloud** | Edge / Chrome Extension | Latest | Police Dyslexie (OpenDyslexic), Espacement, Syllabes, Traduction | Blog, Podcast transcription, Pages contenu |
| **High Contrast Mode** | OS Level | Windows/Mac/iOS/Android | Forcé système + `prefers-contrast: more` | Toutes |

### Checklist Test par Technologie (Exemple NVDA + Firefox)
- [ ] **Navigation** : `Tab` / `Shift+Tab` → Ordre logique, Focus visible, Pas de pièges
- [ ] **Headings** : `H` → Structure H1-H6, Pas de sauts, Descriptifs
- [ ] **Landmarks** : `R` / `D` → `main`, `nav`, `aside`, `footer`, `search`, `region` étiquetés
- [ ] **Liens** : `K` / `Tab` → Texte clair, `aria-label` si icône seul, Pas "Cliquez ici"
- [ ] **Formulaires** : `F` / `Tab` → Labels associés (`for`/`id`), `aria-describedby`, Erreurs annoncées (`role="alert"`), Requis annoncés
- [ ] **Boutons** : `B` / `Tab` → Rôle bouton, État (`aria-pressed`, `aria-expanded`), Action claire
- [ ] **Images** : `G` → `alt` pertinent, Décoratives `alt=""`, Complexes → Description longue (`aria-describedby` + région)
- [ ] **Tableaux** : `T` → En-têtes `th` + `scope`, Légende `caption`, Navigation cellulaire
- [ ] **Listes** : `L` / `I` → Sémantique `ul`/`ol`, Imbriquées correctes
- [ ] **Régions Live** : `Politeness` → `aria-live="polite"` (Notifications), `assertive` (Erreurs)
- [ ] **Dialogues/Modales** : Focus trap, `aria-modal="true"`, `aria-labelledby`, Fermeture `Esc`
- [ ] **Carrousels** : Pause auto, Navigation clavier, `aria-roledescription="slide"`, Annonce slide actif
- [ ] **Langue** : `lang` attribut page + `lang` sur passages langue différente (Citation biblique)

---

## 4. Design System Inclusif (Tokens & Composants)

### Tokens Accessibilité (Style Dictionary → CSS + RN)
```json
// packages/ui/src/tokens/accessibility.json
{
  "color": {
    "contrast": {
      "minimum": { "value": "4.5", "type": "ratio", "description": "WCAG AA texte normal" },
      "enhanced": { "value": "7", "type": "ratio", "description": "WCAG AAA texte normal" },
      "largeText": { "value": "3", "type": "ratio", "description": "WCAG AA texte large (≥18pt/14pt bold)" },
      "ui": { "value": "3", "type": "ratio", "description": "WCAG AA composants UI (bords, focus)" }
    },
    "palette": {
      "ink": { "value": "#1a1a1a", "on": "paper", "ratio": "12.6:1" },
      "inkLight": { "value": "#4a4a4a", "on": "paper", "ratio": "7.2:1" },
      "paper": { "value": "#fffdf8", "on": "ink", "ratio": "12.6:1" },
      "gold": { "value": "#b8960a", "on": "paper", "ratio": "5.8:1", "onInk": "1.8:1 ❌", "largeOnInk": "3.2:1 ✅" },
      "accent": { "value": "#c0392b", "on": "paper", "ratio": "6.1:1" },
      "focus": { "value": "#ffd600", "on": "ink", "ratio": "9.1:1", "onPaper": "1.1:1 ❌", "outline": "3px solid #ffd600" },
      "error": { "value": "#c62828", "on": "paper", "ratio": "5.2:1" },
      "success": { "value": "#2e7d32", "on": "paper", "ratio": "5.1:1" }
    }
  },
  "typography": {
    "baseSize": { "value": "16", "unit": "px", "description": "Taille de base responsive (clamp 1rem-1.25rem)" },
    "scale": { "value": "1.2", "type": "ratio", "description": "Major Third — Harmonie lisible" },
    "lineHeight": { "value": "1.6", "unit": "ratio", "description": "Lisibilité optimale (WCAG 1.4.8)" },
    "letterSpacing": { "value": "0.02", "unit": "em", "description": "Légère ouverture dyslexie-friendly" },
    "fontFamily": {
      "base": { "value": "Inter, system-ui, sans-serif", "description": "Lisible, support Unicode complet, variable font" },
      "heading": { "value": "Montserrat, Inter, sans-serif", "description": "Distinctif, lisible en gras" },
      "scripture": { "value": "Merriweather, Georgia, serif", "description": "Lisible, respectueuse texte sacré" },
      "dyslexic": { "value": "OpenDyslexic, Inter, sans-serif", "description": "Option utilisateur (Setting)" }
    },
    "resize": { "value": "200%", "description": "WCAG 1.4.4 — Texte redimensionnable sans perte fonctionnalité" }
  },
  "spacing": {
    "touchTarget": { "value": "48", "unit": "px", "description": "WCAG 2.5.5 — Cible tactile minimale (44px iOS, 48px Material)" },
    "touchSpacing": { "value": "8", "unit": "px", "description": "Espacement entre cibles tactiles adjacentes" },
    "focusOutline": { "value": "3", "unit": "px", "description": "Épaisseur focus visible (WCAG 2.4.7 AAA)" },
    "focusOffset": { "value": "2", "unit": "px", "description": "Décalage outline (ne colle pas)" }
  },
  "motion": {
    "reduceMotion": { "value": "0.01", "unit": "s", "description": "Durée animations quand `prefers-reduced-motion: reduce`" },
    "maxAnimation": { "value": "300", "unit": "ms", "description": "Durée max transitions standards" },
    "noFlash": { "value": "3", "type": "hz", "description": "Seuil clignotement WCAG 2.3.1/2.3.3" }
  }
}
```

### Composants Critiques — Spécifications Accessibilité

#### `LanguageSwitcher` (Combobox ARIA 1.2)
```tsx
// Rôle: combobox — États: expanded/collapsed — Propriétés: owns, controls, activedescendant
<LanguageSwitcher 
  label="Changer de langue"           // <label> visible ou aria-label
  triggerLabel="Langue actuelle: Français"  // aria-label bouton déclencheur
  options={[
    { value: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { value: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },  // RTL support
    // ... 9 langues
  ]}
  onChange={(lang) => router.replace(`/${lang}/`)}
  // Keyboard: Enter/Space (ouvrir), Esc (fermer), Flèches (naviguer), Home/End, Tab (sortir)
  // Screen reader: Annonce "Combobox, Français, collapsed" → "Expanded, 9 options" → "English, option 2 of 9"
/>
```

#### `BookCard` (Article + Figure + Button Group)
```tsx
<article class="book-card">
  <figure>
    <img src={cover} alt="" aria-hidden="true" />  {/* Décoratif si titre adjacent */}
    <figcaption class="visually-hidden">{title} — Couverture</figcaption>
  </figure>
  <h3>{title}</h3>
  <p>{description}</p>
  <div class="formats" role="group" aria-label="Formats disponibles">
    <span class="format-badge" aria-label="Format papier">📖 Papier</span>
    <span class="format-badge" aria-label="Format numérique">📱 Numérique</span>
  </div>
  <div class="actions" role="group" aria-label="Acheter {title}">
    <Button 
      variant="primary" 
      aria-label="Acheter version papier sur Lulu — 14,99€"
      href={luluUrl}
    >Lulu</Button>
    <Button 
      variant="secondary" 
      aria-label="Acheter version numérique sur Payhip — 9,99€"
      href={payhipUrl}
    >Payhip</Button>
  </div>
</article>
```

#### `NewsletterForm` (Formulaire Accessible)
```tsx
<form action="/newsletter" method="POST" data-netlify="true" noValidate>
  <div class="form-group">
    <label htmlFor="email" class="visually-hidden">Adresse email pour la newsletter</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      autoComplete="email"
      required
      aria-required="true"
      aria-describedby="email-hint email-error"
      placeholder="votre@email.com"
      class={error ? 'error' : ''}
    />
    <span id="email-hint" class="hint">Recevez "7 Prières" gratuitement + newsletter hebdo</span>
    {error && <span id="email-error" role="alert" class="error-message">{error}</span>}
  </div>
  <div class="form-group checkbox" hidden>  {/* Honeypot */}
    <input type="checkbox" name="bot-field" tabIndex={-1} autoComplete="off" />
  </div>
  <Button type="submit" variant="primary">S'inscrire — C'est gratuit</Button>
  <p class="privacy-note">Pas de spam. Désinscription 1 clic. <a href="/confidentialite/">RGPD</a></p>
</form>
```

---

## 5. CI/CD Accessibility Gates (Automatisation)

### Pipeline GitHub Actions (`.github/workflows/a11y.yml`)
```yaml
name: Accessibility CI
on: [pull_request, push, workflow_dispatch]

jobs:
  a11y-lint:
    name: Lint A11y (axe-core + eslint-plugin-jsx-a11y)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint:a11y  # eslint-plugin-jsx-a11y + custom rules
      - run: npm run test:a11y:unit  # Jest + @testing-library/jest-dom + jest-axe

  a11y-build:
    name: Build + A11y Audit (Lighthouse CI + Pa11y)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: .github/lighthouse/a11y-budget.json
          urls: |
            http://localhost:4321/fr/
            http://localhost:4321/en/
            http://localhost:4321/fr/blog/test-article/
      - name: Pa11y CI (WCAG 2.1 AA + 2.2 AA)
        uses: pa11y/pa11y-ci-action@v2
        with:
          config: .github/pa11y/pa11y-ci.json
          standard: WCAG2AA

  a11y-e2e:
    name: E2E A11y (Playwright + axe-core)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci && npm run build && npm run preview &
      - run: npx playwright install --with-deps chromium
      - run: npm run test:a11y:e2e  # Playwright + axe-builder
        env:
          BASE_URL: http://localhost:4321

  a11y-visual:
    name: Visual Regression (Chromatic + Storybook A11y Addon)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run storybook:build
      - uses: chromatic/cli-action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          onlyChanged: true

  a11y-report:
    name: Consolidated A11y Report
    needs: [a11y-lint, a11y-build, a11y-e2e, a11y-visual]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
      - name: Generate Report
        run: |
          # Aggregate results → Markdown → PR Comment + Slack
          node .github/scripts/a11y-report.js
      - name: Fail if Critical/Serious
        run: |
          CRITICAL=$(jq '.violations[] | select(.impact=="critical") | length' report.json)
          SERIOUS=$(jq '.violations[] | select(.impact=="serious") | length' report.json)
          if [ "$CRITICAL" -gt 0 ] || [ "$SERIOUS" -gt 5 ]; then exit 1; fi
```

### Budgets Lighthouse CI (`.github/lighthouse/a11y-budget.json`)
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "budgets": [
          { "resourceType": "total", "budget": 1500, "unit": "kb" },
          { "resourceType": "script", "budget": 100, "unit": "kb" },
          { "resourceType": "css", "budget": 50, "unit": "kb" },
          { "resourceType": "image", "budget": 500, "unit": "kb" },
          { "resourceType": "font", "budget": 100, "unit": "kb" },
          { "resourceType": "third-party", "budget": 50, "unit": "kb" }
        ],
        "assert": {
          "assertions": {
            "categories:accessibility": ["error", { "minScore": 0.95 }],
            "categories:best-practices": ["error", { "minScore": 0.9 }],
            "categories:seo": ["error", { "minScore": 0.9 }],
            "categories:performance": ["warn", { "minScore": 0.9 }],
            "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
            "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
            "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
            "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
            "color-contrast": ["error", { "minScore": 1 }],
            "image-alt": ["error", { "minScore": 1 }],
            "label": ["error", { "minScore": 1 }],
            "html-has-lang": ["error", { "minScore": 1 }],
            "document-title": ["error", { "minScore": 1 }],
            "meta-viewport": ["error", { "minScore": 1 }]
          }
        }
      }
    }
  }
}
```

---

## 6. Conformance Reporting & Legal Compliance

### Déclaration d'Accessibilité (Obligatoire France — RGAA 4.1)
**URL** : `/accessibilite/` (9 langues)
**Contenu** :
1. **État de conformité** : "Partiellement conforme" / "Conforme" + % critères respectés
2. **Résultats des tests** : Date, Étendue (Pages testées), Méthode (RGAA 4.1), Outils, Échantillon
3. **Critères non conformes** : Liste + Impact + Contournement + Planning correction
4. **Critères non applicables** : Justification
4. **Contact** : Référent accessibilité (Email, Téléphone, Formulaire)
5. **Voie de recours** : Défenseur des droits (France) / Organismes équivalents

### Modèle Déclaration (Notion → Génération Auto `/accessibilite/`)
```markdown
# Déclaration d'Accessibilité — Kiki en Christ

**Date** : 2025-11-20
**Version** : 1.0
**Étendue** : Site principal (9 langues) + Blog + Podcast + Communauté
**Référentiel** : RGAA 4.1 (WCAG 2.1 AA + Critères 2.2 AA)
**Outils** : axe-core 4.8, Lighthouse 11, NVDA/VoiceOver, Pa11y, Tests utilisateurs (10 profils)

## État de Conformité
**Conforme à 94% (WCAG 2.1 AA) — 87% (WCAG 2.2 AA) — 72% (Critères AAA ciblés)**

### Critères Non Conformes (Plan Correction)
| Critère | Impact | Pages Concernées | Contournement | Correction Prévue |
|---------|--------|------------------|---------------|-------------------|
| 1.4.3 Contraste (Liens footer) | Mineur | Footer toutes pages | Soulignement + Focus visible | Q1 2026 (Design system v2) |
| 2.4.7 Focus visible (Custom select) | Majeur | Language switcher, Tri blog | Outline CSS forcé | Q1 2026 (Composant ARIA natif) |
| 3.1.2 Langue parties (Citations bibliques) | Mineur | Articles blog, Podcast | `lang` attribut manuel | Q1 2026 (CMS auto-détection) |

### Critères Non Applicables
- 1.2.3 Audiodescription (Pas de vidéo pré-enregistrée avec info visuelle seule)
- 1.2.5 Audiodescription live (Pas de live vidéo)
- 2.2.1 Réglage temps (Pas de limite temps)

## Contact Accessibilité
**Référent** : [Nom] — accessibility@kikienchrist.com — +33 X XX XX XX XX
**Voie de Recours** : Défenseur des Droits — https://www.defenseurdesdroits.fr/
```

### Audit Externe (Annuel — Obligatoire Marchés Publics / Partenaires Institutionnels)
| Organisme | Coût | Délai | Livrable |
|-----------|------|-------|----------|
| **Access42** | 3-5k€ | 3-4 semaines | Rapport RGAA + Plan action + Attestation |
| **Urban Access** | 4-6k€ | 4-6 semaines | Rapport + Formation équipe + Suivi 6 mois |
| **Temesis** | 5-8k€ | 6-8 semaines | Audit complet + Certification + Veille |

---

## 7. Formation & Culture Accessibilité (Équipe)

### Programme Formation (Obligatoire Tous Rôles)
| Module | Public | Durée | Format | Fréquence |
|--------|--------|-------|--------|-----------|
| **A11y Fundamentals** | Tous (Dev, Design, Content, Marketing, PM) | 2h | Atelier interactif + Démo lecteurs écran | Onboarding + Annuel |
| **Inclusive Design** | Design, PM, Content | 3h | Atelier + Cas pratiques (Personas handicap) | Semestriel |
| **Accessible Code (HTML/ARIA/CSS)** | Dev (Frontend, Fullstack) | 4h | Coding dojo + Exercices axe-core | Semestriel |
| **Accessible Content (Rédaction, Médias, Réseaux)** | Content, Marketing, Community | 2h | Atelier + Checklist + Outils (Hemingway, LanguageTool) | Trimestriel |
| **Testing with Users** | QA, PM, Dev, Design | 2h | Observation session test utilisateur réel | Trimestriel |
| **Legal & Compliance** | PM, Legal, Ops, Leadership | 1h | Briefing + Checklist déclarations | Annuel |

### Référents Accessibilité (Champions)
| Équipe | Référent | Rôle |
|--------|----------|------|
| **Dev** | Senior Frontend | Code review a11y, Composants, CI/CD |
| **Design** | Design Lead | Tokens, Composants, Tests utilisateurs |
| **Content** | Content Lead | Rédaction inclusive, Médias, Transcriptions |
| **Marketing** | Growth Lead | Emails, Landing pages, Ads, Social |
| **Community** | Community Manager | Discord/Forum accessibilité, Support |
| **Leadership** | CTO / PO | Budget, Priorisation, Culture, Audit externe |

---

## 8. Budget Accessibilité (Annuel)

| Poste | Coût | Fréquence | Notes |
|-------|------|-----------|-------|
| **Audit Externe (RGAA/EN 301 549)** | 5-8k€ | Annuel | Obligatoire conformité légale |
| **Tests Utilisateurs Handicap** | 8-12k€ | Trimestriel (10 users × 80€ × 4) + Mensuel (3 users × 80€ × 12) | Rémunération + Logistique + Outils |
| **Outils (axe-core Pro, Lighthouse CI, Pa11y, Chromatic, Storybook)** | 2-5k€ | Annuel | Licences + CI minutes |
| **Formation Équipe** | 3-5k€ | Annuel | Formateurs externes + Matériel + Temps |
| **Sous-titrage / Transcription (Podcast, Vidéo, Live)** | 10-20k€ | Continu | DeepL + Relecture + SRT/VTT 9 langues |
| **Développement Composants Accessibles** | Inclus dev | Continu | Design System + Patterns |
| **Consultance Expert (Mensuel)** | 6-12k€ | Mensuel (0.5 jour/sem) | Revue architecture, Audits ciblés, Veille |
| **Total Estimé** | **35-65k€/an** | | ~5-10% budget dev total |

---

## 9. Checklist Accessibilité Avancée (Pré-Deploy + Trimestriel)

| Catégorie | Check | Critère | Outil/Vérification |
|-----------|-------|---------|-------------------|
| **Contraste** | ☐ Texte normal ≥ 4.5:1 (AA) / 7:1 (AAA ciblé) | WCAG 1.4.3/1.4.6 | axe-core + Manuel (Color Contrast Analyzer) |
| **Contraste** | ☐ UI Components ≥ 3:1 | WCAG 1.4.11 | axe-core |
| **Redimensionnement** | ☐ 200% zoom → Pas perte contenu/fonction | WCAG 1.4.4 | Navigateur + Test mobile |
| **Espacement** | ☐ Line height ≥ 1.5, Letter spacing ≥ 0.12em, Word spacing ≥ 0.16em | WCAG 1.4.12 | CSS + Test lecture |
| **Focus** | ☐ Visible, 3px minimum, Offset 2px, Contraste 3:1 | WCAG 2.4.7/2.4.13 | Tab navigation + axe-core |
| **Clavier** | ☐ Tout accessible, Pas de piège, Ordre logique, Raccourcis | WCAG 2.1.1/2.1.2/2.1.3 | Test complet clavier seul |
| **Lecteur Écran** | ☐ NVDA/VoiceOver : Structure, Labels, États, Live regions | WCAG 1.3.1/4.1.2/4.1.3 | Test manuel + axe-core |
| **Langue** | ☐ `lang` page + Passages langue différente (`lang="la"` citations) | WCAG 3.1.1/3.1.2 | Inspect DOM |
| **Formulaires** | ☐ Labels, Instructions, Erreurs (role=alert), Suggestions, Confirmation | WCAG 1.3.5/3.3.1/3.3.2/3.3.3/3.3.4/3.3.5/3.3.6 | Test complet + axe-core |
| **Médias** | ☐ Vidéo: Sous-titres + Transcription + Audiodescription si nécessaire | WCAG 1.2.2/1.2.3/1.2.5/1.2.7 | Checklist par vidéo |
| **Médias** | ☐ Audio: Transcription complète + Lecteur accessible | WCAG 1.2.1 | Checklist par épisode |
| **Mouvement** | ☐ `prefers-reduced-motion` respecté, Pas clignotement > 3Hz, Pause auto | WCAG 2.3.1/2.3.2/2.3.3 | Test OS setting + DevTools |
| **Navigation** | ☐ Breadcrumbs, Heading structure, Landmarks, Skip link, Liens explicites | WCAG 2.4.1/2.4.2/2.4.4/2.4.5/2.4.6/2.4.8/2.4.9/2.4.10 | axe-core + Manuel |
| **Erreurs** | ☐ Prévention (Réversible/Vérifié/Confirmé), Suggestion correction, Aide contextuelle | WCAG 3.3.4/3.3.5/3.3.6 | Test formulaires critiques |
| **AAA Ciblés** | ☐ 1.4.6, 1.4.9, 2.2.3, 2.2.6, 2.3.3, 2.4.8, 2.4.9, 2.4.10, 3.1.3, 3.1.5, 3.2.5, 3.3.5, 3.3.6 | WCAG 2.2 AAA | Checklist dédiée |
| **Mobile** | ☐ Touch target 48px, Espacement 8px, Orientation, Zoom, VoiceOver/TalkBack | WCAG 2.5.5/2.5.6/1.3.4 | Test devices réels |
| **Documents** | ☐ PDF accessibles (Tags, Ordre lecture, Alt, Formulaires) | PDF/UA-1 | PAC 3 / axesPDF |
| **Déclaration** | ☐ `/accessibilite/` à jour, Contact, Voie recours, Plan correction | RGAA 4.1 Art. 47 | Revue légale |

---

*Skill créé le 2025-11-20. Accessibilité Avancée = Excellence au-delà conformité — Utilisateurs réels, Design System inclusif, CI/CD gates, Reporting légal, Culture équipe, Budget dédié.*