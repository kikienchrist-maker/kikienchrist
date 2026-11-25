// integrations/astro/index.ts — Astro Integration Entry Point (schema-org-master)
// Export des composants + integration Astro officielle

export { default as SchemaOrg } from './components/SchemaOrg.astro';
export { default as SchemaOrgHead } from './components/SchemaOrgHead.astro';
export { default as SchemaOrgBody } from './components/SchemaOrgBody.astro';

// Types pour props Astro
export interface SchemaOrgProps {
  config?: import('../../../injector').InjectorConfig;
  pageType?: 'home' | 'book' | 'article' | 'category' | 'legal' | 'search' | '404';
  book?: import('../../../types').SupportedSchemaType;
  article?: import('../../../types').SupportedSchemaType;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faq?: Array<{ question: string; answer: string }>;
  lang?: import('../../../types').KikiLangCode;
  canonicalUrl?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  additionalSchemas?: import('../../../types').SupportedSchemaType[];
  disableAuto?: boolean;
}

// Astro Integration Factory
import type { AstroIntegration } from 'astro';

export interface SchemaOrgIntegrationOptions {
  /** Config globale par défaut */
  config?: import('../../../injector').InjectorConfig;
  /** Auto-inject sur toutes les pages (via middleware) */
  autoInject?: boolean;
}

export function schemaOrgIntegration(options: SchemaOrgIntegrationOptions = {}): AstroIntegration {
  const { config = {}, autoInject = false } = options;

  return {
    name: 'schema-org-master',
    hooks: {
      'astro:config:setup': ({ injectRoute, addMiddleware, updateConfig }) => {
        // Injecter config globale dans locals
        // Note: Astro ne permet pas d'injecter locals directement ici
        // Utiliser middleware pour ça
      },
      'astro:build:start': () => {
        console.log('[schema-org-master] Build started');
      },
      'astro:build:done': ({ pages }) => {
        console.log(`[schema-org-master] Build done — ${pages.length} pages`);
      },
    },
  };
}

// Helper pour configurer locals dans middleware
export function createSchemaOrgMiddleware(config: import('../../../injector').InjectorConfig) {
  return async ({ locals, next }: { locals: Record<string, any>; next: () => Promise<any> }) => {
    locals.schemaOrgConfig = config;
    return next();
  };
}