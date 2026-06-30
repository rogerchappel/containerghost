#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.tmp/demo-basic-drift-scan"

mkdir -p "$OUT"

npm run build

echo "== scan example dev environment =="
node "$ROOT/dist/src/index.js" scan "$ROOT/examples/basic" --out "$OUT/containerghost.md" --json "$OUT/containerghost.json"
sed -n '1,40p' "$OUT/containerghost.md"

echo
echo "== run missing-env/unknown-service gate =="
set +e
node "$ROOT/dist/src/index.js" check "$ROOT/examples/basic" --fail-on missing-env,unknown-service --out "$OUT/check.md" --json "$OUT/check.json"
status=$?
set -e
echo "$status" > "$OUT/check.exit"
echo "exit code: $status"

if [[ "$status" -ne 1 ]]; then
  echo "expected check gate to exit 1, got $status" >&2
  exit 1
fi

grep -q 'ContainerGhost report' "$OUT/containerghost.md"
grep -q 'missing-env' "$OUT/containerghost.md"
grep -q '"issueCount"' "$OUT/containerghost.json"
grep -q 'missing-env' "$OUT/check.md"

echo
echo "Drift scan artifacts written to $OUT"
