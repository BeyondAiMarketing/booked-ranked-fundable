module {

  /// A roofing lead to be enrolled in the outreach campaign.
  public type RoofingLead = {
    email        : Text;
    companyName  : Text;
    city         : Text;
    state        : Text;
    phone        : ?Text;
    website      : ?Text;
    businessType : Text;
  };

  /// Status variant for a lead in the campaign.
  public type CampaignLeadStatus = {
    #active;
    #paused;
    #unsubscribed;
    #completed;
  };

  /// Per-lead campaign progress tracker.
  public type LeadCampaignStatus = {
    leadEmail    : Text;
    companyName  : Text;
    city         : Text;
    state        : Text;
    phone        : ?Text;
    website      : ?Text;
    businessType : Text;
    currentStep  : Nat;       // 1-7, next email to send
    lastSentAt   : ?Int;
    lastOpenedAt : ?Int;
    enrolledAt   : Int;
    status       : CampaignLeadStatus;
  };

  /// A single grid point result from a local ranking audit.
  public type GridPoint = {
    direction       : Text;   // "center", "N", "NE", "E", "SE", "S", "SW", "W", "NW"
    lat             : Float;
    lng             : Float;
    rankPosition    : Nat;    // 1-20; 0 = not found
    competitorAtTop : Text;   // name of business ranking #1 at this point
    searched        : Bool;
  };

  /// Full grid audit result for a lead.
  public type GridAuditResult = {
    leadEmail            : Text;
    businessName         : Text;
    city                 : Text;
    state                : Text;
    gridPoints           : [GridPoint];
    scannedAt            : Int;
    coverageZoneSummary  : Text;  // human-readable summary
  };

  /// Historical snapshot for tracking rank improvements over time.
  public type GridAuditSnapshot = {
    result     : GridAuditResult;
    snapshotAt : Int;
  };

  /// Aggregate campaign statistics.
  public type CampaignStats = {
    totalEnrolled    : Nat;
    emailsSentToday  : Nat;
    emailsSentWeek   : Nat;
    emailsSentAllTime: Nat;
    openRate         : Float;  // 0.0 - 1.0
    clickRate        : Float;
  };

  /// Internal counter/flag holder for campaign-level state.
  public type CampaignCounters = {
    var totalSent       : Nat;
    var sentToday       : Nat;
    var sentThisWeek    : Nat;
    var totalOpens      : Nat;
    var totalClicks     : Nat;
    var lastDayReset    : Int;
    var lastWeekReset   : Int;
    var paused          : Bool;
  };

  /// Detailed campaign record for a lead, returned by getLeadCampaignDetails.
  public type LeadCampaignDetails = {
    auditScore          : ?Nat;   // overall visibility score 0-100
    deadZones           : ?Nat;   // count of invisible grid points
    topCompetitor       : ?Text;  // competitor at the top in dead zones
    missingServices     : ?Text;  // service gaps identified
    currentEmailDay     : Nat;    // 1-7, next email to send
    lastSentAt          : ?Int;
    templateVersionUsed : ?Nat;   // id of the last template used
    usedFallback        : ?Bool;  // whether fallback was used on last send
  };
};
