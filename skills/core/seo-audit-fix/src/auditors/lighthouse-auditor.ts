/**
 * Auditeur Lighthouse (via CLI ou API)
 * Note: Nécessite lighthouse installé globalement ou via npx
 */
import { spawn } from 'child_process';
import type { PageAuditResult, LighthouseAuditResult, SEOIssue } from '../types.js';

export interface LighthouseOptions {
  /** URL à auditer */
  url: string;
  /** Seuils de passage */
  thresholds: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  /** Préset Lighthouse */
  preset?: 'desktop' | 'mobile';
  /** Timeout */
  timeoutMs?: number;
}

export async function runLighthouseAudit(options: LighthouseOptions): Promise<LighthouseAuditResult> {
  const { url, thresholds, preset = 'mobile', timeoutMs = 120000 } = options;
  
  return new Promise((resolve, reject) => {
    const args = [
      url,
      '--output=json',
      '--output-path=stdout',
      `--preset=${preset}`,
      '--chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"',
      '--quiet',
    ];
    
    const child = spawn('npx', ['lighthouse', ...args], {
      timeout: timeoutMs,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        // Lighthouse peut retourner non-zéro si seuils non atteints
        // On essaie quand même de parser la sortie
      }
      
      try {
        const result = parseLighthouseOutput(stdout, thresholds);
        resolve(result);
      } catch (error) {
        reject(new Error(`Lighthouse parse error: ${error instanceof Error ? error.message : error}. Stderr: ${stderr}`));
      }
    });
    
    child.on('error', (error) => {
      reject(new Error(`Lighthouse spawn error: ${error.message}`));
    });
  });
}

function parseLighthouseOutput(output: string, thresholds: LighthouseOptions['thresholds']): LighthouseAuditResult {
  // Trouver le JSON dans la sortie (peut être mélangé avec logs)
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Aucun JSON trouvé dans la sortie Lighthouse');
  }
  
  const data = JSON.parse(jsonMatch[0]);
  
  const categories = data.categories || {};
  const performance = Math.round((categories.performance?.score || 0) * 100);
  const accessibility = Math.round((categories.accessibility?.score || 0) * 100);
  const bestPractices = Math.round((categories['best-practices']?.score || 0) * 100);
  const seo = Math.round((categories.seo?.score || 0) * 100);
  
  const passed = 
    performance >= thresholds.performance &&
    accessibility >= thresholds.accessibility &&
    bestPractices >= thresholds.bestPractices &&
    seo >= thresholds.seo;
  
  // Extraire métriques clés
  const audits = data.audits || {};
  const metrics: Record<string, number> = {};
  
  const keyMetrics = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'speed-index',
    'interactive',
    'first-meaningful-paint',
  ];
  
  for (const metric of keyMetrics) {
    if (audits[metric]?.numericValue) {
      metrics[metric] = audits[metric].numericValue;
    }
  }
  
  // Opportunités et diagnostics
  const opportunities: string[] = [];
  const diagnostics: string[] = [];
  
  for (const [key, audit] of Object.entries(audits)) {
    const a = audit as any;
    if (a.score !== null && a.score < 1) {
      if (a.details?.type === 'opportunity') {
        opportunities.push(`${a.title}: ${a.description}`);
      } else if (a.details?.type === 'diagnostic') {
        diagnostics.push(`${a.title}: ${a.description}`);
      }
    }
  }
  
  return {
    performance,
    accessibility,
    bestPractices,
    seo,
    passed,
    metrics,
    opportunities: opportunities.slice(0, 10),
    diagnostics: diagnostics.slice(0, 10),
  };
}

/**
 * Audit Lighthouse pour une page dans le pipeline
 */
export async function auditLighthouseForPage(
  url: string, 
  thresholds: LighthouseOptions['thresholds'],
  result: PageAuditResult
): Promise<LighthouseAuditResult | undefined> {
  try {
    const lighthouseResult = await runLighthouseAudit({ url, thresholds });
    
    // Ajouter issues si seuils non atteints
    if (lighthouseResult.performance < thresholds.performance) {
      result.issues.push({
        type: 'warning',
        category: 'lighthouse',
        message: `Performance: ${lighthouseResult.performance}/${thresholds.performance}`,
      });
    }
    if (lighthouseResult.accessibility < thresholds.accessibility) {
      result.issues.push({
        type: 'error',
        category: 'lighthouse',
        message: `Accessibilité: ${lighthouseResult.accessibility}/${thresholds.accessibility}`,
      });
    }
    if (lighthouseResult.bestPractices < thresholds.bestPractices) {
      result.issues.push({
        type: 'warning',
        category: 'lighthouse',
        message: `Bonnes pratiques: ${lighthouseResult.bestPractices}/${thresholds.bestPractices}`,
      });
    }
    if (lighthouseResult.seo < thresholds.seo) {
      result.issues.push({
        type: 'error',
        category: 'lighthouse',
        message: `SEO: ${lighthouseResult.seo}/${thresholds.seo}`,
      });
    }
    
    return lighthouseResult;
  } catch (error) {
    result.issues.push({
      type: 'warning',
      category: 'lighthouse',
      message: `Lighthouse audit échoué: ${error instanceof Error ? error.message : error}`,
    });
    return undefined;
  }
}