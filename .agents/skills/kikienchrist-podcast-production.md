---
name: kikienchrist-podcast-production
description: "Production Podcast Audio (Concept, Enregistrement, Montage, Distribution Multi-plateforme, Transcription 9 langues, Sponsors, Analytics, Repurposing Vidéo/Texte)"
version: "1.0"
---

# Skill: kikienchrist-podcast-production

## Objectif
Produire un **podcast audio hebdomadaire de qualité broadcast** — "Kiki en Christ : Le Podcast" — Pour approfondir les livres, répondre aux questions, interviewer, créer intimité auditive, et générer contenu dérivé (vidéo, blog, newsletter, citations).

---

## 1. Concept & Positionnement

| Élément | Définition |
|---------|------------|
| **Titre** | **Kiki en Christ : Le Podcast** (Sous-titre : "Conversations qui transforment") |
| **Format** | **Hebdo, 25-35 min** — Solo (15-20 min) + Interview/Dialogue (30-40 min) alterné |
| **Ton** | "Café avec un ami sage" — Chaleureux, profond, accessible, théologiquement solide, vulnérable, pratique |
| **Piliers Contenu** | 1. **Étude Livre** (Chapitre par chapitre, 4 séries/an) — 2. **Q&A Audience** (Questions réelles) — 3. **Entretiens** (Auteurs, Pasteurs, Témoins, Experts) — 4. **Thèmes Vie** (Prière, Souffrance, Identité, Relations, Mission) |
| **Audience Cible** | 25-55 ans, francophones, spirituels, en quête de profondeur, auditeurs podcasts chrétiens (Top 50 FR) |
| **Différenciation** | Liens directs livres Kiki en Christ, 9 langues (transcription), Communauté Discord connectée, Qualité audio "radio" |
| **Objectifs Business** | 1. Fidélisation lecteurs → Ambassadeurs 2. Acquisition organique (SEO podcast + Partage) 3. Contenu dérivé ×10 4. Sponsors alignés (6-12 mois) |

---

## 2. Pipeline Production (Hebdo — Lundi Sortie)

### Phase 1 : Planification (Trimestriel + Hebdo Affinage)
```
Trimestriel (Content Strategy + Podcast Lead) :
  ├─▶ Calendrier 13 épisodes (Thèmes, Invités, Livres promus, Events alignés)
  ├─▶ Réservation invités (2-3 mois avance) — Confirmation + Brief + Technique check
  └─▶ Commande sponsors (si applicable) — Intégration naturelle

Hebdo (Lundi matin — 30 min) :
  ├─▶ Revue script final (Solo) / Confirmation invité (Interview)
  ├─▶ Préparation questions / Structure épisode
  ├─▶ Vérification technique (Mic, Logiciel, Connexion invité)
  └─▶ Enregistrement → Montage → Export → Distribution (Mardi-Mercredi)
```

### Phase 2 : Enregistrement
| Configuration | Solo (Vous) | Interview (Distante) | Interview (Locale) |
|---------------|-------------|----------------------|---------------------|
| **Micro** | Shure SM7B / Rode Procaster | Vous : SM7B / Invité : Shure MV7 / Rode NT-USB+ | 2x SM7B + Interface (Focusrite Scarlett 2i2 / Rodecaster Pro) |
| **Logiciel** | Adobe Audition / Reaper / Audacity (gratuite) | Riverside.fm / SquadCast / Zencastr (Qualité studio, pistes séparées) | Audition/Reaper (Multipiste) |
| **Environnement** | Studio traité (Panneaux mousse, Tapis, Rideaux) | Casque fermé obligatoire (Vous + Invité), Pièce calme, Connexion Ethernet | Studio traité, 2 casques, Séparation physique |
| **Pré-enregistrement** | Test niveau (-18dB à -12dB peak), Eau, Script annoté | Soundcheck 10 min (Riverside auto), Brief invité (Plan, Durée, CTA), Enregistrement local backup | Test niveaux croisés, Brief, Enregistrement backup chacun |
| **Durée Cible** | 18-22 min (Brut → 15-20 min final) | 40-50 min (Brut → 30-40 min final) | 40-50 min |

**Checklist Enregistrement** :
- [ ] Niveaux : Voix -18dB à -12dB (Pic max -6dB), Pas de clipping
- [ ] Pas de bruit parasite (Ventilo, Clim, Rue, Notifications) — *Enregistrer 10s "Room Tone"*
- [ ] Intro/Outro : Musique (5s) + Accroche + Titre épisode + "Abignez-vous" + CTA
- [ ] Marqueurs chapitres (Clique piste) pour timestamps description
- [ ] Sauvegarde immédiate : Local + Cloud (Google Drive "Podcast Raw")

### Phase 3 : Montage (Template Standardisé)
**Template Session (Reaper / Audition)** : `assets/podcast/templates/kikienchrist-podcast-template.RPP`
- **Pistes** : Voix Host, Voix Invité (si interview), Musique Intro/Outro, Musique Transitions, SFX (Rare), Room Tone
- **Presets** :
  - **Voix** : EQ (High-pass 80Hz, Presence +3dB 3-5kHz, Air +2dB 10kHz), Compression (Ratio 3:1, Attack 10ms, Release 100ms, Gain -3dB), De-Esser, Gate (Seuil -40dB), Limiter (-1dB)
  - **Musique** : Ducking auto sous voix (Sidechain -15dB), Fade in/out 2s
  - **Master Bus** : Compression douce (2:1, -1dB), Limiter True Peak -1dB, LUFS -16 (Apple/Spotify standard)
- **Structure Épisode** :
  1. **Teaser** (30s — Extrait fort + "Aujourd'hui nous parlons de...") → Musique Intro (10s)
  2. **Introduction** (60-90s — Accueil, Contexte, Invité/Sujet, Promesse)
  3. **Corps** (Segments 5-8 min chacun — Transitions musicales 3s / Jingles)
  4. **Application Pratique** (2-3 min — "Cette semaine, essayez...")
  5. **Conclusion + CTA** (60-90s — Résumé, Livre/Communauté/Newsletter, Prière courte, Bénédiction)
  6. **Musique Outro** (15-20s — Fond + Crédits + "Abonnez-vous / Partagez / Notez 5 étoiles")

**Workflow Montage (45-60 min/épisode)** :
1. Import pistes → Alignement (Riverside auto-sync) → Room tone sur piste dédiée
2. **Rough Cut** : Suppression silences longs, "euh", répétitions, hors-sujet → Structure segments
3. **Fine Cut** : Rythme respiration naturelle, Coupes propres (Zero-crossing), Transitions fluides
4. **Traitement Voix** : Appliquer preset voix → Ajustement par oreille (Chaque voix unique)
5. **Musique & SFX** : Placement Intro/Outro/Transitions → Ducking vérifié
6. **Mastering** : LUFS intégré -16 ± 0.5, True Peak -1dB, Stéréo cohérent
7. **Chapitres & Métadonnées** : Marqueurs → Export markers CSV → Description épisode
8. **Export** : **WAV 48kHz/24-bit (Master Archive)** + **MP3 128kbps CBR / 44.1kHz (Distribution)** + **MP3 64kbps (Backup/Archive léger)**
9. **Backup** : Master WAV + Session projet → Google Drive "Podcast Masters" + Disque local

### Phase 4 : Transcription & Localisation (9 Langues)
```
Master MP3 (FR) → Whisper API (OpenAI) / AssemblyAI / Deepgram → Transcription FR (SRT/VTT/TXT) → Relecture humaine (15 min) → Nettoyage (Ponctuation, Noms propres, Versets)
  │
  ├─▶ **FR Final** : Upload description podcast + Site (Page épisode) + Blog article dérivé + Newsletter excerpt
  │
  ├─▶ **Traduction 8 langues** : DeepL API (Document) → Post-edit Agent (Glossaire théologique) → Relecteur natif (10 min/langue) → SRT/VTT/TXT finaux
  │       Stockage : `assets/podcast/transcripts/{{EPISODE_ID}}/{{LANG}}.srt`
  │
  └─▶ **Intégration** :
        - YouTube : Upload MP3 + Image statique + Sous-titres 9 langues (SRT) → Chapter markers
        - Spotify/Apple : Description + Timestamps + Lien transcription site
        - Site Web : Page épisode `/fr/podcast/{{SLUG}}/` — Lecteur + Transcription interactive (Highlight sync audio) + Toggle langues
        - Newsletter : Extrait 200 mots + Lien épisode + "Lire la transcription en {{LANG}}"
```

### Phase 5 : Distribution Automatisée (Make / Zapier / RSS)
```
Trigger : Nouveau fichier MP3 dans Google Drive "Podcast Ready" + Métadonnées JSON
  │
  Métadonnées JSON :
  {
    "episode": 42,
    "title": "Le pardon : comment guérir vraiment ?",
    "description": "...",          // Description complète (HTML autorisé)
    "short_description": "...",    // < 400 chars pour apps
    "pubDate": "2025-11-25T06:00:00Z",
    "duration": "1845",            // Secondes
    "explicit": false,
    "type": "interview",           // solo / interview / qa / theme
    "guest": "Jean Dupont",        // Si interview
    "book_promoted": "combat",     // visage/trinite/combat/salut
    "book_url_utm": "https://...",
    "tags": ["pardon", "guérison", "relations"],
    "transcripts": { "fr": "...", "en": "...", ... },
    "youtube_thumbnail": "https://..."
  }
  │
  ├─▶ **RSS Feed** (Hébergé sur Vercel/Netlify Function ou Castopod/Buzzsprout/Transistor) → Génération auto depuis JSON
  │       → Soumission : Apple Podcasts, Spotify, Google Podcasts, Amazon Music, Deezer, Podcast Addict, Pocket Casts
  │
  ├─▶ **YouTube** : Upload MP3 + Image épisode (1280x720) + Sous-titres 9 langues + Chapitres + Description + Playlist "Kiki en Christ Podcast" + Shorts teaser (30s)
  │
  ├─▶ **Site Web** : Création page épisode (Astro Collection `podcast`) → Lecteur natif + Transcription interactive + SEO (Schema.org PodcastEpisode)
  │
  ├─▶ **Newsletter** : Email dédié (Mardi) + Inclusion Newsletter Hebdo (Mercredi) — Template prédéfini
  │
  ├─▶ **Réseaux Sociaux** : Audiogram (30-60s — Waveform + Sous-titres brûlés) → Reels/Shorts/TikTok + Post statique (Citation + Lien) → Buffer/Metricool
  │
  ├─▶ **Discord/Telegram/Forum** : Annonce #annonces-officielles + #podcast-discussion + Fil Forum
  │
  ├─▶ **Repurposing Agents (IA)** → Article Blog (30 min), 5 Citations visuelles (Canva), 3 Newsletter excerpts, Lead magnet chapitre
  │
  └─▶ **Analytics Agent (J+1, J+7, J+30, J+90)** → Rapport → Notion + Slack
```

---

## 3. Hébergement & RSS Feed (Choix Stratégique)

| Option | Coût/Mois | Avantages | Inconvénients | Recommandation |
|--------|-----------|-----------|---------------|----------------|
| **Transistor.fm** | $19 (illimité) | Analytics avancés, Site web inclus, Distribution auto, Équipe, Private feeds, API | Coût fixe | **Choix #1** (Pro, scalable, API pour auto) |
| **Castopod** | Gratuit (Self-host) / €5 (Cloud) | Open source, ActivityPub (Fediverse), Multi-langues natif, Personnalisable | Maintenance self-host | Choix #2 (Si contrôle total voulu) |
| **Buzzsprout** | $12-24 | Facile, Magic Mastering, Site, Chapitres, Stats | Limites stockage/bande passante plans bas | Choix #3 (Simple) |
| **Vercel/Netlify Function (Custom)** | ~$0-5 (Bande passante) | Contrôle total, Gratuit quasi, Intégré stack, Edge | Dev requis, Pas d'analytics podcast natifs, Pas de distribution auto | Choix #4 (Si équipe dev forte) |

**Configuration RSS (Standard Apple/Spotify)** :
```xml
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>Kiki en Christ : Le Podcast</title>
    <link>https://kikienchrist.vercel.app/fr/podcast/</link>
    <language>fr</language>
    <itunes:author>Kiki en Christ</itunes:author>
    <itunes:summary>Conversations qui transforment — Études bibliques, témoignages, questions de vie.</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:owner><itunes:name>Kiki en Christ</itunes:name><itunes:email>podcast@kikienchrist.com</itunes:email></itunes:owner>
    <itunes:explicit>false</itunes:explicit>
    <itunes:category text="Religion & Spirituality"><itunes:category text="Christianity"/></itunes:category>
    <itunes:image href="https://kikienchrist.vercel.app/images/podcast-cover-3000x3000.jpg"/>
    <podcast:transcript url="https://kikienchrist.vercel.app/fr/podcast/{{SLUG}}/transcript/" type="text/html" language="fr"/>
    <!-- Épisodes (itunes:episode, itunes:season, podcast:transcript par langue, podcast:chapters, podcast:person, podcast:funding, podcast:value) -->
  </channel>
</rss>
```

---

## 4. Repurposing Multiplicateur (1 Épisode → 10+ Assets)

| Asset | Format | Temps IA + Humain | Canal | Objectif |
|-------|--------|-------------------|-------|----------|
| **Article Blog** | 1500-2000 mots + SEO + JSON-LD | 15 min (Agent) + 10 min (Relecture) | Site (Blog) | SEO long terme, Partage, Lead magnet |
| **Newsletter Excerpt** | 3 versions (Complet / Court / Teaser) | 5 min (Agent) | Email | Trafic épisode, Engagement |
| **Audiogram Vidéo** | 30s, 60s, 90s (Waveform + Sous-titres) | 10 min (Agent CapCut/Descript) | Reels/Shorts/TikTok/FB | Viralité, Découverte audio |
| **Citations Visuelles** | 5-10 images (Citation + Réf + Brand) | 5 min (Agent Canva) | IG Carousel / LI / Pinterest / Stories | Partage, Brand, Traffic |
| **Fil Twitter/Threads** | 10-15 tweets (Points clés + Versets) | 5 min (Agent) | X / Threads | Discussion, Partage, Authority |
| **Article LinkedIn** | Version pro (Leadership spirituel) | 10 min (Agent) | LinkedIn | Audience pro, Partenariats |
| **Lead Magnet Chapitre** | PDF 2-3 pages (Excerpt + Exercices) | 15 min (Agent + Design) | Site / Newsletter | Conversion abonnés |
| **Discussion Communauté** | Prompt Discord/Forum + Questions | 5 min (Agent) | Discord/Forum | Engagement, Rétention |
| **Épisode "Best Of" (Trimestriel)** | Compilation 3-5 meilleurs moments | 30 min (Montage) | Podcast / YouTube | Nouveaux auditeurs, Récap |
| **Formation/Étude Biblique** | Guide animateur + Participant (PDF) | 60 min (Humain) | Communauté / Site | Discipleship, Valeur ajoutée |

---

## 5. Sponsors & Monétisation (À partir 5k écoutes/épisode)

### Critères Sponsors Alignés
- **Valeurs** : Chrétien, Éthique, Familial, Éducatif, Bien-être, Missionnaire
- **Produits** : Bibles (Logos, Olive Tree), Apps prière (Hallow, Pray.com), Livres (Éditeurs chrétiens), Formations (BibleProject, Seminaries), Événements, Missions, Café/Thé équitable, Vêtements éthiques
- **Exclus** : Jeux d'argent, Crypto spéculatif, Produits "prospérité" non bibliques, Politique partisan, Adultère/rencontres

### Modèles Intégration
| Modèle | Format | Tarif Indicatif (5k-10k écoutes) | Exemple Script |
|--------|--------|----------------------------------|----------------|
| **Pre-roll** | 15-30s (Début) | 50-100€/épisode | "Cet épisode est soutenu par [Marque] — [1 phrase valeur] — Découvrez sur [URL]" |
| **Mid-roll** | 30-60s (Milieu naturel) | 80-150€/épisode | Transition : "Parlons de [sujet]... Mais avant, [Marque] propose..." |
| **Post-roll** | 15-30s (Fin) | 30-60€/épisode | "Merci d'avoir écouté. [Marque] vous accompagne..." |
| **Native/Intégré** | Dans le contenu (Histoire, Recommandation) | 100-200€/épisode | "Dans mon étude, j'utilise [App/Bible] — Voici pourquoi..." |
| **Sponsoring Série** | 4-13 épisodes (Présenté par) | 500-2000€/série | "Cette série sur le Combat Spirituel est présentée par [Marque]" |

### Gestion Sponsors (Processus)
1. **Prospection** : Partenaires alignés → Kit médias (Audience, Démographie, Témoignages, Tarifs)
2. **Négociation** : Contrat (Exclusivité catégorie, Durée, Approbation script, Tracking UTM)
3. **Production** : Script validé par vous + Sponsor → Enregistrement (Vous) ou fourni (Sponsor)
4. **Insertion** : Montage → Vérification → Export
5. **Reporting** : J+30 → Stats écoutes, Clics UTM, Codes promo → Facturation
6. **Relation** : Trimestriel review → Renouvellement / Upsell

---

## 6. Analytics & Mesure Succès

### KPIs Primaires (Hebdo/Mensuel)
| KPI | Source | Cible 6 Mois | Cible 12 Mois |
|-----|--------|--------------|---------------|
| **Téléchargements/Écoutes par épisode (J+30)** | Transistor/Spotify/Apple | 2,000 | 5,000 |
| **Abonnés (Followers)** | Transistor/Apple/Spotify | 1,000 | 3,000 |
| **Taux Completion (Écoutent jusqu'au bout)** | Spotify/Apple | > 50% | > 60% |
| **Partages / Épisode** | Transistor + Social | > 20 | > 50 |
| **Avis & Notes (5 étoiles)** | Apple/Spotify | 50+ (4.8+) | 200+ (4.9+) |
| **Trafic Site depuis Podcast (UTM)** | GA4 | 500 visites/mois | 2,000 visites/mois |
| **Inscriptions Newsletter depuis Podcast** | MailerLite (UTM) | 50/mois | 150/mois |
| **Ventes Livres attribuées Podcast (UTM + Code)** | Lulu/Payhip/GA4 | 20/mois | 100/mois |

### KPIs Secondaires
- **Démographie** : Âge, Sexe, Pays, Plateforme, Heure écoute
- **Épisodes Top/Flop** : Sujets, Formats, Invités
- **Rétention Cohorte** : Auditeurs ép. 1 → Ép. 5 → Ép. 10
- **Revenu Sponsors** : €/mois, €/épisode, Pipeline

### Dashboard (Looker Studio — "Podcast Dashboard")
- Source : Transistor API + Spotify for Podcasters API + Apple Podcasts Connect API + GA4 (UTM) + MailerLite + FirstPromoter
- Vues : Série temporelle, Par épisode, Par sujet, Par invité, Funnel acquisition, Revenus

---

## 7. Budget & Ressources (Mensuel)

| Poste | Coût | Détails |
|-------|------|---------|
| **Hébergement (Transistor)** | 19€ | Illimité, API, Analytics, Site, Équipe |
| **Équipement (Amorti 24 mois)** | 40€ | SM7B (400€) + Rodecaster Pro (600€) + Casques (200€) + Traitement studio (300€) = 1500€ / 24 |
| **Logiciels** | 25€ | Adobe Audition (23€) / Reaper (60€ licence) + Riverside.fm (15€/mois si invités distants) + Descript (12€/mois pour audiograms) — Optimisé |
| **Transcription (Whisper API)** | 10€ | ~$0.006/min × 30 min × 4 ép/mois = $0.72 → Buffer $10 |
| **Traduction 8 langues (DeepL + Relecture)** | 120€ | DeepL API (inclus global) + Relecteurs natifs 8 × 10 min × 4 ép × 15€/h = ~80€ + Buffer |
| **Distribution (RSS + YouTube + Social)** | 15€ | Buffer/Metricool (inclus social global) |
| **Repurposing IA (Make + Agents)** | 30€ | Make ops + API calls (inclu IA global) |
| **Sponsors (Gestion + Prospection)** | 0€ (Temps) / 100€ (Freelance) | Si externalisé |
| **Temps Équipe** | Variable | Vous (Enreg 1h + Montage 1h + Admin 30min/sem) = ~10h/mois + Community Manager (futur) |
| **Total Estimé** | **~260-360€/mois** | Hors temps équipe — **ROI Cible : 3x via ventes + sponsors à 12 mois** |

---

## 8. Checklist Qualité Pré-Publication (Par Épisode)

| Check | Critère | Vérification |
|-------|---------|--------------|
| ☐ **Audio** | LUFS -16 ± 0.5, True Peak -1dB, Stéréo, Pas de clipping, Pas de bruit | Audition/Reaper Meter + Écoute casque |
| ☐ **Contenu** | Théologiquement solide, Pratique, Bienveillant, CTA clair, Pas d'erreur factuelle | Relecture (Vous + Content Lead) |
| ☐ **Invité** | Accord signé (Droit diffusion), Audio qualité, Bio/Photo/Liens fournis | Checklist invité |
| ☐ **Métadonnées** | Titre < 100c, Description complète + Courte, Tags, Chapitre timestamps, Livre UTM | Checklist JSON |
| ☐ **Transcription FR** | Précise, Ponctuée, Noms propres, Versets, Timestamps sync | Relecture 15 min |
| ☐ **Traductions 8 langues** | Disponibles SRT/VTT, Validées relecteurs, Uploadées YouTube/Spotify | Checklist par langue |
| ☐ **Page Épisode Site** | Lecteur fonctionne, Transcription interactive (Highlight), SEO Schema.org, Hreflang | Test mobile + Desktop |
| ☐ **RSS Feed** | Valide (Cast Feed Validator), Nouvel épisode apparait, Image 3000x3000 | Test apps |
| ☐ **YouTube** | Uploadé, Sous-titres 9 langues, Chapitres, Playlist, Thumbnail, Description, Shorts teaser | Test lecture |
| ☐ **Newsletter** | Email dédié programmé, Inclusion hebdo, Liens UTM, Test envoi | Envoi test |
| ☐ **Réseaux Sociaux** | Audiogram 3 versions, Posts statiques, Stories, Hashtags, UTM, Programmés | Buffer preview |
| ☐ **Communauté** | Annonce Discord/Telegram/Forum, Fil discussion créé, Pin announcement | Posté |
| ☐ **Backup** | Master WAV + Session + MP3 + Transcriptions → Drive + Local | Vérifié |

---

## 9. Lancement Podcast (Roadmap 60 Jours)

| Phase | Jours | Objectifs | Livrables |
|-------|-------|-----------|-----------|
| **Préparation** | J0-J14 | Concept validé, Équipement commandé/reçu, Studio traité, Hébergement choisi (Transistor), RSS configuré, Couverture 3000x3000, Musique Intro/Outro licenciée, 4 premiers scripts écrits, 3 invités confirmés | Studio prêt, Compte Transistor, 4 épisodes "dans le can" |
| **Lancement Doux** | J15-J30 | Enregistrement épisodes 1-4, Montage, Transcriptions, Distribution test (Privé), Feedback 10 beta-auditeurs (Communauté), Ajustements | 4 épisodes prêts, Feedback intégré |
| **Lancement Public** | J31 | **Épisode 1 Sortie** (Trailer déjà dispo J15) — Annonce Newsletter + Réseaux + Discord + Site + Communiqué presse | Épisode 1 Live, Trailer 500+ écoutes |
| **Rythme Croisière** | J32-J60 | Hebdo régulier (Lundi), 4 invités enregistrés, Processus rodé, Premier sponsor approché, Métriques baseline | 8 épisodes publiés, 1000+ abonnés, Premier sponsor |
| **Optimisation** | J60+ | Analyse Top/Flop, A/B tests (Longueur, Format, CTA), Repurposing systématique, Sponsors récurrents, Communauté podcast active | Croissance 10%/mois, ROI positif |

---

*Skill créé le 2025-11-20. Podcast = intimité audio + autorité + contenu dérivé ×10 — Qualité broadcast, 9 langues, Distribution auto, Repurposing systématique, Sponsors alignés.*