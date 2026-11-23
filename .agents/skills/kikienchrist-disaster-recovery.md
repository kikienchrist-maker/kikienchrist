---
name: kikienchrist-disaster-recovery
description: "Reprise d'Activité & Backup (Stratégie 3-2-1, RTO/RPO, Scénarios Catastrophe, Procédures Restore, Tests DR, Runbooks, Assurance)"
version: "1.0"
---

# Skill: kikienchrist-disaster-recovery

## Objectif
Garantir la **continuité d'activité** face à tout incident majeur — Perte de données, panne plateforme, cyberattaque, erreur humaine — avec **RTO < 1h** et **RPO < 24h**.

---

## 1. Métriques Cibles (SLA Internes)

| Métrique | Cible | Mesure | Criticité |
|----------|-------|--------|-----------|
| **RTO** (Recovery Time Objective) | **< 1 heure** | Temps max pour restaurer site fonctionnel | P0 — Site down |
| **RPO** (Recovery Point Objective) | **< 24 heures** | Perte max de données acceptée (contenu, config) | P0 — Données |
| **RTO Partiel** (Déploiement seulement) | **< 15 min** | Rollback Vercel / Git revert | P1 — Régression code |
| **RPO Code** | **0** (Git) | Aucune perte code (Git history) | P0 — Code |
| **RPO Contenu** | **< 1 heure** | `translations.json` + skills + config | P0 — Contenu |
| **Disponibilité Cible** | **99.9%** | UptimeRobot (5 min checks) | Continu |

---

## 2. Stratégie Backup 3-2-1 (Appliquée)

| Copie | Support | Localisation | Fréquence | Rétention | Contenu |
|-------|---------|--------------|-----------|-----------|---------|
| **1. Principale (Production)** | Git (GitHub) | Cloud (GitHub) | À chaque commit | Illimitée | Code, `translations.json`, skills, config, docs |
| **2. Secondaire (Build Artifacts)** | Vercel | Cloud (Vercel) | À chaque deploy | 30j (Free) / 1an (Pro) | Site statique généré (`dist/`), logs, env vars |
| **3. Tertiaire (Local/Offline)** | Disque local + Cloud perso | Physique (Votre machine) + Cloud (Google Drive/Dropbox) | Hebdo + Avant maj majeure | Illimitée | `translations.json`, skills, config, images locales, exports CSV ventes, registres légaux |
| **4. Quaternaire (Base Données Externes)** | Plateformes | Cloud (Lulu, Payhip, GP, MailerLite, FirstPromoter) | Continu (leurs backups) | Selon leurs SLA | Données ventes, abonnés, affiliés, commissions |

> **Règle** : Aucune donnée critique n'existe en un seul exemplaire sur un seul cloud.

---

## 3. Inventaire Actifs Critiques (À Sauvegarder)

| Actif | Source | Fréquence Backup | Méthode | Priorité |
|-------|--------|------------------|---------|----------|
| **Code Source** | GitHub (repo) | Continu (push) | Git | P0 |
| **translations.json** | `src/data/translations.json` | Continu (Git) + Hebdo (local) | Git + `backup.sh` | P0 |
| **Skills (Base Connaissance)** | `.agents/skills/*.md` | Continu (Git) + Hebdo (local) | Git + `backup.sh` | P0 |
| **Config Technique** | `astro.config.mjs`, `vercel.json`, `package.json`, `tsconfig.json`, `middleware.ts` | Continu (Git) | Git | P0 |
| **Variables Environnement** | Vercel/Netlify Dashboard | Avant chaque changement | Export manuel (CSV/JSON) + `backup.sh` | P0 |
| **Images Hero Fan** | URLs ImgBB (externes) | Hebdo | `backup.sh` (download + metadata) | P1 |
| **Images Locales** | `public/images/` | Continu (Git) + Hebdo | Git + `backup.sh` | P1 |
| **Contenu Blog** | `src/content/blog/` | Continu (Git) | Git | P0 |
| **CMS Data** (Decap) | `src/data/translations/`, `src/data/books/`, `src/data/hero-fan/` | Continu (Git) | Git | P0 |
| **Registres Légaux** | `legal/register-traitements.csv`, politiques | Hebdo + Maj | `backup.sh` + Git | P0 |
| **Exports Ventes** | Lulu/Payhip/GP Dashboards | Mensuel (5 du mois) | Téléchargement CSV manuel + `backup.sh` | P0 |
| **Exports Abonnés** | MailerLite Dashboard | Mensuel | Export CSV + `backup.sh` | P1 |
| **Exports Affiliés** | FirstPromoter Dashboard | Mensuel | Export CSV + `backup.sh` | P1 |
| **Analytics/Config** | GA4, Clarity, Sentry, UptimeRobot, Checkly | Trimestriel | Export config (JSON) + `backup.sh` | P2 |

---

## 4. Script Backup Automatisé (`scripts/backup.sh`)

```bash
#!/bin/bash
# backup.sh — Exécuter : Hebdo (cron) + Avant toute maj majeure + Post-incident
# Prérequis : gh CLI auth, gcloud/aws cli si cloud storage, jq

set -euo pipefail

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_ROOT="backups/$DATE"
BACKUP_LOCAL="$HOME/kikienchrist-backups/$DATE"  # Local machine
BACKUP_DRIVE="gdrive:KikiEnChrist/backups/$DATE"  # Google Drive (rclone)
# BACKUP_S3="s3://kikienchrist-backups/$DATE"     # AWS S3 (optionnel)

mkdir -p "$BACKUP_LOCAL"

echo "📦 Backup started: $DATE"

# 1. Git Repository (Code + Translations + Skills + Config + Blog)
echo "  → Git repo..."
cd "$(git rev-parse --show-toplevel)"
git bundle create "$BACKUP_LOCAL/repo.bundle" --all
# Alternative: git clone --mirror pour bare repo complet

# 2. Translations.json (copie rapide accessible)
echo "  → translations.json..."
cp src/data/translations.json "$BACKUP_LOCAL/translations.json"

# 3. Skills
echo "  → Skills..."
cp -r .agents/skills "$BACKUP_LOCAL/skills"

# 4. Config files
echo "  → Config..."
cp astro.config.mjs vercel.json package.json tsconfig.json middleware.ts "$BACKUP_LOCAL/" 2>/dev/null || true

# 5. Legal registers
echo "  → Legal..."
mkdir -p "$BACKUP_LOCAL/legal"
cp -r legal/* "$BACKUP_LOCAL/legal/" 2>/dev/null || true

# 6. Blog content
echo "  → Blog..."
cp -r src/content/blog "$BACKUP_LOCAL/blog" 2>/dev/null || true

# 7. Environment variables (Vercel/Netlify) — Export manuel requis avant
echo "  → Env vars (check manual export)..."
if [ -f "backups/env-vars-latest.json" ]; then
  cp "backups/env-vars-latest.json" "$BACKUP_LOCAL/env-vars.json"
fi

# 8. Sales exports (derniers CSV présents)
echo "  → Sales exports..."
mkdir -p "$BACKUP_LOCAL/sales"
cp -r backups/sales/*.csv "$BACKUP_LOCAL/sales/" 2>/dev/null || true

# 9. Subscriber exports
echo "  → Subscribers..."
mkdir -p "$BACKUP_LOCAL/subscribers"
cp -r backups/subscribers/*.csv "$BACKUP_LOCAL/subscribers/" 2>/dev/null || true

# 10. Compress & Verify
echo "  → Compressing..."
cd "$HOME/kikienchrist-backups"
tar -czf "$DATE.tar.gz" "$DATE"
echo "  ✅ Backup created: $DATE.tar.gz ($(du -h "$DATE.tar.gz" | cut -f1))"

# 11. Upload to Cloud (Google Drive via rclone)
echo "  → Uploading to Google Drive..."
rclone copy "$DATE.tar.gz" "$BACKUP_DRIVE" --progress
# rclone copy "$DATE.tar.gz" "$BACKUP_S3" --progress  # Optionnel S3

# 12. Cleanup Local (garder 4 dernières semaines)
echo "  → Cleanup old local backups..."
find "$HOME/kikienchrist-backups" -name "*.tar.gz" -mtime +28 -delete

# 13. Notification
echo "🎉 Backup completed: $DATE"
# curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"✅ Backup Kiki en Christ: $DATE.tar.gz uploaded\"}" $SLACK_WEBHOOK_URL
```

### Installation & Automatisation
```bash
# 1. Rendre exécutable
chmod +x scripts/backup.sh

# 2. Test manuel
./scripts/backup.sh

# 3. Cron hebdo (Dimanche 3h locale)
# crontab -e
0 3 * * 0 /chemin/vers/site/scripts/backup.sh >> /chemin/vers/site/backups/backup.log 2>&1

# 4. Google Drive sync (rclone)
# rclone config → "gdrive" → Google Drive
# Dossier "KikiEnChrist/backups" créé
```

---

## 5. Scénarios Catastrophe & Procédures Restore

### Scénario 1 : Perte `translations.json` (Corruption / Suppression Accidentelle)
**Détection** : Build fail / Contenu manquant / Diff Git
**RTO Cible** : **< 15 min**
**Procédure** :
```bash
# 1. Identifier dernier commit sain
git log --oneline -20 -- src/data/translations.json

# 2. Restaurer localement
git checkout <good-commit> -- src/data/translations.json

# 3. Valider
npm run validate:translations

# 4. Rebuild + Deploy force
npm run build && vercel --prod --force

# 5. Si Git indisponible → Récupérer depuis Vercel Build Artifact
#    Vercel Dashboard → Deployments → Dernier succès → Download → Extraire translations.json
```

### Scénario 2 : Site Down Complet (Vercel Panne / DNS / Attaque DDoS)
**Détection** : UptimeRobot ALERT (5xx / Timeout / DNS fail)
**RTO Cible** : **< 1 heure** (dépend Vercel / DNS)
**Procédure** :
```
1. Vérifier status.vercel.com + Twitter @vercelstatus
2. Si Vercel down → Attendre résolution (pas d'alternative instantanée)
   - Message maintenance sur réseaux : "Maintenance technique, revenez dans 1h"
   - Si domaine custom → Basculer DNS vers page statique Netlify/GitHub Pages (préparé)
3. Si DNS piraté → Registrar (Gandi/Cloudflare) → Verrouiller domaine + Restaurer records
4. Si attaque DDoS → Vercel WAF auto + Cloudflare (si configuré) → "Under Attack Mode"
5. Post-incident : Post-mortem + Mise à jour runbook
```

### Scénario 3 : Régression Majeure Post-Deploy (Code / Config / Middleware)
**Détection** : Smoke tests fail / Sentry errors spike / UptimeRobot down / User reports
**RTO Cible** : **< 15 min**
**Procédure** :
```bash
# 1. Rollback Vercel (le plus rapide)
#    Vercel Dashboard → Deployments → Précédent vert (green) → "Promote to Production"

# 2. OU Git Revert (si Vercel indisponible)
git log --oneline -5
git revert <bad-merge-commit> --no-edit
git push origin main
# GitHub Actions redéploie auto le commit précédent stable

# 3. Valider smoke tests sur prod restaurée
./scripts/smoke-test.sh
```

### Scénario 4 : Perte Compte Vercel / GitHub / Domaine (Piratage / Suspension)
**Détection** : Impossible d'accéder / Email alerte sécurité
**RTO Cible** : **< 4 heures** (dépend support plateforme)
**Procédure** :
```
1. Contacter support URGENT (Vercel/GitHub/Registrar) — Ticket P0 + Téléphone si dispo
2. Preuves propriété : Factures, emails, 2FA, domaine registrar
3. Parallèle : Préparer migration d'urgence
   - Code : Git local (bundle) → Nouveau repo GitHub/GitLab
   - Deploy : Netlify / Cloudflare Pages / AWS Amplify (config pré-existante)
   - Domaine : DNS vers nouveau provider
   - Env vars : Réinjecter depuis backup local/env-vars.json
4. Communications : Slack #alerts + Email équipe + Réseaux (message transparent)
```

### Scénario 5 : Corruption Données Plateformes Externes (Lulu / Payhip / GP / MailerLite)
**Détection** : Rapports incohérents / API errors / Support alerte
**RTO Cible** : **< 24 heures** (dépend plateforme)
**Procédure** :
```
1. Identifier étendue (1 compte / toutes données / récentes seulement)
2. Contacter support plateforme — Demander restore depuis leur backup
3. Utiliser exports locaux CSV (backup.sh mensuel) pour réconciliation
4. Si MailerLite : Réimporter abonnés depuis CSV + Tags (script d'import)
5. Si FirstPromoter : Réimporter affiliés + Commissions depuis CSV
6. Documenter + Améliorer fréquence exports
```

### Scénario 6 : Erreur Humaine Critique (Suppression branche main / Force push / Variables env effacées)
**Détection** : Immédiate (GitHub alert) / Build fail / Site down
**RTO Cible** : **< 30 min**
**Procédure** :
```
1. GitHub : "Restore branch" dans Settings → Branches (si suppression)
2. Force push : `git push --force-with-lease origin <good-commit>:main` (si historique local intact)
3. Variables env : Réinjecter depuis backup local/env-vars.json → Vercel/Netlify Dashboard
4. Redeploy : `vercel --prod --force`
5. Post-mortem : Protection branches (Required reviews, Signed commits, No force push)
```

---

## 6. Tests de Reprise (DR Drills) — Trimestriels

| Test | Fréquence | Scénario | Durée | Critères Succès |
|------|-----------|----------|-------|-----------------|
| **Restore translations.json** | Trimestriel | Scénario 1 | < 15 min | Build vert + Contenu exact |
| **Rollback Vercel** | Trimestriel | Scénario 3 | < 10 min | Site up + Smoke tests OK |
| **Full Rebuild from Git Bundle** | Semestriel | Scénario 4 (partiel) | < 1 heure | Nouveau repo → Deploy → Site fonctionnel |
| **Env Vars Restore** | Trimestriel | Scénario 6 | < 15 min | Toutes vars présentes + Build OK |
| **Sales Data Reconciliation** | Mensuel (auto) | Scénario 5 | < 1 heure | CSV local = Dashboard plateforme ± 1% |

### Template Test DR (Notion)
```markdown
# DR Test — [Date] — [Scénario]

## Objectif
Valider procédure : [Nom scénario] — RTO cible : [X min/h]

## Préparation
- [ ] Backup récent disponible (local + cloud)
- [ ] Environnement test isolé (branche `dr-test` / repo séparé)
- [ ] Chronomètre prêt

## Exécution
| Étape | Action | Temps Réel | Résultat | Notes |
|-------|--------|------------|----------|-------|
| 1 | [Action] | X min | ✅/❌ | |
| 2 | [Action] | X min | ✅/❌ | |
| ... | ... | ... | ... | |

## Résultats
- **RTO Réel** : X min (Cible : Y min) → ✅/❌
- **RPO Réel** : Z heures (Cible : < 24h) → ✅/❌
- **Données Intègres** : ✅/❌ (Validation checksum / contenu)
- **Blockers** : [Liste]

## Actions Correctives
- [ ] [Action] — [Owner] — [Deadline]

## Prochain Test
[Date + 3 mois]
```

---

## 7. Assurance & Risques Résiduels

| Risque | Probabilité | Impact | Mitigation | Risque Résiduel |
|--------|-------------|--------|------------|-----------------|
| **Vercel Down > 4h** | Faible | Critique | Page statique Netlify prête + DNS failover manuel | Perte ventes pendant downtime |
| **GitHub Down / Perte Repo** | Très Faible | Critique | Git local bundle + Mirror GitLab (push mirror auto) | Perte < 1h commits |
| **Attaque Ransomware (Local)** | Faible | Élevé | Backup offline (disque dur déconnecté) + Cloud versionné | Perte travail non commité |
| **Piratage Compte Admin** | Moyenne | Critique | 2FA obligatoire + Passkeys + Gestionnaire mots de passe + Alertes connexion | Temps récupération compte |
| **Perte Domaine (Expiration / Hijack)** | Faible | Critique | Renouvellement auto + Registrar Lock + 2FA registrar | Downtime DNS propagation |
| **Erreur Humaine Major** | Moyenne | Élevé | Branch protection + Code review obligatoire + DR drills | RTO 15-30 min |
| **Panne Plateforme Paiement (Lulu/Payhip/GP)** | Faible | Moyen | Diversification (3 plateformes) + Communication client | Perte ventes temporaire |

### Assurance Cyber (Optionnelle)
- **Hiscox / Axa / Allianz** : Cyber risque (vol données, interruption activité, extorsion)
- **Couverture** : 100k-500k€ — Prime ~300-800€/an (micro-entreprise)
- **Inclus** : Assistance juridique, notification CNIL, relations presse, restauration systèmes

---

## 8. Checklist DR (Mensuelle)

| Vérification | Fréquence | Responsable | Preuve |
|--------------|-----------|-------------|--------|
| Backup `backup.sh` exécuté + Upload Drive OK | Hebdo (auto) | Vous | Log `backups/backup.log` + Fichier Drive |
| Backup local `repo.bundle` + `translations.json` intègres | Hebdo | Vous | `tar -tzf backup.tar.gz` |
| Exports ventes/abonnés/affiliés mensuels présents | Mensuel (5 du mois) | Vous | Dossier `backups/sales/`, `subscribers/`, `affiliates/` |
| Variables env exportées (`env-vars-latest.json`) | À chaque changement | Vous | Fichier présent + checksum |
| GitHub Branch Protection active (main) | Continu | Vous | Settings → Branches → main protected |
| Vercel 2FA + Team 2FA obligatoire | Continu | Vous | Settings → Security |
| Registrar Domain Lock + 2FA | Continu | Vous | Registrar Dashboard |
| DR Drill trimestriel effectué + Documenté | Trimestriel | Vous | Notion DR Test page |
| Runbooks à jour (dernière MAJ < 90j) | Trimestriel | Vous | Notion Runbooks page |

---

*Skill créé le 2025-11-20. Disaster Recovery = assurance vie du projet — RTO < 1h, RPO < 24h, tests réels.*