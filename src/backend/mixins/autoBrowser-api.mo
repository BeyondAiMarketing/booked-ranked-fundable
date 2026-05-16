import Map           "mo:core/Map";
import List          "mo:core/List";
import Time          "mo:core/Time";
import Runtime       "mo:core/Runtime";
import Text          "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import ABT           "../types/autoBrowser";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";
import ALT           "../types/aiLeadAudit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
  browserAuditCache  : Map.Map<Text, ABT.BrowserAuditResult>,
  leadAuditResults   : Map.Map<Text, ALT.LeadAuditResult>,
  leadAuditJobs      : Map.Map<Text, ALT.LeadAuditJob>,
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ── Access helpers ──────────────────────────────────────────────────────────

  func browserAssertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  func browserAssertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Credential helper ───────────────────────────────────────────────────────

  /// Normalise tenant ID to canonical "platform" key.
  func normTid(tenantId : Text) : Text {
    switch (tenantId) {
      case ("") "platform";
      case ("demo") "platform";
      case ("default") "platform";
      case ("app_owner") "platform";
      case ("admin") "platform";
      case ("platform") "platform";
      case (other) other;
    };
  };

  /// Resolve the auto-browser base URL from stable credential storage.
  /// Returns null if not configured for this tenant or platform.
  func getAutoBrowserUrl(tenantId : Text) : ?Text {
    let tid = normTid(tenantId);
    let lookupUrl = func(t : Text) : ?Text {
      switch (integrationCreds.get(t)) {
        case (null) { null };
        case (?enc) {
          let plain = ICLib.decryptAll(enc, credSalt);
          if (plain.autoBrowserUrl == "") null else ?plain.autoBrowserUrl
        };
      }
    };
    switch (lookupUrl(tid)) {
      case (?url) { ?url };
      case (null) {
        if (tid == "platform") null else lookupUrl("platform")
      };
    }
  };

  // ── Tenant isolation guard ──────────────────────────────────────────────────

  func checkTenantOwnership(cached : ABT.BrowserAuditResult, tenantId : Text) : Bool {
    cached.tenantId == tenantId
  };

  // ── Public API ──────────────────────────────────────────────────────────────

  /// Trigger the auto-browser agent to audit the given business.
  /// Calls POST {autoBrowserUrl}/audit with a JSON payload.
  /// Returns the remote audit job ID on success, or an error message.
  public shared ({ caller }) func triggerBrowserAudit(
    jobId        : Text,
    tenantId     : Text,
    businessName : Text,
    websiteUrl   : Text,
    niche        : Text,
    city         : Text,
  ) : async { #ok : Text; #err : Text } {
    browserAssertUser(caller);
    switch (getAutoBrowserUrl(tenantId)) {
      case (null) { return #err "auto-browser not configured" };
      case (?baseUrl) {
        let endpoint = baseUrl # "/audit";
        let payload = "{"
          # "\"jobId\":\"" # jobId # "\","
          # "\"tenantId\":\"" # tenantId # "\","
          # "\"businessName\":\"" # businessName # "\","
          # "\"websiteUrl\":\"" # websiteUrl # "\","
          # "\"niche\":\"" # niche # "\","
          # "\"city\":\"" # city # "\""
          # "}";
        try {
          let response = await Outcall.httpPostRequest(endpoint, [], payload, transform);
          if (response.size() > 0) {
            #ok response
          } else {
            #err "auto-browser returned empty response"
          }
        } catch (_) {
          #err "auto-browser request failed"
        }
      };
    }
  };

  /// Poll the auto-browser controller for the result of a previously triggered audit.
  /// Calls GET {autoBrowserUrl}/audit/{remoteJobId}.
  /// On success, parses and stores the result in browserAuditCache.
  public shared ({ caller }) func getBrowserAuditStatus(
    remoteJobId : Text,
    tenantId    : Text,
  ) : async { #ok : ABT.BrowserAuditResult; #err : Text } {
    browserAssertUser(caller);
    switch (getAutoBrowserUrl(tenantId)) {
      case (null) { return #err "auto-browser not configured" };
      case (?baseUrl) {
        let endpoint = baseUrl # "/audit/" # remoteJobId;
        try {
          let responseText = await Outcall.httpGetRequest(endpoint, [], transform);
          if (responseText.size() == 0) {
            return #err "auto-browser returned empty response";
          };
          // Construct a minimal BrowserAuditResult from the remote response.
          // The remote service is expected to return JSON; we store the raw
          // response verbatim as the first auditTrail note. A real integration
          // would parse the JSON — ICP does not have a built-in JSON parser.
          let now = Time.now();
          let entry : ABT.AuditTrailEntry = {
            action    = "polled";
            timestamp = now;
            actorId   = "system";
            notes     = responseText;
          };
          let result : ABT.BrowserAuditResult = {
            jobId               = remoteJobId;
            tenantId;
            businessName        = "";
            auditedAt           = now;
            websiteStatus       = "ok";
            websiteScore        = 0;
            websiteGaps         = [];
            websiteScreenshotUrl = "";
            gbpStatus           = "ok";
            gbpScore            = 0;
            gbpGaps             = [];
            gbpScreenshotUrl    = "";
            socialStatus        = "ok";
            socialScore         = 0;
            socialGaps          = [];
            socialScreenshotUrl = "";
            totalBrowserScore   = 0;
            gaps                = [];
            adminApproved       = false;
            approvedAt          = null;
            approvedBy          = null;
            auditTrail          = [entry];
          };
          browserAuditCache.add(remoteJobId, result);
          #ok result
        } catch (_) {
          #err "auto-browser poll failed"
        }
      };
    }
  };

  /// Persist a browser audit result directly into the stable cache (keyed by jobId).
  public shared ({ caller }) func saveBrowserAuditResult(result : ABT.BrowserAuditResult) : async () {
    browserAssertUser(caller);
    browserAuditCache.add(result.jobId, result);
  };

  /// Retrieve a cached browser audit result by jobId.
  public query ({ caller }) func getBrowserAuditResult(jobId : Text) : async ?ABT.BrowserAuditResult {
    browserAssertUser(caller);
    browserAuditCache.get(jobId)
  };

  /// Approve a browser audit result: sets adminApproved, records timestamp and actor,
  /// appends to auditTrail.
  public shared ({ caller }) func approveBrowserAudit(
    jobId      : Text,
    tenantId   : Text,
    actorName  : Text,
  ) : async { #ok; #err : Text } {
    browserAssertAdmin(caller);
    switch (browserAuditCache.get(jobId)) {
      case (null) {
        return #err ("Browser audit result not found for jobId: " # jobId)
      };
      case (?cached) {
        if (not checkTenantOwnership(cached, tenantId)) {
          return #err "Unauthorized: cannot approve another tenant's audit";
        };
        let now = Time.now();
        let entry : ABT.AuditTrailEntry = {
          action    = "approved";
          timestamp = now;
          actorId   = actorName;
          notes     = "Admin approved browser audit";
        };
        let updated : ABT.BrowserAuditResult = {
          cached with
          adminApproved = true;
          approvedAt    = ?now;
          approvedBy    = ?actorName;
          auditTrail    = cached.auditTrail.concat([entry]);
        };
        browserAuditCache.add(jobId, updated);

        // Update the lead audit job status to browser_approved
        switch (leadAuditJobs.get(jobId)) {
          case (null) {};
          case (?job) {
            leadAuditJobs.add(jobId, {
              job with
              status        = "browser_approved";
              stageProgress = "browser_approved";
              completedAt   = ?now;
            });
          };
        };

        #ok
      };
    }
  };

  /// Reject a browser audit result: marks it as rejected in the auditTrail.
  /// Does NOT push the lead to CRM.
  public shared ({ caller }) func rejectBrowserAudit(
    jobId      : Text,
    tenantId   : Text,
    actorName  : Text,
    reason     : Text,
  ) : async { #ok; #err : Text } {
    browserAssertAdmin(caller);
    switch (browserAuditCache.get(jobId)) {
      case (null) {
        return #err ("Browser audit result not found for jobId: " # jobId)
      };
      case (?cached) {
        if (not checkTenantOwnership(cached, tenantId)) {
          return #err "Unauthorized: cannot reject another tenant's audit";
        };
        let now = Time.now();
        let entry : ABT.AuditTrailEntry = {
          action    = "rejected";
          timestamp = now;
          actorId   = actorName;
          notes     = reason;
        };
        let updated : ABT.BrowserAuditResult = {
          cached with
          auditTrail = cached.auditTrail.concat([entry]);
        };
        browserAuditCache.add(jobId, updated);

        // Update the lead audit job status to browser_rejected
        switch (leadAuditJobs.get(jobId)) {
          case (null) {};
          case (?job) {
            leadAuditJobs.add(jobId, {
              job with
              status        = "browser_rejected";
              stageProgress = "browser_rejected";
              completedAt   = ?now;
            });
          };
        };

        #ok
      };
    }
  };

  /// Clear the cached browser audit result and re-trigger the audit.
  public shared ({ caller }) func requestReBrowserAudit(
    jobId      : Text,
    tenantId   : Text,
    actorName  : Text,
  ) : async { #ok : Text; #err : Text } {
    browserAssertUser(caller);
    // Remove stale cache entry first
    browserAuditCache.remove(jobId);

    // Look up original job metadata to reconstruct the trigger payload
    switch (leadAuditJobs.get(jobId)) {
      case (null) {
        return #err ("Lead audit job not found for jobId: " # jobId)
      };
      case (?job) {
        let websiteUrl   = job.websiteUrl;
        let businessName = job.businessName;
        let niche        = job.niche;
        let city         = switch (job.city) { case (?v) v; case null "" };

        switch (getAutoBrowserUrl(tenantId)) {
          case (null) { return #err "auto-browser not configured" };
          case (?baseUrl) {
            let endpoint = baseUrl # "/audit";
            let payload = "{"
              # "\"jobId\":\"" # jobId # "\","
              # "\"tenantId\":\"" # tenantId # "\","
              # "\"businessName\":\"" # businessName # "\","
              # "\"websiteUrl\":\"" # websiteUrl # "\","
              # "\"niche\":\"" # niche # "\","
              # "\"city\":\"" # city # "\","
              # "\"retriggeredBy\":\"" # actorName # "\""
              # "}";
            try {
              let response = await Outcall.httpPostRequest(endpoint, [], payload, transform);
              if (response.size() > 0) {
                // Reset the job status to browser_scanning
                let now = Time.now();
                leadAuditJobs.add(jobId, {
                  job with
                  status        = "browser_scanning";
                  stageProgress = "browser_scanning";
                  completedAt   = null;
                });
                #ok response
              } else {
                #err "auto-browser returned empty response on re-trigger"
              }
            } catch (_) {
              #err "auto-browser re-trigger failed"
            }
          };
        }
      };
    }
  };

  /// Merge the browser audit scores back into the AI lead audit result.
  /// Updates websiteScore, socialScore, engagementScore, and recalculates totalScore.
  public shared ({ caller }) func mergeBrowserScoresIntoAuditResult(
    jobId    : Text,
    tenantId : Text,
  ) : async { #ok; #err : Text } {
    browserAssertUser(caller);
    switch (browserAuditCache.get(jobId)) {
      case (null) {
        return #err ("Browser audit result not found for jobId: " # jobId)
      };
      case (?browser) {
        if (not checkTenantOwnership(browser, tenantId)) {
          return #err "Unauthorized: tenant mismatch in browser audit result";
        };
        switch (leadAuditResults.get(jobId)) {
          case (null) {
            return #err ("Lead audit result not found for jobId: " # jobId)
          };
          case (?lead) {
            // Weight the merged scores: browser takes 60%, original AI takes 40%
            let newWebsite    : Nat = (browser.websiteScore * 60 + lead.websiteScore * 40) / 100;
            let newSocial     : Nat = (browser.socialScore  * 60 + lead.socialScore  * 40) / 100;
            let newEngagement : Nat = (browser.gbpScore     * 60 + lead.engagementScore * 40) / 100;
            let newTotal      : Nat = (newWebsite + newSocial + newEngagement + lead.seoScore + lead.growthScore) / 5;
            let newCategory   : Text = if (newTotal >= 70) "Hot"
              else if (newTotal >= 40) "Warm"
              else "Cold";
            leadAuditResults.add(jobId, {
              lead with
              websiteScore    = newWebsite;
              socialScore     = newSocial;
              engagementScore = newEngagement;
              totalScore      = newTotal;
              category        = newCategory;
            });
            #ok
          };
        }
      };
    }
  };

  /// Return all browser audit results for a given tenant.
  public query ({ caller }) func getBrowserAuditResultsByTenant(tenantId : Text) : async [ABT.BrowserAuditResult] {
    browserAssertUser(caller);
    let out = List.empty<ABT.BrowserAuditResult>();
    for (result in browserAuditCache.values()) {
      if (result.tenantId == tenantId) { out.add(result) };
    };
    out.toArray()
  };

};
