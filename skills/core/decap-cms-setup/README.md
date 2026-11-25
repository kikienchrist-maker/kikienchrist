# Decap CMS Setup Skill

Configuration complète de Decap CMS (ex-Netlify CMS) pour Netlify Identity + Git Gateway avec collections pour blog, pages légales, traductions i18n, livres, auteurs, et configuration du site.

## Fonctionnalités

- 📝 **Collections complètes** : Blog, Legal, Translations (i18n), Books, Authors, SiteConfig
- 🔐 **Netlify Identity** : Configuration complète avec providers Google/GitHub, templates email
- 🌐 **Git Gateway** : Connexion au repo Git pour édition sans build
- 👁️ **Templates de prévisualisation** : Preview en temps réel dans l'admin
- 📋 **Workflow éditorial** : Draft → Review → Published (ou mode simple)
- ⚙️ **netlify.toml** : Config complète Identity + Git Gateway + redirects
- 🚀 **CLI unifiée** : Génération complète en une commande

## Installation

```bash
cd skills/core/decap-cms-setup
npm install
npm run build
```

## Usage CLI

```bash
# Génération complète (recommandé)
decap-setup full -o . --site-url https://kikienchrist.vercel.app --repo owner/repo

# Génération individuelle
decap-setup generate -o static/admin --site-url https://kikienchrist.vercel.app
decap-setup netlify -o . --site-url https://kikienchrist.vercel.app
decap-setup preview -o . --site-url https://kikienchrist.vercel.app

# Widget Identity
decap-setup identity-widget --site-url https://kikienchrist.vercel.app
```

## Fichiers générés par `decap-setup full`

```
├── static/admin/config.yml          # Config Decap CMS
├── netlify.toml                     # Config Netlify Identity + Git Gateway
├── _redirects                       # Redirections admin SPA
├── src/cms/preview-templates/       # Templates prévisualisation
│   └── index.ts
├── admin/index.html                 # Page admin Decap CMS
└── public/images/                   # Dossier médias (créer manuellement)
```

## Collections

| Collection | Dossier/Fichier | Description |
|------------|-----------------|-------------|
| `blog` | `src/content/blog/` | Articles blog multilingues (title, pageSlug, translationKey, author, date, lang, category, tags, coverImage, excerpt, body, readingTime, SEO) |
| `legal` | `src/content/legalPages/` | Pages légales (mentions-legales, confidentialite, cookies, cgv, accessibilite) |
| `translations` | `src/data/i18n/` | Fichiers JSON par langue pour Decap CMS (compatibles i18n-management) |
| `books` | `src/content/books/` | Livres (titre, auteur, description, couverture, prix, ISBN, liens Payhip/Amazon/Lulu) |
| `authors` | `src/content/authors/` | Auteurs (nom, bio, photo, réseaux sociaux) |
| `siteConfig` | `src/data/site-config.json` | Config globale (nom, description, email, langues, réseaux, FirstPromoter, GA) |

## Champs clés par collection

### Blog
- `title` (string, requis)
- `pageSlug` (string, slug unique)
- `translationKey` (string, lie les traductions)
- `author` (relation → authors)
- `date` (datetime)
- `lang` (select: 12 langues)
- `category` (select: catégories prédéfinies)
- `tags` (list)
- `coverImage` + `coverImageAlt` (image)
- `excerpt` (text, SEO)
- `body` (markdown)
- `readingTime` (number)
- `seoTitle`, `seoDescription`, `canonicalUrl` (SEO)
- `published`, `featured` (boolean)

### Legal
- `title`, `slug`, `translationKey`
- `lang` (12 langues)
- `pageType` (mentions-legales, confidentialite, cookies, cgv, accessibilite)
- `body` (markdown)
- `lastUpdated` (datetime)

### Translations (i18n)
- `lang` (hidden, code langue)
- `translations` (object avec 12 champs string par langue)

## Déploiement Netlify

1. **Connecter le repo** : Netlify > New site from Git > GitHub
2. **Build settings** :
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Activer Netlify Identity** : Site settings > Identity > Enable Identity
4. **Providers** : Settings > Identity > External providers > Add Google, GitHub
5. **Activer Git Gateway** : Settings > Identity > Git Gateway > Enable Git Gateway
6. **Inviter utilisateurs** : Identity > Invite users > Envoyer invitations
7. **Accéder à l'admin** : `https://votre-site.netlify.app/admin/`

## Configuration Astro

### MainLayout.astro - Ajouter Identity Widget
```astro
---
// Dans le <head>
---
<head>
  <!-- Netlify Identity Widget -->
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  <script>
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init({
        url: "https://kikienchrist.vercel.app/.netlify/identity",
        audience: "https://kikienchrist.vercel.app",
      });
    }
  </script>
</head>
```

### public/admin/index.html
Généré automatiquement par `decap-setup preview` ou `decap-setup full`.

## Workflow éditorial

Avec `publish_mode: editorial_workflow` (défaut) :
1. **Draft** : Brouillon, visible seulement par éditeurs
2. **In Review** : Prêt pour révision
3. **Ready** : Approuvé, en attente de publication
4. **Published** : En ligne sur le site

## Intégration i18n-management

Les fichiers `src/data/i18n/*.json` générés par la collection `translations` sont compatibles avec le skill `i18n-management` pour synchronisation bidirectionnelle avec `translations.json`.

## Tests

```bash
npm test
```

## API Programmable

```typescript
import { 
  generateDecapConfig, 
  writeDecapConfig,
  writeNetlifyConfig,
  writePreviewConfig,
  generateIdentityWidgetCode
} from '@kikienchrist/decap-cms-setup';

// Config complète
const config = generateDecapConfig({ outputDir: 'static/admin', siteUrl: '...' });
writeDecapConfig(config, 'static/admin');

// Netlify
writeNetlifyConfig({ outputDir: '.', siteUrl: '...' });

// Preview
writePreviewConfig({ outputDir: '.', siteUrl: '...', collections: ['blog', 'legal'] });

// Widget
const widgetCode = generateIdentityWidgetCode('https://...');
```