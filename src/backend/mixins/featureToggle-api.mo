import Map     "mo:core/Map";
import List    "mo:core/List";
import Text    "mo:core/Text";
import FTTypes "../types/featureToggle";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

mixin (
  featureToggles    : Map.Map<Text, FTTypes.FeatureToggle>,
  featureToggleLogs : List.List<FTTypes.FeatureToggleLog>,
  ftLogIdCounter    : { var value : Nat },
) {

  /// Returns all feature toggles.
  public query func getFeatureToggles() : async [FTTypes.FeatureToggle] {
    featureToggles.values().toArray()
  };

  /// Sets the enabled state for a single feature + tier.
  /// Returns true on success.
  public shared func setFeatureToggle(
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
    true
  };

  /// Bulk-sets multiple feature toggles for a single tier.
  /// Returns true when all updates succeed.
  public shared func bulkSetFeatureToggles(
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
    };
    true
  };

  /// Resets all feature toggles to platform defaults (all enabled for all tiers).
  /// Returns true on success.
  public shared func resetToDefaults() : async Bool {
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
    true
  };

  /// Returns the feature toggle audit log.
  public query func getFeatureToggleLogs() : async [FTTypes.FeatureToggleLog] {
    featureToggleLogs.toArray()
  };

};
