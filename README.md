# ContainerGhost

ContainerGhost is a local-first CLI that audits devcontainer, Docker Compose, Dockerfile, package scripts, and `.env.example` drift before humans or agents burn time in a broken setup.

## Why it exists

Dev environments drift quietly. A devcontainer points at the wrong service, forwarded ports no longer match compose, required env keys disappear, or Dockerfile/package scripts stop lining up. ContainerGhost turns that drift into deterministic local evidence.

## Quick start

```bash
npm install
npm run build
node dist/src/index.js scan examples/basic --out containerghost.md --json containerghost.json
node dist/src/index.js check examples/basic --fail-on missing-env,unknown-service
```

## CLI

```bash
containerghost scan . --out containerghost.md --json containerghost.json
containerghost check . --fail-on missing-env,port-conflict,unknown-service
```

## What it checks in the MVP

- `.devcontainer/devcontainer.json` exists
- `docker-compose.yml` or `compose.yml` exists
- `.env.example` exists and covers `containerEnv` keys
- devcontainer `service` exists in compose services
- forwarded ports exist in compose published ports
- `package.json` includes a `dev` script when Dockerfile + package.json are present
- obvious secrets in text evidence are redacted by default

## Safety model

- Offline and local-first
- No telemetry
- No hidden writes outside explicit output files
- Redaction enabled by default for common token/key/password patterns

## Limitations

- The MVP uses heuristic parsing, not full Docker/devcontainer schema validation
- Port matching currently checks published host ports only
- Secret redaction is pattern-based and intentionally conservative

## Fixture smoke

```bash
npm run smoke
```

This runs a real CLI scan against `examples/basic` and asserts deterministic Markdown and JSON output.

## Verify

Run local verification before opening a PR or publishing:

```bash
npm test
npm run release:check
```

`release:check` runs type-checking, tests, smoke verification, and a dry-run `npm pack` to ensure everything ships cleanly.

## Release notes

The 0.1.0 release candidate ships the CLI, the `examples/basic` fixture, support docs, and package smoke verification. See [CHANGELOG.md](CHANGELOG.md) for the current release notes and publish readiness notes.

## Development

Run the same checks locally before opening a PR:

- `npm run check` - tsc --noEmit
- `npm run build` - tsc
- `npm test` - node --test dist/tests/**/*.test.js
- `npm run smoke` - bash tests/smoke.sh
- `npm run validate` - bash scripts/validate.sh
- `npm run package:smoke` - bash scripts/package-smoke.sh
- `npm run release:check` - npm run check && npm test && npm run smoke && npm run package:smoke
