import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { EvidenceRecord, Issue, ScanReport } from './types.js';

const SECRET_PATTERN = /((api|auth|secret|token|key|password)[A-Za-z0-9_\-]*\s*[=:]\s*)([^\s"']+)/gi;

export function scanProject(targetPath: string, options: { redact: boolean; failOn: string[] }): ScanReport {
  const generatedAt = new Date(0).toISOString();
  const evidence: EvidenceRecord[] = [];
  const issues: Issue[] = [];

  const devcontainerPath = join(targetPath, '.devcontainer', 'devcontainer.json');
  const composePath = firstExisting([join(targetPath, 'docker-compose.yml'), join(targetPath, 'compose.yml')]);
  const dockerfilePath = firstExisting([join(targetPath, 'Dockerfile'), join(targetPath, '.devcontainer', 'Dockerfile')]);
  const envExamplePath = join(targetPath, '.env.example');
  const packagePath = join(targetPath, 'package.json');

  const devcontainer = readJsonIfExists(devcontainerPath, evidence);
  const compose = readYamlIfExists(composePath, evidence);
  const dockerfile = readTextIfExists(dockerfilePath, evidence, options.redact);
  const envExample = readTextIfExists(envExamplePath, evidence, options.redact);
  const packageJson = readJsonIfExists(packagePath, evidence);

  const services = compose && typeof compose === 'object' ? Object.keys((compose as any).services ?? {}) : [];
  const forwardPorts = Array.isArray((devcontainer as any)?.forwardPorts) ? (devcontainer as any).forwardPorts.map(Number) : [];
  const composePorts = services.flatMap((serviceName) => {
    const rawPorts = ((compose as any).services?.[serviceName]?.ports ?? []) as Array<string | number>;
    return rawPorts.map((value) => Number(String(value).split(':')[0]));
  }).filter((value) => !Number.isNaN(value));

  if (!devcontainer) {
    issues.push(issue('missing-devcontainer', 'error', 'Missing devcontainer', 'No .devcontainer/devcontainer.json found.'));
  }

  if (!compose) {
    issues.push(issue('missing-compose', 'error', 'Missing Docker Compose file', 'No docker-compose.yml or compose.yml found.'));
  }

  if (!envExample) {
    issues.push(issue('missing-env', 'error', 'Missing .env.example', 'Expected a checked-in .env.example file.'));
  }

  if (devcontainer && compose && (devcontainer as any).service && !services.includes((devcontainer as any).service)) {
    issues.push(issue('unknown-service', 'error', 'Devcontainer service missing in compose', `devcontainer service "${(devcontainer as any).service}" not found in compose services: ${services.join(', ') || 'none'}.`));
  }

  const missingPorts = forwardPorts.filter((port: number) => !composePorts.includes(port));
  if (missingPorts.length > 0) {
    issues.push(issue('port-conflict', 'warning', 'Forwarded ports missing from compose', `Ports ${missingPorts.join(', ')} are forwarded in devcontainer but not published by compose.`));
  }

  if (dockerfile && packageJson && !(packageJson as any).scripts?.dev) {
    issues.push(issue('missing-script', 'warning', 'Missing package dev script', 'package.json does not define a dev script for container workflows.'));
  }

  if (envExample && devcontainer) {
    const containerEnv = Object.keys((devcontainer as any).containerEnv ?? {});
    const envKeys = envExample.split(/\r?\n/).filter(Boolean).map((line) => line.split('=')[0].trim());
    const missingEnv = containerEnv.filter((key) => !envKeys.includes(key));
    if (missingEnv.length > 0) {
      issues.push(issue('missing-env', 'error', 'Container env keys missing from .env.example', `Missing keys: ${missingEnv.join(', ')}`));
    }
  }

  const failedGates = options.failOn.filter((gate) => issues.some((entry) => entry.gate === gate));

  return {
    targetPath,
    generatedAt,
    summary: {
      issueCount: issues.length,
      failedGates,
    },
    issues: issues.sort((left, right) => `${left.gate}:${left.title}`.localeCompare(`${right.gate}:${right.title}`)),
    evidence,
  };
}

function firstExisting(paths: string[]): string {
  return paths.find((candidate) => existsSync(candidate)) ?? paths[0]!;
}

function readJsonIfExists(path: string, evidence: EvidenceRecord[]) {
  if (!existsSync(path)) {
    evidence.push({ path, exists: false });
    return null;
  }
  const content = readFileSync(path, 'utf8');
  const parsed = JSON.parse(content);
  evidence.push({ path, exists: true, details: parsed });
  return parsed;
}

function readYamlIfExists(path: string, evidence: EvidenceRecord[]) {
  if (!existsSync(path)) {
    evidence.push({ path, exists: false });
    return null;
  }
  const content = readFileSync(path, 'utf8');
  const parsed = parseYaml(content);
  evidence.push({ path, exists: true, details: parsed as Record<string, unknown> });
  return parsed;
}

function readTextIfExists(path: string, evidence: EvidenceRecord[], redact: boolean) {
  if (!existsSync(path)) {
    evidence.push({ path, exists: false });
    return null;
  }
  const content = readFileSync(path, 'utf8');
  const finalContent = redact ? content.replace(SECRET_PATTERN, '$1[REDACTED]') : content;
  evidence.push({ path, exists: true, details: { preview: finalContent.split(/\r?\n/).slice(0, 12) } });
  return finalContent;
}

function issue(gate: string, severity: Issue['severity'], title: string, detail: string): Issue {
  return { gate, severity, title, detail };
}
