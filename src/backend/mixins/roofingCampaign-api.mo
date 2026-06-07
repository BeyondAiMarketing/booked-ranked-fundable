import Map     "mo:core/Map";
import List    "mo:core/List";
import Time    "mo:core/Time";
import Text    "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import T       "../types/roofingCampaign";
import RC      "../lib/roofingCampaign";
import LRA     "../lib/localRankingAudit";
import ICTypes "../types/integrationCredentials";
import ICLib   "../lib/integrationCredentials";
import CsvTypes "../types/csvImport";
import ET "../types/emailTemplate";
import ETL "../lib/emailTemplates";

/// Roofing Campaign API mixin.
///
/// Injects:
///   - accessControlState    — caller auth
///   - openRouterState       — Owl Alpha AI calls
///   - integrationCreds      — to retrieve SerpApi key
///   - credSalt              — decryption salt
///   - roofingLeadStatuses   — email -> LeadCampaignStatus
///   - gridAuditResults      — email -> GridAuditResult
///   - gridAuditHistory      — email -> [GridAuditSnapshot]
///   - campaignCounters      — aggregate send/open/click counters
///   - transform             — HTTP outcall transform
mixin (
  accessControlState  : AccessControl.AccessControlState,
  integrationCreds    : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt            : Blob,
  roofingLeadStatuses : Map.Map<Text, T.LeadCampaignStatus>,
  gridAuditResults    : Map.Map<Text, T.GridAuditResult>,
  gridAuditHistory    : Map.Map<Text, List.List<T.GridAuditSnapshot>>,
  campaignCounters    : T.CampaignCounters,
  transform           : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  extendedLeads       : Map.Map<Text, Map.Map<Text, CsvTypes.ExtendedLead>>,
  emailTemplates      : Map.Map<Nat, ET.EmailTemplate>,
  templateInitialized : { var v : Bool },
  sendLogs            : Map.Map<Text, List.List<ET.SendLogEntry>>,
) {

  // ── Internal helpers ──────────────────────────────────────────────────────

  let RC_LLM_TENANT : Text = "platform";

  func rc_assertUser(caller : Principal) {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
  };

  func rc_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  func rc_getSerpApiKey() : ?Text {
    switch (integrationCreds.get(RC_LLM_TENANT)) {
      case (null) null;
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        if (plain.serpApiDevKey != "") ?plain.serpApiDevKey
        else if (plain.serpApiKey != "") ?plain.serpApiKey
        else null;
      };
    };
  };

  func rc_historyList(email : Text) : List.List<T.GridAuditSnapshot> {
    switch (gridAuditHistory.get(email)) {
      case (?l) l;
      case null {
        let l = List.empty<T.GridAuditSnapshot>();
        gridAuditHistory.add(email, l);
        l;
      };
    };
  };

  // ── template helpers ──────────────────────────────────────────────────────

  func rc_getTemplate(day : Nat) : ?ET.EmailTemplate {
    emailTemplates.get(day);
  };

  let rc_ctaLink : Text = "https://bookedrankedfunded.org";

  /// Send one email for a lead at the given step using the stored template.
  /// Returns true on success. Logs template version and fallback flag.
  func rc_sendTemplatedEmail(
    email  : Text,
    status : T.LeadCampaignStatus,
    day    : Nat,
    now    : Int,
  ) : async Bool {
    ETL.initTemplatesIfEmpty(emailTemplates, templateInitialized);
    switch (rc_getTemplate(day)) {
      case null false;
      case (?tmpl) {
        let auditOpt = gridAuditResults.get(email);
        let (subj, body, usedFallback) = ETL.mergeFillTemplate(tmpl, status, auditOpt, rc_ctaLink);
        let sent = await RC.sendMarketingEmail(
          email,
          status.companyName,
          subj,
          body,
          day,
          transform,
        );
        if (sent) {
          // Append to send log
          let logEntry : ET.SendLogEntry = {
            day;
            sentAt       = now;
            templateId   = tmpl.id;
            usedFallback;
          };
          let logs = switch (sendLogs.get(email)) {
            case (?l) l;
            case null {
              let l = List.empty<ET.SendLogEntry>();
              sendLogs.add(email, l);
              l;
            };
          };
          logs.add(logEntry);
        };
        sent;
      };
    };
  };

  // ── pacing / heartbeat processor ──────────────────────────────────────────

  /// Process the next pending send across all active leads.
  /// Called by the system heartbeat (every ~55 seconds).
  public func processNextRoofingCampaignSend() : async () {
    if (campaignCounters.paused) return;
    ETL.initTemplatesIfEmpty(emailTemplates, templateInitialized);
    let now = Time.now();

    for ((email, status) in roofingLeadStatuses.entries()) {
      if (status.status == #active and status.currentStep <= 7) {
        if (RC.isReadyToSend(status, now)) {
          let sent = await rc_sendTemplatedEmail(email, status, status.currentStep, now);
          if (sent) {
            let updated = RC.advanceStep(status, now);
            roofingLeadStatuses.add(email, updated);
            campaignCounters.totalSent    += 1;
            campaignCounters.sentToday    += 1;
            campaignCounters.sentThisWeek += 1;
            // Only process one send per heartbeat cycle to respect pacing
            return;
          };
        };
      };
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Enroll a single roofing lead in the 7-email campaign.
  /// Idempotent: skips if already enrolled and active/completed;
  /// resumes from last unsent step if paused.
  public shared ({ caller }) func enrollRoofingLead(
    lead : T.RoofingLead,
  ) : async { #ok; #err : Text } {
    rc_assertUser(caller);
    let email = lead.email.toLower().trim(#char ' ');
    switch (roofingLeadStatuses.get(email)) {
      case (?existing) {
        switch (existing.status) {
          case (#unsubscribed) {
            return #err "Lead has unsubscribed. Use reEnrollLead to force re-enroll.";
          };
          case (#active or #completed) {
            // Already enrolled and running or done — skip
            return #ok;
          };
          case (#paused) {
            // Resume from last position
            let resumed = { existing with status = #active };
            roofingLeadStatuses.add(email, resumed);
            return #ok;
          };
        };
      };
      case null {
        let status = RC.newLeadStatus(lead, Time.now());
        roofingLeadStatuses.add(email, status);
      };
    };
    #ok;
  };

  /// Return the campaign status for a specific lead.
  public query ({ caller }) func getRoofingCampaignStatus(
    email : Text,
  ) : async ?T.LeadCampaignStatus {
    rc_assertUser(caller);
    roofingLeadStatuses.get(email.toLower().trim(#char ' '));
  };

  /// Return all enrolled leads with their status.
  public query ({ caller }) func getAllEnrolledLeads() : async [T.LeadCampaignStatus] {
    rc_assertAdmin(caller);
    let result = List.empty<T.LeadCampaignStatus>();
    for ((_, s) in roofingLeadStatuses.entries()) { result.add(s) };
    result.toArray();
  };

  /// Return the most recent grid audit for a lead.
  public query ({ caller }) func getGridAudit(
    email : Text,
  ) : async ?T.GridAuditResult {
    rc_assertUser(caller);
    gridAuditResults.get(email.toLower().trim(#char ' '));
  };

  /// Return the full audit history for a lead.
  public query ({ caller }) func getGridHistory(
    email : Text,
  ) : async [T.GridAuditSnapshot] {
    rc_assertUser(caller);
    let normEmail = email.toLower().trim(#char ' ');
    switch (gridAuditHistory.get(normEmail)) {
      case (?l) l.toArray();
      case null [];
    };
  };

  /// Trigger a new grid audit for a lead.
  /// On success, if the lead is on Day 1 and has not yet been sent, fires the Day 1 email immediately.
  public shared ({ caller }) func triggerGridAudit(
    email : Text,
  ) : async { #ok : T.GridAuditResult; #err : Text } {
    rc_assertUser(caller);
    let normEmail = email.toLower().trim(#char ' ');
    switch (roofingLeadStatuses.get(normEmail)) {
      case null { return #err "Lead not found in campaign." };
      case (?status) {
        switch (rc_getSerpApiKey()) {
          case null { return #err "SerpApi key not configured. Add it in Go Live Dashboard." };
          case (?key) {
            let result = await LRA.runGridAudit(
              key,
              normEmail,
              status.companyName,
              status.city,
              status.state,
              status.businessType,
              transform,
            );
            let now = Time.now();
            // Save latest result and append to history
            gridAuditResults.add(normEmail, result);
            let hist = rc_historyList(normEmail);
            hist.add({ result; snapshotAt = now });
            // Auto-fire Day 1 email if lead hasn't received any email yet
            if (status.status == #active and status.currentStep == 1 and status.lastSentAt == null) {
              let sent = await rc_sendTemplatedEmail(normEmail, status, 1, now);
              if (sent) {
                let updated = RC.advanceStep(status, now);
                roofingLeadStatuses.add(normEmail, updated);
                campaignCounters.totalSent    += 1;
                campaignCounters.sentToday    += 1;
                campaignCounters.sentThisWeek += 1;
              };
            };
            #ok result;
          };
        };
      };
    };
  };

  /// Unsubscribe a lead from the campaign.
  public shared ({ caller }) func unsubscribeFromCampaign(
    email : Text,
  ) : async { #ok; #err : Text } {
    rc_assertUser(caller);
    let normEmail = email.toLower().trim(#char ' ');
    switch (roofingLeadStatuses.get(normEmail)) {
      case null { #err "Lead not found." };
      case (?s) {
        roofingLeadStatuses.add(normEmail, { s with status = #unsubscribed });
        #ok;
      };
    };
  };

  /// Force re-enroll a lead (admin only). Resets from step 1.
  public shared ({ caller }) func reEnrollLead(
    email : Text,
  ) : async { #ok; #err : Text } {
    rc_assertAdmin(caller);
    let normEmail = email.toLower().trim(#char ' ');
    switch (roofingLeadStatuses.get(normEmail)) {
      case null { #err "Lead not found." };
      case (?s) {
        let reset : T.LeadCampaignStatus = {
          s with
          currentStep  = 1;
          lastSentAt   = null;
          lastOpenedAt = null;
          enrolledAt   = Time.now();
          status       = #active;
        };
        roofingLeadStatuses.add(normEmail, reset);
        #ok;
      };
    };
  };

  /// Pause the entire roofing campaign (no new sends until resumed).
  public shared ({ caller }) func pauseRoofingCampaign() : async { #ok } {
    rc_assertAdmin(caller);
    campaignCounters.paused := true;
    #ok;
  };

  /// Resume the roofing campaign.
  public shared ({ caller }) func resumeRoofingCampaign() : async { #ok } {
    rc_assertAdmin(caller);
    campaignCounters.paused := false;
    #ok;
  };

  /// Return aggregate campaign statistics.
  public query ({ caller }) func getCampaignStats() : async T.CampaignStats {
    rc_assertAdmin(caller);
    RC.computeStats(roofingLeadStatuses, campaignCounters);
  };

  /// Bulk-enroll all CRM leads tagged as roofing (from extendedLeads).
  /// extendedLeads is the real per-tenant map injected from main.mo's CsvImport state.
  public shared ({ caller }) func enrollRoofingLeadsIntoCampaign() : async { enrolled : Nat; skipped : Nat } {
    rc_assertAdmin(caller);
    var enrolled : Nat = 0;
    var skipped  : Nat = 0;
    // Iterate all tenants and their extended leads
    for ((_, tenantLeads) in extendedLeads.entries()) {
      for ((_, lead) in tenantLeads.entries()) {
        if (lead.niche.toLower().contains(#text "roof")) {
          // Derive city/state from address field when present
          let addressText = switch (lead.address) { case (?a) a; case null "" };
          let parts = addressText.split(#char ',');
          var city  : Text = "";
          var state : Text = "";
          var partIdx : Nat = 0;
          for (p in parts) {
            if (partIdx == 1) { city  := p.trim(#char ' ') }
            else if (partIdx == 2) { state := p.trim(#char ' ') };
            partIdx += 1;
          };
          let websiteText = switch (lead.website) { case (?w) w; case null "" };
          let rl : T.RoofingLead = {
            email        = lead.email;
            companyName  = lead.name;
            city;
            state;
            phone        = if (lead.phone == "") null else ?lead.phone;
            website      = if (websiteText == "") null else ?websiteText;
            businessType = "roofing contractor";
          };
          let normEmail = rl.email.toLower().trim(#char ' ');
          if (normEmail != "") {
            switch (roofingLeadStatuses.get(normEmail)) {
              case (?existing) {
                switch (existing.status) {
                  case (#active or #completed) { skipped += 1 };
                  case _ {
                    let status = RC.newLeadStatus(rl, Time.now());
                    roofingLeadStatuses.add(normEmail, status);
                    enrolled += 1;
                  };
                };
              };
              case null {
                let status = RC.newLeadStatus(rl, Time.now());
                roofingLeadStatuses.add(normEmail, status);
                enrolled += 1;
              };
            };
          } else {
            skipped += 1;
          };
        } else {
          skipped += 1;
        };
      };
    };
    { enrolled; skipped };
  };

  // ── Template admin API ────────────────────────────────────────────────────

  /// Return all 7 email templates for admin display.
  public query ({ caller }) func getEmailTemplates() : async [ET.EmailTemplate] {
    rc_assertAdmin(caller);
    ETL.initTemplatesIfEmpty(emailTemplates, templateInitialized);
    let result = List.empty<ET.EmailTemplate>();
    for ((_, tmpl) in emailTemplates.entries()) { result.add(tmpl) };
    result.toArray();
  };

  /// Update a template's content (admin only). Preserves id, day, and updatedAt.
  public shared ({ caller }) func updateEmailTemplate(
    id             : Nat,
    subject        : Text,
    body           : Text,
    fallbackSubject : Text,
    fallbackBody   : Text,
  ) : async { #ok; #err : Text } {
    rc_assertAdmin(caller);
    switch (emailTemplates.get(id)) {
      case null { #err "Template not found" };
      case (?tmpl) {
        emailTemplates.add(id, { tmpl with subject; body; fallbackSubject; fallbackBody; updatedAt = Time.now() });
        #ok;
      };
    };
  };

  /// Return detailed campaign info for all enrolled leads.
  public query ({ caller }) func getAllLeadCampaignDetails() : async [T.LeadCampaignDetails] {
    rc_assertAdmin(caller);
    let result = List.empty<T.LeadCampaignDetails>();
    for ((normEmail, status) in roofingLeadStatuses.entries()) {
      let (auditScore, deadZones, topComp, missing) =
        switch (gridAuditResults.get(normEmail)) {
          case null   { (null, null, null, null) };
          case (?r) {
            var visible : Nat = 0;
            var topC    : Text = "";
            for (gp in r.gridPoints.vals()) {
              if (gp.rankPosition > 0) { visible += 1 };
              if (topC == "" and gp.rankPosition > 0 and gp.competitorAtTop != r.businessName) {
                topC := gp.competitorAtTop;
              };
            };
            let dz    = 9 - visible;
            let score = (visible * 100) / 9;
            let miss  : Text = if (dz > 5) "extended service area coverage, review volume"
                               else if (dz > 2) "broader local citations, review consistency"
                               else "minor citation gaps";
            (?score, ?dz, ?(if (topC == "") "a local competitor" else topC), ?miss);
          };
        };
      let (tmplVersion, fallbackFlag) =
        switch (sendLogs.get(normEmail)) {
          case null   { (null, null) };
          case (?logs) {
            let arr = logs.toArray();
            if (arr.size() == 0) { (null, null) }
            else {
              let last = arr[arr.size() - 1];
              (?last.templateId, ?last.usedFallback);
            };
          };
        };
      result.add({
        auditScore          = auditScore;
        deadZones           = deadZones;
        topCompetitor       = topComp;
        missingServices     = missing;
        currentEmailDay     = status.currentStep;
        lastSentAt          = status.lastSentAt;
        templateVersionUsed = tmplVersion;
        usedFallback        = fallbackFlag;
      });
    };
    result.toArray();
  };

  /// Return detailed campaign info for a lead (audit score, dead zones, top competitor,
  /// missing services, current email day, last sent timestamp, template version, fallback flag).
  public query ({ caller }) func getLeadCampaignDetails(
    email : Text,
  ) : async ?T.LeadCampaignDetails {
    rc_assertUser(caller);
    let normEmail = email.toLower().trim(#char ' ');
    switch (roofingLeadStatuses.get(normEmail)) {
      case null null;
      case (?status) {
        // Derive audit-based fields
        let (auditScore, deadZones, topComp, missing) =
          switch (gridAuditResults.get(normEmail)) {
            case null   { (null, null, null, null) };
            case (?r) {
              var visible : Nat = 0;
              var topC    : Text = "";
              for (gp in r.gridPoints.vals()) {
                if (gp.rankPosition > 0) { visible += 1 };
                if (topC == "" and gp.rankPosition > 0 and gp.competitorAtTop != r.businessName) {
                  topC := gp.competitorAtTop;
                };
              };
              let dz    = 9 - visible;
              let score = (visible * 100) / 9;
              let miss  : Text = if (dz > 5) "extended service area coverage, review volume"
                                 else if (dz > 2) "broader local citations, review consistency"
                                 else "minor citation gaps";
              (?score, ?dz, ?(if (topC == "") "a local competitor" else topC), ?miss);
            };
          };
        // Last send log entry
        let (tmplVersion, fallbackFlag) =
          switch (sendLogs.get(normEmail)) {
            case null   { (null, null) };
            case (?logs) {
              let arr = logs.toArray();
              if (arr.size() == 0) { (null, null) }
              else {
                let last = arr[arr.size() - 1];
                (?last.templateId, ?last.usedFallback);
              };
            };
          };
        ?{
          auditScore          = auditScore;
          deadZones           = deadZones;
          topCompetitor       = topComp;
          missingServices     = missing;
          currentEmailDay     = status.currentStep;
          lastSentAt          = status.lastSentAt;
          templateVersionUsed = tmplVersion;
          usedFallback        = fallbackFlag;
        };
      };
    };
  };

  /// Mark a lead's open event (called by email tracking webhook).
  public shared func markRoofingEmailOpened(email : Text) : async () {
    let normEmail = email.toLower().trim(#char ' ');
    switch (roofingLeadStatuses.get(normEmail)) {
      case null ();
      case (?s) {
        let updated = RC.markOpened(s, Time.now());
        roofingLeadStatuses.add(normEmail, updated);
        campaignCounters.totalOpens += 1;
      };
    };
  };

};
