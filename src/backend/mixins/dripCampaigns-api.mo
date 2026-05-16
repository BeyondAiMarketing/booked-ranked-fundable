import Map     "mo:core/Map";
import List    "mo:core/List";
import Time    "mo:core/Time";
import Text    "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import T       "../types/dripCampaigns";
import CsvT    "../types/csvImport";

/// CRM Drip Campaign API mixin.
///
/// Injects:
///   - accessControlState  — for caller auth checks
///   - dripQueues          — Map<queueId, DripQueue>
///   - dripEmailLogs       — Map<queueId, [DripQueueEmailLog]>
///   - bounceRecordMap     — Map<leadId#queueId, DripLeadBounceRecord>
///   - throttleConfigMap   — Map<queueId, DripQueueThrottleConfig>
///   - extendedLeads       — Map<tenantId, Map<leadId, ExtendedLead>> (read-only for segmentation)
///   - transform           — the shared http transform query function
mixin (
  accessControlState : AccessControl.AccessControlState,
  dripQueues         : Map.Map<Text, T.DripQueue>,
  dripEmailLogs      : Map.Map<Text, List.List<T.DripQueueEmailLog>>,
  bounceRecordMap    : Map.Map<Text, T.DripLeadBounceRecord>,
  throttleConfigMap  : Map.Map<Text, T.DripQueueThrottleConfig>,
  extendedLeads      : Map.Map<Text, Map.Map<Text, CsvT.ExtendedLead>>,
  transform          : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ---- Internal helpers -------------------------------------------------------

  let dripCaffEmailEndpoint = "https://email.caffeine.ai/send";

  func dripAssertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  /// Naively derive a UTC-day bucket from canister time (nanoseconds).
  /// Returns nanoseconds for start-of-day (truncated to 86400s).
  func utcDayBucket(nowNs : Int) : Int {
    let dayNs : Int = 86_400_000_000_000;
    (nowNs / dayNs) * dayNs;
  };

  /// Build the JSON payload for the Caffeine email endpoint.
  func dripEmailPayload(
    queueId   : Text,
    recipient : Text,
    name      : Text,
    subject   : Text,
    body      : Text,
  ) : Text {
    "{\"type\":\"warm_sequence\","
    # "\"enrollmentId\":" # "\"" # queueId # "\","
    # "\"to\":" # "\"" # recipient # "\","
    # "\"recipientName\":" # "\"" # name # "\","
    # "\"subject\":" # "\"" # subject # "\","
    # "\"body\":" # "\"" # body # "\""
    # "}"
  };

  /// Fire the HTTP outcall to Caffeine email.
  /// Returns true on success, false on failure (never traps).
  func sendDripEmail(
    queueId   : Text,
    recipient : Text,
    name      : Text,
    subject   : Text,
    body      : Text,
  ) : async Bool {
    let headers : [Outcall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];
    let payload = dripEmailPayload(queueId, recipient, name, subject, body);
    try {
      let _r = await Outcall.httpPostRequest(dripCaffEmailEndpoint, headers, payload, transform);
      true
    } catch (_) {
      false
    };
  };

  /// Composite key for bounce record map: leadId # ":" # queueId
  func bounceKey(leadId : Text, queueId : Text) : Text {
    leadId # ":" # queueId
  };

  // ---- Public API — existing drip queue CRUD ----------------------------------

  /// Persist a new drip queue and return its id.
  public shared ({ caller }) func createDripQueue(queue : T.DripQueue) : async Text {
    dripAssertUser(caller);
    dripQueues.add(queue.id, queue);
    queue.id
  };

  /// List all drip queues for a tenant.
  public query ({ caller }) func getDripQueues(tenantId : Text) : async [T.DripQueue] {
    dripAssertUser(caller);
    let result = List.empty<T.DripQueue>();
    for ((_, q) in dripQueues.entries()) {
      if (q.tenantId == tenantId) { result.add(q) };
    };
    result.toArray()
  };

  /// Get a single drip queue by id.
  public query ({ caller }) func getDripQueue(queueId : Text) : async ?T.DripQueue {
    dripAssertUser(caller);
    dripQueues.get(queueId)
  };

  /// Update the status of a drip queue (pause / resume / cancel).
  public shared ({ caller }) func updateDripQueueStatus(queueId : Text, status : Text) : async Bool {
    dripAssertUser(caller);
    switch (dripQueues.get(queueId)) {
      case (null) { false };
      case (?q) {
        let now = Time.now();
        let updated : T.DripQueue = {
          q with
          status;
          updatedAt = now;
          pausedAt    = if (status == "paused")    ?now else q.pausedAt;
          cancelledAt = if (status == "cancelled") ?now else q.cancelledAt;
        };
        dripQueues.add(queueId, updated);
        true
      };
    }
  };

  /// Process one email step of a drip queue.
  ///
  /// Logic:
  ///   1. Return false if queue not found.
  ///   2. Return false if status is cancelled or paused.
  ///   3. Reset dailySentCount if we have crossed into a new UTC day.
  ///   4. Return false if dailySentCount >= dailySendCap (capped for today).
  ///   5. Return false if currentIndex >= contactEmails.size() — mark completed.
  ///   6. Send email via HTTP outcall to Caffeine email.
  ///   7. Log the attempt, increment counters, persist.
  ///   8. Return true if more contacts remain, false if now complete.
  public shared ({ caller }) func processDripQueueStep(queueId : Text) : async Bool {
    dripAssertUser(caller);
    let q = switch (dripQueues.get(queueId)) {
      case (null) { return false };
      case (?found) { found };
    };

    // Step 2 — check status
    if (q.status == "cancelled" or q.status == "paused" or q.status == "completed") {
      return false;
    };

    let now = Time.now();

    // Step 3 — reset daily counter if new UTC day
    let todayBucket = utcDayBucket(now);
    let (dailySent, resetAt) = if (utcDayBucket(q.dailyResetAt) < todayBucket) {
      (0, now)
    } else {
      (q.dailySentCount, q.dailyResetAt)
    };

    // Step 4 — daily cap (respect throttle config if present)
    let effectiveCap = switch (throttleConfigMap.get(queueId)) {
      case (?cfg) { cfg.dailyCap };
      case (null)  { q.dailySendCap };
    };
    if (dailySent >= effectiveCap) {
      if (resetAt != q.dailyResetAt) {
        dripQueues.add(queueId, { q with dailySentCount = 0; dailyResetAt = resetAt; updatedAt = now });
      };
      return false;
    };

    let totalContacts = q.contactEmails.size();

    // Step 5 — check if done
    if (q.currentIndex >= totalContacts) {
      dripQueues.add(queueId, {
        q with
        status      = "completed";
        completedAt = ?now;
        updatedAt   = now;
      });
      return false;
    };

    // Step 6 — send email
    let recipientEmail = q.contactEmails[q.currentIndex];
    let recipientName  = if (q.contactNames.size() > q.currentIndex) {
      q.contactNames[q.currentIndex]
    } else { "" };

    // Build a simple subject from the campaign name
    let subject = q.campaignTemplateName # " — " # recipientName;
    // Body can be customised; for now include the recipient name for personalisation
    let body = "Hi " # recipientName # ",\n\n" # q.campaignTemplateName;

    let success = await sendDripEmail(queueId, recipientEmail, recipientName, subject, body);

    // Step 7 — log the attempt
    let logId = "dlog-" # now.toText() # "-" # q.currentIndex.toText();
    let logEntry : T.DripQueueEmailLog = {
      id             = logId;
      queueId        = queueId;
      tenantId       = q.tenantId;
      recipientEmail = recipientEmail;
      recipientName  = recipientName;
      sentAt         = if (success) ?now else null;
      status         = if (success) "sent" else "failed";
      errorMessage   = if (success) null else ?"outcall failed";
      retryCount     = 0;
    };

    let logs = switch (dripEmailLogs.get(queueId)) {
      case (?existing) { existing };
      case (null) { List.empty<T.DripQueueEmailLog>() };
    };
    logs.add(logEntry);
    dripEmailLogs.add(queueId, logs);

    // Step 8 — update counters
    let newIndex    = q.currentIndex + 1;
    let newSent     = if (success) q.sentCount + 1     else q.sentCount;
    let newFailed   = if (success) q.failedCount       else q.failedCount + 1;
    let newDaily    = if (success) dailySent + 1       else dailySent;
    let isComplete  = newIndex >= totalContacts;

    let updated : T.DripQueue = {
      q with
      currentIndex   = newIndex;
      sentCount      = newSent;
      failedCount    = newFailed;
      dailySentCount = newDaily;
      dailyResetAt   = resetAt;
      status         = if (isComplete) "completed" else q.status;
      completedAt    = if (isComplete) ?now else q.completedAt;
      updatedAt      = now;
    };
    dripQueues.add(queueId, updated);

    not isComplete
  };

  /// Get all email log entries for a drip queue.
  public query ({ caller }) func getDripQueueLogs(queueId : Text) : async [T.DripQueueEmailLog] {
    dripAssertUser(caller);
    switch (dripEmailLogs.get(queueId)) {
      case (null) { [] };
      case (?logs) { logs.toArray() };
    }
  };

  /// Record an email send attempt (can be called externally by any authorised user).
  public shared ({ caller }) func logDripEmailSent(log : T.DripQueueEmailLog) : async () {
    dripAssertUser(caller);
    let logs = switch (dripEmailLogs.get(log.queueId)) {
      case (?existing) { existing };
      case (null) { List.empty<T.DripQueueEmailLog>() };
    };
    logs.add(log);
    dripEmailLogs.add(log.queueId, logs);
  };

  /// Reset the dailySentCount for a queue when a UTC day rolls over.
  public shared ({ caller }) func resetDripDailyCap(queueId : Text) : async () {
    dripAssertUser(caller);
    switch (dripQueues.get(queueId)) {
      case (null) {};
      case (?q) {
        let now = Time.now();
        dripQueues.add(queueId, {
          q with
          dailySentCount = 0;
          dailyResetAt   = now;
          updatedAt      = now;
        });
      };
    };
  };

  // ---- Bounce Tracking API ----------------------------------------------------

  /// Record a bounce event for a lead in a drip queue.
  /// Hard bounces automatically remove the email from contactEmails.
  public shared ({ caller }) func recordLeadBounce(
    leadId     : Text,
    queueId    : Text,
    bounceType : { #soft; #hard },
    reason     : ?Text,
  ) : async () {
    dripAssertUser(caller);
    let now = Time.now();
    let record : T.DripLeadBounceRecord = {
      leadId;
      queueId;
      bounceType;
      bouncedAt = now;
      reason;
      requeued  = false;
    };
    bounceRecordMap.add(bounceKey(leadId, queueId), record);

    // Hard bounce: remove email from contactEmails so it is never sent again
    switch (bounceType) {
      case (#hard) {
        switch (dripQueues.get(queueId)) {
          case (null) {};
          case (?q) {
            // Filter out the bounced leadId (treated as email address here)
            let filtered = q.contactEmails.filter(func(e : Text) : Bool {
              e != leadId
            });
            let filteredNames = if (q.contactNames.size() == 0) {
              q.contactNames
            } else {
              // Rebuild names array aligned with filtered emails
              let nameList = List.empty<Text>();
              for ((idx, email) in q.contactEmails.enumerate()) {
                if (email != leadId) {
                  if (idx < q.contactNames.size()) {
                    nameList.add(q.contactNames[idx]);
                  };
                };
              };
              nameList.toArray()
            };
            dripQueues.add(queueId, {
              q with
              contactEmails = filtered;
              contactNames  = filteredNames;
              updatedAt     = now;
            });
          };
        };
      };
      case (#soft) {};
    };
  };

  /// Get all bounce records for a drip queue.
  public query ({ caller }) func getBouncesByQueue(queueId : Text) : async [T.DripLeadBounceRecord] {
    dripAssertUser(caller);
    let result = List.empty<T.DripLeadBounceRecord>();
    for ((_, rec) in bounceRecordMap.entries()) {
      if (rec.queueId == queueId) { result.add(rec) };
    };
    result.toArray()
  };

  /// Requeue a soft-bounced lead — marks requeued=true and re-adds email to contactEmails.
  /// Only soft bounces can be requeued; hard bounces are permanent.
  public shared ({ caller }) func requeueBouncedLead(leadId : Text, queueId : Text) : async Bool {
    dripAssertUser(caller);
    let key = bounceKey(leadId, queueId);
    switch (bounceRecordMap.get(key)) {
      case (null) { false };
      case (?rec) {
        // Only allow requeue for soft bounces
        switch (rec.bounceType) {
          case (#hard) { false };
          case (#soft) {
            // Mark as requeued
            bounceRecordMap.add(key, { rec with requeued = true });
            // Re-add email to contactEmails if not already present
            switch (dripQueues.get(queueId)) {
              case (null) { false };
              case (?q) {
                let alreadyPresent = q.contactEmails.find(func(e : Text) : Bool { e == leadId });
                switch (alreadyPresent) {
                  case (?_) { true }; // already in list
                  case (null) {
                    let now = Time.now();
                    dripQueues.add(queueId, {
                      q with
                      contactEmails = q.contactEmails.concat([leadId]);
                      updatedAt     = now;
                    });
                    true
                  };
                };
              };
            };
          };
        };
      };
    }
  };

  // ---- Throttle Config API ----------------------------------------------------

  /// Store throttle/pacing configuration for a drip queue.
  public shared ({ caller }) func setQueueThrottleConfig(
    queueId : Text,
    config  : T.DripQueueThrottleConfig,
  ) : async () {
    dripAssertUser(caller);
    throttleConfigMap.add(queueId, config);
  };

  /// Get the throttle/pacing configuration for a drip queue.
  public query ({ caller }) func getQueueThrottleConfig(queueId : Text) : async ?T.DripQueueThrottleConfig {
    dripAssertUser(caller);
    throttleConfigMap.get(queueId)
  };

  // ---- Segmentation API -------------------------------------------------------

  /// Return ExtendedLead records matching the given segment criteria.
  /// Filters by tenantId, optional niche, optional tags (checked against notes field),
  /// and optional custom field filters (key-value pairs matched against lead notes/fields).
  public query ({ caller }) func getLeadsBySegment(
    tenantId           : Text,
    niche              : ?Text,
    tags               : [Text],
    customFieldFilters : [(Text, Text)],
  ) : async [CsvT.ExtendedLead] {
    dripAssertUser(caller);
    let tenantMap = switch (extendedLeads.get(tenantId)) {
      case (null) { return [] };
      case (?m)   { m };
    };
    let result = List.empty<CsvT.ExtendedLead>();
    for ((_, lead) in tenantMap.entries()) {
      // Niche filter
      let nicheMatch = switch (niche) {
        case (null)  { true };
        case (?n)    { lead.niche == n };
      };
      if (nicheMatch) {
        // Tags filter — each tag must appear in notes or niche
        var tagsMatch = true;
        for (tag in tags.values()) {
          let lower = tag.toLower();
          let inNotes = lead.notes.toLower().contains(#text lower);
          let inNiche = lead.niche.toLower().contains(#text lower);
          if (not inNotes and not inNiche) { tagsMatch := false };
        };
        if (tagsMatch) {
          // Custom field filters — match key against known ExtendedLead fields (simple notes search)
          var cfMatch = true;
          for ((k, v) in customFieldFilters.values()) {
            let searchStr = (k # ":" # v).toLower();
            let haystack  = lead.notes.toLower() # " " # lead.name.toLower();
            if (not haystack.contains(#text searchStr)) { cfMatch := false };
          };
          if (cfMatch) { result.add(lead) };
        };
      };
    };
    result.toArray()
  };

  /// Add a list of emails to a drip queue, deduplicating against existing contactEmails.
  public shared ({ caller }) func assignSegmentToQueue(
    queueId     : Text,
    leadEmails  : [Text],
  ) : async Bool {
    dripAssertUser(caller);
    switch (dripQueues.get(queueId)) {
      case (null) { false };
      case (?q) {
        let now = Time.now();
        // Build set of existing emails for O(n) dedup
        let existing = List.fromArray(q.contactEmails);
        var added = 0;
        for (email in leadEmails.values()) {
          let alreadyIn = existing.find(func(e : Text) : Bool { e == email });
          switch (alreadyIn) {
            case (?_) {};
            case (null) {
              existing.add(email);
              added += 1;
            };
          };
        };
        if (added > 0) {
          dripQueues.add(queueId, {
            q with
            contactEmails = existing.toArray();
            updatedAt     = now;
          });
        };
        true
      };
    }
  };

  // ---- Analytics API ----------------------------------------------------------

  /// Outreach overview for a tenant.
  /// Returns aggregate stats across all queues for that tenant.
  public query ({ caller }) func getOutreachOverview(tenantId : Text) : async {
    totalLeads         : Nat;
    activeQueues       : Nat;
    totalSentThisMonth : Nat;
    avgResponseRate    : Float;
    pendingBounces     : Nat;
  } {
    dripAssertUser(caller);

    var totalLeads         : Nat = 0;
    var activeQueues       : Nat = 0;
    var totalSentThisMonth : Nat = 0;
    var pendingBounces     : Nat = 0;

    for ((_, q) in dripQueues.entries()) {
      if (q.tenantId == tenantId) {
        totalLeads   += q.contactEmails.size();
        if (q.status == "running") { activeQueues += 1 };
        totalSentThisMonth += q.dailySentCount;
      };
    };

    // Count pending (unrequeued) soft bounces for this tenant
    for ((_, rec) in bounceRecordMap.entries()) {
      if (not rec.requeued) {
        switch (dripQueues.get(rec.queueId)) {
          case (?q) { if (q.tenantId == tenantId) { pendingBounces += 1 } };
          case (null) {};
        };
      };
    };

    // Simple response rate: responded leads / total sent (approximation using 5% baseline)
    let avgResponseRate : Float = if (totalSentThisMonth == 0) { 0.0 }
      else { 5.0 };  // Placeholder — real opens/clicks require webhook ingestion

    {
      totalLeads;
      activeQueues;
      totalSentThisMonth;
      avgResponseRate;
      pendingBounces;
    }
  };

  /// Per-queue performance stats for a tenant.
  public query ({ caller }) func getQueuePerformanceStats(tenantId : Text) : async [{
    queueId       : Text;
    name          : Text;
    niche         : Text;
    totalLeads    : Nat;
    sent          : Nat;
    bounced       : Nat;
    responded     : Nat;
    engagementPct : Float;
  }] {
    dripAssertUser(caller);

    let result = List.empty<{
      queueId       : Text;
      name          : Text;
      niche         : Text;
      totalLeads    : Nat;
      sent          : Nat;
      bounced       : Nat;
      responded     : Nat;
      engagementPct : Float;
    }>();

    for ((queueId, q) in dripQueues.entries()) {
      if (q.tenantId == tenantId) {
        // Count bounces for this queue
        var bounced : Nat = 0;
        for ((_, rec) in bounceRecordMap.entries()) {
          if (rec.queueId == queueId) { bounced += 1 };
        };

        let sent = q.sentCount;
        let responded : Nat = 0; // Requires webhook reply ingestion — defaulting to 0
        let engagementPct : Float = if (sent == 0) { 0.0 }
          else {
            let bouncedF : Float = bounced.toFloat();
            let sentF    : Float = sent.toFloat();
            let deliveredF = sentF - bouncedF;
            if (deliveredF <= 0.0) { 0.0 } else { (deliveredF / sentF) * 100.0 }
          };

        result.add({
          queueId;
          name          = q.name;
          niche         = q.niche;
          totalLeads    = q.contactEmails.size();
          sent;
          bounced;
          responded;
          engagementPct;
        });
      };
    };

    result.toArray()
  };

};
