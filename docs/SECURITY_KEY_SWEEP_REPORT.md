# Security Key Sweep Report

**Date:** July 2026
**Scope:** Backend credential handling (`src/backend/`) and frontend key entry (`src/frontend/`)
**Status:** Complete — backend and frontend builds verified

---

## 1. Audit Summary

A full source sweep was performed for hardcoded API key literals across the
backend (`src/backend/`) and frontend (`src/frontend/`) trees.

**Result: No hardcoded API key literals were found in source.**

The following literal prefixes were searched for and returned zero matches in
application source:

| Prefix        | Provider / format                  | Matches in source |
| ------------- | ---------------------------------- | ----------------- |
| `sk-`         | OpenAI                             | 0                 |
| `sk-ant-`     | Anthropic / Claude                 | 0                 |
| `sk-or-`      | OpenRouter                         | 0                 |
| `nvapi-`      | NVIDIA NIM / Nemotron              | 0                 |
| `Bearer `     | Generic bearer tokens             | 0                 |
| `bpk-`        | Builder.io public key              | 0                 |
| `btk-`        | Builder.io private token           | 0                 |

All provider keys are entered at runtime by the operator through the Go Live
admin page (`src/frontend/.../GoLivePage.tsx`) and stored encrypted in the
`integrationCreds` stable map keyed by tenant id (`"platform"` for
platform-level credentials).

---

## 2. The One Literal Found

A single hardcoded secret was identified during the sweep:

**`credSalt` at `src/backend/main.mo:1330`**

- A 32-byte fixed salt used as the symmetric key for all credential
  obfuscation at rest.
- Applied via `ICLib.obfuscate(value, credSalt)` /
  `ICLib.deobfuscate(value, credSalt)` — a bare XOR-with-hardcoded-salt
  scheme.
- **This was the real security risk:** anyone with source access could
  reproduce the salt and decrypt every stored credential in the
  `integrationCreds` stable map. XOR-with-hardcoded-salt is symmetric and
  keyless to an attacker who has the repo.

This is the only literal that constituted a credential-at-rest risk.

---

## 3. What Was Done

The existing `SecretManager` (`src/backend/lib/secretManager.mo`) — a single
managed encryption KEY used by `encrypt`/`decrypt`, not a named secret store —
was wired into every credential save and load path.

### New helpers in `lib/integrationCredentials.mo`

Three new functions were added:

- `encryptAllWithSecret` — encrypts a credential map under SecretManager,
  producing `v1:<secretId>:<hex>` ciphertext.
- `decryptAllWithSecret` — decrypts a credential map; falls back to legacy
  XOR-with-`credSalt` for untagged / `HEX:` ciphertext so already-stored
  credentials remain readable during migration.
- `migrateCredentialsWithSecret` — idempotent one-time migration of stored
  credentials from legacy XOR format to `v1:<secretId>:<hex>` format on first
  read after deploy.

### Call-site swaps

All ~74 `ICLib.obfuscate` / `ICLib.deobfuscate` / `encryptAll` / `decryptAll`
call sites across `main.mo` and 16 mixin files were swapped to the
`*WithSecret` variants that delegate to `SecretManager.encrypt` / `decrypt`.

The `*WithSecret` helpers:

- Produce `v1:<secretId>:<hex>` ciphertext for new writes.
- Fall back to legacy XOR-with-`credSalt` decryption for untagged / `HEX:`
  ciphertext, so existing stored credentials remain decryptable during
  migration.

### Entry-point guards

- `ensureSecretInit()` calls were added before every credential save/load
  entry point so the SecretManager secret is initialized lazily before any
  credential is touched.
- A `migrateCredentialsOnRead` helper was added for idempotent one-time
  migration of stored credentials from legacy XOR to `v1:` format on first
  read after deploy.

---

## 4. Files Modified

| File                                              | Change                                                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `lib/integrationCredentials.mo`                   | 3 new helpers: `encryptAllWithSecret`, `decryptAllWithSecret`, `migrateCredentialsWithSecret`   |
| `main.mo`                                         | 15 call sites + 16 include statements + `ensureSecretInit` + `migrateCredentialsOnRead`          |
| `mixins/integrationCredentials-api.mo`            | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/openRouter-api.mo`                        | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/llm-fallback-api.mo`                      | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/webhooksAndIntegrations-api.mo`           | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/composio-api.mo`                          | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/liveSend-api.mo`                          | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/dograh-api.mo`                            | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/abacus-api.mo`                            | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/contentStudio-api.mo`                     | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/masterAgent-api.mo`                       | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/leadAI-api.mo`                            | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/leadEngine-api.mo`                        | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/aiEmailGen-api.mo`                        | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/autopilotSms-api.mo`                      | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/autopilotEmail-api.mo`                    | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/autopilotDiscovery-api.mo`                | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/autopilotReplyIntel-api.mo`               | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/autopilotCompliance-api.mo`               | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/llmLeadGeneration-api.mo`                 | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/roofingCampaign-api.mo`                   | Call sites swapped to `*WithSecret` variants                                                    |
| `mixins/autoBrowser-api.mo`                       | Call sites swapped to `*WithSecret` variants                                                    |

---

## 5. Provider Coverage

The following providers all now route credential save/load through
SecretManager via the `*WithSecret` variants:

- OpenAI
- Anthropic / Claude
- OpenRouter
- Gemini
- ElevenLabs
- Twilio
- SendGrid
- Vapi
- Composio
- Dograh
- Abacus
- NVIDIA NIM / Nemotron
- N8N
- Stripe
- Google
- Yelp
- Facebook
- Hunter
- NeverBounce
- Perplexity
- SerpApi
- TinyFish
- Listmonk
- SearXNG

---

## 6. Migration Behavior

On first read after deploy:

1. Stored credentials in legacy XOR format are transparently re-encrypted to
   `v1:<secretId>:<hex>` format and persisted back to the `integrationCreds`
   stable map.
2. The `*WithSecret` helpers fall back to legacy XOR-with-`credSalt`
   decryption for untagged / `HEX:` ciphertext, so existing stored
   credentials remain readable during migration.
3. Migration is **idempotent** — already-migrated `v1:` ciphertext is
   detected and left untouched on subsequent reads.

No operator action is required for the migration to occur; it happens
transparently on first credential read after the new canister is deployed.

---

## 7. `credSalt` Status

`credSalt` is **retained** at `src/backend/main.mo:1330` **only** as the
legacy-decrypt fallback input for the `*WithSecret` helpers.

- No new credential is written using bare XOR-with-`credSalt`.
- The salt exists solely so already-stored legacy credentials remain
  decryptable until they are migrated to `v1:` format on first read.
- Once all stored credentials have been migrated (post-deploy), the salt is
  inert for new writes.

---

## 8. Builder.io

Builder.io is **not implemented in source**. Only
`docs/BUILDER_IO_INTEGRATION_PLAN.md` exists.

No action was needed for Builder.io as part of this sweep.

---

## 9. Build Verification

The following build pipeline was run after the changes:

| Step                          | Result |
| ----------------------------- | ------ |
| Backend `mops check --fix`     | Passed |
| Backend `mops build`          | Passed |
| Frontend `pnpm bindgen`        | Passed |
| Frontend `pnpm typecheck`      | Passed |
| Frontend `pnpm build`         | Passed |

No errors were reported at any stage.

---

## 10. What the User Should Do After Deploy

1. **Re-enter API keys** via the Go Live admin page
   (`src/frontend/.../GoLivePage.tsx`) to store them freshly under
   SecretManager encryption. This guarantees the keys are written in the new
   `v1:<secretId>:<hex>` format from the start.
2. **Use "Test All Connections"** to verify each provider still authenticates
   after the re-entry.
3. The **one-time migration** will also upgrade any previously-stored
   credentials on first read, so any keys not re-entered will still be
   migrated transparently — but re-entering is the cleanest path and
   confirms each key is valid.

---

## Out of Scope

The following items were explicitly excluded from this sweep per the build
contract and are **not** addressed in this report:

- Admin secret rotation runbook with migration progress status
- Per-tenant encryption context binding
