---
name: kikienchrist-content-production
description: "Production Contenu (Rédaction, Traduction, Relecture, Validation SEO, Publication, Workflow Éditorial, Outils IA, Calendrier)"
version: "1.0"
---

# Skill: kikienchrist-content-production

## Objectif
Industrialiser la **création de contenu multilingue** (articles blog, newsletters, posts sociaux, lead magnets, pages site) — Qualité constante, SEO-friendly, voix de marque unifiée, délais respectés.

---

## 1. Types de Contenu & Fréquences

| Type | Fréquence | Longueur | Langues | Auteur Principal | Validation |
|------|-----------|----------|---------|------------------|------------|
| **Article Blog** | 2-4/mois | 1500-3000 mots | 9 (FR priorité) | Rédacteur + IA | SEO + Théologie + Brand |
| **Newsletter** | Hebdo | 300-500 mots | 9 | Même que blog | Brand + Liens |
| **Post Réseaux Sociaux** | Quotidien | 100-300 mots | 5-9 | Community Manager | Brand + Visuel |
| **Lead Magnet (PDF)** | 2-3/an | 5-15 pages | 9 | Rédacteur + Designer | Théologie + Design + SEO |
| **Page Site (MAJ)** | Ponctuel | Variable | 9 | Vous / CMS | Technique + Contenu |
| **Email Séquence** | Ponctuel | 5-7 emails | 9 | Rédacteur + Marketing | Conversion + Brand |
| **Script Vidéo/Reel** | Hebdo | 30-60s | 5-9 | CM + Rédacteur | Visuel + Accroche |

---

## 2. Workflow Éditorial (De l'Idée à la Publication)

### Kanban (Notion / Trello / GitHub Projects)
```
BACKLOG → IDEE VALIDÉE → EN RÉDACTION (FR) → RELECTURE THÉOLOGIQUE → VALIDATION SEO → TRADUCTION (8 langues) → RELECTURE LOCALE → INTÉGRATION CMS → PRÉVISUALISATION → PUBLICATION → PROMOTION
```

### Étapes Détaillées

| Étape | Responsable | Outils | Critères "Done" | Délai |
|-------|-------------|--------|-----------------|-------|
| **1. Idée & Brief** | Vous / Stratégie | Notion (Content Calendar) | Titre, angle, mots-clés cibles, format, CTA, deadline | - |
| **2. Rédaction FR** | Rédacteur (IA + Humain) | Notion / Google Docs / Cursor | Structure H1/H2/H3, 1500+ mots, ton "bienveillant expert", CTA clair, sources citées | J+3 |
| **3. Relecture Théologique** | Vous / Expert | Google Docs (suggestions) | Doctrinellement juste, pas d'hérésie, ton pastoral | J+1 |
| **4. Optimisation SEO** | Rédacteur / SEO | SurferSEO / Clearscope / Manual | Score > 70, mots-clés dans H1/H2/intro/conclusion, méta title/desc, schema.org | J+1 |
| **5. Validation Finale FR** | Vous | Notion | ✅ Approuvé pour traduction | J+1 |
| **6. Traduction (8 langues)** | DeepL API + Relecteur natif | DeepL Pro / Crowdin / Traducteurs | Naturel, pas "traduit", termes théologiques corrects | J+5 |
| **7. Relecture Locale** | Relecteur natif / Vous (échantillon) | Crowdin / Google Docs | Fluide, culturellement adapté, SEO local conservé | J+2 |
| **8. Intégration CMS** | Vous / Decap CMS | Decap CMS / Astro Collections | Frontmatter complet, images uploadées, liens internes, schema.org | J+1 |
| **9. Prévisualisation** | Vous | Vercel Preview Deploy | Render OK mobile/desktop, hreflang, JSON-LD, pas de lien cassé | J+1 |
| **10. Publication** | Auto (Merge main) | GitHub Actions → Vercel | Live sur 9 langues, sitemap mis à jour, RSS mis à jour | Auto |
| **11. Promotion** | CM / Automatisation | Buffer / Make / MailerLite | Social posts programmés, newsletter envoyée, affiliés notifiés | J+0 |

**Délai Total FR → 9 Langues : ~2 semaines** (parallélisable traduction + relecture)

---

## 3. Rédaction Assistée par IA (Prompts & Workflow)

### Stack IA Recommandée
| Outil | Usage | Coût |
|-------|-------|------|
| **Claude 3.5 Sonnet / GPT-4o** | Rédaction longue, structure, théologie | $20/mois (Pro) |
| **DeepL Pro** | Traduction 9 langues (API + Glossaire) | $28/mois (API) |
| **Grammarly / LanguageTool** | Correction grammaire/style FR/EN | $12/mois |
| **SurferSEO / Clearscope** | Optimisation SEO (mots-clés, structure) | $89/mois |
| **Notion AI** | Résumé, reformulation, idées titres | Inclus Notion |

### Prompt Maître : Article Blog Spirituel (FR)
```markdown
# RÔLE
Tu es un rédacteur spirituel chrétien expérimenté, bienveillant, accessible, théologiquement solide (catholique/protestant/orthodoxe compatible). Tu écris pour des lecteurs en quête de sens, souvent en souffrance ou en questionnement.

# CONTEXTE
Site : Kiki en Christ (4 livres : Visage, Trinité, Combat, Salut)
Audience : 25-65 ans, francophones, spirituels mais pas nécessairement "pratiquants réguliers"
Ton : "Ami sage qui prend un café avec vous" — Empathie + Autorité douce + Espoir concret

# CONTRAINTES
- 1800-2500 mots
- Structure : H1 + Intro (accroche + promesse) + 4-6 H2 + Conclusion + CTA
- Mots-clés cibles : [LISTE] — Intégrer naturellement (H1, H2, intro, conclusion, 1x/300 mots)
- 1 citation biblique par section max (version Segond 21 / Semeur)
- 1 référence concrète à nos livres (ex: "Comme nous l'explorons dans 'Le Visage de Dieu'...")
- Pas de jargon théologique non expliqué
- Phrases courtes (max 20 mots), paragraphes courts (max 4 lignes)
- Voix active, "vous" direct, questions rhétoriques
- CTA final : "Et si vous alliez plus loin ? [Livre] vous guide pas à pas → [Lien]"

# ENTRÉES
Sujet : [SUJET]
Angle unique : [ANGLE]
Mots-clés : [MOTS_CLÉS]
Livre(s) concerné(s) : [LIVRES]

# SORTIE
Article complet en Markdown (prêt pour Astro Collections frontmatter)
```

### Prompt : Traduction + Adaptation Locale (DeepL + Post-Edit)
```markdown
# RÔLE
Traducteur natif [LANGUE] spécialisé contenu spirituel chrétien.

# TÂCHE
Traduire l'article FR ci-dessous en [LANGUE] — PAS de traduction littérale.
ADAPTER : Références culturelles, expressions idiomatiques, versets bibliques (version locale standard), exemples concrets.

# CONTRAINTES
- Conserver structure H1/H2/H3 exacte
- Conserver mots-clés SEO [LISTE] (adaptés langue)
- Conserver citations bibliques (version locale : [VERSION])
- Conserver CTA + liens (URLs localisées /{lang}/)
- Ton : Naturel [LANGUE], pas "français traduit"
- Longueur : ±10% version FR

# GLOSSAIRE THÉOLOGIQUE (Ne pas traduire / Adapter)
- "Trinité" → [TERME LOCAL]
- "Prière du cœur" → [TERME LOCAL]
- "Combat spirituel" → [TERME LOCAL]
- "Salut" → [TERME LOCAL]
- "Grâce" → [TERME LOCAL]
```

---

## 4. Calendrier Éditorial 2025-2026 (Extrait)

### Thèmes Majeurs (Piliers SEO + Spirituels)
| Trimestre | Thème Principal | Articles Prévus (FR) | Mots-clés Cibles |
|-----------|-----------------|----------------------|------------------|
| **Q4 2025** | **Prière & Intimité** | 1. Comment prier quand les mots manquent (Lead Magnet tie-in)<br>2. La prière du cœur : méthode simple<br>3. Prier avec les Psaumes<br>4. Le jeûne spirituel : pourquoi, comment | comment prier, prière du cœur, prier psaumes, jeûne spirituel |
| **Q1 2026** | **Foi & Doute** | 5. Quand Dieu semble silencieux<br>6. Surmonter la nuit obscure<br>7. Foi et raison : compatibles ?<br>8. Témoignage : mon retour à la foi | Dieu silencieux, nuit obscure, foi doute, témoignage conversion |
| **Q2 2026** | **Vie Chrétienne Pratique** | 9. Pardonner quand c'est impossible<br>10. Gérer l'anxiété par la foi<br>11. Discernement : entendre la voix de Dieu<br>12. Équilibre vie spirituelle / vie pro | pardonner, anxiété foi, discernement voix Dieu, équilibre vie |
| **Q3 2026** | **Approfondissement Théologique** | 13. Le Visage de Dieu dans l'Ancien Testament<br>14. La Trinité : mystère d'amour (lien Livre 2)<br>15. Le combat spirituel au quotidien (lien Livre 3)<br>16. Le Salut : don gratuit (lien Livre 4) | visage Dieu AT, Trinité amour, combat spirituel quotidien, salut don |

### Calendrier Mensuel (Template)
```
MOIS : [Mois Année]

SEMAINE 1 : Article Pilier (Long, SEO fort, Lead Magnet tie-in)
  - Lundi : Brief + Rédaction FR
  - Mercredi : Relecture + SEO
  - Vendredi : Validation + Envoi traduction

SEMAINE 2 : Traduction + Relecture 8 langues
  - Lundi-Mardi : DeepL + Post-edit traducteurs
  - Mercredi : Relecture locale (échantillon)
  - Jeudi : Intégration Decap CMS (9 langues)
  - Vendredi : Preview + Corrections

SEMAINE 3 : Publication + Promotion
  - Lundi : Merge → Deploy Prod
  - Mardi : Newsletter dédiée (extrait + lien)
  - Mercredi : Social posts (Carrousel IG, Thread FB, Pin)
  - Jeudi : Notification affiliés (kit partage)
  - Vendredi : Réponse commentaires + Partage UGC

SEMAINE 4 : Contenu Secondaire + Analyse
  - Article court / FAQ / Témoignage / Reel script
  - Analyse perf article précédent (GA4, Search Console, Social)
  - Préparation mois suivant
```

---

## 5. Outils & Stack Production

| Catégorie | Outils | Coût Mensuel |
|-----------|--------|--------------|
| **Planification** | Notion (Content Calendar, Kanban, Wiki) | $0-10 |
| **Rédaction** | Google Docs (collab) / Cursor (IA) / Obsidian | $0-20 |
| **IA Rédaction** | Claude Pro / ChatGPT Plus | $20-40 |
| **Traduction** | DeepL Pro API + Glossaire + Crowdin (gratuit ≤ 50k mots) | $28-50 |
| **SEO** | SurferSEO / Clearscope / Ahrefs (mots-clés) | $89-99 |
| **Relecture** | LanguageTool / Grammarly + Relecteurs natifs (freelance) | $30-100 |
| **CMS** | Decap CMS (gratuit) / CloudCannon ($0-300) | $0 |
| **Images** | Canva Pro (templates, resize, translate) | $12 |
| **Automatisation** | Make (workflows contenu) / Zapier | $20-50 |
| **Analytics** | GA4 + Search Console + Looker Studio | $0 |
| **TOTAL ESTIMÉ** | **~$250-450/mois** (selon volume traduction pro vs IA) | |

---

## 6. Qualité & Standards (Checklist Article)

### Avant Publication (Chaque Article)
- [ ] **Structure** : H1 unique, H2 logiques, H3 si nötig, Conclusion + CTA
- [ ] **SEO** : Méta title < 60c, méta desc < 160c, Mots-clés H1/H2/Intro/Conclusion, Schema.org BlogPosting
- [ ] **Lisibilité** : Phrases < 20 mots, Paragraphes < 4 lignes, Sous-titres tous les 300 mots, Listes à puces
- [ ] **Ton** : Bienveillant, accessible, "vous", pas de jargon, espérance concrète
- [ ] **Théologie** : Exact, pas d'hérésie, citations bibliques versions standard, références livres naturelles
- [ ] **Liens** : Internes (3-5 vers autres articles/pages), Externes (1-2 sources fiables), Affiliés (UTM)
- [ ] **Images** : Hero (1200x630), Illustrations (800x600), Alt text descriptif + mot-clé, WebP/AVIF
- [ ] **Multilingue** : 9 langues complètes, hreflang, URLs localisées, méta traduites
- [ ] **RGPD** : Pas de data perso, liens désinscription newsletter, mentions légales accessibles
- [ ] **Accessibilité** : Heading order, alt text, contraste, focus visible, skip link

### Score Qualité (SurferSEO / Clearscope)
- **Cible** : ≥ 75 / 100
- **Minimum** : 65 (sinon retravail)

---

## 7. Gestion Traducteurs & Relecteurs (Freelances)

### Profil Recherché
- Natif langue cible
- Chrétien pratiquant (connaissance vocabulaire théologique)
- Expérience traduction spirituelle / éditoriale
- Disponibilité : 1-2 articles/mois × ~2000 mots

### Rémunération (Indicatif)
| Langue | Tarif / Mot (Post-Edit DeepL) | Tarif / Article (2000 mots) | Mensuel (2 articles) |
|--------|-------------------------------|----------------------------|----------------------|
| EN, ES, DE, PT, IT | 0,04-0,06 € | 80-120 € | 160-240 € |
| RU, ZH, HI | 0,06-0,09 € | 120-180 € | 240-360 € |
| **Total 8 langues / mois** | | | **~1 200-2 400 €/mois** |

> **Alternative IA Seule** : DeepL API + Prompt Post-Edit (Claude) → ~$50/mois — Qualité ~85% pro, acceptable pour démarrage.

### Outils Collaboration
- **Crowdin** (Gratuit ≤ 50k mots/projet) : Glossaire, Mémoire traduction, Relecture, QA auto
- **Google Drive** : Dossiers par langue, articles en review
- **Slack / WhatsApp** : Communication rapide
- **Notion** : Planning, briefs, feedback centralisé

---

## 8. Réutilisation Contenu (Content Atomization)

### 1 Article Blog → 10+ Assets
| Asset | Plateforme | Effort | Outils |
|-------|------------|--------|--------|
| Article complet | Site (9 langues) | Base | Decap CMS |
| Newsletter "Long" | Email (extrait + lien) | 15 min | MailerLite |
| Carrousel IG (5-7 slides) | Instagram | 30 min | Canva (template) |
| Thread Twitter/X | Twitter/X | 15 min | Buffer |
| Post Facebook | Facebook | 10 min | Buffer |
| Pin Pinterest (2:3) | Pinterest | 15 min | Canva + Buffer |
| Reel/Shorts Script (60s) | IG Reels, YT Shorts, TikTok | 20 min | CapCut |
| Extrait "Citation" | Story IG + Quote Graphic | 5 min | Canva |
| FAQ mise à jour | Site (section FAQ) | 10 min | Decap CMS |
| Lead Magnet (si pilier) | PDF + Landing | 2h | Canva + Decap |

---

## 9. Métriques Contenu (Mensuel)

| KPI | Cible | Outil |
|-----|-------|-------|
| **Articles publiés / mois** | 2-4 (FR) → 18-36 (9 langues) | Notion / Git |
| **Trafic organique / article (30j)** | > 500 sessions | GA4 |
| **Taux conversion article → NL** | > 3% | GA4 + MailerLite |
| **Taux conversion article → Achat** | > 1% | GA4 + UTM |
| **Positions Top 10 (mots-clés cibles)** | ≥ 3 par article | Search Console / Ahrefs |
| **Backlinks gagnés / article** | ≥ 2 | Ahrefs |
| **Partages sociaux / article** | ≥ 50 | Buffer / Native |
| **Temps lecture moyen** | > 3 min | GA4 (scroll depth) |
| **Coût / article (production)** | < 200 € (IA) / < 500 € (Pro) | Comptabilité |

---

*Skill créé le 2025-11-20. Production Contenu = système reproductible pour échelle multilingue durable.*