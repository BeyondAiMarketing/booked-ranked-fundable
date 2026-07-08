import Map        "mo:core/Map";
import List       "mo:core/List";
import Text       "mo:core/Text";
import AIEmailGen "../lib/aiEmailGen";
import AbacusLib  "../lib/abacus";
import CsvT       "../types/csvImport";
import DripT      "../types/dripCampaigns";
import OpenRouterLib "../lib/openRouter";
import ORT           "../types/openRouter";
import LLMFT         "../types/llm-fallback";
import LLMFallbackLib "../lib/llm-fallback";
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
  llmFallbackState : LLMFallbackLib.State,
) {

  /// Default capability for email-generation LLM calls: any model family,
  /// 1024 max tokens, temperature 0.7.
  let eg_capability : LLMFT.TaskCapability = {
    maxTokens   = 1024;
    temperature = 0.7;
    modelFamily = null;
  };

  /// Route an LLM call through the unified fallback chain for email
  /// generation. Calls LLMFallbackLib.route directly (the same lib function
  /// the LLMFallbackMixin wraps) to avoid the cross-mixin method-call issue
  /// where sibling mixins cannot invoke routeLLMCall as an unbound variable.
  /// The legacy fallback closure delegates to OpenRouterLib.callWithFallback
  /// for backward compatibility as the Generic tier.
  private func routeEmailLLM(
    task     : ORT.TaskType,
    messages : [ORT.OpenRouterMessage],
  ) : async Text {
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAll(enc, credSalt);
    };
    let keys = LLMFallbackLib.resolveKeys(creds);
    let flags : LLMFallbackLib.FeatureFlags = {
      leadEngineEnabled = true;
      twilioEnabled      = true;
      sendgridEnabled    = true;
    };
    await LLMFallbackLib.route(
      llmFallbackState,
      task,
      messages,
      keys,
      flags,
      eg_capability,
      transform,
      func(_t : ORT.TaskType, msgs : [ORT.OpenRouterMessage]) : async Text {
        await OpenRouterLib.callWithFallback(
          openRouterState,
          task,
          msgs,
          transform,
          keys.openaiKey,
          keys.geminiKey,
        )
      },
    )
  };

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
        let result = await AIEmailGen.generateTailoredEmail(abacusState, routeEmailLLM, templateBody, ctx);
        #ok result;
      };
    };
  };

};
