/**
 * Gestion des releases semantic-release
 */
import { execa } from 'execa';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { ReleaseConfig, ReleaseResult, VersionBump } from './types.js';
import { DEFAULT_RELEASE_CONFIG } from './config.js';
import semver from 'semver';

export interface ReleaseOptions {
  dryRun?: boolean;
  branch?: string;
  prerelease?: string;
  skipPublish?: boolean;
  skipGit?: boolean;
  debug?: boolean;
}

export async function runSemanticRelease(options: ReleaseOptions = {}): Promise<ReleaseResult> {
  const args = ['semantic-release'];
  
  if (options.dryRun) args.push('--dry-run');
  if (options.branch) args.push('--branch', options.branch);
  if (options.prerelease) args.push('--prerelease', options.prerelease);
  if (options.skipPublish) args.push('--no-publish');
  if (options.skipGit) args.push('--no-git');
  if (options.debug) args.push('--debug');
  
  try {
    const { stdout } = await execa('npx', args, { 
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    
    // Parser la sortie pour extraire version
    const versionMatch = stdout.match(/next version: ([\d.]+)/) || stdout.match(/published version ([\d.]+)/);
    const version = versionMatch ? versionMatch[1] : undefined;
    
    return {
      success: true,
      version,
      published: !options.dryRun && !options.skipPublish,
      notes: stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

export function generateReleaseConfig(config: Partial<ReleaseConfig> = {}): ReleaseConfig {
  return { ...DEFAULT_RELEASE_CONFIG, ...config };
}

export function writeReleaseConfig(config: ReleaseConfig, outputPath: string = '.releaserc.json'): void {
  writeFileSync(outputPath, JSON.stringify(config, null, 2), 'utf-8');
}

export function readReleaseConfig(configPath: string = '.releaserc.json'): ReleaseConfig | null {
  if (!existsSync(configPath)) return null;
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

export function analyzeCommitsForRelease(commits: Array<{ message: string }>): VersionBump {
  let bump: 'major' | 'minor' | 'patch' | 'none' = 'none';
  
  for (const commit of commits) {
    const parsed = parseCommitMessage(commit.message);
    
    if (parsed.breaking) {
      bump = 'major';
      break;
    }
    
    if (parsed.type === 'feat') {
      if (bump === 'none' || bump === 'patch') bump = 'minor';
    } else if (parsed.type === 'fix' || parsed.type === 'perf' || parsed.type === 'refactor') {
      if (bump === 'none') bump = 'patch';
    }
  }
  
  return {
    type: bump,
    version: '',
    previousVersion: '',
  };
}

export function calculateNextVersion(currentVersion: string, bump: VersionBump): string {
  switch (bump.type) {
    case 'major':
      return semver.inc(currentVersion, 'major') || currentVersion;
    case 'minor':
      return semver.inc(currentVersion, 'minor') || currentVersion;
    case 'patch':
      return semver.inc(currentVersion, 'patch') || currentVersion;
    default:
      return currentVersion;
  }
}

export function getCurrentVersion(packageJsonPath: string = 'package.json'): string {
  if (!existsSync(packageJsonPath)) return '0.0.0';
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return pkg.version || '0.0.0';
}

export function setVersion(version: string, packageJsonPath: string = 'package.json'): void {
  if (!existsSync(packageJsonPath)) return;
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  pkg.version = version;
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf-8');
}

export async function createGitTag(version: string, message?: string, tagFormat: string = 'v${version}'): Promise<void> {
  const tag = tagFormat.replace('${version}', version);
  const tagMessage = message || `Release ${version}`;
  
  await execa('git', ['tag', '-a', tag, '-m', tagMessage]);
  await execa('git', ['push', 'origin', tag]);
}

export async function commitChangelogAndVersion(changelogPath: string = 'CHANGELOG.md', version: string): Promise<void> {
  await execa('git', ['add', changelogPath, 'package.json']);
  await execa('git', ['commit', '-m', `chore(release): ${version} [skip ci]`]);
  await execa('git', ['push']);
}

// Import local pour éviter dépendance circulaire
import { parseCommitMessage } from './commit.js';