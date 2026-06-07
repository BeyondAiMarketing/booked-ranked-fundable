import List "mo:core/List";
import Nat "mo:core/Nat";
import OperatorChatTypes "../types/operatorChat";
import OperatorChatLib "../lib/operatorChat";

mixin (
  operatorChatMessages : List.List<OperatorChatTypes.OperatorChatMessage>,
  operatorChatState : { var nextMsgId : Nat },
  leads : List.List<{ niche : Text; status : Text; source : Text }>
) {
  /// Returns last 100 operator chat messages with timestamps, role, content
  public query func getOperatorChatHistory() : async [OperatorChatTypes.OperatorChatMessage] {
    OperatorChatLib.getHistory(operatorChatMessages, 100)
  };

  /// Saves a message and returns its id
  public func saveOperatorChatMessage(
    role : Text,
    content : Text,
    commandType : ?Text
  ) : async Text {
    let id = "msg-" # operatorChatState.nextMsgId.toText();
    operatorChatState.nextMsgId += 1;
    let msg = OperatorChatLib.buildMessage(id, role, content, commandType);
    operatorChatMessages.add(msg);
    id
  };

  /// Returns real-time stats derived from live canister state
  public query func getOperatorStats() : async OperatorChatTypes.OperatorStats {
    var leadsCount : Nat = 0;
    for (_lead in leads.values()) { leadsCount += 1 };
    OperatorChatLib.buildStats(0, leadsCount, 0, "operational")
  };

  /// Parses command intent and returns a structured action plan
  public query func executeOperatorCommand(
    command : Text
  ) : async OperatorChatTypes.OperatorCommandResult {
    let leadsForParse = List.empty<{ niche : Text; status : Text }>();
    for (lead in leads.values()) {
      leadsForParse.add({ niche = lead.niche; status = lead.status });
    };
    OperatorChatLib.parseCommand(command, leadsForParse)
  };

  /// Returns structured data for a named report type
  public query func getOperatorReportData(
    reportType : Text
  ) : async OperatorChatTypes.OperatorReportData {
    let leadsForReport = List.empty<{ niche : Text; status : Text; source : Text }>();
    for (lead in leads.values()) {
      leadsForReport.add({ niche = lead.niche; status = lead.status; source = lead.source });
    };
    OperatorChatLib.buildReportData(reportType, leadsForReport, 0, 0)
  };
}
