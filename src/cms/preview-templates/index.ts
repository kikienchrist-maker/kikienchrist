// Decap CMS Preview Templates pour Astro
// À placer dans src/cms/preview-templates/index.ts

import { registerPreviewTemplate } from 'netlify-cms-lib-widgets';

// Configuration globale
const SITE_URL = 'https://kikienchrist.vercel.app';

function getPreviewUrl(collection: string, slug: string, lang: string = 'fr'): string {
  const base = `${SITE_URL}/${lang}`;
  switch (collection) {
    case 'blog':
      return `${base}/blog/${slug}/`;
    case 'legal':
      return `${base}/${slug}/`;
    case 'books':
      return `${base}/livres/${slug}/`;
    default:
      return `${base}/${slug}/`;
  }
}

// Templates de prévisualisation par collection

// blog Preview
registerPreviewTemplate('blog', {
  name: 'blog',
  getPreviewUrl: entry => {
    const data = entry.get('data');
    const slug = data.get('pageSlug') || data.get('slug') || data.get('translationKey');
    const lang = data.get('lang') || 'fr';
    return getPreviewUrl('blog', slug, lang);
  },
  getPreviewHtml: entry => {
    const data = entry.get('data');
    const title = data.get('title') || 'Sans titre';
    const excerpt = data.get('excerpt') || data.get('shortDescription') || '';
    const coverImage = data.get('coverImage');
    const lang = data.get('lang') || 'fr';
    const slug = data.get('pageSlug') || data.get('slug') || data.get('translationKey');

    return `
      <div style="font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto;">
        <a href="${getPreviewUrl('blog', slug, lang)}" target="_blank" style="color: #0066cc; text-decoration: none;">
          Voir sur le site →
        </a>
        <h1 style="margin-top: 1rem;">${title}</h1>
        ${coverImage ? `<img src="${coverImage}" alt="" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />` : ''}
        <p style="color: #666;">${excerpt}</p>
        <hr style="margin: 2rem 0;" />
        <p style="font-size: 0.9rem; color: #999;">Prévisualisation blog - ${lang}</p>
      </div>
    `;
  },
});

// legal Preview
registerPreviewTemplate('legal', {
  name: 'legal',
  getPreviewUrl: entry => {
    const data = entry.get('data');
    const slug = data.get('pageSlug') || data.get('slug') || data.get('translationKey');
    const lang = data.get('lang') || 'fr';
    return getPreviewUrl('legal', slug, lang);
  },
  getPreviewHtml: entry => {
    const data = entry.get('data');
    const title = data.get('title') || 'Sans titre';
    const excerpt = data.get('excerpt') || data.get('shortDescription') || '';
    const coverImage = data.get('coverImage');
    const lang = data.get('lang') || 'fr';
    const slug = data.get('pageSlug') || data.get('slug') || data.get('translationKey');

    return `
      <div style="font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto;">
        <a href="${getPreviewUrl('legal', slug, lang)}" target="_blank" style="color: #0066cc; text-decoration: none;">
          Voir sur le site →
        </a>
        <h1 style="margin-top: 1rem;">${title}</h1>
        ${coverImage ? `<img src="${coverImage}" alt="" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />` : ''}
        <p style="color: #666;">${excerpt}</p>
        <hr style="margin: 2rem 0;" />
        <p style="font-size: 0.9rem; color: #999;">Prévisualisation legal - ${lang}</p>
      </div>
    `;
  },
});

// books Preview
registerPreviewTemplate('books', {
  name: 'books',
  getPreviewUrl: entry => {
    const data = entry.get('data');
    const slug = data.get('pageSlug') || data.get('slug') || data.get('translationKey');
    const lang = data.get('lang') || 'fr';
    return getPreviewUrl('books', slug, lang);
  },
  getPreviewHtml: entry => {
    const data = entry.get('data');
    const title = data.get('title') || 'Sans titre';
    const excerpt = data.get('excerpt') || data.get('shortDescription') || '';
    const coverImage = data.get('coverImage');
    const lang = data.get('lang') || 'fr';
    const slug = data.get('pageSlug') || data.get('slug') || data.get('translationKey');

    return `
      <div style="font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto;">
        <a href="${getPreviewUrl('books', slug, lang)}" target="_blank" style="color: #0066cc; text-decoration: none;">
          Voir sur le site →
        </a>
        <h1 style="margin-top: 1rem;">${title}</h1>
        ${coverImage ? `<img src="${coverImage}" alt="" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />` : ''}
        <p style="color: #666;">${excerpt}</p>
        <hr style="margin: 2rem 0;" />
        <p style="font-size: 0.9rem; color: #999;">Prévisualisation books - ${lang}</p>
      </div>
    `;
  },
});

// Export pour utilisation dans admin/index.html
export { getPreviewUrl };
