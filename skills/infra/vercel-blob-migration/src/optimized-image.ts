/**
 * Génération du composant OptimizedImage.astro pour Vercel Blob
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface OptimizedImageConfig {
  outputPath: string;
  blobBaseUrl?: string;
  defaultWidths?: number[];
  defaultQuality?: number;
  defaultFormat?: 'avif' | 'webp' | 'jpeg' | 'png';
}

const DEFAULT_WIDTHS = [400, 800, 1200, 1600, 2000];
const DEFAULT_QUALITY = 80;

export function generateOptimizedImageComponent(config: OptimizedImageConfig): string {
  const { blobBaseUrl, defaultWidths = DEFAULT_WIDTHS, defaultQuality = DEFAULT_QUALITY, defaultFormat = 'webp' } = config;
  
  return `---
// OptimizedImage.astro - Composant image optimisé pour Vercel Blob + Astro Assets
// Généré automatiquement par vercel-blob-migration skill
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  src: string | ImageMetadata;
  alt?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'avif' | 'webp' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  class?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'none';
  blurDataURL?: string;
  // Options Vercel Blob
  blobBaseUrl?: string;
}

const {
  src,
  alt = '',
  width,
  height,
  quality = ${defaultQuality},
  format = '${defaultFormat}',
  loading = 'lazy',
  decoding = 'async',
  class: className,
  sizes,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  blobBaseUrl = '${blobBaseUrl || ''}',
} = Astro.props;

const isExternal = typeof src === 'string' && (src.startsWith('http') || src.startsWith('//'));
const isBlobUrl = isExternal && blobBaseUrl && src.startsWith(blobBaseUrl);

// Déterminer les largeurs pour srcset
const srcWidths = width ? [width] : ${JSON.stringify(defaultWidths)};

// Pour images locales (Astro Assets)
let localImage: ImageMetadata | undefined;
if (typeof src !== 'string') {
  localImage = src;
}

// Pour images externes/Vercel Blob - on ne peut pas transformer, on passe tel quel
// Mais on génère srcset si on a des largeurs définies
function getSrcSet(baseUrl: string, widths: number[]): string {
  if (!isExternal) return '';
  // Vercel Blob ne supporte pas la transformation d'image à la volée
  // On retourne l'URL originale pour toutes les largeurs
  // En production, utiliser un CDN comme Cloudinary ou imgix pour la transformation
  return widths.map(w => \`\${baseUrl} \${w}w\`).join(', ');
}

function getSizesAttr(): string {
  if (sizes) return sizes;
  if (width) return \`\${width}px\`;
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

const finalSrc = isExternal ? src : (localImage ? (await getImage({ src: localImage, width: srcWidths[0], format, quality })).src : '');
const srcSet = isExternal ? getSrcSet(src, srcWidths) : (localImage ? (await getImage({ src: localImage, width: srcWidths[0], format, quality })).srcset : '');

const placeholderSrc = placeholder === 'blur' && blurDataURL ? blurDataURL : (placeholder === 'empty' ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : '');
---

<!-- OptimizedImage Component -->
<figure class:list={['bq-figure', className]} style="display: block; margin: 0;">
  {isExternal ? (
    <!-- Image externe / Vercel Blob -->
    <picture>
      {format !== 'jpeg' && format !== 'png' && (
        <source type="image/avif" srcSet={srcSet} sizes={getSizesAttr()} />
      )}
      {format !== 'avif' && format !== 'png' && (
        <source type="image/webp" srcSet={srcSet} sizes={getSizesAttr()} />
      )}
      <img
        src={finalSrc}
        srcSet={srcSet}
        sizes={getSizesAttr()}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        class="bq-img"
        style="display: block; max-width: 100%; height: auto;"
        {priority && 'fetchpriority="high"'}
      />
    </picture>
  ) : localImage ? (
    <!-- Image locale via Astro Assets -->
    <Image src={localImage} alt={alt} width={width} height={height} format={format} quality={quality} loading={loading} decoding={decoding} class="bq-img" />
  ) : (
    <!-- Fallback -->
    <div class="bq-placeholder" style="background: var(--bq-color-gray-200); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: var(--bq-color-gray-500);">
      Image non disponible
    </div>
  )}
  
  {alt && (
    <figcaption class="bq-figcaption" style="margin-top: var(--bq-space-2); font-size: var(--bq-text-sm); color: var(--bq-color-gray-600); text-align: center;">
      {alt}
    </figcaption>
  )}
</figure>

<style>
  .bq-img {
    border-radius: var(--bq-radius-md);
    transition: opacity 0.3s ease;
  }
  
  .bq-img[loading="lazy"] {
    opacity: 0;
  }
  
  .bq-img[loading="lazy"].loaded {
    opacity: 1;
  }
  
  .bq-figure {
    margin: 0;
  }
  
  .bq-figcaption {
    font-style: italic;
  }
  
  .bq-placeholder {
    border-radius: var(--bq-radius-md);
  }
</style>

<script>
  // Auto-mark loaded images
  document.querySelectorAll('.bq-img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });
</script>
`;
}

export function writeOptimizedImageComponent(config: OptimizedImageConfig): void {
  const { outputPath } = config;
  const dir = join(outputPath, '..');
  
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  const component = generateOptimizedImageComponent(config);
  writeFileSync(join(outputPath), component, 'utf-8');
}