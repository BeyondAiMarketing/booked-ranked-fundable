#!/usr/bin/env bash
set -euo pipefail

if command -v pnpm >/dev/null 2>&1; then
  exit 0
fi

if ! command -v corepack >/dev/null 2>&1; then
  echo "ERROR: pnpm is not available and corepack was not found." >&2
  echo "Install Node.js with Corepack support, then re-run the build." >&2
  exit 127
fi

echo "pnpm not found. Activating pnpm via Corepack..."
if ! corepack enable >/dev/null 2>&1; then
  echo "ERROR: failed to enable Corepack for pnpm bootstrap." >&2
  exit 1
fi

if ! corepack prepare pnpm@9 --activate >/dev/null 2>&1; then
  echo "ERROR: failed to activate pnpm@9 via Corepack." >&2
  echo "Check network access or activate pnpm manually." >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm is still unavailable after Corepack activation." >&2
  exit 127
fi
