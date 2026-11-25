/**
 * Types pour Git Workflow
 */

export interface CommitMessage {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  footer?: string;
  breaking?: boolean;
  raw: string;
}

export interface ConventionalCommitConfig {
  types: CommitType[];
  scopes: string[];
  allowBreakingChanges: boolean;
  subjectPattern: string;
  subjectMaxLength: number;
}

export interface CommitType {
  type: string;
  section: string;
  hidden: boolean;
}

export interface ReleaseConfig {
  branches: string[];
  plugins: ReleasePlugin[];
  repositoryUrl: string;
  tagFormat: string;
}

export interface ReleasePlugin {
  name: string;
  options?: Record<string, any>;
}

export interface ChangelogConfig {
  preset: string;
  outputFile: string;
  sameFile: boolean;
  context?: Record<string, any>;
  commitPartial?: string;
  issuePartial?: string;
  userPartial?: string;
}

export interface GitHooksConfig {
  commitMsg: boolean;
  preCommit: boolean;
  prePush: boolean;
  prepareCommitMsg: boolean;
}

export interface VersionBump {
  type: 'major' | 'minor' | 'patch' | 'none';
  version: string;
  previousVersion: string;
}

export interface ReleaseResult {
  success: boolean;
  version?: string;
  changelog?: string;
  notes?: string;
  published?: boolean;
  error?: string;
}

export interface CommitAnalysis {
  commits: CommitMessage[];
  versionBump: VersionBump;
  changelog: string;
}