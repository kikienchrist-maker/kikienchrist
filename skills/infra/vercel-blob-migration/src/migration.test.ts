/**
 * Tests pour migration.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageMigrator } from './migration.js';
import type { BlobMigrationConfig, IMGBBMappingEntry } from './types.js';

// Mock @vercel/blob
vi.mock('@vercel/blob', () => ({
  put: vi.fn(),
  del: vi.fn(),
  list: vi.fn(),
  head: vi.fn(),
}));

import { put, head } from '@vercel/blob';

describe('ImageMigrator', () => {
  let migrator: ImageMigrator;
  const mockConfig: BlobMigrationConfig = {
    token: 'test-token',
    storeId: 'test-store',
    prefix: 'images/',
    dryRun: true,
    concurrency: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    migrator = new ImageMigrator(mockConfig);
  });

  describe('migrateFromIMGBB (dryRun)', () => {
    it('simule upload sans appel réseau', async () => {
      const mappings: IMGBBMappingEntry[] = [
        { localPath: 'blog/img1.jpg', imgbbUrl: 'https://ibb.co/img1.jpg', alt: 'Test 1' },
        { localPath: 'blog/img2.jpg', imgbbUrl: 'https://ibb.co/img2.jpg', alt: 'Test 2' },
      ];

      const result = await migrator.migrateFromIMGBB(mappings);

      expect(result.success).toBe(true);
      expect(result.stats.total).toBe(2);
      expect(result.stats.uploaded).toBe(2);
      expect(result.stats.failed).toBe(0);
      expect(result.mappings.length).toBe(2);
      
      // Vérifier structure mapping
      const mapping = result.mappings[0];
      expect(mapping.originalUrl).toBe('https://ibb.co/img1.jpg');
      expect(mapping.blobUrl).toContain('images/');
      expect(mapping.uploadedAt).toBeDefined();
    });

    it('génère frontmatterUpdates pour localPath', async () => {
      const mappings: IMGBBMappingEntry[] = [
        { localPath: 'src/content/blog/post1/cover.jpg', imgbbUrl: 'https://ibb.co/cover.jpg' },
      ];

      await migrator.migrateFromIMGBB(mappings);
      const updates = migrator.getFrontmatterUpdates();

      expect(updates.length).toBe(1);
      expect(updates[0].filePath).toBe('src/content/blog/post1/cover.jpg');
      expect(updates[0].field).toBe('coverImage');
      expect(updates[0].oldValue).toBe('https://ibb.co/cover.jpg');
      expect(updates[0].newValue).toContain('images/');
    });
  });

  describe('migrateLocalFiles (dryRun)', () => {
    it('simule upload fichiers locaux', async () => {
      // Note: test réel nécessiterait fs mock, ici on teste la logique dryRun
      const result = await migrator.migrateLocalFiles('/nonexistent', '**/*.jpg');
      expect(result.stats.total).toBe(0);
    });
  });

  describe('getMappings', () => {
    it('retourne mappings accumulés', async () => {
      const mappings: IMGBBMappingEntry[] = [
        { localPath: 'a.jpg', imgbbUrl: 'https://ibb.co/a.jpg' },
      ];
      await migrator.migrateFromIMGBB(mappings);
      
      const map = migrator.getMappings();
      expect(map.size).toBe(1);
      expect(map.has('https://ibb.co/a.jpg')).toBe(true);
    });
  });
});