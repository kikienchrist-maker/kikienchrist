#!/usr/bin/env node
/**
 * validate-deployed.mjs — Vérifie JSON-LD, breadcrumbs, TOC sur le site déployé
 * pour toutes les pages légales (55 URLs)
 */

const BASE_URL = 'https://kikienchrist.vercel.app';
const PAGES = ['mentions-legales', 'confidentialite', 'cookies', 'cgv', 'accessibilite'];
const LANGS = ['fr', 'en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

async function fetchHtml(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Validation-Bot/1.0' } });
    if (!res.ok) return { error: `HTTP ${res.status}`, html: '' };
    return { error: null, html: await res.text() };
  } catch (err) {
    return { error: err.message, html: '' };
  }
}

function checkJsonLd(html) {
  const matches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (!matches || matches.length === 0) return { valid: false, reason: 'Aucun script JSON-LD' };
  
  for (const match of matches) {
    const content = match.replace(/<\/?script[^>]*>/g, '').trim();
    try {
      const parsed = JSON.parse(content);
      if (parsed['@type'] === 'WebPage' || parsed['@type'] === 'BreadcrumbList') {
        return { valid: true, types: parsed['@type'] };
      }
    } catch (e) {
      // JSON invalide
    }
  }
  return { valid: false, reason: 'JSON-LD WebPage/BreadcrumbList non trouvé' };
}

function checkBreadcrumb(html) {
  // Cherche nav aria-label="breadcrumb" ou ol.breadcrumb ou data-breadcrumb
  const hasBreadcrumbNav = /<nav[^>]*aria-label=["']breadcrumb["'][^>]*>/i.test(html) || 
                           /<nav[^>]*class=["'][^"']*breadcrumb[^"']*["']/i.test(html) ||
                           /<ol[^>]*class=["'][^"']*breadcrumb[^"']*["']/i.test(html);
  
  // Cherche liens vers pages légales dans le breadcrumb
  const hasLegalLinks = /href="\/[a-z]{2}\/(mentions-legales|confidentialite|cookies|cgv|accessibilite)"/i.test(html);
  
  return { valid: hasBreadcrumbNav && hasLegalLinks, hasNav: hasBreadcrumbNav, hasLinks: hasLegalLinks };
}

function checkTOC(html) {
  // Sidebar TOC : aside avec nav#toc ou .toc ou data-toc
  const hasTOCAside = /<aside[^>]*(id|class)=["'][^"']*(toc|table-of-contents|sommaire)[^"']*["']/i.test(html);
  
  // Liste de liens vers #h2 #h3
  const hasTOCLinks = /href="#[^"]+"/.test(html) && /<nav[^>]*(id|class)=["'][^"']*(toc|sommaire)[^"']*["']/i.test(html);
  
  // Ou simplement des ancres h2/h3 avec id
  const hasHeadingIds = /<h[23][^>]*id=["'][^"']*["']/i.test(html);
  
  return { valid: hasTOCAside && hasTOCLinks, hasAside: hasTOCAside, hasLinks: hasTOCLinks, hasHeadingIds: hasHeadingIds };
}

function checkLangAttr(html, lang) {
  const htmlLangMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  const htmlLang = htmlLangMatch ? htmlLangMatch[1] : null;
  
  const ogLocaleMatch = html.match(/property=["']og:locale["'][^>]*content=["']([^"']+)["']/i);
  const ogLocale = ogLocaleMatch ? ogLocaleMatch[1] : null;
  
  // Mapping lang -> og:locale attendu
  const expectedOgLocale = {
    'fr': 'fr_FR', 'en': 'en_US', 'es': 'es_ES', 'pt': 'pt_PT',
    'de': 'de_DE', 'it': 'it_IT', 'nl': 'nl_NL', 'pl': 'pl_PL',
    'ar': 'ar_AR', 'ru': 'ru_RU', 'zh': 'zh_CN', 'hi': 'hi_IN'
  }[lang];
  
  return { 
    valid: htmlLang === lang && ogLocale === expectedOgLocale,
    htmlLang, ogLocale, expectedOgLocale
  };
}

async function main() {
  console.log('🔍 Validation JSON-LD, Breadcrumbs, TOC, Lang sur 55 pages...\n');
  
  const results = [];
  
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const url = `${BASE_URL}/${lang}/${page}/`;
      const { error, html } = await fetchHtml(url);
      
      if (error) {
        results.push({ url, lang, page, error, jsonld: false, breadcrumb: false, toc: false, langAttr: false });
        console.log(`❌ ${lang}/${page}: ${error}`);
        continue;
      }
      
      const jsonld = checkJsonLd(html);
      const breadcrumb = checkBreadcrumb(html);
      const toc = checkTOC(html);
      const langAttr = checkLangAttr(html, lang);
      
      const allOk = jsonld.valid && breadcrumb.valid && toc.valid && langAttr.valid;
      const status = allOk ? '✅' : '⚠️';
      
      results.push({ url, lang, page, jsonld: jsonld.valid, breadcrumb: breadcrumb.valid, toc: toc.valid, langAttr: langAttr.valid });
      
      if (!allOk) {
        console.log(`${status} ${lang}/${page}: JSON-LD=${jsonld.valid} BC=${breadcrumb.valid} TOC=${toc.valid} LANG=${langAttr.valid}`);
        if (!jsonld.valid) console.log(`   JSON-LD: ${jsonld.reason}`);
        if (!breadcrumb.valid) console.log(`   Breadcrumb: nav=${breadcrumb.hasNav} links=${breadcrumb.hasLinks}`);
        if (!toc.valid) console.log(`   TOC: aside=${toc.hasAside} links=${toc.hasLinks} headingIds=${toc.hasHeadingIds}`);
        if (!langAttr.valid) console.log(`   Lang: html=${langAttr.htmlLang} og:locale=${langAttr.ogLocale} (attendu=${langAttr.expectedOgLocale})`);
      } else {
        console.log(`✅ ${lang}/${page}: OK`);
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  // Résumé
  const total = results.length;
  const ok = results.filter(r => r.jsonld && r.breadcrumb && r.toc && r.langAttr).length;
  const jsonldOk = results.filter(r => r.jsonld).length;
  const bcOk = results.filter(r => r.breadcrumb).length;
  const tocOk = results.filter(r => r.toc).length;
  const langOk = results.filter(r => r.langAttr).length;
  
  console.log('\n📊 RÉSUMÉ:');
  console.log(`   Total pages: ${total}`);
  console.log(`   Tout OK: ${ok}/${total}`);
  console.log(`   JSON-LD: ${jsonldOk}/${total}`);
  console.log(`   Breadcrumbs: ${bcOk}/${total}`);
  console.log(`   TOC Sidebar: ${tocOk}/${total}`);
  console.log(`   Lang/og:locale: ${langOk}/${total}`);
  
  // Pages en échec
  const failed = results.filter(r => !r.jsonld || !r.breadcrumb || !r.toc || !r.langAttr);
  if (failed.length > 0) {
    console.log('\n⚠️ Pages à corriger:');
    for (const r of failed) {
      const issues = [];
      if (!r.jsonld) issues.push('JSON-LD');
      if (!r.breadcrumb) issues.push('Breadcrumb');
      if (!r.toc) issues.push('TOC');
      if (!r.langAttr) issues.push('Lang');
      console.log(`   ${r.lang}/${r.page}: ${issues.join(', ')}`);
    }
  }
}

main().catch(console.error);