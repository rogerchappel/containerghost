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
- **Planned, not implemented:** support JSON Schema validation for devcontainer files. The intended scope is local validation of each discovered `devcontainer.json` against the schema version explicitly selected by the project (with a documented default pinned to a specific Dev Container specification/schema release), rather than silently tracking a moving latest schema. Validation should report the file path and schema diagnostics (including the failing location/message) in scan output; when enabled as a check gate, invalid documents should produce a non-zero exit while unrelated scan findings remain available. It should use an explicitly available schema source/cache and make offline or unavailable-schema behavior clear; it must not imply current validation exists.
- Emit SARIF or JUnit for CI integrations.
- Add auto-fix suggestions without mutating by default.
