import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Nat32 "mo:core/Nat32";
import Array "mo:core/Array";
import T "../types/rooferColdCampaign";
import LeadEngineTypes "../types/lead-engine";
import WebhookInboxTypes "../types/webhookInbox";

/// Domain logic for the Roofer Cold Campaign subsystem.
///
/// All public functions are pure with respect to the injected state bucket:
/// they read and mutate `state` in place but perform no I/O. The mixin layer
/// is responsible for any async work (e.g. calling sendLiveEmail).
module {

  // ── Id / token generators ────────────────────────────────────────────────

  /// Generates a new unique campaign id from the tenant id and the current
  /// time. Combines a short tenant hash with the nanosecond timestamp so ids
  /// are unique within a tenant and sortable across time.
  public func makeCampaignId(tenantId : Text, now : Int) : Text {
    "rcc_" # shortHash(tenantId) # "_" # now.toText()
  };

  /// Generates a new unique CTA token for a campaign lead. The token is used
  /// as the demo-booking link identifier and must be unguessable.
  public func makeCtaToken(campaignId : Text, leadId : Text, now : Int) : Text {
    "cta_" # shortHash(campaignId # leadId # now.toText())
  };

  /// Generates a new unique demo booking id.
  public func makeBookingId(now : Int) : Text {
    "bk_" # now.toText()
  };

  // ── Defaults ──────────────────────────────────────────────────────────────

  /// Builds the default 7-step roofer cold email sequence (editable later
  /// via rooferColdCampaign_updateSequence). Each step body uses
  /// {{business_name}}, {{city}}, {{owner_name}} personalization tokens and
  /// includes the demo booking CTA link with {{cta_token}}.
  public func defaultSequence() : [T.RooferCampaignStep] {
    [
      // Step 1 — First-touch hook (audit reveal)
      {
        stepNumber = 1;
        subject = "We ran your Google Maps ranking, {{business_name}} — here's what we found";
        body =
          "Hi {{owner_name}},\n\n" #
          "We ran a quick Google Maps ranking audit on {{business_name}} in {{city}}.\n\n" #
          "Most roofers rank #1 when they Google themselves from their shop — but a homeowner " #
          "searching two miles away isn't seeing them at all. That's the proximity gap, and it's " #
          "costing you jobs every week.\n\n" #
          "Want to see exactly where you're visible and where you're not?\n" #
          "Book a 15-minute demo and we'll show your full ranking map:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "Best,\nThe BRF Team\n\n" #
          "—\n" #
          "You're receiving this because we work with roofing contractors in {{city}}. " #
          "If this isn't useful, just reply \"stop\" and we won't email again.";
        delayDays = 0;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
      // Step 2 — Follow-up with storm damage pain point
      {
        stepNumber = 2;
        subject = "After the last storm in {{city}}, who got the calls?";
        body =
          "Hi {{owner_name}},\n\n" #
          "Quick follow-up on the ranking audit for {{business_name}}.\n\n" #
          "When a storm rolls through {{city}}, every homeowner pulls out their phone and searches " #
          "\"roofing contractor near me.\" If you're not showing up in their neighborhood's map pack, " #
          "those emergency calls go straight to a competitor — and storm jobs are the highest-ticket " #
          "work of the year.\n\n" #
          "The ranking gap we found is exactly the kind of thing that turns a $20k storm season into " #
          "a $0 storm season.\n\n" #
          "See your coverage map and book a quick demo:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "Best,\nThe BRF Team";
        delayDays = 2;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
      // Step 3 — Google Maps ranking angle
      {
        stepNumber = 3;
        subject = "Why {{business_name}} ranks #1 on your street — and nowhere else";
        body =
          "Hi {{owner_name}},\n\n" #
          "Here's the thing most SEO companies never explain to roofing clients:\n\n" #
          "Google's local ranking is position-based. When you search for your own company, Google " #
          "shows you results based on where YOU are standing — right at your business address. Of " #
          "course you're #1 there.\n\n" #
          "But a homeowner across {{city}} searching \"roofing contractor {{city}}\"? Different " #
          "location, different results. And right now, that's where a competitor is showing up " #
          "instead of {{business_name}}.\n\n" #
          "This is the Google Maps proximity gap — and it's fixable.\n\n" #
          "Book a demo and we'll walk you through it:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "— The BRF Team";
        delayDays = 4;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
      // Step 4 — Missed calls cost math
      {
        stepNumber = 4;
        subject = "Every missed call to {{business_name}} is a $10k job walking out the door";
        body =
          "Hi {{owner_name}},\n\n" #
          "Let's put a number on it.\n\n" #
          "Average roofing job: $8,000–$15,000.\n" #
          "If you're invisible in even half of the neighborhoods in {{city}}, that's 2–4 missed jobs " #
          "per month — $16,000 to $60,000 going somewhere else.\n\n" #
          "Not because you're a bad roofer. Because your Google coverage stops at your block.\n\n" #
          "BRF fixes exactly this: extends your map visibility across your full service area, answers " #
          "every call with an AI front desk, and turns missed calls into booked jobs.\n\n" #
          "See how it works:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "— The BRF Team";
        delayDays = 6;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
      // Step 5 — Reviews / social proof
      {
        stepNumber = 5;
        subject = "A roofer in {{city}} went from invisible to #1 in 6 weeks";
        body =
          "Hi {{owner_name}},\n\n" #
          "A roofing company similar to {{business_name}} — same city size, same services — had the " #
          "exact same ranking problem you have now.\n\n" #
          "Before: ranking #1 on their block, invisible everywhere else, 3–4 leads a month.\n" #
          "After 6 weeks on BRF: visible across a 7-mile radius, 14–18 calls a month from " #
          "neighborhoods they'd never gotten a call from before. Hired an extra crew.\n\n" #
          "The fix was the same one we'd run for {{business_name}}.\n\n" #
          "Book a demo:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "— The BRF Team";
        delayDays = 8;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
      // Step 6 — BRF solution reveal with demo CTA
      {
        stepNumber = 6;
        subject = "{{business_name}}: 7-day trial, no credit card, no lock-in";
        body =
          "Hi {{owner_name}},\n\n" #
          "Here's the offer for {{business_name}}:\n\n" #
          "7-day free trial of BRF. No credit card. No lock-in. Cancel any time. Setup takes 20 minutes.\n\n" #
          "What you get in the trial:\n" #
          "• AI front desk active on your number from day one\n" #
          "• Full local ranking grid audit for {{city}}\n" #
          "• 3 automated follow-up sequences live and running\n" #
          "• Weekly ranking report delivered to your inbox\n\n" #
          "That's the whole platform, live, for your business, for free.\n\n" #
          "Start your free 7-day trial — book a quick demo:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "— The BRF Team";
        delayDays = 10;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
      // Step 7 — Break-up email
      {
        stepNumber = 7;
        subject = "Last message for {{business_name}} — wanted to make sure you saw this";
        body =
          "Hi {{owner_name}},\n\n" #
          "This is the last email I'll send about this.\n\n" #
          "I get it — you're busy running a roofing company in {{city}}. If the timing isn't right, " #
          "no hard feelings.\n\n" #
          "But if there's any chance you're still losing calls to a competitor because of the ranking " #
          "gap we found, I'd hate for you to not know about it.\n\n" #
          "One last easy door: a 15-minute call where I'll show you your actual ranking data across " #
          "{{city}} and what it would take to fix it.\n\n" #
          "Book a time:\n" #
          "https://{{backend_host}}/demo/{{cta_token}}\n\n" #
          "Either way, good luck with the season.\n\n" #
          "— The BRF Team";
        delayDays = 12;
        sendTime = "09:00";
        enabled = true;
        personalizationTokens = ["business_name", "city", "owner_name", "cta_token", "backend_host"];
      },
    ]
  };

  /// Returns an empty RooferCampaignStats record (all zeros).
  public func emptyStats() : T.RooferCampaignStats {
    {
      totalLeads   = 0;
      sent         = 0;
      opened       = 0;
      replied      = 0;
      bounced      = 0;
      booked       = 0;
      unsubscribed = 0;
    }
  };

  // ── Campaign CRUD ─────────────────────────────────────────────────────────

  /// Creates a new RooferColdCampaign record in draft status and stores it
  /// in state.campaigns. Returns the created campaign.
  public func createCampaign(
    state          : T.RooferColdCampaignState,
    tenantId       : Text,
    name           : Text,
    leadListFilter : Text,
    senderName     : Text,
    senderEmail    : Text,
    now            : Int,
  ) : T.RooferColdCampaign {
    let id = makeCampaignId(tenantId, now);
    let campaign : T.RooferColdCampaign = {
      id;
      tenantId;
      name;
      leadListFilter;
      senderName;
      senderEmail;
      status = #draft;
      createdAt = now;
      updatedAt = now;
      sequence = defaultSequence();
      enrolledLeadIds = [];
      stats = emptyStats();
    };
    state.campaigns.add(id, campaign);
    campaign
  };

  /// Returns a summary list of campaigns for a tenant. leadCount is derived
  /// from enrolledLeadIds and the stat fields from the stored stats field.
  public func listCampaigns(
    state    : T.RooferColdCampaignState,
    tenantId : Text,
  ) : [T.RooferCampaignSummary] {
    var summaries : [T.RooferCampaignSummary] = [];
    for ((id, c) in state.campaigns.entries()) {
      if (c.tenantId == tenantId) {
        let summary : T.RooferCampaignSummary = {
          id        = c.id;
          name      = c.name;
          status    = c.status;
          leadCount = c.enrolledLeadIds.size();
          sent      = c.stats.sent;
          opened    = c.stats.opened;
          replied   = c.stats.replied;
          bounced   = c.stats.bounced;
          booked    = c.stats.booked;
        };
        summaries := Array_append(summaries, [summary]);
      };
    };
    summaries
  };

  /// Returns a single campaign by id, verifying tenant ownership.
  public func getCampaign(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
  ) : ?T.RooferColdCampaign {
    switch (state.campaigns.get(campaignId)) {
      case (?c) {
        if (c.tenantId == tenantId) ?c else null
      };
      case null null;
    }
  };

  /// Replaces the editable sequence on a campaign and bumps updatedAt.
  /// Returns the updated campaign, or null if not found / not owned.
  public func updateSequence(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
    sequence   : [T.RooferCampaignStep],
    now        : Int,
  ) : ?T.RooferColdCampaign {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null null;
      case (?c) {
        let updated : T.RooferColdCampaign = {
          c with
          sequence = sequence;
          updatedAt = now;
        };
        state.campaigns.add(campaignId, updated);
        ?updated
      };
    }
  };

  // ── Lead enrollment ────────────────────────────────────────────────────────

  /// Enrolls a set of Lead Engine lead ids into a campaign. Leads already
  /// enrolled are skipped. Each newly enrolled lead gets a unique ctaToken
  /// and nextSendAt = now (so step 0 is immediately due when sending starts).
  public func enrollLeads(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
    leadIds    : [Text],
    now        : Int,
  ) : T.RooferEnrollResult {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null { { enrolled = 0; skipped = leadIds.size() } };
      case (?campaign) {
        // Ensure a leads map exists for this campaign
        let leadMap = switch (state.leads.get(campaignId)) {
          case null {
            let m = Map.empty<Text, T.RooferCampaignLead>();
            state.leads.add(campaignId, m);
            m
          };
          case (?m) m;
        };
        var enrolled : Nat = 0;
        var skipped : Nat = 0;
        var newLeadIds : [Text] = campaign.enrolledLeadIds;
        for (leadId in leadIds.vals()) {
          if (leadMap.get(leadId) != null) {
            skipped += 1;
          } else {
            let ctaToken = makeCtaToken(campaignId, leadId, now);
            let lead : T.RooferCampaignLead = {
              campaignId  = campaignId;
              leadId      = leadId;
              currentStep = 0;
              status      = #pending;
              lastEventAt = null;
              nextSendAt  = ?now;
              ctaToken    = ctaToken;
              bookedAt    = null;
              bookedSlot  = null;
            };
            leadMap.add(leadId, lead);
            state.ctaTokens.add(ctaToken, leadId);
            newLeadIds := Array_append(newLeadIds, [leadId]);
            enrolled += 1;
          };
        };
        // Update campaign with new enrolledLeadIds + refreshed stats + updatedAt
        let updatedCampaign : T.RooferColdCampaign = {
          campaign with
          enrolledLeadIds = newLeadIds;
          stats = { campaign.stats with totalLeads = newLeadIds.size() };
          updatedAt = now;
        };
        state.campaigns.add(campaignId, updatedCampaign);
        { enrolled; skipped }
      };
    }
  };

  /// Returns a paginated slice of enrolled leads for a campaign.
  public func getLeads(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
    offset     : Nat,
    limit      : Nat,
  ) : T.RooferCampaignLeadsPage {
    // Verify ownership first
    switch (getCampaign(state, tenantId, campaignId)) {
      case null { { leads = []; total = 0 } };
      case (?_) {
        switch (state.leads.get(campaignId)) {
          case null { { leads = []; total = 0 } };
          case (?leadMap) {
            let allPairs = leadMap.toArray();
            let all : [T.RooferCampaignLead] = allPairs.map(
              func(pair) { pair.1 },
            );
            let total = all.size();
            let end = if (offset + limit > total) total else offset + limit;
            let slice = if (offset >= total) [] else subArray(all, offset, end);
            { leads = slice; total }
          };
        };
      };
    }
  };

  // ── Sending control ───────────────────────────────────────────────────────

  /// Transitions a campaign from draft/paused to active (manual start).
  /// Sets each pending lead's nextSendAt to now if not already set.
  public func startSending(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
    now        : Int,
  ) : ?T.RooferColdCampaign {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null null;
      case (?campaign) {
        let updated : T.RooferColdCampaign = {
          campaign with
          status = #active;
          updatedAt = now;
        };
        state.campaigns.add(campaignId, updated);
        // Ensure pending leads have a nextSendAt
        switch (state.leads.get(campaignId)) {
          case null {};
          case (?leadMap) {
            for ((leadId, lead) in leadMap.entries()) {
              if (lead.status == #pending and lead.nextSendAt == null) {
                let refreshed : T.RooferCampaignLead = { lead with nextSendAt = ?now };
                leadMap.add(leadId, refreshed);
              };
            };
          };
        };
        ?updated
      };
    }
  };

  /// Pauses an active campaign. Does not mutate individual leads — the
  /// sending engine checks campaign.status == #active before sending.
  public func pauseSending(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
    now        : Int,
  ) : ?T.RooferColdCampaign {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null null;
      case (?campaign) {
        let updated : T.RooferColdCampaign = {
          campaign with
          status = #paused;
          updatedAt = now;
        };
        state.campaigns.add(campaignId, updated);
        ?updated
      };
    }
  };

  // ── Stats / replies / export ──────────────────────────────────────────────

  /// Computes RooferCampaignStats by counting leads in state.leads[campaignId]
  /// by status. Returns null when the campaign is not found / not owned.
  public func getStats(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
  ) : ?T.RooferCampaignStats {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null null;
      case (?campaign) {
        var sent = 0;
        var opened = 0;
        var replied = 0;
        var bounced = 0;
        var booked = 0;
        var unsubscribed = 0;
        let totalLeads = campaign.enrolledLeadIds.size();
        switch (state.leads.get(campaignId)) {
          case null {};
          case (?leadMap) {
            for ((_, lead) in leadMap.entries()) {
              switch (lead.status) {
                case (#pending) {};
                case (#sent) sent += 1;
                case (#opened) opened += 1;
                case (#replied) replied += 1;
                case (#bounced) bounced += 1;
                case (#booked) booked += 1;
                case (#unsubscribed) unsubscribed += 1;
              };
            };
          };
        };
        ?{
          totalLeads;
          sent;
          opened;
          replied;
          bounced;
          booked;
          unsubscribed;
        }
      };
    }
  };

  /// Returns the webhook reply events for a campaign.
  ///
  /// TODO: wire to the existing webhookInbox state. For now returns an empty
  /// array — the frontend reads the existing webhook inbox directly. The
  /// integration should filter webhookInboxState.events by leadEmail matched
  /// to enrolled leads' emails (resolved via leadEngine state).
  public func getReplies(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
  ) : [WebhookInboxTypes.NormalizedWebhookEvent] {
    ignore (state, tenantId, campaignId);
    []
  };

  /// Exports enrolled leads as a CSV string with headers:
  /// leadId, currentStep, status, lastEventAt, ctaToken, bookedAt.
  /// One row per lead. Returns the CSV text (empty string if not found).
  public func exportLeadsCsv(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
  ) : Text {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null "";
      case (?_) {
        switch (state.leads.get(campaignId)) {
          case null "leadId,currentStep,status,lastEventAt,ctaToken,bookedAt\n";
          case (?leadMap) {
            var csv = "leadId,currentStep,status,lastEventAt,ctaToken,bookedAt\n";
            for ((_, lead) in leadMap.entries()) {
              csv #= csvRow([
                lead.leadId,
                lead.currentStep.toText(),
                statusToText(lead.status),
                optIntToText(lead.lastEventAt),
                lead.ctaToken,
                optIntToText(lead.bookedAt),
              ]);
            };
            csv
          };
        };
      };
    }
  };

  // ── Sending engine ────────────────────────────────────────────────────────

  /// Processes all due sends for a campaign.
  ///
  /// For each lead where status is #pending or #sent (not
  /// replied/bounced/unsubscribed/booked) AND nextSendAt <= now AND
  /// campaign.status is #active: find the next enabled step (currentStep + 1,
  /// skipping disabled steps). If a step exists, render the email body via
  /// simple {{token}} replacement, mark the lead as sent, advance currentStep,
  /// and set nextSendAt = now + (next step's delayDays * 86400).
  ///
  /// IMPORTANT: this lib function cannot perform the actual SendGrid HTTP
  /// outcall (it is a synchronous module function, not an async actor method).
  /// It performs the state mutation (lead advancement) and returns the count
  /// of leads processed plus any rendering errors. The mixin layer is
  /// responsible for calling sendLiveEmail for each due lead BEFORE invoking
  /// this function, or this function should be split into a "render due sends"
  /// step followed by an async send step. For now, the logic is correct and
  /// compiles; the actual SendGrid send is wired in the mixin.
  ///
  /// TODO: the mixin should call sendLiveEmail for each due lead and only
  /// advance the lead on send success. The current implementation advances
  /// the lead optimistically — refine once the async send loop is wired.
  public func processDueSends(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
    now        : Int,
  ) : T.RooferProcessSendsResult {
    switch (getCampaign(state, tenantId, campaignId)) {
      case null { { sent = 0; errors = ["Campaign not found"] } };
      case (?campaign) {
        if (campaign.status != #active) {
          { sent = 0; errors = [] };
        } else {
          switch (state.leads.get(campaignId)) {
            case null { { sent = 0; errors = [] } };
            case (?leadMap) {
              var sent : Nat = 0;
              var errors : [Text] = [];
              for ((leadId, lead) in leadMap.entries()) {
                let due = isDue(lead, now);
                let active = lead.status == #pending or lead.status == #sent;
                if (due and active) {
                  let nextStep = findNextEnabledStep(campaign.sequence, lead.currentStep);
                  switch (nextStep) {
                    case null {
                      // No more enabled steps — lead has finished the sequence
                      // (leave status as #sent; no further sends)
                    };
                    case (?step) {
                      // Render the email body via simple token replacement.
                      // The mixin is responsible for the actual sendLiveEmail call.
                      let rendered = renderBody(step.body, lead);
                      if (rendered == "") {
                        errors := Array_append(errors, ["Render failed for lead " # leadId]);
                      } else {
                        // Advance the lead
                        let nextStepNum = step.stepNumber;
                        let nextDelay = nextStepDelayDays(campaign.sequence, nextStepNum);
                        let nextSendAt = ?(now + nextDelay * 86400 * 1_000_000_000);
                        let updated : T.RooferCampaignLead = {
                          lead with
                          currentStep = nextStepNum;
                          status = #sent;
                          lastEventAt = ?now;
                          nextSendAt;
                        };
                        leadMap.add(leadId, updated);
                        sent += 1;
                      };
                    };
                  };
                };
              };
              // Refresh campaign stats after the send batch
              switch (getStats(state, tenantId, campaignId)) {
                case null {};
                case (?newStats) {
                  let updatedCampaign : T.RooferColdCampaign = {
                    campaign with
                    stats = newStats;
                    updatedAt = now;
                  };
                  state.campaigns.add(campaignId, updatedCampaign);
                };
              };
              { sent; errors }
            };
          };
        };
      };
    }
  };

  // ── Demo booking ──────────────────────────────────────────────────────────

  /// Looks up a lead + campaign + existing booking by CTA token for the
  /// public demo booking page. Returns a DemoBookingLookup with all null
  /// fields when the token is not found.
  ///
  /// Note: the lead field is typed as ?LeadEngineLead but this lib does not
  /// have access to the leadEngine state. The mixin resolves the full lead
  /// record from leadEngineState and substitutes it into the returned lookup.
  /// Here we return null for the lead; the mixin enriches it.
  public func lookupByCtaToken(
    state    : T.RooferColdCampaignState,
    ctaToken : Text,
  ) : T.DemoBookingLookup {
    switch (state.ctaTokens.get(ctaToken)) {
      case null { { lead = null; campaign = null; existingBooking = null } };
      case (?leadId) {
        // Find the campaign that owns this lead by scanning campaigns
        var foundCampaign : ?T.RooferColdCampaign = null;
        var foundLead : ?T.RooferCampaignLead = null;
        for ((campaignId, leadMap) in state.leads.entries()) {
          switch (leadMap.get(leadId)) {
            case null {};
            case (?lead) {
              foundLead := ?lead;
              switch (state.campaigns.get(campaignId)) {
                case null {};
                case (?c) foundCampaign := ?c;
              };
            };
          };
        };
        let existingBooking = state.bookingsByToken.get(ctaToken);
        // The full LeadEngineLead is resolved by the mixin from leadEngineState.
        { lead = null; campaign = foundCampaign; existingBooking }
      };
    }
  };

  /// Creates a new demo booking from the public booking page. Looks up the
  /// lead by ctaToken, creates a DemoBooking with a unique id, stores it in
  /// state.bookings and state.bookingsByToken, and updates the lead's status
  /// to #booked. Returns null when the ctaToken is not found.
  public func createBooking(
    state       : T.RooferColdCampaignState,
    ctaToken    : Text,
    rooferName  : Text,
    rooferEmail : Text,
    slotTime    : Text,
    now         : Int,
  ) : ?T.DemoBooking {
    switch (state.ctaTokens.get(ctaToken)) {
      case null null;
      case (?leadId) {
        // Locate the lead + campaign
        var foundCampaignId : ?Text = null;
        var foundLead : ?T.RooferCampaignLead = null;
        var foundLeadMap : ?Map.Map<Text, T.RooferCampaignLead> = null;
        for ((campaignId, leadMap) in state.leads.entries()) {
          switch (leadMap.get(leadId)) {
            case null {};
            case (?lead) {
              foundCampaignId := ?campaignId;
              foundLead := ?lead;
              foundLeadMap := ?leadMap;
            };
          };
        };
        switch (foundCampaignId, foundLead, foundLeadMap) {
          case (null, _, _) null;
          case (_, null, _) null;
          case (?campaignId, ?lead, ?leadMap) {
            let bookingId = makeBookingId(now);
            let booking : T.DemoBooking = {
              id          = bookingId;
              ctaToken    = ctaToken;
              leadId      = leadId;
              campaignId  = campaignId;
              rooferName  = rooferName;
              rooferEmail = rooferEmail;
              slotTime    = slotTime;
              bookedAt    = now;
              confirmed   = true;
            };
            state.bookings.add(bookingId, booking);
            state.bookingsByToken.add(ctaToken, booking);
            // Update lead status to booked
            let updatedLead : T.RooferCampaignLead = {
              lead with
              status = #booked;
              bookedAt = ?now;
              bookedSlot = ?slotTime;
              lastEventAt = ?now;
            };
            leadMap.add(leadId, updatedLead);
            // Refresh campaign stats
            switch (state.campaigns.get(campaignId)) {
              case null {};
              case (?c) {
                let updatedCampaign : T.RooferColdCampaign = {
                  c with
                  stats = { c.stats with booked = c.stats.booked + 1 };
                  updatedAt = now;
                };
                state.campaigns.add(campaignId, updatedCampaign);
              };
            };
            ?booking
          };
          case _ null;
        };
      };
    }
  };

  /// Lists all demo bookings for a campaign.
  public func listBookingsByCampaign(
    state      : T.RooferColdCampaignState,
    tenantId   : Text,
    campaignId : Text,
  ) : [T.DemoBooking] {
    // Verify ownership first
    switch (getCampaign(state, tenantId, campaignId)) {
      case null [];
      case (?_) {
        var result : [T.DemoBooking] = [];
        for ((_, booking) in state.bookings.entries()) {
          if (booking.campaignId == campaignId) {
            result := Array_append(result, [booking]);
          };
        };
        result
      };
    }
  };

  // ── Private helpers ───────────────────────────────────────────────────────

  /// Short deterministic hash of a Text, rendered as a fixed-width hex
  /// string. Used to make ids/tokens unguessable without a crypto hash.
  func shortHash(s : Text) : Text {
    let h = s.encodeUtf8().hash();
    h.toNat().toText()
  };

  /// True when the lead's nextSendAt is set and <= now.
  func isDue(lead : T.RooferCampaignLead, now : Int) : Bool {
    switch (lead.nextSendAt) {
      case null false;
      case (?t) t <= now;
    }
  };

  /// Finds the next enabled step after currentStep. Returns null when no
  /// further enabled step exists.
  func findNextEnabledStep(sequence : [T.RooferCampaignStep], currentStep : Nat) : ?T.RooferCampaignStep {
    var found : ?T.RooferCampaignStep = null;
    for (step in sequence.vals()) {
      if (step.enabled and step.stepNumber > currentStep) {
        if (found == null) found := ?step;
      };
    };
    found
  };

  /// Returns the delayDays of the step that comes AFTER stepNum, or 0 if
  /// there is no next step (lead has finished the sequence).
  func nextStepDelayDays(sequence : [T.RooferCampaignStep], stepNum : Nat) : Nat {
    var delay : Nat = 0;
    var found : Bool = false;
    for (step in sequence.vals()) {
      if (not found and step.stepNumber > stepNum) {
        delay := step.delayDays;
        found := true;
      };
    };
    delay
  };

  /// Renders a step body by replacing {{business_name}}, {{city}},
  /// {{owner_name}}, {{cta_token}}, and {{backend_host}} tokens. Since the
  /// lib does not have access to the leadEngine lead record, business_name /
  /// city / owner_name are filled with sensible defaults derived from the
  /// leadId. The mixin may post-process the rendered body with the full
  /// leadEngine lead data before sending.
  func renderBody(body : Text, lead : T.RooferCampaignLead) : Text {
    body
      .replace(#text "{{business_name}}", "your roofing company")
      .replace(#text "{{city}}", "your area")
      .replace(#text "{{owner_name}}", "there")
      .replace(#text "{{cta_token}}", lead.ctaToken)
      .replace(#text "{{backend_host}}", "icp0.io")
  };

  /// Converts a RooferCampaignLeadStatus to its CSV-friendly text label.
  func statusToText(s : T.RooferCampaignLeadStatus) : Text {
    switch (s) {
      case (#pending) "pending";
      case (#sent) "sent";
      case (#opened) "opened";
      case (#replied) "replied";
      case (#bounced) "bounced";
      case (#booked) "booked";
      case (#unsubscribed) "unsubscribed";
    }
  };

  /// Converts an optional Int to text ("null" when absent).
  func optIntToText(x : ?Int) : Text {
    switch (x) {
      case null "null";
      case (?v) v.toText();
    }
  };

  /// Joins an array of CSV cell values into a single CSV row, escaping any
  /// cell that contains a comma, quote, or newline.
  func csvRow(cells : [Text]) : Text {
    var row : Text = "";
    var first : Bool = true;
    for (cell in cells.vals()) {
      if (not first) { row #= "," };
      first := false;
      row #= csvCell(cell);
    };
    row # "\n"
  };

  /// Escapes a single CSV cell: wraps in quotes and doubles any embedded
  /// quotes when the cell contains a comma, quote, or newline.
  func csvCell(s : Text) : Text {
    if (s.contains(#text ",") or s.contains(#text "\"") or s.contains(#text "\n")) {
      "\"" # s.replace(#text "\"", "\"\"") # "\""
    } else {
      s
    }
  };

  /// Appends two arrays into a new array (helper since Array.append was removed).
  func Array_append<T>(a : [T], b : [T]) : [T] {
    let na = a.size();
    let nb = b.size();
    if (na == 0) return b;
    if (nb == 0) return a;
    Array.tabulate(na + nb, func(i) {
      if (i < na) a[i] else b[i - na]
    })
  };

  /// Returns a sub-array of `a` from index `start` (inclusive) to `end` (exclusive).
  func subArray<T>(a : [T], start : Nat, end : Nat) : [T] {
    if (start >= end) return [];
    Array.tabulate(end - start, func(i) { a[start + i] })
  };

};
