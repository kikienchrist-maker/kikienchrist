#!/usr/bin/env node
/**
 * fix-titles.mjs — Corrige les titres des pages légales traduites
 * Les titres actuels sont du bruit ("INDEFINI", "Sindefinido", etc.)
 * On les remplace par la traduction correcte basée sur les titres FR
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

// Titres FR de référence (source de vérité)
const FR_TITLES = {
  'mentions-legales': 'Mentions légales',
  'confidentialite': 'Politique de confidentialité',
  'cookies': 'Politique des cookies',
  'cgv': 'Conditions générales de vente',
  'accessibilite': 'Accessibilité'
};

// Traductions correctes des titres (manuellement vérifiées)
const TITLE_TRANSLATIONS = {
  'en': {
    'mentions-legales': 'Legal Notice',
    'confidentialite': 'Privacy Policy',
    'cookies': 'Cookie Policy',
    'cgv': 'Terms of Service',
    'accessibilite': 'Accessibility'
  },
  'es': {
    'mentions-legales': 'Aviso Legal',
    'confidentialite': 'Política de Privacidad',
    'cookies': 'Política de Cookies',
    'cgv': 'Condiciones Generales de Venta',
    'accessibilite': 'Accesibilidad'
  },
  'pt': {
    'mentions-legales': 'Aviso Legal',
    'confidentialite': 'Política de Privacidade',
    'cookies': 'Política de Cookies',
    'cgv': 'Termos e Condições',
    'accessibilite': 'Acessibilidade'
  },
  'de': {
    'mentions-legales': 'Impressum',
    'confidentialite': 'Datenschutzerklärung',
    'cookies': 'Cookie-Richtlinie',
    'cgv': 'Allgemeine Geschäftsbedingungen',
    'accessibilite': 'Barrierefreiheit'
  },
  'it': {
    'mentions-legales': 'Note Legali',
    'confidentialite': 'Informativa sulla Privacy',
    'cookies': 'Informativa sui Cookie',
    'cgv': 'Condizioni Generali di Vendita',
    'accessibilite': 'Accessibilità'
  },
  'nl': {
    'mentions-legales': 'Rechtelijke Kennisgeving',
    'confidentialite': 'Privacybeleid',
    'cookies': 'Cookiebeleid',
    'cgv': 'Algemene Voorwaarden',
    'accessibilite': 'Toegankelijkheid'
  },
  'pl': {
    'mentions-legales': 'Informacje Prawne',
    'confidentialite': 'Polityka Prywatności',
    'cookies': 'Polityka Ciasteczek',
    'cgv': 'Regulamin Zakupów',
    'accessibilite': 'Dostępność'
  },
  'ar': {
    'mentions-legales': 'إشعار قانوني',
    'confidentialite': 'سياسة الخصوصية',
    'cookies': 'سياسة ملفات تعريف الارتباط',
    'cgv': 'الشروط والأحكام',
    'accessibilite': 'إمكانية الوصول'
  },
  'ru': {
    'mentions-legales': 'Юридическая информация',
    'confidentialite': 'Политика конфиденциальности',
    'cookies': 'Политика куки',
    'cgv': 'Условия продажи',
    'accessibilite': 'Доступность'
  },
  'zh': {
    'mentions-legales': '法律声明',
    'confidentialite': '隐私政策',
    'cookies': 'Cookie 政策',
    'cgv': '销售条款',
    'accessibilite': '无障碍'
  },
  'hi': {
    'mentions-legales': 'कानूनी नोटिस',
    'confidentialite': 'गोपनीयता नीति',
    'cookies': 'कुकी नीति',
    'cgv': 'बिक्री की शर्तें',
    'accessibilite': 'पहुंच'
  }
};

const TARGET_LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { frontmatter: {}, body: content };
  const fmLines = fmMatch[1].split('\n');
  const frontmatter = {};
  for (const line of fmLines) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  const body = content.slice(fmMatch[0].length).trimStart();
  return { frontmatter, body };
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

let fixed = 0;
let skipped = 0;

for (const page of PAGES) {
  for (const lang of TARGET_LANGS) {
    const filePath = path.join(LEGAL_DIR, `${page}-${lang}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier manquant: ${page}-${lang}.md`);
      skipped++;
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    const correctTitle = TITLE_TRANSLATIONS[lang]?.[page];
    if (!correctTitle) {
      console.log(`⚠️  Pas de traduction titre pour ${page}-${lang}`);
      skipped++;
      continue;
    }
    
    if (frontmatter.title === correctTitle) {
      // Déjà bon
      continue;
    }
    
    console.log(`🔧 ${page}-${lang}: "${frontmatter.title}" → "${correctTitle}"`);
    frontmatter.title = correctTitle;
    frontmatter.lastUpdated = new Date().toISOString().split('T')[0];
    
    const newContent = buildFrontmatter(frontmatter) + '\n' + body + '\n';
    fs.writeFileSync(filePath, newContent, 'utf-8');
    fixed++;
  }
}

console.log(`\n✅ ${fixed} titres corrigés, ${skipped} ignorés`);