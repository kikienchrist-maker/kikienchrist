---
name: kikienchrist-hero-fan
description: "Gestion des 4 miniatures Hero Fan (couvertures) par langue — URLs ImgBB dans [lang]/index.astro"
version: "1.0"
---

# Skill: kikienchrist-hero-fan

## Ce que c'est
Le **Hero Fan** = les 4 petites couvertures affichées en éventail au-dessus du bouton "Découvrir les livres" dans la section Hero.

**Position** : `src/components/Hero.astro` → `<div class="fan">` avec 4 `<img class="fan-1" ... fan-4>`

**Source des URLs** : Variable `fanImages` dans `src/pages/[lang]/index.astro` (array 4 URLs ImgBB, une par livre, ordre gauche→droite = Livre 1→4).

## État actuel (2025-11-20) — TOUTES LANGUES FAITES ✅

| Langue | Livre 1 (Visage) | Livre 2 (Trinité) | Livre 3 (Combat) | Livre 4 (Salut) | Statut |
|--------|------------------|-------------------|------------------|-----------------|--------|
| **FR** | Lulu thumb (skip) | Lulu thumb (skip) | Lulu thumb (skip) | Lulu thumb (skip) | 0/4 ImgBB (gardé Lulu 384px) |
| **EN** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **ES** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **DE** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **PT** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **IT** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **RU** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **ZH** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |
| **HI** | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | ✅ ImgBB | 4/4 |

## Format requis
- **URL directe ImgBB** : `https://i.ibb.co/XXXXXX/nom-fichier.jpg` (ou `.png`)
- **Résolution** : Haute (source Payhip 1500px ou scan HD)
- **Ratio** : ~2:3 (couverture livre standard)
- **Ordre** : `[visage, trinite, combat, salut]` = positions 1,2,3,4

## Comment mettre à jour

### 1. Obtenir l'URL ImgBB
- Uploader sur `https://ibb.co/` (ou `https://imgbb.com/`)
- Copier **lien direct** (Direct Link) : `https://i.ibb.co/XXXXXX/fichier.jpg`
- **Pas** la page HTML (`https://ibb.co/XXXXXX`), **pas** le BBCode

### 2. Modifier `src/pages/[lang]/index.astro`
Trouver la section `fanImages` (vers ligne 200-240) :
```javascript
const fanImages = locale === 'fr' ? [
  "https://i.ibb.co/.../visage-fr.jpg",
  "https://i.ibb.co/.../trinite-fr.jpg",
  "https://i.ibb.co/.../combat-fr.jpg",
  "https://i.ibb.co/.../salut-fr.jpg"
] : locale === 'en' ? [
  "https://i.ibb.co/.../visage-en.jpg",
  "https://i.ibb.co/.../trinite-en.jpg",
  "https://i.ibb.co/.../combat-en.jpg",
  "https://i.ibb.co/.../salut-en.jpg"
] : locale === 'es' ? [
  ...
] : ... // autres langues
```
Remplacer l'URL correspondante (index 0=visage, 1=trinite, 2=combat, 3=salut).

### 3. Build + Deploy
```bash
cd "C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync"
npm run build && vercel --prod --force
```

### 4. Vérifier
- Ouvrir `https://kikienchrist.vercel.app/{lang}/`
- Hero → 4 miniatures visibles, net, bon ratio
- Inspecter : `<img class="fan-1" src="https://i.ibb.co/...">` etc.

## Pourquoi ImgBB et pas Lulu ?
- **Lulu** : thumbnails 384px (trop petit pour Hero fan + JSON-LD `image`)
- **Payhip** : 1500px via CDN mais URLs dynamiques (`cdn-cgi/image/...`)
- **ImgBB** : URLs directes stables, haute résol, CDN rapide, gratuit

## Notes importantes
- **FR** : gardé thumbnails Lulu (384px) car pas d'ImgBB fourni — si tu en as, remplacer
- **Livre 4 (Salut)** : même URL pour toutes langues (pas de couv. traduite) → OK
- **Ordre** : ne pas inverser (1=visage, 2=trinite, 3=combat, 4=salut)
- **Cache Vercel** : `--force` requis pour voir les nouvelles images immédiatement

## URLs de référence (Payhip couvertures 1500px)
| Livre | Payhip Cover URL (1500px) |
|-------|---------------------------|
| Visage | `https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jr6cuoqbdjve1nhsh1jab2lb1m.jpg` |
| Trinité | `https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrcsv37b2fb46i1dte1rj08861f.jpg` |
| Combat | `https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfbrjdb17lq1329mbfk4hmnb1f.jpg` |
| Salut | `https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1jrfa7u058qtnq2t961lbv16pp1f.jpg` |

*Utilise ces URLs source pour uploader sur ImgBB si besoin de nouvelle version.*

---
*Skill créé le 2025-11-20. État : 32/36 miniatures ImgBB (FR 0/4, autres 4/4).*