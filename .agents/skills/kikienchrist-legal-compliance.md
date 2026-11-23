---
name: kikienchrist-legal-compliance
description: "Conformité Légale (RGPD, ePrivacy, Mentions Légales, CGV, Cookies, Accessibilité, Droit de la Consommation, Propriété Intellectuelle)"
version: "1.0"
---

# Skill: kikienchrist-legal-compliance

## Objectif
Assurer **conformité légale complète** (France/UE + International) pour site e-commerce de livres spirituels multilingues — Éviter amendes, procès, perte confiance.

---

## 1. Cadre Juridique Applicable

| Réglementation | Portée | Sanctions Max |
|----------------|--------|---------------|
| **RGPD** (UE 2016/679) | Données personnelles (EU résidents) | 20M € ou 4% CA mondial |
| **ePrivacy Directive** (2002/58/CE) | Cookies, communications électroniques | Amendes nationales (ex: CNIL 150k€) |
| **Loi LCEN** (France 2004-575) | Mentions légales, hébergeur, modération | 75k € + 1 an prison |
| **Code Consommation** | CGV, droit rétractation, informations précontractuelles | 15k € (pers. morale) |
| **Directive Accessibilité** (UE 2016/2102) | Sites publics / services essentiels | Contrôle + injonction |
| **Droit Auteur / PI** | Contenu, images, marques | Dommages-intérêts + injonction |
| **TVA E-commerce** (UE 2021) | Ventes numériques (ebook/audio) intra-UE | Redressement + pénalités |

> **Statut Site** : E-commerce B2C (livres physiques + numériques) → **Toutes s'appliquent**.

---

## 2. Mentions Légales Obligatoires (Art. 6 LCEN)

### Page : `/fr/mentions-legales/` (et 8 autres langues)

```markdown
# Mentions Légales — Kiki en Christ

## 1. Éditeur du Site
**Kiki en Christ**  
[Forme juridique : Auto-entreprise / SAS / Association — À COMPLÉTER]  
Siège social : [Adresse complète — À COMPLÉTER]  
SIRET : [Numéro — À COMPLÉTER]  
TVA Intracommunautaire : [FRxx xxxxxxxxx — SI assujetti]  
Email : contact@kikienchrist.vercel.app  
Téléphone : [Numéro — OPTIONNEL]  
Directeur de la publication : [Nom du représentant légal]

## 2. Hébergeur
**Vercel Inc.**  
340 S Lemon Ave #4133, Walnut, CA 91789, USA  
https://vercel.com  
[Certifié EU-US Data Privacy Framework]

## 3. Propriété Intellectuelle
L'ensemble du site (textes, images, logos, marques, structure, code) est la propriété exclusive de Kiki en Christ ou fait l'objet d'une licence d'utilisation.  
Toute reproduction, représentation, modification, publication, adaptation totale ou partielle est interdite sans autorisation écrite préalable, sauf pour :
- Usage strictement personnel et privé
- Citation courte avec lien source (art. L122-5 CPI)
- Partage via boutons réseaux sociaux fournis

## 4. Données Personnelles (RGPD)
Voir **Politique de Confidentialité** → `/fr/confidentialite/`

## 5. Cookies
Voir **Politique Cookies** → `/fr/cookies/`

## 6. Responsabilité
Le site est accessible 24/7 sauf cas de force majeure, maintenance, panne.  
Kiki en Christ ne saurait être tenu responsable de dommages directs/indirects liés à l'utilisation du site.  
Les liens externes (Lulu, Payhip, Google Play, ImgBB, Vercel, Netlify) relèvent de la responsabilité de leurs éditeurs.

## 7. Droit Applicable & Juridiction
Droit français. Tribunaux compétents : [Ville du siège social].
```

---

## 3. Politique de Confidentialité (RGPD Art. 12-14)

### Page : `/fr/confidentialite/`

```markdown
# Politique de Confidentialité — Kiki en Christ

**Dernière mise à jour : [Date]**

## 1. Responsable de Traitement
Kiki en Christ (voir Mentions Légales) — contact@kikienchrist.vercel.app

## 2. Données Collectées & Finalités

| Données | Source | Base Légale | Finalité | Durée Conservation |
|---------|--------|-------------|----------|-------------------|
| Email, Langue, Source | Formulaire Newsletter (Netlify Forms) | **Consentement** (Art. 6.1.a) | Envoi newsletter, lead magnet, séquences email | Jusqu'à désinscription + 30j |
| Email, Nom, Adresse, Pays | Achat (Lulu, Payhip, Google Play) | **Exécution contrat** (Art. 6.1.b) | Facturation, livraison, service client | 10 ans (comptabilité) |
| IP, User Agent, Pages vues | Vercel Analytics, GA4 | **Intérêt légitime** (Art. 6.1.f) / **Consentement** (GA4) | Analytics, performance, sécurité | 14 mois (GA4) / 1 an (Vercel) |
| Cookie `preferred-lang` | Middleware i18n | **Intérêt légitime** | Redirection langue préférée | 1 an |
| Cookies Techniques | Vercel, Netlify | **Exemption consentement** (ePrivacy Art. 5.3) | Fonctionnement site (session, sécurité, load balancing) | Session / 1 an |

## 3. Partage des Données
| Destinataire | Données | Base Légale | Garanties |
|--------------|---------|-------------|-----------|
| **MailerLite** (Newsletter) | Email, Langue, Tags | Sous-traitance (Art. 28) | DPA signé, Serveurs UE |
| **Vercel** (Hébergement/Analytics) | IP, Logs, Métriques | Sous-traitance | DPA, EU-US DPF |
| **Netlify** (Forms) | Email, Form Data | Sous-traitance | DPA, EU-US DPF |
| **Lulu / Payhip / Google Play** | Données commande | Exécution contrat | CGV plateformes |
| **FirstPromoter** (Affiliation) | Email, Ref, Ventes | Sous-traitance | DPA à signer |

## 4. Transferts Hors UE
- **Vercel (USA)** : Certifié **EU-US Data Privacy Framework** (adéquation 2023)
- **Netlify (USA)** : Certifié **EU-US Data Privacy Framework**
- **MailerLite (UE)** : Serveurs en Europe (Lituanie)
- **Google Play (USA)** : Clauses contractuelles types (SCC) + Supplément UK si UK

## 5. Vos Droits (Art. 15-22 RGPD)
- **Accès** : Copie de vos données
- **Rectification** : Corriger données inexactes
- **Effacement** : "Droit à l'oubli" (sauf obligations légales)
- **Limitation** : Gel traitement
- **Portabilité** : Recevoir données format structuré
- **Opposition** : Marketing direct (newsletter) — Lien désinscription chaque email
- **Retrait Consentement** : À tout moment (n'affecte pas légalité antérieur)

**Exercice** : Email contact@kikienchrist.vercel.app — Réponse < 30 jours.

## 6. DPO (Délégué à la Protection des Données)
Non obligatoire (< 250 employés, pas traitement sensible à grande échelle).  
Contact RGPD : contact@kikienchrist.vercel.app

## 7. Réclamation CNIL
Droit d'introduire réclamation : https://www.cnil.fr/fr/vous-souhaitez-deposer-une-reclamation

## 8. Sécurité
- HTTPS/TLS 1.3 partout (Vercel)
- Headers sécurité (CSP, HSTS, X-Frame-Options — voir skill `security`)
- Accès restreint (GitHub, Vercel, Netlify — 2FA obligatoire)
- Pas de stockage données sensibles (mots de passe, CB) sur notre infrastructure
```

---

## 4. Politique Cookies (ePrivacy + RGPD)

### Page : `/fr/cookies/`

```markdown
# Politique Cookies — Kiki en Christ

## 1. Qu'est-ce qu'un cookie ?
Petit fichier texte déposé sur votre terminal lors de la visite.

## 2. Cookies Utilisés

| Nom | Type | Finalité | Durée | Consentement |
|-----|------|----------|-------|--------------|
| `preferred-lang` | Fonctionnel (1st party) | Mémoriser langue choisie | 1 an | **Non requis** (exempt Art. 5.3 ePrivacy) |
| `exp_*` | Fonctionnel (1st party) | A/B Testing variant assignment | 1 an | **Non requis** (exempt — amélioration UX) |
| `_ga`, `_ga_*` | Analytics (GA4) | Mesure audience, parcours | 14 mois | **Requis** (Opt-in) |
| `_vercel_*` | Technique (Vercel) | Session, load balancing, sécurité | Session / 1 an | **Non requis** (exempt) |
| `nf_*` | Technique (Netlify Forms) | Protection spam (honeypot), session | Session | **Non requis** (exempt) |
| `ml_*` | Marketing (MailerLite) | Tracking email → site (si clic email) | 30 jours | **Requis** (Opt-in) |

## 3. Gestion Consentement (CMP)
**Banner Cookie** (voir skill `analytics` + `security`) :
- **Accepter tout** : GA4 + MailerLite tracking
- **Refuser tout** : Seul cookies exemptés déposés
- **Personnaliser** : Choix par catégorie (Analytics / Marketing)
- **Mémorisation** : 6 mois (cookie `cookie-consent`)
- **Lien "Modifier consentement"** : Footer + Page cookies (réouvre banner)

## 4. Comment Refuser / Supprimer
- Navigateur : Paramètres → Cookies → Supprimer
- Banner : "Refuser tout" / "Personnaliser"
- Outils : `https://www.youronlinechoices.com/` (IAB Europe)

## 5. Mise à Jour
Dernière MAJ : [Date] — Historique dans Git.
```

---

## 5. Conditions Générales de Vente (CGV) — Code Consommation

### Page : `/fr/cgv/` (Adapté par langue/pays)

```markdown
# Conditions Générales de Vente — Kiki en Christ

**Version : [Date] — Langue : Français**

## 1. Objet
Vente de livres physiques (papier) et numériques (ebook, audio) via partenaires.

## 2. Partenaires de Vente (Revendeurs Officiels)
| Produit | Plateforme | Lien |
|---------|------------|------|
| Livre Papier | **Lulu.com** | https://www.lulu.com/shop/[ISBN] |
| Ebook (PDF/EPUB) | **Payhip.com** | https://payhip.com/b/[ID] |
| Audiobook | **Google Play Books** | https://play.google.com/store/books/details/[ID] |

**Kiki en Christ n'est pas le vendeur direct** — Le contrat de vente est conclu entre vous et la plateforme.

## 3. Prix
- Affichés en € (zone Euro) / $ (hors zone Euro) — TTC
- Frais de port : Selon plateforme (Lulu : 5-10 jours, calculé au checkout)
- TVA : Applicable selon destination (règles UE 2021 pour numériques)

## 4. Commande & Paiement
- Processus géré 100% par la plateforme (Lulu / Payhip / Google Play)
- Moyens de paiement : CB, PayPal, Apple Pay, Google Play Billing, etc. (selon plateforme)
- Sécurité : SSL/TLS, PCI-DSS (plateformes certifiées)

## 5. Livraison / Accès
| Format | Délai | Modalités |
|--------|-------|-----------|
| Papier | 5-15 jours ouvrés | Expédié par Lulu (impression à la demande) — Suivi fourni |
| Ebook | **Immédiat** | Téléchargement instantané (Payhip) — Lien email + compte |
| Audio | **Immédiat** | Streaming / Téléchargement (Google Play Books app) |

## 6. Droit de Rétractation (Art. L221-18 Code Conso)
- **Produits physiques (Papier)** : 14 jours à réception — Retour à vos frais (sauf défaut) — Remboursement < 14j
- **Produits numériques (Ebook/Audio)** : **Pas de rétractation** après téléchargement/accès (Art. L221-28 13°) — **Consentement exprès + Renoncement** requis avant achat (case à cocher Payhip/GP)

## 7. Garanties Légales
- **Conformité** (Art. L217-4) : 2 ans (physique) — Produit conforme à description
- **Vices Cachés** (Art. 1641 Code Civil) : 2 ans découverte
- **Numériques** : Garantie conformité (Art. L224-25-12) — Mise à jour / correction

## 8. Responsabilité
Limitée au remboursement prix payé. Exclut dommages indirects, perte données, préjudice moral.

## 9. Force Majeure
Suspending obligations (grève, catastrophe, panne plateforme).

## 10. Droit Applicable & Litiges
Droit français. **Médiation consommation** obligatoire avant tribunal : [Médiateur désigné — ex: CMAP, FEVAD].  
Plateforme Règlement en Ligne (RLL) : https://ec.europa.eu/consumers/odr/

## 11. Contact Réclamations
contact@kikienchrist.vercel.app — Réponse < 7 jours.
```

---

## 6. Accessibilité (Directive UE 2016/2102 + RGAA 4.1)

### Obligation
**Site public / service au public** → Conformité **WCAG 2.1 AA** (référentiel RGAA 4.1).

### Page : `/fr/accessibilite/` (Déclaration d'Accessibilité)

```markdown
# Déclaration d'Accessibilité — Kiki en Christ

**Date : [Date] — Version : 1.0**

## 1. État de Conformité
**Partiellement conforme** au RGAA 4.1 (WCAG 2.1 AA) — Audit du [Date].

## 2. Résultats Audit
- **Critères réussis** : 85/106 (80%)
- **Critères échoués** : 12 (non-conformes) + 9 (non applicables)
- **Non-conformités majeures** :
  1. Absence lien d'évitement (Skip Link) — Critère 12.1
  2. Labels manquants formulaire Newsletter — Critère 11.1
  3. Switcher langue : ARIA manquant — Critère 10.1
  4. Contraste texte/arrière-plan insuffisant (Footer) — Critère 3.2
  5. Focus visible insuffisant (boutons, liens) — Critère 10.7

## 3. Contenus Non Accessibles
- Images Hero Fan : Pas de description alternative détaillée (décoratives) — Acceptable
- PDF Lead Magnet : Non taggé (à corriger)

## 4. Améliorations Prévues (Roadmap)
| Critère | Action | Échéance |
|---------|--------|----------|
| 12.1 | Ajouter Skip Link "Aller au contenu principal" | Sprint 1 |
| 11.1 | Label `<label for="newsletter-email">` visible ou `aria-label` | Sprint 1 |
| 10.1 | `role="combobox"`, `aria-expanded`, `aria-controls` sur switcher | Sprint 1 |
| 3.2 | Ajuster couleurs Footer (--ink sur --paper) | Sprint 1 |
| 10.7 | `outline: 3px solid var(--gold)` sur `:focus-visible` | Sprint 1 |

## 5. Contact Accessibilité
contact@kikienchrist.vercel.app — Réponse < 15 jours.

## 6. Voies de Recours
- Défenseur des Droits : https://www.defenseurdesdroits.fr/
- Référent Accessibilité : [Nom si désigné]
```

---

## 7. Propriété Intellectuelle & Marques

### Protection Actuelle
| Actif | Protection | Statut |
|-------|------------|--------|
| **Marque "Kiki en Christ"** | Dépôt INPI (France) / EUIPO (UE) / WIPO (International) | **À FAIRE** (Priorité Haute) |
| **Titres Livres** | Droit d'auteur automatique (création) | ✅ Protégé |
| **Contenu Livres** | Droit d'auteur + ISBN (Lulu) | ✅ Protégé |
| **Couvettes** | Droit d'auteur (création graphique) | ✅ Protégé |
| **Code Source** | Licence MIT / Propriétaire (selon choix) | À DÉFINIR |
| **Design System CSS** | Droit d'auteur | ✅ Protégé |

### Actions Prioritaires
1. **Dépôt Marque** : INPI (France) → 190€ / classe (Classe 9, 16, 41) → Étendre EUIPO (UE) → 850€
2. **Surveillance** : Google Alertes "Kiki en Christ" + Marques similaires
3. **Licences Images** : Vérifier toutes images ImgBB = créées par vous / licence CC0 / achetées
4. **ISBN** : Un par livre × format (Papier, EPUB, Audio) = 12 ISBN → Lulu en fournit gratuitement

---

## 8. TVA E-commerce (Règles UE 2021 — OSS/IOSS)

### Principe
- **Livres Physiques (Lulu)** : Lulu = vendeur → Lulu gère TVA (IOSS/OSS) → Vous = royalties (pas TVA)
- **Ebooks (Payhip)** : Payhip = vendeur → Payhip gère TVA (OSS) → Vous = royalties
- **Audiobooks (Google Play)** : Google = vendeur → Google gère TVA → Vous = royalties

### Votre Obligation
- **Pas de collecte TVA** directe (plateformes = "deemed suppliers")
- **Déclaration Royalties** : Revenus = BNC (micro-entreprise) ou CA (société) — Comptable gère
- **Facturation Plateformes** : Lulu/Payhip/GP émettent factures → Conserver 10 ans

### Seuil Franchise TVA (France)
- **Micro-entrepreneur** : 37 500 € CA/an (services) / 188 700 € (vente biens) → Au-delà : TVA due
- **Surveillez** : Royalties annuelles cumulées

---

## 9. Registre des Traitements (RGPD Art. 30)

### Fichier : `legal/register-traitements.csv`

```csv
ID,Traitement,Finalité,Base Légale,Catégories Données,Personnes Concernées,Destinataires,Durée Conservation,Mesures Sécurité,Transferts Hors UE,DPIA Requis
T01,Newsletter Inscription,Marketing / Lead Nurturing,Consentement (Art. 6.1.a),Email, Langue, Source,Prospects,MailerLite (Sous-traitant),Jusqu'à désinscription + 30j,Chiffrement TLS, Accès restreint,MailerLite (UE),Non
T02,Analytics Site,Performance / Amélioration,Intérêt Légitime (Art. 6.1.f) / Consentement (GA4),IP, User Agent, Pages, Durée,Visiteurs,Vercel Analytics, GA4 (Sous-traitants),14 mois (GA4) / 1 an (Vercel),Anonymisation IP (GA4), Pseudonymisation,Vercel (US - DPF), GA4 (US - SCC),Non
T03,Gestion Commandes,Exécution Contrat,Exécution Contrat (Art. 6.1.b),Email, Nom, Adresse, Pays, Produit, Montant,Clients,Lulu, Payhip, Google Play (Partenaires),10 ans (Comptabilité),Accès restreint, Plateformes certifiées PCI-DSS,Lulu (US/UK), Payhip (UK), GP (US),Non
T04,Affiliation Tracking,Commissions Partenaires,Intérêt Légitime / Contrat,Email, Ref, Ventes,Affiliés,FirstPromoter (Sous-traitant),Durée contrat + 3 ans,Chiffrement, Accès restreint,FirstPromoter (US/UE),Non
T05,Formulaire Contact,Support Client,Consentement / Intérêt Légitime,Email, Nom, Message,Visiteurs,Email (boîte mail),1 an après résolution,Accès restreint,Boîte mail (UE/US),Non
```

---

## 10. Checklist Conformité (Trimestrielle)

| Vérification | Fréquence | Responsable | Outil/Preuve |
|--------------|-----------|-------------|--------------|
| Mentions légales à jour (adresse, SIRET, TVA) | Trimestriel | Vous | Page `/mentions-legales/` |
| Politique confidentialité reflète traitements réels | Trimestriel | Vous | Registre traitements + Page |
| Banner cookie fonctionnel (Accept/Refuse/Personnaliser) | Mensuel | Vous | Test manuel + Console |
| Cookies exemptés uniquement sans consentement | Mensuel | Vous | DevTools Application > Cookies |
| Désinscription newsletter 1-clic fonctionnelle | Mensuel | Vous | Test email réel |
| Droit d'accès/rectification/effacement traité < 30j | Continu | Vous | Registre demandes |
| Accessibilité : Nouvelles pages testées (WAVE, axe) | À chaque deploy | Vous | `npm run test:a11y` |
| Marque : Surveillance contrefaçon | Mensuel | Vous | Google Alertes + INPI |
| TVA : Royalties < seuils franchise | Mensuel | Comptable | Tableau de bord |
| Sauvegarde registres (Git + Local) | Hebdo | Vous | `git push` + `backup.sh` |

---

## 11. Contacts Utiles (France)

| Organisme | Rôle | Contact |
|-----------|------|---------|
| **CNIL** | RGPD, Cookies | https://www.cnil.fr/ |
| **DGCCRF** | Consommation, CGV, Prix | https://www.economie.gouv.fr/dgccrf |
| **INPI** | Marques, Brevets, Dessins | https://www.inpi.fr/ |
| **ARCOM** | Accessibilité numérique | https://www.arcom.fr/ |
| **Médiateur Conso** | Litiges clients | https://www.mediateur-consommation.fr/ |
| **Plateforme RLL** | Litiges transfrontaliers UE | https://ec.europa.eu/consumers/odr/ |

---

*Skill créé le 2025-11-20. Légal = fondation de confiance + protection risques + conformité continue.*