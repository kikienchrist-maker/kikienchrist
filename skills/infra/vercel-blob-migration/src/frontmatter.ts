/**
 * Mise à jour frontmatter YAML après migration
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { load, dump } from 'js-yaml';
import type { FrontmatterUpdate, ImageMapping } from './types.js';

const parse = (str: string) => load(str);
const stringify = (obj: any) => dump(obj, { lineWidth: -1, noRefs: true });

export function updateFrontmatterImages(
  contentDir: string,
  mappings: ImageMapping[],
  options?: { dryRun?: boolean; backup?: boolean }
): { updated: number; errors: string[] } {
  const updates = buildUpdateMap(mappings);
  let updated = 0;
  const errors: string[] = [];

  // Scanner tous les fichiers .md/.mdx
  const files = findMarkdownFiles(contentDir);
  
  for (const filePath of files) {
    try {
      const result = updateFileFrontmatter(filePath, updates, options);
      if (result.updated) updated++;
      if (result.error) errors.push(result.error);
    } catch (error) {
      errors.push(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { updated, errors };
}

function buildUpdateMap(mappings: ImageMapping[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of mappings) {
    // Mapper URL originale -> URL Blob
    map.set(m.originalUrl, m.blobUrl);
    // Aussi mapper sans préfixe si c'est un chemin local
    if (m.originalUrl.startsWith('images/') || m.originalUrl.startsWith('public/images/')) {
      map.set(m.originalUrl.replace(/^(public\/)?images\//, ''), m.blobUrl);
    }
  }
  return map;
}

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  function scan(d: string) {
    if (!existsSync(d)) return;
    const entries = require('fs').readdirSync(d, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        files.push(full);
      }
    }
  }
  scan(dir);
  return files;
}

function updateFileFrontmatter(
  filePath: string,
  updateMap: Map<string, string>,
  options?: { dryRun?: boolean; backup?: boolean }
): { updated: boolean; error?: string } {
  const content = readFileSync(filePath, 'utf-8');
  
  // Extraire frontmatter
  const fmMatch = content.match(/^---[\r\n]([\s\S]*?)[\r\n]---/);
  if (!fmMatch) return { updated: false };
  
  const frontmatter = parse(fmMatch[1]) as Record<string, any>;
  let modified = false;
  
  // Champs d'image connus
  const imageFields = ['coverImage', 'coverImageAlt', 'avatar', 'logo', 'favicon', 'defaultOgImage', 'image', 'ogImage', 'thumbnail'];
  
  for (const field of imageFields) {
    if (frontmatter[field] && typeof frontmatter[field] === 'string') {
      const oldValue = frontmatter[field];
      const newValue = updateMap.get(oldValue);
      if (newValue && newValue !== oldValue) {
        frontmatter[field] = newValue;
        modified = true;
      }
    }
  }
  
  // Aussi vérifier dans les objets imbriqués (ex: author.avatar, seo.ogImage)
  for (const key of Object.keys(frontmatter)) {
    const value = frontmatter[key];
    if (typeof value === 'object' && value !== null) {
      const nested = value as Record<string, any>;
      for (const nestedKey of ['avatar', 'image', 'ogImage', 'thumbnail', 'coverImage']) {
        if (nested[nestedKey] && typeof nested[nestedKey] === 'string') {
          const oldValue = nested[nestedKey];
          const newValue = updateMap.get(oldValue);
          if (newValue && newValue !== oldValue) {
            nested[nestedKey] = newValue;
            modified = true;
          }
        }
      }
    }
  }

  if (!modified) return { updated: false };

  if (options?.backup && !options.dryRun) {
    writeFileSync(`${filePath}.bak`, content, 'utf-8');
  }

  if (!options?.dryRun) {
    const newFm = stringify(frontmatter);
    const newContent = content.replace(fmMatch[1], newFm);
    writeFileSync(filePath, newContent, 'utf-8');
  }

  return { updated: true };
}

export function generateMappingReport(
  mappings: ImageMapping[],
  outputPath: string
): void {
  const report = {
    generatedAt: new Date().toISOString(),
    totalMappings: mappings.length,
    mappings: mappings.map(m => ({
      original: m.originalUrl,
      blob: m.blobUrl,
      size: m.size,
      contentType: m.contentType,
      uploadedAt: m.uploadedAt,
    })),
  };
  writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
}