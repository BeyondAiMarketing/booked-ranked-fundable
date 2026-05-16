# Code Improvement Plan

## 1) Split oversized frontend router into feature route modules
- `src/frontend/src/App.tsx` currently centralizes route imports and route declarations for many pages, making the file hard to maintain and increasing merge conflicts.
- Move route definitions into domain modules (e.g., `routes/marketing.tsx`, `routes/admin.tsx`, `routes/ops.tsx`) and compose a single route tree in `App.tsx`.
- Introduce route-level lazy loading consistently for heavier pages, not only selected pages.

## 2) Replace hard redirects in protected routes
- `ProtectedRoute` currently uses `window.location.replace`, which bypasses router navigation patterns and can complicate history/state handling.
- Use router-native redirects (`<Navigate />` or `router.navigate`) to preserve SPA behavior and make auth flow testable.

## 3) Avoid global prototype mutation for BigInt serialization
- `src/frontend/src/main.tsx` mutates `BigInt.prototype.toJSON` globally.
- Replace with localized serializers/deserializers where required (API boundary adapters) to reduce side effects and avoid conflicts with third-party code.

## 4) Break backend `main.mo` into bounded domains
- `src/backend/main.mo` is a large composition root with many imported mixins and many public types in one place.
- Keep `main.mo` focused on actor wiring, while extracting domain-specific type groups and helper logic into dedicated modules (`domain/leads`, `domain/reviews`, `domain/billing`, etc.).

## 5) Reduce stringly-typed statuses and roles
- Several records in `src/backend/main.mo` use `Text` for constrained values (`status`, `role`, `notificationType`, `planName`, etc.).
- Introduce Motoko variant types (`{ #active; #paused; ... }`) and converters to improve type safety and reduce runtime validation bugs.

## 6) Add quality gates to prevent architecture drift
- Standardize CI checks around existing verified commands in `AGENTS.md`:
  - Frontend: `pnpm typecheck`, `pnpm fix`, `pnpm build`
  - Backend: `mops check --fix`, `mops build`
  - Integration: `pnpm bindgen`
- Add lightweight checks for file size/complexity thresholds (e.g., fail if key files exceed agreed limits without waivers).

## 7) Introduce prioritized cleanup roadmap
- Prioritize high-impact, low-risk work first:
  1. Protected route redirect refactor.
  2. BigInt serializer isolation.
  3. Router decomposition.
  4. Backend type hardening.
  5. Backend modularization.

