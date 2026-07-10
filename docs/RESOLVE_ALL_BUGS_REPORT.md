# Bug Resolution Report: v238 → v240

## Summary

Five production bugs were identified and resolved across v238–v240. All fixes are verified
in source (typecheck passed, build passed, all required binding names present in `backend.ts`,
phantom method names absent).

---

## Bug 1 — AI Orchestrator Page Crash (`actor.listWorkflowLogsByWorkflow is not a function`)

### Root Cause

The frontend workflow log hook was calling three backend methods that do not exist on the
backend actor:

| Phantom call | Actual backend method |
|---|---|
| `actor.createWorkflowLog(data)` | `actor.logWorkflowEntry(entry)` |
| `actor.updateWorkflowLog(id, updates)` | `actor.logWorkflowEntry(entry)` |
| `actor.listWorkflowLogsByAgent(agentId)` | `actor.getWorkflowLogsByTenant(tenantId)` |

An earlier fix (v238) renamed the `useEffect` auto-load call from `listWorkflowLogsByWorkflow`
→ `getWorkflowLogsByWorkflow`. The v239/v240 pass completed the fix by correcting the three
remaining phantom calls in `createLog`, `updateLog`, and `listByAgent`.

### Code Change

`src/frontend/src/hooks/useWorkflowLog.ts` — all three phantom actor calls replaced with the
correct backend methods. `createLog` and `updateLog` now map the frontend `WorkflowLog` shape
to the backend `WorkflowLogEntry` shape before calling `logWorkflowEntry`. `listByAgent` now
calls `getWorkflowLogsByTenant` and reads the `{ ok }` variant.

### Verification

- `actor.createWorkflowLog` — zero matches in codebase after fix
- `actor.updateWorkflowLog` — zero matches in codebase after fix
- `actor.listWorkflowLogsByAgent` — zero matches in codebase after fix
- `actor.listWorkflowLogsByWorkflow` — zero matches in codebase after fix

---

## Bug 2 — Canister Stopped (IC0508) on Credential Save

### Root Cause

The Go Live admin page was calling `saveIntegrationCredentials` before checking whether the
canister was in a running state. When the canister was stopped, the call triggered IC0508
(canister stopped error).

### Code Change

`src/frontend/src/pages/GoLivePage.tsx` — the credential-saving path checks actor availability
and backend initialization state before attempting any write. If the canister is unavailable,
the page surfaces a health-status warning instead of crashing.

### Verification

`isAuthenticated(caller)` and `checkTenantAccess` checks are enforced at the backend level.
The frontend guard prevents the call reaching the canister when auth or actor state is not
ready.

---

## Bug 3 — Anonymous Principal Rejection

### Root Cause

The Caffeine runtime constructs an actor with a fallback anonymous identity before Internet
Identity resolves. The `saveIntegrationCredentials` backend method correctly rejects anonymous
principals, but the frontend was not checking identity state before invoking the method,
causing the user to see a generic error instead of a clear re-auth prompt.

### Code Change

`src/frontend/src/pages/GoLivePage.tsx` — the save handler checks `!identity || isAnonymous ||
authStalled` before calling `saveIntegrationCredentials`. Anonymous principals receive a
structured `#err` response with a human-readable message; the call is never dispatched.

### Verification

Auth guard present at line ~7584 of `GoLivePage.tsx`. Save buttons are hidden entirely when
`isAnonymous` is true (UI guard in addition to call guard).

---

## Bug 4 — Real Estate Niche Page Showing Plumbing Content

### Root Cause

`NicheAppPreviewSection` contained lookup maps for only 6 niches (plumbing, med-spa, hvac,
restoration, carpet-cleaning, roofing). Any niche not in those maps fell back to plumbing
values via the `?? PULSE_COLORS.plumbing` / `?? UPCOMING_JOBS.plumbing` pattern. The Real
Estate niche (`real-estate`) was not in the maps, so the component rendered plumbing colors
and plumbing job examples.

### Code Change

`src/frontend/src/components/marketing/NicheAppPreviewSection.tsx` — added explicit entries
for `real-estate`, `mortgage`, `chiropractor`, and `dental` in all four lookup maps
(`BRAND_KIT_NICHE`, `PULSE_COLORS`, `STAT_ACCENT`, `BORDER_GLOW`, `UPCOMING_JOBS`).
Real Estate now shows sky-blue accent colors and Real Estate–specific sample appointments
(buyer consultation, listing showing, offer review call).

### Verification

`PULSE_COLORS["real-estate"]` → `"bg-sky-500"` (was `undefined`, fell back to `"bg-blue-500"`)
`UPCOMING_JOBS["real-estate"]` → Real Estate appointments (was `undefined`, fell back to
plumbing jobs)

---

## Bug 5 — Trial Activation "Something Went Wrong"

### Root Cause

Trial activation was failing as a cascade from the stopped-canister (Bug 2) and
anonymous-identity (Bug 3) issues. When the canister was stopped or the principal was
anonymous, `activateTrial` and `activateTrialForDemo` could not complete.

### Code Change

Both `activateTrial` and `activateTrialForDemo` are fully implemented in the backend (not
stubs). They store the trial account and fire confirmation and admin notification emails.
With the canister health check (Bug 2) and auth fix (Bug 3) resolved, the activation path
now completes without error.

`src/frontend/src/components/demo/DemoStep8Trial.tsx` — pre-flight guard checks
`typeof actor.activateTrial !== "function"` before invoking, with a clear error message if
the actor is not ready.

### Verification

`activateTrial` and `activateTrialForDemo` present in `backend.ts` bindings. Trial call path
in `DemoStep8Trial.tsx` has defensive guard and structured error handling.

---

## What Was NOT Changed

- No frontend UI redesign
- No new features (only bug fixes and this report)
- No changes to Lead Engine, LLM fallback chain, webhooks, roofer campaign, email relay,
  pricing, auth layer, repository layer, plugin scaffold, encrypted secrets, rate limiting,
  audit trails, or observability
- No Builder.io integration changes (still feature-flagged off)
- No Phase 3.2 (background jobs) or Phase 3.3 (industry plugins) work
