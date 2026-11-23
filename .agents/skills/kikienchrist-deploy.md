---
name: kikienchrist-deploy
description: "Déploiement complet du site Kiki en Christ sur Vercel (build + prod force)"
version: "1.0"
---

# Skill: kikienchrist-deploy

## Objectif
Builder le projet Astro et déployer en production sur Vercel avec cache bust.

## Prérequis
- Projet dans `C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync\`
- Vercel CLI installé et authentifié (`vercel login`)
- Node.js ≥ 18.14.1

## Étapes

### 1. Build local (vérification)
```bash
cd "C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync"
npm run build
```
- Vérifier : `10 page(s) built` (9 langues + racine)
- Vérifier : pas d'erreurs TypeScript / Astro

### 2. Déploiement production (force rebuild)
```bash
vercel --prod --force
```
- `--prod` : déploie sur l'URL de production (`https://kikienchrist.vercel.app`)
- `--force` : ignore le cache de build Vercel (important pour Middleware + images)

### 3. Vérification post-déploiement
- Test manuel : `https://kikienchrist.vercel.app/fr/` (desktop + mobile)
- Test redirection racine : `https://kikienchrist.vercel.app/` → doit rediriger vers `/fr/` (ou langue navigateur)
- Test langues : `/en/`, `/es/`, `/de/`, `/pt/`, `/it/`, `/ru/`, `/zh/`, `/hi/`
- Vérifier Hero Fan (4 miniatures visibles)
- Vérifier cartes livres même hauteur
- Vérifier boutons d'achat (URLs correctes par langue)

## Erreurs fréquentes & Fixes

| Erreur | Cause | Fix |
|--------|-------|-----|
| `Expected ")" but found ";"` | Syntaxe JSON-LD dans `[lang]/index.astro` | Corriger brackets `{}` vs `[]` |
| `Could not resolve "../layouts/MainLayout.astro"` | Mauvaise import path | Utiliser `../../layouts/MainLayout.astro` |
| Middleware 204 / pas de redirect | Retour `new Response(null, {status:204})` | Retourner `void` / `undefined` pour passer |
| Images Hero Fan cassées | URLs ImgBB invalides | Vérifier format `https://i.ibb.co/.../fichier.jpg` |
| Hauteurs cartes inégales | Script JS non exécuté | Vérifier `#books-grid` + script après `</section>` |
| Cache Vercel sert vieille version | Middleware/HTML en cache | `vercel --prod --force` |

## Commande unique (build + deploy)
```bash
cd "C:\Users\Admin\Desktop\site web livres\kikienchrist-vercel-sync" && npm run build && vercel --prod --force
```

## Notes
- Le script JS d'égalisation hauteur est **inline dans `[lang]/index.astro`** (après `#books-grid`)
- Les images Hero Fan sont **en dur dans `[lang]/index.astro`** (`fanImages` par locale)
- `translations.json` = **source unique de vérité** pour tout contenu textuel + URLs achat
- Middleware Vercel Edge gère la détection langue + cookie `preferred-lang` (1 an)

---
*Skill créé le 2025-11-20 pour automatiser le déploiement fiable.*