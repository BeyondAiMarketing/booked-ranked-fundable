## Booked Ranked Fundable

This repository contains:
- **Frontend**: React + Vite app in `/src/frontend`
- **Backend**: Motoko canister in `/src/backend`

## Local development commands

### Frontend (`/src/frontend`)
- Install: `pnpm install --prefer-offline`
- Typecheck: `pnpm typecheck`
- Lint/fix: `pnpm fix`
- Build: `pnpm build`

### Backend (`/src/backend`)
- Install: `mops install`
- Typecheck: `mops check --fix`
- Build: `mops build`

### Backend/frontend bindings (repo root)
- Generate TypeScript bindings from DID: `pnpm bindgen`

## CI quality gates

GitHub Actions validates:
- Frontend install + typecheck + build
- Backend install + typecheck + build
- Binding drift checks (`pnpm bindgen` must produce no uncommitted changes)

## Generated artifacts

Frontend and backend dist outputs are treated as generated artifacts in repository metadata (`.gitattributes`) to reduce review noise.
