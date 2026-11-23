#!/usr/bin/env node
/**
 * Ajoute "blog" dans common + "Blog" dans footer.nav pour les 11 langues
 */

import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/translations.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Traductions pour "Blog" par langue
const blogTranslations = {
  fr: "Blog",
  en: "Blog",
  es: "Blog",
  pt: "Blog",
  it: "Blog",
  de: "Blog",
  nl: "Blog",
  pl: "Blog",
  ru: "Блог",
  zh: "博客",
  hi: "ब्लॉग"
};

const footerBlogTranslations = { ...blogTranslations };

const langOrder = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ru', 'zh', 'hi'];

langOrder.forEach(lang => {
  const langData = data[lang];
  if (!langData) return;

  // 1. Ajouter dans common (après "books")
  if (langData.common) {
    const commonEntries = Object.entries(langData.common);
    const booksIndex = commonEntries.findIndex(([k]) => k === 'books');
    if (booksIndex !== -1) {
      const newCommon = {};
      commonEntries.forEach(([k, v], i) => {
        newCommon[k] = v;
        if (i === booksIndex) {
          newCommon['blog'] = blogTranslations[lang];
        }
      });
      langData.common = newCommon;
    }
  }

  // 2. Ajouter dans footer.nav (après "Livres"/"Books"/etc.)
  if (langData.footer && langData.footer.nav) {
    const nav = langData.footer.nav;
    const livresIndex = nav.findIndex(item => 
      item === 'Livres' || item === 'Books' || item === 'Libros' || 
      item === 'Livros' || item === 'Libri' || item === 'Bücher' || 
      item === 'Boeken' || item === 'Książki' || item === 'Книги' || 
      item === '书籍' || item === 'किताबें'
    );
    if (livresIndex !== -1) {
      nav.splice(livresIndex + 1, 0, footerBlogTranslations[lang]);
    }
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ translations.json mis à jour (common.blog + footer.nav Blog)');