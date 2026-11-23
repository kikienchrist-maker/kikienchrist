---
name: kikienchrist-newsletter
description: "Gestion de la newsletter (Netlify Forms) — composant, champs, style, test, RGPD"
version: "1.0"
---

# Skill: kikienchrist-newsletter

## Composant
`src/components/Newsletter.astro` — Section d'inscription avec formulaire Netlify Forms.

## Props (via `translations.json` → `newsletter`)
```json
"newsletter": {
  "title": "Recevez « 7 prières » gratuitement",
  "description": "Un guide PDF pour apprivoiser la prière, même (surtout) quand on ne sait pas par où commencer.",
  "placeholder": "Votre email",
  "buttonText": "Je veux le guide",
  "tinyText": "Pas de spam. Désinscription en 1 clic. Vos données restent privées."
}
```

## HTML généré
```html
<div class="leadbox" id="newsletter">
  <h2>{title}</h2>
  <p>{description}</p>
  <form class="capture" action="#" method="POST" data-netlify="true">
    <input type="email" name="email" placeholder="{placeholder}" required>
    <button class="btn btn-primary" type="submit">{buttonText}</button>
  </form>
  <p class="tiny">{tinyText}</p>
</div>
```

## Netlify Forms — Configuration
- **Attributs requis** : `data-netlify="true"` + `name="email"` sur l'input
- **Pas de JavaScript** — Netlify intercepte au deploy (build-time)
- **Spam protection** : Honeypot automatique (champ caché `form-name`)
- **Notifications** : Configurer dans Netlify Dashboard → Forms → Notifications (email/Slack/webhook)

## Test en local
```bash
# Netlify Forms ne marche PAS en local (dev)
# Options :
# 1. vercel dev + netlify-cli proxy (complexe)
# 2. Test sur Preview Deploy (Vercel Preview URL) → formulaire fonctionnel
# 3. Simuler : vérifier HTML généré (data-netlify="true" présent)
```

## RGPD / Conformité
- **Consentement explicite** : Case à cocher non requise si "intérêt légitime" (lead magnet gratuit) — mais recommandée
- **Mentions** : `tinyText` couvre : pas de spam, désinscription 1 clic, données privées
- **Stockage** : Netlify (UE/US selon plan) — vérifier Data Processing Addendum
- **Droit à l'oubli** : Netlify Dashboard → Forms → Submissions → Delete

## Améliorations possibles
- [ ] Ajouter `name="newsletter-signup"` au `<form>` pour identification Netlify
- [ ] Honeypot manuel : `<input type="checkbox" name="bot-field" style="display:none">` (piège bots)
- [ ] Double opt-in : email de confirmation + lien validation (via Netlify Functions ou Zapier/Make)
- [ ] Intégration MailerLite / Brevo / ConvertKit (webhook Netlify → API provider)
- [ ] reCAPTCHA v3 invisible (Netlify le supporte nativement)

## Style (lafoidieu-design.css)
```css
.leadbox { background: var(--cream); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: clamp(24px, 4vw, 48px); text-align: center; margin: 48px 0; }
.leadbox h2 { font-size: clamp(22px, 3vw, 30px); margin: 0 0 12px; }
.leadbox p { color: var(--muted); margin: 0 0 20px; }
.leadbox .capture { display: flex; gap: 12px; max-width: 420px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
.leadbox input[type="email"] { flex: 1; min-width: 220px; padding: 14px 18px; border: 1px solid var(--line); border-radius: var(--radius); font: inherit; background: var(--paper); }
.leadbox .btn-primary { padding: 14px 28px; font-weight: 700; white-space: nowrap; }
.leadbox .tiny { font-size: 12px; color: var(--muted); margin-top: 16px; }
```

## Debug checklist
- [ ] `data-netlify="true"` présent sur `<form>`
- [ ] `name="email"` sur `<input>`
- [ ] Deploy Vercel → Preview URL → test soumission
- [ ] Netlify Dashboard → Forms → voir la soumission
- [ ] Email de notification reçu
- [ ] tinyText affiché (mentions RGPD)

---
*Skill créé le 2025-11-20. Netlify Forms = zero-JS, zero-backend, gratuit.*