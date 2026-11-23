---
name: kikienchrist-video-content
description: "Vidéo Court Format (Reels/Shorts/TikTok) — Pipeline Production, Scripts, Templates, Sous-titres 9 langues, Distribution Auto, Analytics, Monétisation"
version: "1.0"
---

# Skill: kikienchrist-video-content

## Objectif
Produire **vidéos courtes verticales (9:16)** à grande échelle pour **Instagram Reels, YouTube Shorts, TikTok, Facebook Reels** — Pipeline automatisé de l'idée à la publication multi-plateforme, avec sous-titres 9 langues, cohérence brand, et mesure d'impact business.

---

## 1. Stratégie Vidéo (Piliers de Contenu)

| Pilier | % Mix | Format | Fréquence | Objectif Business |
|--------|-------|--------|-----------|-------------------|
| **Enseignement Court** | 40% | "1 vérité en 60s" (face caméra + B-roll) | 3/semaine | Autorité, Éducation, Partage |
| **Témoignage / Histoire** | 25% | "Comment ce livre a changé ma vie" (UGC style) | 2/semaine | Preuve sociale, Émotion, Conversion |
| **Extrait Livre + Visuel** | 20% | Pages animées + Voix off + Musique | 2/semaine | Découverte produit, Clic boutique |
| **Q&A Spirituel** | 10% | Question audience + Réponse courte + Livre | 1/semaine | Engagement, SEO social, Lead magnet |
| **Behind-the-Scenes / Vie** | 5% | Processus création, prière, équipe | 1/2 semaines | Humanisation, Confiance, Fidélisation |

### Formats Techniques par Plateforme
| Plateforme | Durée Max | Durée Optimale | Ratio | Sous-titres | Hashtags | Lien en Bio |
|------------|-----------|----------------|-------|-------------|----------|-------------|
| **Instagram Reels** | 90s | 30-60s | 9:16 | Burned-in + Native | 5-10 (mix niche/broad) | Linktree / kikienchrist.vercel.app |
| **YouTube Shorts** | 60s | 45-60s | 9:16 | Native (SRT upload) | 3-5 + #Shorts | Description + Pinned comment |
| **TikTok** | 3 min (10 min) | 30-60s | 9:16 | Native + Burned-in | 3-5 (trending + niche) | Bio + Link en commentaire |
| **Facebook Reels** | 90s | 30-60s | 9:16 | Native | 5-10 | Bio + Boutique |

---

## 2. Pipeline Production (De l'Idée à la Publication)

### Phase 1 : Idéation & Planification (Hebdo — Lundi)
```
Input : Content Calendar (Notion) + Analytics (Top posts, Questions audience) + Livres promus
  │
  ├─▶ Content Strategist Agent → 5 concepts vidéo/semaine (1 par pilier)
  │       Output : Notion "Video Pipeline" — Colonnes : Concept, Pilier, Livre, Format, Script Status, Shoot Date, Edit Status, Publish Dates
  │
  ├─▶ Validation Humaine (15 min) → Sélection 3-5 vidéos/semaine
  │
  └─▶ Assignation : Scriptwriter (IA + Humain) → Tournage (Vous/Équipe) → Éditeur
```

### Phase 2 : Scriptwriting (Template Standardisé)
**Fichier** : `.agents/prompts/video/script-template.md`
```markdown
---
name: video-script
version: 1.0
---

# STRUCTURE VIDÉO COURTE (Hook → Value → CTA) — 30-60s

## MÉTADONNÉES
- **Titre Projet** : {{TITLE}}
- **Pilier** : {{PILLAR}} (Enseignement/Témoignage/Extrait/Q&A/BTS)
- **Livre Lié** : {{BOOK_TITLE}} — {{BOOK_URL_UTM}}
- **Plateformes Cibles** : IG Reels / YT Shorts / TikTok / FB Reels
- **Langue Source** : FR → Traduction 8 langues
- **Durée Cible** : {{DURATION}}s
- **Mots-clés/Hashtags** : {{HASHTAGS}}

## SCRIPT (Format Tableau pour Tournage)

| Time | Visuel (Ce qu'on voit) | Audio (Ce qu'on entend) | Notes Tournage |
|------|------------------------|-------------------------|----------------|
| 0-3s | **HOOK** : Plan rapproché visage / Livre en main / Question à l'écran | "Et si [problème] n'était pas ce que vous croyez ?" | Caméra stable, regard caméra, lumière visage |
| 3-10s | **CONTEXTE** : B-roll (lecture, nature, vie quotidienne) / Texte clés à l'écran | "Beaucoup pensent que [croyance commune]. Mais [vérité biblique]." | Voix off ou face caméra, sous-titres brûlés |
| 10-40s | **VALEUR** : 3 points clés (1 par plan) / Verset à l'écran / Livre visible | 1. [Point 1] — Verset: [Réf]  2. [Point 2]  3. [Point 3] | Coupes rapides, zooms sur texte, transition fluide |
| 40-50s | **APPLICATION** : Geste concret / Exemple vie réelle | "Cette semaine, essayez : [action simple]." | Authentique, réalisable, bienveillant |
| 50-60s | **CTA** : Couverture livre / Flèche vers bio / QR Code / @kikienchrist | "Pour aller plus loin, '{{BOOK_TITLE}}' vous guide pas à pas. Lien en bio !" | Sourire, geste invitation, logo animé |

## SOUS-TITRES (SRT) — Générés Auto + Relecture
- FR (source) → 8 langues (DeepL + Post-edit)
- Style : 2 lignes max, 32 chars/ligne, sync précis, police lisible (Inter/Montserrat), outline noir

## ASSETS REQUIS
- [ ] B-roll : {{BROLL_LIST}} (Pexels/Unsplash/Propres — Licence CC0/Propre)
- [ ] Musique : {{MUSIC_TRACK}} (Epidemic Sound / Artlist / YouTube Audio Library — Licence commerciale)
- [ ] Graphiques : Lower-third nom, Verset animé, Logo sortie, QR Code dynamique
- [ ] Couverture livre : PNG transparent (hero image)
```

### Phase 3 : Tournage (Batch — 1 session/semaine, 2-3h)
| Setup | Équipement | Conseils |
|-------|------------|----------|
| **Face Caméra** | iPhone 15 Pro / Sony ZV-E10 + 24mm f/1.8 | Trépied, lumière anneau (key) + panneau LED (fill), fond neutre/esthétique, teleprompter app (PromptSmart) |
| **B-roll Livre** | Même caméra + macro | Pages qui tournent, doigts sur texte, lumière douce, 4K 60fps pour slow-mo |
| **Audio** | Rode Wireless GO II / DJI Mic 2 | Enregistrement séparé (safety), monitoring casque, gain -12dB |
| **Éclairage** | 3 points (Key, Fill, Back) + Pratique | Température 5600K, CRI > 95, pas de scintillement (flicker-free) |

**Checklist Tournage** :
- [ ] Batteries chargées + Cartes SD vides (x2)
- [ ] Scripts imprimés + Teleprompter chargé
- [ ] Tenues prêtes (3 changes max — cohérence brand)
- [ ] Accessoires : Livres, Bible, carnet, stylo, mug, plante
- [ ] Test audio/vidéo 30s avant chaque take
- [ ] Clap sync (mains) début chaque prise pour montage

### Phase 4 : Montage (Template CapCut / Premiere / DaVinci)
**Template CapCut Projet** : `assets/video/templates/kikienchrist-reel-template.capcut`
- **Tracks** : A-Roll (Face cam), B-Roll, Texte animé, Sous-titres (burned), Musique, SFX, Logo/QR
- **Presets** : Color Grade (LUT Kiki en Christ — chaleureux, contraste doux), Transitions (Zoom, Whip, Glitch léger), Text Animations (Typewriter, Fade up, Pop)
- **Durée** : Auto-ripple pour 30s/45s/60s versions
- **Export** : 1080x1920, 30fps, H.264 High, 8-12 Mbps, AAC 128kbps

**Workflow Montage (Éditeur — 30-45 min/vidéo)** :
1. Import rushes → Sync audio (PluralEyes / Auto-sync CapCut)
2. Rough cut : Sélection meilleurs takes → Structure Hook/Value/CTA
3. Fine cut : Rythme (coupes sur temps forts musique), B-roll sur voix off
4. Texte animé : Points clés, Versets, Lower-third, CTA final
5. **Sous-titres FR** : Auto-caption CapCut → Relecture précise → Style brand (Police, Taille, Couleur, Outline, Position safe zone)
6. Color grade + Audio mix (Musique -18dB sous voix, Normalisation -14 LUFS)
7. Export **Master FR** (sans sous-titres brûlés) + **Version FR brûlée**
8. Upload Master sur Google Drive → Trigger traduction sous-titres

### Phase 5 : Localisation Sous-Titres (9 Langues)
```
Master FR (SRT) → DeepL API (8 langues) → Post-edit Agent (Glossaire théologique) → Validation relecteur natif (5 min/langue) → SRT finaux
  │
  ├─▶ Stockage : `assets/video/srt/{{VIDEO_ID}}/{{LANG}}.srt`
  ├─▶ Burned-in versions (Optionnel pour IG/TikTok) : CapCut batch import SRT → Export 9 versions
  └─▶ Native upload : YouTube (SRT), TikTok (SRT), FB (SRT) — IG Reels nécessite burned-in
```

### Phase 6 : Distribution Automatisée (Make / Zapier / Buffer API)
```
Trigger : Nouveau fichier dans Google Drive "Videos Ready" (Master FR + 9 SRT + Métadonnées JSON)
  │
  ├─▶ Métadonnées JSON (générées par Scriptwriter) :
  │     { "title": "...", "description": "...", "hashtags": [...], "book_url": "...", "lang": "fr", "publish_at": "2025-11-25T10:00:00Z", "platforms": ["ig", "yt", "tt", "fb"] }
  │
  ├─▶ YouTube Shorts : Upload vidéo + SRT FR + SRT 8 langues + Description + Hashtags + Playlist "Kiki en Christ Shorts" + Pinned comment (Lien livre)
  │
  ├─▶ TikTok : Upload vidéo + SRT FR (native) + Description + Hashtags + Lien bio mis à jour (Linktree)
  │
  ├─▶ Instagram Reels : Upload version FR brûlée + Description + Hashtags + Tag produit (si Shopping) + Story "Nouveau Reel !"
  │
  ├─▶ Facebook Reels : Upload vidéo + SRT + Description + Hashtags + Boutique tag
  │
  ├─▶ Buffer / Metricool : Programmer tous posts (heures optimales par plateforme)
  │
  ├─▶ Notion "Video Pipeline" : Update Status = "Published" + URLs posts + Date
  │
  ├─▶ Slack #content : Notification "🎬 {{TITLE}} publié sur 4 plateformes"
  │
  └─▶ Analytics Agent (J+1, J+7, J+30) → Rapport perf → Notion + Slack
```

---

## 3. Templates & Assets Réutilisables

### Dossier Assets Vidéo
```
assets/video/
├── templates/
│   ├── kikienchrist-reel-template.capcut      # Projet CapCut master
│   ├── kikienchrist-reel-template.prproj      # Premiere Pro
│   └── kikienchrist-reel-template.drp         # DaVinci Resolve
├── luts/
│   └── kikienchrist-warm.cube                 # LUT Color Grade
├── graphics/
│   ├── lower-third-name.mogrt                 # Nom/Titre (After Effects)
│   ├── verse-animation.mogrt                  # Verset biblique animé
│   ├── logo-reveal.mogrt                      # Logo animé sortie
│   ├── qr-code-generator.html                 # QR Code dynamique (UTM)
│   └── book-cover-placeholder.psd             # Placeholder couverture
├── music/
│   ├── kikienchrist-theme-30s.wav             # Jingle marque (30s)
│   ├── ambient-prayer-loop.wav                # Boucle ambiance prière
│   └── license-proof.pdf                      # Preuves licences (Epidemic/Artlist)
├── broll/
│   ├── nature/                                # Pexels/Unsplash curatés
│   ├── reading/
│   ├── daily-life/
│   └── abstract/
├── srt/
│   └── {{VIDEO_ID}}/                          # Sous-titres par vidéo
│       ├── fr.srt
│       ├── en.srt
│       ├── es.srt
│       └── ...
└── exports/
    └── {{VIDEO_ID}}/
        ├── master-fr.mp4                      # Sans sous-titres brûlés
        ├── fr-burned.mp4                      # FR sous-titres brûlés
        ├── en-burned.mp4                      # ...
        └── ...
```

### Brand Guidelines Vidéo
| Élément | Spécification |
|---------|---------------|
| **Police Principale** | **Inter** (UI) / **Montserrat** (Titres) / **Merriweather** (Versets) |
| **Couleurs Texte** | Blanc (#FFFDF8) + Outline noir (2px) — Safe zone 10% bords |
| **Couleurs Accent** | Gold (#D4A843) pour CTA, Versets clés — Paper (#FFFDF8) fonds texte |
| **Logo** | Coin sup droit (discret) + Centre fin (CTA) — Animation 0.5s ease-out |
| **Lower Third** | "Kiki en Christ" + Titre épisode — Gold background 80% opacity |
| **Transitions** | Zoom punch (0.3s), Whip pan (0.2s), Cross dissolve (0.5s) — Pas de transitions "cheap" |
| **Musique** | Cohérente : Piano doux / Ambient prayer / Acoustic guitar — Même bibliothèque |
| **Watermark** | @kikienchrist (coin inf droit, 30% opacity) — Toutes plateformes |

---

## 4. Analytics & Optimisation (Boucle Rétroaction)

### Métriques par Plateforme (Hebdo/Mensuel)
| KPI | Instagram Reels | YouTube Shorts | TikTok | Facebook Reels | Objectif |
|-----|-----------------|----------------|--------|----------------|----------|
| **Vues** | ✅ | ✅ | ✅ | ✅ | > 10k/vidéo (3 mois) |
| **Taux Rétention (moyen)** | ✅ | ✅ | ✅ | ✅ | > 40% (30s) / > 50% (60s) |
| **Partages** | ✅ | ✅ | ✅ | ✅ | > 2% vues |
| **Commentaires** | ✅ | ✅ | ✅ | ✅ | > 1% vues |
| **Clics Profil / Bio** | ✅ | ✅ | ✅ | ✅ | > 3% vues |
| **Clics Lien Livre (UTM)** | ✅ | ❌ (desc) | ✅ (bio) | ✅ | > 1% vues |
| **Abonnés Ganés** | ✅ | ✅ | ✅ | ✅ | > 50/semaine |
| **Revenus Attribués (GA4 UTM)** | ✅ | ✅ | ✅ | ✅ | > 100€/mois (6 mois) |

### Tableau de Bord (Looker Studio — "Video Dashboard")
- **Source** : Meta Insights API, YouTube Analytics API, TikTok Business API, GA4 (UTM)
- **Vues** : Par vidéo, par pilier, par plateforme, par langue, dans le temps
- **Funnel** : Vue → Rétention 3s/15s/50% → Engagement (Like/Comment/Share) → Clic Profil → Clic Lien → Achat
- **Top/Flop** : Top 10 vidéos (vues, rétention, conversion) + Bottom 10 (apprentissages)
- **A/B Tests** : Hook type (Question vs Affirmation vs Visuel), Durée (30s vs 60s), CTA (Direct vs Doux), Musique

### Optimisation Continue (Mensuel)
1. **Analyse Top 3** : Qu'est-ce qui marche ? (Hook, Sujet, Format, Heure, Musique)
2. **Analyse Flop 3** : Pourquoi ? (Hook faible, Sujet niche, Qualité audio, Mauvais timing)
3. **Hypothèses** : 3 tests pour mois prochain (ex: "Hook visuel sans parole 3s", "Format Q&A 90s", "UGC style témoignages")
4. **Implémentation** : Modifier templates, scripts, calendrier
5. **Mesure** : Comparer mois M vs M-1

---

## 5. Budget & Ressources (Mensuel)

| Poste | Coût | Détails |
|-------|------|---------|
| **Équipement (Amorti)** | ~50€ | iPhone 15 Pro (exist) + Mic Rode GO II (200€) + Lumière (100€) + Trépied (50€) = 350€ / 7 mois |
| **Logiciels** | 35€ | CapCut Pro (10€) / Premiere (23€) / Epidemic Sound (15€) — Choix 1 monteur |
| **Stock B-roll/Musique** | 15€ | Pexels/Unsplash (Gratuit) + Epidemic/Artlist (Inclus monteur) |
| **Traduction Sous-titres** | 20€ | DeepL API (inclu dans $28/mois global) + Relecteurs natifs (5€/langue × 8 = 40€/vidéo → 1 vidéo/semaine = 160€) — **Optimisation** : Relecture groupée mensuelle |
| **Distribution (Buffer/Metricool)** | 15€ | Buffer Essentials (6€) ou Metricool (15€) |
| **Temps Équipe** | Variable | Vous (Tournage 3h/sem) + Éditeur freelance (4h/sem @ 30€/h = 480€) ou Interne |
| **Total Estimé** | **~600-800€/mois** | Selon internalisation montage |

> **ROI Cible** : 3x investissement via ventes attribuées (UTM) à 6 mois.

---

## 6. Checklist Qualité Pré-Publication (Par Vidéo)

| Check | Critère | Outil/Vérification |
|-------|---------|-------------------|
| ☐ **Hook** | 3 premières secondes captent (question, visuel, promesse) | Relecture script + Preview cut |
| ☐ **Message Clair** | 1 idée forte, structure logique, application concrète | Relecture théologique (Content Lead) |
| ☐ **Qualité Visuelle** | Stable, lumineux, cadrage pro, B-roll pertinent, transitions fluides | Preview full screen mobile |
| ☐ **Qualité Audio** | Voix claire, pas de bruit, musique équilibrée (-18dB), normalisé -14 LUFS | Casque + VU-mètre |
| ☐ **Sous-titres FR** | Précis, sync, style brand, safe zone, 2 lignes max | Relecture SRT + Preview burned |
| ☐ **Sous-titres 8 Langues** | Disponibles (SRT), validés relecteurs, uploadés natifs | Checklist par plateforme |
| ☐ **CTA Claire** | Livre nommé, URL UTM en bio/description, geste invitation | Test clic depuis mobile |
| ☐ **Métadonnées** | Titre, Description, Hashtags, Playlist, Tags produit, Alt text | Checklist par plateforme |
| ☐ **Conformité** | Pas de copyright (musique, B-roll), RGPD (pas visages non consentis), Marque respectée | Checklist légale |
| ☐ **Accessibilité** | Contraste texte, police lisible, sous-titres natifs dispo, description audio (optionnel) | Preview mobile + axe-core |

---

## 7. Workflows IA Spécifiques Vidéo (Prompts Library)

| Prompt | Fichier | Usage |
|--------|---------|-------|
| **Video Ideation** | `.agents/prompts/video/ideation.md` | 5 concepts/semaine depuis Calendar + Analytics |
| **Script Writing** | `.agents/prompts/video/script-template.md` | Script complet + SRT FR + Métadonnées JSON |
| **Hook Generator** | `.agents/prompts/video/hook-generator.md` | 10 variants hook par sujet (Question, Stat, Story, Visual, Contrarian) |
| **Title/Description SEO** | `.agents/prompts/video/metadata-seo.md` | Titres accrocheurs + Descriptions optimisées + Hashtags par plateforme |
| **Subtitle Post-Edit** | `.agents/prompts/video/subtitle-postedit.md` | Post-edit DeepL 8 langues + Glossaire théologique + Timing adjust |
| **Thumbnail/Frame Selector** | `.agents/prompts/video/thumbnail-selector.md` | Choisir meilleure frame pour cover (YouTube/TikTok) |
| **Performance Analysis** | `.agents/prompts/video/performance-analysis.md` | Analyse métriques → 3 insights + 3 hypothèses test |
| **Repurpose Long→Short** | `.agents/prompts/video/repurpose-long-to-short.md` | Extraire 3-5 shorts depuis vidéo longue (podcast, live, enseignement) |

---

*Skill créé le 2025-11-20. Vidéo Court = levier viral + humanisation + conversion — Pipeline industrialisé, 9 langues, mesure business.*