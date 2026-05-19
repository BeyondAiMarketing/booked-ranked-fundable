#!/usr/bin/env bash
set -euo pipefail

if command -v mops >/dev/null 2>&1; then
  MOPS_BIN="mops"
elif command -v ic-mops >/dev/null 2>&1; then
  MOPS_BIN="ic-mops"
else
  echo "ERROR: neither 'mops' nor 'ic-mops' was found on PATH." >&2
  echo "Install ic-mops (npm i -g ic-mops) or ensure mops is installed." >&2
  exit 127
fi

run_install_with_retry() {
  local max_attempts=3
  local attempt=1
  local tmp_log
  tmp_log="$(mktemp)"

  while [ "$attempt" -le "$max_attempts" ]; do
    if "$MOPS_BIN" install "$@" 2> >(tee "$tmp_log" >&2); then
      rm -f "$tmp_log"
      return 0
    fi

    if grep -Eiq "Temporary failure in name resolution|Could not resolve host|dns|timed out|timeout" "$tmp_log"; then
      if [ "$attempt" -lt "$max_attempts" ]; then
        echo "WARN: transient DNS/network issue while resolving Motoko deps (attempt $attempt/$max_attempts). Retrying..." >&2
        sleep 3
      fi
    else
      echo "ERROR: mops install failed due to a non-network error." >&2
      rm -f "$tmp_log"
      return 1
    fi

    attempt=$((attempt + 1))
  done

  echo "ERROR: mops install failed after retries due to DNS/network issues." >&2
  echo "This is likely an external dependency resolution problem, not a local compile error." >&2
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

exec "$MOPS_BIN" "$@"
