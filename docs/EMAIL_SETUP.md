# Email Marketing Setup — MailerLite + Netlify Functions

## 1. MailerLite Dashboard Configuration

### Groups à créer

| Group ID                    | Nom                         | Description                  |
| --------------------------- | --------------------------- | ---------------------------- |
| `blog-subscribers`          | Blog Subscribers            | Tous les inscrits newsletter |
| `lead-magnet-guide-priere`  | Lead Magnet: Guide Prière   | Inscrits via guide de prière |
| `lead-magnet-ebook-trinite` | Lead Magnet: E-book Trinité | Inscrits via e-book Trinité  |

### Custom Fields (Subscribers > Custom Fields)

| Key           | Label          | Type |
| ------------- | -------------- | ---- |
| `lang`        | Language       | Text |
| `source`      | Source         | Text |
| `lead_magnet` | Lead Magnet ID | Text |

### Automation: Welcome Sequence

1. **Automation > New Workflow** > "Welcome Sequence"
2. **Trigger**: "When subscriber joins group" > Select `blog-subscribers`
3. **Add 5 Email steps** avec delays:
   - Email 1: Immédiat (Welcome + Lead Magnet)
   - Email 2: Delay 1 day ("Pourquoi j'ai écrit ces livres")
   - Email 3: Delay 3 days ("Mon témoignage")
   - Email 4: Delay 7 days ("3 habitudes pour prier")
   - Email 5: Delay 14 days ("Invitation communauté")

### Email Templates

- Copier le MJML depuis `emails/welcome-sequence.mjml` (5 blocs séparés)
- Dans MailerLite: Emails > Templates > Create > Drag & Drop > Code editor > Coller MJML
- Variables disponibles: `{{name}}`, `{{email}}`, `{{lang}}`, `{{source}}`, `{{lead_magnet}}`, `{{lead_magnet_title}}`, `{{lead_magnet_url}}`, `{{unsubscribe_url}}`, `{{preferences_url}}`

---

## 2. Netlify Functions Deployment

### Deploy

```bash
# Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist --functions=netlify/functions
```

### Variables d'environnement (Netlify Dashboard > Site > Settings > Environment Variables)

| Variable                   | Valeur                  | Description                                         |
| -------------------------- | ----------------------- | --------------------------------------------------- |
| `MAILERLITE_API_KEY`       | `ml_xxxxxxxxx`          | Clé API MailerLite (Account > Developer > API Keys) |
| `MAILERLITE_BLOG_GROUP_ID` | `blog-subscribers`      | Group ID exact                                      |
| `RECAPTCHA_SECRET_KEY`     | `6Lxxxxxxxx`            | Optionnel: reCAPTCHA v3 secret                      |
| `LEAD_MAGNET_SECRET`       | `random-32-char-string` | Pour signature tokens delivery                      |

### Test local

```bash
netlify dev
# POST http://localhost:8888/.netlify/functions/subscribe
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","lang":"fr","leadMagnet":true,"leadMagnetId":"guide-priere","source":"blog-sidebar"}'
```

---

## 3. Frontend Integration (NewsletterForm.astro)

Le composant `src/components/blog/NewsletterForm.astro` appelle déjà `/.netlify/functions/subscribe` via `fetch()`.

### Lead Magnet Checkbox

```astro
<input type="checkbox" name="leadMagnet" id="leadMagnet" value="guide-priere" />
<label for="leadMagnet"> Recevoir le guide gratuit "7 Clés pour une Prière Efficace" </label>
```

### GA4 Event (déjà dans ab-tracking.ts)

```typescript
trackExperimentConversion('newsletter-form-position', 'newsletter_signup');
```

---

## 4. Lead Magnet Delivery Flow

1. User submits form with `leadMagnet=true` + `leadMagnetId=guide-priere`
2. Function subscribes to MailerLite + adds to `lead-magnet-guide-priere` group
3. Returns `{ leadMagnetUrl: "https://kikienchrist.vercel.app/lead-magnets/guide-priere.pdf" }`
4. Frontend shows success message with download link
5. Email 1 (automation) also includes the download link

### Sécurisation (optionnel)

- Utiliser `netlify/functions/deliver-lead-magnet.ts` pour URLs signées (expiration 1h)
- Stocker PDFs dans Netlify Blobs / Vercel Blob / S3 (pas en public)

---

## 5. Checklist Déploiement

- [ ] MailerLite groups créés
- [ ] Custom fields configurés
- [ ] 5 emails MJML importés dans MailerLite
- [ ] Automation "Welcome Sequence" activée
- [ ] Netlify Functions déployées
- [ ] Variables d'env Netlify configurées
- [ ] Test inscription complète (form → MailerLite → Email 1 reçu)
- [ ] Lead magnet téléchargeable
- [ ] GA4 event `newsletter_signup` visible dans DebugView
