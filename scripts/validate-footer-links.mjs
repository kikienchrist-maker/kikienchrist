#!/usr/bin/env node
/**
 * validate-footer-links.mjs — Vérifie les liens légaux dans le footer
 * pour les 11 langues non-FR (le FR est la référence)
 */

const BASE_URL = 'https://kikienchrist.vercel.app';
const LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];

// Mapping slugs canoniques par langue (depuis LegalLayout)
const SLUGS = {
  'mentions-legales': { fr: 'mentions-legales', en: 'legal', es: 'avis-legal', de: 'impressum', pt: 'termos-legais', it: 'note-legali', ru: 'юридическая-информация', zh: '法律声明', hi: 'कानूनी-नोटيس' },
  'confidentialite': { fr: 'confidentialite', en: 'privacy', es: 'privacidad', de: 'datenschutz', pt: 'privacidade', it: 'privacy', ru: 'политика-конфиденциальности', zh: '隐私政策', hi: 'गोपनीयता-नीति' },
  'cookies': { fr: 'cookies', en: 'cookies', es: 'cookies', de: 'cookies', pt: 'cookies', it: 'cookies', ru: 'cookies', zh: 'cookies', hi: 'cookies' },
  'cgv': { fr: 'cgv', en: 'tos', es: 'tyc', de: 'agb', pt: 'tc', it: 'tcv', ru: 'условия', zh: '条款', hi: 'नियम-शर्तें' },
  'accessibilite': { fr: 'accessibilite', en: 'accessibility', es: 'accesibilidad', de: 'barrierefreiheit', pt: 'acessibilidade', it: 'accessibilita', ru: 'доступность', zh: '无障碍', hi: 'पहुंच' },
};

// Clés de traduction pour les noms de liens (dans translations.json legal.nav)
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
    const expectedHref = `/${lang}/${SLUGS[slug][lang] || slug}/`;
    
    // Cherche <a href="/lang/slug/"> avec le texte du lien
    const linkRegex = new RegExp(`<a[^>]*href=["']${expectedHref.replace('/', '\\/')}["'][^>]*>`, 'i');
    const found = linkRegex.test(html);
    
    if (!found) {
      // Essaie sans slash final
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
  console.log('🔗 Validation liens footer légaux (11 langues)...\n');
  
  const allResults = {};
  
  for (const lang of LANGS) {
    // Test sur page d'accueil de la langue (footer présent sur toutes les pages)
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
  
  // Résumé
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