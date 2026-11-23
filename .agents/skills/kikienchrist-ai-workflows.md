---
name: kikienchrist-ai-workflows
description: "Workflows IA (Prompts Library, Agents Spécialisés, Évaluation Qualité, Coût/ROI, Gouvernance, Intégration Make/Zapier/Cursor, RAG sur Skills)"
version: "1.0"
---

# Skill: kikienchrist-ai-workflows

## Objectif
Industrialiser l'usage de l'IA pour **multiplier la productivité** (rédaction, traduction, code, analyse, stratégie) tout en gardant **qualité, cohérence, contrôle coûts, conformité**.

---

## 1. Architecture IA (Stack Actuelle)

| Couche | Outil | Usage | Coût Mensuel |
|--------|-------|-------|--------------|
| **LLM Principal (Raisonnement/Code)** | **Claude 3.5 Sonnet** (via Cursor/DSH) | Code, architecture, prompts complexes, analyse | Inclus DSH / $20 (Pro) |
| **LLM Secondaire (Rapide/Volume)** | **GPT-4o-mini** (via OpenAI API) | Traduction post-edit, résumés, méta, classification | ~$10-30 (API) |
| **LLM Spécialisé (FR/Théologie)** | **Mistral Large / Nemotron 3 Ultra** | Rédaction spirituelle FR, nuances théologiques | ~$20-50 (API) |
| **Traduction** | **DeepL Pro API** + **Glossaire** | 8 langues (post-edit humaine) | $28 (API) |
| **Embeddings / RAG** | **Voyage AI / OpenAI text-embedding-3-large** | Recherche skills, docs, translations.json | ~$10-20 (API) |
| **IA Locale (Privé)** | **Ollama (Llama 3.1 70B / Qwen 2.5 72B)** | Tests prompts, données sensibles, offline | $0 (GPU local) |
| **Orchestration** | **Make / Zapier / Cursor / DSH** | Workflows automatisés, agents, triggers | $20-50 |

---

## 2. Prompts Library (Versionnés dans `.agents/prompts/`)

### Structure
```
.agents/prompts/
├── content/
│   ├── blog-article-fr.md          # Prompt maître article blog FR
│   ├── blog-article-seo.md         # Optimisation SEO existant
│   ├── newsletter-weekly.md        # Newsletter hebdo
│   ├── lead-magnet-pdf.md          # Structure lead magnet
│   └── social-post.md              # Post réseaux (IG/FB/LI/Pin)
├── translation/
│   ├── deepl-postedit.md           # Post-edit DeepL (8 langues)
│   ├── theological-glossary.md     # Glossaire termes théologiques (FR→8 langues)
│   └── cultural-adaptation.md      # Adaptation culturelle par langue
├── code/
│   ├── astro-component.md          # Composant Astro typé + a11y + test
│   ├── netlify-function.md         # Function TypeScript + validation + error handling
│   ├── github-action.yml           # Workflow CI/CD
│   └── middleware-edge.ts          # Vercel Edge Middleware
├── analysis/
│   ├── seo-audit.md                # Audit SEO page (input: HTML + URL)
│   ├── performance-audit.md        # Analyse Lighthouse + recommandations
│   ├── content-gap.md              # Analyse lacunes contenu vs concurrents
│   └── conversion-audit.md         # Analyse page + hypothèses CRO
├── strategy/
│   ├── quarterly-okrs.md           # Draft OKRs trimestre
│   ├── content-calendar.md         # Calendrier éditorial 3 mois
│   └── partnership-outreach.md     # Email approche partenaires
└── ops/
    ├── incident-postmortem.md      # Structure post-mortem (5 Why)
    ├── dr-test-report.md           # Rapport test DR
    └── weekly-sync-prep.md         # Préparation weekly sync
```

### Exemple : `blog-article-fr.md` (Prompt Maître)
```markdown
---
name: blog-article-fr
version: 1.2
model: claude-3.5-sonnet
temperature: 0.4
max_tokens: 4000
---

# RÔLE
Rédacteur spirituel chrétien expérimenté, bienveillant, accessible, théologiquement solide (œcuménique). Ton : "Ami sage qui prend un café avec vous" — Empathie + Autorité douce + Espoir concret.

# CONTEXTE PROJET
Site : Kiki en Christ (4 livres : Visage, Trinité, Combat, Salut — 9 langues)
Audience : 25-65 ans, francophones, spirituels mais pas nécessairement "pratiquants réguliers"
Design System : Tokens CSS (--ink, --paper, --gold, --accent), Mobile-first ≤760px

# CONTRAINTES STRICTES
- Longueur : 1800-2500 mots
- Structure : H1 unique → Intro (accroche + promesse) → 4-6 H2 → Conclusion + CTA
- Mots-clés cibles : {{KEYWORDS}} — Intégrer naturellement (H1, 1er H2, intro, conclusion, 1x/300 mots)
- 1 citation biblique par section max (version Segond 21 / La Bible Semeur)
- 1 référence naturelle à nos livres : "Comme nous l'explorons dans 'Le Visage de Dieu'..."
- Pas de jargon théologique non expliqué (ex: "kenosis" → "dépouillement")
- Phrases courtes (max 20 mots), paragraphes courts (max 4 lignes)
- Voix active, "vous" direct, questions rhétoriques
- CTA final : "Et si vous alliez plus loin ? {{BOOK_TITLE}} vous guide pas à pas → {{BOOK_URL}}"
- Schema.org BlogPosting JSON-LD inclus en fin d'article

# ENTRÉES
Sujet : {{TOPIC}}
Angle unique : {{ANGLE}}
Mots-clés cibles : {{KEYWORDS}}
Livre(s) concerné(s) : {{BOOKS}}
URLs livres : {{BOOK_URLS}}
Public cible détaillé : {{AUDIENCE_DETAILS}}

# SORTIE ATTENDUE
Markdown complet prêt pour Astro Collections :
---
title: "{{TITLE}}"
description: "{{META_DESCRIPTION}}"
pubDate: {{DATE}}
author: "Kiki en Christ"
tags: {{TAGS}}
lang: "fr"
canonical: "https://kikienchrist.vercel.app/fr/blog/{{SLUG}}/"
image: "{{HERO_IMAGE_URL}}"
featured: false
---

{{ARTICLE_MARKDOWN}}

<!-- JSON-LD BlogPosting -->
<script type="application/ld+json">
{{JSON_LD_BLOG_POSTING}}
</script>
```

---

## 3. Agents Spécialisés (Définis pour Make/Zapier/Cursor/DSH)

| Agent | Rôle | Modèle | Inputs | Outputs | Intégration |
|-------|------|--------|--------|---------|-------------|
| **Content Strategist** | Planification, angles, calendrier, SEO keywords | Claude 3.5 | Sujets, analytics, tendances | Calendrier 3 mois, briefs articles | Make → Notion |
| **Spiritual Writer FR** | Rédaction articles FR (blog, newsletter, lead magnet) | Claude 3.5 / Nemotron | Brief + Prompt library | Article Markdown + JSON-LD + Méta | Make → Decap CMS / GitHub PR |
| **SEO Optimizer** | Audit + optimisation on-page (mots-clés, structure, schema) | GPT-4o-mini | HTML/Markdown + URL + Keywords | Score + Recommandations + Version optimisée | Cursor / Make |
| **Translator Post-Editor** | Post-edit DeepL (8 langues) — Adaptation culturelle + théologique | GPT-4o-mini / Mistral | Texte FR + Langue cible + Glossaire | Texte localisé naturel + SEO local conservé | Make → Crowdin / Decap CMS |
| **Code Assistant** | Composants Astro, Functions, Middleware, Tests, CI/CD | Claude 3.5 | Spec + Contexte tech-stack | Code TypeScript + Tests + Doc | Cursor / GitHub Copilot |
| **Conversion Analyst** | Audit page → Hypothèses CRO (ICE) + Priorisation | GPT-4o-mini | HTML + Clarity/GA4 data + Funnel | Rapport + 3 hypothèses priorisées | Make → Notion |
| **Partnership Outreach** | Emails personnalisés partenaires (influenceurs, blogs, églises) | Claude 3.5 | Profil cible + Offre + Kit | Email + Suivi sequence | Make → Gmail / MailerLite |
| **Legal/Compliance Checker** | Vérif RGPD, ePrivacy, CGV, Accessibilité, Mentions légales | GPT-4o-mini | Texte/Page/Config | Checklist + Alertes non-conformité | Make / Pre-commit |
| **Weekly Sync Prep** | Synthèse métriques + Top 3 objectifs + Bloqueurs | GPT-4o-mini | GA4, Vercel, Sentry, GitHub, Notion | Agenda Weekly Sync formaté | Make → Slack / Notion |
| **DR Test Reporter** | Rapport test DR structuré + Actions correctives | GPT-4o-mini | Logs test + Chrono + Résultat | Rapport Notion + Slack summary | Make → Notion / Slack |

### Exemple Configuration Agent (Make — HTTP Module)
```json
{
  "name": "Spiritual Writer FR",
  "model": "claude-3-5-sonnet-20241022",
  "system_prompt": "{{file:.agents/prompts/content/blog-article-fr.md}}",
  "temperature": 0.4,
  "max_tokens": 4000,
  "tools": [
    { "name": "web_search", "description": "Rechercher versets bibliques, références" },
    { "name": "read_skill", "description": "Charger skill kikienchrist-content-strategy" }
  ],
  "output_format": "markdown_with_frontmatter"
}
```

---

## 4. Workflows IA Automatisés (Make / Zapier)

### Workflow 1 : "Blog Idea → Published Article" (End-to-End)
```
Trigger: Nouvelle ligne Notion "Content Calendar" (Status = "Ready to Write")
  │
  ├─▶ Content Strategist Agent → Génère brief détaillé (Angle, Keywords, Outline, Audience)
  │       Output → Update Notion row (Brief complet)
  │
  ├─▶ Spiritual Writer FR Agent → Rédige article FR complet (Markdown + Frontmatter + JSON-LD)
  │       Output → Create file in GitHub (branch `content/{{slug}}`) + PR draft
  │
  ├─▶ Human Review (Assigné dans PR) → Relecture théologique + SEO (Commentaires PR)
  │       Si OK → Merge → Auto-deploy Preview
  │
  ├─▶ Translator Post-Editor Agent (Parallel × 8 langues) → Post-edit DeepL + Adaptation
  │       Output → Create files in GitHub (same branch) + Update PR
  │
  ├─▶ SEO Optimizer Agent → Score SurferSEO + Micro-optimisations (toutes langues)
  │
  ├─▶ Human Final Review (Preview URL) → Approve → Merge main
  │
  ├─▶ Auto-Deploy Prod (GitHub Actions)
  │
  ├─▶ Promotion Agent → Social posts (Canva templates) + Newsletter excerpt + Affiliate notify
  │       Scheduled in Buffer / MailerLite / FirstPromoter
  │
  └─▶ Analytics Agent (J+7, J+30) → Rapport perf → Notion + Slack
```

### Workflow 2 : "Weekly Intelligence Brief" (Lundi 7h)
```
Trigger: Schedule (Cron Lundi 7h)
  │
  ├─▶ Weekly Sync Prep Agent → Récupère :
  │       - GA4 (trafic, conversions, top pages, sources)
  │       - Vercel Analytics (CWV, errors, deployments)
  │       - Sentry (errors, releases, performance)
  │       - GitHub (PRs merged, issues closed, deployments)
  │       - MailerLite (subscribers, opens, clicks, revenue)
  │       - FirstPromoter (clicks, conversions, payouts)
  │       - Notion (tasks done, in progress, blocked)
  │
  ├─▶ Synthétise : Top 3 wins, Top 3 concerns, 3 décisions requises, 3 actions semaine
  │
  ├─▶ Format : Markdown (Template Weekly Sync)
  │
  ├─▶ Poste : Slack #weekly-sync + Notion "Weekly Sync Notes"
  │
  └─▶ Envoie : Email résumé à l'équipe (optionnel)
```

### Workflow 3 : "Partner Outreach Campaign" (Mensuel)
```
Trigger: Schedule (1er du mois) + Liste prospects Notion (Status = "New")
  │
  ├─▶ Partnership Outreach Agent → Pour chaque prospect :
  │       - Recherche web (contenu récent, audience, valeurs)
  │       - Génère email hyper-personnalisé (Template + Contexte)
  │       - Crée séquence suivi (J+3, J+7, J+14)
  │
  ├─▶ Envoie via Gmail API (avec tracking UTM)
  │
  ├─▶ Log dans Notion "Partnership CRM" (Date, Prospect, Email, Status)
  │
  ├─▶ Si réponse → Assigne à humain pour appel
  │
  └─▶ Rapport mensuel : Envoyés, Ouverts, Répondu, Appels, Signés
```

---

## 5. Évaluation Qualité IA (Quality Gates)

### Métriques par Type de Sortie
| Type Sortie | Métrique | Seuil Minimum | Outil Mesure |
|-------------|----------|---------------|--------------|
| **Article Blog FR** | Score SurferSEO | ≥ 75 | SurferSEO API |
| **Article Blog FR** | Lisibilité (Flesch-Kincaid FR) | ≥ 60 (facile) | LanguageTool API |
| **Article Blog FR** | Théologie Check | Validé par humain | Checklist manuelle |
| **Traduction (Post-Edit)** | BLEU vs Référence humaine | ≥ 0.85 | Script custom |
| **Traduction** | Terminologie théologique | 100% glossaire respecté | Script + Glossaire |
| **Code (Astro/TS)** | TypeScript Check | 0 erreurs | `npm run check` |
| **Code** | Tests Pass | 100% | `npm run test` |
| **Code** | Accessibilité (axe-core) | 0 violations critiques | `npm run test:a11y` |
| **Email/Outreach** | Personnalisation Score | ≥ 8/10 (humain) | Revue échantillon |
| **JSON-LD** | Google Rich Results Test | 0 erreurs, 0 warnings critiques | API / Manual |

### Processus Validation (Human-in-the-Loop)
```
IA Génère → Score Auto (Seuil) → 
  Si PASS → Human Review (Théo/SEO/Code) → 
    Si APPROVED → Deploy/Publish
  Si FAIL → IA Retry (max 2) avec feedback → 
    Si STILL FAIL → Escalade Humain (Rédaction manuelle)
```

---

## 6. Coût & ROI IA (Mensuel Estimé)

| Poste | Coût | Volume | Coût/Unité | ROI Mesuré |
|-------|------|--------|------------|------------|
| **Claude 3.5 (Cursor/DSH)** | Inclus / $20 | ~500k tokens | ~$0.004/1k | 10x vitesse rédaction/code |
| **GPT-4o-mini API** | $15 | ~2M tokens | $0.00015/1k | 50x vitesse traduction/analyse |
| **DeepL Pro API** | $28 | ~500k chars | $0.000056/char | 90% économie vs traducteur pro |
| **Make (Operations)** | $20 | ~10k ops | $0.002/op | Automatisation 20h/semaine |
| **SurferSEO** | $89 | ~30 articles | $3/article | +40% trafic organique |
| **Total** | **~$172/mois** | | | **~200h économisées/mois** |

> **Règle** : Tout workflow IA doit avoir un **ROI mesurable** (temps économisé, qualité améliorée, revenu généré) révisé trimestriellement.

---

## 7. Gouvernance IA (Règles & Garde-fous)

### Principes
1. **Human-in-the-Loop** : Aucune publication/sans relecture humaine (théologie, légal, brand)
2. **Données Sensibles** : Jamais de secrets, emails clients, données paiement dans prompts IA cloud → Utiliser Ollama local
3. **Traçabilité** : Tous prompts/outputs versionnés (`.agents/prompts/`, Git history, Make logs)
4. **Biais & Hallucination** : Vérification faits (versets, dates, prix, URLs) — "Trust but verify"
5. **Propriété Intellectuelle** : Outputs IA = propriété Kiki en Christ — Pas d'entraînement sur nos données (opt-out APIs)
6. **Conformité** : RGPD (pas de données perso), Droit d'auteur (prompts/outputs), Transparence (mention IA si requis)

### Registre Usages IA (Notion — Mis à jour mensuel)
| Workflow | Modèle | Données Input | Output | Réviseur Humain | Fréquence | Coût Mois | Statut |
|----------|--------|---------------|--------|-----------------|-----------|-----------|--------|
| Blog Article FR | Claude 3.5 | Brief + Skills | Article + JSON-LD | Content Lead | 3-4/mois | $5 | Actif |
| Traduction 8 langues | GPT-4o-mini + DeepL | Article FR + Glossaire | 8 versions | Relecteurs natifs | 3-4/mois | $15 | Actif |
| Code Assistant | Claude 3.5 | Spec + Tech Stack | Composant + Tests | Tech Lead | Hebdo | Inclus | Actif |
| SEO Audit | GPT-4o-mini | HTML + URL | Rapport | SEO Lead | Mensuel | $2 | Actif |
| Partner Outreach | Claude 3.5 | Profil + Kit | Email + Seq | Marketing Lead | Mensuel | $3 | Actif |

---

## 8. RAG sur Skills (Knowledge Retrieval pour Agents)

### Implémentation (Make + Voyage AI / Pinecone / Supabase pgvector)
```python
# 1. Chunker tous skills (.md) + PROJECT_CONTEXT.md + translations.json schema
# 2. Embeddings (voyage-3-large / text-embedding-3-large)
# 3. Vector DB (Pinecone / Supabase / Chroma local)
# 4. Agent Query → Retrieval (Top 5 chunks pertinents) → Contexte injecté dans prompt

# Exemple requête agent "Code Assistant" :
# "Comment implémenter BookCard avec equal-height script ?"
# → Retrieval : skill book-cards + design-system + tech-stack (extrait)
# → Prompt enrichi → Code précis, conforme standards projet
```

### Avantages
- **Contexte Projet Permanent** : Agents "connaissent" le projet sans re-charger skills manuellement
- **Cohérence** : Réponses alignées sur standards (naming, patterns, tokens, workflows)
- **Vitesse** : Moins de tokens prompt (contexte récupéré vs injecté en full)
- **Maintenabilité** : MAJ skills → Re-indexation auto → Agents à jour

---

## 9. Prompts Évaluation (Meta-Prompts)

### Prompt : "Évaluer Qualité Sortie IA"
```markdown
# RÔLE
Évaluateur expert — Exigeant, précis, constructif.

# TÂCHE
Évaluer la sortie IA ci-dessous selon critères. Score 1-10 par critère + Verdict.

# CRITÈRES
1. **Exactitude Factuelle** : Versets, dates, prix, URLs, noms corrects ?
2. **Cohérence Brand** : Ton "Ami sage", vocabulaire Kiki en Christ, CTA naturel ?
3. **Qualité Technique** : Code compile, tests passent, types TS stricts, a11y ?
4. **SEO** : Mots-clés intégrés, structure H1/H2, JSON-LD valide, méta tags ?
5. **Conformité** : RGPD, ePrivacy, CGV, Accessibilité, Pas de hallucination ?
6. **Utilité** : Répond au besoin utilisateur ? Actionnable ? Complet ?

# SORTIE
JSON :
{
  "scores": { "factual": 8, "brand": 9, "technical": 7, "seo": 8, "compliance": 10, "utility": 9 },
  "verdict": "APPROVE / REVISE / REJECT",
  "feedback": "Points forts : ... / Points à améliorer : ... / Corrections requises : ...",
  "human_review_needed": true/false
}
```

---

## 10. Roadmap IA (Prochains 6 Mois)

| Trimestre | Objectif | Livrables |
|-----------|----------|-----------|
| **Q4 2025** | **Fondation** | Prompts library v1.0, 3 agents actifs (Writer, Translator, Code), RAG skills basique, Workflows Make 3 |
| **Q1 2026** | **Qualité & Échelle** | Quality gates auto, Évaluation méta-prompts, 5 agents (SEO, CRO, Partnership, Legal, Analytics), SurferSEO intégré |
| **Q2 2026** | **Autonomie Ciblée** | Auto-deploy blog (Human approval only), Traduction temps-réel (CMS), Outreach auto-réponses, Coût < $200/mois |
| **Q3 2026** | **Intelligence Prédictive** | Prédiction trafic/conversion, Suggestion sujets auto, Détection anomalies (analytics), A/B test design auto |

---

*Skill créé le 2025-11-20. IA Workflows = multiplicateur de force — Qualité gardée, coûts maîtrisés, humain au centre.*