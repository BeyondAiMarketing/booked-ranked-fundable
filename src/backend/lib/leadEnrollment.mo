import Map        "mo:core/Map";
import List       "mo:core/List";
import Text       "mo:core/Text";
import T          "../types/leadEnrollment";
import CsvT       "../types/csvImport";
import DripT      "../types/dripCampaigns";
import FunnelLib  "../lib/funnelTracking";

module {

  public type State = {
    /// campaignId → Set<leadId>  (already-enrolled guard)
    enrolledLeads : Map.Map<Text, Map.Map<Text, Bool>>;
  };

  public func emptyState() : State = {
    enrolledLeads = Map.empty();
  };

  /// Enroll all roofing leads from extendedLeads into the given drip queue,
  /// respecting the dailyLimit and skipping already-enrolled leads.
  public func enrollRoofingLeads(
    state         : State,
    extendedLeads : Map.Map<Text, Map.Map<Text, CsvT.ExtendedLead>>,
    dripQueues    : Map.Map<Text, DripT.DripQueue>,
    funnelState   : FunnelLib.State,
    campaignId    : Text,
    dailyLimit    : Nat,
  ) : T.EnrollmentResult {
    // Fetch or create the enrolled-leads set for this campaign
    let enrolled = switch (state.enrolledLeads.get(campaignId)) {
      case (?s) s;
      case null {
        let s = Map.empty<Text, Bool>();
        state.enrolledLeads.add(campaignId, s);
        s;
      };
    };

    var count   = 0;
    var skipped = 0;
    let errors  = List.empty<Text>();

    // Walk all tenants
    label outerLoop for ((_, tenantMap) in extendedLeads.entries()) {
      for ((leadId, lead) in tenantMap.entries()) {
        if (count >= dailyLimit) break outerLoop;

        // Niche filter: case-insensitive "roofing" match
        let nicheMatch = lead.niche.toLower().contains(#text "roofing");
        if (not nicheMatch) {
          skipped += 1;
        } else if (enrolled.get(leadId) != null) {
          // Already enrolled
          skipped += 1;
        } else {
          // Add to the drip queue contact lists
          switch (dripQueues.get(campaignId)) {
            case null {
              errors.add("Campaign not found: " # campaignId);
              break outerLoop;
            };
            case (?q) {
              let updatedEmails = q.contactEmails.concat([lead.email]);
              let updatedNames  = q.contactNames.concat([lead.name]);
              dripQueues.add(campaignId, { q with contactEmails = updatedEmails; contactNames = updatedNames });
              enrolled.add(leadId, true);
              FunnelLib.logStep(funnelState, leadId, #EmailSent, ?("campaign:" # campaignId));
              count += 1;
            };
          };
        };
      };
    };

    { enrolledCount = count; skippedCount = skipped; errors = errors.toArray() };
  };

  /// Return enrollment status for a campaign.
  public func getEnrollmentStatus(
    state      : State,
    dripQueues : Map.Map<Text, DripT.DripQueue>,
    campaignId : Text,
  ) : { total : Nat; enrolled : Nat; pending : Nat } {
    let total = switch (dripQueues.get(campaignId)) {
      case (?q) q.contactEmails.size();
      case null 0;
    };
    let enrolledCount = switch (state.enrolledLeads.get(campaignId)) {
      case (?s) {
        var n = 0;
        for (_ in s.entries()) { n += 1 };
        n;
      };
      case null 0;
    };
    let pending = if (total > enrolledCount) (total - enrolledCount : Nat) else 0;
    { total; enrolled = enrolledCount; pending };
  };

};
