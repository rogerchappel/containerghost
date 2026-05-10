#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"
npm run build >/dev/null
npm pack --pack-destination "$TMP_DIR" >/dev/null
PACKAGE_TGZ="$(find "$TMP_DIR" -maxdepth 1 -name 'containerghost-*.tgz' -print -quit)"

test -n "$PACKAGE_TGZ"
mkdir -p "$TMP_DIR/app"
cd "$TMP_DIR/app"
npm init -y >/dev/null
npm install "$PACKAGE_TGZ" >/dev/null

npx containerghost --help >/dev/null
npx containerghost --version | grep -q '^0\.1\.0$'
