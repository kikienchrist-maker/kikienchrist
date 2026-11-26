#!/bin/bash
# ============================================
# Kiki en Christ - Script de configuration déploiement
# Usage: ./scripts/deploy-setup.sh [github_user] [repo_name]
# ============================================

set -e

GITHUB_USER=${1:-"VOTRE_USER_GITHUB"}
REPO_NAME=${2:-"kikienchrist"}
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "🚀 Kiki en Christ - Configuration déploiement"
echo "=============================================="
echo "Repo: ${REPO_URL}"
echo ""

# ------------------------------------------------------------------
# 1. Vérifications prérequis
# ------------------------------------------------------------------
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ $1 n'est pas installé. Installez-le d'abord."
    exit 1
  fi
  echo "✅ $1 trouvé"
}

echo "🔍 Vérification des outils..."
check_command git
check_command node
check_command pnpm
check_command gh  # GitHub CLI pour secrets

# ------------------------------------------------------------------
# 2. Push vers GitHub
# ------------------------------------------------------------------
echo ""
echo "📤 Push vers GitHub..."
if ! git remote get-url origin &> /dev/null; then
  echo "   Ajout remote origin..."
  git remote add origin "${REPO_URL}"
fi

echo "   Push main..."
git push -u origin main

# ------------------------------------------------------------------
# 3. Configuration secrets GitHub (nécessite gh auth login)
# ------------------------------------------------------------------
echo ""
echo "🔐 Configuration des secrets GitHub..."
echo "   ⚠️  Assurez-vous d'avoir fait: gh auth login"

read -p "   Continuer avec la configuration des secrets ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Vercel
  read -p "   VERCEL_TOKEN: " VERCEL_TOKEN
  read -p "   VERCEL_ORG_ID: " VERCEL_ORG_ID
  read -p "   VERCEL_PROJECT_ID: " VERCEL_PROJECT_ID
  gh secret set VERCEL_TOKEN --body "${VERCEL_TOKEN}" --repo "${GITHUB_USER}/${REPO_NAME}"
  gh secret set VERCEL_ORG_ID --body "${VERCEL_ORG_ID}" --repo "${GITHUB_USER}/${REPO_NAME}"
  gh secret set VERCEL_PROJECT_ID --body "${VERCEL_PROJECT_ID}" --repo "${GITHUB_USER}/${REPO_NAME}"
  
  # Netlify
  read -p "   NETLIFY_AUTH_TOKEN: " NETLIFY_AUTH_TOKEN
  read -p "   NETLIFY_SITE_ID: " NETLIFY_SITE_ID
  gh secret set NETLIFY_AUTH_TOKEN --body "${NETLIFY_AUTH_TOKEN}" --repo "${GITHUB_USER}/${REPO_NAME}"
  gh secret set NETLIFY_SITE_ID --body "${NETLIFY_SITE_ID}" --repo "${GITHUB_USER}/${REPO_NAME}"
  
  # Lighthouse CI
  read -p "   LHCI_GITHUB_APP_TOKEN (optionnel): " LHCI_TOKEN
  if [ ! -z "$LHCI_TOKEN" ]; then
    gh secret set LHCI_GITHUB_APP_TOKEN --body "${LHCI_TOKEN}" --repo "${GITHUB_USER}/${REPO_NAME}"
  fi
  
  # Codecov
  read -p "   CODECOV_TOKEN (optionnel): " CODECOV_TOKEN
  if [ ! -z "$CODECOV_TOKEN" ]; then
    gh secret set CODECOV_TOKEN --body "${CODECOV_TOKEN}" --repo "${GITHUB_USER}/${REPO_NAME}"
  fi
  
  echo "✅ Secrets GitHub configurés"
fi

# ------------------------------------------------------------------
# 4. Vercel Blob Migration
# ------------------------------------------------------------------
echo ""
echo "📦 Vercel Blob Migration..."
read -p "   Avez-vous créé le store Vercel Blob ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  read -p "   BLOB_READ_WRITE_TOKEN: " BLOB_TOKEN
  read -p "   VERCEL_BLOB_STORE_ID: " BLOB_STORE_ID
  read -p "   NEXT_PUBLIC_BLOB_URL (ex: https://votre-store.vercel-storage.com): " BLOB_URL
  
  export BLOB_READ_WRITE_TOKEN="${BLOB_TOKEN}"
  export VERCEL_BLOB_STORE_ID="${BLOB_STORE_ID}"
  export NEXT_PUBLIC_BLOB_URL="${BLOB_URL}"
  
  echo "   Lancement migration..."
  node scripts/migrate-to-blob.js
  
  echo "✅ Migration Vercel Blob terminée"
  echo "   N'oubliez pas de mettre à jour les URLs d'images dans le code !"
fi

# ------------------------------------------------------------------
# 5. Netlify Setup Instructions
# ------------------------------------------------------------------
echo ""
echo "🌐 Configuration Netlify (MANUEL - Interface web)"
echo "================================================"
echo "1. Allez sur: https://app.netlify.com/start"
echo "2. Connectez le repo GitHub: ${GITHUB_USER}/${REPO_NAME}"
echo "3. Build command: npm run build"
echo "4. Publish directory: dist"
echo "5. Deploy site"
echo ""
echo "6. Activer Netlify Identity:"
echo "   Site Settings → Identity → Enable Identity"
echo ""
echo "7. Activer Git Gateway:"
echo "   Identity → Services → Git Gateway → Enable"
echo ""
echo "8. Inviter utilisateurs:"
echo "   Identity → Invite users → votre email"
echo ""
echo "9. Tester Decap CMS:"
echo "   https://VOTRE-SITE.netlify.app/admin/"
echo ""

# ------------------------------------------------------------------
# 6. Vercel Deploy (optionnel si Netlify utilisé pour CMS)
# ------------------------------------------------------------------
echo "▲ Déploiement Vercel (pour production)"
echo "====================================="
echo "Si vous voulez aussi déployer sur Vercel:"
echo "1. vercel login"
echo "2. vercel --prod --force"
echo "Ou via GitHub Actions (déjà configuré avec les secrets)"
echo ""

# ------------------------------------------------------------------
# 7. Traductions blog restantes
# ------------------------------------------------------------------
echo "🌍 Traductions blog restantes"
echo "============================="
echo "Une fois le job actuel terminé (en/es/pt/de):"
echo "cd skills/content/blog-translation"
echo "node dist/cli.js --target-langs it,nl,pl,ar,ru,zh,hi --concurrency 1"
echo ""

# ------------------------------------------------------------------
# 8. i18n files à compléter
# ------------------------------------------------------------------
echo "📝 Fichiers i18n à compléter (nl, pl, ar, ru, zh, hi)"
echo "======================================================"
echo "Les fichiers existent comme placeholders dans src/data/i18n/"
echo "Utilisez le skill i18n-management ou traduisez manuellement"
echo ""

echo "✅ Configuration de base terminée !"
echo "📋 Prochaines étapes manuelles:"
echo "   1. Netlify: Connect repo + Identity + Git Gateway"
echo "   2. Tester /admin/ sur Netlify"
echo "   3. Vercel Blob: Migration images + mise à jour URLs"
echo "   4. Traductions blog: Lancer langues restantes"
echo "   5. i18n: Compléter 6 langues manquantes"