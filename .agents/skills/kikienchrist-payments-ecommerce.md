---
name: kikienchrist-payments-ecommerce
description: "Paiements & E-commerce (Plateformes, Webhooks, TVA, Comptabilité, Remboursements, Fraude, Réconciliation, Multi-devises)"
version: "1.0"
---

# Skill: kikienchrist-payments-ecommerce

## Objectif
Maîtriser la **chaîne complète paiement → commande → livraison → comptabilité** via nos 3 plateformes (Lulu, Payhip, Google Play) — sans stock, sans paiement direct, mais avec visibilité totale.

---

## 1. Architecture Actuelle (Modèle "Marketplace")

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Visiteur  │────▶│  Notre Site  │────▶│  Plateforme     │
│  (Client)   │     | (Liens UTM)  │     │  (Vendeur)      │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                            ┌──────────────────────┼──────────────────────┐
                            ▼                      ▼                      ▼
                     ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
                     │   LULU      │        │   PAYHIP    │        │ GOOGLE PLAY │
                     │ (Papier)    │        │  (Ebook)    │        │  (Audio)    │
                     └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
                            │                      │                      │
                            ▼                      ▼                      ▼
                     ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
                     │ Impression  │        │ Téléchargement│       │ Streaming/  │
                     │ à la demande│        │ Instantané  │       │ Téléchargement│
                     │ Expédition  │        │ (PDF/EPUB)  │       │ (App GP)    │
                     └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
                            │                      │                      │
                            ▼                      ▼                      ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │              COMPTABILITÉ (Royalties)                   │
                     │  Lulu Dashboard + Payhip Dashboard + Google Play Console │
                     └─────────────────────────────────────────────────────────┘
```

**Point Clé** : Nous **ne traitons jamais** de paiement, CB, données bancaires. Plateformes = *Merchant of Record*.

---

## 2. Plateformes — Détails Techniques

### Lulu (Livre Papier)
| Paramètre | Valeur |
|-----------|--------|
| **Modèle** | Print-on-Demand (impression à la commande) |
| **Prix Auteur** | Prix public - (Coût impression + Marge Lulu 20%) = **Revenu Net** |
| **Coût Impression** | ~3-5 € / livre (selon pages, format, couverture) |
| **Marge Lulu** | 20% du prix public |
| **Notre Revenu** | ~40-50% prix public (ex: 13,90 € → ~6 € net) |
| **Devises** | EUR, USD, GBP, CAD, AUD (prix localisés) |
| **Paiement Auteur** | Mensuel (seuil $25) — PayPal / Virement / Chèque |
| **TVA** | Lulu = *Deemed Supplier* (IOSS/OSS) — Gère TVA selon destination |
| **Expédition** | 5-15 jours ouvrés — Suivi inclus |
| **Retours** | 30 jours (Lulu gère) — Remboursement client, déduit de nos royalties |
| **ISBN** | Gratuit (Lulu) — 1 par format (Papier) |
| **Dashboard** | https://www.lulu.com/author/dashboard |
| **API** | ❌ Pas d'API publique (scraping/export CSV seulement) |

### Payhip (Ebook PDF/EPUB)
| Paramètre | Valeur |
|-----------|--------|
| **Modèle** | Vente numérique instantanée |
| **Frais Payhip** | **5% + 0,25 $** par transaction (Plan Gratuit) — 0% sur plan Plus ($29/mois) |
| **Frais Stripe/PayPal** | ~2,9% + 0,30 $ (à notre charge via Payhip) |
| **Notre Revenu** | ~92% prix public (ex: 3,99 $ → ~3,67 $ net) |
| **Devises** | 135+ devises (conversion auto Stripe) |
| **Paiement Auteur** | Instantané (Stripe Connect) / Quotidien (PayPal) — Seuil $0 |
| **TVA** | Payhip = *Deemed Supplier* (OSS UE) — Gère TVA numérique intra-UE |
| **Livraison** | Instantanée (Lien téléchargement + Email auto) |
| **Retours** | 30 jours (configurable) — Fichier révoqué si possible |
| **ISBN** | Optionnel (Payhip n'en exige pas) |
| **Dashboard** | https://payhip.com/dashboard |
| **API** | ✅ **API v2** (Produits, Ventes, Webhooks, Affiliés) |
| **Webhooks** | `sale.completed`, `sale.refunded`, `product.updated`, `affiliate.sale` |

### Google Play Books (Audiobook)
| Paramètre | Valeur |
|-----------|--------|
| **Modèle** | Vente / Location / Abonnement (Google Play Books) |
| **Partage Revenu** | **52%** pour auteur (48% Google) — Prix public défini par nous |
| **Notre Revenu** | 52% prix public (ex: 5,49 $ → ~2,85 $ net) |
| **Devises** | 60+ devises (prix localisés par pays) |
| **Paiement Auteur** | Mensuel (seuil $10) — Virement bancaire (Google Payments) |
| **TVA** | Google = *Deemed Supplier* — Gère TVA selon pays acheteur |
| **Livraison** | Streaming (App Google Play Books) + Téléchargement offline |
| **Retours** | Politique Google (généralement 48h-7j selon pays) |
| **ISBN** | Requis (1 par audiobook) — À acheter (Bowker/ISBN International) |
| **Dashboard** | https://play.google.com/console/books |
| **API** | ✅ **Google Play Books Partner API** (Catalogue, Ventes, Rapports) |
| **Auth** | Service Account (Google Cloud) — OAuth2 |

---

## 3. URLs Achat par Langue (Rappel — Skill `i18n-urls`)

### Structure URL Type
```
Lulu (Papier)     : https://www.lulu.com/shop/[ISBN]/[slug]?lang=[fr|en|es|de|pt|it|ru|zh|hi]
Payhip (Ebook)    : https://payhip.com/b/[PRODUCT_ID]?lang=[fr|en|es|de|pt|it|ru|zh|hi]
Google Play (Audio): https://play.google.com/store/books/details/[VOLUME_ID]?hl=[fr|en|es|de|pt|it|ru|zh|hi]
```

### Paramètres UTM Obligatoires (Tracking)
```text
?utm_source=kikienchrist&utm_medium=website&utm_campaign=book-visage&utm_content=btn-paper-fr&ref=aff_xxx
```

---

## 4. Webhooks & Automatisation (Payhip → Nos Systèmes)

### Payhip Webhook `sale.completed` (Le Plus Important)
```json
{
  "event": "sale.completed",
  "data": {
    "sale_id": "sale_abc123",
    "product_id": "prod_visage_ebook_fr",
    "product_name": "Le Visage de Dieu (Ebook FR)",
    "quantity": 1,
    "price": 3.99,
    "currency": "USD",
    "customer": {
      "email": "client@example.com",
      "name": "Jean Dupont",
      "country": "FR",
      "vat_number": null
    },
    "affiliate": {
      "id": "aff_jean123",
      "email": "affiliate@example.com",
      "commission": 1.20
    },
    "utm": {
      "source": "kikienchrist",
      "medium": "website",
      "campaign": "book-visage",
      "content": "btn-ebook-fr"
    },
    "created_at": "2025-11-20T14:30:00Z"
  }
}
```

### Netlify Function : Réception Webhook Payhip
```typescript
// netlify/functions/payhip-webhook.ts
import type { Handler } from '@netlify/functions';

const PAYHIP_WEBHOOK_SECRET = process.env.PAYHIP_WEBHOOK_SECRET;
const FIRSTPROMOTER_API_KEY = process.env.FIRSTPROMOTER_API_KEY;
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  // 1. Vérifier signature Payhip (HMAC SHA256)
  const signature = event.headers['x-payhip-signature'] || event.headers['X-Payhip-Signature'];
  const expectedSignature = crypto
    .createHmac('sha256', PAYHIP_WEBHOOK_SECRET)
    .update(event.body || '')
    .digest('hex');
  
  if (signature !== expectedSignature) {
    console.warn('Invalid Payhip webhook signature');
    return { statusCode: 401, body: 'Unauthorized' };
  }

  // 2. Parser payload
  let payload: any;
  try { payload = JSON.parse(event.body || '{}'); } 
  catch { return { statusCode: 400, body: 'Invalid JSON' }; }

  if (payload.event !== 'sale.completed') {
    return { statusCode: 200, body: 'Ignored' }; // Autres événements : refund, etc.
  }

  const sale = payload.data;
  const { sale_id, product_id, customer, affiliate, utm } = sale;

  // 3. Taguer client dans MailerLite (status:customer + interest:book)
  try {
    const bookId = product_id.split('_')[1]; // "visage", "trinite", etc.
    const lang = product_id.split('_').pop(); // "fr", "en", etc.
    
    await fetch(`https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(customer.email)}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${MAILERLITE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: { last_purchase: new Date().toISOString().split('T')[0] },
        tags: [
          'status:customer',
          `purchased:${bookId}`,
          `lang:${lang}`,
          `source:payhip`
        ].join(',')
      }),
    });
  } catch (e) { console.error('MailerLite tag error:', e); }

  // 4. Notifier FirstPromoter (si affilié)
  if (affiliate?.id && FIRSTPROMOTER_API_KEY) {
    try {
      await fetch('https://api.firstpromoter.com/v1/conversions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${FIRSTPROMOTER_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_code: affiliate.id,
          amount: sale.price * (affiliate.commission / sale.price), // Commission exacte
          currency: sale.currency,
          customer_email: customer.email,
          order_id: sale_id,
          metadata: { product_id, utm }
        }),
      });
    } catch (e) { console.error('FirstPromoter conversion error:', e); }
  }

  // 5. Log vente (Google Sheets / Airtable / DB pour réconciliation)
  await logSaleToSheet({ sale_id, product_id, customer, affiliate, utm, ...sale });

  return { statusCode: 200, body: 'OK' };
};

async function logSaleToSheet(data: any) {
  // Ex: Google Sheets API, Airtable, ou simple console.log pour début
  console.log('SALE_LOG:', JSON.stringify(data));
}
```

### Variables d'Environnement (Netlify / Vercel)
```bash
PAYHIP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx  # Payhip Dashboard > Settings > Webhooks
FIRSTPROMOTER_API_KEY=fp_live_xxxxxxxxxxxxxxxxxxxxxxxx
MAILERLITE_API_KEY=ml_xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_SHEETS_API_KEY=...  # Optionnel pour log centralisé
```

---

## 5. Réconciliation Comptable (Mensuelle)

### Sources de Vérité
| Plateforme | Rapport | Fréquence | Métriques Clés |
|------------|---------|-----------|----------------|
| **Lulu** | "Royalty Report" (CSV) | Mensuel (vers 15 du mois suivant) | Unités vendues, Revenu net, Pays, Devises, Retours |
| **Payhip** | "Sales Export" (CSV) + Webhooks temps réel | Quotidien (auto) + Mensuel (réconciliation) | Ventes, Frais, Net, Affiliés, Pays, TVA |
| **Google Play** | "Sales Report" (CSV) | Mensuel (vers 15) | Unités, Revenu 52%, Pays, Devises, Remboursements |

### Processus Mensuel (Checklist)
```
[ ] 1. Télécharger 3 rapports CSV (Lulu, Payhip, Google Play)
[ ] 2. Importer dans Google Sheets "Comptabilité 2025" (onglets par plateforme)
[ ] 3. Vérifier cohérence : Webhooks Payhip reçus = Lignes CSV Payhip
[ ] 4. Calculer Total Revenu Net (EUR) : Conversion devises (taux BCE mensuel moyen)
[ ] 5. Séparer : Physique (Lulu) vs Numérique (Payhip+GP) — Règles TVA différentes
[ ] 6. Vérifier seuils TVA (Franchise micro-entreprise : 37,5k€ services / 188,7k€ biens)
[ ] 7. Comptabiliser : Revenus = Royalties (pas CA brut) — Charges = Frais plateformes + Outils + Marketing
[ ] 8. Factures fournisseurs : Lulu (si frais), Payhip (plan Plus), Google (aucun), Outils (Canva, Buffer, FirstPromoter, etc.)
[ ] 9. Déclaration URSSAF / Impôts (Micro-BNC : CA = Royalties nettes)
[ ] 10. Archiver CSV + Notes dans /backups/comptabilité/YYYY-MM/
```

### Modèle Google Sheets (Onglet "Synthèse Mensuelle")
| Mois | Lulu Net (€) | Payhip Net ($) | GP Net ($) | Total Net (€) | Taux Change $→€ | Charges (€) | Bénéfice Net (€) | TVA Due | Notes |
|------|--------------|----------------|------------|---------------|-----------------|-------------|------------------|---------|-------|
| 2025-11 | 1 250 | 850 | 420 | 2 450 | 0,92 | 320 | 2 130 | 0 | Lancement ES/DE |

---

## 6. Gestion Remboursements & Litiges

### Par Plateforme
| Plateforme | Politique | Notre Action |
|------------|-----------|--------------|
| **Lulu** | 30 jours, client initie retour → Lulu traite → Déduit de nos royalties mois suivant | Surveiller "Returns" dans rapport mensuel — Accepter (coût faire affaire) |
| **Payhip** | Configurable (défaut 30j) — Nous pouvons désactiver pour numériques | Désactiver retours ebook/audio (Art. L221-28 13°) — Cas par cas si défaut technique |
| **Google Play** | Politique Google (48h-7j selon pays) — Google décide | Accepter — Hors contrôle |

### Processus Interne
1. **Alerte** : Webhook `sale.refunded` (Payhip) / Ligne "Return" rapport Lulu/GP
2. **Vérification** : Motif (défaut technique ? → Corriger fichier) / Fraude ? (rare)
3. **Comptabilité** : Déduire du revenu net mois en cours
4. **Affilié** : FirstPromoter gère (commission annulée auto si conversion annulée)
5. **Client** : Répondre si contact direct (rare — plateformes gèrent support)

---

## 7. Prévention Fraude & Sécurité

### Risques (Faibles — Plateformes gèrent)
| Risque | Plateforme | Protection |
|--------|------------|------------|
| **Carte Volée** | Lulu / Payhip / GP | 3D Secure, Stripe Radar, Google Play Billing |
| **Remboursement Abusif** | Payhip (ebook) | Désactiver retours numériques / Révocation fichier |
| **Partage Liens Téléchargement** | Payhip | Limite téléchargements (configurable : 5 par défaut) / Expiration lien |
| **Affilié Fraude** (auto-achat) | FirstPromoter + Payhip | Délai validation commission (30j) / Seuil paiement 50€ / Vérification manuelle |

### Bonnes Pratiques
- **Jamais** de lien direct vers fichier (toujours via plateforme)
- **Watermark** PDF (optionnel Payhip : "Acheté par email@client.com")
- **Surveillance** : Pics ventes anormaux → Vérifier

---

## 8. Multi-Devises & Prix Psychologiques

### Prix Actuels (Exemples)
| Livre | Papier (Lulu) | Ebook (Payhip) | Audio (GP) |
|-------|---------------|----------------|------------|
| Visage | 13,90 € / $14.99 | 3,99 $ / 3,99 € | 5,49 $ / 5,49 € |
| Trinité | 14,90 € / $15.99 | 4,49 $ / 4,49 € | 5,99 $ / 5,99 € |
| Combat | 15,90 € / $16.99 | 4,99 $ / 4,99 € | 6,49 $ / 6,49 € |
| Salut | 12,90 € / $13.99 | 3,49 $ / 3,49 € | 4,99 $ / 4,99 € |

### Stratégie Prix
- **Prix Charmants** : .99 / .90 / .49 (psychologique)
- **Parité €/$** : 1€ ≈ $1 (simplicité) — Ajuster si change > 10%
- **Pack 4 Livres** : -15% vs achat unitaire (ex: 39,90 € vs 57,60 €)
- **Promos Ponctuelles** : -20% (Black Friday, Noël, Pâques) — Code promo Payhip / Prix promo Lulu

---

## 9. Évolution Future (Options)

| Option | Avantages | Inconvénients | Quand |
|--------|-----------|---------------|-------|
| **Shopify + Printful/Lulu API** | Contrôle total, branding checkout, upsells, email abandonment | Complexité, coûts fixes ($29+/mois), gestion TVA/expédition | > 500 ventes/mois |
| **Gumroad** (alternative Payhip) | Simplicité, audience intégrée, affiliation native | Frais 10% + frais paiement, moins de contrôle | Test parallèle |
| **Vente Directe (Stripe + Webhook)** | Marge max (0% plateforme), data client complète | **Gestion TVA complexe** (OSS obligatoire), support, remboursements, fraude, conformité | **Pas recommandé** avant scale significatif |
| **Kobo / Apple Books / Audible** | Nouveaux canaux audio/ebook | Gestion multiples dashboards, contrats exclusifs possibles | Après GP stabilisé |

---

## 10. Checklist Paiements (Trimestrielle)

| Vérification | Fréquence | Responsable |
|--------------|-----------|-------------|
| Webhooks Payhip reçus = Ventes CSV | Mensuel | Vous |
| Seuils paiement atteints (Lulu $25, GP $10) | Mensuel | Vous |
| Conversion devises cohérente (taux BCE) | Mensuel | Vous |
| Frais plateformes conformes (Payhip 5%, Lulu 20%, GP 48%) | Trimestriel | Vous |
| Affiliés payés (FirstPromoter) | Mensuel | FirstPromoter (auto) |
| TVA : Royalties < seuils franchise | Mensuel | Comptable |
| Sauvegarde rapports CSV (3 plateformes) | Mensuel | Vous (`backup.sh`) |
| Mise à jour prix (change, promos, nouveaux livres) | Selon besoin | Vous |

---

*Skill créé le 2025-11-20. Paiements = visibilité totale sans complexité opérationnelle (plateformes gèrent le dur).*