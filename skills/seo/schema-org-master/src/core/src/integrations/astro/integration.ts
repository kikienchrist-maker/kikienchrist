// integration.ts — Astro Integration Factory (schema-org-master)
// Intégration complète: injection auto, composants, middleware, types

import type { AstroIntegration, AstroConfig } from 'astro';
import { createContext, type SchemaOrgContext } from '../context';
import { defaultInjectorConfig, schemaOrgMiddleware, type InjectorConfig } from '../middleware';

export interface SchemaOrgIntegrationOptions {
  /** Configuration injection par défaut */
  config?: Partial<InjectorConfig>;
  /** Activer middleware auto (défaut: true) */
  autoMiddleware?: boolean;
  /** Activer composants globaux (défaut: true) */
  globalComponents?: boolean;
  /** Langue par défaut */
  defaultLang?: string;
  /** URL de base du site */
  baseUrl?: string;
  /** Nom du site */
  siteName?: string;
  /** Données organisation */
  organization?: {
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
    email?: string;
  };
  /** Données website */
  website?: {
    name: string;
    url: string;
    searchUrlTemplate?: string;
  };
  /** Extensions Kiki */
  kikiExtensions?: boolean;
}

// Contexte global partagé
let globalContext: SchemaOrgContext | null = null;

/**
 * Crée l'intégration Astro Schema.org
 */
export function createSchemaOrgIntegration(options: SchemaOrgIntegrationOptions = {}): AstroIntegration {
  const {
    config = {},
    autoMiddleware = true,
    globalComponents = true,
    defaultLang = 'fr',
    baseUrl = 'https://kikienchrist.vercel.app',
    siteName = 'Kiki en Christ',
    organization = {
      name: 'Kiki en Christ',
      url: 'https://kikienchrist.vercel.app',
      logo: 'https://kikienchrist.vercel.app/images/logo.png',
      sameAs: [
        'https://www.facebook.com/kikienchrist',
        'https://twitter.com/kikienchrist',
        'https://www.instagram.com/kikienchrist',
        'https://www.youtube.com/@kikienchrist',
      ],
      email: 'kikienchrist@gmail.com',
    },
    website = {
      name: 'Kiki en Christ',
      url: 'https://kikienchrist.vercel.app',
      searchUrlTemplate: 'https://kikienchrist.vercel.app/{lang}/recherche?q={search_term_string}',
    },
    kikiExtensions = true,
  } = options;

  // Config complète fusionnée
  const fullConfig: InjectorConfig = {
    autoTypes: ['WebSite', 'Organization', 'BreadcrumbList', 'FAQPage'],
    globalData: {
      website,
      organization,
    },
    defaultLang,
    injectInHead: true,
    pretty: true,
    ...config,
  };

  return {
    name: 'schema-org-master',
    hooks: {
      // Setup initial - créer contexte global
      'astro:config:setup': async ({ config: astroConfig, injectScript, addWatchFile, logger }) => {
        // Initialiser contexte global
        globalContext = createContext({
          baseUrl,
          defaultLang,
          siteName,
          organization,
          website,
          kikiExtensions,
        });

        // Injecter script global pour types TypeScript si besoin
        if (astroConfig.output === 'static') {
          logger.info('Schema.org Master: Static output detected - JSON-LD injected at build time');
        }

        // Ajouter fichiers à watch pour HMR
        addWatchFile(new URL('../types/index.ts', import.meta.url));
        addWatchFile(new URL('../builder/base.ts', import.meta.url));
        addWatchFile(new URL('../injector/index.ts', import.meta.url));

        // Injecter types globaux pour TypeScript
        injectScript('page', `
          // Schema.org Master - Global types
          declare global {
            interface ImportMetaEnv {
              readonly SCHEMA_ORG_BASE_URL: string;
              readonly SCHEMA_ORG_DEFAULT_LANG: string;
            }
          }
        `);
      },

      // Middleware pour injection auto
      'astro:server:setup': async ({ server }) => {
        if (autoMiddleware) {
          // Le middleware est exporté séparément pour utilisation dans middleware.ts du projet
          // Voir: src/core/integrations/astro/middleware.ts
        }
      },

      // Build complet - générer types si demandé
      'astro:build:done': async ({ pages, dir, logger }) => {
        if (config.updateTypes) {
          logger.info('Schema.org Master: Generating TypeScript types...');
          // TODO: Implémenter génération types depuis schema-dts
        }
      },

      // Partager contexte global via locals
      'astro:config:done': ({ config: astroConfig, setAdapter }) => {
        // Le contexte est accessible via les composants/middleware
      },
    },
  };
}

/**
 * Obtient le contexte global (pour composants/middleware)
 */
export function getGlobalContext(): SchemaOrgContext | null {
  return globalContext;
}

/**
 * Définit le contexte global (pour tests)
 */
export function setGlobalContext(ctx: SchemaOrgContext): void {
  globalContext = ctx;
}

// ============================================================================
// TYPES POUR CONFIGURATION ASTRO
// ============================================================================

// Réexporter types nécessaires
export type { InjectorConfig, SchemaOrgContext } from '../middleware';
export type { KikiLangCode, SupportedSchemaType } from '../types';