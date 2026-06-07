import Map        "mo:core/Map";
import List       "mo:core/List";
import AIEmailGen "../lib/aiEmailGen";
import AbacusLib  "../lib/abacus";
import CsvT       "../types/csvImport";
import DripT      "../types/dripCampaigns";
import OpenRouterLib "../lib/openRouter";
import ICTypes "../types/integrationCredentials";
import ICLib "../lib/integrationCredentials";

mixin (
  abacusState      : AbacusLib.State,
  openRouterState  : OpenRouterLib.State,
  extendedLeads    : Map.Map<Text, Map.Map<Text, CsvT.ExtendedLead>>,
  dripQueues       : Map.Map<Text, DripT.DripQueue>,
  dripEmailLogs    : Map.Map<Text, List.List<DripT.DripQueueEmailLog>>,
  transform        : OpenRouterLib.Transform,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
) {

  /// Generate an AI-tailored email body for a lead using a template from a campaign.
  /// emailIndex is the 0-based index of the campaign's email template step.
  public shared ({ caller = _ }) func generateTailoredEmailForLead(
    leadId         : Text,
    templateBody   : Text,
  ) : async { #ok : Text; #err : Text } {
    // Find lead in any tenant map
    var foundLead : ?CsvT.ExtendedLead = null;
    label search for ((_, tenantMap) in extendedLeads.entries()) {
      switch (tenantMap.get(leadId)) {
        case (?lead) { foundLead := ?lead; break search };
        case null {};
      };
    };
    switch (foundLead) {
      case null { #err ("Lead not found: " # leadId) : { #ok : Text; #err : Text } };
      case (?lead) {
        let ctx : AIEmailGen.LeadContext = {
          businessName = lead.name;
          city         = switch (lead.address) { case (?a) a; case null "" };
          niche        = lead.niche;
          ownerName    = null;
        };
        let geminiKey = switch (integrationCreds.get("platform")) {
          case (null) "";
          case (?enc) ICLib.decryptAll(enc, credSalt).geminiApiKey;
        };
        let openaiKey = switch (integrationCreds.get("platform")) {
          case (null) "";
          case (?enc) ICLib.decryptAll(enc, credSalt).openaiKey;
        };
        let result = await AIEmailGen.generateTailoredEmail(abacusState, openRouterState, templateBody, ctx, transform, openaiKey, geminiKey);
        #ok result;
      };
    };
  };

};
