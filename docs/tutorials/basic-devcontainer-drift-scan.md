# Scan A Basic Devcontainer For Drift

This walkthrough uses `examples/basic` to show how ContainerGhost turns devcontainer and compose drift into Markdown and JSON artifacts.

## Run The Demo

```bash
bash demo/run-basic-drift-scan.sh
```

The script builds the CLI, scans `examples/basic`, and writes artifacts under `.tmp/demo-basic-drift-scan/`.

## Outputs

- `containerghost.md`: human-readable report with issue and evidence sections.
- `containerghost.json`: structured report for CI upload or agent handoff.
- `check.md` and `check.json`: output from a gate run using `--fail-on missing-env,unknown-service`.
- `check.exit`: expected exit code `1` for the fixture's drift gates.

## What To Point Out

`examples/basic` includes a devcontainer, compose file, Dockerfile, package scripts, and `.env.example`. The fixture is intentionally small so the report can show the drift gates without requiring Docker to run.

## Boundaries

- ContainerGhost reads local configuration files; it does not start containers.
- The current parser is heuristic and focused on early drift signals.
- Secret redaction is pattern-based and should be reviewed before sharing real project output.
