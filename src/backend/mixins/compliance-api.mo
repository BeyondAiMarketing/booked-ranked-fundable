import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "mo:caffeineai-authorization/access-control";

import ComplianceTypes "../types/compliance";
import ComplianceLib "../lib/compliance";

module ComplianceMixin {
  public func Mixin(state : ComplianceLib.State) : actor {
    // ---- COMPLIANCE RULE CRUD ----

    public shared ({ caller }) func createComplianceRule(
      req : ComplianceTypes.CreateComplianceRuleRequest,
    ) : async ComplianceTypes.ComplianceRuleResult {
      ComplianceLib.createRule(state, req);
    };

    public shared ({ caller }) func getComplianceRule(
      id : Text,
    ) : async ComplianceTypes.ComplianceRuleResult {
      ComplianceLib.getRule(state, id);
    };

    public shared ({ caller }) func updateComplianceRule(
      id : Text,
      req : ComplianceTypes.UpdateComplianceRuleRequest,
    ) : async ComplianceTypes.ComplianceRuleResult {
      ComplianceLib.updateRule(state, id, req);
    };

    public shared ({ caller }) func deleteComplianceRule(
      id : Text,
    ) : async ComplianceTypes.ComplianceRuleResult {
      ComplianceLib.deleteRule(state, id);
    };

    public shared query ({ caller }) func listComplianceRules() : async ComplianceTypes.ComplianceRuleListResult {
      #ok(ComplianceLib.listRules(state));
    };

    public shared query ({ caller }) func listComplianceRulesByVertical(
      verticalProfileId : Text,
    ) : async ComplianceTypes.ComplianceRuleListResult {
      #ok(ComplianceLib.listRulesByVertical(state, verticalProfileId));
    };

    // ---- CONSENT MANAGEMENT ----

    public shared ({ caller }) func logConsent(
      contactId : Text,
      consentType : Text,
      channel : Text,
      granted : Bool,
      source : Text,
      ipAddress : ?Text,
      notes : ?Text,
    ) : async ComplianceTypes.ConsentLogResult {
      ComplianceLib.logConsent(state, contactId, consentType, channel, granted, source, ipAddress, notes);
    };

    public shared ({ caller }) func revokeConsent(
      logId : Text,
    ) : async ComplianceTypes.ConsentLogResult {
      ComplianceLib.revokeConsent(state, logId);
    };

    // ---- UNSUBSCRIBE MANAGEMENT ----

    public shared ({ caller }) func recordUnsubscribe(
      email : ?Text,
      phone : ?Text,
      channel : Text,
      source : Text,
      reason : ?Text,
    ) : async ComplianceTypes.UnsubscribeResult {
      ComplianceLib.recordUnsubscribe(state, email, phone, channel, source, reason);
    };

    public shared query ({ caller }) func isUnsubscribed(
      email : ?Text,
      phone : ?Text,
      channel : Text,
    ) : async Bool {
      ComplianceLib.isUnsubscribed(state, email, phone, channel);
    };

    // ---- COMPLIANCE CHECKING ----

    public shared query ({ caller }) func checkContentCompliance(
      content : Text,
      verticalProfileId : ?Text,
    ) : async ComplianceTypes.ComplianceCheckResults {
      #ok(ComplianceLib.checkContentCompliance(state, content, verticalProfileId));
    };
  };
}
