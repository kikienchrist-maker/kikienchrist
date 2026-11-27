/**
 * Provider LibreTranslate (API gratuite/auto-hébergée)
 * Alternative à Ollama si pas de GPU local
 * Utilise des miroirs publics fiables
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

// Miroirs publics LibreTranslate testés et fiables
const PUBLIC_MIRRORS = [
  'https://translate.argosopentech.com',  // Officiel Argos (le plus stable)
  'https://libretranslate.com',           // Miroir communautaire
  'https://libretranslate.de',            // Original (souvent down)
];

export class LibreTranslateProvider implements TranslationProvider {
  name: 'libretranslate' = 'libretranslate';
  private baseUrls: string[];
  private currentIndex: number = 0;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrls = baseUrl ? [baseUrl.replace(/\/$/, '')] : PUBLIC_MIRRORS;
    this.apiKey = apiKey;
  }

  private getCurrentUrl(): string {
    return this.baseUrls[this.currentIndex] as string;
  }

  private async tryNextMirror(): Promise<boolean> {
    this.currentIndex = (this.currentIndex + 1) % this.baseUrls.length;
    return this.currentIndex !== 0; // false si on a fait le tour
  }

  private getMirrorUrl(): string {
    return this.baseUrls[this.currentIndex] as string;
  }

  async isAvailable(): Promise<boolean> {
    // Essaie chaque miroir jusqu'à en trouver un qui marche
    for (let i = 0; i < this.baseUrls.length; i++) {
      try {
        const response = await axios.get(`${this.baseUrls[i]}/languages`, { timeout: 10000 });
        if (response.status === 200) {
          this.currentIndex = i;
          return true;
        }
      } catch {
        continue;
      }
    }
    return false;
  }

  async getSupportedLanguages(): Promise<LangCode[]> {
    for (let i = 0; i < this.baseUrls.length; i++) {
      try {
        const response = await axios.get(`${this.baseUrls[i]}/languages`, { timeout: 10000 });
        const langs = response.data.map((l: any) => l.code);
        this.currentIndex = i;
        return Object.keys(LIBRE_LANG_MAP).filter(l => langs.includes(LIBRE_LANG_MAP[l as LangCode])) as LangCode[];
      } catch {
        continue;
      }
    }
    return Object.keys(LIBRE_LANG_MAP) as LangCode[];
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

    let lastError: Error | null = null;
    
    // Essaie chaque miroir
    for (let attempt = 0; attempt < this.baseUrls.length; attempt++) {
      try {
        const response = await axios.post(`${this.getMirrorUrl()}/translate`, payload, {
          timeout: 60000,
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.translatedText) {
          return response.data.translatedText;
        }
        throw new Error('Réponse LibreTranslate vide');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        // Essaie le miroir suivant
        const hasMore = await this.tryNextMirror();
        if (!hasMore) break;
      }
    }

    throw lastError || new Error('Tous les miroirs LibreTranslate ont échoué');
  }
}