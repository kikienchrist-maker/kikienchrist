#!/usr/bin/env node
/**
 * regenerate-translated.mjs — Régénère proprement tous les fichiers traduits
 * à partir des sources FR (frontmatter propre) + contenu déjà traduit (body)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const TARGET_LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

// Titres corrects par langue
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

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { frontmatter: {}, body: content, rawFm: '' };
  const fmLines = fmMatch[1].split('\n');
  const frontmatter = {};
  for (const line of fmLines) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  const body = content.slice(fmMatch[0].length).trimStart();
  return { frontmatter, body, rawFm: fmMatch[0] };
}

function buildFrontmatter(fm) {
  let out = '---\n';
  for (const [key, value] of Object.entries(fm)) {
    const needsQuotes = typeof value === 'string' && (value.includes(':') || value.includes('#') || value.startsWith('['));
    out += `${key}: ${needsQuotes ? `"${value}"` : value}\n`;
  }
  out += '---\n';
  return out;
}

for (const page of PAGES) {
  // Lire la source FR (propre)
  const frPath = path.join(LEGAL_DIR, `${page}-fr.md`);
  if (!fs.existsSync(frPath)) {
    console.log(`⚠️ Source FR manquante: ${page}-fr.md`);
    continue;
  }
  const frContent = fs.readFileSync(frPath, 'utf-8');
  const { frontmatter: frFm, body: frBody } = parseFrontmatter(frContent);

  for (const lang of TARGET_LANGS) {
    const targetPath = path.join(LEGAL_DIR, `${page}-${lang}.md`);
    if (!fs.existsSync(targetPath)) {
      console.log(`⚠️ Fichier cible manquant: ${page}-${lang}.md`);
      continue;
    }

    const targetContent = fs.readFileSync(targetPath, 'utf-8');
    const { frontmatter: tgtFm, body: tgtBody } = parseFrontmatter(targetContent);

    // Construire nouveau frontmatter propre basé sur FR + titre traduit
    // Le body Markdown va APRÈS le frontmatter (pas dedans)
    const newFm = {
      title: TITLE_TRANSLATIONS[lang]?.[page] || frFm.title,
      pageSlug: frFm.pageSlug,
      lang: lang,
      lastUpdated: frFm.lastUpdated, // Garder la date FR originale
      version: frFm.version,
      requiredByLaw: frFm.requiredByLaw,
      jurisdiction: frFm.jurisdiction
    };

    const newContent = buildFrontmatter(newFm) + '\n' + tgtBody + '\n';
    fs.writeFileSync(targetPath, newContent, 'utf-8');
    console.log(`✅ Régénéré: ${page}-${lang}.md`);
  }
}

console.log('\n🎉 Tous les fichiers traduits régénérés avec frontmatter propre !');