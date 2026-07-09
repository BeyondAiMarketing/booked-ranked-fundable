import Principal "mo:core/Principal";
import Runtime   "mo:core/Runtime";
import Time      "mo:core/Time";
import Nat       "mo:core/Nat";

import AccessControl "mo:caffeineai-authorization/access-control";
import SJS           "../lib/StableJsonStore";
import AuditLog      "../lib/auditLog";
import T             "../types/auditLog";

/// Centralized Admin Audit Trail — Public API
///
/// Exposes the append-only admin audit log to the canister's public surface.
/// All endpoints are admin-gated via `AccessControl.isAdmin`. The audit log
/// is persisted through the existing `StableJsonStore` (no new stable state).
///
/// Entries are append-only: this mixin exposes NO update or delete endpoint.
mixin (
  accessControlState : AccessControl.AccessControlState,
  /// The StableJsonStore state record. In `main.mo` pass
  /// `{ store = stableStore.getStore() }` where `stableStore` is the
  /// `StableJsonStoreCore.Core()` instance.
  auditStore : SJS.State,
  /// Per-canister nonce counter for audit-entry key uniqueness. Pass a
  /// `{ var n : Nat }` record shared by reference so increments propagate.
  auditNonce : { var n : Nat },
) {

  // ── Auth helper ─────────────────────────────────────────────────────────────

  func audit_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Append (the ONLY mutation endpoint) ─────────────────────────────────────

  /// Append an immutable admin audit entry. Admin-only.
  ///
  /// The caller is responsible for redacting secrets/PII from
  /// `redactedPayload` BEFORE calling — the `AuditLog.redactSecrets` helper
  /// is available as a defensive backstop but is not a substitute for
  /// caller-side care.
  ///
  /// The entry's `actor` is overwritten with the authenticated `caller` so
  /// the audit trail cannot be spoofed.
  public shared ({ caller }) func appendAdminAudit(entry : T.AdminAuditEntry) : async () {
    audit_assertAdmin(caller);
    // Force the actor to the authenticated caller — audit entries cannot be
    // spoofed by passing a different principal.
    let stamped : T.AdminAuditEntry = {
      entry with
      actorPrincipal = caller;
      timestamp = if (entry.timestamp == 0) { Time.now() } else { entry.timestamp };
    };
    let nonce = auditNonce.n;
    auditNonce.n := nonce + 1;
    AuditLog.appendAdminAudit(auditStore, stamped, nonce);
  };

  // ── Reads ──────────────────────────────────────────────────────────────────

  /// Return a paginated slice of admin audit entries for a tenant, optionally
  /// filtered by action type. Newest-first. Admin-only.
  public query ({ caller }) func getAdminAuditLog(
    tenantId : Text,
    actionFilter : ?T.AuditAction,
    offset : Nat,
    limit : Nat,
  ) : async [T.AdminAuditEntry] {
    audit_assertAdmin(caller);
    AuditLog.getAdminAuditLog(auditStore, tenantId, actionFilter, offset, limit);
  };

  /// Count the total admin audit entries for a tenant, honoring an optional
  /// action filter. Admin-only.
  public query ({ caller }) func getAdminAuditCount(
    tenantId : Text,
    actionFilter : ?T.AuditAction,
  ) : async Nat {
    audit_assertAdmin(caller);
    AuditLog.getAdminAuditCount(auditStore, tenantId, actionFilter);
  };

  // ── Secret redaction helper (query, admin-only) ────────────────────────────

  /// Defensive helper: replaces common secret patterns in `text` with
  /// `[REDACTED]`. Callers SHOULD redact before passing payloads to
  /// `appendAdminAudit`; this endpoint is exposed for convenience and as a
  /// documented backstop.
  public query ({ caller }) func redactSecrets(text : Text) : async Text {
    audit_assertAdmin(caller);
    AuditLog.redactSecrets(text);
  };

};
