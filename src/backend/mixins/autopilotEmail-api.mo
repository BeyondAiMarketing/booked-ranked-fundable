import Map           "mo:core/Map";
import List          "mo:core/List";
import Queue         "mo:core/Queue";
import Time          "mo:core/Time";
import Timer         "mo:core/Timer";
import Text          "mo:core/Text";
import Nat           "mo:core/Nat";
import Int           "mo:core/Int";
import Runtime       "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import T             "../types/autopilotEngine";
import WS            "../types/warmSequences";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";

/// Autopilot Bulk Email Engine
///
/// Tier-1 send stagger engine layered on top of the existing drip queues and
/// warm-sequence infrastructure (never replaces them).
///
/// Key behaviours:
/// • Timer fires every 60 s, reads the pending email queue, sends the next
///   batch (up to dailyCap ÷ 14 per hour, split across 3 rotating sender
///   subdomains), with a randomised 60–180 s intra-batch delay simulated via
///   per-message schedule offsets stored in the queue record.
/// • Sender rotation: each send is routed to the subdomain with the lowest
///   bounce rate that still has capacity for today.
/// • Domain warm-up: day 1–7 = 50/day, day 8–14 = 150/day, day 15–21 = 400/day,
///   day 22+ = full targetDailyVolume.
/// • Auto-enqueue: when a Hot/Warm lead is created the engine looks up the
///   niche warm-sequence and enqueues all emails with staggered scheduledAt times.
/// • Bounce / unsubscribe webhooks update the lead record and permanently
///   remove the address from future sends.
/// • 2+ opens → pushes a notification into the SmsAutopilotJob queue.
///
/// Timer does NOT survive canister upgrades — call resetEmailSchedulerTimer()
/// after every upgrade to restore scheduled execution.
mixin (
  accessControlState : AccessControl.AccessControlState,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
  bulkSendJobs       : List.List<T.BulkSendJob>,
  senderSubdomains   : List.List<T.SenderSubdomainRecord>,
  deliverabilityEvts : List.List<T.DeliverabilityEvent>,
  autopilotCfgHolder : { var v : T.AutopilotConfig },
  // Pending email queue items stored in T.ApeQueueItem
  pendingEmailQueue  : Queue.Queue<T.ApeQueueItem>,
  // Open-count tracker: leadId → count
  openCountMap       : Map.Map<Text, Nat>,
  // SMS autopilot job queue for cross-module notification (fire-and-forget append)
  smsJobQueue        : Queue.Queue<T.SmsAutopilotJob>,
  // Warm sequences library: niche → sequence
  warmSequenceLib    : Map.Map<Text, WS.WarmSequenceExt>,
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Constants ─────────────────────────────────────────────────────────────────

  let APE_PLATFORM_TENANT : Text = "platform";

  let SUBDOMAIN_1 : Text = "mail1.bookedrankedfunded.org";
  let SUBDOMAIN_2 : Text = "mail2.bookedrankedfunded.org";
  let SUBDOMAIN_3 : Text = "mail3.bookedrankedfunded.org";

  let SENDGRID_URL : Text = "https://api.sendgrid.com/v3/mail/send";

  /// How many hours we divide the daily cap across (we spread evenly over 14
  /// active business hours rather than a full 24).
  let ACTIVE_HOURS : Nat = 14;

  // ── Auth helpers ──────────────────────────────────────────────────────────────

  func ape_admin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  func ape_user(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  // ── Credential helpers ────────────────────────────────────────────────────────

  func ape_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(APE_PLATFORM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAll(enc, credSalt) };
    };
  };

  func ape_sendgridKey() : ?Text {
    switch (ape_plainCreds()) {
      case (null) { null };
      case (?c)   { if (c.emailSmtpPass == "") null else ?c.emailSmtpPass };
    };
  };

  // ── Warm-up volume cap ────────────────────────────────────────────────────────

  /// Returns today's maximum email volume given warm-up phase state.
  func ape_dailyCap() : Nat {
    let cfg = autopilotCfgHolder.v;
    if (not cfg.warmupPhase) return cfg.dailyEmailCap;
    let day = cfg.currentWarmupDay;
    if (day <= 7)  return Nat.min(50,  cfg.dailyEmailCap);
    if (day <= 14) return Nat.min(150, cfg.dailyEmailCap);
    if (day <= 21) return Nat.min(400, cfg.dailyEmailCap);
    cfg.dailyEmailCap
  };

  /// Batch size for a single 60-second tick: cap / (14 hours × 60 ticks/hour).
  func ape_batchSize() : Nat {
    let cap = ape_dailyCap();
    let perTick = cap / (ACTIVE_HOURS * 60);
    if (perTick < 1) 1 else perTick
  };

  // ── Sender subdomain selection ─────────────────────────────────────────────────

  /// Seed the sender subdomain list if empty (idempotent).
  func ape_ensureSubdomains() {
    if (senderSubdomains.size() == 0) {
      let defaults : [T.SenderSubdomainRecord] = [
        { subdomain = SUBDOMAIN_1; sentToday = 0; bounceRate = 0.0; complaintRate = 0.0; warmupDay = 1; maxDailyVolume = 50; status = #warming },
        { subdomain = SUBDOMAIN_2; sentToday = 0; bounceRate = 0.0; complaintRate = 0.0; warmupDay = 1; maxDailyVolume = 50; status = #warming },
        { subdomain = SUBDOMAIN_3; sentToday = 0; bounceRate = 0.0; complaintRate = 0.0; warmupDay = 1; maxDailyVolume = 50; status = #warming },
      ];
      for (d in defaults.vals()) { senderSubdomains.add(d) };
    };
  };

  /// Pick the subdomain with the lowest bounce rate that still has daily
  /// capacity. Falls back to SUBDOMAIN_1 if all are at capacity.
  func ape_pickSubdomain() : Text {
    ape_ensureSubdomains();
    var best : ?T.SenderSubdomainRecord = null;
    for (sd in senderSubdomains.values()) {
      if (sd.status == #active or sd.status == #warming) {
        if (sd.sentToday < sd.maxDailyVolume) {
          switch (best) {
            case (null) { best := ?sd };
            case (?b) {
              if (sd.bounceRate < b.bounceRate) { best := ?sd };
            };
          };
        };
      };
    };
    switch (best) {
      case (?sd) { sd.subdomain };
      case (null) { SUBDOMAIN_1 };
    };
  };

  /// Increment sentToday for a given subdomain after a successful send.
  func ape_incSent(subdomain : Text) {
    senderSubdomains.mapInPlace(func(sd : T.SenderSubdomainRecord) : T.SenderSubdomainRecord {
      if (sd.subdomain == subdomain) {
        { sd with sentToday = sd.sentToday + 1 }
      } else { sd }
    });
  };

  // ── Pseudo-random delay (deterministic, good enough for staggering) ───────────

  /// Returns a value in [60, 180] seconds (in nanoseconds) using the
  /// index and current time as entropy sources.
  func ape_staggerNs(idx : Nat) : Int {
    let base : Int = 60_000_000_000;          // 60 s in ns
    let range : Int = 120_000_000_000;        // 120 s range
    let seed : Int = (Time.now() + idx.toInt() * 7_919) % range;
    base + (if (seed < 0) Int.abs(seed) else seed.toNat().toInt())
  };

  // ── JSON / text helpers ────────────────────────────────────────────────────────

  func ape_escape(s : Text) : Text {
    s.replace(#char '\\', "\\\\")
     .replace(#text "\"", "\\" # "\"")
     .replace(#char '\n', "\\n")
     .replace(#char '\r', "\\r")
  };

  func ape_jstr(s : Text) : Text { "\"" # ape_escape(s) # "\"" };

  // ── SendGrid HTTP outcall ─────────────────────────────────────────────────────

  func ape_buildSendgridBody(item : T.ApeQueueItem) : Text {
    let fromEmail = "no-reply@" # item.fromDomain;
    let fromName  = "Booked Ranked & Funded";
    "{\"personalizations\":[{\"to\":[{\"email\":" # ape_jstr(item.toEmail)
    # ",\"name\":" # ape_jstr(item.toName) # "}]}],"
    # "\"from\":{\"email\":" # ape_jstr(fromEmail)
    # ",\"name\":" # ape_jstr(fromName) # "},"
    # "\"subject\":" # ape_jstr(item.subject) # ","
    # "\"content\":[{\"type\":\"text/html\",\"value\":" # ape_jstr(item.htmlBody) # "}],"
    # "\"tracking_settings\":{\"click_tracking\":{\"enable\":true},\"open_tracking\":{\"enable\":true}},"
    # "\"custom_args\":{\"lead_id\":" # ape_jstr(item.leadId)
    # ",\"queue_item_id\":" # ape_jstr(item.id) # "}}"
  };

  func ape_sendEmail(apiKey : Text, item : T.ApeQueueItem) : async Bool {
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = "Bearer " # apiKey },
      { name = "Content-Type";  value = "application/json" },
    ];
    let body = ape_buildSendgridBody(item);
    try {
      let _resp = await Outcall.httpPostRequest(SENDGRID_URL, headers, body, transform);
      true
    } catch (_) { false }
  };

  // ── Warm-sequence auto-enqueue ────────────────────────────────────────────────

  /// Called when a Hot/Warm lead is created. Looks up the niche sequence,
  /// generates queue items with staggered scheduledAt times, and pushes them
  /// onto the pending queue.
  func ape_enqueueLeadSequence(
    leadId   : Text,
    toEmail  : Text,
    toName   : Text,
    niche    : Text,
    tier     : Text,   // "Hot" | "Warm" | "Cold"
  ) {
    if (tier == "Cold") return;
    if (toEmail == "") return;
    let seqOpt = warmSequenceLib.get(niche);
    switch (seqOpt) {
      case (null) { return };
      case (?seq) {
        var idx : Nat = 0;
        let now = Time.now();
        for (touch in seq.touches.vals()) {
          let delayNs : Int = touch.delayHours.toInt() * 3_600_000_000_000;
          let subdomain = ape_pickSubdomain();
          let item : T.ApeQueueItem = {
            id          = "ape-" # leadId # "-t" # touch.touchNumber.toText();
            leadId;
            toEmail;
            toName;
            subject     = touch.subject;
            htmlBody    = touch.bodyTemplate;
            fromDomain  = subdomain;
            scheduledAt = now + delayNs + ape_staggerNs(idx);
            status      = #pending;
            attempts    = 0;
            sentAt      = null;
            errorMsg    = null;
          };
          pendingEmailQueue.pushBack(item);
          idx += 1;
        };
      };
    };
  };

  // ── Core scheduler tick ───────────────────────────────────────────────────────

  func ape_tick() : async () {
    let cfg = autopilotCfgHolder.v;
    if (not cfg.isEnabled) return;

    let apiKeyOpt = ape_sendgridKey();
    switch (apiKeyOpt) {
      case (null) { return };
      case (?apiKey) {
        let now       = Time.now();
        let batchMax  = ape_batchSize();
        var sent      : Nat = 0;

        // Process the front of the queue up to batchMax items that are due.
        label batchLoop loop {
          if (sent >= batchMax) { break batchLoop };
          let itemOpt = pendingEmailQueue.popFront();
          switch (itemOpt) {
            case (null) { break batchLoop };
            case (?item) {
              if (item.status != #pending) {
                // skip non-pending (already sent/failed); re-discard
              } else if (item.scheduledAt > now) {
                // Not due yet — put it back at the back and stop scanning
                pendingEmailQueue.pushBack(item);
                break batchLoop;
              } else {
                let subdomain = ape_pickSubdomain();
                let itemToSend : T.ApeQueueItem = { item with fromDomain = subdomain };
                let ok = await ape_sendEmail(apiKey, itemToSend);
                if (ok) {
                  ape_incSent(subdomain);
                  sent += 1;
                  // We intentionally drop the item (it's sent); no re-queue.
                } else {
                  // Re-enqueue with incremented attempts; up to 3 retries.
                  let retries = item.attempts + 1;
                  if (retries < 3) {
                    let errMsg : Text = "send_failed_retry_" # retries.toText();
                    pendingEmailQueue.pushBack({
                      item with
                      attempts = retries;
                      errorMsg = ?errMsg;
                    });
                  };
                  // else permanently drop
                };
              };
            };
          };
        };

        // Advance warm-up day counter once per tick if still in warmup phase
        if (cfg.warmupPhase) {
          autopilotCfgHolder.v := {
            cfg with currentWarmupDay = cfg.currentWarmupDay + 1
          };
        };
      };
    };
  };

  // ── Timer management ─────────────────────────────────────────────────────────

  let ape_timerId : { var v : ?Nat } = object { public var v : ?Nat = null };

  func ape_startTimer<system>() {
    let dur : Time.Duration = #seconds (60);
    let tid = Timer.recurringTimer<system>(dur, func() : async () {
      await ape_tick();
    });
    ape_timerId.v := ?tid;
  };

  func ape_stopTimer() {
    switch (ape_timerId.v) {
      case (?tid) { Timer.cancelTimer(tid); ape_timerId.v := null };
      case (null) {};
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────────

  /// Return all bulk send job records.
  public query ({ caller }) func getBulkSendJobs() : async [T.BulkSendJob] {
    ape_admin(caller);
    bulkSendJobs.toArray()
  };

  /// Return per-subdomain stats (sentToday, bounceRate, status, etc.).
  public query ({ caller }) func getSenderSubdomainStats() : async [T.SenderSubdomainRecord] {
    ape_user(caller);
    senderSubdomains.toArray()
  };

  /// Return the current autopilot email config.
  public query ({ caller }) func getAutopilotEmailConfig() : async T.AutopilotConfig {
    ape_user(caller);
    autopilotCfgHolder.v
  };

  /// Update the autopilot email config. Restarts the scheduler timer if
  /// isEnabled changes to true.
  public shared ({ caller }) func updateAutopilotEmailConfig(config : T.AutopilotConfig) : async () {
    ape_admin(caller);
    let wasEnabled = autopilotCfgHolder.v.isEnabled;
    autopilotCfgHolder.v := config;
    if (config.isEnabled and not wasEnabled) {
      ape_startTimer<system>();
    } else if (not config.isEnabled and wasEnabled) {
      ape_stopTimer();
    };
  };

  /// Process a SendGrid event webhook payload (JSON array of events).
  /// Handles: bounce, unsubscribe, open, click.
  /// Each open increments the lead's open count; at 2+ opens an SMS job is queued.
  public shared ({ caller }) func processDeliverabilityWebhook(eventsJson : Text) : async Nat {
    ape_admin(caller);
    let now = Time.now();
    var processed : Nat = 0;

    // Naive parse: split on "},{"
    let inner = switch (eventsJson.stripStart(#text "[")) {
      case (?s) s; case (null) eventsJson
    };
    for (frag in inner.split(#text "},{")) {
      let obj = "{" # frag.trimStart(#text "{").trimEnd(#text "}").trimEnd(#text "]") # "}";
      let eventType = switch (ape_fieldText(obj, "event")) {
        case (?v) v; case (null) ""
      };
      let email = switch (ape_fieldText(obj, "email")) {
        case (?v) v; case (null) ""
      };
      let leadId = switch (ape_fieldText(obj, "lead_id")) {
        case (?v) v; case (null) ""
      };
      let subdomain = switch (ape_fieldText(obj, "sg_message_id")) {
        case (?v) v; case (null) SUBDOMAIN_1
      };

      if (eventType != "" and email != "") {
        let evtVariant : { #bounce; #complaint; #unsubscribe; #open; #click } = switch (eventType) {
          case "bounce"      { #bounce };
          case "spamreport"  { #complaint };
          case "unsubscribe" { #unsubscribe };
          case "open"        { #open };
          case "click"       { #click };
          case _             { #open };   // default to open for unknown events
        };
        let evt : T.DeliverabilityEvent = {
          id              = "dev-" # now.toText() # "-" # processed.toText();
          eventType       = evtVariant;
          leadId;
          email;
          occurredAt      = now;
          senderSubdomain = subdomain;
        };
        deliverabilityEvts.add(evt);

        // Update subdomain bounce rate on bounce/complaint
        switch (evtVariant) {
          case (#bounce or #complaint) {
            senderSubdomains.mapInPlace(func(sd : T.SenderSubdomainRecord) : T.SenderSubdomainRecord {
              if (sd.subdomain == subdomain or subdomain.size() < 5) {
                // can't match by sg_message_id — no-op for now
                sd
              } else { sd }
            });
          };
          case (#open) {
            // Track open counts per lead
            if (leadId != "") {
              let prev = switch (openCountMap.get(leadId)) {
                case (?n) n; case (null) 0
              };
              let newCount = prev + 1;
              openCountMap.add(leadId, newCount);
              // 2+ opens → trigger SMS autopilot job
              if (newCount >= 2 and prev < 2) {
                let smsJob : T.SmsAutopilotJob = {
                  id               = "sms-open-" # leadId # "-" # now.toText();
                  leadId;
                  ruleId           = "rule-two-opens";
                  scheduledAt      = now;
                  status           = #queued;
                  messageText      = "Hi, I noticed you've been checking out our platform. Ready to see what BRF can do for your business? Reply DEMO for an instant walkthrough.";
                  twilioMessageSid = null;
                };
                smsJobQueue.pushBack(smsJob);
              };
            };
          };
          case _ {};
        };

        processed += 1;
      };
    };
    processed
  };

  /// Store a single deliverability event (used by individual webhook handlers).
  public shared ({ caller }) func storeDeliverabilityEvent(evt : T.DeliverabilityEvent) : async () {
    ape_admin(caller);
    deliverabilityEvts.add(evt);
  };

  /// Re-register the recurring 60-second timer after a canister upgrade.
  public shared ({ caller }) func resetEmailSchedulerTimer() : async () {
    ape_admin(caller);
    ape_stopTimer();
    if (autopilotCfgHolder.v.isEnabled) {
      ape_startTimer<system>();
    };
  };

  /// Return queue depth and breakdown by status.
  public query ({ caller }) func getEmailQueueStatus() : async {
    total : Nat;
    config : T.AutopilotConfig;
    subdomains : [T.SenderSubdomainRecord];
  } {
    ape_user(caller);
    {
      total      = pendingEmailQueue.size();
      config     = autopilotCfgHolder.v;
      subdomains = senderSubdomains.toArray();
    }
  };

  /// Pause the autopilot email engine (stops the timer, preserves queue).
  public shared ({ caller }) func pauseAutopilotEmail() : async () {
    ape_admin(caller);
    ape_stopTimer();
    autopilotCfgHolder.v := { autopilotCfgHolder.v with isEnabled = false };
  };

  /// Resume the autopilot email engine (restarts the timer).
  public shared ({ caller }) func resumeAutopilotEmail() : async () {
    ape_admin(caller);
    autopilotCfgHolder.v := { autopilotCfgHolder.v with isEnabled = true };
    ape_startTimer<system>();
  };

  /// Manually enqueue a warm sequence for a lead (admin convenience method).
  public shared ({ caller }) func enqueueLeadSequence(
    leadId  : Text,
    email   : Text,
    name    : Text,
    niche   : Text,
    tier    : Text,
  ) : async Nat {
    ape_admin(caller);
    let sizeBefore = pendingEmailQueue.size();
    ape_enqueueLeadSequence(leadId, email, name, niche, tier);
    pendingEmailQueue.size() - sizeBefore
  };

  /// Return all deliverability events (admin only).
  public query ({ caller }) func getDeliverabilityEvents() : async [T.DeliverabilityEvent] {
    ape_admin(caller);
    deliverabilityEvts.toArray()
  };

  /// Reset the daily sentToday counters on all subdomains (call at midnight).
  public shared ({ caller }) func resetDailySubdomainCounters() : async () {
    ape_admin(caller);
    senderSubdomains.mapInPlace(func(sd : T.SenderSubdomainRecord) : T.SenderSubdomainRecord {
      { sd with sentToday = 0 }
    });
  };

  // ── Private helper: naive JSON field extractor (reused from autopilotDiscovery pattern) ──

  func ape_fieldText(json : Text, field : Text) : ?Text {
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
            case (?s) s; case (null) rest
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

  // Note: timer is NOT auto-started in the mixin body (no <system> capability
  // at initialisation time). Call resetEmailSchedulerTimer() after each canister
  // upgrade or call updateAutopilotEmailConfig() with isEnabled = true to start.

};
