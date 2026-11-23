---
title: "Politique des cookies"
pageSlug: "cookies"
lang: "fr"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---

# Politique des cookies

La présente politique explique ce que sont les cookies, comment **Kiki en Christ** les utilise, quels types de cookies sont déposés, et comment vous pouvez gérer vos préférences.

## 1. Qu'est-ce qu'un cookie ?

Un **cookie** (ou traceur) est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la consultation d'un site web. Il permet au site de reconnaître votre terminal lors de visites ultérieures.

Les cookies peuvent être :
- **Cookies de session** : supprimés à la fermeture du navigateur
- **Cookies persistants** : restent jusqu'à expiration ou suppression manuelle (max 13 mois selon ePrivacy)

## 2. Responsable du traitement

**Kiki en Christ** — contact@kikienchrist.com

## 3. Catégories de cookies utilisés

### a) Cookies nécessaires (toujours actifs)
Indispensables au fonctionnement du site. **Ne peuvent pas être désactivés.**

| Nom | Finalité | Durée | Type |
|-----|----------|-------|------|
| `preferred-lang` | Mémoriser la langue choisie | 1 an | Persistant |
| `kikienchrist-consent` | Mémoriser vos préférences cookies | 1 an | Persistant |
| Session Vercel/Netlify | Sécurité, CSRF, load balancing | Session | Session |

### b) Cookies de mesure d'audience (optionnels — consentement requis)
**Google Analytics 4 (GA4)** — Données anonymisées, IP masquée.

| Nom | Finalité | Durée | Type |
|-----|----------|-------|------|
| `_ga` | Identifier les utilisateurs uniques | 14 mois | Persistant |
| `_ga_<ID>` | Persister l'état de session | 14 mois | Persistant |
| `_gid` | Distinguer les utilisateurs (24h) | 24h | Persistant |
| `_gat` | Limiter le taux de requêtes | 1 min | Persistant |

**Base légale** : Consentement (RGPD Art. 6.1.a + ePrivacy Art. 5.3)  
**Sous-traitant** : Google LLC (USA) — Data Processing Amendment signé, clauses contractuelles types.

### c) Cookies marketing (réservés — actuellement inutilisés)
Aucun cookie marketing n'est déposé à ce jour. Cette catégorie est réservée pour de futures campagnes (ex: Meta Pixel, Google Ads). Si activée : consentement requis.

### d) Cookies fonctionnels (réservés — actuellement inutilisés)
Aucun cookie fonctionnel tiers n'est déposé. Réservé pour futures fonctionnalités (chat, lecteur vidéo, formulaires avancés). Si activée : consentement requis.

## 4. Gestion de votre consentement

### Lors de votre première visite
Une **bannière cookies** s'affiche (bas de page) avec 3 choix :
- **Tout accepter** → Tous les cookies (analytics + futurs marketing/functional)
- **Tout refuser** → Seuls les cookies nécessaires
- **Personnaliser** → (Si réactivé) Choix granulaire par catégorie

### Modifier vos préférences ultérieurement
- Cliquez sur l'icône **⚙️** (desktop) ou **Préférences** (mobile) en bas à droite
- Ou supprimez le cookie `kikienchrist-consent` via votre navigateur

### Retrait du consentement
À tout moment. Le retrait n'affecte pas la licéité du traitement antérieur.

## 5. Suppression des cookies tiers (si refus analytics)

Si vous refusez la mesure d'audience, notre script **nettoie automatiquement** les cookies GA4 existants :
- `_ga`, `_ga_*`, `_gid`, `_gat` → supprimés via `document.cookie` avec expiration passée

## 6. Consent Mode v2 (Google)

Nous utilisons **Google Consent Mode v2** :
- Par défaut : `analytics_storage: denied`, `ad_storage: denied`
- Si consentement analytics : `analytics_storage: granted`
- Cela permet à GA4 de modéliser les conversions sans cookies si refus

## 7. Vos droits

Voir [Politique de confidentialité](/fr/confidentialite/) — Section "Vos droits".

## 8. Contact

📧 **contact@kikienchrist.com**  
📮 **Kiki en Christ — [Adresse postale à compléter]**

---
*Dernière mise à jour : 15 janvier 2025 — Version 1.0*

