import List      "mo:core/List";
import Map       "mo:core/Map";
import Text      "mo:core/Text";
import Time      "mo:core/Time";
import Principal "mo:core/Principal";

import Types     "../types/adminCommand";
import Lib       "../lib/adminCommand";
import SJS       "../lib/StableJsonStore";
import AuditLog  "../lib/auditLog";
import AuditT    "../types/auditLog";

/// Admin Command Centre mixin.
/// Exposes the activity feed, health metrics, agent registry,
/// agent logs, and auto-trigger rules over the public API boundary.
///
/// Admin actions that mutate command-centre state (health metrics, agent
/// registry, trigger rules) are recorded in the centralized admin audit trail
/// via `AuditLog.appendAdminAudit` (actionType `#adminCommand`). The audit
/// store and nonce are injected from `main.mo`.
mixin (
  activityFeed    : List.List<Types.ActivityFeedItem>,
  healthMetricsRef : { var leadsToday : Nat; var demosRunning : Nat; var trialsActive : Nat; var outreachSent : Nat; var apiStatus : Bool },
  agentRegistry   : Map.Map<Text, Types.AgentStatus>,
  agentLogs       : List.List<Types.AgentLogEntry>,
  triggerRules    : Map.Map<Text, Types.TriggerRule>,
  /// Centralized admin audit trail store (existing StableJsonStore state).
  adminAuditStore : SJS.State,
  /// Per-canister nonce for audit-entry key uniqueness.
  adminAuditNonce : { var n : Nat },
) {

  /// Default tenant id used when no tenant context is available for a command.
  let DEFAULT_TENANT : Text = "system";

  /// Append a `#adminCommand` audit entry. Records the caller principal,
  /// a default tenant, the current timestamp, and a redacted payload describing
  /// the command. Best-effort: never traps the calling flow.
  func auditAdminCommand(caller : Principal, payload : Text) {
    let entry : AuditT.AdminAuditEntry = {
      actorPrincipal  = caller;
      tenantId        = DEFAULT_TENANT;
      actionType      = #adminCommand;
      timestamp       = Time.now();
      redactedPayload = AuditLog.redactSecrets(payload);
    };
    let nonce = adminAuditNonce.n;
    adminAuditNonce.n := nonce + 1;
    AuditLog.appendAdminAudit(adminAuditStore, entry, nonce);
  };

  // -----------------------------------------------------------------------
  // 1. Activity Feed
  // -----------------------------------------------------------------------

  public func addActivityFeedItem(item : Types.ActivityFeedItemInput) : async () {
    Lib.addActivityFeedItem(activityFeed, item);
  };

  public func getRecentActivity(limit : Nat) : async [Types.ActivityFeedItem] {
    Lib.getRecentActivity(activityFeed, limit)
  };

  // -----------------------------------------------------------------------
  // 2. Health Metrics
  // -----------------------------------------------------------------------

  public query func getHealthMetrics() : async Types.HealthMetrics {
    Lib.getHealthMetrics({
      leadsToday   = healthMetricsRef.leadsToday;
      demosRunning = healthMetricsRef.demosRunning;
      trialsActive = healthMetricsRef.trialsActive;
      outreachSent = healthMetricsRef.outreachSent;
      apiStatus    = healthMetricsRef.apiStatus;
    })
  };

  public shared ({ caller }) func updateHealthMetric(metric : Text, value : Nat) : async () {
    Lib.updateHealthMetric(healthMetricsRef, metric, value);
    auditAdminCommand(caller, "updateHealthMetric metric=" # metric # " value=" # value.toText());
  };

  // -----------------------------------------------------------------------
  // 3. Agent Status Registry
  // -----------------------------------------------------------------------

  public query func getAgentStatuses() : async [Types.AgentStatus] {
    Lib.getAgentStatuses(agentRegistry)
  };

  public shared ({ caller }) func updateAgentStatus(agentId : Text, status : Text, error : ?Text) : async () {
    Lib.updateAgentStatus(agentRegistry, agentId, status, error);
    let errText = switch (error) { case (?e) e; case (null) "none" };
    auditAdminCommand(caller, "updateAgentStatus agentId=" # agentId # " status=" # status # " error=" # errText);
  };

  public shared ({ caller }) func setAgentEnabled(agentId : Text, enabled : Bool) : async () {
    Lib.setAgentEnabled(agentRegistry, agentId, enabled);
    auditAdminCommand(caller, "setAgentEnabled agentId=" # agentId # " enabled=" # (if (enabled) "true" else "false"));
  };

  public shared ({ caller }) func updateAgentConfig(agentId : Text, config : Text) : async () {
    Lib.updateAgentConfig(agentRegistry, agentId, config);
    auditAdminCommand(caller, "updateAgentConfig agentId=" # agentId # " config=" # config);
  };

  // -----------------------------------------------------------------------
  // 4. Agent Activity Logs
  // -----------------------------------------------------------------------

  public func addAgentLog(entry : Types.AgentLogEntryInput) : async () {
    Lib.addAgentLog(agentLogs, entry);
  };

  public query func getAgentLogs(agentId : Text, limit : Nat) : async [Types.AgentLogEntry] {
    Lib.getAgentLogs(agentLogs, agentId, limit)
  };

  public query func getAllAgentLogs(limit : Nat) : async [Types.AgentLogEntry] {
    Lib.getAllAgentLogs(agentLogs, limit)
  };

  // -----------------------------------------------------------------------
  // 5. Auto-Trigger Rules
  // -----------------------------------------------------------------------

  public query func getTriggerRules() : async [Types.TriggerRule] {
    Lib.getTriggerRules(triggerRules)
  };

  public shared ({ caller }) func addTriggerRule(rule : Types.TriggerRuleInput) : async Types.TriggerRule {
    let created = Lib.addTriggerRule(triggerRules, rule);
    auditAdminCommand(caller, "addTriggerRule ruleId=" # rule.ruleId # " name=" # rule.name # " action=" # rule.action);
    created
  };

  public shared ({ caller }) func updateTriggerRule(ruleId : Text, updates : Types.TriggerRuleUpdate) : async () {
    Lib.updateTriggerRule(triggerRules, ruleId, updates);
    auditAdminCommand(caller, "updateTriggerRule ruleId=" # ruleId);
  };

  public shared ({ caller }) func deleteTriggerRule(ruleId : Text) : async () {
    Lib.deleteTriggerRule(triggerRules, ruleId);
    auditAdminCommand(caller, "deleteTriggerRule ruleId=" # ruleId);
  };

  public shared ({ caller }) func toggleTriggerRule(ruleId : Text, enabled : Bool) : async () {
    Lib.toggleTriggerRule(triggerRules, ruleId, enabled);
    auditAdminCommand(caller, "toggleTriggerRule ruleId=" # ruleId # " enabled=" # (if (enabled) "true" else "false"));
  };

};
