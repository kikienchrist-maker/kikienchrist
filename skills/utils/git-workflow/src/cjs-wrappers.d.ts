// Déclarations pour wrappers CJS
declare module './parser.cjs' {
  export function parseCommitMessage(message: string): any;
}

declare module './changelog-wrapper.cjs' {
  export function generateChangelogRaw(options: any): Promise<string>;
}