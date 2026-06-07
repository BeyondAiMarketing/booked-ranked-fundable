import Time "mo:core/Time";

module {

  // -----------------------------------------------------------------------
  // 1. Activity Feed
  // -----------------------------------------------------------------------

  /// Immutable activity feed item stored in the canister.
  public type ActivityFeedItem = {
    id          : Text;
    timestamp   : Int;
    eventType   : Text; // "new_lead" | "trial_activation" | "outreach_reply" | "review_alert" | "booking_confirmation"
    title       : Text;
    description : Text;
    entityId    : ?Text;
    entityType  : ?Text;
  };

  /// Input type used by callers to create a new feed item.
  public type ActivityFeedItemInput = {
    id          : Text;
    timestamp   : Int;
    eventType   : Text;
    title       : Text;
    description : Text;
    entityId    : ?Text;
    entityType  : ?Text;
  };

  // -----------------------------------------------------------------------
  // 2. Admin Health Metrics
  // -----------------------------------------------------------------------

  public type HealthMetrics = {
    leadsToday   : Nat;
    demosRunning : Nat;
    trialsActive : Nat;
    outreachSent : Nat;
    apiStatus    : Bool;
  };

  // -----------------------------------------------------------------------
  // 3. Agent Status Registry
  // -----------------------------------------------------------------------

  /// Live status record for one AI agent.
  public type AgentStatus = {
    agentId         : Text;
    agentName       : Text;
    status          : Text; // "active" | "idle" | "needs_attention" | "error" | "paused"
    lastRunAt       : ?Int;
    nextScheduledAt : ?Int;
    lastError       : ?Text;
    isEnabled       : Bool;
    config          : Text; // JSON-serialised config blob
  };

  // -----------------------------------------------------------------------
  // 4. Agent Activity Logs
  // -----------------------------------------------------------------------

  public type AgentLogEntry = {
    logId      : Text;
    agentId    : Text;
    timestamp  : Int;
    action     : Text;
    actionType : Text; // "discovery" | "enrichment" | "outreach" | "booking" | "review_response" | "lead_generation"
    result     : Text;
    isSuccess  : Bool;
  };

  public type AgentLogEntryInput = {
    logId      : Text;
    agentId    : Text;
    timestamp  : Int;
    action     : Text;
    actionType : Text;
    result     : Text;
    isSuccess  : Bool;
  };

  // -----------------------------------------------------------------------
  // 5. Auto-Trigger Rules
  // -----------------------------------------------------------------------

  public type TriggerRule = {
    ruleId        : Text;
    name          : Text;
    condition     : Text;
    conditionType : Text; // "new_lead" | "trial_start" | "outreach_reply" | "review_received"
    action        : Text;
    actionType    : Text; // "run_enrichment" | "queue_outreach" | "send_notification" | "update_crm"
    isEnabled     : Bool;
    createdAt     : Int;
  };

  public type TriggerRuleInput = {
    ruleId        : Text;
    name          : Text;
    condition     : Text;
    conditionType : Text;
    action        : Text;
    actionType    : Text;
    isEnabled     : Bool;
    createdAt     : Int;
  };

  public type TriggerRuleUpdate = {
    name          : ?Text;
    condition     : ?Text;
    conditionType : ?Text;
    action        : ?Text;
    actionType    : ?Text;
    isEnabled     : ?Bool;
  };

};
