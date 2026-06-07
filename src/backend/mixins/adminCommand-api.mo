import List   "mo:core/List";
import Map    "mo:core/Map";
import Text   "mo:core/Text";
import Types  "../types/adminCommand";
import Lib    "../lib/adminCommand";

/// Admin Command Centre mixin.
/// Exposes the activity feed, health metrics, agent registry,
/// agent logs, and auto-trigger rules over the public API boundary.
mixin (
  activityFeed    : List.List<Types.ActivityFeedItem>,
  healthMetricsRef : { var leadsToday : Nat; var demosRunning : Nat; var trialsActive : Nat; var outreachSent : Nat; var apiStatus : Bool },
  agentRegistry   : Map.Map<Text, Types.AgentStatus>,
  agentLogs       : List.List<Types.AgentLogEntry>,
  triggerRules    : Map.Map<Text, Types.TriggerRule>,
) {

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

  public func updateHealthMetric(metric : Text, value : Nat) : async () {
    Lib.updateHealthMetric(healthMetricsRef, metric, value);
  };

  // -----------------------------------------------------------------------
  // 3. Agent Status Registry
  // -----------------------------------------------------------------------

  public query func getAgentStatuses() : async [Types.AgentStatus] {
    Lib.getAgentStatuses(agentRegistry)
  };

  public func updateAgentStatus(agentId : Text, status : Text, error : ?Text) : async () {
    Lib.updateAgentStatus(agentRegistry, agentId, status, error);
  };

  public func setAgentEnabled(agentId : Text, enabled : Bool) : async () {
    Lib.setAgentEnabled(agentRegistry, agentId, enabled);
  };

  public func updateAgentConfig(agentId : Text, config : Text) : async () {
    Lib.updateAgentConfig(agentRegistry, agentId, config);
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

  public func addTriggerRule(rule : Types.TriggerRuleInput) : async Types.TriggerRule {
    Lib.addTriggerRule(triggerRules, rule)
  };

  public func updateTriggerRule(ruleId : Text, updates : Types.TriggerRuleUpdate) : async () {
    Lib.updateTriggerRule(triggerRules, ruleId, updates);
  };

  public func deleteTriggerRule(ruleId : Text) : async () {
    Lib.deleteTriggerRule(triggerRules, ruleId);
  };

  public func toggleTriggerRule(ruleId : Text, enabled : Bool) : async () {
    Lib.toggleTriggerRule(triggerRules, ruleId, enabled);
  };

};
