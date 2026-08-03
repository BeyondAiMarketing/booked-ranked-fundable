# Booked Ranked Fundable

Deployment quick guide for this repository.

## Deployment paths

- Local ICP replica: `/home/runner/work/booked-ranked-fundable/booked-ranked-fundable/deploy.sh`
- Production ICP mainnet: `/home/runner/work/booked-ranked-fundable/booked-ranked-fundable/deploy-production.sh`
- Netlify workflow: `/home/runner/work/booked-ranked-fundable/booked-ranked-fundable/.github/workflows/deploy-netlify.yml`

## Prerequisites

From repo root (`/home/runner/work/booked-ranked-fundable/booked-ranked-fundable`):

- Install backend deps: `mops install`
- Install frontend/workspace deps: `pnpm install --prefer-offline`
- Ensure tooling is available in your environment:
  - `icp` CLI (for canister create/deploy)
  - `mops`
  - `pnpm`

## Local deployment (ICP replica)

Run:

```bash
./deploy.sh
```

What it does:

1. Starts local ICP network
2. Creates local `frontend` and `backend` canisters
3. Builds backend and type-checks backend
4. Regenerates frontend bindings (`pnpm bindgen`)
5. Deploys `frontend` and `backend` to local replica

## Production deployment (ICP mainnet)

Run:

```bash
./deploy-production.sh
```

What it does:

1. Validates env/config sentinels and required values
2. Builds backend + type-checks backend
3. Regenerates frontend bindings
4. Builds frontend bundle
5. Verifies generated artifacts and expected method signatures
6. Deploys `frontend` and `backend` to mainnet
7. Runs a live `credentialsHealthCheck` smoke test

## Netlify deployment

The workflow in `.github/workflows/deploy-netlify.yml` deploys on:

- Push to `main`
- Manual trigger (`workflow_dispatch`)

Required GitHub secret:

- `NETLIFY_AUTH_TOKEN`

The workflow uses:

- `NETLIFY_SITE_ID` from workflow env
- Build config from `netlify.toml` (`base = "src/frontend"`, publish `dist`)

## Troubleshooting

- `NETLIFY_AUTH_TOKEN is not configured`:
  - Add `NETLIFY_AUTH_TOKEN` under repository secrets.
- `icp` command not found:
  - Install/enable ICP CLI in your shell environment.
- Frontend cannot call backend after deploy:
  - Re-run `pnpm bindgen`, then re-run the relevant deploy script.
- Production deploy fails at verification:
  - Read the script’s `VERIFICATION FAILED` block to identify exact file/check mismatch.
