import Map      "mo:core/Map";
import List     "mo:core/List";
import Text     "mo:core/Text";
import Time     "mo:core/Time";
import Nat      "mo:core/Nat";
import Principal "mo:core/Principal";

import FTTypes   "../types/featureToggle";
import SJS       "../lib/StableJsonStore";
import AuditLog  "../lib/auditLog";
import AuditT    "../types/auditLog";

/// Feature Toggle mixin.
///
/// Admin actions that mutate feature flags are recorded in the centralized
/// admin audit trail via `AuditLog.appendAdminAudit` (actionType
/// `#featureFlagChange`). The audit store and nonce are injected from
/// `main.mo` alongside the toggle state.
mixin (
  featureToggles    : Map.Map<Text, FTTypes.FeatureToggle>,
  featureToggleLogs : List.List<FTTypes.FeatureToggleLog>,
  ftLogIdCounter    : { var value : Nat },
  /// Centralized admin audit trail store (existing StableJsonStore state).
  adminAuditStore   : SJS.State,
  /// Per-canister nonce for audit-entry key uniqueness.
  adminAuditNonce   : { var n : Nat },
) {

  /// Default tenant id used when no tenant context is available for a flag change.
  let DEFAULT_FLAG_TENANT : Text = "system";

  /// Append a `#featureFlagChange` audit entry. Records the caller principal,
  /// a default tenant, the current timestamp, and a redacted payload describing
  /// the flag name and new value. Best-effort: never traps the calling flow.
  func auditFlagChange(caller : Principal, payload : Text) {
    let entry : AuditT.AdminAuditEntry = {
      actorPrincipal  = caller;
      tenantId        = DEFAULT_FLAG_TENANT;
      actionType      = #featureFlagChange;
      timestamp       = Time.now();
      redactedPayload = AuditLog.redactSecrets(payload);
    };
    let nonce = adminAuditNonce.n;
    adminAuditNonce.n := nonce + 1;
    AuditLog.appendAdminAudit(adminAuditStore, entry, nonce);
  };

  /// Returns all feature toggles.
  public query func getFeatureToggles() : async [FTTypes.FeatureToggle] {
    featureToggles.values().toArray()
  };

  /// Sets the enabled state for a single feature + tier.
  /// Returns true on success.
  public shared ({ caller }) func setFeatureToggle(
    featureName : Text,
    tier        : Text,
    isEnabled   : Bool,
    modifiedBy  : Text,
  ) : async Bool {
    let now = Time.now();
    let existing : FTTypes.FeatureToggle = switch (featureToggles.get(featureName)) {
      case (?ft) { ft };
      case (null) {
        {
          featureName;
          basicEnabled  = true;
          proEnabled    = true;
          agencyEnabled = true;
          lastModifiedTime = now;
          lastModifiedBy   = modifiedBy;
        }
      };
    };
    let updated : FTTypes.FeatureToggle = switch (tier) {
      case "basic"  { { existing with basicEnabled  = isEnabled; lastModifiedTime = now; lastModifiedBy = modifiedBy } };
      case "pro"    { { existing with proEnabled    = isEnabled; lastModifiedTime = now; lastModifiedBy = modifiedBy } };
      case "agency" { { existing with agencyEnabled = isEnabled; lastModifiedTime = now; lastModifiedBy = modifiedBy } };
      case (_)      { existing };
    };
    featureToggles.add(featureName, updated);
    let previousValue = switch (tier) {
      case "basic"  { existing.basicEnabled  };
      case "pro"    { existing.proEnabled    };
      case "agency" { existing.agencyEnabled };
      case (_)      { isEnabled };
    };
    let logId = "ftl-" # ftLogIdCounter.value.toText();
    ftLogIdCounter.value += 1;
    featureToggleLogs.add({
      id            = logId;
      featureName;
      tier;
      previousValue;
      newValue      = isEnabled;
      modifiedBy;
      modifiedAt    = now;
    });
    auditFlagChange(caller, "setFeatureToggle feature=" # featureName # " tier=" # tier # " newValue=" # (if (isEnabled) "true" else "false") # " by=" # modifiedBy);
    true
  };

  /// Bulk-sets multiple feature toggles for a single tier.
  /// Returns true when all updates succeed.
  public shared ({ caller }) func bulkSetFeatureToggles(
    tier       : Text,
    updates    : [(Text, Bool)],
    modifiedBy : Text,
  ) : async Bool {
    for ((featureName, isEnabled) in updates.values()) {
      let now = Time.now();
      let existing : FTTypes.FeatureToggle = switch (featureToggles.get(featureName)) {
        case (?ft) { ft };
        case (null) {
          {
            featureName;
            basicEnabled  = true;
            proEnabled    = true;
            agencyEnabled = true;
            lastModifiedTime = now;
            lastModifiedBy   = modifiedBy;
          }
        };
      };
      let updated : FTTypes.FeatureToggle = switch (tier) {
        case "basic"  { { existing with basicEnabled  = isEnabled; lastModifiedTime = now; lastModifiedBy = modifiedBy } };
        case "pro"    { { existing with proEnabled    = isEnabled; lastModifiedTime = now; lastModifiedBy = modifiedBy } };
        case "agency" { { existing with agencyEnabled = isEnabled; lastModifiedTime = now; lastModifiedBy = modifiedBy } };
        case (_)      { existing };
      };
      featureToggles.add(featureName, updated);
      let previousValue = switch (tier) {
        case "basic"  { existing.basicEnabled  };
        case "pro"    { existing.proEnabled    };
        case "agency" { existing.agencyEnabled };
        case (_)      { isEnabled };
      };
      let logId = "ftl-" # ftLogIdCounter.value.toText();
      ftLogIdCounter.value += 1;
      featureToggleLogs.add({
        id            = logId;
        featureName;
        tier;
        previousValue;
        newValue      = isEnabled;
        modifiedBy;
        modifiedAt    = now;
      });
      auditFlagChange(caller, "bulkSetFeatureToggles feature=" # featureName # " tier=" # tier # " newValue=" # (if (isEnabled) "true" else "false") # " by=" # modifiedBy);
    };
    true
  };

  /// Resets all feature toggles to platform defaults (all enabled for all tiers).
  /// Returns true on success.
  public shared ({ caller }) func resetToDefaults() : async Bool {
    let now = Time.now();
    let keys = List.empty<Text>();
    for ((k, _) in featureToggles.entries()) { keys.add(k) };
    for (k in keys.values()) {
      switch (featureToggles.get(k)) {
        case (?ft) {
          featureToggles.add(k, {
            ft with
            basicEnabled  = true;
            proEnabled    = true;
            agencyEnabled = true;
            lastModifiedTime = now;
            lastModifiedBy   = "system";
          });
        };
        case (null) {};
      };
    };
    auditFlagChange(caller, "resetToDefaults: all feature toggles reset to platform defaults (all enabled)");
    true
  };

  /// Returns the feature toggle audit log.
  public query func getFeatureToggleLogs() : async [FTTypes.FeatureToggleLog] {
    featureToggleLogs.toArray()
  };

};
