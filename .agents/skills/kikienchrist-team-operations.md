---
name: kikienchrist-team-operations
description: "Opérations Équipe (Rôles, Rituels, Outils, KPIs, Rétrospectives, Décisions, Documentation, Budget, Recrutement, Culture)"
version: "1.0"
---

# Skill: kikienchrist-team-operations

## Objectif
Structurer le **fonctionnement de l'équipe** (même solo + freelances + futur équipe) pour **vitesse, alignement, qualité, bien-être** — Éviter le chaos, la surcharge, la perte de connaissance.

---

## 1. Rôles & Responsabilités (RACI)

| Rôle | Titulaire Actuel | Responsabilités Clés | Décisions (D) / Consulté (C) / Informé (I) |
|------|------------------|----------------------|--------------------------------------------|
| **Product Owner / Vision** | Vous | Vision, priorités, roadmap, arbitrages business | D: Roadmap, Budget, Lancement, Partenariats majeurs |
| **Tech Lead / Architecte** | Vous | Architecture, stack, standards code, sécurité, perf, CI/CD | D: Stack, Architecture, Sécurité, Tests, Deploy — C: PO |
| **Content Lead** | Vous / Freelance | Calendrier éditorial, qualité contenu, SEO, traduction, production | D: Sujets, Fréquence, Ton — C: PO, SEO |
| **Marketing & Growth Lead** | Vous / Freelance | Acquisition, activation, rétention, email, social, affiliation, ads | D: Campagnes, Budget ads, Outils — C: PO, Content |
| **Operations / Admin** | Vous | Légal, compta, facturation, contrats, RGPD, assurances, banque | D: Fournisseurs, Juridique, Admin — I: PO |
| **Dev / Intégrateur** | Vous / Freelance | Features, bugs, composants, CMS, intégrations, accessibilité | D: Implémentation technique — C: Tech Lead |
| **Designer / UX** | Vous / Freelance | Design system, composants, assets marketing, accessibilité visuelle | D: UI/UX, Design System — C: Tech Lead, Content |
| **Data / Analytics** | Vous | Tracking, dashboards, rapports, A/B tests, insights | D: Métriques, Outils analytics — C: PO, Marketing |

> **Réalité Actuelle (Solo)** : Vous portez tous les chapeaux. **Objectif** : Externaliser progressivement (Freelances → Employés).

### Matrice RACI par Activité
| Activité | PO | Tech | Content | Marketing | Ops | Dev | Design | Data |
|----------|----|------|---------|-----------|-----|-----|--------|------|
| Roadmap trimestrielle | **R/A** | C | C | C | I | I | I | I |
| Sprint Planning | I | **R/A** | C | C | I | R | C | C |
| Rédaction article | I | I | **R/A** | C | I | I | C | I |
| Déploiement prod | I | **R/A** | I | I | I | R | I | I |
| Lancement campagne ads | I | I | C | **R/A** | I | I | C | C |
| Facturation / Compta | I | I | I | I | **R/A** | I | I | I |
| Audit sécurité | I | **R/A** | I | I | C | R | I | I |
| Nouveau livre | **R/A** | C | R | R | C | C | R | I |

---

## 2. Rituels (Cadence & Format)

| Rituel | Fréquence | Durée | Participants | Format | Sortie |
|--------|-----------|-------|--------------|--------|--------|
| **Daily Standup** (Async) | Quotidien | 5 min | Tous | Slack #standup : "Hier / Aujourd'hui / Bloqueurs" | Visibilité + Désamorçage |
| **Weekly Sync** | Lundi 9h | 30 min | Core (PO, Tech, Content, Marketing) | Visio + Notion agenda | Priorités semaine,Alignement, Décisions |
| **Sprint Planning** | 2 semaines (Lundi) | 60 min | Tech + Dev + Content + Design | Visio + GitHub Projects | Sprint Backlog (Issues priorisées, estimation) |
| **Sprint Review** | 2 semaines (Vendredi) | 45 min | Tous | Visio + Demo live | Démo features, Métriques, Feedback |
| **Sprint Retrospective** | 2 semaines (Vendredi) | 45 min | Équipe technique | Visio + Miro/Notion (Start/Stop/Continue) | 3 Actions amélioration + Owner + Deadline |
| **Monthly Business Review** | 1er du mois | 90 min | PO + Marketing + Data + Ops | Visio + Looker Studio | KPIs mois, Pipeline, Budget, Décisions stratégiques |
| **Quarterly Planning** | Trimestre | 3h | Tous | Visio + Atelier (OKRs) | OKRs trimestre, Roadmap, Budget, Recrutement |
| **1-on-1** | Hebdo (30 min) / Bi-mensuel (60 min) | 30-60 min | Manager ↔ Membre | Visio (caméra ON) | Bien-être, Carrière, Blocage, Feedback |
| **Incident Post-Mortem** | Post P0/P1 | 60 min | Concernés | Visio + Doc Notion | Timeline, Root Cause (5 Why), Action Items |

### Template Weekly Sync (Notion)
```markdown
# Weekly Sync — Semaine du [Date]

## 🎯 Objectifs Semaine (Top 3)
1. [Objectif 1 - Mesurable]
2. [Objectif 2 - Mesurable]
3. [Objectif 3 - Mesurable]

## 📊 Métriques Clés (vs Semaine Précédente)
- Trafic organique : X (+Y%)
- Inscriptions NL : X (+Y%)
- Ventes : X (+Y%)
- Erreurs Sentry : X (seuil < 10)

## ✅ Done Cette Semaine
- [ ] [Tâche] — [Owner] — [Lien PR/Deploy]

## 🚀 En Cours / Cette Semaine
- [ ] [Tâche] — [Owner] — [État: % / Bloquant?]

## 🚨 Bloqueurs / Aide Requise
- [Blocage] — [Owner] — [Aide: Qui / Quoi]

## 💡 Décisions / Discussions
- [Sujet] — [Décision] — [Action / Owner]

## 📅 Prochaine Semaine (Preview)
- [Priorité 1]
- [Priorité 2]
```

---

## 3. Outils Équipe (Stack Opérationnel)

| Catégorie | Outil Principal | Alternative | Coût Mensuel | Usage |
|-----------|-----------------|-------------|--------------|-------|
| **Communication** | **Slack** (Free) | Discord / Teams | $0 | Canaux par projet, alerts, standup async |
| **Gestion Projet** | **GitHub Projects** (Free) | Linear ($8/user) / Notion | $0 | Issues, Sprints, Roadmap, Board Kanban |
| **Documentation** | **Notion** (Plus $10) | GitBook / Obsidian | $10 | Wiki, Specs, Runbooks, Meeting notes, Content Cal |
| **Design** | **Figma** (Free) / **Canva Pro** ($12) | Penpot (Open Source) | $12 | Design System, Mockups, Assets marketing |
| **Analytics** | **GA4 + Looker Studio** (Free) | Mixpanel / Amplitude | $0 | Dashboards, Rapports, Funnels |
| **Monitoring** | **Vercel + Sentry + UptimeRobot** (Free tiers) | Datadog / New Relic | $0-50 | Uptime, Errors, Perf, Alertes |
| **CI/CD** | **GitHub Actions** (Free) | GitLab CI / CircleCI | $0 | Build, Test, Deploy, Validation |
| **Code** | **VS Code + Cursor** (Free/Pro) | Zed / Windsurf | $0-20 | Dev, IA, Debug |
| **Traduction** | **Crowdin** (Free ≤50k) + **DeepL Pro** ($28) | Lokalise / Phrase | $28 | Gestion traduction, Glossaire, QA |
| **Email** | **MailerLite** (Free ≤1k) | Brevo / ConvertKit | $0-10 | Newsletter, Automatisation, Segmentation |
| **Social** | **Buffer** (Free ≤10) / **Metricool** ($15) | Later / Hootsuite | $15 | Planification, Analytics, Inbox |
| **Automatisation** | **Make** (Free ≤1k ops) / **Zapier** ($20) | n8n (Self-host) | $20 | Workflows métier (Blog→Social, Vente→Tags) |
| **Stockage** | **Google Drive** (Free 15GB) / **Dropbox** | OneDrive / Nextcloud | $0-10 | Assets, Backups, Partage externes |
| **Vidéo** | **Loom** (Free) / **CapCut** (Free) | Descript | $0 | Async updates, Démos, Reels |
| **Finance** | **Notion + Spreadsheet** / **Pennylane** (€20) | QuickBooks / Xero | €20 | Facturation, Compta, Budget, TVA |

**Total Estimé (Équipe 3-4)** : **~$100-200/mois** (hors salaires/freelances)

---

## 4. KPIs Équipe (Santé + Performance)

### KPIs Santé (Mensuels)
| KPI | Cible | Outil | Action si < Cible |
|-----|-------|-------|-------------------|
| **Vélocité Sprint** | ≥ 80% committed done | GitHub Projects | Réduire scope / Better estimation |
| **Cycle Time** (PR ouvert → Merge) | < 48h | GitHub Insights | Simplifier PR / Review plus rapide |
| **Deploy Frequency** | ≥ 2/semaine | Vercel / GitHub Actions | Automatiser + Réduire risque |
| **Change Failure Rate** | < 10% | Sentry + Vercel | Tests plus complets / Canary |
| **MTTR** (Mean Time To Recovery) | < 30 min (P0) | Incident Log | Runbooks + Alerting + On-call |
| **Code Review Coverage** | 100% (tous PRs) | GitHub | Obligatoire dans branch protection |
| **Tech Debt Ratio** | < 20% temps sprint | SonarQube / Manual | Sprint "Tech Debt" trimestriel |

### KPIs Business (Mensuels — Partagés)
| KPI | Cible | Owner |
|-----|-------|-------|
| **Trafic Organique** | +10% MoM | Content + SEO |
| **Inscriptions Newsletter** | 200+/mois | Marketing + Content |
| **Taux Conversion (Visiteur → Acheteur)** | 3% | Marketing + Tech (CRO) |
| **Revenu Mensuel** | +15% MoM | PO + Marketing |
| **Coût Acquisition Client (CAC)** | < 30€ | Marketing |
| **LTV / CAC Ratio** | > 3 | PO + Data |

### KPIs Contenu (Mensuels)
| KPI | Cible | Owner |
|-----|-------|-------|
| **Articles Publiés (FR)** | 3-4 | Content |
| **Articles Traduits (9 langues)** | 27-36 | Content + Traducteurs |
| **Score SEO Moyen** | > 75 (SurferSEO) | Content + SEO |
| **Backlinks Gagnés** | 5+/mois | Content + Partnerships |

---

## 5. Processus de Décision (RACI + DACI)

### Pour Décisions Majeures (Budget > 500€, Stack Change, Lancement, Recrutement)
**Processus DACI** :
1. **Driver** (Propose, rassemble info, timeline) : Souvent PO ou Tech Lead
2. **Approver** (Décision finale) : PO (business) / Tech Lead (technique)
3. **Contributors** (Expertise, avis) : Rôles concernés (Content, Marketing, Dev, Design, Data, Ops)
4. **Informed** (Tenus au courant) : Équipe + Parties prenantes

**Template Décision (Notion)**
```markdown
# Décision : [Titre]

## Contexte
[Pourquoi cette décision maintenant ? Données, contraintes, opportunités]

## Options
| Option | Avantages | Inconvénients | Coût | Risque | Recommandation |
|--------|-----------|---------------|------|--------|----------------|
| A | ... | ... | € | Faible/Moyen/Élevé | ✅/❌ |
| B | ... | ... | € | ... | ... |

## Recommandation Driver
[Option X — Justification courte]

## Avis Contributors
- **Content** : [Avis]
- **Marketing** : [Avis]
- **Tech** : [Avis]
- **Ops** : [Avis]

## Décision Approver
✅ **Approuvé : Option X** — [Date] — [Signature]
📝 **Conditions** : [Si applicable]

## Communication & Exécution
- [ ] Annonce équipe (Slack #general + Notion)
- [ ] Mise à jour roadmap / docs
- [ ] Actions : [Tâche] — [Owner] — [Deadline]
```

### Décisions Courantes (Délégation)
| Type Décision | Décideur | Escalade Si |
|---------------|----------|-------------|
| Priorité sprint | Tech Lead | Conflit ressources → PO |
| Choix outil < 100€/mois | Rôle concerné | Impact transversal → PO |
| Architecture feature | Tech Lead | Impact perf/sécurité/coût > 500€ → PO |
| Sujet article blog | Content Lead | Sensible théologiquement → PO |
| Budget ads mensuel | Marketing Lead | > 500€ ou nouveau canal → PO |
| Recrutement freelance | PO + Rôle concerné | > 2000€/mois ou CDI → PO + Ops |

---

## 6. Rétrospectives (Format Efficace)

### Sprint Retro (45 min — Format "Start / Stop / Continue + 1 Action")
```
1. Check-in (1 min) : "Comment vous sentez-vous ?" (1 mot)
2. Rappel Sprint Goal (2 min)
3. Données (5 min) : Vélocité, Cycle Time, Bugs, Déploys, Métriques
4. Start / Stop / Continue (20 min) — Post-its Miro/Notion (anonime possible)
   - START : Qu'est-ce qu'on devrait commencer ?
   - STOP : Qu'est-ce qu'on devrait arrêter ?
   - CONTINUE : Qu'est-ce qui marche bien ?
5. Vote (3 min) : 3 votes par personne sur items les plus impactants
6. Action Items (10 min) : Top 3 voted → Owner + Deadline + Critère succès
7. Check-out (1 min) : "Un mot pour la suite"
```

### Quarterly Retro (2h — Format "4L + OKR Review")
```
1. Liked (Apprécié) — 15 min
2. Learned (Appris) — 15 min
3. Lacked (Manqué) — 15 min
4. Longed For (Souhaité) — 15 min
5. OKR Review (30 min) : Objectifs trimestre → Score 0-1.0 → Pourquoi ?
6. Nouveaux OKRs (30 min) : Draft collaboratif
7. Team Health Check (15 min) : Survey anonyme (Psychological Safety, Clarity, Purpose, Autonomy, Growth)
```

---

## 7. Documentation Vivante (Wiki Notion)

### Structure Notion (Pages Principales)
```
🏠 Kiki en Christ — Wiki
├── 🎯 Vision & Stratégie (OKRs, Roadmap, Business Model)
├── 🏗️ Technique (Architecture, Stack, Standards, Runbooks, Skills Index)
├── 📝 Contenu (Calendrier, Processus, SEO, Traduction, Brand Voice)
├── 📈 Marketing & Growth (Funnels, Campagnes, Email, Social, Affiliation, Ads)
├── ⚖️ Légal & Admin (RGPD, Compta, Contrats, Assurances, Marque)
├── 👥 Équipe (Rôles, Rituels, 1-on-1, Rétros, Décisions, Onboarding)
├── 💰 Finance (Budget, Compta, Facturation, TVA, Investissements)
└── 📚 Archive (Post-Mortems, Décisions passées, Anciens plannings)
```

### Règles Documentation
- **Single Source of Truth** : Notion pour specs/processus, GitHub pour code/config, Vercel pour deploy
- **Mise à jour** : À chaque changement significatif (PR merged, décision, incident)
- **Propriétaire** : Chaque page a un `Owner` (dernière MAJ visible)
- **Revue** : Trimestrielle (Quarterly Planning) — Archivez l'obsolète

---

## 8. Budget & Investissements (Trimestriel)

### Catégories Budget
| Catégorie | % Revenu | Exemples | Validation |
|-----------|----------|----------|------------|
| **Équipe (Salaires/Freelances)** | 40-50% | Rédacteurs, Traducteurs, Dev, Design, Marketing | PO + Ops |
| **Outils & Infrastructure** | 5-10% | Vercel Pro, Sentry, MailerLite, Canva, Make, DeepL, Crowdin | Tech Lead + Ops |
| **Marketing & Acquisition** | 20-30% | Ads, Influencers, Affiliates, Events, Content production | Marketing Lead |
| **Légal & Conformité** | 2-5% | Avocat, Marque, Comptable, Assurance, Audit | Ops |
| **R&D / Expérimentation** | 5-10% | Nouveaux canaux, Outils IA, Features innovantes | PO + Tech Lead |
| **Réserve / Imprévus** | 5-10% | Incident, Opportunité, Équipement | PO |

### Processus Budget
1. **Quarterly Planning** : Draft budget trimestre (basé revenus projetés + objectifs)
2. **Revue Mensuelle** : Réalisé vs Prévu (Monthly Business Review) → Ajustement
3. **Dépense > 500€** : Processus DACI (voir §5)
4. **Rapport Trimestriel** : P&L simplifié + Cash flow + Projections

---

## 9. Recrutement & Onboarding (Quand Équipe Grandit)

### Profils Prioritaires (Ordre)
1. **Content Writer (FR) — Freelance/Part-time** : 2-3 articles/semaine — €800-1500/mois
2. **Traducteurs (8 langues) — Freelance** : Post-edit DeepL — €1200-2400/mois total
3. **Marketing / Growth — Freelance/Part-time** : Email, Social, Ads, Affiliation — €1000-2000/mois
4. **Dev / Intégrateur — Freelance** : Features, CMS, Tests, Perf — €1500-3000/mois
5. **Designer / UX — Freelance** : Assets, Design System, Landing pages — €500-1000/mois
6. **Operations / Admin — Part-time** : Compta, Juridique, Admin — €500-800/mois

### Onboarding Nouveau (Checklist 2 Semaines)
| Jour | Activité | Owner |
|------|----------|-------|
| J-3 | Accès : Slack, Notion, GitHub, Vercel, Netlify, MailerLite, GA4, Canva, Figma, Drive | Ops |
| J-1 | Envoi : Wiki lien, Rôles/RACI, Rituels, Skills Index, Project Context | Manager |
| J0 | **Welcome Call** (30 min) : Vision, Culture, Attentes, Questions | PO |
| J0 | **Tech Setup** : Repo local, `npm install`, `npm run dev`, Deploy preview | Tech Lead |
| J1 | **Content/Marketing Tour** : Calendrier, Processus, Outils, Brand Voice | Content/Marketing Lead |
| J3 | **First Task** : Petit ticket "Good First Issue" → PR → Review → Merge | Manager |
| J5 | **Pair Programming / Shadowing** : 1h avec Tech Lead ou Content Lead | Manager |
| J7 | **Check-in 1 Semaine** : 30 min — Bien-être, Blocages, Feedback | Manager |
| J14 | **Check-in 2 Semaines** : 30 min — Autonomie, Objectifs 30j, Plan formation | Manager |
| J30 | **Fin Période Essai** : Revue objectifs, Feedback 360°, Décision continuation | PO + Manager |

---

## 10. Culture & Valeurs (Explicites)

| Valeur | Comportement Attendu | Contre-Indicateur |
|--------|---------------------|-------------------|
| **Excellence Spirituelle** | Contenu théologiquement solide, pastorale, espoir concret | Approximations, sensationnalisme, légalisme |
| **Qualité Technique** | Code propre, tests, accessibilité, perf, sécurité | "Ça marche sur ma machine", dette technique ignorée |
| **Transparence Radical** | Métriques partagées, erreurs assumées, décisions documentées | Silos, blame game, infos cachées |
| **Bienveillance & Repos** | 1-on-1 réels, congés respectés, pas de messages 22h-7h (sauf urgence) | Burnout, réactivité 24/7, guilt-tripping repos |
| **Apprentissage Continu** | Rétros honnêtes, formation budget, partage connaissances | "On a toujours fait comme ça", ego, fixed mindset |
| **Impact > Activité** | Focus résultats (ventes, vies touchées) pas output (tâches, heures) | Vanity metrics, busy work, perfectionnisme stérile |

---

*Skill créé le 2025-11-20. Team Ops = fondation pour scale sain + alignement + plaisir de travailler ensemble.*