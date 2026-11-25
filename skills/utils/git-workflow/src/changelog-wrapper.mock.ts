/**
 * Mock changelog wrapper pour tests
 */
export async function generateChangelogRaw(options: any): Promise<string> {
  return `# Changelog\n\n## [1.0.0] - 2024-01-01\n\n### Features\n\n- feat(test): test feature\n`;
}