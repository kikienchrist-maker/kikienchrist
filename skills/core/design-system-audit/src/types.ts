/**
 * Types pour Design System Audit
 */
export interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'typography' | 'border' | 'shadow' | 'transition' | 'other';
  file: string;
  line: number;
}

export interface ComponentAudit {
  file: string;
  componentName: string;
  usesBqClasses: boolean;
  bqClassesUsed: string[];
  nonBqClassesUsed: string[];
  inlineStyles: string[];
  issues: string[];
  score: number; // 0-100
}

export interface DesignSystemReport {
  tokens: DesignToken[];
  components: ComponentAudit[];
  summary: {
    totalComponents: number;
    bqCompliant: number;
    nonCompliant: number;
    avgScore: number;
    missingTokens: string[];
    unusedTokens: string[];
  };
}

export const BQ_NAMESPACE = 'bq';
export const REQUIRED_TOKEN_CATEGORIES = ['color', 'spacing', 'typography', 'border', 'shadow', 'transition'] as const;