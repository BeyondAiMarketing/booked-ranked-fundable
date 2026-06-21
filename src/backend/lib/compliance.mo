import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";

import ComplianceTypes "../types/compliance";

module ComplianceLib {
  public type State = {
    rules : Map.Map<Text, ComplianceTypes.ComplianceRule>;
    consentLogs : Map.Map<Text, ComplianceTypes.ConsentLog>;
    unsubscribes : Map.Map<Text, ComplianceTypes.UnsubscribeRecord>;
    var nextId : Nat;
  };

  public func emptyState() : State {
    {
      rules = Map.empty<Text, ComplianceTypes.ComplianceRule>();
      consentLogs = Map.empty<Text, ComplianceTypes.ConsentLog>();
      unsubscribes = Map.empty<Text, ComplianceTypes.UnsubscribeRecord>();
      var nextId = 0;
    };
  };

  public func generateId(state : State) : Text {
    state.nextId += 1;
    "cr-" # Nat.toText(state.nextId);
  };

  public func generateConsentId(state : State) : Text {
    state.nextId += 1;
    "cl-" # Nat.toText(state.nextId);
  };

  public func generateUnsubscribeId(state : State) : Text {
    state.nextId += 1;
    "us-" # Nat.toText(state.nextId);
  };

  public func createRule(
    state : State,
    req : ComplianceTypes.CreateComplianceRuleRequest,
  ) : ComplianceTypes.ComplianceRuleResult {
    let id = generateId(state);
    let now = Time.now();
    let rule : ComplianceTypes.ComplianceRule = {
      id = id;
      ruleName = req.ruleName;
      ruleType = req.ruleType;
      verticalProfileId = req.verticalProfileId;
      description = req.description;
      prohibitedClaims = req.prohibitedClaims;
      requiredDisclaimers = req.requiredDisclaimers;
      approvalRequired = req.approvalRequired;
      approvalTier = req.approvalTier;
      riskLevel = req.riskLevel;
      autoFlagTriggers = req.autoFlagTriggers;
      createdAt = now;
      updatedAt = now;
    };
    state.rules.add(id, rule);
    #ok(rule);
  };

  public func getRule(
    state : State,
    id : Text,
  ) : ComplianceTypes.ComplianceRuleResult {
    switch (state.rules.get(id)) {
      case (?rule) { #ok(rule) };
      case (null) { #err("Compliance rule not found") };
    };
  };

  public func updateRule(
    state : State,
    id : Text,
    req : ComplianceTypes.UpdateComplianceRuleRequest,
  ) : ComplianceTypes.ComplianceRuleResult {
    switch (state.rules.get(id)) {
      case (?existing) {
        let updated : ComplianceTypes.ComplianceRule = {
          id = existing.id;
          ruleName = switch (req.ruleName) { case (?v) v; case (null) existing.ruleName };
          ruleType = switch (req.ruleType) { case (?v) v; case (null) existing.ruleType };
          verticalProfileId = switch (req.verticalProfileId) { case (?v) ?v; case (null) existing.verticalProfileId };
          description = switch (req.description) { case (?v) v; case (null) existing.description };
          prohibitedClaims = switch (req.prohibitedClaims) { case (?v) v; case (null) existing.prohibitedClaims };
          requiredDisclaimers = switch (req.requiredDisclaimers) { case (?v) v; case (null) existing.requiredDisclaimers };
          approvalRequired = switch (req.approvalRequired) { case (?v) v; case (null) existing.approvalRequired };
          approvalTier = switch (req.approvalTier) { case (?v) v; case (null) existing.approvalTier };
          riskLevel = switch (req.riskLevel) { case (?v) v; case (null) existing.riskLevel };
          autoFlagTriggers = switch (req.autoFlagTriggers) { case (?v) v; case (null) existing.autoFlagTriggers };
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        state.rules.add(id, updated);
        #ok(updated);
      };
      case (null) { #err("Compliance rule not found") };
    };
  };

  public func deleteRule(
    state : State,
    id : Text,
  ) : ComplianceTypes.ComplianceRuleResult {
    switch (state.rules.get(id)) {
      case (?rule) {
        ignore state.rules.remove(id);
        #ok(rule);
      };
      case (null) { #err("Compliance rule not found") };
    };
  };

  public func listRules(
    state : State,
  ) : [ComplianceTypes.ComplianceRule] {
    let buffer = List.empty<ComplianceTypes.ComplianceRule>();
    for ((_, rule) in state.rules.entries()) {
      buffer.add(rule);
    };
    buffer.toArray();
  };

  public func listRulesByVertical(
    state : State,
    verticalProfileId : Text,
  ) : [ComplianceTypes.ComplianceRule] {
    let buffer = List.empty<ComplianceTypes.ComplianceRule>();
    for ((_, rule) in state.rules.entries()) {
      switch (rule.verticalProfileId) {
        case (?v) { if (v == verticalProfileId) { buffer.add(rule) } };
        case (null) {};
      };
    };
    buffer.toArray();
  };

  public func logConsent(
    state : State,
    contactId : Text,
    consentType : Text,
    channel : Text,
    granted : Bool,
    source : Text,
    ipAddress : ?Text,
    notes : ?Text,
  ) : ComplianceTypes.ConsentLogResult {
    let id = generateConsentId(state);
    let log : ComplianceTypes.ConsentLog = {
      id = id;
      contactId = contactId;
      consentType = consentType;
      channel = channel;
      granted = granted;
      grantedAt = Time.now();
      revokedAt = null;
      source = source;
      ipAddress = ipAddress;
      notes = notes;
    };
    state.consentLogs.add(id, log);
    #ok(log);
  };

  public func revokeConsent(
    state : State,
    logId : Text,
  ) : ComplianceTypes.ConsentLogResult {
    switch (state.consentLogs.get(logId)) {
      case (?existing) {
        let updated : ComplianceTypes.ConsentLog = {
          id = existing.id;
          contactId = existing.contactId;
          consentType = existing.consentType;
          channel = existing.channel;
          granted = false;
          grantedAt = existing.grantedAt;
          revokedAt = ?Time.now();
          source = existing.source;
          ipAddress = existing.ipAddress;
          notes = existing.notes;
        };
        state.consentLogs.add(logId, updated);
        #ok(updated);
      };
      case (null) { #err("Consent log not found") };
    };
  };

  public func recordUnsubscribe(
    state : State,
    email : ?Text,
    phone : ?Text,
    channel : Text,
    source : Text,
    reason : ?Text,
  ) : ComplianceTypes.UnsubscribeResult {
    let id = generateUnsubscribeId(state);
    let record : ComplianceTypes.UnsubscribeRecord = {
      id = id;
      email = email;
      phone = phone;
      channel = channel;
      unsubscribedAt = Time.now();
      source = source;
      reason = reason;
    };
    state.unsubscribes.add(id, record);
    #ok(record);
  };

  public func checkContentCompliance(
    state : State,
    content : Text,
    verticalProfileId : ?Text,
  ) : [ComplianceTypes.ComplianceCheckResult] {
    let results = List.empty<ComplianceTypes.ComplianceCheckResult>();
    for ((_, rule) in state.rules.entries()) {
      let applies = switch (verticalProfileId) {
        case (?vpId) {
          switch (rule.verticalProfileId) {
            case (?ruleVpId) { ruleVpId == vpId };
            case (null) { true };
          };
        };
        case (null) { true };
      };
      if (applies) {
        for (trigger in rule.autoFlagTriggers.vals()) {
          if (Text.contains(content, #text trigger)) {
            results.add({
              passed = false;
              ruleId = rule.id;
              ruleName = rule.ruleName;
              severity = rule.riskLevel;
              message = "Content contains flagged trigger: " # trigger;
              suggestedFix = ?("Review against rule: " # rule.description);
            });
          };
        };
      };
    };
    results.toArray();
  };

  public func isUnsubscribed(
    state : State,
    email : ?Text,
    phone : ?Text,
    channel : Text,
  ) : Bool {
    for ((_, record) in state.unsubscribes.entries()) {
      let emailMatch = switch (email, record.email) {
        case (?e, ?re) { e == re };
        case (_) { false };
      };
      let phoneMatch = switch (phone, record.phone) {
        case (?p, ?rp) { p == rp };
        case (_) { false };
      };
      if ((emailMatch or phoneMatch) and record.channel == channel) {
        return true;
      };
    };
    false;
  };
}
