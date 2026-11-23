---
name: kikienchrist-conversion-optimization
description: "Optimisation Conversion (CRO) — A/B Testing, Heatmaps, Funnel Analysis, UX Improvements, Trust Signals, Copy Optimization"
version: "1.0"
---

# Skill: kikienchrist-conversion-optimization

## Objectif
Maximiser **Taux Conversion (Visiteur → Acheteur)** et **Revenu Par Visiteur (RPV)** sur les 4 livres × 9 langues.

---

## 1. Funnel Actuel & Métriques de Base

### Étapes Funnel
```
1. Atterrissage (Hero)           → 100% (baseline)
2. Scroll vers #livres           → ~60-70% (scroll depth)
3. Vue BookCard (4 livres)       → ~50-60%
4. Clic Bouton Achat (Lulu/Payhip/GP) → ~5-10% (CTR boutons)
5. Achat Final (Plateforme)      → ~1-3% (Conversion Rate Global)
```

### KPIs Cibles (Mensuels)
| KPI | Actuel (Est.) | Cible 6 Mois | Cible 12 Mois |
|-----|---------------|--------------|---------------|
| **Scroll Depth #livres** | 65% | 75% | 80% |
| **CTR Boutons Achat** | 7% | 12% | 15% |
| **Conversion Rate Global** | 2% | 3.5% | 5% |
| **Revenu Par Visiteur (RPV)** | $0.15 | $0.30 | $0.50 |
| **Newsletter Signup Rate** | 1.5% | 3% | 5% |
| **Panier Moyen** | 1.2 livres | 1.5 livres | 1.8 livres |

---

## 2. Analyse Comportementale (Outils)

### Heatmaps & Session Recording
| Outil | Coût | Usage |
|-------|------|-------|
| **Microsoft Clarity** | **Gratuit** | Heatmaps (clic, scroll, attention), Recordings, Funnel analysis, Rage clicks, Dead clicks |
| **Hotjar** | Gratuit ≤ 35 sessions/jour | Heatmaps, Recordings, Surveys, Feedback widget |
| **Lucky Orange** | $10/mois | Heatmaps, Recordings, Live chat, Form analytics |

**Recommandation : Microsoft Clarity** (Gratuit, illimité, RGPD-friendly, intégré Vercel/GA4).

### Implémentation Clarity
```astro
<!-- MainLayout.astro <head> -->
<script>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
</script>
```

### Funnel Analysis (GA4 + Clarity)
- **GA4** : `Explore` → `Funnel exploration` → Étapes : `page_view` → `scroll_75` → `click_purchase_button` → `purchase` (via Measurement Protocol)
- **Clarity** : `Dashboard` → `Funnels` → Définir étapes URL + Events

---

## 3. Hypothèses d'Optimisation (Priorisées ICE)

| # | Hypothèse | Impact (1-10) | Confiance (1-10) | Facilité (1-10) | Score ICE | Test |
|---|-----------|---------------|------------------|-----------------|-----------|------|
| 1 | **Hero CTA "Découvrir les livres" → Anchor vers #livres + texte plus explicite** | 8 | 9 | 10 | **720** | A/B : Texte + Position |
| 2 | **BookCard : Ajouter "⭐ 4.8/5 (127 avis)" sous titre (Proof social)** | 9 | 7 | 6 | **378** | A/B : Avec/Sans étoiles |
| 3 | **Newsletter : Lead magnet "7 prières" → Popup exit-intent + Inline dans articles** | 7 | 8 | 5 | **280** | A/B : Popup vs Inline |
| 4 | **Hero Fan : Remplacer miniatures Lulu (FR) par ImgBB HD → Meilleur LCP + désir** | 6 | 9 | 8 | **432** | Before/After (pas A/B) |
| 5 | **BookCard : Prix barré + "Économisez X%" sur Ebook vs Papier** | 5 | 6 | 7 | **210** | A/B : Avec/Sans économie |
| 6 | **Language Switcher : Déplacer du Footer vers Header (visibilité)** | 6 | 7 | 4 | **168** | A/B : Position |
| 7 | **FAQ : Ajouter "Livraison gratuite ?" + "Retours 30j" → Réduire friction** | 5 | 8 | 9 | **360** | A/B : FAQ étendue |
| 8 | **CTA Strip : Urgence douce "Offre limitée : -10% avec code BIENVENUE"** | 4 | 5 | 6 | **120** | A/B : Avec/Sans code |
| 9 | **Checkout : Lien direct "Acheter maintenant" vs "Voir sur Lulu" (intermédiaire)** | 7 | 5 | 3 | **105** | A/B : Texte bouton |
| 10 | **Hero : Vidéo courte (30s) auteur présentant les livres → Engagement + Confiance** | 8 | 4 | 2 | **64** | A/B : Vidéo vs Image |

---

## 4. A/B Testing Framework

### Outil Recommandé : **Vercel Edge Middleware + Cookie** (Gratuit, Natif, Pas de Flicker)

### Architecture Test
```typescript
// src/middleware.ts — Extension pour A/B Testing
interface Experiment {
  name: string;
  variants: Record<string, number>; // variant -> weight (sum = 100)
  cookieName: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    name: 'hero-cta-text',
    variants: { control: 50, variant_a: 50 },
    cookieName: 'exp_hero_cta',
  },
  {
    name: 'bookcard-social-proof',
    variants: { control: 50, variant_b: 50 },
    cookieName: 'exp_bookcard_proof',
  },
];

export default async function middleware(request: Request) {
  const response = NextResponse.next();
  
  // Assigner variantes (basé sur cookie ou random)
  EXPERIMENTS.forEach(exp => {
    let variant = request.cookies.get(exp.cookieName)?.value;
    if (!variant || !exp.variants[variant]) {
      // Random weighted assignment
      const rand = Math.random() * 100;
      let cumulative = 0;
      for (const [v, weight] of Object.entries(exp.variants)) {
        cumulative += weight;
        if (rand <= cumulative) { variant = v; break; }
      }
      response.cookies.set(exp.cookieName, variant, { maxAge: 31536000, path: '/', sameSite: 'lax', secure: true });
    }
    // Passer au composant via header ou cookie lisible client-side
    response.headers.set(`x-exp-${exp.name}`, variant);
  });
  
  return response;
}
```

### Lecture Côté Client (Astro Component)
```astro
---
// BookCard.astro ou Hero.astro
const variant = Astro.request.headers.get('x-exp-bookcard-social-proof') || 'control';
const showSocialProof = variant === 'variant_b';
---

{showSocialProof && (
  <div class="social-proof">⭐ 4.8/5 · 127 avis</div>
)}
```

### Tracking Résultats (GA4 Events)
```javascript
// Dans composant ou script global
function trackExperiment(expName: string, variant: string) {
  gtag('event', 'experiment_view', {
    experiment_id: expName,
    variant_id: variant,
  });
}

// Conversion tracking
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('click', () => {
    const expData = {};
    ['hero-cta', 'bookcard-proof'].forEach(name => {
      const variant = document.cookie.match(new RegExp(`exp_${name}=([^;]+)`));
      if (variant) expData[`exp_${name}`] = variant[1];
    });
    gtag('event', 'purchase_click', { ...expData, ...otherParams });
  });
});
```

### Analyse Résultats (GA4 → Explore)
- Segment : `experiment_view` avec `variant_id`
- Métrique : `purchase_click` rate par variant
- Significativité : Minimum 100 conversions par variant / p-value < 0.05

---

## 5. Optimisations Copy (Basées sur Psychologie)

### Hero — Titre + Sous-titre
| Version | Titre | Sous-titre | Psychologie |
|---------|-------|------------|-------------|
| **Control** | "Foi en Dieu : 4 livres pour avancer" | "Découvrez des réponses profondes à vos questions spirituelles" | Info pure |
| **Variant A (Bénéfice)** | "Retrouvez la paix intérieure grâce à 4 livres spirituels" | "Des réponses concrètes à vos doutes, votre souffrance, votre quête de sens" | **Bénéfice + Empathie** |
| **Variant B (Identité)** | "Vous cherchez Dieu ? 4 livres pour vous guider" | "Rejoignez 10 000+ lecteurs qui ont trouvé des réponses" | **Identité + Preuve sociale** |

### BookCard — Hook + Boutons
| Élément | Actuel | Optimisé | Pourquoi |
|---------|--------|----------|----------|
| **Hook (description courte)** | "Une quête de spiritualité et de transcendance" | "Réponses à vos questions les plus profondes sur Dieu, la vie, la souffrance" | **Problème → Solution** |
| **Bouton Papier** | "Papier — Lulu" | "📖 Version Papier (Lulu) — 13,90 €" | **Format + Prix visible** |
| **Bouton Ebook** | "Ebook — Payhip" | "📱 Ebook Instantané — 3,99 $" | **Immédiateté + Prix** |
| **Bouton Audio** | "Audio — Google Play" | "🎧 Version Audio — 5,49 $" | **Format clair + Prix** |
| **Dropdown Langues** | "5 langues disponibles" | "🌍 Disponible en 5 langues →" | **Emoji + Flèche action** |

### Newsletter — Lead Magnet
| Version | Titre | Description | CTA |
|---------|-------|-------------|-----|
| **Control** | "Recevez « 7 prières » gratuitement" | "Un guide PDF pour apprivoiser la prière..." | "Je veux le guide" |
| **Variant A (Résultat)** | "Priez dès ce soir (même si vous ne savez pas comment)" | "7 prières prêtes à l'emploi pour apaiser votre cœur en 2 min/jour" | "⬇️ Télécharger mes 7 prières" |
| **Variant B (Curiosité)** | "Le secret des gens qui prient tous les jours" | "Ce n'est pas la foi. C'est une méthode simple en 7 étapes." | "🔍 Découvrir la méthode" |

---

## 6. Trust Signals (Preuves de Confiance)

### À Ajouter (Priorité)
| Signal | Emplacement | Contenu | Effet |
|--------|-------------|---------|-------|
| **Avis Lecteurs** | BookCard (sous titre) | "⭐ 4.8/5 — 'Ce livre a changé ma vision de Dieu' — Marie, 42 ans" | Preuve sociale |
| **Nombre Lecteurs** | Hero / CTA Strip | "Rejoignez 12 000+ lecteurs dans 40 pays" | Popularité |
| **Garantie** | BookCard (près boutons) | "🛡️ Satisfait ou remboursé 30 jours (Lulu/Payhip)" | Réduction risque |
| **Auteur** | Footer / Hero | "Kiki en Christ — Auteur de 4 best-sellers spirituels" | Autorité |
| **Médias** | Footer / Page À Propos | "Vu dans : Famille Chrétienne, La Croix, Prier Magazine" | Crédibilité externe |
| **Sécurité Paiement** | BookCard (icônes) | "🔒 Paiement sécurisé SSL · Lulu / Payhip / Google Play" | Sécurité perçue |
| **Livraison** | FAQ / BookCard | "📦 Expédition 5-10 jours (Lulu) · Téléchargement instantané (Ebook/Audio)" | Clarté délais |

### Implémentation (Sans Casser Design)
```astro
<!-- BookCard.astro — Ajout trust badges -->
<div class="trust-badges" style="display:flex; gap:8px; flex-wrap:wrap; margin:12px 0; font-size:12px;">
  <span class="badge" style="background:#f0fdf4; color:#166534; padding:4px 8px; border-radius:9999px;">🛡️ 30j remboursé</span>
  <span class="badge" style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:9999px;">🔒 Paiement sécurisé</span>
  <span class="badge" style="background:#e0e7ff; color:#3730a3; padding:4px 8px; border-radius:9999px;">📦 5-10 jours</span>
</div>
```

---

## 7. Mobile-First Optimizations (≤760px)

### Problèmes Mobiles Actuels
| Problème | Impact | Fix |
|----------|--------|-----|
| **Hero Fan** : 4 images petites, dur à taper | CTR ↓ | Version mobile : 1 image hero full-width + swipe carousel |
| **BookCard** : 2 colonnes → 1 colonne (OK) mais boutons empilés | UX ↓ | Boutons full-width, espacement accru, sticky CTA bottom |
| **Language Switcher** : Footer seulement (dur à trouver) | i18n ↓ | Header sticky + Footer |
| **Newsletter** : Formulaire 2 champs côte à côte → stack | UX ↓ | Déjà stack (flex-wrap) — vérifier tap target ≥ 44px |
| **FAQ** : Accordion OK mais texte long | Lecture ↓ | `max-height` + "Lire la suite" ou résumé |

### Sticky Bottom CTA (Mobile)
```astro
<!-- [lang]/index.astro — Mobile only -->
<div class="mobile-sticky-cta" style="display:none; position:fixed; bottom:0; left:0; right:0; background:var(--paper); border-top:1px solid var(--line); padding:12px 16px; z-index:100; box-shadow:0 -4px 12px rgba(0,0,0,.1);">
  @media (max-width: 760px) { .mobile-sticky-cta { display:block; } }
  <a href="#livres" class="btn btn-primary" style="width:100%; text-align:center;">📖 Voir les 4 livres</a>
</div>
```

---

## 8. Mesure & Itération (Cycle Mensuel)

### Processus Mensuel CRO
```
Semaine 1 : Analyser données (Clarity + GA4 + Vercel Analytics)
    → Identifier top 3 goulots (drop-off points)
Semaine 2 : Formuler hypothèses (ICE scoring) + Designer variants
Semaine 3 : Implémenter test A/B (Middleware + Cookie + GA4 tracking)
Semaine 4 : Lancer test (minimum 2 semaines / 100 conversions/variant)
    → Analyser résultats → Implémenter gagnant → Documenter
```

### Dashboard CRO (Looker Studio)
Sources : GA4 + Clarity + Vercel Analytics + Plateformes ventes
- **Vue Funnel** : Étapes + Drop-off % + Tendances
- **Vue Tests** : Expériences en cours / Terminées / Gagnantes / Perdues
- **Vue Copy** : Performance par langue / par livre / par device
- **Vue Revenu** : RPV par segment / canal / expérience

---

## 9. Budget & Outils (CRO Stack Gratuit)

| Outil | Coût | Usage |
|-------|------|-------|
| **Vercel Edge Middleware** | Inclus | A/B Test assignment (cookie-based, no flicker) |
| **GA4** | Gratuit | Event tracking, Funnel, Segmentation |
| **Microsoft Clarity** | Gratuit | Heatmaps, Recordings, Funnels, Rage clicks |
| **Looker Studio** | Gratuit | Dashboard CRO unifié |
| **Vercel Analytics** | Gratuit (10k) | RUM CWV, Trafic, Geo |
| **Total** | **0 €/mois** | Stack CRO complet |

---

*Skill créé le 2025-11-20. CRO = méthode scientifique pour transformer trafic en revenus.*