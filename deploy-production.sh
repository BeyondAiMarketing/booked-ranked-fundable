#!/bin/bash
set -e
# Usage: ./deploy-production.sh
# Deploys backend + frontend to mainnet (production) and writes a correct env.json
# with the real backend canister ID and production IC host. Verifies the deployed
# dist/env.json, compiled bundle, backend bindings, and live canister afterwards.
#
# Verification areas (v224 deploy pipeline fix):
#   1. Pre-Build Config Scan       — env.json sentinels + empty required keys + canister ID
#   2. Compiled Bundle Verification — dist/env.json, dist/assets/index-*.js, dist/index.html
#   3. Backend Bindings Verification — backend.did + frontend backend.ts/backend.d.ts
#   4. Post-Deploy Live Smoke Test  — credentialsHealthCheck query on live canister
#   5. Failure Reporting            — structured VERIFICATION FAILED / PASSED blocks, non-zero exit
# All verification runs automatically; deploy.sh (local replica) is unchanged.

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="${PROJECT_ROOT}/src/frontend"
BACKEND_DIR="${PROJECT_ROOT}/src/backend"
ENV_FILE="${FRONTEND_DIR}/env.json"
DIST_ENV="${FRONTEND_DIR}/dist/env.json"
DIST_ASSETS_DIR="${FRONTEND_DIR}/dist/assets"
DIST_INDEX_HTML="${FRONTEND_DIR}/dist/index.html"
BACKEND_DID="${BACKEND_DIR}/dist/backend.did"
FRONTEND_BACKEND_TS="${FRONTEND_DIR}/src/backend.ts"
FRONTEND_BACKEND_DTS="${FRONTEND_DIR}/src/backend.d.ts"

# The real production backend canister ID — used to validate env.json before build.
REAL_CANISTER_ID="wgze3-6qaaa-aaaaa-qgxha-cai"

# Required env.json keys that must not be empty after the deploy writes env.json.
REQUIRED_ENV_KEYS=("backend_host" "backend_canister_id" "project_id" "ii_derivation_origin")

# Method signatures that must appear in backend.did and regenerated frontend bindings.
EXPECTED_METHODS=(
  "leadEngine_importLeads"
  "leadEngine_enrichLead"
  "leadEngine_enrichBatch"
  "leadEngine_getDedupeGroups"
  "leadEngine_resolveDuplicate"
  "leadEngine_updateLeadStatus"
  "testNemotronPrompt"
  "activateTrial"
  "activateTrialForDemo"
  "credentialsHealthCheck"
)

# Niche content expected / forbidden in the frontend bundle.
NICHE_CONTENT_EXPECTED="Real Estate"
APP_TITLE="Booked Ranked Fundable"

# Smoke test configuration.
SMOKE_TEST_ENDPOINT="credentialsHealthCheck"
SMOKE_TEST_MAX_RETRIES=3
SMOKE_TEST_BACKOFF_SECONDS=5

# Track which verification checks ran successfully for the final summary.
VERIFICATION_CHECKS_RUN=()

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Print a structured VERIFICATION FAILED block and exit non-zero.
# Args: file_path, key_or_content, expected, actual
verify_fail() {
    local file_path="$1"
    local key_or_content="$2"
    local expected="$3"
    local actual="$4"
    echo ""
    echo "=========================================================="
    echo "VERIFICATION FAILED"
    echo "----------------------------------------------------------"
    echo "  file:   ${file_path}"
    echo "  check:  ${key_or_content}"
    echo "  expect: ${expected}"
    echo "  actual: ${actual}"
    echo "=========================================================="
    exit 1
}

# Print a structured VERIFICATION PASSED summary listing each check that ran.
verify_pass_summary() {
    echo ""
    echo "=========================================================="
    echo "VERIFICATION PASSED"
    echo "----------------------------------------------------------"
    local check
    for check in "${VERIFICATION_CHECKS_RUN[@]}"; do
        echo "  - ${check}"
    done
    echo "=========================================================="
}

# Extract a JSON string value for a top-level key from a flat env.json.
# Uses grep/sed only — no jq dependency. Returns empty string on missing key.
env_json_value() {
    local file="$1"
    local key="$2"
    # Matches:  "key": "value"   or   "key" : "value"
    grep -oE "\"${key}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" "${file}" 2>/dev/null \
        | sed -E "s/.*:[[:space:]]*\"([^\"]*)\".*/\1/" \
        | head -n1
}

# ---------------------------------------------------------------------------
# Sensible defaults — override via environment if needed.
# ---------------------------------------------------------------------------
PROJECT_NAME="$(basename "${PROJECT_ROOT}")"
: "${PROJECT_ID:=${PROJECT_NAME}}"
: "${II_DERIVATION_ORIGIN:=}" # resolved after BACKEND_CANISTER_ID is known

echo "==> Production deploy starting"
echo "    PROJECT_ROOT=${PROJECT_ROOT}"
echo "    PROJECT_ID=${PROJECT_ID}"

# ---------------------------------------------------------------------------
# Step 1: Pre-Build Config Scan
# Scan src/frontend/env.json (if present) for sentinels, empty required keys,
# and confirm backend_canister_id equals the real canister ID. This runs BEFORE
# any build or deploy command. dist/env.json is scanned again after the build.
# ---------------------------------------------------------------------------
echo "==> [1/5] Pre-Build Config Scan"

pre_build_scan_env() {
    local file="$1"
    local label="$2"

    if [ ! -f "${file}" ]; then
        # Missing pre-build env.json is acceptable — the deploy writes it below.
        # dist/env.json missing is caught later by the Compiled Bundle step.
        echo "    ${label}: ${file} (not present — will be (re)written by deploy)"
        return 0
    fi
    echo "    ${label}: ${file}"

    # Sentinel scan: undefined / BUILD_MUST_REGENERATE_THIS_FILE / localhost
    local sentinel_match
    sentinel_match="$(grep -nE 'undefined|BUILD_MUST_REGENERATE_THIS_FILE|localhost' "${file}" 2>/dev/null || true)"
    if [ -n "${sentinel_match}" ]; then
        verify_fail "${file}" "sentinel value present" \
            "no sentinel (undefined|BUILD_MUST_REGENERATE_THIS_FILE|localhost)" \
            "matched line: ${sentinel_match}"
    fi

    # Empty-string placeholder scan for required keys.
    # backend_host and backend_canister_id must be non-empty pre-build — their
    # values come from the resolved canister and must be correct before build.
    # project_id and ii_derivation_origin are populated by this script (from
    # PROJECT_ID and the resolved canister ID) at the env.json write step below,
    # so an empty value pre-build is acceptable and is NOT a sentinel.
    local key
    for key in "backend_host" "backend_canister_id"; do
        local val
        val="$(env_json_value "${file}" "${key}")"
        # If the key is present but empty, fail. Missing key is acceptable pre-build
        # (the deploy writes it), but an explicit "" placeholder is a sentinel.
        if grep -qE "\"${key}\"[[:space:]]*:[[:space:]]*\"\"" "${file}" 2>/dev/null; then
            verify_fail "${file}" "required key '${key}' is empty string" \
                "non-empty value for ${key}" \
                "actual: \"\""
        fi
    done

    # Canister ID check: if backend_canister_id is present, it must equal the real ID.
    local canister_val
    canister_val="$(env_json_value "${file}" "backend_canister_id")"
    if [ -n "${canister_val}" ] && [ "${canister_val}" != "${REAL_CANISTER_ID}" ]; then
        verify_fail "${file}" "backend_canister_id mismatch" \
            "${REAL_CANISTER_ID}" \
            "${canister_val}"
    fi
}

pre_build_scan_env "${ENV_FILE}" "src/frontend/env.json"
pre_build_scan_env "${DIST_ENV}" "src/frontend/dist/env.json"
VERIFICATION_CHECKS_RUN+=("Pre-Build Config Scan: env.json sentinels + empty keys + canister ID")

# ---------------------------------------------------------------------------
# Legacy pre-flight: remove stale-committed env.json (preserved from v224)
# ---------------------------------------------------------------------------
if [ -f "${ENV_FILE}" ]; then
    if grep -qE 'undefined|BUILD_MUST_REGENERATE_THIS_FILE|localhost' "${ENV_FILE}"; then
        echo "!! Removing stale env.json (contains undefined/sentinel/localhost)"
        rm -f "${ENV_FILE}"
    fi
fi

# ---------------------------------------------------------------------------
# Resolve backend canister ID (create if needed) on mainnet
# ---------------------------------------------------------------------------
echo "==> Ensuring backend canister exists on mainnet"
if ! icp canister settings show --id-only backend 2>/dev/null; then
    echo "    Backend canister not found — creating"
    icp canister create backend
fi

export BACKEND_CANISTER_ID="$(icp canister settings show --id-only backend)"
if [ -z "${BACKEND_CANISTER_ID}" ]; then
    echo "!! Failed to resolve BACKEND_CANISTER_ID"
    exit 1
fi
echo "    BACKEND_CANISTER_ID=${BACKEND_CANISTER_ID}"

# Confirm the resolved canister ID matches the real production canister ID.
if [ "${BACKEND_CANISTER_ID}" != "${REAL_CANISTER_ID}" ]; then
    verify_fail "(resolved canister ID)" "resolved backend canister ID mismatch" \
        "${REAL_CANISTER_ID}" \
        "${BACKEND_CANISTER_ID}"
fi

# Resolve II_DERIVATION_ORIGIN default now that canister ID is known.
if [ -z "${II_DERIVATION_ORIGIN}" ]; then
    export II_DERIVATION_ORIGIN="https://${BACKEND_CANISTER_ID}.ic0.app"
fi
echo "    II_DERIVATION_ORIGIN=${II_DERIVATION_ORIGIN}"

# ---------------------------------------------------------------------------
# Write a correct env.json BEFORE the frontend build consumes it
# ---------------------------------------------------------------------------
echo "==> Writing production env.json"
cat > "${ENV_FILE}" <<EOF
{
  "backend_host": "https://${BACKEND_CANISTER_ID}.ic0.app",
  "backend_canister_id": "${BACKEND_CANISTER_ID}",
  "project_id": "${PROJECT_ID}",
  "ii_derivation_origin": "${II_DERIVATION_ORIGIN}"
}
EOF
echo "    wrote ${ENV_FILE}"

# ---------------------------------------------------------------------------
# Build backend, type-check, and regenerate frontend bindings
# ---------------------------------------------------------------------------
echo "==> Building backend (mops build)"
mops build

echo "==> Type-checking backend (mops check --fix)"
mops check --fix

echo "==> Regenerating frontend bindings (pnpm bindgen)"
pnpm bindgen

# Build the frontend bundle (vite build + copy:env) so dist/ is fresh.
echo "==> Building frontend bundle (pnpm --filter @caffeine/template-frontend build)"
pnpm --filter @caffeine/template-frontend build

# ---------------------------------------------------------------------------
# Step 2: Compiled Bundle Verification
# Verify dist/env.json, dist/assets/index-*.js, and dist/index.html contain the
# expected real values and no sentinels or forbidden niche content.
# ---------------------------------------------------------------------------
echo "==> [2/5] Compiled Bundle Verification"

# 2a. dist/env.json — canister ID present, no sentinels.
if [ ! -f "${DIST_ENV}" ]; then
    verify_fail "${DIST_ENV}" "dist/env.json exists after build" \
        "file present" \
        "file not found — frontend build did not copy env.json"
fi

if grep -qE 'undefined|BUILD_MUST_REGENERATE_THIS_FILE|localhost' "${DIST_ENV}"; then
    verify_fail "${DIST_ENV}" "no sentinel values" \
        "no sentinel (undefined|BUILD_MUST_REGENERATE_THIS_FILE|localhost)" \
        "$(cat "${DIST_ENV}")"
fi

if ! grep -q "${BACKEND_CANISTER_ID}" "${DIST_ENV}"; then
    verify_fail "${DIST_ENV}" "contains deployed BACKEND_CANISTER_ID" \
        "${BACKEND_CANISTER_ID}" \
        "$(cat "${DIST_ENV}")"
fi

# 2a-strict. dist/env.json — every required key must be non-empty. By this point
# the script has written all values (backend_host, backend_canister_id from the
# resolved canister; project_id from PROJECT_ID; ii_derivation_origin from the
# resolved canister). An empty value here means the script failed to populate it.
for key in "${REQUIRED_ENV_KEYS[@]}"; do
    if grep -qE "\"${key}\"[[:space:]]*:[[:space:]]*\"\"" "${DIST_ENV}" 2>/dev/null; then
        verify_fail "${DIST_ENV}" "required key '${key}' is empty string in dist/env.json" \
            "non-empty value for ${key}" \
            "actual: \"\""
    fi
done
VERIFICATION_CHECKS_RUN+=("Compiled Bundle: dist/env.json canister ID + no sentinels + no empty required keys")

# 2b. dist/assets/index-*.js — canister ID reached the bundle.
shopt -s nullglob
INDEX_JS_FILES=( "${DIST_ASSETS_DIR}"/index-*.js )
shopt -u nullglob
if [ "${#INDEX_JS_FILES[@]}" -eq 0 ]; then
    verify_fail "${DIST_ASSETS_DIR}/index-*.js" "frontend bundle JS exists" \
        "at least one dist/assets/index-*.js file" \
        "no index-*.js files found"
fi

INDEX_JS="${INDEX_JS_FILES[0]}"
if ! grep -q "${BACKEND_CANISTER_ID}" "${INDEX_JS}"; then
    verify_fail "${INDEX_JS}" "bundle contains real canister ID" \
        "${BACKEND_CANISTER_ID} present in bundle" \
        "canister ID string not found in bundle"
fi
VERIFICATION_CHECKS_RUN+=("Compiled Bundle: dist/assets/index-*.js contains canister ID")

# 2c. dist/assets/index-*.js — Real Estate niche content present, no plumbing fallback.
if ! grep -q "${NICHE_CONTENT_EXPECTED}" "${INDEX_JS}"; then
    verify_fail "${INDEX_JS}" "niche content present" \
        "'${NICHE_CONTENT_EXPECTED}' present in bundle" \
        "'${NICHE_CONTENT_EXPECTED}' not found in bundle"
fi

# Forbidden plumbing fallback text in a Real Estate context. The known fallback
# string from prior bugs is "plumbing"; case-insensitive check.
if grep -qi 'plumbing' "${INDEX_JS}"; then
    verify_fail "${INDEX_JS}" "no plumbing fallback text in Real Estate context" \
        "no 'plumbing' string in bundle" \
        "'plumbing' string found in bundle (Real Estate niche fallback regression)"
fi
VERIFICATION_CHECKS_RUN+=("Compiled Bundle: dist/assets/index-*.js niche content (Real Estate, no plumbing fallback)")

# 2d. dist/index.html — app title present.
if [ ! -f "${DIST_INDEX_HTML}" ]; then
    verify_fail "${DIST_INDEX_HTML}" "dist/index.html exists" \
        "file present" \
        "file not found"
fi
if ! grep -q "${APP_TITLE}" "${DIST_INDEX_HTML}"; then
    verify_fail "${DIST_INDEX_HTML}" "app title present" \
        "'${APP_TITLE}' in <title>" \
        "'${APP_TITLE}' not found in dist/index.html"
fi
VERIFICATION_CHECKS_RUN+=("Compiled Bundle: dist/index.html title '${APP_TITLE}'")

# ---------------------------------------------------------------------------
# Step 3: Backend Bindings Verification
# Confirm backend.did and regenerated frontend bindings contain every expected
# method signature. Stale bindings would ship if bindgen was skipped.
# ---------------------------------------------------------------------------
echo "==> [3/5] Backend Bindings Verification"

if [ ! -f "${BACKEND_DID}" ]; then
    verify_fail "${BACKEND_DID}" "backend.did exists after mops build" \
        "file present" \
        "file not found — mops build did not produce backend.did"
fi

verify_methods_in_file() {
    local file="$1"
    local label="$2"
    if [ ! -f "${file}" ]; then
        verify_fail "${file}" "${label} exists" \
            "file present" \
            "file not found"
    fi
    local method
    for method in "${EXPECTED_METHODS[@]}"; do
        if ! grep -q "${method}" "${file}"; then
            verify_fail "${file}" "method signature present" \
                "${method} present in ${label}" \
                "${method} NOT found in ${label}"
        fi
    done
}

verify_methods_in_file "${BACKEND_DID}" "backend.did"
VERIFICATION_CHECKS_RUN+=("Backend Bindings: backend.did contains all expected method signatures")

verify_methods_in_file "${FRONTEND_BACKEND_TS}" "src/frontend/src/backend.ts"
VERIFICATION_CHECKS_RUN+=("Backend Bindings: src/frontend/src/backend.ts contains all expected method signatures")

verify_methods_in_file "${FRONTEND_BACKEND_DTS}" "src/frontend/src/backend.d.ts"
VERIFICATION_CHECKS_RUN+=("Backend Bindings: src/frontend/src/backend.d.ts contains all expected method signatures")

# ---------------------------------------------------------------------------
# Deploy backend + frontend to mainnet (no --environment local)
# ---------------------------------------------------------------------------
echo "==> Deploying backend + frontend to mainnet"
icp deploy frontend backend

# ---------------------------------------------------------------------------
# Step 4: Post-Deploy Live Smoke Test
# Call credentialsHealthCheck on the live backend canister. Retry up to 3 times
# with a short backoff to allow for canister startup latency. Fail on any
# non-true response, timeout, or IC0508 'canister stopped' error.
# ---------------------------------------------------------------------------
echo "==> [4/5] Post-Deploy Live Smoke Test (credentialsHealthCheck)"

smoke_test_run() {
    # Returns 0 if the response is Bool true, 1 otherwise. Prints raw output.
    local attempt="$1"
    echo "    attempt ${attempt}/${SMOKE_TEST_MAX_RETRIES}: calling ${SMOKE_TEST_ENDPOINT} on ${BACKEND_CANISTER_ID}"
    local raw
    # icp canister call returns the candid value, e.g. "(true)" or "(false)".
    # Capture both stdout and stderr; stderr carries IC0508 / canister stopped errors.
    if raw="$(icp canister call backend "${SMOKE_TEST_ENDPOINT}" --candid "${BACKEND_DID}" 2>&1)"; then
        echo "    raw response: ${raw}"
        # Accept "(true)" or "true" as a passing response.
        if echo "${raw}" | grep -qiE '\(?true\)?'; then
            return 0
        fi
        echo "    !! response was not Bool true"
        return 1
    else
        echo "    !! call failed: ${raw}"
        # IC0508 'canister stopped' surfaces here — fail fast, no point retrying a stopped canister.
        if echo "${raw}" | grep -qiE 'IC0508|canister stopped|stopped'; then
            verify_fail "(live canister ${BACKEND_CANISTER_ID})" "canister is running" \
                "credentialsHealthCheck returns Bool true" \
                "IC0508 canister stopped: ${raw}"
        fi
        return 1
    fi
}

smoke_test_ok=0
smoke_test_attempt=0
while [ "${smoke_test_attempt}" -lt "${SMOKE_TEST_MAX_RETRIES}" ]; do
    smoke_test_attempt=$((smoke_test_attempt + 1))
    if smoke_test_run "${smoke_test_attempt}"; then
        smoke_test_ok=1
        break
    fi
    if [ "${smoke_test_attempt}" -lt "${SMOKE_TEST_MAX_RETRIES}" ]; then
        echo "    backing off ${SMOKE_TEST_BACKOFF_SECONDS}s before retry"
        sleep "${SMOKE_TEST_BACKOFF_SECONDS}"
    fi
done

if [ "${smoke_test_ok}" -ne 1 ]; then
    verify_fail "(live canister ${BACKEND_CANISTER_ID})" "credentialsHealthCheck returns Bool true" \
        "Bool true after up to ${SMOKE_TEST_MAX_RETRIES} attempts" \
        "all ${SMOKE_TEST_MAX_RETRIES} attempts failed (non-true response, timeout, or error)"
fi
VERIFICATION_CHECKS_RUN+=("Post-Deploy Live Smoke Test: credentialsHealthCheck returned Bool true")

# ---------------------------------------------------------------------------
# Step 5: Failure Reporting — final structured summary
# ---------------------------------------------------------------------------
echo "==> [5/5] Verification Summary"
verify_pass_summary

echo "==> Production deploy complete"
echo "    Backend:  ${BACKEND_CANISTER_ID}"
echo "    Frontend: https://${BACKEND_CANISTER_ID}.ic0.app"
echo "---- dist/env.json ----"
cat "${DIST_ENV}"
echo "-----------------------"
