/**
 * Générateur de configuration Decap CMS (config.yml)
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import type { DecapConfig, CollectionConfig, BackendConfig } from './types.js';
import { DEFAULT_DECAP_CONFIG, createAllCollections } from './config.js';

export interface GeneratorOptions {
  outputDir: string;
  backend?: Partial<BackendConfig>;
  collections?: CollectionConfig[];
  siteUrl?: string;
  logoUrl?: string;
  locale?: string;
  publishMode?: 'editorial_workflow' | 'simple';
}

export function generateDecapConfig(options: GeneratorOptions): DecapConfig {
  const backend: BackendConfig = {
    ...DEFAULT_DECAP_CONFIG.backend,
    ...options.backend,
  };
  
  const collections = options.collections || createAllCollections();
  
  const config: DecapConfig = {
    ...DEFAULT_DECAP_CONFIG,
    backend,
    collections,
    site_url: options.siteUrl,
    logo_url: options.logoUrl,
    locale: options.locale || 'fr',
    publish_mode: options.publishMode || 'editorial_workflow',
  };
  
  return config;
}

export function writeDecapConfig(config: DecapConfig, outputDir: string): void {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const yaml = configToYaml(config);
  const outputPath = join(outputDir, 'config.yml');
  writeFileSync(outputPath, yaml, 'utf-8');
}

export function configToYaml(config: DecapConfig): string {
  const lines: string[] = [];
  
  // Backend
  lines.push('backend:');
  lines.push(`  name: ${config.backend.name}`);
  lines.push(`  branch: ${config.backend.branch}`);
  if (config.backend.repo) lines.push(`  repo: ${config.backend.repo}`);
  if (config.backend.site_domain) lines.push(`  site_domain: ${config.backend.site_domain}`);
  if (config.backend.api_root) lines.push(`  api_root: ${config.backend.api_root}`);
  if (config.backend.auth_endpoint) lines.push(`  auth_endpoint: ${config.backend.auth_endpoint}`);
  
  if (config.backend.commit_messages) {
    lines.push('  commit_messages:');
    for (const [key, value] of Object.entries(config.backend.commit_messages)) {
      lines.push(`    ${key}: "${value}"`);
    }
  }
  
  // Media
  lines.push(`media_folder: "${config.media_folder}"`);
  lines.push(`public_folder: "${config.public_folder}"`);
  
  // Site
  if (config.site_url) lines.push(`site_url: "${config.site_url}"`);
  if (config.logo_url) lines.push(`logo_url: "${config.logo_url}"`);
  if (config.display_url) lines.push(`display_url: "${config.display_url}"`);
  if (config.locale) lines.push(`locale: "${config.locale}"`);
  
  // Slug
  if (config.slug) {
    lines.push('slug:');
    lines.push(`  encoding: ${config.slug.encoding}`);
    lines.push(`  sanitize_replacement: "${config.slug.sanitize_replacement}"`);
    lines.push(`  clean_accents: ${config.slug.clean_accents}`);
  }
  
  // Publish mode
  if (config.publish_mode) lines.push(`publish_mode: ${config.publish_mode}`);
  
  // Collections
  lines.push('collections:');
  for (const collection of config.collections) {
    lines.push(...collectionToYaml(collection, 2));
  }
  
  return lines.join('\n');
}

function collectionToYaml(collection: CollectionConfig, indent: number): string[] {
  const spaces = ' '.repeat(indent);
  const lines: string[] = [];
  
  lines.push(`${spaces}- name: "${collection.name}"`);
  lines.push(`${spaces}  label: "${collection.label}"`);
  if (collection.label_singular) lines.push(`${spaces}  label_singular: "${collection.label_singular}"`);
  if (collection.folder) lines.push(`${spaces}  folder: "${collection.folder}"`);
  if (collection.files) {
    lines.push(`${spaces}  files:`);
    for (const file of collection.files) {
      lines.push(...fileToYaml(file, indent + 4));
    }
  } else {
    if (collection.create !== undefined) lines.push(`${spaces}  create: ${collection.create}`);
    if (collection.slug) lines.push(`${spaces}  slug: "${collection.slug}"`);
    if (collection.path) lines.push(`${spaces}  path: "${collection.path}"`);
    if (collection.format) lines.push(`${spaces}  format: ${collection.format}`);
    if (collection.extension) lines.push(`${spaces}  extension: ${collection.extension}`);
    if (collection.editor) {
      lines.push(`${spaces}  editor:`);
      if (collection.editor.preview !== undefined) {
        lines.push(`${spaces}    preview: ${collection.editor.preview}`);
      }
    }
    if (collection.identifier_field) lines.push(`${spaces}  identifier_field: "${collection.identifier_field}"`);
    if (collection.summary) lines.push(`${spaces}  summary: "${collection.summary}"`);
    
    // Fields (seulement pour folder collections)
    if (collection.fields && collection.fields.length > 0) {
      lines.push(`${spaces}  fields:`);
      for (const field of collection.fields) {
        lines.push(...fieldToYaml(field, indent + 4));
      }
    }
    
    // Meta
    if (collection.meta && collection.meta.length > 0) {
      lines.push(`${spaces}  meta:`);
      for (const meta of collection.meta) {
        lines.push(...fieldToYaml(meta, indent + 4));
      }
    }
  }
  
  return lines;
}

function fileToYaml(file: any, indent: number): string[] {
  const spaces = ' '.repeat(indent);
  const lines: string[] = [];
  
  lines.push(`${spaces}- name: "${file.name}"`);
  lines.push(`${spaces}  label: "${file.label}"`);
  lines.push(`${spaces}  file: "${file.file}"`);
  
  if (file.fields && file.fields.length > 0) {
    lines.push(`${spaces}  fields:`);
    for (const field of file.fields) {
      lines.push(...fieldToYaml(field, indent + 4));
    }
  }
  
  if (file.meta && file.meta.length > 0) {
    lines.push(`${spaces}  meta:`);
    for (const meta of file.meta) {
      lines.push(...fieldToYaml(meta, indent + 4));
    }
  }
  
  return lines;
}

function fieldToYaml(field: any, indent: number): string[] {
  const spaces = ' '.repeat(indent);
  const lines: string[] = [];
  
  lines.push(`${spaces}- label: "${field.label}"`);
  lines.push(`${spaces}  name: "${field.name}"`);
  lines.push(`${spaces}  widget: "${field.widget}"`);
  
  if (field.required !== undefined) lines.push(`${spaces}  required: ${field.required}`);
  if (field.default !== undefined) {
    if (typeof field.default === 'string') {
      lines.push(`${spaces}  default: "${field.default}"`);
    } else {
      lines.push(`${spaces}  default: ${field.default}`);
    }
  }
  if (field.pattern) lines.push(`${spaces}  pattern: "${field.pattern}"`);
  if (field.hint) lines.push(`${spaces}  hint: "${field.hint}"`);
  if (field.i18n !== undefined) lines.push(`${spaces}  i18n: ${field.i18n}`);
  if (field.options) {
    lines.push(`${spaces}  options:`);
    for (const opt of field.options) {
      if (typeof opt === 'string') {
        lines.push(`${spaces}    - "${opt}"`);
      } else {
        lines.push(`${spaces}    - value: "${opt.value}"`);
        lines.push(`${spaces}      label: "${opt.label}"`);
      }
    }
  }
  if (field.option_labels) {
    lines.push(`${spaces}  option_labels:`);
    for (const lbl of field.option_labels) {
      lines.push(`${spaces}    - "${lbl}"`);
    }
  }
  if (field.min !== undefined) lines.push(`${spaces}  min: ${field.min}`);
  if (field.max !== undefined) lines.push(`${spaces}  max: ${field.max}`);
  if (field.step !== undefined) lines.push(`${spaces}  step: ${field.step}`);
  if (field.format) lines.push(`${spaces}  format: "${field.format}"`);
  if (field.date_format) lines.push(`${spaces}  date_format: "${field.date_format}"`);
  if (field.time_format !== undefined) lines.push(`${spaces}  time_format: ${field.time_format}`);
  if (field.fields && field.fields.length > 0) {
    lines.push(`${spaces}  fields:`);
    for (const subField of field.fields) {
      lines.push(...fieldToYaml(subField, indent + 2));
    }
  }
  if (field.types && field.types.length > 0) {
    lines.push(`${spaces}  types:`);
    for (const typeFields of field.types) {
      lines.push(`${spaces}    -`);
      for (const tf of typeFields) {
        lines.push(...fieldToYaml(tf, indent + 6));
      }
    }
  }
  if (field.max_count !== undefined) lines.push(`${spaces}  max_count: ${field.max_count}`);
  if (field.min_count !== undefined) lines.push(`${spaces}  min_count: ${field.min_count}`);
  if (field.collapsed !== undefined) lines.push(`${spaces}  collapsed: ${field.collapsed}`);
  if (field.summary) lines.push(`${spaces}  summary: "${field.summary}"`);
  
  return lines;
}