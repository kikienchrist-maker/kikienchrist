/**
 * Provider LibreTranslate (API gratuite/auto-hébergée)
 * Alternative à Ollama si pas de GPU local
 */
import axios from 'axios';
import type { TranslationProvider, TranslationOptions, LangCode } from '../types.js';

const LIBRE_LANG_MAP: Record<LangCode, string> = {
  fr: 'fr',
  en: 'en',
  es: 'es',
  pt: 'pt',
  it: 'it',
  de: 'de',
  nl: 'nl',
  pl: 'pl',
  ar: 'ar',
  ru: 'ru',
  zh: 'zh',
  hi: 'hi',
};

export class LibreTranslateProvider implements TranslationProvider {
  name: 'libretranslate' = 'libretranslate';
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl = 'https://libretranslate.de', apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/languages`, { timeout: 10000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async getSupportedLanguages(): Promise<LangCode[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/languages`, { timeout: 10000 });
      const langs = response.data.map((l: any) => l.code);
      return Object.keys(LIBRE_LANG_MAP).filter(l => langs.includes(LIBRE_LANG_MAP[l as LangCode])) as LangCode[];
    } catch {
      return Object.keys(LIBRE_LANG_MAP) as LangCode[];
    }
  }

  async translate(
    text: string,
    sourceLang: LangCode,
    targetLang: LangCode,
    options: TranslationOptions = {}
  ): Promise<string> {
    const payload: any = {
      q: text,
      source: LIBRE_LANG_MAP[sourceLang],
      target: LIBRE_LANG_MAP[targetLang],
      format: 'text',
    };

    if (this.apiKey) {
      payload.api_key = this.apiKey;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/translate`, payload, {
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.translatedText) {
        return response.data.translatedText;
      }
      throw new Error('Réponse LibreTranslate vide');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`LibreTranslate error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }
}