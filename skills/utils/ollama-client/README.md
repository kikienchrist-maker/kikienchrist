# Ollama Client Skill

Client Ollama standardisé TypeScript/Node.js avec support complet pour :
- **Génération** simple et streaming
- **Chat** multi-tours avec historique
- **Batch processing** avec concurrence contrôlée
- **Traduction** spécialisée (glossaire, contexte, terminologie chrétienne)
- **Embeddings** pour RAG/recherche sémantique
- **Gestion modèles** (list, pull, delete)
- **Retry automatique** avec backoff
- **Health check**

## Installation

```bash
cd skills/utils/ollama-client
npm install
npm run build
```

## Usage CLI

```bash
# Génération simple
ollama-cli generate "Explique la Trinité" -m qwen2.5:1.5b --temperature 0.3

# Streaming
ollama-cli generate "Histoire de la Bible" --stream

# Chat interactif
ollama-cli chat -s "Tu es un théologien"

# Batch processing
ollama-cli batch prompts.json -c 3 -o results.json

# Traduction avec glossaire
ollama-cli translate "Dieu est amour" -s fr -t en --glossary glossary.json

# Lister modèles
ollama-cli models

# Télécharger modèle
ollama-cli pull qwen2.5:3b

# Health check
ollama-cli health

# Voir presets
ollama-cli presets
```

## Usage Programmatique

```typescript
import { createClient, OllamaClient } from '@kikienchrist/ollama-client';

// Client simple
const client = createClient({ baseUrl: 'http://localhost:11434' });

// Génération
const response = await client.generate({
  model: 'qwen2.5:1.5b',
  prompt: 'Explique Jean 3:16',
  options: { temperature: 0.1, numPredict: 1024 },
});

// Streaming
for await (const chunk of client.generateStream({ model: 'qwen2.5:1.5b', prompt: 'Histoire...' })) {
  process.stdout.write(chunk.response);
}

// Chat
const chatResponse = await client.chat({
  model: 'qwen2.5:1.5b',
  messages: [
    { role: 'system', content: 'Tu es un pasteur' },
    { role: 'user', content: 'Qu\'est-ce que la grâce?' },
  ],
});

// Batch avec progression
const batchResult = await client.batchGenerate({
  requests: prompts.map(p => ({ model: 'qwen2.5:1.5b', prompt: p })),
  concurrency: 3,
  onProgress: (done, total) => console.log(`${done}/${total}`),
});

// Traduction spécialisée
const translation = await client.translate({
  text: 'Jésus-Christ est Seigneur',
  sourceLang: 'fr',
  targetLang: 'ar',
  context: 'Verset biblique Philippiens 2:11',
  glossary: { 'Seigneur': 'رب', 'Jésus-Christ': 'يسوع المسيح' },
});

// Embeddings
const embeddings = await client.embeddings({
  model: 'nomic-embed-text',
  prompt: 'Document à indexer',
});

// Gestion modèles
const models = await client.listModels();
await client.pullModel('qwen2.5:3b');
await client.deleteModel('old-model');
```

## Configuration

```typescript
interface OllamaConfig {
  baseUrl: string;        // défaut: http://localhost:11434
  timeout: number;        // défaut: 120000ms (2min)
  maxRetries: number;     // défaut: 3
  retryDelay: number;     // défaut: 1000ms
  defaultModel: string;   // défaut: qwen2.5:1.5b
}
```

## Modèles Recommandés (Presets)

| Modèle | Taille | Vitesse | Qualité | Usage |
|--------|--------|---------|---------|-------|
| `qwen2.5:1.5b` | 986 MB | Rapide | Bonne | Traduction, tâches légères |
| `qwen2.5:3b` | 1.9 GB | Moyenne | Meilleure | Traduction complexe, chat |
| `qwen2.5:7b` | 4.7 GB | Lente | Meilleure | Analyse théologique |
| `llama3.2:1b` | 1.3 GB | Rapide | Bonne | Génération rapide |
| `llama3.2:3b` | 2.0 GB | Moyenne | Meilleure | Usage général |
| `mistral:7b` | 4.1 GB | Lente | Meilleure | Raisonnement complexe |
| `gemma2:2b` | 1.6 GB | Rapide | Bonne | Multilingue |
| `gemma2:9b` | 5.4 GB | Lente | Meilleure | Multilingue complexe |

## Traduction Spécialisée

Le client inclut un système de traduction optimisé pour contenus chrétiens :

- **Glossaire obligatoire** : Termes théologiques (Dieu, Jésus, Saint-Esprit, Salut, Grâce, Foi, Église, Prière, Bénédiction)
- **Contexte** : Support pour versets, références, type de contenu
- **Préservation** : HTML/Markdown, frontmatter YAML, balises intactes
- **Terminologie** : Standards par langue (Allah pour arabe contexte musulman, 神 pour chinois, etc.)

```typescript
const result = await client.translate({
  text: 'Dieu nous aime',
  sourceLang: 'fr',
  targetLang: 'es',
  context: 'Article blog - 1 Jean 4:8',
  glossary: { 'Dieu': 'Dios', 'aime': 'ama' },
});
```

## Tests

```bash
npm test
```

## Architecture

```
src/
├── types.ts      # Interfaces TypeScript complètes
├── config.ts     # Config défaut, presets, prompts système
├── client.ts     # Client principal (OllamaClient class)
├── cli.ts        # CLI Commander.js
├── index.ts      # Exports publics
├── client.test.ts
└── config.test.ts
```