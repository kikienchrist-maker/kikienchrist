#!/usr/bin/env node
/**
 * regenerate-translated-v4.mjs — Frontmatter propre (sans content:) + body après ---
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

function stringifyYamlValue(val, key) {
  // version, lastUpdated -> TOUJOURS guillemets (même si déjà string)
  if (key === 'version' || key === 'lastUpdated') return `"${String(val)}"`;
  
  if (typeof val === 'string') {
    const escaped = val.replace(/"/g, '\\"');
    if (/[:#\[\]{}"'\s]/.test(escaped) || escaped === '') return `"${escaped}"`;
    return escaped;
  }
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (Array.isArray(val)) return '[' + val.map(v => stringifyYamlValue(v, key)).join(', ') + ']';
  return String(val);
}

function buildFrontmatter(fm) {
  let out = '---\n';
  for (const [key, value] of Object.entries(fm)) {
    if (key === 'content') continue;
    out += `${key}: ${stringifyYamlValue(value, key)}\n`;
  }
  out += '---\n';
  return out;
}

for (const page of PAGES) {
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  if (!fs.existsSync(frPath)) {
    console.log(`⚠️ Source FR manquante: ${page}-fr.md`);
    continue;
  }
  
  const frRaw = fs.readFileSync(frPath, 'utf-8');
  const frParsed = matter(frRaw);
  const frFm = frParsed.data;

  for (const lang of TARGET_LANGS) {
    const targetPath = path.join(LEGAL_DIR, `${page}-${lang}.md`);
    if (!fs.existsSync(targetPath)) {
      console.log(`⚠️ Fichier cible manquant: ${page}-${lang}.md`);
      continue;
    }

    const targetRaw = fs.readFileSync(targetPath, 'utf-8');
    const targetParsed = matter(targetRaw);
    const tgtBody = targetParsed.content;

    // Nouveau frontmatter = FR frontmatter (sans content) + title traduit + lang
    const { content: _, ...frFmNoContent } = frFm;
    const newFm = {
      ...frFmNoContent,
      title: TITLE_TRANSLATIONS[lang]?.[page] || frFm.title,
      lang: lang,
      version: String(frFmNoContent.version) // forcer string
    };

    const newContent = buildFrontmatter(newFm) + '\n' + tgtBody + '\n';
    fs.writeFileSync(targetPath, newContent, 'utf-8');
    console.log(`✅ Régénéré: ${page}-${lang}.md`);
  }
}

console.log('\n🎉 Tous les fichiers régénérés : frontmatter propre + body séparé !');