// Utils Blog - Fonctions pures (testables, sans dépendances Astro)
// JSON-LD, Related Posts, Reading Time, Slugify, Dates, Meta Tags

export interface BlogPostData {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  author: string;
  authorRole?: string;
  lang: string;
  translationKey?: string;
  category: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  featured?: boolean;
  draft?: boolean;
  readingTime?: number;
  isLeadMagnet?: boolean;
  leadMagnetTitle?: string;
  leadMagnetDescription?: string;
  leadMagnetFile?: string;
  relatedPodcastEpisode?: string;
  relatedVideo?: string;
  canonicalURL?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  structuredData?: {
    type: 'BlogPosting' | 'Article';
    wordCount?: number;
  };
  slug: string;
  body?: string;
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  defaultLang: string;
}

/**
 * Génère JSON-LD BlogPosting pour un article
 */
export function generateBlogPostingJsonLd(post: BlogPostData, siteUrl: string): object {
  const url = post.canonicalURL || `${siteUrl}/${post.lang}/blog/${post.slug}/`;

  const publishDate = safeToISOString(post.pubDate);
  const modifiedDate = post.updatedDate ? safeToISOString(post.updatedDate) : publishDate;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': post.structuredData?.type || 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: post.author,
      ...(post.authorRole && { jobTitle: post.authorRole }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kiki en Christ',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    inLanguage: post.lang,
    articleSection: post.category,
    keywords: post.tags?.join(', ') || '',
  };

  // Image
  if (post.ogImage) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: post.ogImage,
      width: 1200,
      height: 630,
    };
  }

  // Word count
  if (post.structuredData?.wordCount) {
    jsonLd.wordCount = post.structuredData.wordCount;
  } else if (post.body) {
    jsonLd.wordCount = post.body.split(/\s+/).length;
  }

  // Série
  if (post.series) {
    jsonLd.isPartOf = {
      '@type': 'CreativeWorkSeries',
      name: post.series,
      ...(post.seriesOrder && { position: post.seriesOrder }),
    };
  }

  // Lead magnet
  if (post.isLeadMagnet && post.leadMagnetFile) {
    jsonLd.associatedMedia = {
      '@type': 'MediaObject',
      name: post.leadMagnetTitle || 'Ressource gratuite',
      contentUrl: post.leadMagnetFile,
      encodingFormat: 'application/pdf',
    };
  }

  return jsonLd;
}

/**
 * Génère JSON-LD Blog (ItemList) pour page d'index
 * Supporte deux signatures :
 * 1. (posts, siteUrl, lang, pagination) - signature originale
 * 2. (options: { posts?, siteUrl?, lang?, category?, tag?, series?, page?, totalPages?, totalPosts? }) - signature depuis BlogIndex.astro
 */
export function generateBlogJsonLd(
  arg1:
    | BlogPostData[]
    | {
        posts?: BlogPostData[];
        siteUrl?: string;
        lang?: string;
        category?: string;
        tag?: string;
        series?: string;
        page?: number;
        totalPages?: number;
        totalPosts?: number;
        pagination?: { currentPage: number; totalPages: number; pageSize: number };
      },
  siteUrl?: string,
  lang?: string,
  pagination?: { currentPage: number; totalPages: number; pageSize: number }
): object {
  // Détecter la signature utilisée
  const isOptions = !Array.isArray(arg1);

  let posts: BlogPostData[] = [];
  let finalSiteUrl = siteUrl || 'https://kikienchrist.vercel.app';
  let finalLang = lang || 'fr';
  let finalPagination = pagination;

  if (isOptions) {
    const opts = arg1 as {
      posts?: BlogPostData[];
      siteUrl?: string;
      lang?: string;
      category?: string;
      tag?: string;
      series?: string;
      page?: number;
      totalPages?: number;
      totalPosts?: number;
      pagination?: { currentPage: number; totalPages: number; pageSize: number };
    };
    posts = opts.posts || [];
    finalSiteUrl = opts.siteUrl || finalSiteUrl;
    finalLang = opts.lang || finalLang;
    finalPagination = opts.pagination || {
      currentPage: opts.page || 1,
      totalPages: opts.totalPages || 1,
      pageSize: 10,
    };
  } else {
    posts = arg1;
  }

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Kiki en Christ',
    description: 'Articles, enseignements et témoignages pour grandir dans votre foi',
    url: `${finalSiteUrl}/${finalLang}/blog/`,
    inLanguage: finalLang,
    blogPosts: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${finalSiteUrl}/${post.lang}/blog/${post.slug}/`,
      datePublished: safeToISOString(post.pubDate),
      author: { '@type': 'Person', name: post.author },
      articleSection: post.category,
    })),
  };

  if (finalPagination) {
    jsonLd.pagination = {
      '@type': 'Pagination',
      currentPage: finalPagination.currentPage,
      totalPages: finalPagination.totalPages,
      pageSize: finalPagination.pageSize,
    };
  }

  return jsonLd;
}

/**
 * Génère meta tags pour article (Open Graph, Twitter, etc.)
 */
export function generateArticleMetaTags(
  post: BlogPostData,
  siteUrl: string
): Record<string, string> {
  const url = post.canonicalURL || `${siteUrl}/${post.lang}/blog/${post.slug}/`;
  const image = post.ogImage || `${siteUrl}/og-default.jpg`;

  return {
    canonical: url,
    'og:type': 'article',
    'og:title': post.ogTitle || post.title,
    'og:description': post.ogDescription || post.description,
    'og:url': url,
    'og:image': image,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:locale': getOgLocale(post.lang),
    'og:site_name': 'Kiki en Christ',
    'article:published_time': safeToISOString(post.pubDate),
    'article:modified_time': post.updatedDate
      ? safeToISOString(post.updatedDate)
      : safeToISOString(post.pubDate),
    'article:author': `${siteUrl}/auteur/${(post.author || 'kiki-en-christ').toLowerCase().replace(/\s+/g, '-')}/`,
    'article:section': post.category,
    'article:tag': post.tags?.join(',') || '',
    'twitter:card': 'summary_large_image',
    'twitter:title': post.ogTitle || post.title,
    'twitter:description': post.ogDescription || post.description,
    'twitter:image': image,
    'twitter:site': '@kikienchrist',
    'twitter:creator': '@kikienchrist',
  };
}

function getOgLocale(lang: string): string {
  const locales: Record<string, string> = {
    fr: 'fr_FR',
    en: 'en_US',
    es: 'es_ES',
    pt: 'pt_PT',
    it: 'it_IT',
    de: 'de_DE',
    nl: 'nl_NL',
    pl: 'pl_PL',
    ar: 'ar_AR',
  };
  return locales[lang] || 'fr_FR';
}

/**
 * Calcule les articles liés avec scoring
 * Score: Série (100) > Catégorie (50) > Tags partagés (10 par tag) > Récence (décroissant)
 */
export function getRelatedPosts({
  allPosts,
  currentSlug,
  category,
  tags = [],
  series,
  limit = 3,
}: {
  allPosts: BlogPostData[];
  currentSlug: string;
  category?: string;
  tags?: string[];
  series?: string;
  limit?: number;
}): BlogPostData[] {
  const scored = allPosts
    .filter(p => p.slug !== currentSlug && !p.draft)
    .map(post => {
      let score = 0;

      // Série (priorité max)
      if (series && post.series === series) {
        score += 1000;
        // Bonus si même ordre séquentiel
        if (post.seriesOrder && typeof post.seriesOrder === 'number') {
          score += 100 - Math.abs(post.seriesOrder - (post.seriesOrder || 0)) * 10;
        }
      }

      // Catégorie
      if (category && post.category === category) {
        score += 500;
      }

      // Tags partagés
      const sharedTags = post.tags.filter(t => tags.includes(t));
      score += sharedTags.length * 100;

      // Récence (articles plus récents = score plus haut)
      const daysSincePub = (Date.now() - new Date(post.pubDate).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 100 - daysSincePub);

      // Article en vedette
      if (post.featured) score += 50;

      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);

  return scored;
}

/**
 * Temps de lecture estimé (mots / 200 wpm)
 */
export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Slugify une chaîne (pour URLs, tags, catégories)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, ''); // Trim hyphens
}

/**
 * Formate date selon langue
 */
export function formatDate(
  date: string | Date,
  lang: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return d.toLocaleDateString(lang, { ...defaultOptions, ...options });
}

/**
 * Vérifie si une date est valide
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Convertit une date en ISO string de manière sécurisée
 */
export function safeToISOString(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) throw new Error('Invalid date');
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Label catégorie selon langue
 */
export function getCategoryLabel(category: string, lang: string): string {
  const labels: Record<string, Record<string, string>> = {
    fr: {
      prière: 'Prière',
      formation: 'Formation',
      témoignage: 'Témoignage',
      'vie-chrétienne': 'Vie chrétienne',
      famille: 'Famille',
      mission: 'Mission',
      actualité: 'Actualité',
      ressource: 'Ressource',
    },
    en: {
      prière: 'Prayer',
      formation: 'Teaching',
      témoignage: 'Testimony',
      'vie-chrétienne': 'Christian Life',
      famille: 'Family',
      mission: 'Mission',
      actualité: 'News',
      ressource: 'Resource',
    },
    es: {
      prière: 'Oración',
      formation: 'Enseñanza',
      témoignage: 'Testimonio',
      'vie-chrétienne': 'Vida Cristiana',
      famille: 'Familia',
      mission: 'Misión',
      actualité: 'Noticias',
      ressource: 'Recurso',
    },
    pt: {
      prière: 'Oração',
      formation: 'Ensino',
      témoignage: 'Testemunho',
      'vie-chrétienne': 'Vida Cristã',
      famille: 'Família',
      mission: 'Missão',
      actualité: 'Notícias',
      ressource: 'Recurso',
    },
    it: {
      prière: 'Preghiera',
      formation: 'Insegnamento',
      témoignage: 'Testimonanza',
      'vie-chrétienne': 'Vita Cristiana',
      famille: 'Famiglia',
      mission: 'Missione',
      actualité: 'Notizie',
      ressource: 'Risorsa',
    },
    de: {
      prière: 'Gebet',
      formation: 'Lehre',
      témoignage: 'Zeugnis',
      'vie-chrétienne': 'Christliches Leben',
      famille: 'Familie',
      mission: 'Mission',
      actualité: 'Nachrichten',
      ressource: 'Ressource',
    },
    nl: {
      prière: 'Gebed',
      formation: 'Onderwijs',
      témoignage: 'Getuigenis',
      'vie-chrétienne': 'Christelijk Leven',
      famille: 'Gezin',
      mission: 'Missie',
      actualité: 'Nieuws',
      ressource: 'Hulpbron',
    },
    pl: {
      prière: 'Modlitwa',
      formation: 'Nauczanie',
      témoignage: 'Świadectwo',
      'vie-chrétienne': 'Życie Chrześcijańskie',
      famille: 'Rodzina',
      mission: 'Misja',
      actualité: 'Aktualności',
      ressource: 'Zasób',
    },
    ar: {
      prière: 'صلاة',
      formation: 'تعليم',
      témoignage: 'شهادة',
      'vie-chrétienne': 'الحياة المسيحية',
      famille: 'عائلة',
      mission: 'مهمة',
      actualité: 'أخبار',
      ressource: 'مورد',
    },
  };
  return labels[lang]?.[category] || category;
}

/**
 * Extrait headings (h2, h3) depuis HTML pour TOC
 */
export function extractHeadings(html: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const regex = /<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, '');
    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * Génère ID unique pour heading basé sur texte
 */
export function generateHeadingId(text: string): string {
  return slugify(text);
}
