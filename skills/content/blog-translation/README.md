# @kikienchrist/blog-translation

> Pipeline de traduction d'articles blog multilingues pour projets Astro/i18n.
> Supporte Ollama (local), LibreTranslate (gratuit), DeepL (premium) avec glossaire contextuel, validation et reprise sur échec.

## Fonctionnalités

- 🌍 **11 langues cibles** : FR, EN, ES, PT, IT, DE, NL, PL, AR, RU, ZH, HI
- 🤖 **3 providers** : Ollama (local GPU), LibreTranslate (gratuit), DeepL (premium)
- 📚 **Glossaire contextuel** : Noms propres, livres bibliques, termes théologiques, refs bibliques, UI
- 🔄 **Fallback automatique** : Ollama → LibreTranslate → DeepL si échec
- ⚡ **Parallélisation** : `p-limit` configurable (défaut: 2)
- 🔁 **Retry + reprise** : Tentatives configurables, reprise sur checkpoint
- ✅ **Validation post-traduction** : Intègre `markdown-sanitizer` pour corriger frontmatter
- 📊 **Métriques** : Succès/échec par provider, par langue, durée
- 🧪 **Dry-run** : Simulation sans écriture

## Installation

```bash
cd skills/content/blog-translation
npm install
npm run build
```

## Usage

### CLI

```bash
# Traduire tous les articles FR manquants vers 11 langues (Ollama qwen2.5:1.5b)
blog-translation

# Langues spécifiques
blog-translation --target-langs en,es,pt

# Provider différent
blog-translation --provider libretranslate
blog-translation --provider deepl  # nécessite DEEPL_API_KEY

# Modèle Ollama différent (qualité vs vitesse)
blog-translation --model qwen2.5:7b

# Dry-run (simulation)
blog-translation --dry-run

# Concurrence
blog-translation --concurrency 4
```

### API

```typescript
import { translateArticles, TranslationPipeline } from '@kikienchrist/blog-translation';

// Simple
const result = await translateArticles({
  targetLangs: ['en', 'es', 'pt'],
  provider: 'ollama',
  model: 'qwen2.5:1.5b',
  concurrency: 2,
});

// Avancé
const pipeline = new TranslationPipeline({
  defaultProvider: 'ollama',
  fallbackProviders: ['libretranslate'],
  ollama: { baseUrl: 'http://localhost:11434', defaultModel: 'qwen2.5:7b' },
  glossary: customGlossary,
  concurrency: 3,
  dryRun: false,
});

const result = await pipeline.run();
```

## Glossaire inclus

| Catégorie | Exemples |
|-----------|----------|
| **Noms propres** | Jésus, Dieu, Saint-Esprit, Marie, Paul, Moïse, David... |
| **Livres bibliques** | Genèse, Exode, Psaumes, Isaïe, Matthieu, Jean, Romains, Apocalypse... |
| **Termes théologiques** | salut, rédemption, justification, sanctification, grâce, foi, trinité, incarnation... |
| **Références bibliques** | Jean 3:16, Romains 8:28, Éphésiens 6:10-18, Psaume 23, Matthieu 6:9-13... |
| **UI/Navigation** | Accueil, Blog, Livres, Contact, S'abonner, Newsletter, Lire la suite... |

*Les termes du glossaire sont **préservés exactement** (non traduits) ou traduits selon mapping standardisé.*

## Architecture

```
src/
├── types.ts              # Types TypeScript complets
├── glossary.ts           # Glossaire contextuel (5 catégories, 200+ entrées)
├── markdown-extractor.ts # Extraction articles depuis src/content/blog
├── providers/
│   ├── ollama-provider.ts      # Ollama local (qwen2.5, llama, etc.)
│   ├── libretranslate-provider.ts  # LibreTranslate API
│   ├── deepl-provider.ts       # DeepL API (premium)
│   └── index.ts                # Factory
├── translation-pipeline.ts # Orchestration: extract → translate → validate → write
├── cli.ts                  # Interface ligne de commande
└── index.ts                # Exports publics
```

## Prérequis

### Ollama (recommandé)
```bash
# Installer Ollama
winget install Ollama.Ollama  # Windows
# ou
curl -fsSL https://ollama.com/install.sh | sh  # Linux/Mac

# Télécharger modèles
ollama pull qwen2.5:1.5b  # Rapide (986 MB)
ollama pull qwen2.5:7b    # Qualité (4.7 GB)
ollama pull llama3.1:8b   # Alternative

# Démarrer serveur
ollama serve
```

### LibreTranslate (gratuit, sans GPU)
```bash
# Utiliser instance publique: https://libretranslate.de
# Ou auto-héberger:
docker run -d -p 5000:5000 libretranslate/libretranslate
```

### DeepL (premium)
```bash
# Obtenir API key: https://www.deepl.com/pro-api
export DEEPL_API_KEY="votre-cle"
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `OLLAMA_BASE_URL` | URL serveur Ollama | `http://localhost:11434` |
| `LIBRETRANSLATE_URL` | URL LibreTranslate | `https://libretranslate.de` |
| `DEEPL_API_KEY` | Clé API DeepL | (requis pour DeepL) |
| `DEEPL_API_URL` | URL API DeepL | `https://api-free.deepl.com/v2` |

## Tests

```bash
npm test        # Tests unitaires
npm run lint    # ESLint
```

## Intégration CI/CD

```yaml
# .github/workflows/translate.yml
- name: Traduire articles blog
  run: |
    cd skills/content/blog-translation
    npm ci && npm run build
    node dist/cli.js --provider ollama --model qwen2.5:1.5b --concurrency 2
  env:
    OLLAMA_BASE_URL: http://ollama:11434
```

## Licence

MIT