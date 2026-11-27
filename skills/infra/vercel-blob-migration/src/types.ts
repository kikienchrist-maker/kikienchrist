/**
 * Types pour Vercel Blob Migration
 */

export interface BlobMigrationConfig {
  token?: string;           // Token RW permanent (vercel_blob_rw_...) - optionnel si oidcToken fourni
  oidcToken?: string;       // OIDC token depuis `vercel link` (.env.local) - optionnel si token fourni
  storeId?: string;
  publicUrl?: string;
  dryRun?: boolean;
  concurrency?: number;
  prefix?: string;
}

export interface ImageMapping {
  originalUrl: string;
  blobUrl: string;
  localPath?: string;
  checksum?: string;
  width?: number;
  height?: number;
  size?: number;
  contentType?: string;
  uploadedAt: string;
}

export interface MigrationResult {
  success: boolean;
  mappings: ImageMapping[];
  errors: MigrationError[];
  stats: MigrationStats;
}

export interface MigrationError {
  originalUrl: string;
  error: string;
  code?: string;
}

export interface MigrationStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  totalSize: number;
  duration: number;
}

export interface FrontmatterUpdate {
  filePath: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'avif' | 'webp' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'none';
  blurDataURL?: string;
}

export interface IMGBBMappingEntry {
  localPath: string;
  imgbbUrl: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface MigrationPlan {
  source: 'local' | 'imgbb' | 'mixed';
  mappings: IMGBBMappingEntry[];
  targetPrefix: string;
  dryRun: boolean;
}

export interface OptimizedImageConfig {
  outputPath: string;
  blobBaseUrl?: string;
  defaultWidths?: number[];
  defaultQuality?: number;
  defaultFormat?: 'avif' | 'webp' | 'jpeg' | 'png';
}