import Map     "mo:core/Map";
import List    "mo:core/List";
import Time    "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text    "mo:core/Text";
import Nat     "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import T       "../types/brandKit";
import ET      "../types/email";
import BKLib   "../lib/brandKit";
import EmailLib "../lib/email";

mixin (
  accessControlState   : AccessControl.AccessControlState,
  brandKitProspects    : Map.Map<Text, T.BrandKitProspect>,
  brandKitOutreachJobs : Map.Map<Text, T.BrandKitOutreachJob>,
  warmSchedules        : List.List<ET.WarmSequenceEmailSchedule>,
  warmEvents           : List.List<ET.WarmSequenceEmailEvent>,
  emailIdCounter       : { var n : Nat },
) {

  // ── Internal helpers ───────────────────────────────────────────────────────

  func assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  func nextBkEmailId() : Text {
    emailIdCounter.n += 1;
    "bkem-" # Time.now().toText() # "-" # emailIdCounter.n.toText()
  };

  // Niche-specific email copy for outreach sequences
  func nicheSubject(niche : Text, touchIndex : Nat) : Text {
    let nicheLabel = if (niche == "plumber") "Plumbing"
      else if (niche == "hvac") "HVAC"
      else if (niche == "med-spa") "Med Spa"
      else if (niche == "restoration") "Restoration"
      else if (niche == "carpet-cleaning") "Carpet Cleaning"
      else if (niche == "roofing") "Roofing"
      else if (niche == "real-estate") "Real Estate"
      else if (niche == "mortgage") "Mortgage"
      else if (niche == "chiropractor") "Chiropractic"
      else if (niche == "dental") "Dental"
      else niche;
    switch (touchIndex) {
      case 0 { "Your " # nicheLabel # " business app and website are ready — take a look" };
      case 1 { "Quick follow-up: your " # nicheLabel # " app is still waiting for you" };
      case 2 { "Free audit inside: see how your " # nicheLabel # " business scores online" };
      case 3 { "See your " # nicheLabel # " back office + AI voice agent live" };
      case 4 { "Last chance: your " # nicheLabel # " app expires soon" };
      case _ { "Update from BRF for your " # nicheLabel # " business" };
    }
  };

  func nicheBody(niche : Text, touchIndex : Nat, businessName : Text, slug : Text) : Text {
    let kitUrl = "https://app.bookedrankedfunded.com/brand-kit/" # slug;
    let utm = "?utm_source=brand_kit&utm_medium=email&utm_campaign=" # niche # "&utm_content=" # slug;
    let url = kitUrl # utm;
    switch (touchIndex) {
      case 0 {
        "Hi there,\n\nWe built a custom app and website specifically for " # businessName # ". It includes an AI receptionist that answers calls in your name, a full CRM, reputation management, and a 30-day social calendar — all pre-loaded for your industry.\n\nSee it here: " # url # "\n\nThere is also a free audit of your current online presence included.\n\nBRF Team"
      };
      case 1 {
        "Hi,\n\nJust following up — your " # businessName # " app is still ready and waiting. Most business owners that check it out tell us they wish they found it sooner.\n\nYour personalized kit: " # url # "\n\nBRF Team"
      };
      case 2 {
        "Hi,\n\nWe ran a free 13-point audit of " # businessName # "'s online presence. Your results are inside your kit — including your SEO score, trust signals, and the top 3 things costing you leads right now.\n\nSee your audit: " # url # "\n\nBRF Team"
      };
      case 3 {
        "Hi,\n\nYour app includes a live AI voice agent that answers calls as " # businessName # ". You can test it right now — hit the button and hear it say your business name.\n\nTest it here: " # url # "\n\nBRF Team"
      };
      case _ {
        "Hi,\n\nThis is the last reminder about your " # businessName # " app. The free trial activates the moment you first use it — so there is no rush, but the kit link does expire.\n\nAccess it here: " # url # "\n\nBRF Team"
      };
    }
  };

  // ── Prospect CRUD ──────────────────────────────────────────────────────────

  /// Create a new brand kit prospect from the public intake form.
  /// Returns the prospect record plus a flag indicating outreach should be triggered.
  /// Caller need not be authenticated — this is a public-facing endpoint.
  public func createBrandKitProspect(
    firstName    : Text,
    businessName : Text,
    niche        : Text,
    city         : Text,
    phone        : Text,
    website      : ?Text,
  ) : async { #ok : T.BrandKitProspect; #err : Text } {
    let now = Time.now();
    let slug = BKLib.generateSlug(businessName # city # now.toText(), niche);
    let id   = "bkp-" # now.toText();
    let prospect : T.BrandKitProspect = {
      id;
      businessName;
      niche;
      city;
      phone;
      website;
      firstName;
      createdAt          = now;
      kitPageSlug        = slug;
      trialStatus        = #NotStarted;
      trialStartedAt     = null;
      trialDay           = 0;
      trialExpiresAt     = null;
      activationAction   = null;
      vapiAssistantId    = null;
      auditScore         = null;
      outreachKitSentAt  = null;
      outreachKitOpenedAt = null;
      utmSource          = null;
      utmCampaign        = null;
      convertedAt        = null;
      lastActivityAt     = ?now;
      featuresUsed       = [];
    };
    brandKitProspects.add(slug, prospect);
    // shouldTriggerOutreach is always true for new prospects; the frontend
    // calls triggerOutreachEmailSequence immediately after this succeeds.
    #ok prospect
  };

  /// Retrieve a prospect by their unique kit page slug (public endpoint).
  public query func getBrandKitProspect(slug : Text) : async ?T.BrandKitProspect {
    brandKitProspects.get(slug)
  };

  /// Return all prospects — admin-only.
  public query ({ caller }) func getAllBrandKitProspects() : async [T.BrandKitProspect] {
    assertAdmin(caller);
    brandKitProspects.values().toArray()
  };

  // ── Trial lifecycle ────────────────────────────────────────────────────────

  /// Activate the 7-day trial for a prospect.
  /// Only activates if the current status is NotStarted.
  /// Clock starts from the moment this is called (not intake time).
  public func activateBrandKitTrial(
    slug       : Text,
    actionType : Text,
  ) : async { #ok : T.BrandKitProspect; #err : Text } {
    let now = Time.now();
    switch (brandKitProspects.get(slug)) {
      case (null) { #err "Prospect not found" };
      case (?p) {
        switch (p.trialStatus) {
          case (#NotStarted) {
            let updated : T.BrandKitProspect = {
              p with
              trialStatus      = #Active;
              trialStartedAt   = ?now;
              trialDay         = 1;
              trialExpiresAt   = ?(now + BKLib.trialDurationNs());
              activationAction = ?actionType;
              lastActivityAt   = ?now;
            };
            brandKitProspects.add(slug, updated);
            #ok updated
          };
          case (_) { #err "Trial already activated or expired" };
        };
      };
    };
  };

  /// Record a feature usage event for a prospect.
  /// Deduplicates featuresUsed list, updates lastActivityAt, and expires trial if past day 7.
  /// When this is the FIRST activity for a #NotStarted prospect, activates the trial
  /// and schedules the 3-touch nudge email sequence.
  public func recordBrandKitActivity(slug : Text, featureUsed : Text) : async () {
    let now = Time.now();
    switch (brandKitProspects.get(slug)) {
      case (null) {};
      case (?p) {
        // Detect first meaningful action on a not-yet-started trial
        let isFirstAction = switch (p.trialStatus) {
          case (#NotStarted) { true };
          case (_) { false };
        };

        // Deduplicate featuresUsed
        let already = p.featuresUsed.find(func(f : Text) : Bool { f == featureUsed });
        let newFeatures = switch (already) {
          case (?_) { p.featuresUsed };
          case (null) { p.featuresUsed.concat([featureUsed]) };
        };

        // Auto-activate trial on first action
        let (newStatus, newStartedAt, newExpiresAt, newDay) = if (isFirstAction) {
          (#Active, ?now, ?(now + BKLib.trialDurationNs()), 1)
        } else {
          // Check if trial should expire
          let s = switch (p.trialStatus) {
            case (#Active) {
              switch (p.trialStartedAt) {
                case (?started) {
                  if (BKLib.computeTrialDay(started, now) >= 8) #Expired else #Active
                };
                case (null) { #Active };
              };
            };
            case (other) { other };
          };
          let d = switch (p.trialStartedAt) {
            case (?started) { BKLib.computeTrialDay(started, now) };
            case (null) { p.trialDay };
          };
          (s, p.trialStartedAt, p.trialExpiresAt, d)
        };

        brandKitProspects.add(slug, {
          p with
          featuresUsed     = newFeatures;
          lastActivityAt   = ?now;
          trialStatus      = newStatus;
          trialDay         = newDay;
          trialStartedAt   = newStartedAt;
          trialExpiresAt   = newExpiresAt;
          activationAction = if (isFirstAction) ?featureUsed else p.activationAction;
        });

        // Wire up nudge sequence on first activation
        if (isFirstAction) {
          scheduleNudgeEmails(slug, p.phone, p.firstName, p.businessName, p.niche);
        };
      };
    };
  };

  // Internal: writes 3 nudge schedule records directly into warmSchedules.
  // Uses phone as a stand-in recipient identifier (actual email delivery uses
  // the Caffeine email endpoint; recipient field carries the prospect identifier).
  func scheduleNudgeEmails(slug : Text, _phone : Text, firstName : Text, businessName : Text, niche : Text) {
    let kitUrl = "https://app.bookedrankedfunded.com/brand-kit/" # slug;
    let recipientRef = slug; // email system resolves to actual address via slug

    // Touch 0 — Day 1 (24 h = 24 delay hours)
    let nudgeId0 = nextBkEmailId();
    let subject0 = "Here is how to get the most out of your first 7 days";
    let body0 = "Hi " # firstName # ",\n\nYour " # businessName # " app is now live. Here are the 3 things to do in your first 24 hours:\n\n1. Run your free business audit — see your score\n2. Test your AI voice agent — hear it say your name\n3. Preview your social calendar — 30 days ready to go\n\nYour dashboard: " # kitUrl # "\n\nBRF Team";
    warmSchedules.add(EmailLib.makeScheduleRecord(nudgeId0, slug, 0, 24, recipientRef, subject0, body0));
    warmEvents.add(EmailLib.makeEventRecord(nextBkEmailId(), slug, 0, "scheduled"));

    // Touch 1 — Day 4 (96 h)
    let nudgeId1 = nextBkEmailId();
    let subject1 = "You have explored your " # niche # " app — here is what you have not seen yet";
    let body1 = "Hi " # firstName # ",\n\nYou have already unlocked part of your " # businessName # " app. A few features most owners miss on their first pass:\n\n- The Social ROI Dashboard (tracks which posts drive bookings)\n- The Reputation Inbox (manage all reviews from one place)\n- The Outbound Voice Agent (it calls leads within 60 seconds of a form fill)\n\nExplore them here: " # kitUrl # "\n\nBRF Team";
    warmSchedules.add(EmailLib.makeScheduleRecord(nudgeId1, slug, 1, 96, recipientRef, subject1, body1));
    warmEvents.add(EmailLib.makeEventRecord(nextBkEmailId(), slug, 1, "scheduled"));

    // Touch 2 — Day 6 (144 h)
    let nudgeId2 = nextBkEmailId();
    let subject2 = "One day left — here is how to lock in your results";
    let body2 = "Hi " # firstName # ",\n\nYour 7-day trial for " # businessName # " ends tomorrow. Everything you have set up — your website, your voice agent, your social calendar — stays exactly as you left it when you upgrade.\n\nLock it in before it expires: " # kitUrl # "\n\nIf you have questions, reply to this email.\n\nBRF Team";
    warmSchedules.add(EmailLib.makeScheduleRecord(nudgeId2, slug, 2, 144, recipientRef, subject2, body2));
    warmEvents.add(EmailLib.makeEventRecord(nextBkEmailId(), slug, 2, "scheduled"));
  };

  /// Mark a prospect as converted (trial upgrade accepted).
  public func markBrandKitConverted(slug : Text) : async { #ok : T.BrandKitProspect; #err : Text } {
    let now = Time.now();
    switch (brandKitProspects.get(slug)) {
      case (null) { #err "Prospect not found" };
      case (?p) {
        let updated : T.BrandKitProspect = {
          p with
          trialStatus    = #Converted;
          convertedAt    = ?now;
          lastActivityAt = ?now;
        };
        brandKitProspects.add(slug, updated);
        #ok updated
      };
    };
  };

  // ── Outreach jobs ─────────────────────────────────────────────────────────

  /// Create an outreach job to send a branded kit to a cold prospect.
  public shared ({ caller }) func createBrandKitOutreachJob(
    niche              : Text,
    targetBusinessName : Text,
    targetEmail        : Text,
    targetCity         : Text,
  ) : async T.BrandKitOutreachJob {
    assertAdmin(caller);
    let now  = Time.now();
    let id   = "bkoj-" # now.toText();
    let slug = BKLib.generateSlug(targetBusinessName # targetCity # now.toText(), niche);
    let utm  = "utm_source=brf&utm_campaign=brandkit_" # niche # "&utm_medium=email";
    let job  : T.BrandKitOutreachJob = {
      id;
      niche;
      targetBusinessName;
      targetEmail;
      targetCity;
      kitSlug   = slug;
      status    = "pending";
      sentAt    = null;
      openedAt  = null;
      clickedAt = null;
      utmParams = utm;
    };
    brandKitOutreachJobs.add(id, job);
    job
  };

  /// Return all outreach jobs — admin-only.
  public query ({ caller }) func getBrandKitOutreachJobs() : async [T.BrandKitOutreachJob] {
    assertAdmin(caller);
    brandKitOutreachJobs.values().toArray()
  };

  /// Update the status of an outreach job (e.g. sent, opened, clicked, converted).
  public shared ({ caller }) func updateOutreachJobStatus(id : Text, status : Text) : async () {
    assertAdmin(caller);
    let now = Time.now();
    switch (brandKitOutreachJobs.get(id)) {
      case (null) { Runtime.trap("Outreach job not found") };
      case (?job) {
        let updated : T.BrandKitOutreachJob = switch (status) {
          case ("sent")      { { job with status; sentAt    = ?now } };
          case ("opened")    { { job with status; openedAt  = ?now } };
          case ("clicked")   { { job with status; clickedAt = ?now } };
          case ("converted") { { job with status; clickedAt = job.clickedAt } };
          case (_)           { { job with status } };
        };
        brandKitOutreachJobs.add(id, updated);
      };
    };
  };

  // ── Funnel stats ──────────────────────────────────────────────────────────

  /// Aggregate funnel stats across all brand kit prospects — admin-only.
  public query ({ caller }) func getBrandKitFunnelStats() : async {
    totalProspects : Nat;
    activated      : Nat;
    expired        : Nat;
    converted      : Nat;
    byNiche        : [(Text, Nat)];
  } {
    assertAdmin(caller);
    var total    : Nat = 0;
    var activated: Nat = 0;
    var expired  : Nat = 0;
    var converted: Nat = 0;
    let nicheMap = Map.empty<Text, Nat>();

    for (p in brandKitProspects.values()) {
      total += 1;
      switch (p.trialStatus) {
        case (#Active)    { activated += 1 };
        case (#Expired)   { expired   += 1 };
        case (#Converted) { converted += 1 };
        case (#NotStarted) {};
      };
      let prev = switch (nicheMap.get(p.niche)) {
        case (?n) n;
        case (null) 0;
      };
      nicheMap.add(p.niche, prev + 1);
    };

    {
      totalProspects = total;
      activated;
      expired;
      converted;
      byNiche = nicheMap.toArray();
    }
  };

  // ── Outreach email sequence ───────────────────────────────────────────────

  /// Fire a 5-touch niche cold email outreach sequence for a prospect.
  /// Schedules Day 0 through Day 7 touches via warmSchedules.
  /// The frontend calls this immediately after createBrandKitProspect succeeds.
  public func triggerOutreachEmailSequence(slug : Text) : async () {
    switch (brandKitProspects.get(slug)) {
      case (null) {};
      case (?p) {
        // 5-touch sequence: Day 0, 1, 3, 5, 7 expressed as delay hours
        let touches : [(Nat, Nat)] = [(0, 0), (1, 24), (2, 72), (3, 120), (4, 168)];
        for ((touchIdx, delayHours) in touches.vals()) {
          let touchId = nextBkEmailId();
          let subject = nicheSubject(p.niche, touchIdx);
          let body    = nicheBody(p.niche, touchIdx, p.businessName, slug);
          warmSchedules.add(EmailLib.makeScheduleRecord(touchId, "outreach-" # slug, touchIdx, delayHours, slug, subject, body));
          warmEvents.add(EmailLib.makeEventRecord(nextBkEmailId(), "outreach-" # slug, touchIdx, "scheduled"));
        };
        // Mark kit as sent
        let now = Time.now();
        brandKitProspects.add(slug, { p with outreachKitSentAt = ?now });
      };
    };
  };

  // ── In-trial nudge schedule ───────────────────────────────────────────────

  /// Schedule the 3-touch in-trial nudge sequence for a prospect.
  /// Called automatically by recordBrandKitActivity on first activation,
  /// but also exposed as a public method for manual triggering (e.g. from admin).
  public func scheduleTrialNudgeEmails(slug : Text) : async () {
    switch (brandKitProspects.get(slug)) {
      case (null) {};
      case (?p) {
        scheduleNudgeEmails(slug, p.phone, p.firstName, p.businessName, p.niche);
      };
    };
  };

  /// Return all scheduled nudge emails for a given prospect slug.
  /// Lets admin see exactly what email touches are queued for a prospect.
  public query ({ caller }) func getTrialNudgeSchedule(slug : Text) : async [ET.WarmSequenceEmailSchedule] {
    assertAdmin(caller);
    warmSchedules.filter(func(s : ET.WarmSequenceEmailSchedule) : Bool {
      s.enrollmentId == slug or s.enrollmentId == "outreach-" # slug
    }).toArray()
  };

  // ── Outreach aggregate stats ──────────────────────────────────────────────

  /// Aggregate outreach funnel stats across all outreach jobs — admin-only.
  public query ({ caller }) func getBrandKitOutreachStats() : async {
    totalSent      : Nat;
    totalOpened    : Nat;
    totalClicked   : Nat;
    totalConverted : Nat;
    byNiche        : [(Text, Nat)];
  } {
    assertAdmin(caller);
    var totalSent      : Nat = 0;
    var totalOpened    : Nat = 0;
    var totalClicked   : Nat = 0;
    var totalConverted : Nat = 0;
    let nicheMap = Map.empty<Text, Nat>();

    for (job in brandKitOutreachJobs.values()) {
      switch (job.status) {
        case ("sent")      { totalSent      += 1 };
        case ("opened")    { totalSent += 1; totalOpened    += 1 };
        case ("clicked")   { totalSent += 1; totalOpened += 1; totalClicked   += 1 };
        case ("converted") { totalSent += 1; totalOpened += 1; totalClicked += 1; totalConverted += 1 };
        case (_) {};
      };
      let prev = switch (nicheMap.get(job.niche)) {
        case (?n) n;
        case (null) 0;
      };
      nicheMap.add(job.niche, prev + 1);
    };

    {
      totalSent;
      totalOpened;
      totalClicked;
      totalConverted;
      byNiche = nicheMap.toArray();
    }
  };

};
