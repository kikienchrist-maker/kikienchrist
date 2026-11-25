// src/lib/blob.ts
import { put, list, del } from '@vercel/blob';
import type { PutBlobResult } from '@vercel/blob';

export async function uploadImage(
  file: Buffer | File,
  filename: string,
  folder: 'books' | 'blog' | 'og' | 'lead-magnets' = 'blog'
): Promise<PutBlobResult> {
  const timestamp = Date.now();
  const ext = filename.split('.').pop()?.toLowerCase() || 'webp';
  const cleanName = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase();
  const pathname = `${folder}/${timestamp}-${cleanName}.${ext}`;

  return put(pathname, file, {
    access: 'public',
    contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    addRandomSuffix: false,
  });
}

export async function deleteImage(url: string): Promise<void> {
  await del(url);
}

export async function listImages(folder: string): Promise<string[]> {
  const { blobs } = await list({ prefix: folder });
  return blobs.map(b => b.url);
}
