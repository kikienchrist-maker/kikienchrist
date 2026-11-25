/**
 * Configuration de prévisualisation Decap CMS pour Astro
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

export interface PreviewConfigOptions {
  outputDir: string;
  siteUrl: string;
  collections: string[];
}

export function generatePreviewConfig(options: PreviewConfigOptions): string {
  const { siteUrl, collections } = options;
  
  return `// Decap CMS Preview Templates pour Astro
// À placer dans src/cms/preview-templates/index.ts

import { registerPreviewTemplate } from 'netlify-cms-lib-widgets';

// Configuration globale
const SITE_URL = "${siteUrl}";

function getPreviewUrl(collection: string, slug: string, lang: string = "fr"): string {
  const base = \`\${SITE_URL}/\${lang}\`;
  switch (collection) {
    case "blog":
      return \`\${base}/blog/\${slug}/\`;
    case "legal":
      return \${base}/\${slug}/\`;
    case "books":
      return \${base}/livres/\${slug}/\`;
    default:
      return \${base}/\${slug}/\`;
  }
}

// Templates de prévisualisation par collection
${collections.map(c => `
// ${c} Preview
registerPreviewTemplate("${c}", {
  name: "${c}",
  getPreviewUrl: (entry) => {
    const data = entry.get("data");
    const slug = data.get("pageSlug") || data.get("slug") || data.get("translationKey");
    const lang = data.get("lang") || "fr";
    return getPreviewUrl("${c}", slug, lang);
  },
  getPreviewHtml: (entry) => {
    const data = entry.get("data");
    const title = data.get("title") || "Sans titre";
    const excerpt = data.get("excerpt") || data.get("shortDescription") || "";
    const coverImage = data.get("coverImage");
    const lang = data.get("lang") || "fr";
    
    return \\\`
      <div style="font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto;">
        <a href="\${getPreviewUrl("${c}", data.get("pageSlug") || data.get("slug") || data.get("translationKey"), lang)}" target="_blank" style="color: #0066cc; text-decoration: none;">
          Voir sur le site →
        </a>
        <h1 style="margin-top: 1rem;">\${title}</h1>
        \${coverImage ? \\\`<img src="\${coverImage}" alt="" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />\\\` : ''}
        <p style="color: #666;">\${excerpt}</p>
        <hr style="margin: 2rem 0;" />
        <p style="font-size: 0.9rem; color: #999;">Prévisualisation \${"${c}"} - \${lang}</p>
      </div>
    \\\`;
  },
});
`).join('\n')}

// Export pour utilisation dans admin/index.html
export { getPreviewUrl };
`;
}

export function writePreviewConfig(options: PreviewConfigOptions): void {
  const { outputDir } = options;
  const previewDir = join(outputDir, 'src', 'cms', 'preview-templates');
  
  if (!existsSync(previewDir)) {
    mkdirSync(previewDir, { recursive: true });
  }
  
  const config = generatePreviewConfig(options);
  writeFileSync(join(previewDir, 'index.ts'), config, 'utf-8');
}

export function generateAdminIndexHtml(options: { siteUrl: string; logoUrl?: string }): string {
  const { siteUrl, logoUrl } = options;
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Kiki en Christ - Administration</title>
  <link href="https://unpkg.com/decap-cms@^3.0.0/dist/cms.css" rel="stylesheet" />
  ${logoUrl ? `<link rel="icon" href="${logoUrl}" />` : ''}
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/cms.js"></script>
  <script>
    // Configuration Netlify Identity
    window.CMS_MANUAL_INIT = true;
  </script>
  <script>
    // Initialisation CMS
    const config = {
      load_config_file: true,
      config: {
        backend: {
          name: 'git-gateway',
          branch: 'main',
        },
      },
    };
    
    // Charger config.yml
    fetch('/admin/config.yml')
      .then(res => res.text())
      .then(yaml => {
        const parser = new window.DOMParser();
        // Note: besoin d'un parser YAML en production
        console.log('Config loaded');
      })
      .catch(err => console.error('Failed to load config:', err));
    
    // Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init({
        url: "${siteUrl}/.netlify/identity",
        audience: "${siteUrl}",
      });
      
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
    
    // Initialiser CMS
    if (window.CMS) {
      window.CMS.init(config);
    }
  </script>
</body>
</html>`;
}

export function writeAdminIndexHtml(options: { outputDir: string; siteUrl: string; logoUrl?: string }): void {
  const { outputDir, siteUrl, logoUrl } = options;
  const adminDir = join(outputDir, 'admin');
  
  if (!existsSync(adminDir)) {
    mkdirSync(adminDir, { recursive: true });
  }
  
  const html = generateAdminIndexHtml({ siteUrl, logoUrl });
  writeFileSync(join(adminDir, 'index.html'), html, 'utf-8');
}