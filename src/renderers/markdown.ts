import type { ScanReport } from '../core/types.js';

export function renderMarkdown(report: ScanReport): string {
  const lines = [
    '# ContainerGhost report',
    '',
    `- Target: ${report.targetPath}`,
    `- Generated at: ${report.generatedAt}`,
    `- Issue count: ${report.summary.issueCount}`,
    `- Failed gates: ${report.summary.failedGates.join(', ') || 'none'}`,
    '',
    '## Issues',
    '',
  ];

  if (report.issues.length === 0) {
    lines.push('No issues found.', '');
  } else {
    for (const entry of report.issues) {
      lines.push(`- [${entry.severity}] ${entry.gate}: ${entry.title} — ${entry.detail}`);
    }
    lines.push('');
  }

  lines.push('## Evidence', '');
  for (const item of report.evidence) {
    lines.push(`- ${item.exists ? 'present' : 'missing'}: ${item.path}`);
  }

  return lines.join('\n');
}
