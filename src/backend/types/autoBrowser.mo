module {

  /// A single gap identified by the browser audit agent for a specific area.
  public type GapItem = {
    severity    : Text;   // "high" | "medium" | "low"
    area        : Text;   // "website" | "gbp" | "social"
    description : Text;
  };

  /// An immutable entry in the audit trail for a browser audit result.
  public type AuditTrailEntry = {
    action    : Text;
    timestamp : Int;
    actorId   : Text;
    notes     : Text;
  };

  /// The full structured output returned by the auto-browser agent for one lead audit.
  public type BrowserAuditResult = {
    jobId               : Text;
    tenantId            : Text;
    businessName        : Text;
    auditedAt           : Int;
    // Website
    websiteStatus       : Text;   // "ok" | "no_website" | "error"
    websiteScore        : Nat;
    websiteGaps         : [Text];
    websiteScreenshotUrl: Text;
    // Google Business Profile
    gbpStatus           : Text;   // "ok" | "not_found" | "error"
    gbpScore            : Nat;
    gbpGaps             : [Text];
    gbpScreenshotUrl    : Text;
    // Social
    socialStatus        : Text;   // "ok" | "not_found" | "error"
    socialScore         : Nat;
    socialGaps          : [Text];
    socialScreenshotUrl : Text;
    // Composite
    totalBrowserScore   : Nat;
    gaps                : [GapItem];
    // Approval workflow
    adminApproved       : Bool;
    approvedAt          : ?Int;
    approvedBy          : ?Text;
    // Audit trail
    auditTrail          : [AuditTrailEntry];
  };

};
