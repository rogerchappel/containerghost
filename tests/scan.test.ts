import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
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

test('renderers return stable outputs', () => {
  const report = scanProject(fixture, { redact: true, failOn: [] });
  const markdown = renderMarkdown(report);
  const json = renderJson(report);
  assert.match(markdown, /# ContainerGhost report/);
  assert.match(json, /"issueCount":/);
});
