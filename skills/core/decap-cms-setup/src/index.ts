/**
 * Decap CMS Setup - Point d'entrée principal
 */
export * from './config.js';
export * from './generator.js';
export * from './netlify.js';
export * from './preview.js';
export { DEFAULT_DECAP_CONFIG } from './config.js';
// Re-export types explicitly to avoid ambiguity
export type {
  DecapConfig,
  BackendConfig,
  CollectionConfig,
  FileCollectionConfig,
  FieldConfig,
  FieldType,
  MetaFieldConfig,
  SlugConfig,
  EditorConfig,
  NetlifyIdentityConfig,
  GitGatewayConfig,
  GeneratorOptions,
  NetlifySetupOptions,
  PreviewConfigOptions,
} from './types.js';