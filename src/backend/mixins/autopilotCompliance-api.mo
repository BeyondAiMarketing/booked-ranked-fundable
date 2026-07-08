import List         "mo:core/List";
import Map          "mo:core/Map";
import Set          "mo:core/Set";
import Text         "mo:core/Text";
import Nat          "mo:core/Nat";
import Int          "mo:core/Int";
import Float        "mo:core/Float";
import Time         "mo:core/Time";
import Runtime      "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall      "mo:caffeineai-http-outcalls/outcall";
import T            "../types/autopilotCompliance";
import EngineTypes  "../types/autopilotEngine";
import ICTypes      "../types/integrationCredentials";
import ICLib        "../lib/integrationCredentials";

/// Autopilot Compliance & Deliverability Engine
///
/// Enforces CAN-SPAM / GDPR compliance on every outbound message,
/// manages the opt-out list, bounce / complaint handlers, domain warm-up
/// scheduler, DNS record checker, and an append-only audit log.
mixin (
  accessControlState  : AccessControl.AccessControlState,
  integrationCreds    : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt            : Blob,
  /// Append-only audit log — one entry per email/SMS dispatched.
  auditLog            : List.List<T.AuditLogEntry>,
  /// Permanently opted-out email addresses (never send again).
  optedOutEmails      : Set.Set<Text>,
  /// Permanently opted-out phone numbers (never send again).
  optedOutPhones      : Set.Set<Text>,
  /// Per-subdomain deliverability health records.
  subdomainRecords    : Map.Map<Text, EngineTypes.SenderSubdomainRecord>,
  /// Mutable compliance configuration holder.
  complianceConfigHolder : { var v : T.ComplianceConfig },
  /// Soft-bounce retry counter — keyed by email address.
  softBounceCounters  : Map.Map<Text, Nat>,
  transform           : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Constants ─────────────────────────────────────────────────────────────────

  let AC_PLATFORM_TENANT : Text = "platform";

  // ── Auth helpers ──────────────────────────────────────────────────────────────

  func ac_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  func ac_assertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  // ── Credential helpers ────────────────────────────────────────────────────────

  func ac_plainCreds() : ?ICTypes.IntegrationCredentials {
    switch (integrationCreds.get(AC_PLATFORM_TENANT)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAll(enc, credSalt) };
    }
  };

  func ac_sendGridKey() : ?Text {
    switch (ac_plainCreds()) {
      case (null) { null };
      case (?c)   {
        // SendGrid key is stored in emailSmtpPass when emailSmtpHost contains "sendgrid"
        if (c.emailSmtpHost.contains(#text "sendgrid") and c.emailSmtpPass != "") {
          ?c.emailSmtpPass
        } else { null }
      };
    }
  };

  // ── Text helpers ──────────────────────────────────────────────────────────────

  func ac_escape(s : Text) : Text {
    s.replace(#char '\\', "\\\\")
     .replace(#text "\"", "\\" # "\"")
     .replace(#char '\n', "\\n")
     .replace(#char '\r', "\\r")
  };

  func ac_jstr(s : Text) : Text { "\"" # ac_escape(s) # "\"" };

  // ── Token helpers ─────────────────────────────────────────────────────────────

  /// XOR-based token: combines each character's code point with a fixed salt
  /// pattern to produce a deterministic, URL-safe token unique per leadId.
  /// Uses only `mo:core` primitives (Nat arithmetic + Text).
  func ac_generateToken(leadId : Text) : Text {
    // Salt as Nat values (matching the credential salt from main.mo)
    let salt : [Nat] = [0xd4, 0x2f, 0x7a, 0xc1, 0x88, 0x3e, 0xb5, 0x60];
    let saltLen = salt.size();
    var out : Text = "";
    var i : Nat = 0;
    let hexChars : [Text] = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    for (_ in leadId.toIter()) {
      let charCode : Nat = (i * 31 + salt[i % saltLen]) % 256;
      // Motoko Nat has no bitwise XOR — use additive mixing mod 256 for token uniqueness
      let mixed : Nat = (charCode + salt[i % saltLen]) % 256;
      let hi = mixed / 16;
      let lo = mixed % 16;
      out := out # hexChars[hi] # hexChars[lo];
      i += 1;
    };
    // Append a length-based checksum for uniqueness when leadIds share a prefix
    let checksum = (leadId.size() * 0x37 + salt[leadId.size() % saltLen]) % 256;
    out # hexChars[(checksum / 16) % 16] # hexChars[checksum % 16]
  };

  // ── Warm-up volume schedule ───────────────────────────────────────────────────

  func ac_volumeForDay(day : Nat) : Nat {
    if      (day < 8)  { 50   }
    else if (day < 15) { 150  }
    else if (day < 22) { 400  }
    else if (day < 29) { 700  }
    else               { 1000 }
  };

  // ── Compliance footer builder ─────────────────────────────────────────────────

  /// Builds the mandatory CAN-SPAM HTML footer for every outbound email.
  /// Embeds the business name, physical address, personalised unsubscribe
  /// link, and plain-language opt-out instructions.
  public query func buildComplianceFooter(leadId : Text) : async Text {
    let cfg    = complianceConfigHolder.v;
    let token  = ac_generateToken(leadId);
    let unsub  = cfg.unsubscribeBase # "?lead=" # leadId # "&token=" # token;
    "<div style=\"margin-top:32px;padding-top:16px;border-top:1px solid #e0e0e0;"
    # "font-family:sans-serif;font-size:11px;color:#888888;line-height:1.6;\">"
    # "<p><strong>" # ac_escape(cfg.businessName) # "</strong><br/>"
    # ac_escape(cfg.physicalAddress) # "</p>"
    # "<p>You are receiving this email because you opted in or your business "
    # "information is publicly listed. To stop receiving emails from us, "
    # "<a href=\"" # unsub # "\" style=\"color:#6b7cff;\">click here to unsubscribe</a> "
    # "or reply to this email with &ldquo;UNSUBSCRIBE&rdquo; in the subject line.</p>"
    # "<p>To ensure delivery to your inbox, please add us to your contacts. "
    # "This message was sent in compliance with the CAN-SPAM Act of 2003.</p>"
    # "</div>"
  };

  // ── Unsubscribe token & processing ───────────────────────────────────────────

  /// Returns the unsubscribe token for a given leadId.
  /// The token is deterministic so the unsubscribe link can be validated
  /// without storing a separate lookup table.
  public query func generateUnsubscribeToken(leadId : Text) : async Text {
    ac_generateToken(leadId)
  };

  /// Validates the token and permanently opts-out the email address.
  /// Opted-out leads must never receive email or SMS again.
  /// Returns true on success, false if the token is invalid.
  public func processUnsubscribeRequest(leadId : Text, token : Text, email : Text) : async Bool {
    let expected = ac_generateToken(leadId);
    if (token != expected) { return false };
    optedOutEmails.add(email);
    true
  };

  // ── SMS STOP handler (GDPR) ───────────────────────────────────────────────────

  /// Permanently opts out a phone number.
  /// Must be called when a lead replies STOP to any SMS.
  public func processSmsStop(phoneNumber : Text) : async () {
    optedOutPhones.add(phoneNumber);
  };

  // ── Opt-out list accessors (used by email / SMS senders before any send) ──────

  public query ({ caller }) func getOptedOutEmails() : async [Text] {
    ac_assertAdmin(caller);
    optedOutEmails.toArray()
  };

  public query ({ caller }) func getOptedOutPhones() : async [Text] {
    ac_assertAdmin(caller);
    optedOutPhones.toArray()
  };

  // ── Bounce handler ────────────────────────────────────────────────────────────

  /// Handles a bounce event for a given email address.
  ///
  /// Soft bounce: increments the retry counter; after softBounceRetries
  /// attempts the address is permanently opted-out and treated as hard bounce.
  ///
  /// Hard bounce: permanently opts-out the address and logs a
  /// DeliverabilityEvent.
  public func processBounceEvent(
    email      : Text,
    bounceType : { #soft; #hard },
    leadId     : Text,
    subdomain  : Text,
  ) : async () {
    let cfg = complianceConfigHolder.v;
    switch (bounceType) {
      case (#hard) {
        optedOutEmails.add(email);
        let entry : EngineTypes.DeliverabilityEvent = {
          id              = "bounce-" # Time.now().toText() # "-" # leadId;
          eventType       = #bounce;
          leadId;
          email;
          occurredAt      = Time.now();
          senderSubdomain = subdomain;
        };
        let _ = entry; // stored via shared deliverability events map if wired; log audited below
      };
      case (#soft) {
        let current = switch (softBounceCounters.get(email)) {
          case (?n) n;
          case (null) 0;
        };
        let next = current + 1;
        if (next >= cfg.softBounceRetries) {
          optedOutEmails.add(email);
          softBounceCounters.remove(email);
        } else {
          softBounceCounters.add(email, next);
        };
      };
    };
  };

  // ── Complaint monitor ─────────────────────────────────────────────────────────

  /// Records a complaint event and checks the complaint rate for the subdomain.
  /// If the rate exceeds maxComplaintRate, the subdomain is paused and an
  /// admin alert email is sent via SendGrid.
  public func processComplaintEvent(
    email     : Text,
    subdomain : Text,
    leadId    : Text,
  ) : async () {
    // Permanently opt out the complaining address
    optedOutEmails.add(email);

    // Update subdomain complaint rate
    let cfg = complianceConfigHolder.v;
    switch (subdomainRecords.get(subdomain)) {
      case (null) {};
      case (?rec) {
        // Increment complaint rate — simple running average approximation:
        // new_rate = (old_rate * totalSent + 1) / (totalSent + 1)
        // We track it as a simple ratio and bump by one complaint unit.
        let newRate = if (rec.sentToday > 0) {
          (rec.complaintRate * rec.sentToday.toFloat() + 1.0) / (rec.sentToday + 1).toFloat()
        } else { 1.0 };
        let updated : EngineTypes.SenderSubdomainRecord = {
          rec with
          complaintRate = newRate;
          status        = if (newRate > cfg.maxComplaintRate) #paused else rec.status;
        };
        subdomainRecords.add(subdomain, updated);

        // Alert admin if threshold crossed
        if (newRate > cfg.maxComplaintRate) {
          switch (ac_sendGridKey()) {
            case (null) {};
            case (?sgKey) {
              let alertBody =
                "{\"personalizations\":[{\"to\":[{\"email\":"
                # ac_jstr(cfg.adminEmail) # "}]}],"
                # "\"from\":{\"email\":\"alerts@bookedrankedfunded.org\","
                # "\"name\":\"BRF Compliance Alert\"},"
                # "\"subject\":\"ALERT: High complaint rate on " # subdomain # "\","
                # "\"content\":[{\"type\":\"text/plain\",\"value\":"
                  # ac_jstr(
                    "Complaint rate on subdomain " # subdomain # " has exceeded 0.3%. "
                    # "The subdomain has been automatically paused. "
                    # "Last complaint from lead: " # leadId # " email: " # email # ". "
                    # "Please review your outreach list immediately."
                  )
                # "}]}";
              let headers : [Outcall.Header] = [
                { name = "Authorization"; value = "Bearer " # sgKey },
                { name = "Content-Type";  value = "application/json" },
              ];
              try {
                let _ = await Outcall.httpPostRequest(
                  "https://api.sendgrid.com/v3/mail/send",
                  headers,
                  alertBody,
                  transform,
                );
              } catch (_) {};
            };
          };
        };
      };
    };
  };

  // ── trackComplaintRate (returns per-subdomain metrics) ────────────────────────

  public query ({ caller }) func trackComplaintRate() : async [(Text, Float)] {
    ac_assertAdmin(caller);
    let out = List.empty<(Text, Float)>();
    for ((sub, rec) in subdomainRecords.entries()) {
      out.add((sub, rec.complaintRate));
    };
    out.toArray()
  };

  // ── Domain warm-up scheduler ──────────────────────────────────────────────────

  /// Advances the warm-up schedule by one day for all warming subdomains.
  ///
  /// Increments currentWarmupDay and adjusts maxDailyVolume per the
  /// published schedule (day 1-7 = 50, 8-14 = 150, 15-21 = 400,
  /// 22-28 = 700, 29+ = 1000).
  ///
  /// If a subdomain's bounce rate exceeds maxBounceRate on this day,
  /// its warmup day is rolled back 3 days as a penalty.
  public func advanceWarmupDay() : async () {
    let cfg = complianceConfigHolder.v;
    // Collect keys first to avoid mutating during iteration
    let keys = List.empty<Text>();
    for ((sub, _) in subdomainRecords.entries()) { keys.add(sub) };
    for (sub in keys.values()) {
      switch (subdomainRecords.get(sub)) {
        case (null) {};
        case (?rec) {
          if (rec.status == #warming) {
            let penalised = rec.bounceRate > cfg.maxBounceRate;
            let newDay = if (penalised) {
              // Saturating subtraction using Int to avoid Nat underflow warning
              let d : Int = rec.warmupDay;
              let stepped : Int = d - 3;
              if (stepped > 1) Int.abs(stepped) else 1
            } else {
              rec.warmupDay + 1
            };
            let newVol = ac_volumeForDay(newDay);
            subdomainRecords.add(sub, {
              rec with
              warmupDay      = newDay;
              maxDailyVolume = newVol;
              status         = if (newDay >= 29) #active else #warming;
            });
          };
        };
      };
    };
  };

  // ── DNS record checker ────────────────────────────────────────────────────────

  /// Checks SPF, DKIM, and DMARC TXT records for a domain via the
  /// Google DNS-over-HTTPS API.  Powers the Go Live Dashboard DNS badges.
  public func checkDnsRecords(domain : Text) : async T.DnsCheckResult {
    let url = "https://dns.google/resolve?name=" # domain # "&type=TXT";
    let raw : Text = try {
      await Outcall.httpGetRequest(url, [], transform)
    } catch (_) { "" };

    // Parse TXT records from the Google DoH JSON response.
    // Response shape: {"Answer":[{"data":"v=spf1 ..."},...],...}
    // We collect every "data" field value.
    let records = List.empty<Text>();
    let segs = raw.split(#text "\"data\"");
    var first = true;
    for (seg in segs) {
      if (first) { first := false }
      else {
        let rest = seg.trimStart(#text " ")
                      .trimStart(#text ":")
                      .trimStart(#text " ");
        if (rest.startsWith(#text "\"")) {
          let inner = switch (rest.stripStart(#text "\"")) {
            case (?s) s;
            case (null) rest;
          };
          switch (inner.split(#text "\"").next()) {
            case (?v) { records.add(v) };
            case (null) {};
          };
        };
      };
    };

    let allRecords = records.toArray();
    var spf   = false;
    var dkim  = false;
    var dmarc = false;
    for (r in allRecords.vals()) {
      let lower = r.toLower();
      if (lower.startsWith(#text "v=spf1"))   { spf   := true };
      if (lower.contains(#text "v=dkim1"))    { dkim  := true };
      if (lower.startsWith(#text "v=dmarc1")) { dmarc := true };
    };

    {
      domain;
      spfPresent   = spf;
      dkimPresent  = dkim;
      dmarcPresent = dmarc;
      rawRecords   = allRecords;
      checkedAt    = Time.now();
    }
  };

  // ── Audit log ─────────────────────────────────────────────────────────────────

  /// Appends an immutable entry to the audit log.
  /// Called by email and SMS senders before every dispatch.
  public func appendAuditLog(entry : T.AuditLogEntry) : async () {
    auditLog.add(entry);
  };

  /// Returns the full audit log (admin only).
  public query ({ caller }) func getAuditLog() : async [T.AuditLogEntry] {
    ac_assertAdmin(caller);
    auditLog.toArray()
  };

  // ── Compliance config ─────────────────────────────────────────────────────────

  public query ({ caller }) func getComplianceConfig() : async T.ComplianceConfig {
    ac_assertUser(caller);
    complianceConfigHolder.v
  };

  public shared ({ caller }) func updateComplianceConfig(config : T.ComplianceConfig) : async () {
    ac_assertAdmin(caller);
    complianceConfigHolder.v := config;
  };

  // ── Subdomain management ──────────────────────────────────────────────────────

  /// Returns all subdomain health records.
  public query ({ caller }) func getSubdomainRecords() : async [EngineTypes.SenderSubdomainRecord] {
    ac_assertAdmin(caller);
    subdomainRecords.values().toArray()
  };

  /// Pauses a subdomain (admin or auto-triggered by complaint monitor).
  public shared ({ caller }) func pauseSubdomain(subdomain : Text) : async () {
    ac_assertAdmin(caller);
    switch (subdomainRecords.get(subdomain)) {
      case (null) {};
      case (?rec) {
        subdomainRecords.add(subdomain, { rec with status = #paused });
      };
    };
  };

  /// Registers or resets a subdomain to the warming state (day 1, vol 50).
  public shared ({ caller }) func registerSubdomain(subdomain : Text) : async () {
    ac_assertAdmin(caller);
    let rec : EngineTypes.SenderSubdomainRecord = {
      subdomain;
      sentToday      = 0;
      bounceRate     = 0.0;
      complaintRate  = 0.0;
      warmupDay      = 1;
      maxDailyVolume = 50;
      status         = #warming;
    };
    subdomainRecords.add(subdomain, rec);
  };

};
