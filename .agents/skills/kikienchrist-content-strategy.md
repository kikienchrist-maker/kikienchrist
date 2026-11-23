---
name: kikienchrist-content-strategy
description: "Stratégie Contenu & Éditoriale (Blog, SEO, Lead Magnets, Réseaux Sociaux, Email Marketing) — Version Complète avec Implémentation Technique"
version: "1.1"
---

# Skill: kikienchrist-content-strategy

## Positionnement
**Site vitrine + Lead Gen** pour 4 livres spirituels ("Foi en Dieu").
- **Cible** : Chrétiens en quête, chercheurs spirituels, lecteurs développement personnel
- **Ton** : Bienveillant, profond, accessible, sans dogme
- **Objectifs** : 
  1. Vendre les livres (Lulu/Payhip/Google Play)
  2. Capturer emails (lead magnet "7 prières")
  3. Autorité SEO (requêtes "spiritualité", "Foi", "Dieu", "livres chrétiens")

---

## 1. Blog — Implémentation Technique (Astro Collections)

### Configuration (`astro.config.mjs`)
```javascript
import { defineConfig } from 'astro/config';
import { glob } from 'astro/loaders';

export default defineConfig({
  // ... existing config
  content: {
    collections: {
      blog: {
        loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
        schema: ({ z }) => ({
          title: z.string(),
          description: z.string(),
          pubDate: z.date(),
          author: z.string().default('Kiki en Christ'),
          tags: z.array(z.string()).default([]),
          image: z.string().optional(), // Hero image path
          canonical: z.string().optional(),
          lang: z.enum(['fr', 'en', 'es', 'de', 'pt', 'it', 'ru', 'zh', 'hi']).default('fr'),
          featured: z.boolean().default(false),
        }),
      },
    },
  },
});
```

### Structure Dossiers
```
src/content/blog/
├── fr/
│   ├── comment-prier-quand-les-mots-manquent.md
│   ├── dieu-est-il-silencieux.md
│   └── ...
├── en/
│   ├── how-to-pray-when-words-fail.md
│   └── ...
├── es/
│   └── ...
... (9 langues)
```

### Frontmatter Exemple (`fr/comment-prier-quand-les-mots-manquent.md`)
```markdown
---
title: "Comment prier quand les mots manquent : 7 approches simples"
description: "Vous ne savez pas par où commencer ? Découvrez 7 façons d'apprivoiser la prière, même (surtout) quand les mots manquent. Guide gratuit inclus."
pubDate: 2025-12-01
author: "Kiki en Christ"
tags: ["spiritualité", "prière", "débutant", "guide"]
image: "/images/blog/priere-debutant.webp"
canonical: "https://kikienchrist.vercel.app/fr/blog/comment-prier-quand-les-mots-manquent"
lang: "fr"
featured: true
---

# Comment prier quand les mots manquent

**Extrait** : La prière n'est pas une performance. C'est une rencontre. Voici 7 façons simples de commencer aujourd'hui, même si vous ne savez pas quoi dire.

## Introduction
...
```

### Composant `BlogPost.astro` (Rendu Article)
```astro
---
import { getCollection } from 'astro:content';
import MainLayout from '../../layouts/MainLayout.astro';
import { generateHreflangLinks } from '../../utils/i18n';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { lang: post.data.lang, slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const locale = post.data.lang;
const t = (await import(`../../data/translations.json`))[locale];

const hreflangLinks = generateHreflangLinks(`/blog/${post.slug}`, locale);
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "description": post.data.description,
  "image": post.data.image ? `https://kikienchrist.vercel.app${post.data.image}` : undefined,
  "datePublished": post.data.pubDate.toISOString(),
  "author": { "@type": "Person", "name": post.data.author },
  "publisher": { "@type": "Organization", "name": "Kiki en Christ", "logo": { "@type": "ImageObject", "url": "https://kikienchrist.vercel.app/images/logo.png" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://kikienchrist.vercel.app/${locale}/blog/${post.slug}` },
  "inLanguage": locale,
};
---

<MainLayout 
  title={post.data.title} 
  description={post.data.description}
  canonical={`https://kikienchrist.vercel.app/${locale}/blog/${post.slug}`}
  ogImage={post.data.image}
  hreflangLinks={hreflangLinks}
  jsonLd={jsonLd}
>
  <article class="bq blog-post">
    <header class="blog-header">
      <span class="blog-tag">{post.data.lang === 'fr' ? 'Article' : 'Article'}</span>
      <h1>{post.data.title}</h1>
      <p class="blog-excerpt">{post.data.description}</p>
      <div class="blog-meta">
        <time datetime={post.data.pubDate.toISOString()}>
          {post.data.pubDate.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <span class="blog-author">{post.data.author}</span>
      </div>
      {post.data.image && (
        <img src={post.data.image} alt="" class="blog-hero" width="1200" height="630" loading="eager" />
      )}
    </header>
    
    <div class="blog-content" set:html={Content} />
    
    <!-- CTA Newsletter inline -->
    <div class="leadbox inline-cta">
      <h3>{t.newsletter.title}</h3>
      <p>{t.newsletter.description}</p>
      <form class="capture" action="#" method="POST" data-netlify="true">
        <input type="email" name="email" placeholder={t.newsletter.placeholder} required>
        <button class="btn btn-primary" type="submit">{t.newsletter.buttonText}</button>
      </form>
      <p class="tiny">{t.newsletter.tinyText}</p>
    </div>
    
    <!-- CTA Livre pertinent -->
    <div class="cta-strip">
      <p>{t.cta.text}</p>
      <a href="#livres" class="btn btn-primary">{t.cta.buttonText}</a>
    </div>
  </article>
</MainLayout>
```

### Index Blog (`src/pages/[lang]/blog/index.astro`)
```astro
---
import { getCollection } from 'astro:content';
import MainLayout from '../../../layouts/MainLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const langs = [...new Set(posts.map(p => p.data.lang))];
  return langs.map(lang => ({
    params: { lang },
    props: { 
      posts: posts.filter(p => p.data.lang === lang).sort((a,b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    },
  }));
}

const { locale } = Astro.props;
const { posts } = Astro.props;
const t = (await import(`../../../data/translations.json`))[locale];
---

<MainLayout title={t.blog?.title || "Blog"} description={t.blog?.description}>
  <section class="bq blog-index">
    <h1>{t.blog?.title || "Articles & Ressources"}</h1>
    <p>{t.blog?.description || "Approfondissez votre chemin spirituel avec nos guides pratiques."}</p>
    
    <div class="blog-grid">
      {posts.map(post => (
        <article class="blog-card">
          {post.data.image && <img src={post.data.image} alt="" width="400" height="225" loading="lazy" />}
          <div class="blog-card-content">
            <span class="blog-tag">{post.data.tags[0]}</span>
            <h2><a href={`/${locale}/blog/${post.slug}/`}>{post.data.title}</a></h2>
            <p class="blog-excerpt">{post.data.description}</p>
            <a href={`/${locale}/blog/${post.slug}/`} class="btn btn-ghost">Lire la suite</a>
          </div>
        </article>
      ))}
    </div>
  </section>
</MainLayout>
```

### Styles Blog (Ajouter à `lafoidieu-design.css`)
```css
/* Blog Index */
.blog-index { max-width: 800px; margin: 0 auto; padding: 48px 20px; }
.blog-grid { display: grid; gap: 32px; }
.blog-card { display: grid; gap: 16px; border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; background: var(--paper); transition: transform var(--transition), box-shadow var(--transition); }
.blog-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.blog-card img { width: 100%; height: 225px; object-fit: cover; }
.blog-card-content { padding: 24px; display: grid; gap: 12px; }
.blog-tag { display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--gold-ink); letter-spacing: 0.08em; }
.blog-card h2 { margin: 0; font-size: 22px; line-height: 1.3; }
.blog-card h2 a { color: var(--ink); text-decoration: none; }
.blog-card h2 a:hover { color: var(--gold-ink); }
.blog-excerpt { color: var(--muted); margin: 0; }

/* Blog Post */
.blog-post { max-width: 800px; margin: 0 auto; padding: 48px 20px; }
.blog-header { margin-bottom: 48px; }
.blog-tag { display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--gold-ink); letter-spacing: 0.08em; margin-bottom: 16px; }
.blog-header h1 { font-size: clamp(28px, 4vw, 42px); line-height: 1.2; margin: 0 0 16px; }
.blog-excerpt { font-size: 1.1rem; color: var(--muted); margin: 0 0 24px; }
.blog-meta { display: flex; gap: 24px; font-size: 14px; color: var(--muted); }
.blog-hero { width: 100%; height: auto; max-height: 500px; object-fit: cover; border-radius: var(--radius-lg); margin-top: 32px; }
.blog-content { font-size: 1.05rem; line-height: 1.8; color: var(--ink); }
.blog-content h2 { margin: 48px 0 16px; font-size: 1.5rem; color: var(--ink); }
.blog-content h3 { margin: 32px 0 12px; font-size: 1.2rem; color: var(--ink); }
.blog-content p { margin: 0 0 24px; }
.blog-content a { color: var(--gold-ink); text-decoration: underline; }
.blog-content ul, .blog-content ol { margin: 16px 0 24px 24px; }
.blog-content li { margin: 8px 0; }
.blog-content blockquote { border-left: 3px solid var(--gold-ink); padding-left: 24px; margin: 24px 0; font-style: italic; color: var(--muted); }
.blog-content img { max-width: 100%; height: auto; border-radius: var(--radius); margin: 24px 0; }

/* Inline CTA */
.inline-cta { margin: 48px 0; }
.inline-cta h3 { margin: 0 0 12px; font-size: 20px; }
.inline-cta .capture { max-width: 420px; }
```

---

## 2. Calendrier Éditorial (12 Premiers Mois)

| Mois | Thème | Articles (FR) | Mots-clés Cibles | Livre Lié |
|------|-------|---------------|------------------|-----------|
| **M1** | Prière Pratique | 1. Comment prier quand les mots manquent<br>2. Créer un coin prière chez soi | "comment prier", "espace prière" | Newsletter + Livre 1 |
| **M2** | Foi & Doute | 3. Dieu est-il silencieux ?<br>4. Le doute fait-il partie de la foi ? | "dieu silencieux", "doute foi" | Livre 3 (Combat) |
| **M3** | Vie Quotidienne | 5. Routine matinale spirituelle (10 min)<br>6. Pardonner vraiment : 4 étapes | "routine spirituelle", "pardon christianisme" | Livre 1 + 3 |
| **M4** | Ressources | 7. Top 10 livres spiritualité 2025<br>8. Comment choisir sa Bible d'étude | "livres spiritualité", "bible étude" | Tous (comparatif) |
| **M5** | Prière Avancée | 9. La prière du cœur (hesychasme)<br>10. Journaling spirituel : méthode | "prière du cœur", "journaling spirituel" | Livre 1 |
| **M6** | Souffrance & Sens | 11. Pourquoi la souffrance ?<br>12. Trouver la paix dans l'épreuve | "souffrance sens", "paix épreuve" | Livre 3 |
| **M7** | Trinité & Théologie | 13. La Trinité expliquée simplement<br>14. Jésus : Dieu ou prophète ? | "trinité expliquée", "jesus dieu" | Livre 2 (Trinité) |
| **M8** | Salut & Éternité | 15. Qu'est-ce que le salut ?<br>16. La vie après la mort | "salut christianisme", "vie après mort" | Livre 4 (Salut) |
| **M9** | Pratique Avancée | 17. Jeûne spirituel : guide débutant<br>18. Lectio Divina : méthode en 4 étapes | "jeûne spirituel", "lectio divina" | Livre 1 |
| **M10** | Communauté | 19. Trouver une église qui vous correspond<br>20. Servir sans s'épuiser | "église chrétienne", "service chrétien" | Newsletter |
| **M11** | Témoignages | 21. Histoire : Comment la prière a changé ma vie<br>22. De l'athéisme à la foi | "témoignage conversion", "athéisme foi" | Tous |
| **M12** | Bilan & Projection | 23. Best-of 2025 : vos articles préférés<br>24. Projets 2026 + sondage lecteurs | "bilan spirituel", "objectifs 2026" | Newsletter + Livres |

**Total** : 24 articles/an (2/mois) × 9 langues = **216 articles/an** (traduction requise)

---

## 3. Lead Magnet — "7 Prières" (PDF Multi-langues)

### Contenu PDF (1 page par prière)
| # | Titre FR | Thème | Hook |
|---|----------|-------|------|
| 1 | Prière du matin | Offrande journée | "Commencez la journée les mains ouvertes" |
| 2 | Prière de la paix | Anxiété/peur | "Quand tout tremble en vous" |
| 3 | Prière de gratitude | Reconnaissance | "Ce que vous avez est un don" |
| 4 | Prière du pardon | Libération | "Le pardon vous libère en premier" |
| 5 | Prière pour les autres | Intercession | "Aimer, c'est porter" |
| 6 | Prière du soir | Examen conscience | "Déposez le fardeau avant de dormir" |
| 7 | Prière de l'instant présent | Conscience | "Dieu est dans le maintenant" |

### Traduction Requise
- **9 langues** : FR, EN, ES, DE, PT, IT, RU, ZH, HI
- **Format** : A4, design cohérent avec site (tokens CSS → PDF)
- **Outil** : Canva / Figma → Export PDF → Héberger sur Vercel Blob ou Netlify

### Livraison Automatisée
```javascript
// Netlify Forms → Webhook → MailerLite/Brevo/ConvertKit
// Webhook payload : { email, form_name: "newsletter", locale: "fr" }
// Action : Add to segment "fr_newsletter" + Send "7 prières FR" (email avec lien PDF)
```

---

## 4. Email Marketing — Séquences Détaillées

### Séquence Bienvenue (14 jours / 5 emails)
| Jour | Objet FR | Contenu Clé | CTA Principal | Livre Mis en Avant |
|------|----------|-------------|---------------|-------------------|
| 0 | "Vos 7 prières sont arrivées 🙏" | Livraison PDF + mot personnel | Télécharger le guide | — |
| 2 | "Pourquoi 2 min de prière changent tout" | Bénéfices + extrait Livre 1 | Découvrir "Le visage de Dieu" | Livre 1 |
| 5 | "Le secret d'une vie spirituelle simple" | Témoignage + extrait Livre 3 | Découvrir "Le dernier Combat" | Livre 3 |
| 9 | "Vous n'êtes pas seul(e) dans vos doutes" | Empathie + extrait Livre 2 | Découvrir "Les secrets de la Trinité" | Livre 2 |
| 14 | "Une invitation pour aller plus loin" | Pack 4 livres / offre spéciale | Voir les 4 livres | Tous |

### Segmentation Avancée
| Segment | Critère | Contenu Spécifique |
|---------|---------|-------------------|
| `fr_newsletter` | Langue FR | Séquence FR |
| `en_newsletter` | Langue EN | Séquence EN (traduite) |
| `interest_book_1` | Clic lien Livre 1 | Follow-up Livre 1 |
| `interest_book_2` | Clic lien Livre 2 | Follow-up Livre 2 |
| `high_engagement` | Ouverture 4/5 emails | Offre pack / upsell |
| `inactive_30d` | Pas d'ouverture 30j | Réactivation (dernier email) |

### Provider Recommandé
- **MailerLite** : Gratuit ≤ 1000 abonnés, automation, landing pages, multilingue
- **Brevo (ex Sendinblue)** : Gratuit 300 emails/jour, SMS, CRM
- **ConvertKit** : Créateurs, tags puissants, payant dès le début

---

## 5. Réseaux Sociaux — Templates & Automatisation

### Formats par Plateforme
| Plateforme | Format | Dim. | Fréquence | Outils |
|------------|--------|------|-----------|--------|
| **Instagram** | Reel (vidéo 9:16) | 1080x1920 | 3/sem | CapCut, InShot |
| | Carrousel (images) | 1080x1080 | 2/sem | Canva |
| | Story | 1080x1920 | Quotidien | Canva |
| **Facebook** | Post image + lien | 1200x630 | 3/sem | Meta Business Suite |
| | Groupe (communauté) | - | 2/sem | Manuel |
| **YouTube Shorts** | Vidéo verticale | 1080x1920 | 2/sem | CapCut |
| **Pinterest** | Pin standard | 1000x1500 | 5/sem | Canva + Tailwind |
| | Pin vidéo | 1000x1500 | 2/sem | Canva |
| **TikTok** | Reel authentique | 1080x1920 | 2/sem | App native |

### Templates Canva (À Créer — 9 Langues)
1. **Citation Livre** : Fond texturé + citation + couverture miniature + "Lien en bio"
2. **Extrait Prière** : Fond apaisant + prière du lead magnet + "Téléchargez les 7 prières gratuites"
3. **Couverture Livre** : Hero image + titre + "Disponible en 9 langues"
4. **Article Blog** : Image hero article + titre + "Lire l'article complet"
5. **Preuve Sociale** : Capture avis lecteur + "Ce que nos lecteurs disent"

### Outil Planification
- **Buffer** (gratuit 10 posts/mois) ou **Later** ou **Metricool**
- **Workflow** : Créer batch mensuel → Planifier → Analyser → Ajuster

---

## 6. SEO Content — Cluster Strategy

### Pages Piliers (Cornerstone Content)
| Page | URL | Mots-clés Principaux | Contenu |
|------|-----|---------------------|---------|
| **Spiritualité Pratique** | `/fr/spiritualite/` | "spiritualité pratique", "vie spirituelle" | Hub + liens vers articles prière, méditation, routine |
| **Foi & Questionnements** | `/fr/foi-questions/` | "foi chrétienne", "doute foi", "questions dieu" | Hub + liens articles silence, souffrance, trinité |
| **Ressources Livres** | `/fr/ressources/` | "livres spiritualité", "livres chrétiens", "ebook prière" | Hub + comparatifs, guides choix, liens achat |

### Maillage Interne (Règle d'Or)
Chaque article → **3 liens internes minimum** :
1. Vers page pilier correspondante
2. Vers **un livre pertinent** (ancre `#livres` ou page d'accueil)
3. Vers **newsletter** (lead magnet)
4. Vers **article connexe** (cluster)

### Schema.org Blog (Automatique via `BlogPost.astro`)
- `BlogPosting` + `FAQPage` (si section FAQ en fin d'article)
- `BreadcrumbList` : Home > Blog > Catégorie > Article
- `Article` : `author`, `publisher`, `datePublished`, `dateModified`

---

## 7. KPIs & Tableau de Bord Mensuel

| KPI | Outil | Cible Mensuelle | Alerte Si |
|-----|-------|-----------------|-----------|
| **Trafic Organique** | GA4 / Search Console | +20% MoM | -10% sur 2 mois |
| **Inscriptions Newsletter** | Netlify / MailerLite | 50+/mois | < 20/mois |
| **Taux Conversion NL→Achat** | GA4 (UTM) | > 3% | < 1% |
| **Positions Top 10** | Search Console | +5 nouveaux/mois | Stagnation 3 mois |
| **Articles Publiés** | CMS | 4/mois (1/sem) | < 2/mois |
| **Backlinks Acquis** | Ahrefs / Search Console | 5+/mois | 0 sur 2 mois |
| **Partages Sociaux** | Buffer / Native | 100+/article | < 20/article |
| **Revenus Estimés** | Plateformes (Lulu/Payhip/GP) | +15% MoM | Baisse 2 mois |

### Dashboard Unifié (Looker Studio)
Sources : GA4 + Search Console + Vercel Analytics + MailerLite + Plateformes ventes
- **Vue Exécutive** : Trafic, Leads, Revenus, CWV
- **Vue Contenu** : Top articles, Mots-clés, Clusters
- **Vue Acquisition** : Canaux, Campagnes, Réseaux sociaux

---

## 8. Backlog Technique (Prérequis Lancement Blog)

- [ ] **Astro Collections** : Configurer `src/content/blog/` + schema Zod (multilingue)
- [ ] **Composants** : `BlogPost.astro`, `BlogIndex.astro`, `BlogCard.astro`
- [ ] **Routing** : `[lang]/blog/index.astro`, `[lang]/blog/[slug].astro`
- [ ] **Styles** : Ajouter `.blog-*` à `lafoidieu-design.css`
- [ ] **Sitemap** : Inclusion auto articles blog dans `sitemap.xml`
- [ ] **RSS/Atom** : Feed multilingue (`/fr/rss.xml`, `/en/rss.xml`...)
- [ ] **JSON-LD** : `BlogPosting`, `BreadcrumbList`, `FAQPage` auto
- [ ] **Images** : Pipeline optimisation (Vercel Blob + `@astrojs/image` → WebP/AVIF)
- [ ] **Traduction 9 langues** : Processus (DeepL API + relecture humaine ?)
- [ ] **Lead Magnet PDF** : Design + traduction 9 langues + hébergement
- [ ] **Email Automation** : MailerLite/Brevo + webhook Netlify Forms
- [ ] **Social Templates** : Canva kit marque (9 langues)
- [ ] **Analytics Events** : `blog_read`, `blog_cta_click`, `newsletter_signup_from_blog`

---

## 9. Budget & Ressources (Estimation)

| Poste | Coût Mensuel | Note |
|-------|--------------|------|
| **Vercel Pro** | $20 | Analytics illimité, logs 1 an, Edge Functions |
| **MailerLite** | $0-15 | Gratuit ≤ 1000 abonnés |
| **Canva Pro** | $12 | Templates, kit marque, redimensionnement |
| **Buffer/Metricool** | $0-15 | Planification réseaux sociaux |
| **Ahrefs/Semrush** | $0-99 | SEO (optionnel, Search Console gratuit) |
| **Vercel Blob** | $5-20 | Stockage images blog optimisées |
| **Traduction** | $100-500 | DeepL API + relecture / mois (24 articles × 9 langues) |
| **Total Min** | **~$37/mois** | Vercel Pro + Canva + Buffer gratuits |
| **Total Optimal** | **~$200/mois** | Avec outils SEO + traduction pro |

---

*Skill mis à jour le 2025-11-20 (v1.1) — Ajout implémentation technique Astro Collections complète.*