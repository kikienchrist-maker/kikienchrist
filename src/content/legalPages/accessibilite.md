---
title: 'Accessibilité'
description: "Déclaration d'accessibilité du site Kiki en Christ (RGAA / WCAG 2.1 AA)."
pageSlug: 'accessibilite'
lang: 'fr'
translationKey: 'accessibilite'
lastUpdated: '2025-01-15'
---

# Accessibilité

## Déclaration de conformité

Kiki en Christ s'engage à rendre son site accessible conformément au **RGAA 4.1** (Référentiel Général d'Amélioration de l'Accessibilité) et aux **WCAG 2.1 niveau AA**.

## État de conformité

**Conformité partielle** — Dernier audit : janvier 2025

### Critères respectés (échantillon)

- ✅ Structure sémantique HTML5 (header, main, nav, footer, section, article)
- ✅ Hiérarchie des titres (h1-h6) cohérente
- ✅ Contraste couleurs ≥ 4.5:1 (texte) / 3:1 (UI)
- ✅ Navigation clavier complète (focus visible, ordre logique)
- ✅ Liens d'évitement (Skip Link) vers le contenu principal
- ✅ Attributs `alt` sur toutes les images informatives
- ✅ Formulaires : labels explicites, messages d'erreur accessibles
- ✅ Langue de la page (`lang`) et changements de langue (`lang` sur éléments)
- ✅ ARIA : combobox pour sélecteur langue, `aria-expanded`, `aria-controls`
- ✅ Responsive : mobile-first, zoom jusqu'à 200% sans perte de contenu
- ✅ Pas de contenu clignotant, pas de mouvement auto non contrôlable

### Points d'amélioration connus

- ⚠️ Certains PDF (ebooks) non taggués — travail en cours
- ⚠️ Vidéos YouTube embarquées : sous-titres non garantis
- ⚠️ Audits utilisateurs handicapés non encore réalisés

## Fonctionnalités d'accessibilité

### Raccourcis clavier

| Touche              | Action                                       |
| ------------------- | -------------------------------------------- |
| `Tab`               | Naviguer entre éléments focusables           |
| `Shift+Tab`         | Navigation inverse                           |
| `Entrée` / `Espace` | Activer boutons, liens                       |
| `Échap`             | Fermer modales, dropdowns, menu mobile       |
| `Alt+L`             | Aller au sélecteur de langue (si implémenté) |

### Zoom et affichage

- Zoom navigateur jusqu'à 200% : contenu lisible, pas de débordement horizontal
- Police système redimensionnable (rem/em units)
- Mode sombre/clair respecté (`prefers-color-scheme`)

### Lecteurs d'écran

Testé avec : NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Annonce correcte des titres, landmarks, états (expanded/collapsed)
- Langue annoncée correctement par page

## Signaler un problème

Vous rencontrez une difficulté d'accès ? Contactez-nous :

- **Email** : kikienchrist@gmail.com (objet : "Accessibilité")
- **Formulaire** : [Page Contact](/fr/contact/)

Nous nous engageons à répondre sous 48h et corriger sous 30 jours.

## Référentiels

- [RGAA 4.1](https://accessibilite.numerique.gouv.fr/methode/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Guide test RGAA](https://accessibilite.numerique.gouv.fr/outils/)

## Historique

| Date       | Version | Notes                                                       |
| ---------- | ------- | ----------------------------------------------------------- |
| 15/01/2025 | 1.0     | Déclaration initiale, audit automatique (axe-core) + manuel |
