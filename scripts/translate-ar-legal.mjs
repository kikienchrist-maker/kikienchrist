#!/usr/bin/env node
/**
 * translate-ar-legal.mjs — Traduit les 3 bodies arabes (mentions-legales, cookies, accessibilite)
 * avec Ollama qwen2.5:1.5b en mode "human-quality" (prompt détaillé + température basse)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGAL_DIR = path.join(PROJECT_ROOT, 'src/content/legalPages');

const PAGES_TO_TRANSLATE = [
  { slug: 'mentions-legales', title: 'Legal Notice' },
  { slug: 'cookies', title: 'Cookie Policy' },
  { slug: 'accessibilite', title: 'Accessibility' }
];

// Prompt système pour traduction juridique FR -> AR
const SYSTEM_PROMPT = `Tu es un traducteur juridique expert français → arabe.
Traduis le Markdown ci-dessous en arabe formel (اللغة العربية الفصحى).
RÈGLES STRICTES :
1. Conserve TOUTE la structure Markdown (titres #, ##, listes -, tableaux |, blocs >, **gras**, *italique*, liens [texte](url))
2. Ne traduit PAS : URLs, emails, noms propres (Kiki en Christ, RGAA, WCAG, RGPD, CNIL, EU, FR), codes ISO
3. Terminologie juridique arabe standard :
   - "Mentions légales" → "إشعار قانوني"
   - "Politique de confidentialité" → "سياسة الخصوصية"
   - "Politique des cookies" → "سياسة ملفات تعريف الارتباط"
   - "Conditions générales de vente" → "الشروط والأحكام العامة للبيع"
   - "Accessibilité" → "إمكانية الوصول"
   - "Conformité" → "الامتثال"
   - "Responsable de traitement" → "المسؤول عن المعالجة"
   - "Données personnelles" → "البيانات الشخصية"
   - "Traitement" → "معالجة"
   - "Sous-traitant" → "المعالج من الباطن"
   - "Droit d'accès" → "حق الوصول"
   - "Droit de rectification" → "حق التصحيح"
   - "Droit à l'effacement" → "حق الحذف"
   - "Droit à la portabilité" → "حق النقل"
   - "Droit d'opposition" → "حق الاعتراض"
   - "Consentement" → "الموافقة"
   - "Finalité" → "الغرض"
   - "Base légale" → "الأساس القانوني"
   - "Durée de conservation" → "مدة الاحتفاظ"
   - "Transfert hors UE" → "نقل خارج الاتحاد الأوروبي"
   - "Cookies strictement nécessaires" → "ملفات تعريف الارتباط الضرورية للغاية"
   - "Cookies de mesure d'audience" → "ملفات تعريف الارتباط لقياس الجمهور"
   - "Cookies tiers" → "ملفات تعريف الارتباط الخاصة بطرف ثالث"
   - "Déclaration de conformité" → "إقرار الامتثال"
   - "Niveau AA" → "مستوى AA"
   - "Audit" → "تدقيق"
   - "Critères" → "معايير"
4. Style : formel, précis, arabe juridique (الفصحى القانونية)
5. RTLE : le texte sera affiché en RTL, pas de balises directionnelles nécessaires
6. Sortie : UNIQUEMENT le Markdown traduit, SANS explication, SANS frontmatter

TRADUIS MAINTENANT :`;

// Fonction appel Ollama
async function translateWithOllama(markdownText, pageTitle, model = 'qwen2.5:1.5b') {
  const prompt = `${SYSTEM_PROMPT}\n\n# ${pageTitle}\n\n${markdownText}`;
  const maxTokens = model.includes('7b') ? 8192 : 4096;
  
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          repeat_penalty: 1.1,
          num_predict: maxTokens,
          stop: ['---', '```']
        }
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.response?.trim() || '';
  } catch (err) {
    console.error(`❌ Erreur Ollama (${model}): ${err.message}`);
    return null;
  }
}

// Lecture body Markdown : gray-matter (data.content pour content: |, sinon parsed.content)
function readBody(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(raw);
  return parsed.data.content || parsed.content || '';
}

// Écriture fichier avec frontmatter préservé + nouveau body
function writeBody(filePath, newBody) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parts = raw.split('\n---\n');
  if (parts.length >= 2) {
    // Reconstituer frontmatter (parts[0] + --- + parts[1] + ---)
    const frontmatter = parts[0] + '\n---\n' + parts[1] + '\n---';
    const out = frontmatter + '\n\n' + newBody + '\n';
    fs.writeFileSync(filePath, out, 'utf-8');
  }
}

async function main() {
  console.log('🔄 Traduction arabe des 3 pages légales (Ollama qwen2.5:7b pour mentions-legales)...\n');
  
  for (const { slug, title } of PAGES_TO_TRANSLATE) {
    const filePath = path.join(LEGAL_DIR, `${slug}-ar.md`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${slug}-ar.md introuvable`);
      continue;
    }
    
    const frBody = readBody(path.join(LEGAL_DIR, `${slug}-fr.md`));
    const currentArBody = readBody(filePath);
    
    console.log(`📄 ${slug}-ar: ${currentArBody.length} chars (FR: ${frBody.length})`);
    
    if (currentArBody === frBody || currentArBody.length < 100) {
      console.log(`   🔄 Traduction nécessaire...`);
      // Utiliser qwen2.5:7b pour mentions-legales (plus long), 1.5b pour les autres
      const model = slug === 'mentions-legales' ? 'qwen2.5:7b' : 'qwen2.5:1.5b';
      console.log(`   🤖 Modèle: ${model}`);
      const translated = await translateWithOllama(frBody, title, model);
      
      if (translated && translated.length > 100) {
        writeBody(filePath, translated);
        console.log(`   ✅ Traduit: ${translated.length} chars`);
      } else {
        console.log(`   ❌ Échec traduction, garde FR`);
      }
    } else {
      console.log(`   ⏭️  Déjà traduit (${currentArBody.length} chars)`);
    }
    
    // Pause pour éviter surcharge Ollama
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log('\n🎉 Traduction arabe terminée !');
}

main().catch(console.error);