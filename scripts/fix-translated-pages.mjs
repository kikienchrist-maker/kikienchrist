#!/usr/bin/env node
/**
 * Corrige les pages légales traduites (frontmatter imbriqué, pageSlug invalide, etc.)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGAL_PAGES_DIR = path.join(__dirname, '..', 'src/content/legalPages');

// Slugs valides pour chaque page (ASCII uniquement)
const VALID_SLUGS = {
  'mentions-legales': 'mentions-legales',
  'confidentialite': 'confidentialite',
  'cookies': 'cookies',
  'cgv': 'cgv',
  'accessibilite': 'accessibilite'
};

// Titres par défaut par page et langue
const DEFAULT_TITLES = {
  'mentions-legales': {
    fr: 'Mentions Légales', en: 'Legal Notice', es: 'Aviso Legal', pt: 'Avisos Legais',
    it: 'Note Legali', de: 'Impressum', nl: 'Juridische Kennisgeving', pl: 'Informacje Prawne',
    ar: 'الإشعارات القانونية', ru: 'Юридическая информация', zh: '法律声明', hi: 'कानूनी नोटिस'
  },
  'confidentialite': {
    fr: 'Politique de Confidentialité', en: 'Privacy Policy', es: 'Política de Privacidad', pt: 'Política de Privacidade',
    it: 'Informativa sulla Privacy', de: 'Datenschutzerklärung', nl: 'Privacybeleid', pl: 'Polityka Prywatności',
    ar: 'سياسة الخصوصية', ru: 'Политика конфиденциальности', zh: '隐私政策', hi: 'गोपनीयता नीति'
  },
  'cookies': {
    fr: 'Politique Cookies', en: 'Cookie Policy', es: 'Política de Cookies', pt: 'Política de Cookies',
    it: 'Cookie Policy', de: 'Cookie-Richtlinie', nl: 'Cookiebeleid', pl: 'Polityka Ciasteczek',
    ar: 'سياسة ملفات تعريف الارتباط', ru: 'Политика куки', zh: 'Cookie 政策', hi: 'कुकी नीति'
  },
  'cgv': {
    fr: 'Conditions Générales de Vente', en: 'Terms of Sale', es: 'Condiciones Generales de Venta', pt: 'Termos de Venda',
    it: 'Condizioni Generali di Vendita', de: 'Allgemeine Verkaufsbedingungen', nl: 'Algemene Verkoopvoorwaarden', pl: 'Warunki Sprzedaży',
    ar: 'شروط البيع العامة', ru: 'Общие условия продажи', zh: '销售通用条款', hi: 'बिक्री की सामान्य शर्तें'
  },
  'accessibilite': {
    fr: 'Accessibilité', en: 'Accessibility', es: 'Accesibilidad', pt: 'Acessibilidade',
    it: 'Accessibilità', de: 'Barrierefreiheit', nl: 'Toegankelijkheid', pl: 'Dostępność',
    ar: 'إمكانية الوصول', ru: 'Доступность', zh: '无障碍访问', hi: 'पहुंच'
  }
};

// Descriptions par défaut
const DEFAULT_DESCRIPTIONS = {
  'mentions-legales': {
    fr: 'Informations légales sur l\'éditeur, l\'hébergement et la propriété intellectuelle du site Kiki en Christ.',
    en: 'Legal information about the publisher, hosting, and intellectual property of the Kiki en Christ website.',
    es: 'Información legal sobre el editor, el alojamiento y la propiedad intelectual del sitio web Kiki en Christ.',
    pt: 'Informações legais sobre o editor, hospedagem e propriedade intelectual do site Kiki en Christ.',
    it: 'Informazioni legali sull\'editore, l\'hosting e la proprietà intellettuale del sito Kiki en Christ.',
    de: 'Rechtliche Informationen über den Herausgeber, Hosting und geistiges Eigentum der Kiki en Christ Website.',
    nl: 'Juridische informatie over de uitgever, hosting en intellectuele eigendom van de Kiki en Christ website.',
    pl: 'Informacje prawne o wydawcy, hostingu i własności intelektualnej strony Kiki en Christ.',
    ar: 'معلومات قانونية حول الناشر والاستضافة والملكية الفكرية لموقع Kiki en Christ.',
    ru: 'Юридическая информация об издателе, хостинге и интеллектуальной собственности сайта Kiki en Christ.',
    zh: '关于 Kiki en Christ 网站发布者、托管和知识产权的法律信息。',
    hi: 'Kiki en Christ वेबसाइट के प्रकाशक, होस्टिंग और बौद्धिक संपदा के बारे में कानूनी जानकारी।'
  },
  'confidentialite': {
    fr: 'Politique de confidentialité et protection des données personnelles (RGPD) sur Kiki en Christ.',
    en: 'Privacy policy and personal data protection (GDPR) on Kiki en Christ.',
    es: 'Política de privacidad y protección de datos personales (GDPR) en Kiki en Christ.',
    pt: 'Política de privacidade e proteção de dados pessoais (GDPR) no Kiki en Christ.',
    it: 'Informativa sulla privacy e protezione dei dati personali (GDPR) su Kiki en Christ.',
    de: 'Datenschutzerklärung und Schutz personenbezogener Daten (DSGVO) auf Kiki en Christ.',
    nl: 'Privacybeleid en bescherming van persoonsgegevens (AVG) op Kiki en Christ.',
    pl: 'Polityka prywatności i ochrona danych osobowych (RODO) na Kiki en Christ.',
    ar: 'سياسة الخصوصية وحماية البيانات الشخصية (GDPR) على Kiki en Christ.',
    ru: 'Политика конфиденциальности и защита персональных данных (GDPR) на Kiki en Christ.',
    zh: 'Kiki en Christ 的隐私政策和个人数据保护 (GDPR)。',
    hi: 'Kiki en Christ पर गोपनीयता नीति और व्यक्तिगत डेटा सुरक्षा (GDPR)।'
  },
  'cookies': {
    fr: 'Politique de gestion des cookies (nécessaires, analytiques, marketing) sur Kiki en Christ.',
    en: 'Cookie management policy (necessary, analytics, marketing) on Kiki en Christ.',
    es: 'Política de gestión de cookies (necesarios, analíticos, marketing) en Kiki en Christ.',
    pt: 'Política de gerenciamento de cookies (necessários, analíticos, marketing) no Kiki en Christ.',
    it: 'Policy di gestione dei cookie (necessari, analitici, marketing) su Kiki en Christ.',
    de: 'Cookie-Verwaltungsrichtlinie (notwendig, Analytik, Marketing) auf Kiki en Christ.',
    nl: 'Cookiebeheerbeleid (noodzakelijk, analytisch, marketing) op Kiki en Christ.',
    pl: 'Polityka zarządzania ciasteczkami (konieczne, analityczne, marketingowe) na Kiki en Christ.',
    ar: 'سياسة إدارة ملفات تعريف الارتباط (الضرورية، التحليلية، التسويقية) على Kiki en Christ.',
    ru: 'Политика управления куки (необходимые, аналитика, маркетинг) на Kiki en Christ.',
    zh: 'Kiki en Christ 的 Cookie 管理政策（必要、分析、营销）。',
    hi: 'Kiki en Christ पर कुकी प्रबंधन नीति (आवश्यक, विश्लेषण, विपणन)।'
  },
  'cgv': {
    fr: 'Conditions générales de vente des livres et ressources numériques Kiki en Christ.',
    en: 'General terms of sale for Kiki en Christ books and digital resources.',
    es: 'Condiciones generales de venta de libros y recursos digitales de Kiki en Christ.',
    pt: 'Termos gerais de venda de livros e recursos digitais do Kiki en Christ.',
    it: 'Condizioni generali di vendita per libri e risorse digitali Kiki en Christ.',
    de: 'Allgemeine Verkaufsbedingungen für Kiki en Christ Bücher und digitale Ressourcen.',
    nl: 'Algemene verkoopvoorwaarden voor Kiki en Christ boeken en digitale bronnen.',
    pl: 'Ogólne warunki sprzedaży książek i zasobów cyfrowych Kiki en Christ.',
    ar: 'الشروط العامة لبيع كتب وموارد Kiki en Christ الرقمية.',
    ru: 'Общие условия продажи книг и цифровых ресурсов Kiki en Christ.',
    zh: 'Kiki en Christ 书籍和数字资源的通用销售条款。',
    hi: 'Kiki en Christ पुस्तकों और डिजिटल संसाधनों की बिक्री की सामान्य शर्तें।'
  },
  'accessibilite': {
    fr: 'Déclaration d\'accessibilité RGAA / WCAG 2.1 AA du site Kiki en Christ.',
    en: 'Accessibility statement RGAA / WCAG 2.1 AA for the Kiki en Christ website.',
    es: 'Declaración de accesibilidad RGAA / WCAG 2.1 AA para el sitio web Kiki en Christ.',
    pt: 'Declaração de acessibilidade RGAA / WCAG 2.1 AA para o site Kiki en Christ.',
    it: 'Dichiarazione di accessibilità RGAA / WCAG 2.1 AA per il sito Kiki en Christ.',
    de: 'Barrierefreiheitserklärung RGAA / WCAG 2.1 AA für die Kiki en Christ Website.',
    nl: 'Toegankelijkheidsverklaring RGAA / WCAG 2.1 AA voor de Kiki en Christ website.',
    pl: 'Oświadczenie o dostępności RGAA / WCAG 2.1 AA dla strony Kiki en Christ.',
    ar: 'بيان إمكانية الوصول RGAA / WCAG 2.1 AA لموقع Kiki en Christ.',
    ru: 'Заявление о доступности RGAA / WCAG 2.1 AA для сайта Kiki en Christ.',
    zh: 'Kiki en Christ 网站的无障碍声明 RGAA / WCAG 2.1 AA。',
    hi: 'Kiki en Christ वेबसाइट के लिए अभिगम्यता कथन RGAA / WCAG 2.1 AA।'
  }
};

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Extraire le contenu réel du frontmatter imbriqué
function extractContent(content) {
  // Chercher le premier --- et le deuxième ---
  const firstDash = content.indexOf('---');
  if (firstDash === -1) return content;
  
  const secondDash = content.indexOf('---', firstDash + 3);
  if (secondDash === -1) return content;
  
  const frontmatterText = content.slice(firstDash + 3, secondDash).trim();
  let body = content.slice(secondDash + 3).trim();
  
  // Si le body commence par ```markdown, extraire le contenu interne
  if (body.startsWith('```markdown')) {
    const endMarkdown = body.indexOf('```', 11);
    if (endMarkdown !== -1) {
      body = body.slice(11, endMarkdown).trim();
    }
  }
  
  // Si le body a encore un frontmatter imbriqué
  const nestedDash = body.indexOf('---');
  if (nestedDash === 0) {
    const nestedEnd = body.indexOf('---', 3);
    if (nestedEnd !== -1) {
      body = body.slice(nestedEnd + 3).trim();
    }
  }
  
  return { frontmatterText, body };
}

function parseFrontmatter(text) {
  const fm = {};
  text.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[match[1]] = val;
    }
  });
  return fm;
}

function buildFrontmatter(pageKey, lang, translationKey, title, description) {
  const lines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `pageSlug: "${VALID_SLUGS[pageKey]}"`,
    `lang: "${lang}"`,
    `translationKey: "${translationKey}"`,
    `lastUpdated: "${new Date().toISOString().split('T')[0]}"`,
    '---'
  ];
  return lines.join('\n');
}

// Corriger un fichier
function fixFile(fileName) {
  const filePath = path.join(LEGAL_PAGES_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Identifier la page et la langue
  const match = fileName.match(/^(.+)\.(fr|en|es|pt|it|de|nl|pl|ar|ru|zh|hi)\.md$/);
  if (!match) {
    // Fichier source FR sans extension de langue
    const baseMatch = fileName.match(/^(.+)\.md$/);
    if (baseMatch && VALID_SLUGS[baseMatch[1]]) {
      return; // Fichier source FR, ne pas toucher
    }
    return;
  }
  
  const pageKey = match[1];
  const lang = match[2];
  const translationKey = VALID_SLUGS[pageKey];
  
  if (!VALID_SLUGS[pageKey]) return;
  
  const { frontmatterText, body } = extractContent(content);
  const parsedFm = parseFrontmatter(frontmatterText);
  
  // Utiliser les valeurs par défaut si manquantes
  const title = parsedFm.title || DEFAULT_TITLES[pageKey][lang] || DEFAULT_TITLES[pageKey].en;
  const description = parsedFm.description || DEFAULT_DESCRIPTIONS[pageKey][lang] || DEFAULT_DESCRIPTIONS[pageKey].en;
  
  // Nettoyer le body : retirer les lignes dupliquées (ex: 50 fois la même ligne en arabe)
  let cleanBody = body;
  
  // Pour l'arabe : supprimer les répétitions massives
  if (lang === 'ar') {
    const lines = cleanBody.split('\n');
    const seen = new Set();
    const uniqueLines = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        uniqueLines.push(line);
      } else if (!trimmed) {
        uniqueLines.push(line);
      }
    }
    cleanBody = uniqueLines.join('\n');
  }
  
  const newFrontmatter = buildFrontmatter(pageKey, lang, translationKey, title, description);
  const newContent = `${newFrontmatter}\n\n${cleanBody}`;
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ ${fileName} : corrigé`);
}

// Main
const files = fs.readdirSync(LEGAL_PAGES_DIR).filter(f => f.endsWith('.md'));

console.log('🔧 Correction des pages légales traduites...\n');

for (const file of files) {
  // Ne pas toucher aux fichiers source FR (sans extension de langue)
  if (file === 'mentions-legales.md' || file === 'confidentialite.md' || 
      file === 'cookies.md' || file === 'cgv.md' || file === 'accessibilite.md') {
    continue;
  }
  fixFile(file);
}

console.log('\n✅ Correction terminée !');