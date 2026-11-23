---
name: kikienchrist-security
description: "Sécurité (Headers, CSP, Secrets, Dépendances, Formulaires, RGPD, Incident Response)"
version: "1.0"
---

# Skill: kikienchrist-security

## Posture
**Site statique + Edge Middleware + Forms tiers** = Surface d'attaque réduite.
Focus : **Headers de sécurité**, **Gestion secrets**, **Dépendances**, **RGPD**.

---

## 1. Headers de Sécurité (Vercel + Middleware)

### `vercel.json` (Headers Statiques)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" }
      ]
    },
    {
      "source": "/styles/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### Middleware Edge (Headers Dynamiques)
```typescript
// src/middleware.ts - Ajouter dans la réponse
const response = NextResponse.next();
// ou Response.redirect(...)

// Security Headers sur TOUTES les réponses
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

// HSTS (si HTTPS uniquement - Vercel gère auto)
// Content-Security-Policy (voir section CSP ci-dessous)

return response;
```

---

## 2. Content Security Policy (CSP)

### Politique Recommandée (Report-Only d'abord)
```typescript
// src/middleware.ts - CSP Header
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.jsdelivr.net", // GA4, Netlify Forms
  "style-src 'self' 'unsafe-inline'", // CSS inline (Astro + composants)
  "img-src 'self' data: https://i.ibb.co https://payhip.com https://pe56d.s3.amazonaws.com https://www.gstatic.com", // ImgBB, Payhip CDN, Google Play
  "font-src 'self' data:", // System fonts + data: pour fonts CSS
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://api.netlify.com https://forms.netlify.com", // GA4, Netlify Forms
  "frame-src https://www.google.com https://play.google.com", // Google Play embed si utilisé
  "form-action 'self' https://api.netlify.com https://forms.netlify.com", // Netlify Forms submission
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

// En production : report-only d'abord pour détecter cassures
// response.headers.set('Content-Security-Policy-Report-Only', csp);
// Puis après validation :
// response.headers.set('Content-Security-Policy', csp);
```

### Directives Expliquées
| Directive | Valeur | Raison |
|-----------|--------|--------|
| `default-src` | `'self'` | Base restrictive |
| `script-src` | `'self' 'unsafe-inline' https://www.googletagmanager.com` | GA4 + scripts inline Astro (inévitable) |
| `style-src` | `'self' 'unsafe-inline'` | CSS inline (Astro components) |
| `img-src` | `'self' data: https://i.ibb.co https://payhip.com...` | Images externes autorisées |
| `connect-src` | `'self' https://www.google-analytics.com https://api.netlify.com` | XHR/Fetch vers analytics + forms |
| `form-action` | `'self' https://api.netlify.com https://forms.netlify.com` | Soumission formulaires |
| `frame-ancestors` | `'none'` | Anti-clickjacking (remplace X-Frame-Options) |

### Test CSP
```bash
# 1. Déployer en Report-Only
# 2. Surveiller console navigateur + Vercel Logs pour violations
# 3. Ajuster directives si cassures (ex: nouveau script tiers)
# 4. Basculer en mode enforcing
```

---

## 3. Gestion des Secrets

### Classification
| Type | Exemples | Stockage | Rotation |
|------|----------|----------|----------|
| **Public (Client)** | `PUBLIC_GA_ID`, `PUBLIC_SITE_URL` | `.env` + Vercel Env (PUBLIC_*) | Rare |
| **Secrets (Server/Edge)** | `SENTRY_DSN`, `MAILERLITE_API_KEY`, `NETLIFY_WEBHOOK_SECRET` | Vercel Env (NON public) | 90 jours |
| **Critiques** | Clés API paiement (si futur) | Vault externe / Vercel Env + rotation auto | 30 jours |

### Règles d'Or
1. **JAMAIS** de secret dans `PUBLIC_*` (exposé côté client)
2. **JAMAIS** de secret dans code/git (même `.env.local` → `.gitignore`)
3. **TOUJOURS** via Vercel Dashboard → Settings → Environment Variables
4. **Rotation** : Script automatisé ou manuel trimestriel

### `.gitignore` (Critique)
```gitignore
# Secrets & Env
.env
.env.local
.env.*.local
*.pem
*.key
*.crt

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

### Audit Secrets (Mensuel)
```bash
# 1. Vérifier Vercel Dashboard → Environment Variables
# 2. Confirmer : aucun secret dans PUBLIC_*
# 3. Vérifier rotation > 90 jours → Planifier rotation
# 4. Révoquer accès anciens membres (Vercel Team Settings)
```

---

## 4. Sécurité Dépendances

### Audit Automatisé
```bash
# Local
npm audit
npm audit fix

# CI (GitHub Actions)
- name: Audit dependencies
  run: npm audit --audit-level=high
```

### `package.json` (Config Sécurité)
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "deps:outdated": "npm outdated"
  }
}
```

### Dependabot (GitHub)
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    labels: ["dependencies", "security"]
    commit-message:
      prefix: "chore(deps)"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"] # Majeur = review manuel
```

### Politique Mise à Jour
| Sévérité | Action | Délai |
|----------|--------|-------|
| **Critical** (RCE, auth bypass) | Merge auto si tests passent + deploy immédiat | < 24h |
| **High** (XSS, injection) | PR auto + review + deploy | < 72h |
| **Moderate** | PR auto + review mensuelle | < 30 jours |
| **Low** | Groupé mensuel | Prochain sprint |

---

## 5. Sécurité Formulaires (Netlify Forms)

### Protections Natives Netlify
- **Honeypot** : Champ caché `form-name` + détection bots
- **Rate Limiting** : 100 soumissions/heure/IP (gratuit)
- **Spam Filter** : Akismet intégré (optionnel)
- **reCAPTCHA v3** : Support natif (config Netlify Dashboard)

### Renforcement Côté Client
```astro
<!-- Newsletter.astro -->
<form class="capture" action="#" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
  <!-- Honeypot manuel additionnel -->
  <input type="checkbox" name="bot-field" style="display: none" tabindex="-1" autocomplete="off">
  
  <label for="newsletter-email" class="visually-hidden">{t.newsletter.placeholder}</label>
  <input 
    type="email" 
    id="newsletter-email"
    name="email" 
    placeholder={t.newsletter.placeholder} 
    required 
    autocomplete="email"
    maxlength="254"
    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  >
  <button class="btn btn-primary" type="submit">{t.newsletter.buttonText}</button>
</form>
```

### Validation Côté Serveur (Netlify Functions - Optionnel)
```typescript
// netlify/functions/validate-newsletter.ts
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  
  const { email } = JSON.parse(event.body || '{}');
  
  // Validation stricte
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: 'Invalid email' };
  }
  
  // Rate limit par IP (Netlify le fait nativement)
  // Liste noire domaines jetables (optionnel)
  const disposableDomains = ['tempmail.com', '10minutemail.com', ...];
  if (disposableDomains.some(d => email.endsWith(`@${d}`))) {
    return { statusCode: 400, body: 'Disposable email not allowed' };
  }
  
  // Forward à Netlify Forms ou API MailerLite
  return { statusCode: 200, body: 'OK' };
};
```

---

## 6. RGPD / Conformité Vie Privée

### Données Collectées
| Donnée | Source | Base Légale | Rétention | Partage |
|--------|--------|-------------|-----------|---------|
| **Email** | Newsletter | Consentement (opt-in) | Jusqu'à désinscription | MailerLite/Brevo (processeur) |
| **Cookie `preferred-lang`** | Middleware | Intérêt légitime (UX) | 1 an | Vercel (infra) |
| **Analytics (GA4)** | GA4 | Consentement (cookie banner) | 14 mois (défaut GA4) | Google (processeur) |
| **Logs Vercel** | Vercel | Intérêt légitime (sécurité/perf) | 30 jours (gratuit) | Vercel (infra) |
| **Sentry Errors** | Sentry | Intérêt légitime (stabilité) | 90 jours | Sentry (processeur) |

### Obligations
1. **Registre des traitements** : Documenter ci-dessus (Art. 30 RGPD)
2. **Information utilisateurs** : `tinyText` newsletter + Privacy Policy page
3. **Droits utilisateurs** : Accès, rectification, effacement, portabilité, opposition
4. **Sous-traitance** : DPA signés avec MailerLite, Google, Vercel, Sentry, Netlify
5. **Transferts hors UE** : Clauses contractuelles types (SCC) - vérifier pour chaque processeur

### Privacy Policy (À Créer - `/fr/confidentialite/`)
```markdown
# Politique de Confidentialité

**Responsable** : Kiki en Christ (contact@kikienchrist.vercel.app)

## Données Collectées
1. **Newsletter** : Email (consentement) → MailerLite
2. **Langue** : Cookie `preferred-lang` (1 an, UX)
3. **Analytics** : GA4 anonyme (IP anonymisée) → Google
4. **Erreurs** : Sentry (pas de PII) → Sentry

## Vos Droits
- Accès / Rectification / Effacement : contact@...
- Désinscription newsletter : lien bas de chaque email
- Refus cookies : banner cookie (si GA4)

## Sous-traitants (Hors UE → SCC)
- Vercel (US) → Infrastructure
- Google (US) → GA4
- Sentry (US) → Error tracking
- MailerLite (UE) → Email
- Netlify (US) → Forms

## Contact DPO
contact@kikienchrist.vercel.app
```

### Cookie Banner (Si GA4 Actif)
```astro
<!-- CookieBanner.astro -->
<script is:inline>
  const hasConsent = localStorage.getItem('cookie-consent') === 'true';
  const banner = document.getElementById('cookie-banner');
  if (!hasConsent && banner) banner.classList.remove('hidden');
  
  window.acceptAnalytics = () => {
    localStorage.setItem('cookie-consent', 'true');
    banner?.classList.add('hidden');
    // Charger GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.PUBLIC_GA_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', import.meta.env.PUBLIC_GA_ID, { anonymize_ip: true });
  };
  
  window.rejectAnalytics = () => {
    localStorage.setItem('cookie-consent', 'false');
    banner?.classList.add('hidden');
  };
</script>

<div id="cookie-banner" class="cookie-banner hidden" role="dialog" aria-label="Consentement cookies">
  <p>Nous utilisons des cookies analytics pour améliorer votre expérience. <a href="/fr/confidentialite/">En savoir plus</a></p>
  <div class="cookie-actions">
    <button class="btn btn-primary" onclick="acceptAnalytics()">Accepter</button>
    <button class="btn btn-ghost" onclick="rejectAnalytics()">Refuser</button>
  </div>
</div>
```

---

## 7. Incident Response (Sécurité)

### Types d'Incidents Sécurité
| Type | Exemple | Sévérité | Réponse |
|------|---------|----------|---------|
| **Fuite Secret** | GA4 ID / Sentry DSN exposé dans repo | Critique | Rotation immédiate + audit accès |
| **XSS/Injection** | Contenu malveillant dans `translations.json` | Critique | Revert + deploy --force + audit |
| **Spam Forms** | 1000+ soumissions newsletter/jour | Majeure | Activer reCAPTCHA + rate limit + nettoyage |
| **DDoS** | Trafic anormal (Vercel gère auto) | Mineure | Surveiller + Vercel Support si soutenu |
| **Dépendance Vulnérable** | CVE critical dans `astro`/`sharp` | Critique | `npm audit fix` + deploy immédiat |

### Playbook Fuite Secret (Le Plus Probable)
```bash
# 1. DÉTECTION (GitHub Secret Scanning / TruffleHog / Manuel)
# 2. ROTATION IMMÉDIATE (≤ 1h)
#    - GA4 : Admin → Data Stream → Delete → Recréer (nouveau G-XXXX)
#    - Sentry : Settings → Project → DSN → Regenerate
#    - MailerLite : Account → API Keys → Revoke + Generate
#    - Netlify : Site Settings → Forms → Reset endpoint
# 3. MISE À JOUR VERCEL ENV
#    Vercel Dashboard → Settings → Environment Variables → Update
# 4. DEPLOY --FORCE
npm run build && vercel --prod --force
# 5. AUDIT ACCÈS
#    - Git history : qui a vu le secret ?
#    - Vercel Team : membres avec accès Env Variables
#    - GitHub : collaborateurs repo
# 6. DOCUMENTATION
#    Incident log (GitHub Issue) : timeline, actions, leçons
# 7. POST-MORTEM (48h)
#    Root cause, prévention (pre-commit hooks, secret scanning)
```

### Outils Prévention
- **GitHub Secret Scanning** : Activé par défaut (gratuit)
- **TruffleHog** : `trufflehog git file://. --since-commit=HEAD~10` (pre-commit)
- **Pre-commit Hook** : `husky` + `trufflehog` ou `gitleaks`

```bash
# Installation pre-commit
npm install -D husky gitleaks
npx husky install
npx husky add .husky/pre-commit "gitleaks protect --staged -v"
```

---

## 8. Checklist Sécurité Mensuelle

- [ ] `npm audit` → 0 critical/high non résolus
- [ ] Dependabot PRs → Review + merge
- [ ] Vercel Env Variables → Aucun secret dans PUBLIC_*, rotation > 90j planifiée
- [ ] CSP Report-Only → 0 violations non expliquées
- [ ] Netlify Forms → Spam rate < 5%, reCAPTCHA si > 10%
- [ ] Sentry → 0 erreurs PII exposées
- [ ] GA4 → IP anonymisée confirmée, consentement cookie banner fonctionnel
- [ ] Privacy Policy → À jour (dernière révision < 12 mois)
- [ ] Registre traitements → À jour
- [ ] Sauvegarde `translations.json` + skills → Git (chiffré si sensible)
- [ ] Pre-commit hooks → Actifs (gitleaks/husky)

---

## 9. Contacts & Ressources

| Ressource | Usage |
|-----------|-------|
| **Vercel Security** | `vercel.com/security` / Support Pro |
| **GitHub Security Advisories** | `github.com/advisories` |
| **npm Audit** | `npm audit` / `github.com/advisories?type=malware` |
| **OWASP Top 10** | `owasp.org/www-project-top-ten/` |
| **CNIL Guide** | `cnil.fr/rgpd` (FR) |
| **Have I Been Pwned** | `haveibeenpwned.com` (vérif emails) |

---
*Skill créé le 2025-11-20. Sécurité = processus continu, pas état final.*