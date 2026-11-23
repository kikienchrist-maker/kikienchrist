---
name: kikienchrist-email-marketing
description: "Email Marketing Complet (Provider, Séquences, Segmentation, Templates, Automatisation, RGPD, Métriques, Deliverability)"
version: "1.0"
---

# Skill: kikienchrist-email-marketing

## Objectif
Transformer les **inscrits newsletter** → **acheteurs livres** via séquences automatisées, segmentation intelligente, et deliverability optimale.

---

## 1. Choix Provider (Recommandation)

| Provider | Gratuit Jusqu'à | Automatisation | Segmentation | Multilingue | Deliverability | Prix Payant |
|----------|-----------------|----------------|--------------|-------------|----------------|-------------|
| **MailerLite** | 1 000 abonnés / 12k emails/mois | ✅ Visuel (drag-drop) | ✅ Tags, groupes, champs custom | ✅ Campagnes par langue | Excellente | $10/mois (1k-2.5k) |
| **Brevo** (ex Sendinblue) | 300 emails/jour (illimité contacts) | ✅ Avancé (workflow) | ✅ Avancé (scoring, cycles) | ✅ | Bonne | $25/mois (20k emails) |
| **ConvertKit** | 1 000 abonnés (limité) | ✅ Séquences visuelles | ✅ Tags, segments | ⚠️ Manuel | Excellente | $29/mois (1k) |
| **Buttondown** | 1 000 abonnés | ❌ Basique | ❌ | ❌ | Excellente | $9/mois (illimité) |

### **Recommandation : MailerLite**
- **Gratuit** pour démarrage (1k abonnés = ~6-12 mois)
- **Interface française** + support FR
- **Automatisation visuelle** simple (déclencheur → action → délai)
- **Tags multilingues** : `fr`, `en`, `es`... + `interest:visage`, `interest:trinite`
- **RGPD natif** : Double opt-in, désinscription 1 clic, export données
- **Deliverability** : IP dédiées partagées, authentification DKIM/SPF/DMARC gérée

---

## 2. Architecture Intégration

```
Netlify Forms (Site) 
    │
    ▼ (Webhook POST)
┌─────────────────────┐
│  Netlify Function   │  (Validation + Nettoyage + Langue déduite)
│  /api/newsletter    │
└─────────────────────┘
    │
    ▼ (API Call)
┌─────────────────────┐
│    MailerLite       │  (Create/Update subscriber + Tags + Trigger Automation)
│   API v2            │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Séquence Automatique (14 jours / 5 emails)
└─────────────────────┘
```

---

## 3. Netlify Function : Webhook Newsletter

### `netlify/functions/newsletter.ts`
```typescript
import type { Handler } from '@netlify/functions';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID; // Groupe principal "Newsletter"
const WEBHOOK_SECRET = process.env.NETLIFY_FORM_WEBHOOK_SECRET;

interface SubscriberData {
  email: string;
  fields: Record<string, string>;
  groups: string[];
  tags: string[];
}

export const handler: Handler = async (event) => {
  // 1. Vérification méthode + secret
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const signature = event.headers['x-netlify-signature'] || event.headers['X-Netlify-Signature'];
  if (signature !== WEBHOOK_SECRET) {
    console.warn('Invalid webhook signature');
    return { statusCode: 401, body: 'Unauthorized' };
  }

  // 2. Parser payload Netlify Forms
  let payload: { data: { email: string; 'form-name': string; locale?: string } };
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { email, locale } = payload.data;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: 'Invalid email' };
  }

  // 3. Déduire langue (priority: form field > header > default)
  const lang = (locale || 'fr').toLowerCase().slice(0, 2);
  const supportedLangs = ['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi'];
  const finalLang = supportedLangs.includes(lang) ? lang : 'fr';

  // 4. Préparer données MailerLite
  const subscriber: SubscriberData = {
    email: email.toLowerCase().trim(),
    fields: {
      name: '', // Optionnel: demander prénom dans formulaire futur
      language: finalLang,
      source: 'website-footer', // ou 'hero-cta', 'blog-inline', 'lead-magnet'
      signup_date: new Date().toISOString().split('T')[0],
    },
    groups: [MAILERLITE_GROUP_ID],
    tags: [
      `lang:${finalLang}`,
      'source:website',
      'status:new',
    ],
  };

  // 5. Appel API MailerLite (Create or Update)
  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriber),
    });

    if (!response.ok) {
      const error = await response.json();
      // Si existe déjà (422), faire PUT update
      if (response.status === 422 && error.message?.includes('already exists')) {
        const updateRes = await fetch(`https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields: subscriber.fields, groups: subscriber.groups, tags: subscriber.tags }),
        });
        if (!updateRes.ok) throw new Error('Update failed');
      } else {
        throw new Error(`MailerLite API error: ${response.status}`);
      }
    }

    // 6. Succès → Trigger automation via tag "status:new" (configuré dans MailerLite)
    return { statusCode: 200, body: JSON.stringify({ success: true, email, lang: finalLang }) };
  } catch (error) {
    console.error('Newsletter webhook error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
```

### Variables d'Environnement (Netlify Dashboard → Site Settings → Environment Variables)
```bash
MAILERLITE_API_KEY=ml_xxxxxxxxxxxxxxxxxxxxxxxx
MAILERLITE_GROUP_ID=123456789
NETLIFY_FORM_WEBHOOK_SECRET=super-secret-random-string-32-chars
```

### Configuration Netlify Forms (Site)
```astro
<!-- Newsletter.astro — Ajouter attribut netlify-form + hidden fields -->
<form class="capture" action="#" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="newsletter" />
  <input type="hidden" name="locale" value={locale} />  <!-- Langue courante -->
  <input type="checkbox" name="bot-field" style="display: none" tabindex="-1" autocomplete="off" />
  
  <label for="newsletter-email" class="visually-hidden">{t.newsletter.placeholder}</label>
  <input type="email" id="newsletter-email" name="email" placeholder={t.newsletter.placeholder} required autocomplete="email" maxlength="254" />
  <button class="btn btn-primary" type="submit">{t.newsletter.buttonText}</button>
</form>
```

---

## 4. Séquences Automatisées (MailerLite)

### Séquence Bienvenue "7 Prières" (14 jours / 5 emails)

| Email | Déclencheur | Délai | Objet (FR) | Contenu Clé | CTA Principal | Tags Ajoutés |
|-------|-------------|-------|------------|-------------|---------------|--------------|
| **#1** | Inscription (`status:new`) | Immédiat | "Vos 7 prières sont arrivées 🙏" | Livraison PDF + mot personnel + lien téléchargement | "Télécharger mon guide" | `status:delivered`, `sequence:welcome` |
| **#2** | Ouverture #1 OU 2 jours | 2 jours | "Pourquoi 2 min de prière changent tout" | Bénéfices prière + extrait Livre 1 (Visage) + lien | "Découvrir 'Le visage de Dieu'" | `interest:visage`, `opened:welcome-1` |
| **#3** | Clic lien Livre 1 OU 5 jours | 5 jours | "Le secret d'une vie spirituelle simple" | Témoignage + extrait Livre 3 (Combat) + lien | "Découvrir 'Le dernier Combat'" | `interest:combat`, `clicked:visage` |
| **#4** | Ouverture #3 OU 9 jours | 9 jours | "Vous n'êtes pas seul(e) dans vos doutes" | Empathie + extrait Livre 2 (Trinité) + lien | "Découvrir 'Les secrets de la Trinité'" | `interest:trinite`, `opened:welcome-3` |
| **#5** | Clic lien Livre 2/3 OU 14 jours | 14 jours | "Une invitation pour aller plus loin" | Pack 4 livres / offre spéciale (ex: -10% code) | "Voir les 4 livres + Offre" | `interest:all`, `sequence:complete` |

### Configuration MailerLite (Visuel)
1. **Automation** → "New Automation" → Trigger: "When subscriber added to group" → Group: "Newsletter"
2. **Filter** : Tag `status:new` (ajouté par webhook)
3. **Steps** :
   - Email #1 → Delay 2 days → Condition: "Opened #1?" → Yes: Email #2 / No: Email #2 (same)
   - Email #2 → Delay 3 days → Condition: "Clicked 'Visage'?" → Yes: Tag `interest:visage` + Email #3 / No: Email #3
   - ... etc.
4. **End** : Remove tag `status:new`, add tag `sequence:complete`

### Séquences Complémentaires (Futur)
| Séquence | Trigger | Objectif |
|----------|---------|----------|
| **Abandon Panier** | Clic bouton achat sans conversion (tracking GA4) | Relance 24h + 72h avec bénéfices |
| **Réactivation** | Inactif 60 jours (pas d'ouverture) | "On vous a manqué" + nouveau lead magnet |
| **Post-Achat** | Webhook plateforme (Lulu/Payhip/GP) → Tag `customer` | Remerciement + demande avis + cross-sell |
| **Anniversaire** | Date inscription + 1 an | Cadeau (ebook gratuit / code promo) |

---

## 5. Segmentation Avancée

### Tags Système (Auto-gérés)
| Tag | Signification | Source |
|-----|---------------|--------|
| `lang:fr` / `lang:en`... | Langue préférée | Webhook (form locale) |
| `source:website` / `source:blog` / `source:lead-magnet` | Origine inscription | Webhook (hidden field) |
| `interest:visage` / `interest:trinite` / `interest:combat` / `interest:salut` | Intérêt livre | Clics emails / Tracking site |
| `status:new` / `status:active` / `status:inactive` / `status:customer` | Cycle de vie | Automation / Webhook achat |
| `sequence:welcome` / `sequence:complete` | Progression séquences | Automation |

### Segments Dynamiques (MailerLite → "Segments")
| Segment | Règle | Usage |
|---------|-------|-------|
| **FR Actifs** | `lang:fr` AND `status:active` | Campagnes FR hebdo |
| **Prospects Visage** | `interest:visage` AND NOT `status:customer` | Promo Livre 1 |
| **Clients** | `status:customer` | Cross-sell, fidélité, avis |
| **Inactifs 30j** | `status:active` AND last_open > 30 days | Réactivation |
| **Inactifs 90j** | `status:active` AND last_open > 90 days | Dernière chance / Suppression |
| **Multilingues** | Multiple `lang:` tags | Campagnes globales |

---

## 6. Templates Emails (Design System Cohérent)

### Structure Template Base
```html
<!-- MailerLite Drag-Drop Editor → Custom HTML Block -->
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    /* Tokens CSS adaptés email (inline) */
    :root { --ink:#1c1a17; --paper:#fdfbf7; --gold:#b8860b; --accent:#c46b1a; --line:#e8e1d5; }
    body { margin:0; padding:0; font-family: system-ui, -apple-system, sans-serif; background:var(--paper); color:var(--ink); line-height:1.6; }
    .wrapper { max-width:600px; margin:0 auto; padding:24px; }
    .card { background:#fff; border:1px solid var(--line); border-radius:12px; padding:32px; margin:16px 0; }
    .btn { display:inline-block; background:var(--accent); color:#fff; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:700; }
    .btn:hover { background:#b05d16; }
    .footer { font-size:12px; color:#8a7d6b; text-align:center; padding:24px; }
    .unsubscribe { color:#8a7d6b; text-decoration:underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header Logo -->
    <div style="text-align:center; padding:16px 0;">
      <a href="https://kikienchrist.vercel.app/{{lang}}/" style="color:var(--ink); text-decoration:none; font-weight:700; font-size:20px;">Kiki en Christ</a>
    </div>
    
    <!-- Contenu Principal -->
    <div class="card">
      {{content}}
    </div>
    
    <!-- CTA Principal -->
    <div style="text-align:center; margin:24px 0;">
      <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Kiki en Christ · {{current_year}} · <a href="https://kikienchrist.vercel.app/{{lang}}/confidentialite/" class="unsubscribe">Politique de confidentialité</a></p>
      <p><a href="{{unsubscribe_url}}" class="unsubscribe">Se désinscrire</a> · <a href="{{preferences_url}}" class="unsubscribe">Préférences</a></p>
    </div>
  </div>
</body>
</html>
```

### Variables MailerLite (Dans Template)
| Variable | Source | Exemple |
|----------|--------|---------|
| `{{lang}}` | Subscriber field `language` | `fr`, `en` |
| `{{subject}}` | Email subject line | "Vos 7 prières..." |
| `{{content}}` | Email body (rich text) | Contenu spécifique |
| `{{cta_url}}` | Custom field / Link | `https://kikienchrist.vercel.app/fr/#livres` |
| `{{cta_text}}` | Custom field | "Découvrir les livres" |
| `{{unsubscribe_url}}` | MailerLite auto | Lien désinscription 1-clic |
| `{{preferences_url}}` | MailerLite auto | Centre préférences |
| `{{current_year}}` | Date envoi | 2025 |

---

## 7. Lead Magnet "7 Prières" — Livraison Automatisée

### PDF Hébergement
- **Vercel Blob** (recommandé) : `https://blob.vercel-storage.com/7-prieres-fr.pdf`
- **Netlify** : `https://kikienchrist.netlify.app/7-prieres-fr.pdf`
- **GitHub Releases** : `https://github.com/user/repo/releases/download/v1/7-prieres-fr.pdf`

### Livraison Email #1
```html
<!-- Contenu Email #1 -->
<p>Bonjour,</p>
<p>Merci de nous faire confiance pour votre chemin spirituel. Voici votre guide gratuit <strong>"7 Prières pour apprivoiser la prière"</strong> :</p>

<div style="text-align:center; margin:24px 0;">
  <a href="https://blob.vercel-storage.com/7-prieres-{{lang}}.pdf" class="btn" target="_blank" rel="noopener">📥 Télécharger mon guide (PDF)</a>
</div>

<p><small>Le lien s'ouvre dans un nouvel onglet. Si le téléchargement ne démarre pas, faites clic droit → "Enregistrer la cible sous..."</small></p>

<p>Ce guide vous accompagnera pour :</p>
<ul>
  <li>Commencer à prier même sans mots</li>
  <li>Créer une habitude quotidienne simple</li>
  <li>Retrouver la paix intérieure</li>
</ul>

<p>Avec bienveillance,<br>L'équipe Kiki en Christ</p>
```

### PDF Multilingue (9 versions)
| Langue | Fichier | Titre PDF |
|--------|---------|-----------|
| FR | `7-prieres-fr.pdf` | "7 Prières pour apprivoiser la prière" |
| EN | `7-prayers-en.pdf` | "7 Prayers to Tame Prayer" |
| ES | `7-oraciones-es.pdf` | "7 Oraciones para Domar la Oración" |
| DE | `7-gebete-de.pdf` | "7 Gebete zum Zähmen des Gebets" |
| PT | `7-oracoes-pt.pdf` | "7 Orações para Domar a Oração" |
| IT | `7-preghiere-it.pdf` | "7 Preghiere per Addomesticare la Preghiera" |
| RU | `7-molitv-ru.pdf` | "7 Молитв для Приручения Молитвы" |
| ZH | `7-prayers-zh.pdf` | "7个驯服祈祷的祈祷" |
| HI | `7-prarthana-hi.pdf` | "प्रार्थना को वश में करने के लिए 7 प्रार्थनाएं" |

---

## 8. Deliverability & Réputation

### Configuration Technique (MailerLite + Domaine)
1. **Domaine d'envoi** : `newsletter.kikienchrist.vercel.app` (sous-domaine dédié)
2. **DKIM** : Configurer dans MailerLite → Settings → Domains → Add Domain → Copier enregistrements DNS
3. **SPF** : `v=spf1 include:_spf.mailerlite.com ~all` (dans DNS domaine principal)
4. **DMARC** : `v=DMARC1; p=quarantine; rua=mailto:dmarc@kikienchrist.vercel.app`
5. **Réchauffage IP** : MailerLite gère (IP partagées réputées)

### Bonnes Pratiques Contenu
- **Ratio texte/image** : ≥ 60% texte / ≤ 40% images
- **Liens** : ≤ 3 liens par email (dont 1 CTA principal)
- **Objet** : < 50 caractères, pas de SPAM words (GRATUIT, URGENT, €€€)
- **Préheader** : Complément objet (visible dans inbox)
- **Alt text** : Sur toutes images
- **Version texte** : Toujours fournie (MailerLite auto-génère)

### Hygiène Liste (Mensuel)
```bash
# Via MailerLite Dashboard → Subscribers → Filter → Inactive > 90 days → Delete
# OU Segment "Inactifs 90j" → Action "Remove from group"
```

---

## 9. Métriques & KPIs (Hebdo/Mensuel)

| KPI | Cible | Outil | Fréquence |
|-----|-------|-------|-----------|
| **Taux Ouverture** | > 35% (FR) / > 25% (autres) | MailerLite | Hebdo |
| **Taux Clic (CTR)** | > 3% | MailerLite | Hebdo |
| **Taux Conversion (Clic → Achat)** | > 2% | GA4 + UTM | Mensuel |
| **Taux Désinscription** | < 0.5% | MailerLite | Hebdo |
| **Taux Rebond (Bounce)** | < 2% | MailerLite | Hebdo |
| **Spam Complaints** | < 0.01% | MailerLite / Postmaster | Mensuel |
| **Croissance Liste** | +50/mois | MailerLite | Mensuel |
| **Revenus/Email** | > $0,10 | Plateformes + UTM | Mensuel |

### UTM Tracking (Obligatoire sur Tous Liens)
```text
https://kikienchrist.vercel.app/fr/#livres?utm_source=mailerlite&utm_medium=email&utm_campaign=welcome-2&utm_content=cta-visage
```

---

## 10. RGPD & Conformité

### Checklist RGPD Email
- [ ] **Double Opt-in** : Activé dans MailerLite (Settings → Forms → Double opt-in) — Recommandé
- [ ] **Preuve Consentement** : MailerLite stocke IP + timestamp + formulaire
- [ ] **Droit Accès/Rectification/Effacement** : Lien "Préférences" + "Désinscription" dans chaque email
- [ ] **DPA Signé** : MailerLite → Settings → Legal → Data Processing Addendum
- [ ] **Transferts Hors UE** : MailerLite (EU) → Serveurs UE → Conforme
- [ ] **Registre Traitements** : Documenté (voir skill `security`)
- [ ] **Durée Conservation** : Jusqu'à désinscription + 30 jours (suppression auto inactifs 90j)

---

*Skill créé le 2025-11-20. Email Marketing = levier #1 conversion abonnés → clients.*