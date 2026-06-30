# Video Brief: Devcontainer Drift Scan

## Audience

Developers and agent-workflow maintainers who need a fast local check before spending time in a broken dev environment.

## Core Claim

ContainerGhost scans devcontainer, compose, Dockerfile, package script, and `.env.example` evidence locally and reports drift as Markdown and JSON.

## 60-Second Flow

1. Open `examples/basic/.devcontainer/devcontainer.json`.
2. Open `examples/basic/docker-compose.yml` and `.env.example`.
3. Run `bash demo/run-basic-drift-scan.sh`.
4. Show `.tmp/demo-basic-drift-scan/containerghost.md`.
5. Show `.tmp/demo-basic-drift-scan/check.exit` with exit code `1`.
6. Close on the safety model: local file reads, explicit output paths, no container startup.

## Hooks

- "Before an agent burns time in a broken devcontainer, ask for a drift report."
- "ContainerGhost turns compose, devcontainer, Dockerfile, and env-example drift into local evidence."
- "The demo fails the gate on purpose, then leaves Markdown and JSON artifacts for review."

## Guardrails

- Do not claim ContainerGhost validates full Docker or devcontainer schemas.
- Do not claim it starts containers or proves the environment builds.
- Keep the example tied to `examples/basic` unless adding another reviewed fixture.
