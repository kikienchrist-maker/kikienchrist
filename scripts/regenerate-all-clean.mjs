#!/usr/bin/env node
/**
 * regenerate-all-clean.mjs — Régénère TOUS les 55 fichiers avec structure correcte:
 * frontmatter (SANS content:) + --- + body Markdown
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const LANGS = ['fr', 'en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

const TITLE_TRANSLATIONS = {
  'fr': { 'mentions-legales': 'Mentions légales', 'confidentialite': 'Politique de confidentialité', 'cookies': 'Politique des cookies', 'cgv': 'Conditions générales de vente', 'accessibilite': 'Accessibilité' },
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

// Lire le body FR de référence (depuis data.content qui a le Markdown)
const frBodies = {};
for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  const raw = fs.readFileSync(frPath, 'utf-8');
  const parsed = matter(raw);
  frBodies[page] = parsed.data.content || parsed.content;
  console.log(`📄 ${page}-fr: body ${frBodies[page].length} chars`);
}

// Pour chaque page, on a le body FR. Pour les autres langues, lire le body existant (traduit).
for (const page of PAGES) {
  const frBody = frBodies[page];
  
  for (const lang of LANGS) {
    const filePath = path.join(LEGAL_DIR, `${page}-${lang}.md`);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Manquant: ${page}-${lang}.md`);
      continue;
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    
    // Body = data.content (si content: |) OU parsed.content (si après ---)
    const existingBody = parsed.data.content || parsed.content;
    
    // Frontmatter propre (sans content:)
    const { content: _, ...fm } = parsed.data;
    fm.title = TITLE_TRANSLATIONS[lang]?.[page] || parsed.data.title;
    fm.lang = lang;
    // version en string
    fm.version = String(fm.version);
    
    // Écrire: frontmatter + --- + body
    let out = '---\n';
    for (const [key, value] of Object.entries(fm)) {
      if (typeof value === 'string') out += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
      else if (typeof value === 'boolean') out += `${key}: ${value ? 'true' : 'false'}\n`;
      else if (Array.isArray(value)) out += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
      else out += `${key}: ${value}\n`;
    }
    out += '---\n\n';
    out += (lang === 'fr' ? frBody : existingBody) + '\n';
    
    fs.writeFileSync(filePath, out, 'utf-8');
    console.log(`✅ ${page}-${lang}: frontmatter propre + body ${(lang === 'fr' ? frBody : existingBody).length} chars`);
  }
}

console.log('\n🎉 Tous les 55 fichiers régénérés avec structure Astro-compatible !');