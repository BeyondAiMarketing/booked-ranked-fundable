import List  "mo:core/List";
import Map   "mo:core/Map";
import Text  "mo:core/Text";
import Time  "mo:core/Time";
import Types "../types/adminCommand";

module {

  // -----------------------------------------------------------------------
  // 1. Activity Feed helpers
  // -----------------------------------------------------------------------

  public func addActivityFeedItem(
    feed  : List.List<Types.ActivityFeedItem>,
    input : Types.ActivityFeedItemInput,
  ) : () {
    feed.add({
      id          = input.id;
      timestamp   = input.timestamp;
      eventType   = input.eventType;
      title       = input.title;
      description = input.description;
      entityId    = input.entityId;
      entityType  = input.entityType;
    });
  };

  /// Return the `limit` most-recent items, newest-first.
  public func getRecentActivity(
    feed  : List.List<Types.ActivityFeedItem>,
    limit : Nat,
  ) : [Types.ActivityFeedItem] {
    let arr   = feed.toArray();
    let size  = arr.size();
    let start = if (size > limit) { size - limit : Nat } else { 0 };
    let result = List.empty<Types.ActivityFeedItem>();
    var i = size;
    while (i > start) {
      i -= 1;
      result.add(arr[i]);
    };
    result.toArray()
  };

  // -----------------------------------------------------------------------
  // 2. Health Metrics helpers
  // -----------------------------------------------------------------------

  public func getHealthMetrics(
    metrics : Types.HealthMetrics,
  ) : Types.HealthMetrics {
    metrics
  };

  public func updateHealthMetric(
    metricsRef : { var leadsToday : Nat; var demosRunning : Nat; var trialsActive : Nat; var outreachSent : Nat; var apiStatus : Bool },
    metric     : Text,
    value      : Nat,
  ) : () {
    switch (metric) {
      case ("leadsToday")   { metricsRef.leadsToday   := value };
      case ("demosRunning") { metricsRef.demosRunning := value };
      case ("trialsActive") { metricsRef.trialsActive := value };
      case ("outreachSent") { metricsRef.outreachSent := value };
      case ("apiStatus")    { metricsRef.apiStatus    := value > 0 };
      case (_) {};
    };
  };

  // -----------------------------------------------------------------------
  // 3. Agent Status Registry helpers
  // -----------------------------------------------------------------------

  public func defaultAgents() : [Types.AgentStatus] {
    let _now = Time.now();
    [
      { agentId = "lead-finder";    agentName = "Lead Finder Agent";         status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "front-desk";     agentName = "AI Front Desk";             status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "outreach";       agentName = "Outreach Sequencer";        status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "social";         agentName = "Social Media Agent";        status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "reputation";     agentName = "Reputation Manager";        status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "credit-builder"; agentName = "Business Credit Builder";   status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "lead-enricher";  agentName = "Lead Enrichment Agent";     status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
      { agentId = "review-req";     agentName = "Review Request Agent";      status = "idle"; lastRunAt = null; nextScheduledAt = null; lastError = null; isEnabled = true;  config = "{}" },
    ]
  };

  public func getAgentStatuses(
    registry : Map.Map<Text, Types.AgentStatus>,
  ) : [Types.AgentStatus] {
    if (registry.size() == 0) {
      defaultAgents()
    } else {
      registry.values().toArray()
    }
  };

  public func updateAgentStatus(
    registry : Map.Map<Text, Types.AgentStatus>,
    agentId  : Text,
    status   : Text,
    error    : ?Text,
  ) : () {
    let now = Time.now();
    let existing : Types.AgentStatus = switch (registry.get(agentId)) {
      case (?a) { a };
      case (null) {
        { agentId; agentName = agentId; status = "idle"; lastRunAt = null;
          nextScheduledAt = null; lastError = null; isEnabled = true; config = "{}" }
      };
    };
    registry.add(agentId, { existing with status; lastRunAt = ?now; lastError = error });
  };

  public func setAgentEnabled(
    registry  : Map.Map<Text, Types.AgentStatus>,
    agentId   : Text,
    enabled   : Bool,
  ) : () {
    let existing : Types.AgentStatus = switch (registry.get(agentId)) {
      case (?a) { a };
      case (null) {
        { agentId; agentName = agentId; status = "idle"; lastRunAt = null;
          nextScheduledAt = null; lastError = null; isEnabled = enabled; config = "{}" }
      };
    };
    registry.add(agentId, { existing with isEnabled = enabled });
  };

  public func updateAgentConfig(
    registry : Map.Map<Text, Types.AgentStatus>,
    agentId  : Text,
    config   : Text,
  ) : () {
    let existing : Types.AgentStatus = switch (registry.get(agentId)) {
      case (?a) { a };
      case (null) {
        { agentId; agentName = agentId; status = "idle"; lastRunAt = null;
          nextScheduledAt = null; lastError = null; isEnabled = true; config }
      };
    };
    registry.add(agentId, { existing with config });
  };

  // -----------------------------------------------------------------------
  // 4. Agent Activity Logs helpers
  // -----------------------------------------------------------------------

  public func addAgentLog(
    logs  : List.List<Types.AgentLogEntry>,
    entry : Types.AgentLogEntryInput,
  ) : () {
    logs.add({
      logId      = entry.logId;
      agentId    = entry.agentId;
      timestamp  = entry.timestamp;
      action     = entry.action;
      actionType = entry.actionType;
      result     = entry.result;
      isSuccess  = entry.isSuccess;
    });
  };

  public func getAgentLogs(
    logs    : List.List<Types.AgentLogEntry>,
    agentId : Text,
    limit   : Nat,
  ) : [Types.AgentLogEntry] {
    let filtered = List.empty<Types.AgentLogEntry>();
    for (e in logs.values()) {
      if (e.agentId == agentId) { filtered.add(e) };
    };
    let arr   = filtered.toArray();
    let size  = arr.size();
    let start = if (size > limit) { size - limit : Nat } else { 0 };
    let result = List.empty<Types.AgentLogEntry>();
    var i = size;
    while (i > start) {
      i -= 1;
      result.add(arr[i]);
    };
    result.toArray()
  };

  public func getAllAgentLogs(
    logs  : List.List<Types.AgentLogEntry>,
    limit : Nat,
  ) : [Types.AgentLogEntry] {
    let arr   = logs.toArray();
    let size  = arr.size();
    let start = if (size > limit) { size - limit : Nat } else { 0 };
    let result = List.empty<Types.AgentLogEntry>();
    var i = size;
    while (i > start) {
      i -= 1;
      result.add(arr[i]);
    };
    result.toArray()
  };

  // -----------------------------------------------------------------------
  // 5. Trigger Rules helpers
  // -----------------------------------------------------------------------

  public func getTriggerRules(
    rules : Map.Map<Text, Types.TriggerRule>,
  ) : [Types.TriggerRule] {
    rules.values().toArray()
  };

  public func addTriggerRule(
    rules : Map.Map<Text, Types.TriggerRule>,
    input : Types.TriggerRuleInput,
  ) : Types.TriggerRule {
    let rule : Types.TriggerRule = {
      ruleId        = input.ruleId;
      name          = input.name;
      condition     = input.condition;
      conditionType = input.conditionType;
      action        = input.action;
      actionType    = input.actionType;
      isEnabled     = input.isEnabled;
      createdAt     = input.createdAt;
    };
    rules.add(rule.ruleId, rule);
    rule
  };

  public func updateTriggerRule(
    rules   : Map.Map<Text, Types.TriggerRule>,
    ruleId  : Text,
    updates : Types.TriggerRuleUpdate,
  ) : () {
    switch (rules.get(ruleId)) {
      case (null) {};
      case (?existing) {
        let updated : Types.TriggerRule = {
          ruleId        = existing.ruleId;
          name          = switch (updates.name)          { case (?v) v; case null existing.name };
          condition     = switch (updates.condition)     { case (?v) v; case null existing.condition };
          conditionType = switch (updates.conditionType) { case (?v) v; case null existing.conditionType };
          action        = switch (updates.action)        { case (?v) v; case null existing.action };
          actionType    = switch (updates.actionType)    { case (?v) v; case null existing.actionType };
          isEnabled     = switch (updates.isEnabled)     { case (?v) v; case null existing.isEnabled };
          createdAt     = existing.createdAt;
        };
        rules.add(ruleId, updated);
      };
    };
  };

  public func deleteTriggerRule(
    rules  : Map.Map<Text, Types.TriggerRule>,
    ruleId : Text,
  ) : () {
    rules.remove(ruleId);
  };

  public func toggleTriggerRule(
    rules   : Map.Map<Text, Types.TriggerRule>,
    ruleId  : Text,
    enabled : Bool,
  ) : () {
    switch (rules.get(ruleId)) {
      case (null) {};
      case (?existing) {
        rules.add(ruleId, { existing with isEnabled = enabled });
      };
    };
  };

};
