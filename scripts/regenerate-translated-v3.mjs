#!/usr/bin/env node
/**
 * regenerate-translated-v3.mjs — Utilise gray-matter pour parser correctement
 * le frontmatter YAML (incluant content: | multiline) et régénérer proprement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const TARGET_LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

const TITLE_TRANSLATIONS = {
  'en': { 'mentions-legales': 'Legal Notice', 'confidentialite': 'Privacy Policy', 'cookies': 'Cookie Policy', 'cgv': 'Terms of Service', 'accessibilite': 'Accessibility' },
  'es': { 'mentions-legales': 'Aviso Legal', 'confidentialite': 'Política de Privacidad', 'cookies': 'Política de Cookies', 'cgv': 'Condiciones Generales de Venta', 'accessibilite': 'Accesibilidad' },
  'pt': { 'mentions-legales': 'Aviso Legal', 'confidentialite': 'Política de Privacidade', 'cookies': 'Política de Cookies', 'cgv': 'Termos e Condições', 'accessibilite': 'Acessibilidade' },
  'de': { 'mentions-legales': 'Impressum', 'confidentialite': 'Datenschutzerklärung', 'cookies': 'Cookie-Richtlinie', 'cgv': 'Allgemeine Geschäftsbedingungen', 'accessibilite': 'Barrierefreiheit' },
  'it': { 'mentions-legales': 'Note Legali', 'confidentialite': 'Informativa sulla Privacy', 'cookies': 'Informativa sui Cookie', 'cgv': 'Condizioni Generali di Vendita', 'accessibilite': 'Accessibilità' },
  'nl': { 'mentions-legales': 'Rechtelijke Kennisgeving', 'confidentialite': 'Privacybeleid', 'cookies': 'Cookiebeleid', 'cgv': 'Algemene Voorwaarden', 'accessibilite': 'Toegankelijkheid' },
  'pl': { 'mentions-legales': 'Informacje Prawne', 'confidentialite': 'Polityka Prywatności', 'cookies': 'Polityka Ciasteczek', 'cgv': 'Regulamin Zakupów', 'accessibilite': 'Dostępność' },
  'ar': { 'mentions-legales': 'إشعار قانوني', 'confidentialite': 'سياسة الخصوصية', 'cookies': 'سياسة ملفات تعريف الارتباط', 'cgv': 'الشروط والأحكام', 'accessibilite': 'إمكانية الوصول' },
  'ru': { 'mentions-legales': 'Юридическая информация', 'confidentialite': 'Политика конфиденциальности', 'cookies': 'Политика куки', 'cgv': 'Условия продажи', 'accessibilite': 'Доступность' },
  'zh': { 'mentions-legales': '法律声明', 'confidentialite': '隐私政策', 'cookies': 'Cookie 政策', 'cgv': '销售条款', 'accessibilite': '无障碍' },
  'hi': { 'mentions-legales': 'कानूनी नोटिस', 'confidentialite': 'गोपनीयता नीति', 'cookies': 'कुकी नीति', 'cgv': 'बिक्री की शर्तें', 'accessibilite': 'पहुंच' }
};

for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  if (!fs.existsSync(frPath)) {
    console.log(`⚠️ Source FR manquante: ${page}-fr.md`);
    continue;
  }
  
  // Parser FR avec gray-matter (gère content: | multiline)
  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frParsed = matter(frRaw);
  const frFm = frParsed.data; // frontmatter object avec types préservés
  const frBody = frParsed.content; // body Markdown (après content: |)

  for (const lang of TARGET_LANGS) {
    const targetPath = path.join(LEGAL_DIR, `${page}-${lang}.md`);
    if (!fs.existsSync(targetPath)) {
      console.log(`⚠️ Fichier cible manquant: ${page}-${lang}.md`);
      continue;
    }

    const targetRaw = fs.readFileSync(targetPath, 'utf-8');
    const targetParsed = matter(targetRaw);
    const tgtBody = targetParsed.content; // body déjà traduit

    // Nouveau frontmatter = FR frontmatter + title traduit + lang cible
    // On garde TOUS les champs du FR (pageSlug, lastUpdated, version, requiredByLaw, jurisdiction, etc.)
    const newFm = {
      ...frFm,
      title: TITLE_TRANSLATIONS[lang]?.[page] || frFm.title,
      lang: lang
    };

    // gray-matter.stringify gère la sérialisation YAML correcte (bool, array, multiline)
    const newContent = matter.stringify(tgtBody, newFm);
    fs.writeFileSync(targetPath, newContent, 'utf-8');
    console.log(`✅ Régénéré: ${page}-${lang}.md`);
  }
}

console.log('\n🎉 Tous les fichiers régénérés avec gray-matter (types YAML parfaits) !');