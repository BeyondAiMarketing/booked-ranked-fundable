#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if command -v mops >/dev/null 2>&1; then
  MOPS_CMD=(mops)
elif command -v ic-mops >/dev/null 2>&1; then
  MOPS_CMD=(ic-mops)
else
  bash "$ROOT_DIR/scripts/ensure-pnpm.sh"
  MOPS_CMD=(pnpm dlx ic-mops)
fi

run_install_with_retry() {
  local max_attempts=3
  local attempt=1
  local tmp_log
  tmp_log="$(mktemp)"

  while [ "$attempt" -le "$max_attempts" ]; do
    if "${MOPS_CMD[@]}" install "$@" 2> >(tee "$tmp_log" >&2); then
      rm -f "$tmp_log"
      return 0
    fi

    if grep -Eiq "Temporary failure in name resolution|Could not resolve host|dns|timed out|timeout|TrustError|TransportError|fetch failed|Failed to fetch HTTP request|Query response did not contain any node signatures|ENOTFOUND|EAI_AGAIN" "$tmp_log"; then
      if [ "$attempt" -lt "$max_attempts" ]; then
        echo "WARN: transient external registry/network issue while resolving Motoko deps (attempt $attempt/$max_attempts). Retrying..." >&2
        sleep 3
      fi
    else
      echo "ERROR: mops install failed due to a non-network error." >&2
      rm -f "$tmp_log"
      return 1
    fi

    attempt=$((attempt + 1))
  done

  echo "ERROR: mops install failed after retries due to external registry/network trust/transport issues." >&2
  echo "This is likely an external dependency resolution problem, not a local compile error in this repo." >&2
  rm -f "$tmp_log"
  return 1
}

if [ "${1:-}" = "install-with-retry" ]; then
  shift
  run_install_with_retry "$@"
  exit $?
fi

if [ "$#" -eq 0 ]; then
  echo "Usage: scripts/mopsw.sh <mops-args...> | install-with-retry [args...]" >&2
  exit 2
fi

exec "${MOPS_CMD[@]}" "$@"
