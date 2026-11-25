/**
 * Parser pour conventional commits - version simple sans dépendance externe
 */
export function parseCommitMessage(message: string): any {
  const match = message.match(/^(\w+)(?:\(([^)]+)\))?(!?):\s*(.+)$/);
  if (!match) {
    return { type: '', scope: null, subject: '', body: '', footer: [], notes: [], breaking: false };
  }
  const [, type, scope, breaking, subject] = match;
  return {
    type,
    scope: scope || null,
    subject,
    body: '',
    footer: [],
    notes: [],
    breaking: breaking === '!',
  };
}