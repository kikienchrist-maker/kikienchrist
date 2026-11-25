/**
 * Tests pour frontmatter.ts
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { updateFrontmatterImages } from './frontmatter.js';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { ImageMapping } from './types.js';

const TEST_DIR = join(process.cwd(), 'test-frontmatter-temp');

describe('frontmatter', () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  });

  describe('updateFrontmatterImages', () => {
    it('met à jour coverImage dans frontmatter', () => {
      const filePath = join(TEST_DIR, 'post.md');
      writeFileSync(filePath, `---
title: "Test Post"
coverImage: "https://ibb.co/old-image.jpg"
---
Content here.`, 'utf-8');

      const mappings: ImageMapping[] = [
        { originalUrl: 'https://ibb.co/old-image.jpg', blobUrl: 'https://blob.vercel.com/images/new-image.jpg', uploadedAt: '2024-01-01' },
      ];

      const result = updateFrontmatterImages(TEST_DIR, mappings, { dryRun: false });
      expect(result.updated).toBe(1);

      const content = readFileSync(filePath, 'utf-8');
      // js-yaml dump n'ajoute pas de guillemets pour les URLs simples
      expect(content).toContain('coverImage: https://blob.vercel.com/images/new-image.jpg');
    });

    it('met à jour image dans objet nested (author.avatar)', () => {
      const filePath = join(TEST_DIR, 'author.md');
      writeFileSync(filePath, `---
name: "John Doe"
author:
  avatar: "https://ibb.co/avatar.jpg"
---
Bio.`, 'utf-8');

      const mappings: ImageMapping[] = [
        { originalUrl: 'https://ibb.co/avatar.jpg', blobUrl: 'https://blob.vercel.com/images/avatar.jpg', uploadedAt: '2024-01-01' },
      ];

      const result = updateFrontmatterImages(TEST_DIR, mappings, { dryRun: false });
      expect(result.updated).toBe(1);

      const content = readFileSync(filePath, 'utf-8');
      expect(content).toContain('avatar: https://blob.vercel.com/images/avatar.jpg');
    });

    it('ne modifie pas si pas de mapping', () => {
      const filePath = join(TEST_DIR, 'post.md');
      writeFileSync(filePath, `---
title: "Test"
coverImage: "https://other.com/image.jpg"
---
Content.`, 'utf-8');

      const mappings: ImageMapping[] = [
        { originalUrl: 'https://ibb.co/img.jpg', blobUrl: 'https://blob.vercel.com/images/img.jpg', uploadedAt: '2024-01-01' },
      ];

      const result = updateFrontmatterImages(TEST_DIR, mappings, { dryRun: false });
      expect(result.updated).toBe(0);
    });

    it('respect dryRun', () => {
      const filePath = join(TEST_DIR, 'post.md');
      writeFileSync(filePath, `---
coverImage: "https://ibb.co/old.jpg"
---
`, 'utf-8');

      const mappings: ImageMapping[] = [
        { originalUrl: 'https://ibb.co/old.jpg', blobUrl: 'https://blob.vercel.com/images/new.jpg', uploadedAt: '2024-01-01' },
      ];

      const result = updateFrontmatterImages(TEST_DIR, mappings, { dryRun: true });
      expect(result.updated).toBe(1);

      // Fichier inchangé en dryRun
      const content = readFileSync(filePath, 'utf-8');
      expect(content).toContain('coverImage: "https://ibb.co/old.jpg"');
    });

    it('gère plusieurs fichiers', () => {
      writeFileSync(join(TEST_DIR, 'post1.md'), `---\ncoverImage: "https://ibb.co/img1.jpg"\n---`, 'utf-8');
      writeFileSync(join(TEST_DIR, 'post2.md'), `---\ncoverImage: "https://ibb.co/img2.jpg"\n---`, 'utf-8');
      writeFileSync(join(TEST_DIR, 'post3.md'), `---\ntitle: "No Image"\n---`, 'utf-8');

      const mappings: ImageMapping[] = [
        { originalUrl: 'https://ibb.co/img1.jpg', blobUrl: 'https://blob.vercel.com/images/img1.jpg', uploadedAt: '2024-01-01' },
        { originalUrl: 'https://ibb.co/img2.jpg', blobUrl: 'https://blob.vercel.com/images/img2.jpg', uploadedAt: '2024-01-01' },
      ];

      const result = updateFrontmatterImages(TEST_DIR, mappings, { dryRun: false });
      expect(result.updated).toBe(2);
    });
  });
});