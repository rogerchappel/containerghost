# ContainerGhost Tasks

## Completed MVP slices

1. Scaffold TypeScript CLI repo and rename package metadata for ContainerGhost.
2. Implement deterministic scanner for devcontainer/compose/Dockerfile/.env.example/package script drift.
3. Add Markdown and JSON renderers with default redaction.
4. Add `scan` and `check` CLI commands with `--fail-on`, `--out`, and `--json`.
5. Add checked-in fixture under `examples/basic`.
6. Add unit tests, smoke test, and validation script.
7. Polish README and planning docs for public repo readiness.

## Follow-up ideas

- Add compose volume and env-file drift checks.
- Support JSON Schema validation for devcontainer files.
- Emit SARIF or JUnit for CI integrations.
- Add auto-fix suggestions without mutating by default.
