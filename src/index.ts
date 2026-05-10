#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { scanProject } from './core/scan.js';
import { renderMarkdown } from './renderers/markdown.js';
import { renderJson } from './renderers/json.js';
import { parseCliArgs } from './utils/args.js';

function main() {
  const cli = parseCliArgs(process.argv.slice(2));

  if (cli.help || !cli.command) {
    printHelp();
    process.exit(cli.help ? 0 : 1);
  }

  if (cli.version) {
    console.log('0.1.0');
    return;
  }

  if (!['scan', 'check'].includes(cli.command)) {
    console.error(`Unknown command: ${cli.command}`);
    printHelp();
    process.exit(1);
  }

  const report = scanProject(resolve(cli.targetPath), {
    redact: cli.redact,
    failOn: cli.failOn,
  });

  const markdown = renderMarkdown(report);
  const json = renderJson(report);

  if (cli.outPath) {
    mkdirSync(resolve(cli.outPath, '..'), { recursive: true });
    writeFileSync(resolve(cli.outPath), markdown);
  }

  if (cli.jsonPath) {
    mkdirSync(resolve(cli.jsonPath, '..'), { recursive: true });
    writeFileSync(resolve(cli.jsonPath), json + '\n');
  }

  if (!cli.outPath) {
    console.log(markdown);
  }

  if (cli.command === 'check' && report.summary.failedGates.length > 0) {
    process.exit(1);
  }
}

function printHelp() {
  console.log(`containerghost <scan|check> <path> [options]\n\nOptions:\n  --out <file>       Write Markdown report\n  --json <file>      Write JSON report\n  --fail-on <list>   Comma-separated gates\n  --no-redact        Disable secret redaction\n  --version          Print version\n  --help             Show help`);
}

main();
