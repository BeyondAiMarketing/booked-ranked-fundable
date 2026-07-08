import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {

  /// Lifecycle status of a Roofer Cold Campaign.
  public type RooferColdCampaignStatus = {
    #draft;
    #active;
    #paused;
    #completed;
  };

  /// Per-lead status within a roofer cold campaign. Drives the inline
  /// per-lead status badges (sent/opened/replied/bounced/booked) on the
  /// /roofer-campaign page.
  public type RooferCampaignLeadStatus = {
    #pending;
    #sent;
    #opened;
    #replied;
    #bounced;
    #booked;
    #unsubscribed;
  };

  /// A single editable step in the 7-step roofer cold email sequence.
  /// Defaults to the existing 7-step roofing templates but is fully editable
  /// via rooferColdCampaign_updateSequence.
  public type RooferCampaignStep = {
    stepNumber            : Nat;
    subject               : Text;
    body                  : Text;
    delayDays             : Nat;
    sendTime              : Text;
    enabled               : Bool;
    personalizationTokens : [Text];
  };

  /// Aggregate stats for a single campaign. Updated as sends/events occur.
  public type RooferCampaignStats = {
    totalLeads    : Nat;
    sent          : Nat;
    opened        : Nat;
    replied       : Nat;
    bounced       : Nat;
    booked        : Nat;
    unsubscribed  : Nat;
  };

  /// A roofer cold email campaign. Lives as a NEW dedicated entity separate
  /// from the legacy RoofingCampaignManager.
  public type RooferColdCampaign = {
    id              : Text;
    tenantId        : Text;
    name            : Text;
    leadListFilter  : Text;
    senderName      : Text;
    senderEmail     : Text;
    status          : RooferColdCampaignStatus;
    createdAt       : Int;
    updatedAt       : Int;
    sequence        : [RooferCampaignStep];
    enrolledLeadIds : [Text];
    stats           : RooferCampaignStats;
  };

  /// A lead enrolled in a roofer cold campaign. Tracks per-lead progress
  /// through the sequence and the CTA token used to match demo bookings.
  public type RooferCampaignLead = {
    campaignId   : Text;
    leadId       : Text;
    currentStep  : Nat;
    status       : RooferCampaignLeadStatus;
    lastEventAt  : ?Int;
    nextSendAt   : ?Int;
    ctaToken     : Text;
    bookedAt     : ?Int;
    bookedSlot   : ?Text;
  };

  /// A public demo booking matched to a lead by unique CTA token.
  /// The demo booking page is public (no login): name + email first, then
  /// time slots, then confirm.
  public type DemoBooking = {
    id          : Text;
    ctaToken    : Text;
    leadId      : Text;
    campaignId  : Text;
    rooferName  : Text;
    rooferEmail : Text;
    slotTime    : Text;
    bookedAt    : Int;
    confirmed   : Bool;
  };

  /// Lightweight summary used by rooferColdCampaign_list.
  public type RooferCampaignSummary = {
    id         : Text;
    name       : Text;
    status     : RooferColdCampaignStatus;
    leadCount  : Nat;
    sent       : Nat;
    opened     : Nat;
    replied    : Nat;
    bounced    : Nat;
    booked     : Nat;
  };

  /// Paginated list result for rooferColdCampaign_list.
  public type RooferCampaignListResult = {
    campaigns : [RooferCampaignSummary];
    total     : Nat;
  };

  /// Result of enrolling leads into a campaign.
  public type RooferEnrollResult = {
    enrolled : Nat;
    skipped  : Nat;
  };

  /// Paginated result for rooferColdCampaign_getLeads.
  public type RooferCampaignLeadsPage = {
    leads : [RooferCampaignLead];
    total : Nat;
  };

  /// Result of processing due sends for a campaign.
  public type RooferProcessSendsResult = {
    sent   : Nat;
    errors : [Text];
  };

  /// Lookup result for demoBooking_getByCtaToken — returns the matching lead,
  /// campaign, and any existing booking so the public booking page can render
  /// the right context.
  public type DemoBookingLookup = {
    lead           : ?LeadEngineLead;
    campaign       : ?RooferColdCampaign;
    existingBooking : ?DemoBooking;
  };

  // ── Re-exported shared types for convenience ───────────────────────────────
  // LeadEngineLead and NormalizedWebhookEvent are imported by lib/mixin files
  // directly from their own type modules; we re-declare opaque aliases here
  // only where a RooferColdCampaign type needs to reference them by name.
  // To avoid a circular import (lead-engine.mo / webhookInbox.mo do not
  // import this file), we keep DemoBookingLookup.lead as an opaque Any-like
  // placeholder that the develop phase will type against the real import.

  /// Placeholder for the LeadEngineLead type. The develop phase will replace
  /// this with a direct import of LeadEngineLead from types/lead-engine.mo
  /// in the lib/mixin files; the public API returns the real type.
  public type LeadEngineLead = Any;

  /// Stable state bucket for the Roofer Cold Campaign subsystem.
  /// Per-tenant campaign and booking maps are keyed by tenantId / campaignId.
  public type RooferColdCampaignState = {
    var campaigns        : Map.Map<Text, RooferColdCampaign>;
    var leads            : Map.Map<Text, Map.Map<Text, RooferCampaignLead>>;
    var bookings         : Map.Map<Text, DemoBooking>;
    var bookingsByToken  : Map.Map<Text, DemoBooking>;
    var ctaTokens        : Map.Map<Text, Text>; // ctaToken -> leadId
  };

  /// Returns an empty RooferColdCampaignState for initial canister state.
  public func emptyRooferColdCampaignState() : RooferColdCampaignState = {
    var campaigns       = Map.empty();
    var leads           = Map.empty();
    var bookings        = Map.empty();
    var bookingsByToken = Map.empty();
    var ctaTokens       = Map.empty();
  };

  /// Feature flag name used to gate all Roofer Cold Campaign methods.
  /// Defaults to true (enabled) — additive only.
  public let ROOFER_COLD_CAMPAIGN_ENABLED_FLAG : Text = "ROOFER_COLD_CAMPAIGN_ENABLED";

};
