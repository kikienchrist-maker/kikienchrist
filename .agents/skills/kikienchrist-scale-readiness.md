---
name: kikienchrist-scale-readiness
description: "Préparation Scale (Architecture Multi-région, Edge KV/Database, Auth, Microservices, Team Scaling, Compliance Internationale, Observabilité Distribuée, Feature Flags, Chaos Engineering)"
version: "1.0"
---

# Skill: kikienchrist-scale-readiness

## Objectif
Préparer l'architecture, les processus et l'équipe pour **passer de "Projet Solo" à "Scale-Up International"** — Supporter 100k+ visiteurs/mois, 10k+ abonnés, équipe 10+, multi-région, conformité globale, sans réécrire le cœur.

---

## 1. Architecture Cible (Évolution Progressive)

### Phase Actuelle (Static Export → Vercel Edge)
```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Edge Middle  │  │ Static Files │  │ Serverless   │       │
│  │ (i18n, A/B,  │  │ (HTML, CSS,  │  │ Functions    │       │
│  │  Auth, Logs) │  │  JS, Images) │  │ (API, Forms) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌─────────────┐     ┌─────────────┐
            │   GitHub    │     │  Netlify    │
            │  (Source)   │     │  (Forms)    │
            └─────────────┘     └─────────────┘
```

### Phase 1 : "Scale Ready" (6-12 mois — 10k-50k visites/mois)
```
Ajouts : Edge KV (Config dynamiques, Rate limiting, Session), 
         Database (PostgreSQL — Utilisateurs, Préférences, Progression, Analytics events),
         Auth (Clerk/NextAuth — SSO, Magic Link, Social, MFA),
         Feature Flags (LaunchDarkly/Unleash — Rollout progressif),
         Observabilité (OpenTelemetry → Grafana Cloud / Datadog),
         CDN Images (Vercel Blob / Cloudflare R2 + @astrojs/image)
```

### Phase 2 : "Multi-Région & Microservices" (12-24 mois — 100k+ visites/mois, Équipe 10+)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GLOBAL EDGE (Cloudflare / Vercel / AWS CloudFront)   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Web App   │  │   API GW    │  │   Auth      │  │   Edge Config     │   │
│  │  (Astro SSR │  │  (Kong/     │  │  (Clerk/    │  │  (Flags, Rate    │   │
│  │   + Islands)│  │   AWS API   │  │   Auth0)    │  │   Limits, A/B)    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  RÉGION EU    │    │  RÉGION US    │    │  RÉGION APAC  │
│  (Frankfurt)  │    │  (Virginia)   │    │  (Singapore)  │
│  ├─────────┤  │  ├─────────┤  │  ├─────────┤  │
│  │ Postgres │  │  │ Postgres │  │  │ Postgres │  │  (Read Replicas)
│  │  (R/W)   │  │  │  (R/W)   │  │  │  (R)     │  │
│  ├─────────┤  │  ├─────────┤  │  ├─────────┤  │
│  │ Redis    │  │  │ Redis    │  │  │ Redis    │  │
│  │ (Cache/  │  │  │ (Cache/  │  │  │ (Cache/  │  │
│  │  Sessions)    │  │  Sessions)    │  │  Sessions)    │  │
│  ├─────────┤  │  ├─────────┤  │  ├─────────┤  │
│  │ Workers  │  │  │ Workers  │  │  │ Workers  │  │
│  │ (Jobs,   │  │  │ (Jobs,   │  │  │ (Jobs,   │  │
│  │  Email,  │  │  │  Email,  │  │  │  Email,  │  │
│  │  Video)  │  │  │  Video)  │  │  │  Video)  │  │
│  └─────────┘  │  └─────────┘  │  └─────────┘  │
└───────────────┘  └───────────────┘  └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌───────────────────┐
                    │   DATA LAKE       │
                    │ (ClickHouse /     │
                    │  BigQuery /       │
                    │  Snowflake)       │
                    │  Analytics, ML,   │
                    │  BI, Audit        │
                    └───────────────────┘
```

---

## 2. Composants Critiques à Préparer (Maintenant → Phase 1)

### 2.1 Edge KV / Config Dynamique (Vercel Edge Config / Cloudflare Workers KV / Upstash Redis)
| Usage | Clé | TTL | Mise à jour |
|-------|-----|-----|-------------|
| **Feature Flags** | `flags:{{flag_name}}` | ∞ | API Admin / GitHub Action |
| **A/B Test Variants** | `ab:{{test_id}}:{{variant}}` | ∞ | API Admin |
| **Rate Limits** | `ratelimit:{{ip}}:{{endpoint}}` | 60s | Auto (Middleware) |
| **Config Publique** | `config:{{key}}` (ex: `hero_images_fr`, `book_urls_en`) | ∞ | CMS / Admin UI |
| **User Session** | `session:{{session_id}}` | 24h | Auth Middleware |
| **Geo/IP Data** | `geo:{{ip}}` | 24h | Middleware (Cloudflare/Netlify) |

**Migration Prép** : Remplacer `import` statique config par `fetch` Edge Config dans Middleware + Composants (ex: Hero Fan URLs, Book URLs).

### 2.2 Database (PostgreSQL — Neon / Supabase / PlanetScale / RDS)
| Table | Colonnes Clés | Index | Accès |
|-------|---------------|-------|-------|
| **users** | id, email, name, avatar, locale, timezone, role, created_at, last_login_at | email (unique), locale | Auth, Profile, Admin |
| **preferences** | user_id, email_optin, sermon_notifs, language, theme, digest_frequency | user_id (FK) | Profile, Email, Notifs |
| **reading_progress** | user_id, book_id, chapter, percentage, last_read_at, notes | user_id + book_id | App, Dashboard, Email |
| **purchases** | id, user_id, platform, book_id, format, amount, currency, status, created_at, webhook_data | user_id, status, platform | Compta, Reconciliation, Email |
| **analytics_events** | id, user_id, session_id, event_name, properties, timestamp, page_url, referrer | timestamp, event_name, user_id | Analytics, ML, BI |
| **newsletter_subscribers** | id, email, source, tags, status, confirmed_at, unsubscribed_at | email (unique), status | MailerLite Sync, Segmentation |
| **affiliate_clicks** | id, affiliate_id, book_id, platform, ip_hash, user_agent, timestamp, converted | affiliate_id, timestamp | FirstPromoter Sync, Attribution |
| **feature_flags** | key, description, enabled, rollout_percentage, targeting_rules, created_by | key (unique) | Admin, Middleware |
| **ab_tests** | id, name, hypothesis, variants, traffic_split, status, start_date, end_date, results | id, status | Admin, Middleware |

**Migration Prép** : 
- Schéma Prisma/Drizzle dans `packages/db/schema.prisma`
- Migrations versionnées (Git)
- Seed data (Config par défaut, Feature flags, Admin user)
- RLS (Row Level Security) pour multi-tenant futur

### 2.3 Authentification (Clerk / NextAuth v5 / Auth0)
| Fonctionnalité | Implémentation | Intégration |
|----------------|----------------|-------------|
| **Inscription/Connexion** | Email/Magic Link, Google, Apple, GitHub, Microsoft | Clerk `<SignIn/> <SignUp/>` + Webhooks → DB Sync |
| **Session** | JWT (Short-lived 15min) + Refresh Token (Rotation) | Middleware Edge validation (JWKS) |
| **MFA** | TOTP (Authenticator), SMS, Email, Passkeys (WebAuthn) | Clerk MFA / Auth0 Guardian |
| **Rôles** | `user`, `subscriber`, `ambassador`, `moderator`, `admin` | DB `users.role` + Clerk Metadata → Middleware RBAC |
| **SSO Entreprise** | SAML/OIDC (Églises, Organisations) | Clerk Organizations / Auth0 Organizations |
| **Conformité** | RGPD (Suppression, Portabilité), ePrivacy (Consent), SOC2 (Clerk/Auth0) | Webhooks → Audit Logs |

**Migration Prép** : 
- Wrapper `auth.ts` abstrait (Fournisseur interchangeable)
- Middleware `withAuth` pour routes protégées
- Composants `<UserButton/> <OrganizationSwitcher/>`
- Migration cookie `preferred-lang` → `user.locale` (DB)

### 2.4 Feature Flags & A/B Testing (LaunchDarkly / Unleash / GrowthBook / Custom Edge Config)
| Flag | Type | Cible | Rollout | Métrique Succès |
|------|------|-------|---------|-----------------|
| `new_hero_layout` | Boolean | Tous | 10% → 50% → 100% | LCP, CTR Hero |
| `book_card_v2` | Boolean | Mobile | 20% → 100% | Clic achat, Add to cart |
| `newsletter_popup_v2` | Variant (A/B/C) | Nouveaux visiteurs | 33% each | Taux inscription |
| `checkout_flow_new` | Boolean | Acheteurs | 5% → 25% → 100% | Conversion, Panier moyen |
| `community_features` | Boolean | Abonnés | 100% (Opt-in) | Engagement, Rétention |
| `ai_chat_assistant` | Boolean | Premium/Ambassadeurs | 10% → 50% | Satisfaction, Usage |

**Architecture** : 
- **Edge Evaluation** : Middleware lit flags (Edge Config/KV) → Injecte dans response headers / cookies / HTML `data-flags`
- **Client SDK** : `useFlag('flag_name')` hook → React/Astro Islands pour UI conditionnelle
- **Server Evaluation** : API Routes / Functions pour logique métier (Prix, Accès contenu)

### 2.5 Observabilité Distribuée (OpenTelemetry → Grafana Cloud / Datadog / Honeycomb)
| Signal | Outil | Instrumentation | Alertes Clés |
|--------|-------|-----------------|--------------|
| **Traces** | Grafana Tempo / Jaeger | `@opentelemetry/instrumentation-astro`, `http`, `pg`, `redis` | Latence P99 > 2s, Erreur rate > 1% |
| **Métriques** | Prometheus / Grafana Mimir | `prom-client` (Custom: `http_requests_total`, `db_query_duration`, `cache_hit_ratio`) | CPU > 80%, Mem > 85%, Queue lag > 100 |
| **Logs** | Loki / Datadog Logs | `pino` + `pino-pretty` (Structured JSON: `trace_id`, `span_id`, `user_id`, `feature_flag`) | Error > 10/min, "FATAL", Pattern "PANIC" |
| **RUM** | Grafana Faro / Datadog RUM | `@grafana/faro-web-sdk` (Astro integration) | LCP > 4s, CLS > 0.25, INP > 500ms, JS Errors > 1% sessions |
| **Synthetics** | Checkly / Grafana Synthetic | API checks (Health, Auth, Purchase), Browser checks (Critical paths) | Down > 1min, Latence > 5s |

**Migration Prép** :
- `instrumentation.ts` (Astro) + `otel-sdk` (Node/Edge)
- Resource attributes : `service.name=kikienchrist-web`, `deployment.environment`, `service.version`
- Sampling : 100% erreurs, 10% succès (Head/Tail)
- Dashboards : "Golden Signals" (Latency, Traffic, Errors, Saturation) par service/région

---

## 3. Team Scaling (Solo → 10+)

### Structure Cible (24 mois)
| Équipe | Rôles | Taille | Métriques |
|--------|-------|--------|-----------|
| **Platform/Infra** | Staff Engineer, DevOps, SRE, Security | 3-4 | Deploy freq, MTTR, Incidents, Cost/req |
| **Product Engineering** | Tech Lead, Senior Dev (2), Mid Dev (2), QA | 5-6 | Cycle time, Bug rate, Feature velocity |
| **Content & Growth** | Content Lead, Writers (2), Translators (3), SEO, Video, Podcast | 8-10 | Articles/mois, Trafic organique, Conversion |
| **Community & Support** | Community Manager, Modérateurs (5), Support (2) | 8 | NPS, Rétention, Temps réponse, Santé communauté |
| **Data & AI** | Data Engineer, ML Engineer, Analytics Engineer | 3 | Data freshness, Model accuracy, Insights/action |
| **Design** | Design Lead, Product Designer, Motion Designer | 3 | Design system coverage, Accessibility score |
| **Operations** | COO/Ops Lead, Finance, Legal, People, Partnerships | 4-5 | Cash flow, Compliance, Hiring velocity |

### Processus Échelle (À Mettre en Place Maintenant)
| Processus | Maintenant (Solo) | Phase 1 (3-5) | Phase 2 (10+) |
|-----------|-------------------|---------------|---------------|
| **Planning** | Notion perso | GitHub Projects + Sprint 2 sem | Jira/Linear + PI Planning (Quarterly) |
| **Code Review** | Auto-merge si tests vert | 1 approval requis + CI | 2 approvals + Security review + Arch review |
| **Deploy** | `vercel --prod --force` | Preview → Staging → Prod (Manual promote) | GitOps (ArgoCD/Flux) + Canary + Feature flags |
| **Incident** | Vous seul | On-call rotation (PagerDuty/Opsgenie) | Tier 1 (Support) → Tier 2 (Dev) → Tier 3 (SRE) |
| **Knowledge** | Skills (Ce repo) | Notion Wiki + ADR (Architecture Decision Records) | Internal Developer Portal (Backstage) |
| **Hiring** | Freelances | Recruteur part-time + Processus structuré | Talent Acquisition + Employer Brand |

---

## 4. Compliance Internationale (Multi-Région)

| Région | Réglementation | Exigences Clés | Implémentation |
|--------|----------------|----------------|----------------|
| **UE (RGPD)** | RGPD + ePrivacy + DSA (si >45M users) | DPO, Registre traitements, DPIA, Droits sujets, Transferts, Cookies consent, Modération contenu | `legal-compliance` skill + DPO externe + CMP (Didomi/OneTrust) |
| **US (État par État)** | CCPA/CPRA (CA), VCDPA (VA), CPA (CO), CTDPA (CT) | "Do Not Sell", Droits accès/suppression, Consentement mineurs, Data minimization | Banner cookies US-specific, Opt-out global, Vérification âge |
| **Brésil** | LGPD | Base légale, DPO, Droits, Transferts internationaux, Incident notification | Mêmes processus RGPD + Représentant local |
| **Canada** | Loi 25 (Québec) + PIPEDA | Consentement explicite, DPIA, Portabilité, Désignation responsable | Québec: Consentement granulaire, Langue française |
| **Chine** | PIPL + CSL + DSL | Stockage local, Consentement, Sécurité, Evaluation sortie données | Entité locale requise / Partenaire / Hébergement Chine (AliCloud/Tencent) |
| **Autres** | POPIA (ZA), PDPA (SG/TH/VN), APP (AU), LGPD (BR) | Cartographie par pays d'audience > 1% | Matrice conformité par pays → Priorisation |

**Architecture Compliance** :
- **Geo-DNS** → Routage vers région conforme (EU users → EU region)
- **Data Residency** : PostgreSQL par région (EU, US, APAC) — Pas de cross-region replication pour PII
- **Consent Management** : CMP unifiée (Didomi/OneTrust) → Stockage consent par utilisateur/région
- **Audit Trail** : Immutable logs (CloudTrail / Audit Log DB) → Requêtes régulateurs

---

## 5. Chaos Engineering & Résilience (Phase 1+)

### Game Days (Mensuel → Hebdo)
| Scénario | Injection | Durée | Métriques Observées | Critères Succès |
|----------|-----------|-------|---------------------|-----------------|
| **DB Primary Down** | Kill primary PG connection | 5 min | Failover time, Error rate, RTO | < 30s failover, < 1% erreurs |
| **Redis Cache Miss Storm** | Flush Redis + Simulate traffic | 10 min | DB load, Latency, Error rate | DB tient charge, Latence < 2x normal |
| **Edge Config Unavailable** | Block Edge Config API | 5 min | Fallback behavior, Feature flag defaults | Defaults safe, Pas de crash |
| **Third-party API Down** (Lulu/Payhip/GP/MailerLite) | Mock 500/Timeout | 10 min | Graceful degradation, Queue backup | Queue traite, User informé, Pas de perte |
| **DDoS Layer 7** | Load test (k6) 10x normal | 15 min | WAF block rate, Origin protection, Latency | WAF bloque 99%, Origin < 80% CPU |
| **Deployment Rollback** | Deploy bad version → Auto rollback | 5 min | Detection time, Rollback time, User impact | Detect < 2min, Rollback < 3min |

### Outils
- **k6** (Load/Chaos scripts) — GitHub Actions scheduled
- **Chaos Mesh / Litmus** (K8s — Phase 2)
- **Gremlin / Chaos Monkey** (SaaS — Optionnel)
- **Runbooks** : Chaque scénario = Runbook dans Notion + Alerte PagerDuty

---

## 6. Migration Strategy (Strangler Fig Pattern)

### Principes
1. **Pas de Big Bang** — Migrement incrémental par domaine/fonctionnalité
2. **Parité Fonctionnelle** — Nouvelle implémentation = Ancienne + Améliorations
3. **Observabilité d'Abord** — Instrumenter avant de migrer
4. **Rollback Immédiat** — Feature flag kill switch sur chaque nouveau composant
5. **Données Synchronisées** — CDC (Change Data Capture) ou Dual-write pendant transition

### Séquence Migration (18-24 mois)
| Vague | Domaine | Composants | Durée | Risque |
|-------|---------|------------|-------|--------|
| **0** | **Fondations** | Edge Config, DB, Auth, Observabilité, Feature Flags, CI/CD GitOps | 3 mois | Faible (Additif) |
| **1** | **Auth & User** | Inscription, Connexion, Profil, Préférences, Rôles, MFA | 2 mois | Moyen (Critique user) |
| **2** | **Contenu Dynamique** | Blog (SSR), Podcast pages, Transcriptions interactives, Recherche | 2 mois | Faible (Lecture mostly) |
| **3** | **Communauté** | Discord SSO, Forum (Discourse SSO), Profils unifiés, Gamification DB | 3 mois | Moyen (Intégrations) |
| **4** | **E-commerce** | Panier, Checkout, Webhooks, Achats, Historique, Factures, TVA | 3 mois | Élevé (Argent, Légal) |
| **5** | **Admin & Analytics** | Dashboard temps réel, BI, ML (Recommandations, Churn), A/B Platform | 2 mois | Faible (Interne) |
| **6** | **Multi-Région** | Déploiement EU/US/APAC, Geo-DNS, Data Residency, Compliance auto | 3 mois | Élevé (Infra, Légal) |

---

## 7. Checklist "Scale Ready" (À Valider Avant Phase 1)

| Catégorie | Critère | Statut | Preuve |
|-----------|---------|--------|--------|
| **Architecture** | Edge Config opérationnel (Flags, Config, Rate limit) | ☐ | Demo middleware lecture/écriture |
| **Architecture** | DB PostgreSQL provisionnée + Schéma migré + Seed | ☐ | `prisma migrate deploy` OK |
| **Architecture** | Auth Clerk/NextAuth intégrée + Webhooks DB sync | ☐ | Inscription → Connexion → Profil OK |
| **Architecture** | Feature Flags + A/B Platform (LaunchDarkly/GrowthBook) | ☐ | Flag toggle → UI change sans deploy |
| **Architecture** | Observabilité : Traces + Métriques + Logs + RUM + Synthetics | ☐ | Dashboard "Golden Signals" vert |
| **Code** | Pas de `console.log` prod — Structured logging (pino) | ☐ | Logs JSON dans Loki |
| **Code** | Resource attributes OTel sur tous services | ☐ | Traces corrélées cross-service |
| **Code** | Error boundaries + Fallback UI sur tous islands Astro | ☐ | Test erreur → UI gracieuse |
| **Sécurité** | CSP Enforcing (pas Report-Only) | ☐ | `Content-Security-Policy` header |
| **Sécurité** | Secrets rotation automatisée (1Password/Infisical/Vault) | ☐ | Rotation demo |
| **Sécurité** | Dependabot + CodeQL + SAST dans CI | ☐ | PR avec alerte sécurité bloquée |
| **Performance** | Lighthouse CI ≥ 90/95/90/90 (Perf/A11y/BP/SEO) | ☐ | CI badge vert |
| **Performance** | Bundle JS < 100KB gz, CSS < 50KB gz | ☐ | `npm run build` + `gzip-size` |
| **Performance** | Images optimisées (AVIF/WebP, @astrojs/image, Vercel Blob) | ☐ | Audit Lighthouse images |
| **Data** | Pipeline analytics events → DB → Data Lake opérationnel | ☐ | Event test visible dans Dashboard |
| **Data** | Backup DB automatisé (Point-in-time recovery < 5min) | ☐ | Restore test réussi |
| **Compliance** | RGPD : DPO, Registre, DPIA, Droits automatisés, CMP | ☐ | Audit externe passé |
| **Compliance** | Matrice conformité par pays (Top 10 audience) | ☐ | Document Notion à jour |
| **Équipe** | Onboarding dev < 1 jour (Script + Doc + Sandbox) | ☐ | Nouveau dev productif J1 |
| **Équipe** | On-call rotation définie + Escalation + Runbooks | ☐ | PagerDuty schedule actif |
| **Équipe** | ADR (Architecture Decision Records) pour 10+ décisions | ☐ | `docs/adr/` peuplé |

---

## 8. Budget Scale (Estimation Annuelle Phase 1 → Phase 2)

| Poste | Phase 1 (An 1) | Phase 2 (An 2) | Notes |
|-------|----------------|----------------|-------|
| **Infra (Vercel/Cloudflare/DB/Redis)** | 2,000-5,000€ | 15,000-50,000€ | Multi-région, Bande passante, Stockage |
| **Observabilité (Grafana Cloud/Datadog)** | 1,000-3,000€ | 10,000-30,000€ | Volume logs/traces/métriques |
| **Auth (Clerk/Auth0)** | 500-2,000€ | 5,000-15,000€ | MAU based |
| **Feature Flags (LaunchDarkly/GrowthBook)** | 500-2,000€ | 5,000-10,000€ | MAU + Flags |
| **Email (Sendgrid/Mailgun/Resend)** | 500-1,000€ | 3,000-10,000€ | Volume transactionnel + Marketing |
| **Video/CDN (Mux/Cloudflare Stream/R2)** | 1,000-3,000€ | 10,000-50,000€ | Stockage + Bande passante streaming |
| **AI/ML (OpenAI/Anthropic/HuggingFace/GCP)** | 2,000-5,000€ | 20,000-100,000€ | Volume tokens, Fine-tuning, GPU |
| **Compliance (DPO, Avocat, Audit, CMP)** | 5,000-15,000€ | 20,000-50,000€ | International |
| **Équipe (Salaires + Charges + Freelances)** | 150,000-300,000€ | 600,000-1,500,000€ | 5 → 25 personnes |
| **Outils (GitHub, Notion, Linear, Figma, Slack, etc.)** | 5,000-10,000€ | 20,000-50,000€ | Per seat |
| **Total Estimé** | **~170-350k€** | **~700k-1.8M€** | Hors imprévus (20%) |

---

*Skill créé le 2025-11-20. Scale Readiness = anticipation sans sur-ingénierie — Fondations solides, migration incrémentale, équipe outillée, conformité native, résilience testée.*