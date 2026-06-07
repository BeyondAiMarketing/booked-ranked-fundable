import Time "mo:core/Time";

module {
  /// A single message in the Operator AI Chat history
  public type OperatorChatMessage = {
    id : Text;
    role : Text;       // "user" | "assistant"
    content : Text;
    commandType : ?Text;
    createdAt : Time.Time;
  };

  /// Structured result from parsing an operator command
  public type OperatorCommandResult = {
    intent : Text;
    affected_niche : Text;
    affected_count : Nat;
    recommended_actions : [Text];
    requires_confirmation : Bool;
  };

  /// Real-time stats returned by getOperatorStats
  public type OperatorStats = {
    trials_this_week : Nat;
    leads_today : Nat;
    outreach_sent_today : Nat;
    api_health_summary : Text;
  };

  /// Generic report payload keyed by report type
  public type OperatorReportData = {
    report_type : Text;
    sections : [(Text, Text)];  // (label, value) pairs
    generated_at : Time.Time;
  };
}
