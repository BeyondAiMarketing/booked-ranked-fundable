module {

  /// The kind of admin action recorded in the centralized audit trail.
  ///
  /// Covers the canonical admin operations that must be auditable across the
  /// platform. The `#other` variant carries a free-form Text tag for actions
  /// that do not fit the fixed set, so callers are never forced to mislabel.
  public type AuditAction = {
    #secretRotation;
    #featureFlagChange;
    #adminCommand;
    #credentialUpdate;
    #leadEdit;
    #webhookConfigChange;
    #other : Text;
  };

  /// A single immutable entry in the admin audit log.
  ///
  /// Append-only — once written, an entry is never updated or deleted.
  /// `redactedPayload` MUST NOT contain secrets or PII; callers are
  /// responsible for redacting before passing (see `AuditLog.redactSecrets`).
  public type AdminAuditEntry = {
    actorPrincipal  : Principal;
    tenantId        : Text;
    actionType      : AuditAction;
    timestamp       : Int;
    redactedPayload : Text;
  };

};
