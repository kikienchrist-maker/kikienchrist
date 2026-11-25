/**
 * Client Vercel Blob pour upload et gestion
 * Compatible @vercel/blob v0.23+
 */
import { put, del, list, head } from '@vercel/blob';
import type { BlobMigrationConfig, ImageMapping } from './types.js';

export class VercelBlobClient {
  private token: string;
  private storeId?: string;
  private publicUrl?: string;
  private prefix: string;

  constructor(config: BlobMigrationConfig) {
    this.token = config.token;
    this.storeId = config.storeId;
    this.publicUrl = config.publicUrl;
    this.prefix = config.prefix || 'images/';
  }

  private getOptions(): { token: string; storeId?: string } {
    return { token: this.token, storeId: this.storeId };
  }

  async upload(
    pathname: string,
    body: Buffer | ReadableStream | Blob | File,
    options?: { contentType?: string; cacheControl?: string }
  ): Promise<ImageMapping> {
    const fullPath = `${this.prefix}${pathname}`;
    
    const blob = await put(fullPath, body, {
      access: 'public',
      ...this.getOptions(),
      contentType: options?.contentType,
      addRandomSuffix: false,
    });

    // @vercel/blob v0.23+ retourne { url, pathname, contentType, size }
    return {
      originalUrl: fullPath,
      blobUrl: blob.url,
      contentType: blob.contentType || options?.contentType,
      size: (blob as any).size || 0,
      uploadedAt: new Date().toISOString(),
    };
  }

  async uploadFromUrl(
    sourceUrl: string,
    targetPathname: string,
    options?: { contentType?: string }
  ): Promise<ImageMapping> {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${sourceUrl}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = options?.contentType || response.headers.get('content-type') || 'application/octet-stream';

    return this.upload(targetPathname, buffer, { contentType });
  }

  async delete(pathname: string): Promise<void> {
    const fullPath = `${this.prefix}${pathname}`;
    await del(fullPath, this.getOptions());
  }

  async list(options?: { prefix?: string; limit?: number }): Promise<Array<{ pathname: string; url: string; size: number; uploadedAt: string }>> {
    const result = await list({
      ...this.getOptions(),
      prefix: options?.prefix ? `${this.prefix}${options.prefix}` : this.prefix,
      limit: options?.limit,
    });

    return result.blobs.map(blob => ({
      pathname: blob.pathname,
      url: blob.url,
      size: (blob as any).size || 0,
      uploadedAt: (blob as any).uploadedAt?.toISOString?.() || new Date().toISOString(),
    }));
  }

  async exists(pathname: string): Promise<boolean> {
    try {
      const fullPath = `${this.prefix}${pathname}`;
      await head(fullPath, this.getOptions());
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(pathname: string): Promise<{ size: number; contentType: string; uploadedAt: string } | null> {
    try {
      const fullPath = `${this.prefix}${pathname}`;
      const blob = await head(fullPath, this.getOptions());
      return {
        size: (blob as any).size || 0,
        contentType: blob.contentType,
        uploadedAt: (blob as any).uploadedAt?.toISOString?.() || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }

  getPublicUrl(pathname: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, '')}/${this.prefix}${pathname}`;
    }
    // URL par défaut Vercel Blob
    return `https://${this.storeId || 'blob'}.vercel-storage.com/${this.prefix}${pathname}`;
  }
}

export function createBlobClient(config: BlobMigrationConfig): VercelBlobClient {
  return new VercelBlobClient(config);
}