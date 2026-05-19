#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

bash "$ROOT_DIR/scripts/ensure-pnpm.sh"

DID_FILE="$ROOT_DIR/src/backend/dist/backend.did"
OUT_DIR="$ROOT_DIR/src/frontend/src"

if [ ! -f "$DID_FILE" ]; then
  echo "ERROR: missing DID file at $DID_FILE" >&2
  echo "Run backend build first (mops build) before generating frontend bindings." >&2
  exit 1
fi

if command -v caffeine-bindgen >/dev/null 2>&1; then
  exec caffeine-bindgen \
    --did-file "$DID_FILE" \
    --out-dir "$OUT_DIR" \
    --actor-interface-file \
    --force
fi

if pnpm exec caffeine-bindgen --version >/dev/null 2>&1; then
  exec pnpm exec caffeine-bindgen \
    --did-file "$DID_FILE" \
    --out-dir "$OUT_DIR" \
    --actor-interface-file \
    --force
fi

echo "ERROR: caffeine-bindgen is not available." >&2
echo "Install/provide caffeine-bindgen in the build environment (it is not auto-installable from this repo)." >&2
exit 127
