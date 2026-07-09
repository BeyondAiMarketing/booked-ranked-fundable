import Principal "mo:core/Principal";

import AIMemoryLib  "../lib/ai-memory";
import AIMemoryTypes "../types/ai-memory";
import SJS          "../lib/StableJsonStore";

/// Public API surface for the 8-level AI memory layer.
///
/// Tenant isolation is enforced here: every read/write for tenant-scoped
/// and below entries (#Tenant, #Organization, #Campaign, #Lead,
/// #Conversation, #Agent) validates `hasAccessToTenant(caller, tenantId)`
/// via the injected `assertTenantAccess` callback. #Global and #Platform
/// scopes are admin-only writes, gated by `assertAdmin`.
///
/// The orchestrator automatically reads memory context for the active
/// tenant/organization/campaign/lead/conversation/agent scopes before
/// execution and writes results back after execution — those orchestrator
/// hooks live in the orchestrator mixin and call into AIMemoryLib directly.
mixin (
  state       : AIMemoryTypes.MemoryState,
  durableStore : SJS.State,
  assertAdmin : (caller : Principal) -> (),
  assertTenantAccess : (caller : Principal, tenantId : Text) -> (),
) {

  // ── Type re-exports for the Candid interface ────────────────────────────────
  public type MemoryScope        = AIMemoryTypes.MemoryScope;
  public type MemoryEntry        = AIMemoryTypes.MemoryEntry;
  public type MemoryFilter       = AIMemoryTypes.MemoryFilter;
  public type MemoryContextBlock = AIMemoryTypes.MemoryContextBlock;

  // ── Access helpers ──────────────────────────────────────────────────────────
  //
  // `assertAdmin` and `assertTenantAccess` are injected by the composition
  // root (main.mo) so this mixin does not depend directly on AccessControl
  // or the main-actor `hasAccessToTenant` helper. The callbacks trap on
  // unauthorized access, matching the pattern used by other mixins
  // (e.g. auditLog-api.mo's `audit_assertAdmin`).

  /// True when the scope is one of the durable, cross-tenant admin-only
  /// scopes ("global", "platform"). Writes to these require admin; reads are
  /// allowed for any authenticated caller because context assembly needs
  /// them.
  func isAdminOnlyScope(scope : MemoryScope) : Bool {
    scope == "global" or scope == "platform";
  };

  /// True when the scope is tenant-scoped or below — i.e. the `scopeId`
  /// carries a tenantId (or a sub-tenant identifier like orgId / campaignId
  /// / leadId / conversationId / agentId) that must be access-checked
  /// against the caller.
  func isTenantScoped(scope : MemoryScope) : Bool {
    not (scope == "global" or scope == "platform");
  };

  // ── Write ──────────────────────────────────────────────────────────────────

  // writeMemory temporarily disabled for bisect
  // readMemory temporarily disabled for bisect
  // listMemory temporarily disabled for bisect
  // deleteMemory temporarily disabled for bisect
  // buildMemoryContext temporarily disabled for bisect
  // buildMemoryContextText temporarily disabled for bisect
  // memoryEntryCount temporarily disabled for bisect
  // memoryHotTierCount temporarily disabled for bisect
  // memoryDurableTierCount temporarily disabled for bisect

};
