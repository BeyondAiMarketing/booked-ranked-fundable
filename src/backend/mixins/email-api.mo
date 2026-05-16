import List    "mo:core/List";
import Time    "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import T       "../types/email";
import EmailLib "../lib/email";

/// Public email API mixin.
///
/// Injects:
///   - accessControlState  — for caller auth checks
///   - emailLogs           — persisted send-attempt records
///   - warmSchedules       — scheduled warm-sequence sends
///   - warmEvents          — warm-sequence email events
///   - emailIdCounter      — monotonic id seed (passed by ref via wrapper)
///   - transform           — the shared http transform query function
mixin (
  accessControlState : AccessControl.AccessControlState,
  emailLogs          : List.List<T.EmailLogRecord>,
  warmSchedules      : List.List<T.WarmSequenceEmailSchedule>,
  warmEvents         : List.List<T.WarmSequenceEmailEvent>,
  emailIdCounter     : { var n : Nat },
  transform          : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ---- Internal helpers -----------------------------------------------------

  let caffEmailEndpoint = "https://email.caffeine.ai/send";

  func nextEmailId() : Text {
    emailIdCounter.n += 1;
    "em-" # Time.now().toText() # "-" # emailIdCounter.n.toText()
  };

  func emailAssertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  func emailAssertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  /// Fire the HTTP outcall. On network failure record as "failed", not trap.
  func sendEmail(
    emailType : Text,
    tenantId  : Text,
    recipient : Text,
    subject   : Text,
    payload   : Text,
  ) : async T.EmailSendResult {
    let headers : [Outcall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];
    try {
      let _response = await Outcall.httpPostRequest(caffEmailEndpoint, headers, payload, transform);
      let id = nextEmailId();
      emailLogs.add(EmailLib.makeLogRecord(id, emailType, tenantId, recipient, subject, "sent", ""));
      #ok id
    } catch (_e) {
      let id = nextEmailId();
      let msg = "outcall failed";
      emailLogs.add(EmailLib.makeLogRecord(id, emailType, tenantId, recipient, subject, "failed", msg));
      #err msg
    };
  };

  // ---- Public API -----------------------------------------------------------

  /// Schedule a warm-sequence email touch. Persists the schedule record and
  /// records a "scheduled" event. Does NOT send immediately; the actual send
  /// is triggered by sendWarmSequenceEmail() below.
  public shared ({ caller }) func scheduleWarmSequenceEmail(
    enrollmentId : Text,
    touchIndex   : Nat,
    delayHours   : Nat,
    recipient    : Text,
    subject      : Text,
    body         : Text,
  ) : async Text {
    emailAssertUser(caller);
    let id = nextEmailId();
    let schedule = EmailLib.makeScheduleRecord(id, enrollmentId, touchIndex, delayHours, recipient, subject, body);
    warmSchedules.add(schedule);
    let evId = nextEmailId();
    warmEvents.add(EmailLib.makeEventRecord(evId, enrollmentId, touchIndex, "scheduled"));
    id
  };

  /// Manually trigger the send of a previously scheduled warm-sequence touch.
  /// Marks the schedule as "sent" and fires the HTTP outcall.
  public shared ({ caller }) func sendWarmSequenceEmail(
    enrollmentId : Text,
    touchIndex   : Nat,
    delayHours   : Nat,
    recipient    : Text,
    subject      : Text,
    body         : Text,
  ) : async T.EmailSendResult {
    emailAssertUser(caller);
    let payload = EmailLib.warmSequencePayload(enrollmentId, touchIndex, recipient, subject, body);
    let result = await sendEmail("warm_sequence", "", recipient, subject, payload);
    // Update any matching pending schedule to "sent"
    warmSchedules.mapInPlace(func(s : T.WarmSequenceEmailSchedule) : T.WarmSequenceEmailSchedule {
      if (s.enrollmentId == enrollmentId and s.touchIndex == touchIndex and s.status == "pending") {
        { s with status = "sent" }
      } else { s }
    });
    let evId = nextEmailId();
    let evType = switch (result) { case (#ok _) "sent"; case (#err _) "failed" };
    warmEvents.add(EmailLib.makeEventRecord(evId, enrollmentId, touchIndex, evType));
    result
  };

  /// Record an arbitrary warm-sequence event (opened, clicked, replied, etc.)
  /// triggered by an external webhook or frontend action.
  public shared ({ caller }) func trackWarmSequenceEvent(
    enrollmentId : Text,
    touchIndex   : Nat,
    eventType    : Text,
  ) : async () {
    emailAssertUser(caller);
    let id = nextEmailId();
    warmEvents.add(EmailLib.makeEventRecord(id, enrollmentId, touchIndex, eventType));
  };

  /// Query all scheduled warm-sequence sends (for admin/client visibility).
  public query ({ caller }) func getWarmSequenceSchedules(enrollmentId : Text) : async [T.WarmSequenceEmailSchedule] {
    emailAssertUser(caller);
    warmSchedules.filter(func(s : T.WarmSequenceEmailSchedule) : Bool {
      s.enrollmentId == enrollmentId
    }).toArray()
  };

  /// Query all warm-sequence events for an enrollment.
  public query ({ caller }) func getWarmSequenceEvents(enrollmentId : Text) : async [T.WarmSequenceEmailEvent] {
    emailAssertUser(caller);
    warmEvents.filter(func(e : T.WarmSequenceEmailEvent) : Bool {
      e.enrollmentId == enrollmentId
    }).toArray()
  };

  // ---- Transactional email sends --------------------------------------------

  /// Send a post-job review-request email.
  /// `recipient` must be a verified/opted-in customer email (never a cold lead).
  public shared ({ caller }) func sendReviewRequestEmail(
    leadId            : Text,
    clientName        : Text,
    businessName      : Text,
    reviewPlatformUrl : Text,
    recipient         : Text,
    tenantId          : Text,
  ) : async T.EmailSendResult {
    emailAssertUser(caller);
    let subject = "How was your experience with " # businessName # "?";
    let payload = EmailLib.reviewRequestPayload(leadId, clientName, businessName, reviewPlatformUrl);
    await sendEmail("review_request", tenantId, recipient, subject, payload)
  };

  /// Send a booking confirmation email to the customer.
  public shared ({ caller }) func sendBookingConfirmationEmail(
    appointmentId       : Text,
    customerEmail       : Text,
    customerName        : Text,
    businessName        : Text,
    appointmentDateTime : Text,
    address             : Text,
    tenantId            : Text,
  ) : async T.EmailSendResult {
    emailAssertUser(caller);
    let subject = "Your appointment with " # businessName # " is confirmed";
    let payload = EmailLib.bookingConfirmationPayload(
      appointmentId, customerEmail, customerName, businessName, appointmentDateTime, address
    );
    await sendEmail("booking_confirmation", tenantId, customerEmail, subject, payload)
  };

  /// Send a health-score alert email to the admin when a client score drops.
  public shared ({ caller }) func sendHealthScoreAlertEmail(
    clientId      : Text,
    adminEmail    : Text,
    clientName    : Text,
    healthScore   : Nat,
    previousScore : Nat,
    topIssue      : Text,
    tenantId      : Text,
  ) : async T.EmailSendResult {
    emailAssertAdmin(caller);
    let tier = if (healthScore < 40) "🔴 Critical" else "🟡 Warning";
    let subject = tier # ": " # clientName # " health score dropped to " # healthScore.toText();
    let payload = EmailLib.healthScoreAlertPayload(clientId, adminEmail, clientName, healthScore, previousScore, topIssue);
    await sendEmail("health_score_alert", tenantId, adminEmail, subject, payload)
  };

  /// Send a weekly/monthly client report email.
  public shared ({ caller }) func sendClientReportEmail(
    clientId          : Text,
    clientEmail       : Text,
    clientName        : Text,
    reportPeriod      : Text,
    reportSummaryHtml : Text,
    tenantId          : Text,
  ) : async T.EmailSendResult {
    emailAssertUser(caller);
    let subject = "Your " # reportPeriod # " performance report — " # clientName;
    let payload = EmailLib.clientReportPayload(clientId, clientEmail, clientName, reportPeriod, reportSummaryHtml);
    await sendEmail("client_report", tenantId, clientEmail, subject, payload)
  };

  /// Send an onboarding step email to a new user.
  public shared ({ caller }) func sendOnboardingEmail(
    userId         : Text,
    userEmail      : Text,
    userName       : Text,
    userRole       : Text,
    onboardingStep : Text,
    tenantId       : Text,
  ) : async T.EmailSendResult {
    emailAssertUser(caller);
    let subject = "Welcome to BRF — " # onboardingStep;
    let payload = EmailLib.onboardingPayload(userId, userEmail, userName, userRole, onboardingStep);
    await sendEmail("onboarding", tenantId, userEmail, subject, payload)
  };

  // ---- Log queries ----------------------------------------------------------

  /// Return all email log records for a tenant.
  public query ({ caller }) func getEmailLogsByTenant(tenantId : Text) : async [T.EmailLogRecord] {
    emailAssertUser(caller);
    emailLogs.filter(func(r : T.EmailLogRecord) : Bool { r.tenantId == tenantId }).toArray()
  };

};
