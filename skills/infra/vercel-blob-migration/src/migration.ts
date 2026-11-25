/**
 * Logique de migration images vers Vercel Blob
 */
import { createBlobClient, VercelBlobClient } from './blob-client.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, dirname, extname, basename, relative } from 'path';
import { glob } from 'glob';
import type { 
  BlobMigrationConfig, 
  ImageMapping, 
  MigrationResult, 
  MigrationError, 
  MigrationStats,
  IMGBBMappingEntry,
  FrontmatterUpdate 
} from './types.js';
import { load, dump } from 'js-yaml';

const parse = (str: string) => load(str);
const stringify = (obj: any) => dump(obj, { lineWidth: -1, noRefs: true });

export class ImageMigrator {
  private client: VercelBlobClient;
  private config: BlobMigrationConfig;
  private mappings: Map<string, ImageMapping> = new Map();
  private errors: MigrationError[] = [];
  private frontmatterUpdates: FrontmatterUpdate[] = [];

  constructor(config: BlobMigrationConfig) {
    this.config = config;
    this.client = createBlobClient(config);
  }

  async migrateFromIMGBB(mappings: IMGBBMappingEntry[]): Promise<MigrationResult> {
    const startTime = Date.now();
    const stats: MigrationStats = {
      total: mappings.length,
      uploaded: 0,
      skipped: 0,
      failed: 0,
      totalSize: 0,
      duration: 0,
    };

    const concurrency = this.config.concurrency || 3;
    
    for (let i = 0; i < mappings.length; i += concurrency) {
      const batch = mappings.slice(i, i + concurrency);
      await Promise.all(batch.map(m => this.migrateSingle(m, stats)));
    }

    stats.duration = Date.now() - startTime;

    return {
      success: this.errors.length === 0,
      mappings: Array.from(this.mappings.values()),
      errors: this.errors,
      stats,
    };
  }

  private async migrateSingle(mapping: IMGBBMappingEntry, stats: MigrationStats): Promise<void> {
    const { localPath, imgbbUrl, alt } = mapping;
    
    try {
      // Générer le pathname cible
      const ext = extname(localPath) || '.jpg';
      const baseName = basename(localPath, ext);
      const targetPathname = `${baseName}${ext}`;
      
      // Vérifier si déjà uploadé
      if (this.mappings.has(imgbbUrl)) {
        stats.skipped++;
        return;
      }

      if (!this.config.dryRun) {
        const result = await this.client.uploadFromUrl(imgbbUrl, targetPathname);
        this.mappings.set(imgbbUrl, { ...result, originalUrl: imgbbUrl });
        stats.uploaded++;
        stats.totalSize += result.size || 0;
      } else {
        // Dry run - simuler
        const simulatedMapping: ImageMapping = {
          originalUrl: imgbbUrl,
          blobUrl: this.client.getPublicUrl(targetPathname),
          uploadedAt: new Date().toISOString(),
        };
        this.mappings.set(imgbbUrl, simulatedMapping);
        stats.uploaded++;
      }

      // Enregistrer mise à jour frontmatter si localPath fourni
      if (localPath) {
        this.frontmatterUpdates.push({
          filePath: localPath,
          field: 'coverImage',
          oldValue: imgbbUrl,
          newValue: this.mappings.get(imgbbUrl)!.blobUrl,
        });
      }
    } catch (error) {
      stats.failed++;
      this.errors.push({
        originalUrl: imgbbUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async migrateLocalFiles(sourceDir: string, pattern: string = '**/*.{jpg,jpeg,png,webp,avif,svg}'): Promise<MigrationResult> {
    const startTime = Date.now();
    const stats: MigrationStats = {
      total: 0,
      uploaded: 0,
      skipped: 0,
      failed: 0,
      totalSize: 0,
      duration: 0,
    };

    const files = await glob(pattern, { cwd: sourceDir, absolute: true });
    stats.total = files.length;

    const concurrency = this.config.concurrency || 3;
    
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      await Promise.all(batch.map(f => this.uploadLocalFile(f, sourceDir, stats)));
    }

    stats.duration = Date.now() - startTime;

    return {
      success: this.errors.length === 0,
      mappings: Array.from(this.mappings.values()),
      errors: this.errors,
      stats,
    };
  }

  private async uploadLocalFile(filePath: string, sourceDir: string, stats: MigrationStats): Promise<void> {
    try {
      const relativePath = relative(sourceDir, filePath);
      const targetPathname = relativePath.replace(/\\/g, '/');
      
      // Vérifier si déjà uploadé
      if (await this.client.exists(targetPathname)) {
        const meta = await this.client.getMetadata(targetPathname);
        if (meta) {
          this.mappings.set(filePath, {
            originalUrl: filePath,
            blobUrl: this.client.getPublicUrl(targetPathname),
            size: meta.size,
            contentType: meta.contentType,
            uploadedAt: meta.uploadedAt,
          });
          stats.skipped++;
          return;
        }
      }

      if (!this.config.dryRun) {
        const buffer = readFileSync(filePath);
        const contentType = this.getContentType(extname(filePath));
        const result = await this.client.upload(targetPathname, buffer, { contentType });
        this.mappings.set(filePath, { ...result, originalUrl: filePath });
        stats.uploaded++;
        stats.totalSize += result.size || 0;
      } else {
        const simulatedMapping: ImageMapping = {
          originalUrl: filePath,
          blobUrl: this.client.getPublicUrl(targetPathname),
          uploadedAt: new Date().toISOString(),
        };
        this.mappings.set(filePath, simulatedMapping);
        stats.uploaded++;
      }
    } catch (error) {
      stats.failed++;
      this.errors.push({
        originalUrl: filePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
  }

  getMappings(): Map<string, ImageMapping> {
    return this.mappings;
  }

  getErrors(): MigrationError[] {
    return this.errors;
  }

  getFrontmatterUpdates(): FrontmatterUpdate[] {
    return this.frontmatterUpdates;
  }

  saveMappingReport(outputPath: string): void {
    const report = {
      generatedAt: new Date().toISOString(),
      config: { prefix: this.config.prefix, dryRun: this.config.dryRun },
      mappings: Array.from(this.mappings.entries()).map(([key, value]) => ({ source: key, ...value })),
      errors: this.errors,
      frontmatterUpdates: this.frontmatterUpdates,
    };
    writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  }
}

export async function runMigration(config: BlobMigrationConfig, plan: { 
  source: 'local' | 'imgbb' | 'mixed';
  mappings?: IMGBBMappingEntry[];
  localDir?: string;
  pattern?: string;
}): Promise<MigrationResult> {
  const migrator = new ImageMigrator(config);
  
  if (plan.source === 'imgbb' || plan.source === 'mixed') {
    if (plan.mappings && plan.mappings.length > 0) {
      await migrator.migrateFromIMGBB(plan.mappings);
    }
  }
  
  if (plan.source === 'local' || plan.source === 'mixed') {
    if (plan.localDir) {
      await migrator.migrateLocalFiles(plan.localDir, plan.pattern);
    }
  }

  return {
    success: migrator.getErrors().length === 0,
    mappings: Array.from(migrator.getMappings().values()),
    errors: migrator.getErrors(),
    stats: {
      total: migrator.getMappings().size + migrator.getErrors().length,
      uploaded: migrator.getMappings().size,
      skipped: 0,
      failed: migrator.getErrors().length,
      totalSize: Array.from(migrator.getMappings().values()).reduce((sum, m) => sum + (m.size || 0), 0),
      duration: 0,
    },
  };
}