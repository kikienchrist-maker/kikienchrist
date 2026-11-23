#!/usr/bin/env node
/**
 * Ajoute "breadcrumb" dans common pour toutes les langues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'src', 'data', 'translations.json');

const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const breadcrumbTranslations = {
  fr: "Fil d'Ariane",
  en: "Breadcrumb",
  es: "Ruta de navegación",
  pt: "Trilha de navegação",
  de: "Brotkrumen-Navigation",
  it: "Breadcrumb",
  nl: "Broodkruimelnavigatie",
  pl: "Okruszki nawigacji",
  ar: "مسار التنقل",
  ru: "Навигационная цепочка",
  zh: "面包屑导航",
  hi: "ब्रेडक्रंब"
};

let added = 0;
for (const [lang, translation] of Object.entries(breadcrumbTranslations)) {
  if (translations[lang] && translations[lang].common) {
    if (!translations[lang].common.breadcrumb) {
      translations[lang].common.breadcrumb = translation;
      console.log(`➕ ${lang}: "${translation}"`);
      added++;
    } else {
      console.log(`✅ ${lang}: déjà présent ("${translations[lang].common.breadcrumb}")`);
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf-8');
console.log(`\n🎉 ${added} traductions "breadcrumb" ajoutées !`);