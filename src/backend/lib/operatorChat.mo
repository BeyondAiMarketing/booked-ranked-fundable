import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import OperatorChatTypes "../types/operatorChat";

module {
  /// Return the last `limit` messages from the chat history
  public func getHistory(
    messages : List.List<OperatorChatTypes.OperatorChatMessage>,
    limit : Nat
  ) : [OperatorChatTypes.OperatorChatMessage] {
    let arr = messages.toArray();
    let total = arr.size();
    if (limit >= total) {
      arr
    } else {
      let start : Nat = total - limit;
      arr.sliceToArray(start, total)
    }
  };

  /// Build a new OperatorChatMessage record
  public func buildMessage(
    id : Text,
    role : Text,
    content : Text,
    commandType : ?Text
  ) : OperatorChatTypes.OperatorChatMessage {
    {
      id;
      role;
      content;
      commandType;
      createdAt = Time.now();
    }
  };

  /// Parse plain-text operator command into a structured result
  public func parseCommand(
    command : Text,
    leads : List.List<{ niche : Text; status : Text }>
  ) : OperatorChatTypes.OperatorCommandResult {
    ignore leads;
    let lower = command.toLower();
    let (intent, requires_confirmation) : (Text, Bool) =
      if (lower.contains(#text "campaign") or lower.contains(#text "outreach")) {
        ("execute_outreach_campaign", true)
      } else if (lower.contains(#text "trial") or lower.contains(#text "trials")) {
        ("query_trials", false)
      } else if (lower.contains(#text "lead") or lower.contains(#text "leads")) {
        ("query_leads", false)
      } else if (lower.contains(#text "report")) {
        ("generate_report", false)
      } else if (lower.contains(#text "api") or lower.contains(#text "health")) {
        ("check_api_health", false)
      } else if (lower.contains(#text "niche")) {
        ("query_niche_performance", false)
      } else {
        ("general_query", false)
      };
    let nicheHints : [Text] = ["hvac", "roofing", "plumbing", "medspa", "real estate", "contractor"];
    let affected_niche = switch (
      nicheHints.find(func(h : Text) : Bool { lower.contains(#text h) })
    ) {
      case (?h) { h };
      case (null) { "" };
    };
    {
      intent;
      affected_niche;
      affected_count = 0;
      recommended_actions = ["Review the data and confirm"];
      requires_confirmation;
    }
  };

  /// Build a stats snapshot from live canister state slices
  public func buildStats(
    weeklyTrials : Nat,
    leadsToday : Nat,
    outreachToday : Nat,
    apiHealthSummary : Text
  ) : OperatorChatTypes.OperatorStats {
    {
      trials_this_week    = weeklyTrials;
      leads_today         = leadsToday;
      outreach_sent_today = outreachToday;
      api_health_summary  = apiHealthSummary;
    }
  };

  /// Build a structured report for the given report type
  public func buildReportData(
    reportType : Text,
    leads : List.List<{ niche : Text; status : Text; source : Text }>,
    trials : Nat,
    outreachSent : Nat
  ) : OperatorChatTypes.OperatorReportData {
    ignore (leads, trials, outreachSent);
    {
      report_type = reportType;
      sections    = [("Summary", reportType # " report data aggregated from canister")];
      generated_at = Time.now();
    }
  };
}
