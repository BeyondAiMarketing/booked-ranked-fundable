import Map          "mo:core/Map";
import List         "mo:core/List";
import LELib        "../lib/leadEnrollment";
import FunnelLib    "../lib/funnelTracking";
import T            "../types/leadEnrollment";
import CsvT         "../types/csvImport";
import DripT        "../types/dripCampaigns";

mixin (
  enrollmentState : LELib.State,
  extendedLeads   : Map.Map<Text, Map.Map<Text, CsvT.ExtendedLead>>,
  dripQueues      : Map.Map<Text, DripT.DripQueue>,
  funnelState     : FunnelLib.State,
) {

  /// Enroll all roofing leads into the specified campaign (respects dailyLimit).
  public shared ({ caller = _ }) func enrollAllRoofingLeads(
    campaignId : Text,
    dailyLimit : Nat,
  ) : async { #ok : T.EnrollmentResult; #err : Text } {
    let result = LELib.enrollRoofingLeads(
      enrollmentState,
      extendedLeads,
      dripQueues,
      funnelState,
      campaignId,
      dailyLimit,
    );
    #ok result;
  };

  /// Return enrollment status for a campaign.
  public query ({ caller = _ }) func getLeadEnrollmentStatus(
    campaignId : Text,
  ) : async { #ok : { total : Nat; enrolled : Nat; pending : Nat }; #err : Text } {
    #ok (LELib.getEnrollmentStatus(enrollmentState, dripQueues, campaignId));
  };

};
