import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import T "../types/rooferColdCampaign";
import FTTypes "../types/featureToggle";
import Lib "../lib/rooferColdCampaign";
import LeadEngineTypes "../types/lead-engine";
import WebhookInboxTypes "../types/webhookInbox";

/// Roofer Cold Campaign API mixin.
///
/// Exposes the public API for the roofer cold email campaign system that
/// lives as a NEW dedicated page at /roofer-campaign, separate from the
/// legacy RoofingCampaignManager. All rooferColdCampaign_* methods are gated
/// by the ROOFER_COLD_CAMPAIGN_ENABLED feature flag (default true) and
/// require user permission. The demoBooking_* methods are PUBLIC (no login)
/// per the public demo booking page requirement.
///
/// Injects:
///   - accessControlState — caller auth
///   - state              — RooferColdCampaignState (campaigns, leads, bookings)
///   - featureToggles     — Map<Text, FeatureToggle> (for the gate)
mixin (
  accessControlState : AccessControl.AccessControlState,
  state              : T.RooferColdCampaignState,
  featureToggles     : Map.Map<Text, FTTypes.FeatureToggle>,
) {

  /// Returns true when the ROOFER_COLD_CAMPAIGN_ENABLED feature flag is on
  /// for any tier. Defaults to true (enabled) when the flag is absent —
  /// additive only.
  private func rooferColdCampaignEnabled() : Bool {
    switch (featureToggles.get(T.ROOFER_COLD_CAMPAIGN_ENABLED_FLAG)) {
      case (?ft) { ft.basicEnabled or ft.proEnabled or ft.agencyEnabled };
      case (null) { true };
    };
  };

  /// Creates a new roofer cold campaign in draft status.
  public shared ({ caller }) func rooferColdCampaign_create(
    tenantId       : Text,
    name           : Text,
    leadListFilter : Text,
    senderName     : Text,
    senderEmail    : Text,
  ) : async T.RooferColdCampaign {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not rooferColdCampaignEnabled()) {
      Runtime.trap("Roofer Cold Campaign feature is disabled");
    };
    Lib.createCampaign(state, tenantId, name, leadListFilter, senderName, senderEmail, Time.now())
  };

  /// Lists all roofer cold campaigns for a tenant.
  public query func rooferColdCampaign_list(
    tenantId : Text,
  ) : async [T.RooferCampaignSummary] {
    Lib.listCampaigns(state, tenantId)
  };

  /// Returns a single roofer cold campaign by id.
  public query func rooferColdCampaign_get(
    tenantId   : Text,
    campaignId : Text,
  ) : async ?T.RooferColdCampaign {
    Lib.getCampaign(state, tenantId, campaignId)
  };

  /// Replaces the editable sequence on a campaign.
  public shared ({ caller }) func rooferColdCampaign_updateSequence(
    tenantId   : Text,
    campaignId : Text,
    sequence   : [T.RooferCampaignStep],
  ) : async ?T.RooferColdCampaign {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not rooferColdCampaignEnabled()) {
      Runtime.trap("Roofer Cold Campaign feature is disabled");
    };
    Lib.updateSequence(state, tenantId, campaignId, sequence, Time.now())
  };

  /// Enrolls a set of Lead Engine lead ids into a campaign.
  public shared ({ caller }) func rooferColdCampaign_enrollLeads(
    tenantId   : Text,
    campaignId : Text,
    leadIds    : [Text],
  ) : async T.RooferEnrollResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not rooferColdCampaignEnabled()) {
      Runtime.trap("Roofer Cold Campaign feature is disabled");
    };
    Lib.enrollLeads(state, tenantId, campaignId, leadIds, Time.now())
  };

  /// Returns a paginated slice of enrolled leads for a campaign.
  public query func rooferColdCampaign_getLeads(
    tenantId   : Text,
    campaignId : Text,
    offset     : Nat,
    limit      : Nat,
  ) : async T.RooferCampaignLeadsPage {
    Lib.getLeads(state, tenantId, campaignId, offset, limit)
  };

  /// Manually starts sending for a campaign (draft/paused -> active).
  public shared ({ caller }) func rooferColdCampaign_startSending(
    tenantId   : Text,
    campaignId : Text,
  ) : async ?T.RooferColdCampaign {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not rooferColdCampaignEnabled()) {
      Runtime.trap("Roofer Cold Campaign feature is disabled");
    };
    Lib.startSending(state, tenantId, campaignId, Time.now())
  };

  /// Pauses an active campaign.
  public shared ({ caller }) func rooferColdCampaign_pauseSending(
    tenantId   : Text,
    campaignId : Text,
  ) : async ?T.RooferColdCampaign {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not rooferColdCampaignEnabled()) {
      Runtime.trap("Roofer Cold Campaign feature is disabled");
    };
    Lib.pauseSending(state, tenantId, campaignId, Time.now())
  };

  /// Returns the aggregate stats for a campaign.
  public query func rooferColdCampaign_getStats(
    tenantId   : Text,
    campaignId : Text,
  ) : async ?T.RooferCampaignStats {
    Lib.getStats(state, tenantId, campaignId)
  };

  /// Returns the webhook reply events for a campaign.
  public query func rooferColdCampaign_getReplies(
    tenantId   : Text,
    campaignId : Text,
  ) : async [WebhookInboxTypes.NormalizedWebhookEvent] {
    Lib.getReplies(state, tenantId, campaignId)
  };

  /// Exports enrolled leads as a CSV string.
  public query func rooferColdCampaign_exportLeadsCsv(
    tenantId   : Text,
    campaignId : Text,
  ) : async Text {
    Lib.exportLeadsCsv(state, tenantId, campaignId)
  };

  /// Processes all due sends for a campaign.
  ///
  /// Delegates to Lib.processDueSends which performs the lead-advancement
  /// state mutation. The actual SendGrid send (sendLiveEmail) for each due
  /// lead is the responsibility of the sending engine; see the TODO in
  /// Lib.processDueSends for the integration path. This method requires user
  /// permission since it triggers outbound email.
  public shared ({ caller }) func rooferColdCampaign_processDueSends(
    tenantId   : Text,
    campaignId : Text,
  ) : async T.RooferProcessSendsResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not rooferColdCampaignEnabled()) {
      Runtime.trap("Roofer Cold Campaign feature is disabled");
    };
    // TODO: before advancing lead state, iterate due leads and call
    // sendLiveEmail(tenantId, leadEmail, senderEmail, subject, renderedBody)
    // for each. Only advance the lead on send success. The current lib
    // implementation advances optimistically; refine once the async send
    // loop is wired here.
    Lib.processDueSends(state, tenantId, campaignId, Time.now())
  };

  /// Looks up a lead + campaign + existing booking by CTA token for the
  /// public demo booking page (no login required).
  public query func demoBooking_getByCtaToken(
    ctaToken : Text,
  ) : async T.DemoBookingLookup {
    Lib.lookupByCtaToken(state, ctaToken)
  };

  /// Creates a new demo booking from the public booking page (no login).
  public shared ({ caller }) func demoBooking_create(
    ctaToken    : Text,
    rooferName  : Text,
    rooferEmail : Text,
    slotTime    : Text,
  ) : async ?T.DemoBooking {
    ignore caller;
    Lib.createBooking(state, ctaToken, rooferName, rooferEmail, slotTime, Time.now())
  };

  /// Lists all demo bookings for a campaign.
  public query func demoBooking_listByCampaign(
    tenantId   : Text,
    campaignId : Text,
  ) : async [T.DemoBooking] {
    Lib.listBookingsByCampaign(state, tenantId, campaignId)
  };

};
