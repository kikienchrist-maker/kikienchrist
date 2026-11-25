/**
 * Extrait les design tokens depuis le fichier CSS lafoidieu
 */
import { readFileSync } from 'fs';
import { BQ_NAMESPACE } from './types.js';

export interface TokenCategoryPatterns {
  color: RegExp[];
  spacing: RegExp[];
  typography: RegExp[];
  border: RegExp[];
  shadow: RegExp[];
  transition: RegExp[];
}

const TOKEN_PATTERNS: TokenCategoryPatterns = {
  color: [
    /--(?:color|bg|text|border|accent|primary|secondary|success|warning|error|info|muted|surface|on-surface)[\w-]*:/gi,
    /--(?:theme|palette)[\w-]*:/gi,
  ],
  spacing: [
    /--(?:space|spacing|gap|padding|margin|inset)[\w-]*:/gi,
    /--(?:size|width|height)[\w-]*:/gi,
  ],
  typography: [
    /--(?:font|text|heading|body|caption|label)[\w-]*:/gi,
    /--(?:line-height|letter-spacing|font-weight|font-size)[\w-]*:/gi,
  ],
  border: [
    /--(?:border|radius|rounded)[\w-]*:/gi,
  ],
  shadow: [
    /--(?:shadow|elevation|depth)[\w-]*:/gi,
  ],
  transition: [
    /--(?:transition|duration|easing|animate)[\w-]*:/gi,
  ],
};

export function extractTokensFromCSS(cssPath: string): Array<{name: string, value: string, category: string, line: number}> {
  const content = readFileSync(cssPath, 'utf-8');
  const lines = content.split('\n');
  const tokens: Array<{name: string, value: string, category: string, line: number}> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match CSS custom properties: --token-name: value;
    const matches = line.match(/^--([\w-]+)\s*:\s*([^;]+);/);
    if (matches) {
      const name = matches[1];
      const value = matches[2].trim();
      
      // Categorize
      let category = 'other';
      for (const [cat, patterns] of Object.entries(TOKEN_PATTERNS)) {
        for (const pattern of patterns) {
          if (pattern.test(`--${name}:`)) {
            category = cat;
            break;
          }
        }
        if (category !== 'other') break;
      }
      
      tokens.push({ name, value, category, line: i + 1 });
    }
  }
  
  return tokens;
}

export function extractBQClassesFromCSS(cssPath: string): string[] {
  const content = readFileSync(cssPath, 'utf-8');
  const classRegex = new RegExp(`\\.${BQ_NAMESPACE}-[\\w-]+`, 'g');
  const matches = content.match(classRegex) || [];
  return [...new Set(matches.map(m => m.slice(1)))]; // Remove leading '.'
}