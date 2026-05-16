import Map           "mo:core/Map";
import List          "mo:core/List";
import Set           "mo:core/Set";
import Time          "mo:core/Time";
import Runtime       "mo:core/Runtime";
import Text          "mo:core/Text";
import Int           "mo:core/Int";
import AccessControl "mo:caffeineai-authorization/access-control";
import T             "../types/aiLeadAudit";
import BKTypes       "../types/brandKit";
import ET            "../types/email";

mixin (
  accessControlState   : AccessControl.AccessControlState,
  leadAuditJobs        : Map.Map<Text, T.LeadAuditJob>,
  leadAuditResults     : Map.Map<Text, T.LeadAuditResult>,
  batchAuditJobs       : Map.Map<Text, T.BatchAuditJob>,
  dualModelSearchJobs  : Map.Map<Text, T.DualModelSearchJob>,
  leads                : Map.Map<Text, Map.Map<Text, {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  }>>,
  brandKitProspects    : Map.Map<Text, BKTypes.BrandKitProspect>,
  _brandKitOutreachJobs : Map.Map<Text, BKTypes.BrandKitOutreachJob>,
  _warmSchedules       : List.List<ET.WarmSequenceEmailSchedule>,
  _warmEvents          : List.List<ET.WarmSequenceEmailEvent>,
  _emailIdCounter      : { var n : Nat },
) {

  // ── Access helpers ──────────────────────────────────────────────────────────

  func assertUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
  };

  // ── Internal CRM helper ─────────────────────────────────────────────────────

  type AILead = {
    id : Text; tenantId : Text; name : Text; email : Text;
    phone : Text; niche : Text; status : Text; source : Text;
    notes : Text; agentSubscriptions : [Text]; createdAt : Time.Time;
  };

  func aiCreateLeadInternal(lead : AILead) {
    let tenantLeads = switch (leads.get(lead.tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, AILead>() };
    };
    tenantLeads.add(lead.id, lead);
    leads.add(lead.tenantId, tenantLeads);
  };

  // ── Inline BrandKit helpers ─────────────────────────────────────────────────

  /// Produce a URL-safe slug matching the pattern in lib/brandKit.mo.
  func generateBkSlug(businessName : Text, niche : Text, now : Int) : Text {
    let normalise = func(t : Text) : Text {
      t.toLower().map(func(c : Char) : Char {
        if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) c else '-'
      })
    };
    let namePart  = normalise(businessName);
    let nichePart = normalise(niche);
    let salt : Nat = (businessName.size() * 0x1f + niche.size() * 0x3d + Int.abs(now) % 0x10000) % 0x10000;
    let hex = "0123456789abcdef".toArray();
    let h0 = Text.fromChar(hex[(salt / 0x1000) % 16]);
    let h1 = Text.fromChar(hex[(salt / 0x0100) % 16]);
    let h2 = Text.fromChar(hex[(salt / 0x0010) % 16]);
    let h3 = Text.fromChar(hex[salt % 16]);
    namePart # "-" # nichePart # "-" # h0 # h1 # h2 # h3
  };

  let sevenDaysNs : Int = 604_800_000_000_000;

  func createBrandKitProspectInternal(
    businessName : Text,
    niche        : Text,
    city         : Text,
    phone        : Text,
    now          : Int,
  ) : Text {
    let slug = generateBkSlug(businessName # city # now.toText(), niche, now);
    let id   = "bkp-ai-" # now.toText();
    let prospect : BKTypes.BrandKitProspect = {
      id;
      businessName;
      niche;
      city;
      phone;
      website             = null;
      firstName           = businessName;
      createdAt           = now;
      kitPageSlug         = slug;
      trialStatus         = #NotStarted;
      trialStartedAt      = null;
      trialDay            = 0;
      trialExpiresAt      = null;
      activationAction    = null;
      vapiAssistantId     = null;
      auditScore          = null;
      outreachKitSentAt   = null;
      outreachKitOpenedAt = null;
      utmSource           = ?("ai_audit");
      utmCampaign         = ?("lead_intelligence");
      convertedAt         = null;
      lastActivityAt      = ?now;
      featuresUsed        = [];
    };
    brandKitProspects.add(slug, prospect);
    slug
  };

  // ── Lead Audit Jobs ─────────────────────────────────────────────────────────

  /// Persist a new audit job and return its id.
  public shared ({ caller }) func createLeadAuditJob(job : T.LeadAuditJob) : async Text {
    assertUser(caller);
    leadAuditJobs.add(job.id, job);
    job.id
  };

  /// Get a single audit job by id.
  public query ({ caller }) func getLeadAuditJob(jobId : Text) : async ?T.LeadAuditJob {
    assertUser(caller);
    leadAuditJobs.get(jobId)
  };

  /// List all audit jobs for a tenant.
  public query ({ caller }) func getLeadAuditJobs(tenantId : Text) : async [T.LeadAuditJob] {
    assertUser(caller);
    let out = List.empty<T.LeadAuditJob>();
    for (job in leadAuditJobs.values()) {
      if (job.tenantId == tenantId) { out.add(job) };
    };
    out.toArray()
  };

  /// Update status and stage-progress of an existing audit job.
  /// Accepted status values (existing): pending | running | completed | failed
  /// New browser-pipeline statuses: browser_scanning | browser_awaiting_approval | browser_approved | browser_rejected
  public shared ({ caller }) func updateLeadAuditJobStatus(jobId : Text, status : Text, stage : Text) : async Bool {
    assertUser(caller);
    switch (leadAuditJobs.get(jobId)) {
      case (null) { false };
      case (?job) {
        let now = Time.now();
        let terminalStatuses = ["completed", "failed", "browser_approved", "browser_rejected"];
        let isTerminal = terminalStatuses.any(func(s : Text) : Bool { s == status });
        let completedAt : ?Int = if (isTerminal) ?now else job.completedAt;
        leadAuditJobs.add(jobId, { job with status; stageProgress = stage; completedAt });
        true
      };
    };
  };

  // ── Lead Audit Results ──────────────────────────────────────────────────────

  /// Persist a completed audit result (keyed by jobId).
  public shared ({ caller }) func saveLeadAuditResult(result : T.LeadAuditResult) : async () {
    assertUser(caller);
    leadAuditResults.add(result.jobId, result);
  };

  /// Get a single audit result by jobId.
  public query ({ caller }) func getLeadAuditResult(jobId : Text) : async ?T.LeadAuditResult {
    assertUser(caller);
    leadAuditResults.get(jobId)
  };

  /// List all audit results for a tenant.
  public query ({ caller }) func getLeadAuditResults(tenantId : Text) : async [T.LeadAuditResult] {
    assertUser(caller);
    let out = List.empty<T.LeadAuditResult>();
    for (result in leadAuditResults.values()) {
      if (result.tenantId == tenantId) { out.add(result) };
    };
    out.toArray()
  };

  // ── CRM push + Brand Kit ────────────────────────────────────────────────────

  /// Approve an audited lead: create CRM lead, generate brand kit, mark result pushed.
  public shared ({ caller }) func approveAndPushToCrm(jobId : Text, tenantId : Text) : async Bool {
    assertUser(caller);
    switch (leadAuditResults.get(jobId)) {
      case (null) { false };
      case (?result) {
        let now = Time.now();

        // 1. Derive CRM status from category
        let crmStatus = if (result.category == "Hot") "hot"
          else if (result.category == "Warm") "warm"
          else "cold";

        // 2. Write CRM lead
        let leadId = "lead-ai-" # now.toText() # "-" # jobId;
        let lead : AILead = {
          id                 = leadId;
          tenantId;
          name               = result.businessName;
          email              = "";
          phone              = "";
          niche              = result.niche;
          status             = crmStatus;
          source             = "AI Audit";
          notes              = result.aiInsights;
          agentSubscriptions = [];
          createdAt          = now;
        };
        aiCreateLeadInternal(lead);

        // 3. Extract job metadata for the brand kit prospect
        let jobOpt = leadAuditJobs.get(jobId);
        let city  = switch (jobOpt) { case (?j) { switch (j.city)  { case (?v) v; case null "" } }; case null "" };
        let phone = switch (jobOpt) { case (?j) { switch (j.phone) { case (?v) v; case null "" } }; case null "" };

        let slug = createBrandKitProspectInternal(result.businessName, result.niche, city, phone, now);

        // 4. Mark result as pushed
        leadAuditResults.add(jobId, {
          result with
          pushedToCrm = true;
          pushedAt    = ?now;
          kitPageSlug = ?slug;
        });

        true
      };
    };
  };

  // ── Trial interaction logging ───────────────────────────────────────────────

  /// Record what triggered a trial and activate the brand kit trial on the slug.
  public shared ({ caller }) func logTrialInteraction(kitPageSlug : Text, interactionType : Text) : async () {
    assertUser(caller);
    let now = Time.now();

    // Activate brand kit trial when #NotStarted, or just update activity timestamp
    switch (brandKitProspects.get(kitPageSlug)) {
      case (null) {};
      case (?p) {
        switch (p.trialStatus) {
          case (#NotStarted) {
            brandKitProspects.add(kitPageSlug, {
              p with
              trialStatus      = #Active;
              trialStartedAt   = ?now;
              trialDay         = 1;
              trialExpiresAt   = ?(now + sevenDaysNs);
              activationAction = ?interactionType;
              lastActivityAt   = ?now;
            });
          };
          case (_) {
            brandKitProspects.add(kitPageSlug, { p with lastActivityAt = ?now });
          };
        };
      };
    };

    // Update matching audit result with interaction metadata
    let toUpdate = List.empty<(Text, T.LeadAuditResult)>();
    for ((jobId, result) in leadAuditResults.entries()) {
      switch (result.kitPageSlug) {
        case (?slug) {
          if (slug == kitPageSlug) {
            toUpdate.add((jobId, {
              result with
              interactionType  = ?interactionType;
              trialActivatedAt = ?now;
            }));
          };
        };
        case (null) {};
      };
    };
    for ((jobId, updated) in toUpdate.values()) {
      leadAuditResults.add(jobId, updated);
    };
  };

  // ── Batch audit jobs ────────────────────────────────────────────────────────

  /// Persist a new batch audit job and return its id.
  public shared ({ caller }) func createBatchAuditJob(job : T.BatchAuditJob) : async Text {
    assertUser(caller);
    batchAuditJobs.add(job.id, job);
    job.id
  };

  /// Update the progress counters on a running batch audit job.
  public shared ({ caller }) func updateBatchAuditProgress(batchId : Text, processed : Nat, completed : Nat, failed : Nat) : async () {
    assertUser(caller);
    switch (batchAuditJobs.get(batchId)) {
      case (null) {};
      case (?batch) {
        let now  = Time.now();
        let done = completed + failed >= batch.totalLeads;
        batchAuditJobs.add(batchId, {
          batch with
          processedLeads = processed;
          completedLeads = completed;
          failedLeads    = failed;
          status         = if (done) "completed" else "running";
          completedAt    = if (done) ?now else batch.completedAt;
        });
      };
    };
  };

  /// List all batch audit jobs for a tenant.
  public query ({ caller }) func getBatchAuditJobs(tenantId : Text) : async [T.BatchAuditJob] {
    assertUser(caller);
    let out = List.empty<T.BatchAuditJob>();
    for (batch in batchAuditJobs.values()) {
      if (batch.tenantId == tenantId) { out.add(batch) };
    };
    out.toArray()
  };

  // ── Dual-model search jobs ──────────────────────────────────────────────────

  /// Build a normalised dedup key from a business name + city so the same
  /// business discovered by two different models is counted only once.
  func dualSearch_dedupKey(businessName : Text, city : Text) : Text {
    let norm = func(t : Text) : Text {
      t.toLower().map(func(c : Char) : Char {
        if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) c else '-'
      })
    };
    norm(businessName) # "::" # norm(city)
  };

  /// Create a new dual-model search job and return its id.
  public shared ({ caller }) func createDualModelSearchJob(
    tenantId : Text,
    niche    : Text,
    cityA    : Text,
    cityB    : Text,
  ) : async Text {
    assertUser(caller);
    let now = Time.now();
    let id  = "dmsj-" # tenantId # "-" # now.toText();
    let job : T.DualModelSearchJob = {
      id;
      tenantId;
      niche;
      cityA;
      cityB;
      status            = #pending;
      claudeLeadsFound  = 0;
      openaiLeadsFound  = 0;
      totalLeadsStaged  = 0;
      duplicatesRemoved = 0;
      errorMessage      = null;
      createdAt         = now;
      completedAt       = null;
    };
    dualModelSearchJobs.add(id, job);
    id
  };

  /// Fetch a single dual-model search job by id.
  public query ({ caller }) func getDualModelSearchJob(jobId : Text) : async ?T.DualModelSearchJob {
    assertUser(caller);
    dualModelSearchJobs.get(jobId)
  };

  /// List all dual-model search jobs for a tenant.
  public query ({ caller }) func getDualModelSearchJobs(tenantId : Text) : async [T.DualModelSearchJob] {
    assertUser(caller);
    let out = List.empty<T.DualModelSearchJob>();
    for (job in dualModelSearchJobs.values()) {
      if (job.tenantId == tenantId) { out.add(job) };
    };
    out.toArray()
  };

  /// Apply a partial update to a dual-model search job.
  /// Returns false when the job id is not found.
  public shared ({ caller }) func updateDualModelSearchJob(
    jobId  : Text,
    update : T.DualModelSearchJobUpdate,
  ) : async Bool {
    assertUser(caller);
    switch (dualModelSearchJobs.get(jobId)) {
      case (null) { false };
      case (?job) {
        let now = Time.now();
        let newStatus = switch (update.status) {
          case (?s) { s };
          case (null) { job.status };
        };
        let isTerminal = switch (newStatus) {
          case (#completed or #failed) { true };
          case (_) { false };
        };
        let newCompletedAt : ?Int = switch (update.completedAt) {
          case (?v) { ?v };
          case (null) {
            if (isTerminal and job.completedAt == null) ?now
            else job.completedAt
          };
        };
        dualModelSearchJobs.add(jobId, {
          job with
          status            = newStatus;
          claudeLeadsFound  = switch (update.claudeLeadsFound)  { case (?v) v; case null job.claudeLeadsFound  };
          openaiLeadsFound  = switch (update.openaiLeadsFound)  { case (?v) v; case null job.openaiLeadsFound  };
          totalLeadsStaged  = switch (update.totalLeadsStaged)  { case (?v) v; case null job.totalLeadsStaged  };
          duplicatesRemoved = switch (update.duplicatesRemoved) { case (?v) v; case null job.duplicatesRemoved };
          errorMessage      = switch (update.errorMessage)      { case (?v) ?v; case null job.errorMessage      };
          completedAt       = newCompletedAt;
        });
        true
      };
    };
  };

  /// Stage a batch of raw leads (from a dual-model search) as LeadAuditJobs.
  /// Deduplicates by (businessName, city) — duplicates are skipped and counted.
  /// Returns the number of new jobs actually created.
  public shared ({ caller }) func stageBulkLeadsFromSearch(
    tenantId : Text,
    jobId    : Text,
    leads_in : [T.BulkLeadInput],
  ) : async Nat {
    assertUser(caller);
    let now     = Time.now();
    let seen    = Set.empty<Text>();
    var staged  : Nat = 0;
    var skipped : Nat = 0;

    for (lead in leads_in.vals()) {
      let key = dualSearch_dedupKey(lead.businessName, lead.city);
      if (seen.contains(key)) {
        skipped += 1;
      } else {
        seen.add(key);
        let auditId = "job-bulk-" # tenantId # "-" # now.toText() # "-" # staged.toText();
        let websiteUrl = switch (lead.websiteUrl) { case (?u) u; case null "" };
        let stateSuffix = switch (lead.state) { case (?s) ", " # s; case null "" };
        let city       = ?(lead.city # stateSuffix);
        let auditJob : T.LeadAuditJob = {
          id            = auditId;
          tenantId;
          businessName  = lead.businessName;
          websiteUrl;
          niche         = lead.niche;
          city;
          phone         = lead.phone;
          email         = lead.email;
          status        = "pending";
          stageProgress = "queued";
          createdAt     = now;
          completedAt   = null;
          errorMessage  = null;
        };
        leadAuditJobs.add(auditId, auditJob);
        staged += 1;
      };
    };

    // Update the parent dual-model job with dedup stats if it exists
    switch (dualModelSearchJobs.get(jobId)) {
      case (null) {};
      case (?job) {
        dualModelSearchJobs.add(jobId, {
          job with
          totalLeadsStaged  = job.totalLeadsStaged  + staged;
          duplicatesRemoved = job.duplicatesRemoved + skipped;
        });
      };
    };

    staged
  };

};
