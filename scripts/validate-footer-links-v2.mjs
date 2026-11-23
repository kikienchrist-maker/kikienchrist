#!/usr/bin/env node
/**
 * validate-footer-links-v2.mjs — Vérifie les liens légaux dans le footer
 * URLs réelles = slugs FR pour toutes les langues
 */

const BASE_URL = 'https://kikienchrist.vercel.app';
const LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

// Slugs FR utilisés par les routes Astro pour toutes les langues
const SLUGS = {
  'mentions-legales': 'mentions-legales',
  'confidentialite': 'confidentialite',
  'cookies': 'cookies',
  'cgv': 'cgv',
  'accessibilite': 'accessibilite',
};

const LINK_KEYS = {
  'mentions-legales': 'mentionsLegales',
  'confidentialite': 'confidentialite',
  'cookies': 'cookies',
  'cgv': 'cgv',
  'accessibilite': 'accessibilite'
};

async function fetchHtml(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Footer-Link-Validator/1.0' } });
    if (!res.ok) return { error: `HTTP ${res.status}`, html: '' };
    return { error: null, html: await res.text() };
  } catch (err) {
    return { error: err.message, html: '' };
  }
}

function checkFooterLinks(html, lang) {
  const results = {};
  const issues = [];
  
  for (const [slug, key] of Object.entries(LINK_KEYS)) {
    const expectedHref = `/${lang}/${SLUGS[slug]}/`;
    
    const linkRegex = new RegExp(`<a[^>]*href=["']${expectedHref.replace('/', '\\/')}["'][^>]*>`, 'i');
    const found = linkRegex.test(html);
    
    if (!found) {
      const altHref = expectedHref.replace(/\/$/, '');
      const altRegex = new RegExp(`<a[^>]*href=["']${altHref.replace('/', '\\/')}["'][^>]*>`, 'i');
      if (!altRegex.test(html)) {
        issues.push(`${key}: lien manquant ou href incorrect (attendu: ${expectedHref})`);
        results[key] = { ok: false, expected: expectedHref };
      } else {
        results[key] = { ok: true, expected: expectedHref };
      }
    } else {
      results[key] = { ok: true, expected: expectedHref };
    }
  }
  
  return { ok: issues.length === 0, issues, results };
}

async function main() {
  console.log('🔗 Validation liens footer légaux (11 langues) — URLs réelles...\n');
  
  const allResults = {};
  
  for (const lang of LANGS) {
    const url = `${BASE_URL}/${lang}/`;
    const { error, html } = await fetchHtml(url);
    
    if (error) {
      console.log(`❌ ${lang}: ${error}`);
      allResults[lang] = { error };
      continue;
    }
    
    const check = checkFooterLinks(html, lang);
    allResults[lang] = check;
    
    if (check.ok) {
      console.log(`✅ ${lang}: 5/5 liens OK`);
    } else {
      console.log(`⚠️  ${lang}: ${check.issues.length} problème(s)`);
      for (const issue of check.issues) {
        console.log(`   - ${issue}`);
      }
    }
    
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log('\n📊 RÉSUMÉ:');
  let totalOk = 0, totalIssues = 0;
  for (const [lang, result] of Object.entries(allResults)) {
    if (result.error) {
      console.log(`   ${lang}: ERREUR (${result.error})`);
    } else if (result.ok) {
      console.log(`   ${lang}: ✅ 5/5`);
      totalOk += 5;
    } else {
      const okCount = Object.values(result.results).filter(r => r.ok).length;
      console.log(`   ${lang}: ⚠️ ${okCount}/5`);
      totalOk += okCount;
      totalIssues += result.issues.length;
    }
  }
  console.log(`\nTotal liens OK: ${totalOk}/55`);
  console.log(`Total problèmes: ${totalIssues}`);
}

main().catch(console.error);