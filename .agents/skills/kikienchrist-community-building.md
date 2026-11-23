---
name: kikienchrist-community-building
description: "Construction Communauté (Discord/Telegram/Forum, Modération, Events, Ambassadeurs, Gamification, Support, Rétention, Mesure Santé)"
version: "1.0"
---

# Skill: kikienchrist-community-building

## Objectif
Créer et animer une **communauté engagée, bienveillante, spirituellement nourrissante** autour des livres Kiki en Christ — Transformer lecteurs en ambassadeurs, réduire churn, générer UGC, soutenir la mission.

---

## 1. Architecture Communautaire (Multi-Plateforme)

| Plateforme | Rôle | Audience Cible | Taille Cible (12 mois) | Modération | Intégration |
|------------|------|----------------|------------------------|------------|-------------|
| **Discord** | **Hub Principal** — Discussions profondes, études, prière, support, events live | Lecteurs engagés, leaders petits groupes, équipe | 500-1000 membres | Bots (Dyno/MEE6) + Modérateurs humains (5-10) | Webhook → Notion, GA4, MailerLite, FirstPromoter |
| **Telegram** | **Canal Annonces + Groupe Discussion** — Notifications instantanées, partage facile, francophonie forte | Audience mobile-first, francophone Afrique/Europe | 1000-2000 abonnés | Admins + Bots (GroupHelp, Combot) | Bot → Nouvelles articles, vidéos, promos |
| **Forum (Discourse/ Circle)** | **Base Connaissances Permanente** — FAQ détaillée, études bibliques, témoignages archivés, SEO | Chercheurs, nouveaux lecteurs, référence long terme | 200-500 utilisateurs actifs | Trust Levels (Discourse) + Modérateurs | SSO Vercel/Netlify Identity, Indexé Google |
| **Newsletter** | **Cœur Relationnel** — Hebdo personnel, segmentation, réponse directe | Tous abonnés (cible 10k+) | 10k+ | Réponses humaines (Vous/Équipe) | MailerLite → Segments, Tags, Automatisation |
| **Réseaux Sociaux** | **Portes d'Entrée** — Découverte, viralité, redirection communauté | Large (cible 50k+ followers) | 50k+ | Commentaires (IA + Humain) | UTM → GA4 → Attribution communauté |

> **Principe** : Chaque plateforme a un **rôle distinct** — Pas de duplication. Ponts clairs entre elles (CTAs croisés).

---

## 2. Parcours Membre (Member Journey)

```
DÉCOUVERTE
  │  (Reels, Shorts, Blog, Recherche, Bouche-à-oreille, Pub)
  ▼
PREMIER CONTACT
  │  (Landing page → Lead Magnet "7 Prières" → Newsletter OU Discord Invite)
  ▼
ACTIVATION (J0-J7)
  │  • Email bienvenue (Séquence 5 emails) → Réponse personnelle demandée
  │  • Invitation Discord (rôle "Nouveau" → Canal #bienvenue + #présentation)
  │  • Guide "Comment tirer le meilleur de la communauté" (PDF/Notion)
  │  • Proposition micro-engagement : "Partagez votre verset du jour" / "Question prière"
  ▼
ENGAGEMENT RÉGULIER (J7-J90)
  │  • Hebdo : Newsletter + Discord discussion + Étude biblique live (bi-hebdo)
  │  • Mensuel : Event spécial (Auteur live, Thème, Témoignage, Q&A)
  │  • Quotidien : Prompt discussion Discord / Telegram / Fil Forum
  │  • Gamification : Rôles (Lecteur → Étudiant → Serviteur → Ambassadeur), Badges, Streaks
  ▼
AMBASSADEUR (J90+)
  │  • Parraine 3+ personnes (Tracké FirstPromoter)
  │  • Crée contenu (Témoignage vidéo, Article invité, Traduction aide)
  │  • Anime un sous-groupe (Géographique, Thématique, Livre spécifique)
  │  • Accès anticipé (Bêta livres, Couvertures, Contenu exclusif)
  │  • Commission affiliation majorée (25% vs 15%)
  ▼
FIDÉLISATION LONG TERME
  │  • Renouvellement annuel (Nouveaux livres, Contenu frais)
  │  • Events physiques (Retraites, Conférences, Dédicaces)
  │  • Conseil consultatif communautaire (Input roadmap)
  │  • Héritage : Former nouveaux modérateurs/ambassadeurs
```

---

## 3. Discord — Architecture Détaillée (Hub Principal)

### Structure Canaux (Catégories)
```
🏠 ACCUEIL & RÈGLES
├── #règles-et-charte           # Règles, Charte valeurs, FAQ Discord
├── #bienvenue-nouveaux         # Auto-bienvenue bot + Présentations
├── #annonces-officielles       # Équipe seulement — Nouveautés, Events, Maintenance
└── #rôles-et-accès             # Self-assign rôles (Réaction bot)

📖 ÉTUDES & PARTAGE
├── #verset-du-jour             # Bot quotidien + Discussion
├── #lecture-biblique-hebdo     # Plan lecture + Partage insights (Lundi)
├── #etude-livre-visage         # Chapitre par chapitre "Le Visage de Dieu"
├── #etude-livre-trinite        # "Le Mystère de la Trinité"
├── #etude-livre-combat         # "Le Combat Spirituel"
├── #etude-livre-salut          # "Le Don du Salut"
├── #questions-bibliques        # Q&A (Modérateurs + Équipe théologique)
└── #temoignages                # Partage vie transformée (Modéré)

🙏 PRIÈRE & SOUTIEN
├── #demandes-priere            # Confidentiel (Rôle "Prière" requis — Vue limitée)
├── #reponses-priere            # Témoignages exaucements
├── #soutien-moral              # Écoute bienveillante (Modérateurs formés)
└── #urgence-priere             # Alertes critiques (Équipe seulement)

🎉 ÉVÉNEMENTS & LIVE
├── #calendrier-events          # Planning (Google Cal embed)
├── #live-etude-biblique        # Vocal + Chat pendant lives (Bi-hebdo)
├── #live-qa-auteur             # Mensuel — Questions préparées + Live
├── #live-temoignage            # Mensuel — Invité partage histoire
└── #replay-events              # Liens vidéos + Résumés

💬 VIE COMMUNAUTAIRE
├── #general-discussion         # Libre (Respect charte)
├── #recommandations            # Livres, podcasts, chaînes, ressources
├── #creations-membres          # Art, écriture, musique, vidéos membres
├── #humour-bienveillant        # Mèmes chrétiens sains (Modéré)
├── #presentations              # "Qui suis-je ?" (Obligatoire nouveaux)
└── #hors-sujet                 # Détente (Respect charte)

🛠️ SUPPORT & ADMIN
├── #support-technique          # Site, livres, commandes, téléchargements
├── #feedback-suggestions       # Idées amélioration (Upvote reactions)
├── #moderation-log             # Modérateurs seulement — Actions, Notes
├── #equipe-internes            # Équipe seulement — Coordination
└── #bot-commands               # Commandes bots (Rôles, Rappels, etc.)

🌍 PAR LANGUE (Optionnel — Si demande)
├── #english-corner
├── #rincón-español
├── #deutsch-ecke
└── ...
```

### Rôles & Permissions (Hiérarchie)
| Rôle | Couleur | Permissions Clés | Obtention |
|------|---------|------------------|-----------|
| **@Fondateur** | 🔴 Rouge | Admin complet | Vous |
| **@Équipe Core** | 🟣 Violet | Gestion canaux, Modération, Events, Annonces | Employés/Freelances core |
| **@Modérateurs** | 🔵 Bleu | Kick/Ban, Timeout, Delete, Warn, Logs, #moderation-log | Sélection + Formation (5-10) |
| **@Prieurs** | 🟢 Vert | Vue #demandes-priere, #urgence-priere | Candidature + Validation équipe |
| **@Ambassadeurs** | 🟡 Or | Rôle visible, Accès #ambassadeurs, Commission majorée | 3+ parrainages + Contenu créé |
| **@Serviteurs** | 🟠 Orange | Badge reconnaissance, Accès canaux serveurs | Service actif (Modération, Accueil, Traduction) |
| **@Étudiants** | 🔵 Cyan | Accès études avancées, Badge | 4+ semaines actives études |
| **@Lecteurs** | ⚪ Gris | Accès de base | Auto (Réaction #rôles-et-accès) |
| **@Nouveaux** | ⚫ Noir | #bienvenue-nouveaux seulement (7j) | Auto (Join) → Upgrade auto 7j |
| **@Silencieux** | ⚫ Gris foncé | Lecture seule (Modération) | Sanction temporaire |

### Bots Essentiels
| Bot | Fonctions | Config Clé |
|-----|-----------|------------|
| **Dyno / MEE6** | Auto-mod (Liens, Spam, Mots interdits), Auto-rôle, Bienvenue, Logs, Anniversaires | Mots interdits : liste valeurs contraires + Spam thresholds |
| **Apollo / Sesh** | Events calendar, Rappels, RSVP, Timezone management | Sync Google Calendar équipe |
| **Statbot / ServerStats** | Analytics membres, Activité, Rétention, Heatmaps | Dashboard Notion embed |
| **Ticket Tool** | Support privé (Commandes, Technique, Personnel) | Catégories : Technique, Commande, Personnel, Autre |
| **Carl-bot / YAGPDB** | Rôles par réaction, Modération avancée, Feeds RSS (Blog, YouTube), Custom commands | Feed RSS → #annonces-officielles + #verset-du-jour |
| **Prayer Bot (Custom)** | Gestion demandes prière (Anonymat optionnel, Rôle Prieurs, Suivi réponses) | Webhook → Notion "Prayer Wall" |

---

## 4. Telegram — Canal + Groupe

### Structure
| Entité | Type | Contenu | Fréquence | Modération |
|--------|------|---------|-----------|------------|
| **@KikiEnChrist** | **Canal (Broadcast)** | Nouvelles articles, Vidéos, Promos livres, Citations, Events | 1-2/jour | Équipe seulement |
| **@KikiEnChrist_Chat** | **Groupe (Discussion)** | Discussion libre, Questions, Partage, Prière, Entraide | Continue | Admins + Bots |
| **@KikiEnChrist_Priere** | **Groupe (Prière)** | Demandes/réponses prière (Règles strictes confidentialité) | Continue | Admins + Rôle Prieurs |

### Bots Telegram
- **GroupHelp / Combot** : Anti-spam, Bienvenue, Règles, Stats, Modération
- **Custom Bot (Python/Node)** : RSS Feed Blog/YouTube → Canal, UTM tracking, Commandes /priere /etude /livre

---

## 5. Forum (Discourse) — Base Connaissances Permanente

### Catégories
```
📚 Études Bibliques (Par livre + Thématiques)
🙏 Prière & Témoignages (Archivé, Recherchable)
❓ Questions & Réponses (Théologie, Pratique, Vie)
📖 Ressources & Recommandations (Livres, Outils, Liens)
🎓 Formation & Discipleship (Parcours, Guides)
🌍 Groupes Locaux / Par Langue
🛠️ Support Technique & Commandes
💡 Idées & Suggestions (Voting)
👥 Présentations & Vie de la Communauté
```

### Trust Levels (Discourse) → Rôles Communautaires
| TL | Nom | Permissions | Critères |
|----|-----|-------------|----------|
| 0 | Nouveau | Lecture, Répondre sujets existants | Inscription |
| 1 | Lecteur | Créer sujets, Flag, Like, MP | 15 min lecture, 1 sujet lu |
| 2 | Participant | Éditer wiki, Inviter, Plus de likes/jour | 1h lecture, 5 sujets, 30 posts lus |
| 3 | Contributeur | Recatégoriser, Épingler, Masquer, Modérer basique | 10h lecture, 20% sujets, 100 posts, 20 likes donné/reçu |
| 4 | Leader (Ambassadeur) | Tout TL3 + Gestion utilisateurs basique, Accès modération | Nomination équipe |

### SSO & Intégration
- **Auth** : Netlify Identity / Vercel Auth / Discord OAuth → Compte unique site + Forum + Discord (rôle sync)
- **Indexation** : Public (SEO) — `robots.txt` allow, Sitemap auto
- **Newsletter** : Opt-in inscription forum → Tag MailerLite "Forum User"

---

## 6. Programme Ambassadeurs (Formalisé)

### Niveaux & Récompenses
| Niveau | Critères | Récompenses | Responsabilités |
|--------|----------|-------------|-----------------|
| **Découvreur** | 1 parrainage validé | Badge Discord, Accès bêta couverture | Partager lien affiliation |
| **Ambassadeur** | 3 parrainages + 1 contenu (témoignage/article/vidéo) | Commission 25% (vs 15%), Accès #ambassadeurs, Kit médias exclusif | Animer discussions, Accueillir nouveaux |
| **Ambassadeur Senior** | 10 parrainages + 3 contenus + 6 mois actif | Commission 30%, Invitation events VIP, Conseil consultatif trimestriel | Former nouveaux ambassadeurs, Co-animer events |
| **Ambassadeur Leader** | 25 parrainages + Anime sous-groupe + 1 an actif | Commission 35%, Budget events local (100€/trim), Accès roadmap | Diriger chapitre local/thématique, Représenter marque |

### Kit Ambassadeur (Assets Fournis)
- Templates posts sociaux (Canva) — 10 variants
- Bannières Discord/Telegram/Forum
- Emails types parrainage
- Guide "Comment partager authentiquement"
- Accès anticipé PDF chapitres nouveaux livres
- Badges physiques (stickers, marque-pages) — Envoi postal annuel

### Suivi & Animation (Mensuel)
- **Newsletter Ambassadeurs** : Stats, Nouveautés, Défis, Spotlight membre
- **Call Mensuel (30 min)** : Questions, Idées, Formation courte, Prière
- **Classement** : Top 10 parrainages (Anonyme optionnel) → Reconnaissance
- **Budget Events Locaux** : 100€/trim/Leader pour café, location salle, impressions

---

## 7. Gamification & Rétention

### Système Points (XP) — Bot Discord + Forum
| Action | XP | Limite/Jour |
|--------|----|-------------|
| Message constructif (Discord/Forum) | 5 | 50 |
| Réponse prière / Soutien | 10 | 30 |
| Partage témoignage | 50 | 1/sem |
| Invitation ami (Rejoint + Actif 7j) | 100 | - |
| Participation Event Live | 30 | - |
| Étude biblique (Post insight) | 20 | 60 |
| Traduction aide (Relecture) | 100 | - |
| Signalement bug / Amélioration | 20 | - |

### Niveaux XP → Rôles Discord + Badges Forum
| Niveau | XP Requis | Rôle Discord | Badge Forum | Perk |
|--------|-----------|--------------|-------------|------|
| 1 — Curieux | 0 | @Lecteurs | 🌱 Nouveau | - |
| 2 — Chercheur | 500 | @Lecteurs + | 📖 Lecteur | Accès études |
| 3 — Étudiant | 2,000 | @Étudiants | 🎓 Étudiant | Études avancées |
| 4 — Serviteur | 5,000 | @Serviteurs | 🤝 Serviteur | Canaux serveurs |
| 5 — Ambassadeur | 15,000 | @Ambassadeurs | 🏅 Ambassadeur | Commission 25% |
| 6 — Pilier | 50,000 | @Ambassadeur Senior | 💎 Pilier | Conseil consultatif |

### Streaks & Défis
- **Streak Quotidien** : Verset du jour / Prière / Lecture (7j = Badge "Fidèle", 30j = "Discipliné", 100j = "Pilier")
- **Défi Mensuel** : "Lire 1 livre complet" / "30 jours prière" / "Inviter 1 ami" — Récompense : Badge exclusif + Livre dédicacé (tirage)

---

## 8. Modération & Santé Communautaire

### Charte Valeurs (Affichée Partout)
> **Kiki en Christ — Charte Communautaire**
> 1. **Amour & Respect** : "Aimez votre prochain" — Pas de jugement, critique, mépris. Écoute active.
> 2. **Vérité Biblique** : Discussions ancrées dans l'Écriture. Pas d'hérésie, New Age, prospérité extrême.
> 3. **Bienveillance** : Supportez les fardeaux les uns des autres. Pas de conseil médical/légal/financier non qualifié.
> 4. **Confidentialité** : Ce qui est partagé ici reste ici (sauf danger vie). Demandes prière = sacrées.
> 5. **Unité dans la Diversité** : Dénominations, cultures, langues différentes — Unis en Christ.
> 6. **Pas de Promotion Perso** : Pas de pub pour son église, ministère, business sans accord équipe.
> 7. **Signalement** : Voir quelque chose ? Dites-le aux modérateurs (Discord: @Modérateurs / Ticket / MP).

### Processus Modération (Échelonné)
| Niveau | Action | Qui | Exemples |
|--------|--------|-----|----------|
| **1 — Rappel Doux** | MP + Lien charte | Modérateur / Bot auto | Hors-sujet léger, Ton sec, Double post |
| **2 — Avertissement Officiel** | Warn bot + Log + MP explicatif | Modérateur | Manque respect, Débat stérile, Promo non autorisée |
| **3 — Timeout (10min - 24h)** | Timeout Discord / Mute Telegram | Modérateur Senior | Répétition avertissement, Conflit, Sensible |
| **4 — Kick (Expulsion Temporaire)** | Kick + Note log + Appel possible | Modérateur Senior + Équipe | Harcèlement, Hérésie persistante, Danger |
| **5 — Ban (Définitif)** | Ban + Rapport complet + Preuves | Fondateur + Équipe Core | Danger vie, Pédopornographie, Extrémisme, Récidive grave |

### Formation Modérateurs (Obligatoire — 4h Initial + 1h/mois)
1. **Charte & Valeurs** : Cœur de la modération
2. **Outils** : Bots, Logs, Tickets, Timeout, Ban, Appeals
3. **Communication Non-Violente** : Désamorçage, Écoute, Reformulation, Fermeté bienveillante
4. **Situations Sensibles** : Dépression/suicide (Protocole urgence), Abus, Hérésie, Conflits théologiques
5. **Soin de Soi** : Limites, Vicarious trauma, Soutien équipe, Rotation

### Métriques Santé Communautaire (Hebdo/Mensuel)
| Métrique | Cible | Outil | Alerte Si |
|----------|-------|-------|-----------|
| **Taux Rétention 30j (Discord)** | > 40% | Statbot | < 25% |
| **Messages/Jour (Actifs)** | > 50 | Statbot | < 20 |
| **Nouveaux Membres/Sem** | > 20 | Discord Insights | < 10 |
| **Taux Engagement (Messages/Membre Actif)** | > 5 | Statbot | < 2 |
| **Sentiment (Positif/Neutre/Négatif)** | > 80% Pos/Neu | Sample manuel + IA | > 20% Négatif |
| **Tickets Support Ouverts** | < 5 | Ticket Tool | > 15 |
| **Modérateurs Actifs** | > 5 | Roster | < 3 |
| **Ambassadeurs Actifs** | > 10 | FirstPromoter + Discord | < 5 |
| **NPS Communautaire (Trimestriel)** | > 50 | Survey (Typeform) | < 30 |

---

## 9. Events Récurrents (Calendrier)

| Event | Fréquence | Format | Durée | Plateforme | Lead |
|-------|-----------|--------|-------|------------|------|
| **Verset du Jour** | Quotidien | Bot + Discussion | 24h | Discord/Telegram/Forum | Bot |
| **Lecture Biblique Hebdo** | Hebdo (Lundi) | Partage insights | Semaine | Discord #lecture-biblique-hebdo | Modérateur |
| **Étude Biblique Live** | Bi-hebdo (Mar/Jeu 20h) | Vocal + Chat + Écran partagé | 45-60 min | Discord Vocal + YouTube Live | Vous/Équipe |
| **Q&A Auteur Live** | Mensuel (1er Sam 10h) | Vocal + Questions préparées + Live | 60-90 min | Discord Vocal + YouTube Live + Replay | Vous |
| **Témoignage Live** | Mensuel (3e Sam 20h) | Invité + Interview + Prière | 45-60 min | Discord Vocal + YouTube Live | Ambassadeur Senior |
| **Retraite Virtuelle** | Trimestriel (Samedi) | Sessions 3h (Enseignement, Prière, Partage, Pause) | 3h | Discord Vocal + Zoom + YouTube | Équipe |
| **Event Physique** | Annuel | Journée (Conférence, Ateliers, Dédicace, Repas) | 8h | Lieu physique + Stream | Équipe + Ambassadeurs Leaders |

---

## 10. Support Communautaire (Intégré)

### Canaux Support
| Canal | Type | SLA | Outils |
|-------|------|-----|--------|
| **#support-technique (Discord)** | Public + Ticket privé | 4h (ouvré) | Ticket Tool → Notion "Support Queue" |
| **Email support@kikienchrist.com** | Privé | 24h | MailerLite / Gmail partagé → Notion |
| **FAQ Forum** | Self-service | Instant | Discourse (Tags: technique, commande, compte, contenu) |
| **Bot FAQ (Discord/Telegram)** | Instant | Instant | Custom commands /faq /commande /telechargement |

### Types Demandes & Réponses Types
| Type | Exemple | Réponse Type | Escalade |
|------|---------|--------------|----------|
| **Téléchargement livre** | "Je n'arrive pas à télécharger mon PDF" | Lien direct + Guide + Vérif commande | Si échec → Équipe technique |
| **Commande non reçue** | "Pas reçu email confirmation Payhip" | Vérif spam + Resend + Lien dashboard | Si payé non livré → Payhip support + Remboursement |
| **Question théologique** | "La Trinité, comment expliquer ?" | Ressource livre + Versets + Invitation étude | Si complexe → Vous/Équipe théologique |
| **Demande prière** | "Ma mère est malade" | Rôle Prieurs notifié + Accueil + Suivi | Si urgence vitale → Protocole urgence |
| **Problème technique site** | "Page ne charge pas" | Vérif navigateur/cache + Lien status | Si général → Incident runbook |

---

## 11. Budget & Ressources (Mensuel)

| Poste | Coût | Détails |
|-------|------|---------|
| **Discord (Boosts Niveau 3)** | 0€ (Gratuit) / 15€ (Boosts) | 14 boosts = Niveau 3 (Bannières, 384kbps audio, 100MB upload, URL personnalisée) |
| **Telegram** | 0€ | Gratuit illimité |
| **Forum Discourse (Hébergé)** | 0€ (Self-host) / 100€ (Discourse.org) | Self-host sur VPS (5€/mois) ou Managed |
| **Bots Discord (Dyno/MEE6 Premium)** | 10-15€ | Fonctions avancées (Mod logs, Custom commands, Music) |
| **Statbot / Analytics** | 0-10€ | Free tier suffisant |
| **Ticket Tool** | 0€ (Free) / 5€ (Pro) | Free = 3 panels, 50 tickets/mois |
| **Events (Zoom Pro / StreamYard)** | 15-25€ | Zoom Pro (14€) ou StreamYard (25€) pour multi-stream |
| **Ambassadeurs (Kits + Events locaux)** | 200-500€ | Envois postaux, Budget events leaders, Cadeaux |
| **Formation Modérateurs** | 50€ | Matériel, Formateur externe (optionnel) |
| **Temps Équipe** | Variable | Vous (5h/sem) + Modérateurs bénévoles (formation) + Community Manager (futur: 500-1000€/mois) |
| **Total Estimé** | **~300-600€/mois** | Hors temps équipe |

---

## 12. Lancement Communauté (Roadmap 90 Jours)

| Phase | Jours | Objectifs Clés | Livrables |
|-------|-------|----------------|-----------|
| **Fondation** | J0-J30 | Discord setup (Canaux, Rôles, Bots, Charte), Équipe modérateurs (5) formée, Invitation newsletter (Top 500) | Discord opérationnel, 100 membres, 1er Live étude |
| **Croissance** | J31-J60 | Telegram Canal + Groupe, Forum Discourse lancé, Programme Ambassadeurs v1 (10 premiers), Events bi-hebdo réguliers | 500 membres Discord, 500 Telegram, 50 Forum, 10 Ambassadeurs |
| **Maturité** | J61-J90 | Gamification XP, Events mensuels (Q&A, Témoignage), Retraite virtuelle 1, Métriques santé vertes, Première cohorte Ambassadeurs Seniors | 1000+ Discord, 30% rétention 30j, 25 Ambassadeurs, NPS > 40 |
| **Optimisation** | J90+ | Automatisation (Make/Zapier), Analyse données, Scaling modération, Events physiques planifiés | Autonome, Mesurable, Scalable |

---

*Skill créé le 2025-11-20. Communauté = cœur relationnel — Discord hub, Telegram reach, Forum SEO, Ambassadeurs moteur, Modération bienveillante, Mesure santé, Events rythmiques.*