---
name: kikienchrist-i18n-urls
description: "Gestion URLs localisées (achat, hreflang, canonical, sitemap) — source unique WordPress boutique"
version: "1.0"
---

# Skill: kikienchrist-i18n-urls

## Principe
**Chaque langue a ses PROPRES URLs d'achat** (Lulu, Payhip, Google Play).
Pas d'URL unique pour toutes les langues — chaque bouton pointe vers la page produit **dans la langue du visiteur**.

## Source de vérité
**https://lafoidieu.wordpress.com/boutique/** — Page boutique WordPress.
- Clic droit sur chaque bouton → "Copier l'adresse du lien"
- Vérifier : langue dans l'URL (`/fr/`, `/en/`, `/es/`, etc.) + format correct

## Structure dans `translations.json` → `bookData[livre].offers`
```json
"offers": [
  {
    "price": "13.90",
    "priceCurrency": "EUR",
    "url": "https://www.lulu.com/fr/shop/kiki-en-christ/le-visage-de-dieu-la-quete-de-la-spiritualite-et-de-la-transcendance/paperback/product-z6gg2r.html",
    "seller": { "name": "Lulu" },
    "availability": "https://schema.org/InStock"
  },
  {
    "price": "3.99",
    "priceCurrency": "USD",
    "url": "https://payhip.com/b/XnmIq",
    "seller": { "name": "Payhip" },
    "availability": "https://schema.org/InStock"
  },
  {
    "price": "5.49",
    "priceCurrency": "USD",
    "url": "https://play.google.com/store/audiobooks/details?id=AQAAAECiySyJnM",
    "seller": { "name": "Google Play" },
    "availability": "https://schema.org/InStock"
  }
]
```

## Par plateforme

### Lulu (Papier)
- **URL pattern** : `https://www.lulu.com/{lang}/shop/kiki-en-christ/{slug}/paperback/product-{id}.html`
- **Langues supportées** : `fr`, `en`, `es`, `de`, `pt` (pas `it`, `ru`, `zh`, `hi`)
- **Slug** : titre translitéré (ex: `le-visage-de-dieu-la-quete-de-la-spiritualite-et-de-la-transcendance`)
- **Astuce** : Lulu redirige auto selon géolocalisation, mais `/fr/` force français

### Payhip (Ebook)
- **URL pattern** : `https://payhip.com/b/{code}` (code court unique par produit)
- **Même code pour toutes langues** : Payhip gère la langue via navigateur/géo
- **Couverture 1500px** : `https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/{s3-key}.jpg`
- **Langues** : Toutes (FR, EN, ES, DE, PT, IT, RU, ZH, HI)

### Google Play (Audio)
- **URL pattern** : `https://play.google.com/store/audiobooks/details?id={content-id}`
- **Même ID pour toutes langues** : Google Play gère langue via compte/appareil
- **Langues** : FR, EN, ES, DE, PT, HI (pas IT, RU, ZH)

## Matrice disponibilité (livre × langue × format)

| Livre | FR | EN | ES | DE | PT | IT | RU | ZH | HI |
|-------|----|----|----|----|----|----|----|----|----|
| **Visage** (1) | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | - | - | - | - |
| **Trinité** (2) | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Payhip, GP | Payhip, GP | Payhip | Payhip, GP |
| **Combat** (3) | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | Lulu, Payhip, GP | - | - | - | Payhip, GP |
| **Salut** (4) | Lulu, Payhip, GP | - | - | - | - | - | - | - | - |

**Légende** : Lulu = Papier, Payhip = Ebook, GP = Google Play Audio. "-" = pas d'URL → **ne pas mettre d'offer**.

## Workflow "Ajouter/Vérifier URLs"

### 1. Ouvrir WordPress boutique
`https://lafoidieu.wordpress.com/boutique/` → chaque livre a ses boutons par langue/format.

### 2. Pour chaque livre × langue × format existant
- Clic droit bouton → "Copier l'adresse du lien"
- Coller dans `translations.json` → `bookData[livre].offers[].url`
- Vérifier `price` / `priceCurrency` (souvent EUR pour Lulu, USD pour Payhip/GP)

### 3. Nettoyer les offres inexistantes
- Si pas de Lulu en italien → **retirer** l'objet Lulu du tableau `offers` pour `it`
- Ne pas laisser d'URL "par défaut" (FR) pour langues non supportées

### 4. Test clic
- Deploy preview → cliquer chaque bouton → doit ouvrir page produit **dans la bonne langue**

## Hreflang & Canonical (automatique via middleware + MainLayout)

### Hreflang (MainLayout.astro)
```javascript
generateHreflangLinks() // génère <link rel="alternate" hreflang="fr" href="https://kikienchrist.vercel.app/fr/" /> etc.
```
- Inclut `x-default` sur racine `/`

### Canonical (MainLayout.astro)
```html
<link rel="canonical" href="https://kikienchrist.vercel.app/{lang}/" />
```

### Sitemap.xml (build)
```xml
<url><loc>https://kikienchrist.vercel.app/</loc><xhtml:link rel="alternate" hreflang="x-default" href="https://kikienchrist.vercel.app/"/></url>
<url><loc>https://kikienchrist.vercel.app/fr/</loc><xhtml:link rel="alternate" hreflang="fr" href="https://kikienchrist.vercel.app/fr/"/></url>
... (9 langues)
```

## Checklist URLs avant deploy
- [ ] Chaque `offer.url` testée (clic → page produit langue correcte)
- [ ] Pas d'URL FR sur site EN/ES/DE...
- [ ] `priceCurrency` cohérent (EUR Lulu, USD Payhip/GP)
- [ ] `availability` = `https://schema.org/InStock`
- [ ] `seller.name` exact : `"Lulu"` / `"Payhip"` / `"Google Play"`
- [ ] Hreflang présent dans HTML (view-source)
- [ ] Canonical = URL courante langue
- [ ] Sitemap.xml généré avec 10 URLs

## Erreurs fréquentes
| Erreur | Conséquence | Fix |
|--------|-------------|-----|
| URL Lulu FR sur site EN | Acheteur EN atterrit sur page FR | Vérifier WordPress boutique → copier URL `/en/...` |
| Payhip code invalide | 404 ou page d'accueil Payhip | Recopier code `b/XXXX` depuis boutique |
| Google Play ID invalide | "Article introuvable" | Vérifier `id=AQAAA...` exact |
| Prix en EUR sur Payhip US | Confusion acheteur | Payhip = USD toujours |
| Offer manquante dans JSON-LD | Rich snippet incomplet | `bookData[livre].offers` complet par langue |

---
*Skill créé le 2025-11-20. URLs localisées = confiance acheteur + conversion + SEO.*