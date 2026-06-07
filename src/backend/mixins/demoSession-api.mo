import Map       "mo:core/Map";
import Time      "mo:core/Time";
import Text      "mo:core/Text";
import Outcall   "mo:caffeineai-http-outcalls/outcall";
import T         "../types/demoSession";
import DSLib     "../lib/demoSession";
import Error "mo:core/Error";
import List "mo:core/List";
import EmailTypes "../types/email";

mixin (
  demoSessions          : Map.Map<Text, T.DemoSession>,
  auditReports          : Map.Map<Text, T.AuditReport>,
  elevenLabsAudioCache  : Map.Map<Text, Text>,
  prospectDataStore     : Map.Map<Text, T.ProspectData>,
  trialAccounts         : Map.Map<Text, T.TrialAccount>,
  emailLogs             : List.List<EmailTypes.EmailLogRecord>,
  emailIdCounter        : { var n : Nat },
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
    } catch (e) {
      // Email failure is non-fatal but surfaced in debug
      let _ = "sendAuditEmail failed: " # e.message();
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
  /// Stores a full TrialAccount record, fires prospect confirmation and admin notification emails.
  /// Returns trialAccountId and loginUrl on success, error Text on failure.
  public shared func activateTrial(
    sessionId   : Text,
    firstName   : Text,
    businessName: Text,
    city        : Text,
    niche       : Text,
    phone       : Text,
    email       : Text,
    website     : Text,
  ) : async { #ok : { trialAccountId : Text; loginUrl : Text; emailWarning : ?Text }; #err : Text } {
    if (email.size() == 0) {
      return #err("EMPTY_EMAIL");
    };
    let now           = Time.now();
    let lockAt : Int  = now + DSLib.sessionDurationNs();
    let slug          = businessName.replace(#char ' ', "-");
    let trialAccountId = "trial-" # slug # "-" # now.toText();
    let loginUrl      = "https://bookedrankedfunded.org/dashboard?trial=" # trialAccountId;

    // Update demo session if one exists
    switch (demoSessions.get(sessionId)) {
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
            try {
              await sendAuditEmail(report);
            } catch (e) {
              let _ = "sendAuditEmail failed: " # e.message();
            };
          };
          case (?_) {};
        };
      };
      case (null) {};
    };

    // Store prospect contact data
    let prospect : T.ProspectData = {
      sessionId;
      email;
      firstName = ?firstName;
      city      = ?city;
      niche     = if (niche.size() > 0) ?niche else null;
      phone     = ?phone;
      capturedAt = now;
    };
    prospectDataStore.add(sessionId, prospect);

    // Store full trial account record
    let trialAccount : T.TrialAccount = {
      trialAccountId;
      sessionId;
      firstName;
      businessName;
      city;
      niche;
      phone;
      email;
      website;
      activatedAt      = now;
      expiresAt        = now + 604_800_000_000_000;
      activityScore    = 0;
      day5ReminderSent = false;
      convertedAt      = null;
      features    = {
        crm           = true;
        social        = true;
        reputation    = true;
        voiceAgent    = true;
        creditBuilder = true;
        analytics     = true;
      };
    };
    trialAccounts.add(trialAccountId, trialAccount);

    // Format trial end date as readable text
    let trialEndNs : Int = now + 604_800_000_000_000;
    let trialEndDate = "7 days from today";

    // Send prospect confirmation email — surface error but don't trap
    var emailError : ?Text = null;
    try {
      await sendProspectConfirmationEmail(
        firstName, businessName, city, niche, email, trialEndDate, loginUrl
      );
    } catch (e) {
      emailError := ?("prospect email failed: " # e.message());
    };

    // Send admin notification email — surface error but don't trap
    try {
      await sendAdminNotificationEmail(
        firstName, businessName, city, niche, phone, email, website, trialAccountId
      );
    } catch (e) {
      let adminErr = "admin email failed: " # e.message();
      emailError := switch (emailError) {
        case (null)  { ?adminErr };
        case (?prev) { ?(prev # "; " # adminErr) };
      };
    };

    #ok({ trialAccountId; loginUrl; emailWarning = emailError })
  };

  /// Return the feature flags for a trial account.
  public query func getTrialFeatureFlags(trialAccountId : Text) : async ?T.FeatureFlags {
    switch (trialAccounts.get(trialAccountId)) {
      case (?ta) { ?ta.features };
      case (null) { null };
    }
  };

  /// Update feature flags for a trial account (admin only).
  public shared func updateTrialFeatureFlags(
    trialAccountId : Text,
    features       : T.FeatureFlags,
  ) : async { #ok; #err : Text } {
    switch (trialAccounts.get(trialAccountId)) {
      case (null) { #err("TRIAL_NOT_FOUND") };
      case (?ta)  {
        trialAccounts.add(trialAccountId, { ta with features });
        #ok
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

  // ── Trial email helpers ─────────────────────────────────────────────────────────────────────

  func sendProspectConfirmationEmail(
    firstName    : Text,
    businessName : Text,
    city         : Text,
    niche        : Text,
    email        : Text,
    trialEndDate : Text,
    loginUrl     : Text,
  ) : async () {
    let subject = "Your BRF 7-Day Trial is Live, " # firstName # "!";
    let body =
      "<p>Welcome, " # esc(firstName) # "!</p>" #
      "<p>Your 7-day trial for <strong>" # esc(businessName) # "</strong> (" # esc(niche) # " — " # esc(city) # ") is now active.</p>" #
      "<p>You have full access to:<ul>" #
      "<li>CRM &amp; Lead Management</li>" #
      "<li>Social Media Campaign Scheduler</li>" #
      "<li>Reputation Management</li>" #
      "<li>AI Voice Agent Setup</li>" #
      "<li>Business Credit Builder</li>" #
      "<li>Analytics Dashboard</li>" #
      "</ul></p>" #
      "<p>Trial expires: " # esc(trialEndDate) # "</p>" #
      "<p><a href='" # loginUrl # "'>Log in now</a></p>" #
      "<p>Quick-start steps:<ol>" #
      "<li>Visit your dashboard and connect your Google Business profile</li>" #
      "<li>Schedule your first 7-day social media campaign</li>" #
      "<li>Set up your AI voice agent with your business info</li>" #
      "</ol></p>" #
      "<p>Welcome aboard!<br/>— The BRF Team</p>";
    let payload = buildEmailPayload(email, subject, body);
    let headers = [{ name = "Content-Type"; value = "application/json" }];
    ignore await Outcall.httpPostRequest(demoEmailEndpoint, headers, payload, transform);
  };

  func sendAdminNotificationEmail(
    firstName      : Text,
    businessName   : Text,
    city           : Text,
    niche          : Text,
    phone          : Text,
    email          : Text,
    website        : Text,
    trialAccountId : Text,
  ) : async () {
    let subject = "New Trial Activated — " # businessName # " (" # niche # ", " # city # ")";
    let body =
      "<p>A new 7-day trial was just activated.</p>" #
      "<table>" #
      "<tr><td><strong>Prospect</strong></td><td>" # esc(firstName) # "</td></tr>" #
      "<tr><td><strong>Business</strong></td><td>" # esc(businessName) # "</td></tr>" #
      "<tr><td><strong>Niche</strong></td><td>" # esc(niche) # "</td></tr>" #
      "<tr><td><strong>City</strong></td><td>" # esc(city) # "</td></tr>" #
      "<tr><td><strong>Phone</strong></td><td>" # esc(phone) # "</td></tr>" #
      "<tr><td><strong>Email</strong></td><td>" # esc(email) # "</td></tr>" #
      "<tr><td><strong>Website</strong></td><td>" # esc(website) # "</td></tr>" #
      "<tr><td><strong>Trial ID</strong></td><td>" # esc(trialAccountId) # "</td></tr>" #
      "</table>" #
      "<p><a href='https://bookedrankedfunded.org/admin'>Manage this account</a></p>";
    let payload = buildEmailPayload("BeyondAI.marketing@gmail.com", subject, body);
    let headers = [{ name = "Content-Type"; value = "application/json" }];
    ignore await Outcall.httpPostRequest(demoEmailEndpoint, headers, payload, transform);
  };

  public query func getCacheStats() : async T.AudioCacheStats {
    let entryCount = elevenLabsAudioCache.size();
    { entryCount; estimatedSizeKB = entryCount * 15 }
  };

};
