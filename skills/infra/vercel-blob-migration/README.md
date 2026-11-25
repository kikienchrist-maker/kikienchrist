# Vercel Blob Migration Skill

Migration complète des images vers Vercel Blob avec mise à jour automatique du frontmatter et génération du composant `OptimizedImage.astro`.

## Fonctionnalités

- 📤 **Upload IMGBB → Vercel Blob** : Mapping JSON `localPath → imgbbUrl` vers Blob
- 📁 **Upload local → Vercel Blob** : Scan dossier images (glob pattern)
- 📝 **Mise à jour frontmatter** : Remplace URLs dans `coverImage`, `avatar`, `logo`, `ogImage`, etc.
- 🖼️ **OptimizedImage.astro** : Composant Astro natif `astro:assets` + fallback Vercel Blob
- 📊 **Rapports** : Mapping JSON, stats, erreurs
- ⚡ **Concurrence configurable** : Uploads parallèles
- 🧪 **Dry-run** : Simulation sans upload réel

## Installation

```bash
cd skills/infra/vercel-blob-migration
npm install
npm run build
```

## Configuration Vercel

1. **Créer un Blob Store** : Vercel Dashboard > Storage > Create Blob Store
2. **Variables d'environnement** :
   - `BLOB_READ_WRITE_TOKEN` : Token lecture/écriture (Settings > Blob > Tokens)
   - `NEXT_PUBLIC_BLOB_URL` : URL publique (optionnel, pour CDN custom)

## Usage CLI

```bash
# Migration IMGBB (avec mapping JSON)
blob-migrate imgbb -m imgbb-mapping.json -t $BLOB_READ_WRITE_TOKEN --update-frontmatter src/content

# Migration images locales
blob-migrate local -s public/images -t $BLOB_READ_WRITE_TOKEN

# Migration complète (IMGBB + local + frontmatter + OptimizedImage)
blob-migrate full -m imgbb-mapping.json -s public/images -c src/content -t $BLOB_READ_WRITE_TOKEN

# Mise à jour frontmatter seule (avec rapport existant)
blob-migrate frontmatter -m blob-mapping-report.json -d src/content

# Générer OptimizedImage.astro
blob-migrate optimized-image -o src/components/OptimizedImage.astro --blob-url https://your-blob.vercel-storage.com
```

## Format Mapping IMGBB

```json
[
  { "localPath": "src/content/blog/post1/cover.jpg", "imgbbUrl": "https://ibb.co/abc123", "alt": "Cover" },
  { "localPath": "src/content/blog/post2/cover.jpg", "imgbbUrl": "https://ibb.co/def456" }
]
```

## Fichiers générés

```
blob-mapping-report.json     # Rapport complet (mappings, erreurs, frontmatter updates)
src/components/OptimizedImage.astro  # Composant image optimisé
```

## OptimizedImage.astro

Composant qui gère :
- **Images locales** : Via `astro:assets` (transformation build-time)
- **Images Vercel Blob** : Passthrough avec srcset (largeurs définies)
- **Formats** : AVIF, WebP, JPEG, PNG
- **Lazy loading** : Natif + blur placeholder optionnel
- **Classes `.bq`** : Compatible lafoidieu design system

```astro
---
import OptimizedImage from '@/components/OptimizedImage.astro';
---

<OptimizedImage 
  src="https://your-blob.vercel-storage.com/images/cover.jpg" 
  alt="Couverture livre"
  width={800}
  height={600}
  quality={80}
  format="webp"
  loading="lazy"
  class="bq-book-cover"
/>
```

## Intégration existante

Le composant `OptimizedImage.astro` existant dans `src/components/` sera remplacé/étendu. Il utilise déjà `astro:assets` pour les imports locaux.

## Variables d'environnement requises

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
NEXT_PUBLIC_BLOB_URL=https://your-store.vercel-storage.com  # Optionnel
```

## Tests

```bash
npm test
```

## API Programmable

```typescript
import { 
  ImageMigrator, 
  updateFrontmatterImages, 
  writeOptimizedImageComponent 
} from '@kikienchrist/vercel-blob-migration';

const migrator = new ImageMigrator({ token: process.env.BLOB_READ_WRITE_TOKEN! });
const result = await migrator.migrateFromIMGBB(mappings);

// Mise à jour frontmatter
updateFrontmatterImages('src/content', result.mappings);

// Génération composant
writeOptimizedImageComponent({ 
  outputPath: 'src/components/OptimizedImage.astro',
  blobBaseUrl: 'https://your-blob.vercel-storage.com'
});
```