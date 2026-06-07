module {

  /// Client tier for feature toggle scoping.
  public type FeatureToggleTier = {
    #Basic;
    #Pro;
    #Agency;
  };

  /// A single feature flag with per-tier enable/disable state.
  public type FeatureToggle = {
    featureName      : Text;
    basicEnabled     : Bool;
    proEnabled       : Bool;
    agencyEnabled    : Bool;
    lastModifiedTime : Int;
    lastModifiedBy   : Text;
  };

  /// Audit log entry for a feature toggle change.
  public type FeatureToggleLog = {
    id               : Text;
    featureName      : Text;
    tier             : Text;
    previousValue    : Bool;
    newValue         : Bool;
    modifiedBy       : Text;
    modifiedAt       : Int;
  };

};
