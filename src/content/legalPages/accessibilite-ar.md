---
title: "إمكانية الوصول"
pageSlug: "accessibilite"
lang: "ar"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---

# Accessibilité : Déclaration de conformité

**Kiki en Christ** s'engage à rendre son site accessible conformément à l'**Article 47 de la Loi n°2005-102** et au **Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1)** / **WCAG 2.1 niveau AA**.

## 1. État de conformité

**Site web** : https://kikienchrist.vercel.app/  
**Date de dernière évaluation** : 15 janvier 2025  
**Niveau visé** : **AA (RGAA 4.1 / WCAG 2.1)**  
**Statut** : **En cours d'audit — Conformité partielle estimée ~85%**

> Cette déclaration sera mise à jour après audit complet par un expert accessibilité certifié.

## 2. Périmètre de l'audit

Pages testées (échantillon représentatif) :
- Page d'accueil (9 langues)
- Pages livres (4 livres × 9 langues)
- Newsletter / FAQ / Contact
- Pages légales (5 pages × 9 langues) — *cette page incluse*
- Blog (articles, catégories, tags, séries)
- Bannière cookies (RGPD)

Technologies : **Astro 4 (Static HTML)** · **CSS Vanilla (lafoidieu-design.css)** · **JS Vanilla (ES Modules)** · **Vercel Edge Middleware**

## 3. Résultats par critère (RGAA 4.1)

| Thème | Critères conformes / Total | Notes |
|-------|---------------------------|-------|
| **1. Images** | 8/9 | Textes alternatifs présents sur toutes images de contenu. *À vérifier : images décoratives `alt=""`* |
| **2. Cadres** | 3/3 | Pas d'iframes, pas de frames |
| **3. Couleurs** | 5/6 | Contraste ≥ 4.5:1 (texte) / 3:1 (UI). *À vérifier : focus visible sur tous éléments* |
| **4. Multimédia** | 4/4 | Pas de vidéo/audio auto. Pas de sous-titres requis (pas de média natif) |
| **5. Tableaux** | 3/3 | Pas de tableaux de données complexes |
| **6. Liens** | 6/6 | Textes de lien explicites, pas de "cliquez ici", focus visible |
| **7. Scripts** | 5/6 | JS accessible (ARIA, focus trap, Escape). *À vérifier : changements de contenu annoncés* |
| **8. Éléments obligatoires** | 8/9 | Langue, titre, structure H1-H6, landmarks. *À vérifier : skip link* |
| **9. Structure** | 7/7 | HTML5 sémantique, headings ordonnés, lists, landmarks |
| **10. Présentation** | 6/7 | Responsive, zoom 200% sans perte, pas de contenu clignotant |
| **11. Formulaires** | 8/9 | Labels explicites, groupement, messages d'erreur. *À vérifier : autocomplete* |
| **12. Navigation** | 7/8 | Menu clavier, focus visible, ordre logique. *À vérifier : skip link* |
| **13. Consultation** | 6/6 | Responsive, orientation, redimensionnement texte |

**Total estimé** : **~77/91 critères conformes (85%)**

## 4. Non-conformités connues & Plan d'action

| Critère | Non-conformité | Priorité | Échéance |
|---------|----------------|----------|----------|
| 1.8 / 8.9 | **Skip link** (lien d'accès rapide au contenu principal) manquant | Haute | Q1 2025 |
| 3.3 | Focus visible insuffisant sur certains boutons (newsletter, language switcher) | Haute | Q1 2025 |
| 7.5 | Changements de contenu dynamique (bannière cookies, panneau) non annoncés via `aria-live` | Moyenne | Q2 2025 |
| 11.9 | Attribut `autocomplete` manquant sur champs email/newsletter | Moyenne | Q1 2025 |
| 12.8 | Ordre de tabulation du sélecteur de langue (mobile) à vérifier | Basse | Q2 2025 |

## 5. Contenus non soumis à l'obligation d'accessibilité

- Contenus tiers : plateformes de vente (Lulu, Payhip, Google Play), réseaux sociaux embed
- Archives (anciennes versions de pages non maintenues)
- Fichiers PDF téléchargeables (guides, extraits) — *à rendre accessibles si publiés*

## 6. Améliorations continues

- **Tests automatisés** : `axe-core` dans CI/CD (GitHub Actions)
- **Tests manuels** : Navigation clavier seule, NVDA/VoiceOver, zoom 200/400%
- **Formation** : Équipe sensibilisée RGAA/WCAG
- **Audit externe** : Prévu annuel par expert certifié

## 7. Schéma pluriannuel d'accessibilité (2025-2027)

| Année | Objectifs |
|-------|-----------|
| **2025** | Corriger non-conformités hautes, audit complet, certification partielle |
| **2026** | Atteindre 100% RGAA 4.1 AA, accessibilité PDF, tests utilisateurs handicap |
| **2027** | Maintenir conformité, intégrer RGAA 5 / WCAG 2.2, accessibilité app mobile |

## 8. Contact accessibilité / Référent

Vous rencontrez une difficulté d'accès ? Signalez-la :

📧 **accessibilite@kikienchrist.com** (ou contact@kikienchrist.com)  
📮 **Kiki en Christ — [Adresse postale à compléter]**  
⏱ **Délai de réponse** : 15 jours ouvrés maximum

## 9. Voies de recours

Si le problème n'est pas résolu :
- **Défenseur des droits** : https://www.defenseurdesdroits.fr/
- **Référent accessibilité administration** : selon votre organisation

## 10. Technologies d'assistance testées

- **Lecteurs d'écran** : NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
- **Navigateurs** : Firefox, Chrome, Safari, Edge (dernières versions)
- **Zoom** : 100%, 200%, 400% (texte seul / page complète)
- **Clavier seul** : Tab, Shift+Tab, Enter, Escape, Flèches

---

### Accessibility

### Accessibilité : Déclaration de conformité

Kiki en Christ s'engage à rendre son site accessible conformément à l'article 47 de la Loi n°2005-102 et au référentiel général d'amélioration de l'accès (RGAA 4.1) / WCAG 2.1 niveau AA.

## 1. État de conformité

**Site web** : https://kikienchrist.vercel.app/  
**Date de dernière évaluation** : 15 janvier 2025  
**Niveau visé** : **AA (RGAA 4.1 / WCAG 2.1)**  
**Statut** : **En cours d'audit — Conformité partielle estimée ~85%**

> Cette déclaration sera mise à jour après audit complet par un expert accessibilité certifié.

## 2. Périmètre de l'audit

Pages testées (échantillon représentatif) :
- Page d'accueil (9 langues)
- Pages livres (4 livres × 9 langues)
- Newsletter / FAQ / Contact
- Pages légales (5 pages × 9 langues) — *cette page incluse*
- Blog (articles, catégories, tags, séries)
- Bannière cookies (RGPD)

Technologies : **Astro 4 (Static HTML)** · **CSS Vanilla (lafoidieu-design.css)** · **JS Vanilla (ES Modules)** · **Vercel Edge Middleware**

## 3. Résultats par critère (RGAA 4.1)

| Thème | Critères conformes / Total | Notes |
|
