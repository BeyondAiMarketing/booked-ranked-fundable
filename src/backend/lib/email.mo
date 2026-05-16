import Text "mo:core/Text";
import Time "mo:core/Time";
import T    "../types/email";

/// Pure helper module — no state, no imports that require async context.
/// All JSON building lives here. The mixin calls Outcall directly.
module {

  // ---------------------------------------------------------------------------
  // JSON helpers
  // ---------------------------------------------------------------------------

  func esc(s : Text) : Text {
    // Minimal JSON string escaping: backslash, double-quote, and control chars.
    let s1 = s.replace(#text "\\", "\\\\");
    let s2 = s1.replace(#text "\"", "\\\"");
    let s3 = s2.replace(#text "\n", "\\n");
    s3.replace(#text "\r", "\\r")
  };

  func kv(key : Text, value : Text) : Text {
    "\"" # esc(key) # "\":\"" # esc(value) # "\""
  };

  // ---------------------------------------------------------------------------
  // Build JSON payloads for each email type
  // ---------------------------------------------------------------------------

  public func reviewRequestPayload(
    leadId            : Text,
    clientName        : Text,
    businessName      : Text,
    reviewPlatformUrl : Text,
  ) : Text {
    "{"
    # kv("type",              "review_request")   # ","
    # kv("leadId",            leadId)             # ","
    # kv("clientName",        clientName)         # ","
    # kv("businessName",      businessName)       # ","
    # kv("reviewPlatformUrl", reviewPlatformUrl)
    # "}"
  };

  public func bookingConfirmationPayload(
    appointmentId       : Text,
    customerEmail       : Text,
    customerName        : Text,
    businessName        : Text,
    appointmentDateTime : Text,
    address             : Text,
  ) : Text {
    "{"
    # kv("type",                "booking_confirmation") # ","
    # kv("appointmentId",       appointmentId)         # ","
    # kv("customerEmail",       customerEmail)         # ","
    # kv("customerName",        customerName)          # ","
    # kv("businessName",        businessName)          # ","
    # kv("appointmentDateTime", appointmentDateTime)   # ","
    # kv("address",             address)
    # "}"
  };

  public func healthScoreAlertPayload(
    clientId      : Text,
    adminEmail    : Text,
    clientName    : Text,
    healthScore   : Nat,
    previousScore : Nat,
    topIssue      : Text,
  ) : Text {
    "{"
    # kv("type",          "health_score_alert")        # ","
    # kv("clientId",      clientId)                   # ","
    # kv("adminEmail",    adminEmail)                  # ","
    # kv("clientName",    clientName)                  # ","
    # kv("healthScore",   healthScore.toText())        # ","
    # kv("previousScore", previousScore.toText())      # ","
    # kv("topIssue",      topIssue)
    # "}"
  };

  public func clientReportPayload(
    clientId          : Text,
    clientEmail       : Text,
    clientName        : Text,
    reportPeriod      : Text,
    reportSummaryHtml : Text,
  ) : Text {
    "{"
    # kv("type",              "client_report")    # ","
    # kv("clientId",          clientId)           # ","
    # kv("clientEmail",       clientEmail)        # ","
    # kv("clientName",        clientName)         # ","
    # kv("reportPeriod",      reportPeriod)       # ","
    # kv("reportSummaryHtml", reportSummaryHtml)
    # "}"
  };

  public func onboardingPayload(
    userId         : Text,
    userEmail      : Text,
    userName       : Text,
    userRole       : Text,
    onboardingStep : Text,
  ) : Text {
    "{"
    # kv("type",           "onboarding")   # ","
    # kv("userId",         userId)         # ","
    # kv("userEmail",      userEmail)      # ","
    # kv("userName",       userName)       # ","
    # kv("userRole",       userRole)       # ","
    # kv("onboardingStep", onboardingStep)
    # "}"
  };

  public func warmSequencePayload(
    enrollmentId : Text,
    touchIndex   : Nat,
    recipient    : Text,
    subject      : Text,
    body         : Text,
  ) : Text {
    "{"
    # kv("type",         "warm_sequence")        # ","
    # kv("enrollmentId", enrollmentId)           # ","
    # kv("touchIndex",   touchIndex.toText())    # ","
    # kv("recipient",    recipient)              # ","
    # kv("subject",      subject)               # ","
    # kv("body",         body)
    # "}"
  };

  // ---------------------------------------------------------------------------
  // Log record factory
  // ---------------------------------------------------------------------------

  public func makeLogRecord(
    id        : Text,
    emailType : Text,
    tenantId  : Text,
    recipient : Text,
    subject   : Text,
    status    : Text,
    errorMsg  : Text,
  ) : T.EmailLogRecord {
    {
      id;
      emailType;
      tenantId;
      recipient;
      subject;
      status;
      sentAt   = Time.now();
      errorMsg;
    }
  };

  public func makeScheduleRecord(
    id           : Text,
    enrollmentId : Text,
    touchIndex   : Nat,
    delayHours   : Nat,
    recipient    : Text,
    subject      : Text,
    body         : Text,
  ) : T.WarmSequenceEmailSchedule {
    let now       = Time.now();
    let delayNano : Int = delayHours * 3_600_000_000_000;
    {
      id;
      enrollmentId;
      touchIndex;
      delayHours;
      recipient;
      subject;
      body;
      scheduledAt = now;
      sendAfter   = now + delayNano;
      status      = "pending";
    }
  };

  public func makeEventRecord(
    id           : Text,
    enrollmentId : Text,
    touchIndex   : Nat,
    eventType    : Text,
  ) : T.WarmSequenceEmailEvent {
    {
      id;
      enrollmentId;
      touchIndex;
      eventType;
      occurredAt = Time.now();
    }
  };

};
