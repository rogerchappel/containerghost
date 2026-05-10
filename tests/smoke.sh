#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null
node dist/src/index.js scan examples/basic --out /tmp/containerghost-smoke.md --json /tmp/containerghost-smoke.json >/tmp/containerghost-stdout.txt

grep -q "ContainerGhost report" /tmp/containerghost-smoke.md
grep -q '"issueCount"' /tmp/containerghost-smoke.json
grep -q "missing-env" /tmp/containerghost-smoke.md
