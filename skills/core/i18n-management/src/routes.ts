/**
 * Gestion des routes i18n pour Astro
 */
import type { I18nConfig, LangCode, RouteEntry } from './types.js';
import { DEFAULT_I18N_CONFIG, UI_LANGS } from './config.js';
import { findAstroRoutes, extractLangsFromRoutes } from './utils.js';
import { resolve } from 'path';

export interface RouteAnalysis {
  totalRoutes: number;
  langRoutes: number;
  staticRoutes: number;
  dynamicRoutes: number;
  routes: RouteEntry[];
  missingTranslations: Record<LangCode, string[]>;
}

/**
 * Analyse les routes Astro pour l'i18n
 */
export function analyzeRoutes(config: I18nConfig = DEFAULT_I18N_CONFIG): RouteAnalysis {
  const routesDir = resolve(config.basePath, config.routesDir);
  const routes = findAstroRoutes(routesDir);
  
  const routeEntries: RouteEntry[] = [];
  const missingTranslations: Record<LangCode, string[]> = {} as Record<LangCode, string[]>;
  
  for (const lang of UI_LANGS) {
    missingTranslations[lang] = [];
  }
  
  // Grouper les routes par chemin de base (sans la langue)
  const routesByBase = new Map<string, { langs: Set<LangCode>; hasDynamic: boolean }>();
  
  for (const route of routes) {
    // Extraire le pattern de route
    const parts = route.split(/[/\\]/);
    const baseParts: string[] = [];
    let hasLang = false;
    
    for (const part of parts) {
      if (part === '[lang]' || part.startsWith('[lang]')) {
        hasLang = true;
      } else if (UI_LANGS.includes(part as LangCode)) {
        hasLang = true;
        // Route statique avec langue explicite
        const baseRoute = parts.filter(p => p !== part).join('/');
        if (!routesByBase.has(baseRoute)) {
          routesByBase.set(baseRoute, { langs: new Set(), hasDynamic: false });
        }
        routesByBase.get(baseRoute)!.langs.add(part as LangCode);
      } else {
        baseParts.push(part);
      }
    }
    
    if (hasLang) {
      const baseRoute = baseParts.join('/') || '/';
      if (!routesByBase.has(baseRoute)) {
        routesByBase.set(baseRoute, { langs: new Set(), hasDynamic: false });
      }
      // Marquer comme route dynamique [lang]
      routesByBase.get(baseRoute)!.hasDynamic = true;
    }
  }
  
  // Construire RouteEntry
  for (const [basePath, { langs, hasDynamic }] of routesByBase) {
    const entryLangs = Array.from(langs);
    
    const hasTranslation: Record<LangCode, boolean> = {} as Record<LangCode, boolean>;
    for (const lang of UI_LANGS) {
      hasTranslation[lang] = entryLangs.includes(lang);
      if (!hasTranslation[lang] && hasDynamic) {
        missingTranslations[lang].push(basePath);
      }
    }
    
    routeEntries.push({
      path: basePath,
      langs: entryLangs,
      hasTranslation,
    });
  }
  
  const langRoutes = routeEntries.filter(r => r.langs.length > 0).length;
  const staticRoutes = routes.filter(r => !r.includes('[lang]') && !UI_LANGS.some(l => r.includes(l))).length;
  const dynamicRoutes = routes.filter(r => r.includes('[lang]')).length;
  
  return {
    totalRoutes: routes.length,
    langRoutes,
    staticRoutes,
    dynamicRoutes,
    routes: routeEntries.sort((a, b) => a.path.localeCompare(b.path)),
    missingTranslations,
  };
}

/**
 * Génère la configuration de routage pour astro.config.mjs
 */
export function generateAstroI18nConfig(config: I18nConfig = DEFAULT_I18N_CONFIG): string {
  return `// Configuration i18n pour Astro
import { defineConfig } from 'astro/config';

export default defineConfig({
  // ... autres configs
  
  // i18n routing
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  
  // Vite plugin pour i18n (si utilisé)
  // vite: {
  //   plugins: [astroI18nPlugin()],
  // },
});
`;
}

/**
 * Génère les routes de redirection pour les langues manquantes
 */
export function generateRedirectRoutes(analysis: RouteAnalysis): string[] {
  const redirects: string[] = [];
  
  for (const [lang, paths] of Object.entries(analysis.missingTranslations)) {
    for (const path of paths) {
      redirects.push(`/${lang}${path} -> /fr${path} (fallback)`);
    }
  }
  
  return redirects;
}