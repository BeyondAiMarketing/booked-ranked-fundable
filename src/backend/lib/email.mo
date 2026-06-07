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

  public func trialConfirmationPayload(
    toEmail      : Text,
    businessName : Text,
    firstName    : Text,
    expiryDate   : Text,
    loginUrl     : Text
  ) : Text {
    let features = "<ul style='margin:8px 0;padding-left:20px;'>" #
      "<li>CRM and Lead Management</li>" #
      "<li>Social Media Campaign Scheduler</li>" #
      "<li>Reputation Management</li>" #
      "<li>AI Voice Agent</li>" #
      "<li>Credit Builder</li>" #
      "<li>Analytics and Reporting</li>" #
      "</ul>";
    let html = "<div style='font-family:Arial,sans-serif;max-width:600px;'>" #
      "<h1 style='color:#a855f7;'>Your 7-Day Trial is Live!</h1>" #
      "<p>Hi " # esc(firstName) # ",</p>" #
      "<p>Your free trial for <strong>" # esc(businessName) # "</strong> has been activated.</p>" #
      "<p><strong>What you have access to:</strong></p>" # features #
      "<p><strong>Trial expires:</strong> " # esc(expiryDate) # "</p>" #
      "<p><a href='" # esc(loginUrl) # "'>Log In to Your Trial</a></p>" #
      "<p style='font-size:12px;color:#aaa;'>Booked Ranked and Fundable</p>" #
      "</div>";
    "{" # kv("to", toEmail) # "," # kv("subject", "Your BRF 7-Day Trial is Live!") # ",\"html\":\"" # html # "\"}"
  };

  public func adminTrialNotificationPayload(
    adminEmail    : Text,
    businessName  : Text,
    firstName     : Text,
    prospectEmail : Text,
    phone         : Text,
    website       : Text,
    niche         : Text,
    city          : Text,
    activatedAt   : Text
  ) : Text {
    let html = "<div style='font-family:Arial,sans-serif;max-width:600px;'>" #
      "<h1 style='color:#a855f7;'>New Trial Activated</h1>" #
      "<p><strong>Business:</strong> " # esc(businessName) # "</p>" #
      "<p><strong>Owner:</strong> " # esc(firstName) # "</p>" #
      "<p><strong>Email:</strong> " # esc(prospectEmail) # "</p>" #
      "<p><strong>Phone:</strong> " # esc(phone) # "</p>" #
      "<p><strong>Website:</strong> " # esc(website) # "</p>" #
      "<p><strong>Niche:</strong> " # esc(niche) # "</p>" #
      "<p><strong>City:</strong> " # esc(city) # "</p>" #
      "<p><strong>Activated:</strong> " # esc(activatedAt) # "</p>" #
      "</div>";
    "{" # kv("to", adminEmail) # "," # kv("subject", "New Trial Activated - " # businessName) # ",\"html\":\"" # html # "\"}"
  };
};
