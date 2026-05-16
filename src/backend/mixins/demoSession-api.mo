import Map       "mo:core/Map";
import Time      "mo:core/Time";
import Text      "mo:core/Text";
import Outcall   "mo:caffeineai-http-outcalls/outcall";
import T         "../types/demoSession";
import DSLib     "../lib/demoSession";

mixin (
  demoSessions          : Map.Map<Text, T.DemoSession>,
  auditReports          : Map.Map<Text, T.AuditReport>,
  elevenLabsAudioCache  : Map.Map<Text, Text>,
  prospectDataStore     : Map.Map<Text, T.ProspectData>,
  transform             : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  let demoEmailEndpoint = "https://email.caffeine.ai/send";

  // ── Internal email helper ──────────────────────────────────────────────────────────────────────

  func esc(s : Text) : Text {
    let s1 = s.replace(#text "\\\\", "\\\\\\\\");
    let s2 = s1.replace(#text "\"", "\\\"");
    let s3 = s2.replace(#text "\n", "\\n");
    s3.replace(#text "\r", "\\r")
  };

  func buildEmailPayload(to : Text, subject : Text, htmlBody : Text) : Text {
    "{"
    # "\"type\":\"audit_report\","
    # "\"to\":\"" # esc(to) # "\","
    # "\"from\":\"noreply@bookedrankedfunded.org\","
    # "\"subject\":\"" # esc(subject) # "\","
    # "\"html\":\"" # esc(htmlBody) # "\""
    # "}"
  };

  /// Send the audit report email via the Caffeine email service.
  /// Failures are non-fatal.
  func sendAuditEmail(report : T.AuditReport) : async () {
    let niceNiche = DSLib.nicheToText(DSLib.nicheFromText(report.niche));
    let subject   = "Your " # niceNiche # " Business Audit Report - " # report.businessName;
    let htmlBody  = DSLib.buildAuditEmailHtml(report);
    let payload   = buildEmailPayload(report.email, subject, htmlBody);
    let headers   = [{ name = "Content-Type"; value = "application/json" }];
    try {
      ignore await Outcall.httpPostRequest(demoEmailEndpoint, headers, payload, transform);
    } catch (_) {
      // Email failure is non-fatal
    };
  };

  // ── Demo session management ─────────────────────────────────────────────────────────────────

  /// Create a new demo session for a prospect.
  /// Accepts anonymous principals.
  public func createDemoSession(businessName : Text, niche : Text) : async Text {
    let now       = Time.now();
    let sessionId = DSLib.newSessionId(now, businessName);
    let session   = DSLib.newSession(sessionId, businessName, niche, now);
    demoSessions.add(sessionId, session);
    sessionId
  };

  /// Create a new demo session with optional city.
  public func createDemoSessionWithCity(businessName : Text, niche : Text, _city : ?Text) : async Text {
    let now       = Time.now();
    let sessionId = DSLib.newSessionId(now, businessName);
    let session   = DSLib.newSession(sessionId, businessName, niche, now);
    demoSessions.add(sessionId, session);
    sessionId
  };

  /// Advance the current step counter for a session.
  public func updateDemoStep(sessionId : Text, step : Nat) : async { #ok : T.DemoSession; #err : Text } {
    switch (demoSessions.get(sessionId)) {
      case (null)     { #err("Session not found: " # sessionId) };
      case (?session) {
        let updated : T.DemoSession = { session with step };
        demoSessions.add(sessionId, updated);
        #ok(updated)
      };
    }
  };

  /// Store the computed audit score against a session.
  public func saveDemoAuditScore(sessionId : Text, score : Nat) : async Bool {
    switch (demoSessions.get(sessionId)) {
      case (null)    { false };
      case (?session) {
        demoSessions.add(sessionId, { session with auditScore = score });
        true
      };
    }
  };

  /// Complete the demo: generate the audit report, store it, and email the prospect.
  public func completeDemo(sessionId : Text, prospectEmail : Text) : async { #ok : T.AuditReport; #err : Text } {
    switch (demoSessions.get(sessionId)) {
      case (null) { #err("Session not found: " # sessionId) };
      case (?session) {
        let now    = Time.now();
        let report = DSLib.generateAuditReport(session, prospectEmail, now);
        auditReports.add(sessionId, report);
        demoSessions.add(sessionId, { session with auditScore = report.overallScore });
        ignore sendAuditEmail(report);
        #ok(report)
      };
    }
  };

  /// Activate the 7-day trial (new endpoint with authenticated caller).
  public shared ({ caller }) func activateTrialForDemo(sessionId : Text, email : Text) : async { #ok : { trialEndsAt : Int }; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Unauthorized: anonymous principals cannot activate a trial");
    };
    let now    = Time.now();
    let lockAt : Int = now + DSLib.sessionDurationNs();
    switch (demoSessions.get(sessionId)) {
      case (null) { #err("Session not found: " # sessionId) };
      case (?session) {
        let updated : T.DemoSession = {
          session with
          trialActivatedAt      = ?now;
          socialContentLockedAt = ?lockAt;
        };
        demoSessions.add(sessionId, updated);
        switch (auditReports.get(sessionId)) {
          case (null) {
            let report = DSLib.generateAuditReport(updated, email, now);
            auditReports.add(sessionId, report);
            ignore sendAuditEmail(report);
          };
          case (?_) {};
        };
        #ok({ trialEndsAt = lockAt })
      };
    }
  };

  /// Activate the 7-day trial for demo prospects (accepts anonymous callers).
  /// Stores full prospect contact data in a separate map for CRM pickup.
  /// Returns #ok(session) on success, #err(message) on failure.
  public shared func activateTrial(
    sessionId  : Text,
    email      : Text,
    firstName  : ?Text,
    city       : ?Text,
    niche      : ?Text,
    phone      : ?Text,
  ) : async { #ok : T.DemoSession; #err : Text } {
    if (email.size() == 0) {
      return #err("EMPTY_EMAIL");
    };
    let now    = Time.now();
    let lockAt : Int = now + DSLib.sessionDurationNs();
    switch (demoSessions.get(sessionId)) {
      case (null) { #err("SESSION_NOT_FOUND") };
      case (?session) {
        // Return specific error if trial already activated
        switch (session.trialActivatedAt) {
          case (?_) { return #err("ALREADY_ACTIVATED") };
          case (null) {};
        };
        let updated : T.DemoSession = {
          session with
          trialActivatedAt      = ?now;
          socialContentLockedAt = ?lockAt;
        };
        demoSessions.add(sessionId, updated);
        // Store full prospect contact data in a dedicated map (preserves DemoSession schema)
        let nicheVal : ?Text = switch (niche) {
          case (?n) { if (n.size() > 0) ?n else null };
          case (null) { null };
        };
        let prospect : T.ProspectData = {
          sessionId;
          email;
          firstName;
          city;
          niche = nicheVal;
          phone;
          capturedAt = now;
        };
        prospectDataStore.add(sessionId, prospect);
        switch (auditReports.get(sessionId)) {
          case (null) {
            let report = DSLib.generateAuditReport(updated, email, now);
            auditReports.add(sessionId, report);
            ignore sendAuditEmail(report);
          };
          case (?_) {};
        };
        #ok(updated)
      };
    }
  };

  /// Retrieve a demo session by id.
  public query func getDemoSession(sessionId : Text) : async ?T.DemoSession {
    demoSessions.get(sessionId)
  };

  /// Check whether the demo session has expired.
  public query func isDemoSessionExpired(sessionId : Text) : async Bool {
    let now = Time.now();
    switch (demoSessions.get(sessionId)) {
      case (null)     { true };
      case (?session) { DSLib.isExpired(session, now) };
    }
  };

  /// Check whether social content generation is locked for this session.
  public query func shouldLockSocialContent(sessionId : Text) : async Bool {
    let now = Time.now();
    switch (demoSessions.get(sessionId)) {
      case (null)     { false };
      case (?session) { DSLib.shouldLockSocial(session, now) };
    }
  };

  /// Return the hardcoded niche voice script for a given niche id.
  public query func getNicheScript(niche : Text) : async ?T.NicheScript {
    DSLib.getScript(niche)
  };

  /// Return the niche script with businessName injected for a specific session.
  public query func getNicheScriptForSession(sessionId : Text) : async ?T.NicheScript {
    switch (demoSessions.get(sessionId)) {
      case (null) { null };
      case (?session) {
        switch (DSLib.getScript(session.niche)) {
          case (null)    { null };
          case (?script) { ?DSLib.injectBusinessName(script, session.businessName) };
        }
      };
    }
  };

  /// Lock social content generation for a session (called on day 7).
  public func lockSocialContent(sessionId : Text) : async Bool {
    let now = Time.now();
    switch (demoSessions.get(sessionId)) {
      case (null)    { false };
      case (?session) {
        demoSessions.add(sessionId, { session with socialContentLockedAt = ?now });
        true
      };
    }
  };

  /// Retrieve the audit report for a session.
  public query func getDemoAuditReport(sessionId : Text) : async { #ok : T.AuditReport; #err : Text } {
    switch (auditReports.get(sessionId)) {
      case (?report) { #ok(report) };
      case (null)    { #err("Audit report not found for session: " # sessionId) };
    }
  };

  /// Return all 10 niche scripts.
  public query func getAllNicheScripts() : async [T.NicheScript] {
    DSLib.getAllNicheScripts()
  };

  // ── Audio cache ───────────────────────────────────────────────────────────────────────────

  /// Cache a base64-encoded audio blob from ElevenLabs.
  public func saveDemoAudio(key : Text, base64Audio : Text) : async () {
    DSLib.evictAudioCacheIfNeeded(elevenLabsAudioCache);
    elevenLabsAudioCache.add(key, base64Audio);
  };

  /// Retrieve a previously cached demo audio blob.
  public query func getDemoAudio(key : Text) : async ?Text {
    elevenLabsAudioCache.get(key)
  };

  /// Return cache statistics for monitoring.
  public query func getCacheStats() : async T.AudioCacheStats {
    let entryCount = elevenLabsAudioCache.size();
    { entryCount; estimatedSizeKB = entryCount * 15 }
  };

};
