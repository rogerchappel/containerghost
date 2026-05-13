import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { scanProject } from '../src/core/scan.js';
import { renderMarkdown } from '../src/renderers/markdown.js';
import { renderJson } from '../src/renderers/json.js';

const fixture = resolve('examples/basic');

test('scanProject finds deterministic issues and redacts secrets', () => {
  const report = scanProject(fixture, { redact: true, failOn: ['missing-env', 'unknown-service'] });
  assert.equal(report.generatedAt, '1970-01-01T00:00:00.000Z');
  assert.ok(report.issues.some((issue) => issue.gate === 'missing-env'));
  const envEvidence = report.evidence.find((entry) => entry.path.endsWith('.env.example'));
  assert.ok(envEvidence);
  assert.match(JSON.stringify(envEvidence), /\[REDACTED\]/);
  assert.deepEqual(report.summary.failedGates, ['missing-env', 'unknown-service']);
});


test('env example parser accepts comments, export prefixes, and spaced assignments', () => {
  const root = mkdtempSync(join(tmpdir(), 'containerghost-env-'));
  mkdirSync(join(root, '.devcontainer'));
  writeFileSync(join(root, '.devcontainer', 'devcontainer.json'), JSON.stringify({ service: 'app', containerEnv: { API_URL: 'x', FEATURE_FLAG: '1', NODE_ENV: 'test' } }));
  writeFileSync(join(root, 'docker-compose.yml'), `services:
  app:
    image: node:20
`);
  writeFileSync(join(root, '.env.example'), `# local defaults
export API_URL=http://localhost:3000
FEATURE_FLAG = true
NODE_ENV=test # inline comments are fine
`);

  const report = scanProject(root, { redact: true, failOn: ['missing-env'] });

  assert.equal(report.issues.some((issue) => issue.gate === 'missing-env'), false);
  assert.deepEqual(report.summary.failedGates, []);
});

test('renderers return stable outputs', () => {
  const report = scanProject(fixture, { redact: true, failOn: [] });
  const markdown = renderMarkdown(report);
  const json = renderJson(report);
  assert.match(markdown, /# ContainerGhost report/);
  assert.match(json, /"issueCount":/);
});
