/**
 * Configuration par défaut pour Ollama Client
 */
import type { OllamaConfig } from './types.js';

export const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  baseUrl: 'http://localhost:11434',
  timeout: 120000, // 2 minutes
  maxRetries: 3,
  retryDelay: 1000,
  defaultModel: 'qwen2.5:1.5b',
};

export const MODEL_PRESETS = {
  'qwen2.5:1.5b': { name: 'qwen2.5:1.5b', size: '986 MB', speed: 'fast', quality: 'good' },
  'qwen2.5:3b': { name: 'qwen2.5:3b', size: '1.9 GB', speed: 'medium', quality: 'better' },
  'qwen2.5:7b': { name: 'qwen2.5:7b', size: '4.7 GB', speed: 'slow', quality: 'best' },
  'llama3.2:1b': { name: 'llama3.2:1b', size: '1.3 GB', speed: 'fast', quality: 'good' },
  'llama3.2:3b': { name: 'llama3.2:3b', size: '2.0 GB', speed: 'medium', quality: 'better' },
  'mistral:7b': { name: 'mistral:7b', size: '4.1 GB', speed: 'slow', quality: 'best' },
  'gemma2:2b': { name: 'gemma2:2b', size: '1.6 GB', speed: 'fast', quality: 'good' },
  'gemma2:9b': { name: 'gemma2:9b', size: '5.4 GB', speed: 'slow', quality: 'best' },
} as const;

export type ModelPreset = keyof typeof MODEL_PRESETS;

export const TRANSLATION_SYSTEM_PROMPT = `Tu es un traducteur professionnel spécialisé dans la traduction de contenus chrétiens (livres, articles de blog, pages légales) du français vers d'autres langues.

RÈGLES STRICTES:
1. Garde le sens théologique exact - pas de paraphrase libre
2. Préserve la terminologie biblique standard pour chaque langue
3. Maintiens le ton respectueux et édifiant
4. NE TRADUIS PAS: noms propres (Kiki, Christ, Jésus, Dieu, Bible), références de versets (Jean 3:16), noms de livres bibliques
5. Utilise le vouvoiement formel pour Dieu (Vous/Tu selon la langue)
6. Pour l'arabe/hébreu: écriture RTL, terme "Allah" pour Dieu si contexte musulman, sinon terme standard
7. Pour le chinois: chinois simplifié, termes chrétiens standards (神 pour Dieu, 耶稣 pour Jésus)
8. HTML/Markdown: préserve TOUTES les balises, attributs, frontmatter YAML intact

GLOSSAIRE OBLIGATOIRE (français -> cible):
- "Dieu" -> terme standard cible
- "Jésus" -> Jésus / Isa / 耶稣 / يي苏
- "Saint-Esprit" -> Saint-Esprit / روح القدس / 圣灵
- "Écriture" -> Écriture / الكتاب المقدس / 经文
- "Salut" -> Salut / الخلاص / 救恩
- "Grâce" -> Grâce / نعمة / 恩典
- "Foi" -> Foi / إيمان / 信心
- "Église" -> Église / كنيسة / 教会
- "Prière" -> Prière / صلاة / 祷告
- "Bénédiction" -> Bénédiction / بركة / 祝福

Réponds UNIQUEMENT avec la traduction, sans commentaires ni explications.`;

export const BATCH_TRANSLATION_SYSTEM_PROMPT = `Tu es un traducteur par lots. Tu reçois plusieurs segments à traduire.
Réponds UNIQUEMENT avec un JSON valide:
{
  "translations": [
    { "id": 1, "text": "traduction segment 1" },
    { "id": 2, "text": "traduction segment 2" }
  ]
}
Pas de markdown, pas de commentaires.`;

export function mergeConfig(userConfig: Partial<OllamaConfig>): OllamaConfig {
  return { ...DEFAULT_OLLAMA_CONFIG, ...userConfig };
}