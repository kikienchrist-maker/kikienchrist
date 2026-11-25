/**
 * Types pour Decap CMS Setup
 */

export interface DecapConfig {
  backend: BackendConfig;
  media_folder: string;
  public_folder: string;
  collections: CollectionConfig[];
  site_url?: string;
  logo_url?: string;
  display_url?: string;
  locale?: string;
  slug?: SlugConfig;
  editor?: EditorConfig;
  publish_mode?: 'editorial_workflow' | 'simple';
}

export interface BackendConfig {
  name: 'git-gateway' | 'github' | 'gitlab' | 'bitbucket';
  branch: string;
  repo?: string;
  site_domain?: string;
  api_root?: string;
  auth_endpoint?: string;
  commit_messages?: CommitMessagesConfig;
}

export interface CommitMessagesConfig {
  create: string;
  update: string;
  delete: string;
  uploadMedia: string;
  deleteMedia: string;
  openAuthoring: string;
}

export interface CollectionConfig {
  name: string;
  label: string;
  label_singular?: string;
  folder?: string;
  files?: FileCollectionConfig[];
  create?: boolean;
  slug?: string;
  path?: string;
  fields?: FieldConfig[];
  meta?: MetaFieldConfig[];
  summary?: string;
  format?: 'yaml' | 'json' | 'toml' | 'frontmatter';
  extension?: 'md' | 'mdx' | 'json' | 'yaml' | 'toml';
  editor?: { preview?: boolean };
  identifier_field?: string;
}

export interface FileCollectionConfig {
  name: string;
  label: string;
  file: string;
  fields: FieldConfig[];
  meta?: MetaFieldConfig[];
}

export type FieldType = 'string' | 'text' | 'markdown' | 'datetime' | 'date' | 'boolean' | 'number' | 'select' | 'multiselect' | 'list' | 'object' | 'image' | 'file' | 'code' | 'hidden' | 'rich-text' | 'relation';

export interface FieldConfig {
  label: string;
  name: string;
  widget: FieldType;
  required?: boolean;
  default?: any;
  pattern?: string;
  hint?: string;
  i18n?: boolean | 'duplicate' | 'translate';
  options?: string[] | { value: string; label: string }[];
  option_labels?: string[];
  min?: number;
  max?: number;
  step?: number;
  format?: string;
  date_format?: string;
  time_format?: boolean;
  fields?: FieldConfig[];
  types?: FieldConfig[][];
  max_count?: number;
  min_count?: number;
  collapsed?: boolean;
  summary?: string;
  // Pour widget 'relation'
  collection?: string;
  search_fields?: string[];
  value_field?: string;
  display_fields?: string[];
  // Pour widget 'image'
  media_folder?: string;
  allow_multiple?: boolean;
}

export interface MetaFieldConfig {
  label: string;
  name: string;
  widget: FieldType;
  required?: boolean;
  default?: any;
}

export interface SlugConfig {
  encoding: 'ascii' | 'unicode';
  sanitize_replacement: string;
  clean_accents: boolean;
}

export interface EditorConfig {
  preview?: boolean;
}

export interface NetlifyIdentityConfig {
  enabled: boolean;
  url?: string;
  audience?: string;
  external_providers?: string[];
  registration_preferences?: 'email' | 'email_password' | 'passwordless';
  password_strength?: number;
  email_templates?: EmailTemplatesConfig;
}

export interface EmailTemplatesConfig {
  signup?: string;
  recovery?: string;
  confirmation?: string;
}

export interface GitGatewayConfig {
  enabled: boolean;
  branch: string;
  repo_path?: string;
}

export interface DeploymentConfig {
  netlifyIdentity: NetlifyIdentityConfig;
  gitGateway: GitGatewayConfig;
  decapConfig: DecapConfig;
  outputDir: string;
}

export interface GeneratorOptions {
  outputDir: string;
  backend?: Partial<BackendConfig>;
  collections?: CollectionConfig[];
  siteUrl?: string;
  logoUrl?: string;
  locale?: string;
  publishMode?: 'editorial_workflow' | 'simple';
}

export interface NetlifySetupOptions {
  outputDir: string;
  identity?: Partial<NetlifyIdentityConfig>;
  gitGateway?: Partial<GitGatewayConfig>;
  siteUrl?: string;
}

export interface PreviewConfigOptions {
  outputDir: string;
  siteUrl: string;
  collections: string[];
}