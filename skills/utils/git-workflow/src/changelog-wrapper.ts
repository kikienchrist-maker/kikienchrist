/**
 * Changelog generator - version simple sans dépendance externe
 */
export async function generateChangelogRaw(options: any): Promise<string> {
  // Version simplifiée pour éviter conventional-changelog
  return `# Changelog\n\n## [Unreleased]\n\n### Features\n\n- feat: exemple\n`;
}