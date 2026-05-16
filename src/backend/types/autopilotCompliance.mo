module {

  /// A single entry in the immutable send audit log.
  /// Every email or SMS dispatched appends one of these — never mutated.
  public type AuditLogEntry = {
    id               : Text;
    timestamp        : Int;
    leadId           : Text;
    messageType      : { #email; #sms };
    subjectOrSnippet : Text;
    senderSubdomain  : Text;
    optOutLinkPresent : Bool;
  };

  /// Result of a DNS TXT-record check for SPF / DKIM / DMARC.
  public type DnsCheckResult = {
    domain      : Text;
    spfPresent  : Bool;
    dkimPresent : Bool;
    dmarcPresent : Bool;
    rawRecords  : [Text];
    checkedAt   : Int;
  };

  /// Global compliance configuration.
  public type ComplianceConfig = {
    businessName     : Text;   // "Booked Ranked Funded"
    physicalAddress  : Text;   // Admin-editable placeholder
    unsubscribeBase  : Text;   // "https://bookedrankedfunded.org/unsubscribe"
    adminEmail       : Text;   // Complaint-rate alerts are sent here
    maxComplaintRate : Float;  // Default 0.003  (0.3%)
    maxBounceRate    : Float;  // Default 0.05   (5.0%)
    softBounceRetries : Nat;   // Default 3
  };

};
