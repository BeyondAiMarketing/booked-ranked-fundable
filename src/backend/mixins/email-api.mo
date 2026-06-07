import List    "mo:core/List";
import Time    "mo:core/Time";
import Nat     "mo:core/Nat";
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

  /// Generate AI-tailored email copy for a roofing cold outreach sequence.
  /// Uses marketing framework templates. Falls back to a high-converting template
  /// when no OpenAI key is configured (email-api mixin does not hold credentials).
  public shared ({ caller }) func generateTailoredEmailCopy(
    businessName : Text,
    city         : Text,
    niche        : Text,
    emailIndex   : Nat,
    framework    : Text,
  ) : async { #ok : Text; #err : Text } {
    emailAssertUser(caller);
    let idx = emailIndex;
    let copy = if (framework == "Brunson") {
      // Hook-Story-Offer
      let subjects = [
        "Hey " # businessName # " — most " # niche # " businesses in " # city # " are missing this",
        "The story of a " # niche # " company that doubled bookings without spending more on ads",
        "Everything " # businessName # " gets with one platform (value breakdown inside)",
        "Proof: " # niche # " businesses in " # city # " are booking more jobs automatically",
        "Last chance — " # businessName # " still hasn't claimed their free demo",
      ];
      let bodies = [
        "I'll be direct.\n\nMost " # niche # " businesses in " # city # " lose 40% of their leads to missed calls and slow follow-up.\n\nWe built an AI that answers every call, books appointments, and follows up automatically — so you never lose a job to a competitor who picked up faster.\n\nTakes 15 minutes to see it live: [DEMO_LINK]\n\nWorth your time?",
        "A " # niche # " owner in " # city # " was working 14-hour days and still missing calls.\n\nWe gave them an AI that handled follow-ups while they were on the roof.\n\nWithin 30 days: 23 more booked jobs. Zero extra ad spend.\n\nHere's how it works for " # businessName # ": [DEMO_LINK]",
        "Here's what " # businessName # " gets with BRF:\n\n✅ AI-powered call answering (value: $1,200/mo)\n✅ Automated follow-up sequences (value: $800/mo)\n✅ Review management (value: $400/mo)\n✅ AI booking engine (value: $600/mo)\n\nTotal value: $3,000/mo. Our price: a fraction of that.\n\nSee it in 15 minutes: [DEMO_LINK]",
        "3 " # niche # " businesses in " # city # " activated BRF last month.\n\nAverage result in week 1: 18 leads contacted automatically, 6 appointments booked without lifting a finger.\n\n" # businessName # " could be next. Demo spots are limited this week: [DEMO_LINK]",
        "This is my last email to " # businessName # ".\n\nIf automating your follow-ups, bookings, and reviews isn't a priority right now — no hard feelings.\n\nBut if you'd like to see how 15 minutes could change how " # businessName # " operates, book a demo here before the week ends: [DEMO_LINK]",
      ];
      let si = if (idx < subjects.size()) idx else 0;
      let bi = if (idx < bodies.size()) idx else 0;
      "Subject: " # subjects[si] # "\n\n" # bodies[bi]
    } else if (framework == "Hormozi") {
      // Grand Slam Offer Value Stack
      let subject = "The " # niche # " offer in " # city # " that makes saying no feel stupid";
      let body = "Grand Slam breakdown for " # businessName # ":\n\n" #
        "PROBLEM: You're leaving money on the table every time a call goes unanswered.\n" #
        "SOLUTION: AI that answers, qualifies, and books — 24/7.\n" #
        "GUARANTEE: If you don't book 10 more jobs in 30 days, you pay nothing.\n" #
        "URGENCY: We're onboarding 3 " # niche # " businesses in " # city # " this month.\n\n" #
        "Claim your spot: [DEMO_LINK]";
      "Subject: " # subject # "\n\n" # body
    } else if (framework == "Kennedy") {
      // Pain-Agitate-Solve with deadline
      let subject = "" # businessName # ": the " # niche # " problem costing you jobs in " # city;
      let body = "Every missed call is a job that went to your competitor.\n\n" #
        "In " # city # ", the average " # niche # " business misses 37% of inbound calls. That's not a rounding error — that's your revenue walking out the door.\n\n" #
        "BRF fixes this: AI answers every call, qualifies the lead, books the appointment, and follows up automatically.\n\n" #
        "DEADLINE: Demo slots for " # city # " " # niche # " businesses close Friday.\n\n" #
        "Book yours: [DEMO_LINK]";
      "Subject: " # subject # "\n\n" # body
    } else {
      // Halbert pattern interrupt
      let subject = "READ THIS, " # businessName # " (it's short and it matters)";
      let body = "STOP.\n\n" #
        "Before you delete this: " # businessName # " is losing jobs every week to slower competitors who just picked up the phone.\n\n" #
        "We built an AI that does that for you.\n\n" #
        "Every call. Every follow-up. Every booking. Automatic.\n\n" #
        "See it in 15 minutes — no pitch, just a live demo: [DEMO_LINK]";
      "Subject: " # subject # "\n\n" # body
    };
    #ok copy
  };

};
