// Type declarations for modules without types
declare module 'conventional-changelog' {
  interface Options {
    preset?: string;
    releaseCount?: number;
    from?: string;
    to?: string;
    context?: Record<string, any>;
    commitPartial?: string;
    lernaPackages?: boolean;
  }
  function conventionalChangelog(options: Options): Promise<string>;
  export = conventionalChangelog;
}

declare module 'conventional-commits-parser' {
  interface ParsedCommit {
    type?: string;
    scope?: string;
    subject?: string;
    body?: string;
    notes?: Array<{ text: string }>;
    footer?: Array<{ token: string }>;
    breaking?: boolean;
  }
  function parseConventionalCommit(message: string): ParsedCommit;
  export = parseConventionalCommit;
}