/**
 * Configuration Netlify Identity & Git Gateway
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import type { NetlifyIdentityConfig, GitGatewayConfig } from './types.js';

export interface NetlifySetupOptions {
  outputDir: string;
  identity?: Partial<NetlifyIdentityConfig>;
  gitGateway?: Partial<GitGatewayConfig>;
  siteUrl?: string;
}

export function generateNetlifyConfig(options: NetlifySetupOptions): { identity: NetlifyIdentityConfig; gitGateway: GitGatewayConfig } {
  const identity: NetlifyIdentityConfig = {
    enabled: true,
    url: options.siteUrl,
    audience: options.siteUrl,
    external_providers: ['google', 'github'],
    registration_preferences: 'email_password',
    password_strength: 3,
    email_templates: {
      signup: `
<h1>Bienvenue sur Kiki en Christ !</h1>
<p>Merci de vous être inscrit. Veuillez confirmer votre email en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
      `.trim(),
      recovery: `
<h1>Réinitialisation de votre mot de passe</h1>
<p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p>
<p><a href="{{ .RecoveryURL }}">Réinitialiser mon mot de passe</a></p>
      `.trim(),
      confirmation: `
<h1>Confirmation d'inscription</h1>
<p>Votre inscription a été confirmée. Bienvenue !</p>
      `.trim(),
    },
    ...options.identity,
  };
  
  const gitGateway: GitGatewayConfig = {
    enabled: true,
    branch: 'main',
    ...options.gitGateway,
  };
  
  return { identity, gitGateway };
}

export function writeNetlifyConfig(options: NetlifySetupOptions): void {
  const { identity, gitGateway } = generateNetlifyConfig(options);
  
  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }
  
  // netlify.toml pour Identity & Git Gateway
  const netlifyToml = `[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[identity]
  enabled = ${identity.enabled}
  url = "${identity.url}"
  audience = "${identity.audience}"
  external_providers = ${JSON.stringify(identity.external_providers)}
  registration_preferences = "${identity.registration_preferences}"
  password_strength = ${identity.password_strength}

[git_gateway]
  enabled = ${gitGateway.enabled}
  branch = "${gitGateway.branch}"
  ${gitGateway.repo_path ? `repo_path = "${gitGateway.repo_path}"` : ''}
`;
  
  writeFileSync(join(options.outputDir, 'netlify.toml'), netlifyToml, 'utf-8');
  
  // _redirects pour SPA admin
  const redirects = `# Decap CMS Admin
/admin/* /admin/index.html 200

# Netlify Identity
/.netlify/identity/* /.netlify/identity/:splat 200
`;
  
  writeFileSync(join(options.outputDir, '_redirects'), redirects, 'utf-8');
}

export function generateIdentityWidgetCode(siteUrl: string): string {
  return `<!-- Netlify Identity Widget -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.init({
      url: "${siteUrl}/.netlify/identity",
      audience: "${siteUrl}",
    });
    
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>`;
}