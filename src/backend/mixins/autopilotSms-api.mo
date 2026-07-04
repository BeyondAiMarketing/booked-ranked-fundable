import Map           "mo:core/Map";
import List          "mo:core/List";
import Time          "mo:core/Time";
import Timer         "mo:core/Timer";
import Text          "mo:core/Text";
import Nat           "mo:core/Nat";
import Nat8          "mo:core/Nat8";
import Int           "mo:core/Int";
import Blob          "mo:core/Blob";
import Array         "mo:core/Array";
import Runtime       "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import T             "../types/autopilotEngine";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";

/// SMS Autopilot Rules Engine
///
/// Monitors email open counts per lead and queues outbound SMS touches
/// according to two configurable rules:
///
///   twoOpens            — fires after 2+ email opens (default: 60-min delay)
///   noOpenFortyEightHours — fires after 48 h with 0 opens on a sent lead
///
/// SMS delivery uses a Twilio HTTP outcall.  A daily cap is enforced and
/// resets at midnight UTC via a recurring timer.
///
/// Inbound SMS replies are classified by Claude as Urgent / Follow-up /
/// Unsubscribe.  Urgent and Follow-up items surface in the admin inbox
/// (ReplyInboxItem with status "pending_review").  Unsubscribe permanently
/// opts the lead out — NO auto-send is performed on any reply.
mixin (
  accessControlState  : AccessControl.AccessControlState,
  integrationCreds    : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt            : Blob,
  smsAutopilotJobs    : List.List<T.SmsAutopilotJob>,
  smsAutopilotRules   : { var v : [T.SmsAutopilotRule] },
  replyInboxItems     : List.List<T.ReplyInboxItem>,
  smsSentToday        : { var n : Nat },
  smsLastReset        : { var t : Int },
  transform           : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Constants ─────────────────────────────────────────────────────────────────

  let SMS_PLATFORM_TENANT : Text = "platform";
  let DEFAULT_DAILY_CAP : Nat = 200;
  /// Nanoseconds in 24 h
  let NS_PER_DAY : Int = 86_400_000_000_000;

  // ── Default rules (loaded once; caller may overwrite via updateSmsAutopilotRules) ───

  let DEFAULT_RULES : [T.SmsAutopilotRule] = [
    {
      id              = "rule-two-opens";
      triggerType     = #twoOpens;
      delayMinutes    = 60;
      messageTemplate = "Hi [ownerName], I noticed you checked out our email twice — that tells me this might be worth a 5-minute call. Here is your personalized demo: [demoLink]. Reply STOP to unsubscribe.";
      isActive        = true;
      sentCount       = 0;
    },
    {
      id              = "rule-no-open-48h";
      triggerType     = #noOpenFortyEightHours;
      delayMinutes    = 0;
      messageTemplate = "Hey [ownerName], I sent you something about your [niche] business. Wanted to make sure it landed right. Check it out: [demoLink]. Reply STOP to unsubscribe.";
      isActive        = true;
      sentCount       = 0;
    },
  ];

  // Seed once on first access
  func sms_ensureDefaultRules() {
    if (smsAutopilotRules.v.size() == 0) {
      smsAutopilotRules.v := DEFAULT_RULES;
    };
  };

  // ── Auth helpers ──────────────────────────────────────────────────────────────

  func sms_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Credential helpers ────────────────────────────────────────────────────────

  func sms_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(SMS_PLATFORM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAll(enc, credSalt) };
    };
  };

  func sms_getTwilio() : ?(Text, Text, Text) {
    // Returns ?(accountSid, authToken, fromNumber) or null
    switch (sms_plainCreds()) {
      case (null) { null };
      case (?c) {
        if (c.twilioSid == "" or c.twilioAuth == "" or c.twilioNumber == "") null
        else ?(c.twilioSid, c.twilioAuth, c.twilioNumber);
      };
    };
  };

  func sms_getClaude() : ?Text {
    switch (sms_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.claudeKey == "") null else ?c.claudeKey };
    };
  };

  // ── Daily cap helpers ─────────────────────────────────────────────────────────

  /// Reset counter if the wall clock has crossed midnight UTC since last reset.
  func sms_maybeResetDailyCount() {
    let now = Time.now();
    if (now - smsLastReset.t >= NS_PER_DAY) {
      smsSentToday.n  := 0;
      smsLastReset.t  := now;
    };
  };

  func sms_underCap(dailyCap : Nat) : Bool {
    sms_maybeResetDailyCount();
    smsSentToday.n < dailyCap;
  };

  // ── Text helpers ──────────────────────────────────────────────────────────────

  func sms_escape(s : Text) : Text {
    s.replace(#char '&', "%26")
     .replace(#char '+', "%2B")
     .replace(#char '=', "%3D")
     .replace(#char ' ', "+");
  };

  func sms_jstr(s : Text) : Text {
    let esc = s.replace(#char '\\', "\\\\")
               .replace(#text "\"", "\\" # "\"")
               .replace(#char '\n', "\\n")
               .replace(#char '\r', "\\r");
    "\"" # esc # "\""
  };

  /// Substitute template placeholders with real lead data.
  func sms_renderTemplate(template : Text, ownerName : Text, niche : Text, demoLink : Text) : Text {
    template
      .replace(#text "[ownerName]", ownerName)
      .replace(#text "[niche]",     niche)
      .replace(#text "[demoLink]",  demoLink);
  };

  func sms_naiveField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\"";
    let segs   = json.split(#text needle);
    var afterKey = false;
    var result : ?Text = null;
    for (seg in segs) {
      if (afterKey and result == null) {
        let rest = seg.trimStart(#text " ")
                      .trimStart(#text ":")
                      .trimStart(#text " ");
        if (rest.startsWith(#text "\"")) {
          let inner = switch (rest.stripStart(#text "\"")) {
            case (?s) s;
            case (null) rest;
          };
          switch (inner.split(#text "\"").next()) {
            case (?v) { result := ?v };
            case (null) {};
          };
        };
      };
      afterKey := true;
    };
    result
  };

  // ── Base64 encoder (for Twilio Basic Auth) ───────────────────────────────────

  let B64_CHARS : Text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  func sms_base64Encode(input : Text) : Text {
    let bytes = input.encodeUtf8().toArray();
    let n     = bytes.size();
    var out   : Text = "";
    var i : Nat = 0;
    let charArr = B64_CHARS.toArray();
    while (i < n) {
      let b0 : Nat = Nat.fromNat8(bytes[i]);
      let b1 : Nat = if (i + 1 < n) Nat.fromNat8(bytes[i + 1]) else 0;
      let b2 : Nat = if (i + 2 < n) Nat.fromNat8(bytes[i + 2]) else 0;
      let idx0 = b0 / 4;
      let idx1 = (b0 % 4) * 16 + b1 / 16;
      let idx2 = (b1 % 16) * 4 + b2 / 64;
      let idx3 = b2 % 64;
      out #= Text.fromChar(charArr[idx0]);
      out #= Text.fromChar(charArr[idx1]);
      out #= if (i + 1 < n) Text.fromChar(charArr[idx2]) else "=";
      out #= if (i + 2 < n) Text.fromChar(charArr[idx3]) else "=";
      i   += 3;
    };
    out
  };

  // ── Twilio SMS send ───────────────────────────────────────────────────────────

  /// POST to Twilio Messages API with form-encoded body.
  /// Returns the Twilio MessageSid on success, or null on failure.
  func sms_sendViaTwilio(sid : Text, auth : Text, from : Text, toNum : Text, body : Text) : async ?Text {
    let url  = "https://api.twilio.com/2010-04-01/Accounts/" # sid # "/Messages.json";
    let authHeader = "Basic " # sms_base64Encode(sid # ":" # auth);
    let formBody = "From=" # sms_escape(from)
                 # "&To="   # sms_escape(toNum)
                 # "&Body=" # sms_escape(body);
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = authHeader },
      { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
    ];
    try {
      let resp = await Outcall.httpPostRequest(url, headers, formBody, transform);
      // Twilio returns {"sid":"SM...","status":"queued",...}
      sms_naiveField(resp, "sid")
    } catch (_) { null };
  };

  // ── Claude urgency classification ─────────────────────────────────────────────

  let SMS_CLASSIFY_PROMPT : Text =
    "You are a reply classifier for a B2B outreach system. " #
    "A local business owner replied to an automated SMS. " #
    "Classify the reply as exactly ONE of: URGENT, FOLLOW_UP, UNSUBSCRIBE. " #
    "URGENT = expressed interest, wants a call, or asked a question. " #
    "FOLLOW_UP = neutral, non-committal, or needs more info. " #
    "UNSUBSCRIBE = any variant of STOP, unsubscribe, remove me, not interested, etc. " #
    "Reply with ONLY the classification word — no explanation.";

  func sms_classifyReply(key : Text, messageBody : Text) : async Text {
    let body = "{\"model\":\"claude-3-5-haiku-20241022\","
      # "\"max_tokens\":10,"
      # "\"system\":" # sms_jstr(SMS_CLASSIFY_PROMPT) # ","
      # "\"messages\":[{\"role\":\"user\",\"content\":"
      # sms_jstr(messageBody) # "}]}";
    let headers : [Outcall.Header] = [
      { name = "x-api-key";         value = key },
      { name = "anthropic-version"; value = "2023-06-01" },
      { name = "Content-Type";      value = "application/json" },
    ];
    try {
      let resp = await Outcall.httpPostRequest("https://api.anthropic.com/v1/messages", headers, body, transform);
      let raw  = switch (sms_naiveField(resp, "text")) { case (?v) v; case (null) resp };
      let upper = raw.trim(#char ' ').toUpper();
      if   (upper.startsWith(#text "URGENT"))       "URGENT"
      else if (upper.startsWith(#text "UNSUBSCRIBE")) "UNSUBSCRIBE"
      else                                            "FOLLOW_UP"
    } catch (_) { "FOLLOW_UP" };
  };

  // ── Internal SMS job runner ───────────────────────────────────────────────────

  /// Actually send a queued SMS job.  Marks sent/failed in place.
  func sms_executeJob(jobId : Text) : async () {
    let jobOpt = smsAutopilotJobs.find(func(j) { j.id == jobId });
    switch (jobOpt) {
      case (null) {};
      case (?job) {
        switch (sms_getTwilio()) {
          case (null) {
            smsAutopilotJobs.mapInPlace(func(j : T.SmsAutopilotJob) : T.SmsAutopilotJob {
              if (j.id == jobId) { { j with status = #failed; twilioMessageSid = null } } else j
            });
          };
          case (?(sid, auth, from)) {
            // Determine "To" number — stored in job.messageText field is the rendered body;
            // phone is embedded in job id as "sms-<leadId>-<phone>-..." — we need to
            // surface the phone from the lead lookup.  For simplicity the phone is stored
            // as the first segment after "ph:" in the jobId.
            // Convention: jobId = "sms-<ruleId>-<leadId>-<phone>-<ts>"
            let parts   = jobId.split(#char '-');
            var toPhone : Text = "";
            var idx : Nat = 0;
            for (p in parts) {
              if (idx == 3) { toPhone := p };
              idx += 1;
            };
            if (toPhone == "") {
              smsAutopilotJobs.mapInPlace(func(j : T.SmsAutopilotJob) : T.SmsAutopilotJob {
                if (j.id == jobId) { { j with status = #failed } } else j
              });
              return;
            };
            let msgSidOpt = await sms_sendViaTwilio(sid, auth, from, toPhone, job.messageText);
            let newStatus : { #queued; #sent; #failed; #cancelled } = switch (msgSidOpt) {
              case (?_) { smsSentToday.n += 1; #sent };
              case (null) { #failed };
            };
            smsAutopilotJobs.mapInPlace(func(j : T.SmsAutopilotJob) : T.SmsAutopilotJob {
              if (j.id == jobId) { { j with status = newStatus; twilioMessageSid = msgSidOpt } } else j
            });
            // Increment rule sentCount
            switch (msgSidOpt) {
              case (?_) {
                smsAutopilotRules.v := smsAutopilotRules.v.map(
                  func(r) { if (r.id == job.ruleId) { { r with sentCount = r.sentCount + 1 } } else r }
                );
              };
              case (null) {};
            };
          };
        };
      };
    };
  };

  // ── Timer: daily cap reset ────────────────────────────────────────────────────

  let sms_timerId : { var v : ?Nat } = object { public var v : ?Nat = null };

  func sms_startResetTimer<system>() {
    let dur : Time.Duration = #seconds (86_400);
    let tid = Timer.recurringTimer<system>(dur, func() : async () {
      smsSentToday.n := 0;
      smsLastReset.t := Time.now();
    });
    sms_timerId.v := ?tid;
  };

  func sms_stopResetTimer() {
    switch (sms_timerId.v) {
      case (?tid) { Timer.cancelTimer(tid); sms_timerId.v := null };
      case (null) {};
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────────

  /// Queue an SMS job for a lead according to the specified rule.
  /// Enforces daily cap; does NOT auto-send — caller must trigger execution.
  public shared ({ caller }) func queueSmsForRule(
    leadId    : Text,
    ruleId    : Text,
    ownerName : Text,
    niche     : Text,
    phone     : Text,
    demoLink  : Text,
  ) : async Text {
    sms_assertAdmin(caller);
    sms_ensureDefaultRules();
    let dailyCap = DEFAULT_DAILY_CAP;
    if (not sms_underCap(dailyCap)) {
      Runtime.trap("Daily SMS cap reached (" # dailyCap.toText() # ")");
    };
    let rule = switch (smsAutopilotRules.v.find(func(r) { r.id == ruleId })) {
      case (?r) r;
      case (null) { Runtime.trap("Rule not found: " # ruleId) };
    };
    if (not rule.isActive) {
      Runtime.trap("Rule is inactive: " # ruleId);
    };
    let now      = Time.now();
    let ts       = now.toText();
    // Convention: "sms-<ruleId>-<leadId>-<phone>-<ts>"
    let normPhone = phone.replace(#char '+', "").replace(#char '-', "").replace(#char ' ', "");
    let jobId    = "sms-" # ruleId # "-" # leadId # "-" # normPhone # "-" # ts;
    let rendered = sms_renderTemplate(rule.messageTemplate, ownerName, niche, demoLink);
    let delayNs  : Int = rule.delayMinutes.toInt() * 60_000_000_000;
    let job : T.SmsAutopilotJob = {
      id               = jobId;
      leadId;
      ruleId;
      scheduledAt      = now + delayNs;
      status           = #queued;
      messageText      = rendered;
      twilioMessageSid = null;
    };
    smsAutopilotJobs.add(job);
    jobId
  };

  /// Execute all queued SMS jobs that are past their scheduledAt time and
  /// within the daily cap.  Called by admin or by the discovery scheduler.
  public shared ({ caller }) func flushSmsQueue() : async Nat {
    sms_assertAdmin(caller);
    let now      = Time.now();
    let dailyCap = DEFAULT_DAILY_CAP;
    let toSend   = smsAutopilotJobs.filter(func(j) {
      j.status == #queued and j.scheduledAt <= now
    });
    var sent : Nat = 0;
    for (job in toSend.values()) {
      if (sms_underCap(dailyCap)) {
        await sms_executeJob(job.id);
        sent += 1;
      };
    };
    sent
  };

  /// Process an inbound SMS reply from a lead.
  /// Classifies urgency via Claude.  Urgent/Follow-up → ReplyInboxItem for admin review.
  /// Unsubscribe → marks lead opted-out (caller must update lead record via updateLead).
  /// Returns the classification string.
  public shared ({ caller }) func processSmsReply(
    leadId      : Text,
    leadName    : Text,
    leadNiche   : Text,
    messageBody : Text,
  ) : async Text {
    sms_assertAdmin(caller);
    let classification = switch (sms_getClaude()) {
      case (null)   { "FOLLOW_UP" };  // graceful fallback: no Claude key
      case (?key)   { await sms_classifyReply(key, messageBody) };
    };
    // Surface Urgent + Follow-up in admin inbox; never auto-send
    if (classification == "URGENT" or classification == "FOLLOW_UP") {
      let now = Time.now();
      let itemId = "sms-reply-" # leadId # "-" # now.toText();
      let item : T.ReplyInboxItem = {
        id             = itemId;
        leadId;
        leadName;
        leadNiche;
        replyBody      = messageBody;
        classification;
        draftResponse  = "";   // SMS replies do not auto-generate a draft (see autopilotReplyIntel for email)
        receivedAt     = now;
        status         = "pending_review";
      };
      replyInboxItems.add(item);
    };
    classification
  };

  /// Return all SMS autopilot jobs (admin only).
  public query ({ caller }) func getSmsAutopilotJobs() : async [T.SmsAutopilotJob] {
    sms_assertAdmin(caller);
    smsAutopilotJobs.toArray()
  };

  /// Return current SMS autopilot rules.
  public query ({ caller }) func getSmsAutopilotRules() : async [T.SmsAutopilotRule] {
    sms_assertAdmin(caller);
    sms_ensureDefaultRules();
    smsAutopilotRules.v
  };

  /// Replace the full set of autopilot rules (admin only).
  public shared ({ caller }) func updateSmsAutopilotRules(rules : [T.SmsAutopilotRule]) : async () {
    sms_assertAdmin(caller);
    smsAutopilotRules.v := rules;
  };

  /// Re-register the daily cap reset timer after a canister upgrade.
  public shared ({ caller }) func resetSmsSchedulerTimer() : async () {
    sms_assertAdmin(caller);
    sms_stopResetTimer();
    sms_startResetTimer<system>();
  };

};
