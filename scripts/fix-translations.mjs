#!/usr/bin/env node
/**
 * Recrée common pour les 11 langues + ajoute blog + met à jour footer.nav
 */

import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/translations.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Contenu de base pour common (sans blog)
const commonBase = {
  fr: {
    home: "Accueil", books: "Livres", newsletter: "Newsletter", faq: "FAQ",
    contact: "Contact", breadcrumb: "Fil d'Ariane", close: "Fermer",
    loading: "Chargement...", error: "Erreur", retry: "Réessayer",
    search: "Rechercher", language: "Langue", theme: "Thème",
    darkMode: "Mode sombre", lightMode: "Mode clair"
  },
  en: {
    home: "Home", books: "Books", newsletter: "Newsletter", faq: "FAQ",
    contact: "Contact", breadcrumb: "Breadcrumb", close: "Close",
    loading: "Loading...", error: "Error", retry: "Retry",
    search: "Search", language: "Language", theme: "Theme",
    darkMode: "Dark mode", lightMode: "Light mode"
  },
  es: {
    home: "Inicio", books: "Libros", newsletter: "Newsletter", faq: "Preguntas frecuentes",
    contact: "Contacto", breadcrumb: "Migajas de pan", close: "Cerrar",
    loading: "Cargando...", error: "Error", retry: "Reintentar",
    search: "Buscar", language: "Idioma", theme: "Tema",
    darkMode: "Modo oscuro", lightMode: "Modo claro"
  },
  pt: {
    home: "Início", books: "Livros", newsletter: "Newsletter", faq: "Perguntas frequentes",
    contact: "Contato", breadcrumb: "Trilha de navegação", close: "Fechar",
    loading: "Carregando...", error: "Erro", retry: "Tentar novamente",
    search: "Buscar", language: "Idioma", theme: "Tema",
    darkMode: "Modo escuro", lightMode: "Modo claro"
  },
  it: {
    home: "Home", books: "Libri", newsletter: "Newsletter", faq: "FAQ",
    contact: "Contatti", breadcrumb: "Briciole di pane", close: "Chiudi",
    loading: "Caricamento...", error: "Errore", retry: "Riprova",
    search: "Cerca", language: "Lingua", theme: "Tema",
    darkMode: "Modalità scura", lightMode: "Modalità chiara"
  },
  de: {
    home: "Startseite", books: "Bücher", newsletter: "Newsletter", faq: "FAQ",
    contact: "Kontakt", breadcrumb: "Brotkrümelnavigation", close: "Schließen",
    loading: "Laden...", error: "Fehler", retry: "Wiederholen",
    search: "Suchen", language: "Sprache", theme: "Design",
    darkMode: "Dunkelmodus", lightMode: "Hellmodus"
  },
  nl: {
    home: "Home", books: "Boeken", newsletter: "Newsletter", faq: "FAQ",
    contact: "Contact", breadcrumb: "Broodkruimelnavigatie", close: "Sluiten",
    loading: "Laden...", error: "Fout", retry: "Opnieuw proberen",
    search: "Zoeken", language: "Taal", theme: "Thema",
    darkMode: "Donkere modus", lightMode: "Lichte modus"
  },
  pl: {
    home: "Strona główna", books: "Książki", newsletter: "Newsletter", faq: "FAQ",
    contact: "Kontakt", breadcrumb: "Okruchy chleba", close: "Zamknij",
    loading: "Ładowanie...", error: "Błąd", retry: "Spróbuj ponownie",
    search: "Szukaj", language: "Język", theme: "Motyw",
    darkMode: "Tryb ciemny", lightMode: "Tryb jasny"
  },
  ru: {
    home: "Главная", books: "Книги", newsletter: "Рассылка", faq: "FAQ",
    contact: "Контакты", breadcrumb: "Хлебные крошки", close: "Закрыть",
    loading: "Загрузка...", error: "Ошибка", retry: "Повторить",
    search: "Поиск", language: "Язык", theme: "Тема",
    darkMode: "Тёмная тема", lightMode: "Светлая тема"
  },
  zh: {
    home: "首页", books: "书籍", newsletter: "通讯", faq: "常见问题",
    contact: "联系", breadcrumb: "面包屑", close: "关闭",
    loading: "加载中...", error: "错误", retry: "重试",
    search: "搜索", language: "语言", theme: "主题",
    darkMode: "深色模式", lightMode: "浅色模式"
  },
  hi: {
    home: "होम", books: "किताबें", newsletter: "न्यूज़लेटर", faq: "सामान्य प्रश्न",
    contact: "संपर्क", breadcrumb: "ब्रेडक्रंब", close: "बंद करें",
    loading: "लोड हो रहा है...", error: "त्रुटि", retry: "पुनः प्रयास करें",
    search: "खोजें", language: "भाषा", theme: "थीम",
    darkMode: "डार्क मोड", lightMode: "लाइट मोड"
  }
};

// Traductions "Blog"
const blogTranslations = {
  fr: "Blog", en: "Blog", es: "Blog", pt: "Blog", it: "Blog",
  de: "Blog", nl: "Blog", pl: "Blog", ru: "Блог", zh: "博客", hi: "ब्लॉग"
};

// Footer nav insertions (après Livres/Books/etc.)
const livresKeywords = {
  fr: "Livres", en: "Books", es: "Libros", pt: "Livros", it: "Libri",
  de: "Bücher", nl: "Boeken", pl: "Książki", ru: "Книги", zh: "书籍", hi: "किताबें"
};

const langOrder = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ru', 'zh', 'hi'];

langOrder.forEach(lang => {
  const langData = data[lang];
  if (!langData) return;

  // 1. Créer/recréer common avec blog après books
  const base = commonBase[lang];
  if (base) {
    const entries = Object.entries(base);
    const booksIdx = entries.findIndex(([k]) => k === 'books');
    const newCommon = {};
    entries.forEach(([k, v], i) => {
      newCommon[k] = v;
      if (i === booksIdx) newCommon['blog'] = blogTranslations[lang];
    });
    langData.common = newCommon;
  }

  // 2. Mettre à jour footer.nav
  if (langData.footer && langData.footer.nav) {
    const nav = langData.footer.nav;
    const idx = nav.findIndex(item => item === livresKeywords[lang]);
    if (idx !== -1) {
      nav.splice(idx + 1, 0, blogTranslations[lang]);
    }
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ translations.json corrigé (common + blog + footer.nav)');