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

  /// Feature flag names used across the platform.
  /// LEAD_ENGINE_ENABLED gates all Lead Engine importer methods; default false.
  public let LEAD_ENGINE_ENABLED : Text = "LEAD_ENGINE_ENABLED";

  /// TWILIO_INTEGRATION_ENABLED gates live SMS sending via sendLiveSms;
  /// default false (disabled) — additive only.
  public let TWILIO_INTEGRATION_ENABLED : Text = "TWILIO_INTEGRATION_ENABLED";

  /// SENDGRID_INTEGRATION_ENABLED gates live transactional email sending via
  /// sendLiveEmail; default false (disabled) — additive only.
  public let SENDGRID_INTEGRATION_ENABLED : Text = "SENDGRID_INTEGRATION_ENABLED";

  /// WEBHOOK_INBOX_ENABLED gates the unified webhook inbox (normalized event
  /// store + Instantly/Smartlead receivers + stats/test endpoints); default
  /// false (disabled) — additive only.
  public let WEBHOOK_INBOX_ENABLED : Text = "WEBHOOK_INBOX_ENABLED";

};
