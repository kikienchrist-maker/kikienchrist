/**
 * Provider DeepL API (payant, haute qualité)
 * Fallback premium pour révision finale
 */
import axios from 'axios';
import type { TranslationProvider, TranslationOptions, LangCode } from '../types.js';

const DEEPL_LANG_MAP: Record<LangCode, string | undefined> = {
  fr: 'FR',
  en: 'EN-US',
  es: 'ES',
  pt: 'PT-PT',
  it: 'IT',
  de: 'DE',
  nl: 'NL',
  pl: 'PL',
  ar: 'AR',
  ru: 'RU',
  zh: 'ZH',
  hi: undefined, // DeepL ne supporte pas l'hindi
};

export class DeepLProvider implements TranslationProvider {
  name: 'deepl' = 'deepl';
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl = 'https://api-free.deepl.com/v2') {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await axios.get(`${this.apiUrl}/usage`, {
        headers: { 'Authorization': `DeepL-Auth-Key ${this.apiKey}` },
        timeout: 10000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async getSupportedLanguages(): Promise<LangCode[]> {
    const supported = Object.entries(DEEPL_LANG_MAP)
      .filter(([, v]) => v !== undefined)
      .map(([k]) => k as LangCode);
    return supported;
  }

  async translate(
    text: string,
    sourceLang: LangCode,
    targetLang: LangCode,
    options: TranslationOptions = {}
  ): Promise<string> {
    const target = DEEPL_LANG_MAP[targetLang];
    if (!target) {
      throw new Error(`Langue ${targetLang} non supportée par DeepL`);
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/translate`,
        {
          text: [text],
          source_lang: DEEPL_LANG_MAP[sourceLang],
          target_lang: target,
          preserve_formatting: 1,
          formality: 'prefer_more',
        },
        {
          headers: {
            'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      if (response.data.translations?.[0]?.text) {
        return response.data.translations[0].text;
      }
      throw new Error('Réponse DeepL vide');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`DeepL error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}