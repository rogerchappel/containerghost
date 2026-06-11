# Contributing

Thanks for helping improve ContainerGhost.

## Local setup

```bash
npm install
npm run build
npm test
```

## Release-candidate checks

Run the full verification gate before opening a PR:

```bash
npm run release:check
```

This runs type-checking, tests, fixture smoke verification, and an installable package smoke.

## Pull requests

- Keep changes local-first and deterministic.
- Add or update fixture coverage for new drift checks.
- Document new CLI flags in `README.md` and `docs/ORCHESTRATION.md`.
- Do not add network calls, telemetry, or writes outside explicitly requested output files.
