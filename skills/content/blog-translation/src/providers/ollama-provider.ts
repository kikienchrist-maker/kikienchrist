/**
 * Provider Ollama pour traduction locale
 * Utilise qwen2.5:1.5b (rapide) ou qwen2.5:7b (qualité)
 */
import axios from 'axios';
import type { TranslationProvider, TranslationOptions, LangCode, GlossaryEntry } from '../types.js';

const LANG_NAMES: Record<LangCode, string> = {
  fr: 'Français',
  en: 'Anglais',
  es: 'Espagnol',
  pt: 'Portugais',
  it: 'Italien',
  de: 'Allemand',
  nl: 'Néerlandais',
  pl: 'Polonais',
  ar: 'Arabe',
  ru: 'Russe',
  zh: 'Chinois',
  hi: 'Hindi',
};

export class OllamaProvider implements TranslationProvider {
  name: 'ollama' = 'ollama';
  private baseUrl: string;
  private defaultModel: string;
  private timeoutMs: number;

  constructor(baseUrl = 'http://localhost:11434', defaultModel = 'qwen2.5:0.5b', timeoutMs = 180000) {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
    this.timeoutMs = timeoutMs;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async ensureModel(model: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      const models = response.data.models || [];
      const hasModel = models.some((m: any) => m.name.startsWith(model.split(':')[0]));
      
      if (!hasModel) {
        console.log(`📥 Modèle ${model} non trouvé, téléchargement...`);
        await axios.post(`${this.baseUrl}/api/pull`, { name: model, stream: false }, { timeout: 300000 });
        console.log(`✅ Modèle ${model} installé`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Impossible d'installer ${model}: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  async getSupportedLanguages(): Promise<LangCode[]> {
    // qwen2.5 supporte toutes nos langues cibles
    return ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'pl', 'ar', 'ru', 'zh', 'hi'];
  }

  async translate(
    text: string,
    sourceLang: LangCode,
    targetLang: LangCode,
    options: TranslationOptions = {}
  ): Promise<string> {
    const model = options.model || this.defaultModel;
    const glossary = options.glossary || [];
    const context = options.context || 'blog article chrétien';
    const temperature = options.temperature ?? 0.3;
    const maxTokens = options.maxTokens ?? 4000;

    const prompt = this.buildPrompt(text, sourceLang, targetLang, glossary, context);

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model,
          prompt,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
            top_p: 0.9,
            repeat_penalty: 1.1,
          },
        },
        { timeout: this.timeoutMs }
      );

      if (response.data.response) {
        return this.cleanTranslation(response.data.response);
      }
      throw new Error('Réponse Ollama vide');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Ollama error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  private buildPrompt(
    text: string,
    sourceLang: LangCode,
    targetLang: LangCode,
    glossary: GlossaryEntry[],
    context: string
  ): string {
    const glossaryText = glossary.length > 0
      ? `\nGLOSSAIRE (termes à préserver/traduire spécifiquement):\n${glossary.map(g => 
          `${g.source} → ${g.target}${g.keepAsIs ? ' (NE PAS TRADUIRE)' : ''}${g.context ? ` [${g.context}]` : ''}`
        ).join('\n')}\n`
      : '';

    return `Tu es un traducteur expert spécialisé dans les textes chrétiens/théologiques.

TRADUIRE DE ${LANG_NAMES[sourceLang].toUpperCase()} VERS ${LANG_NAMES[targetLang].toUpperCase()}.

CONTEXTE: ${context}
${glossaryText}

RÈGLES STRICTES:
1. Traduction naturelle, fluide, style littéraire français (pas de traduction mot-à-mot)
2. Préserver EXACTEMENT les termes du glossaire (noms propres, références bibliques, termes théologiques)
3. Garder le formatage Markdown (titres, listes, tableaux, citations, gras, italique)
4. Ne PAS ajouter de commentaires, notes, ou explications
5. Ne PAS traduire les références bibliques (ex: "Jean 3:16" reste "Jean 3:16")
6. Adapter les termes théologiques selon la tradition francophone/cible
7. Ton: respectueux, édifiant, accessible

TEXTE À TRADUIRE:
${text}

TRADUCTION:`;
  }

  private cleanTranslation(response: string): string {
    // Nettoyer les artefacts courants des LLM
    let cleaned = response.trim();
    
    // Retirer les marqueurs de début/fin si présents
    cleaned = cleaned.replace(/^(TRADUCTION|Translation|Voici la traduction|Here is the translation)[:\s]*/i, '');
    cleaned = cleaned.replace(/^```(markdown|md)?\n?/, '');
    cleaned = cleaned.replace(/\n?```$/, '');
    
    // Retirer les blocs de pensée <think>...</think> (qwen)
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    return cleaned.trim();
  }
}