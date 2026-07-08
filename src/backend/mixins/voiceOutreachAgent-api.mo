import Time   "mo:core/Time";
import Map    "mo:core/Map";
import Text   "mo:core/Text";
import VOALib  "../libraries/voiceOutreachAgent";
import VOATypes "../types/voiceOutreachAgent";
import OutreachTypes "../types/outreachPipeline";

mixin (
  voaState           : VOALib.State,
  pipelineLeadsRef   : Map.Map<Text, OutreachTypes.PipelineLead>,
) {

  // ── helpers ───────────────────────────────────────────────────────────────

  private func appendCrmNote(leadId : Text, note : Text) : () {
    switch (pipelineLeadsRef.get(leadId)) {
      case null {};
      case (?existing) {
        let entry : OutreachTypes.PipelineActivityEntry = {
          timestamp = Time.now();
          action    = "agent_note";
          details   = note;
        };
        let updated : OutreachTypes.PipelineLead = {
          existing with
          activityLog = existing.activityLog.concat([entry]);
        };
        pipelineLeadsRef.add(leadId, updated);
      };
    };
  };

  private func allLeadIds() : [Text] {
    let keys = pipelineLeadsRef.keys();
    keys.toArray();
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Submit a voice/text command to the outreach agent.
  /// Returns a structured preview for the user to review before any action fires.
  public shared ({ caller }) func submitAgentCommand(
    commandText : Text,
    sessionId   : Text,
  ) : async VOATypes.AgentCommandResult {
    let userId = caller.toText();
    VOALib.upsertSession(voaState, userId, sessionId, true);
    VOALib.submitCommand(voaState, userId, sessionId, commandText);
  };

  /// Execute a previously confirmed action by its actionId.
  /// Enforces daily quota before firing any bulk sends.
  public shared ({ caller }) func executeAgentAction(
    actionId : Text,
  ) : async { ok : Bool; error : ?Text; logId : Text } {
    let userId = caller.toText();
    let (ok, err, logId) = VOALib.executeAction(
      voaState,
      actionId,
      userId,
      appendCrmNote,
      allLeadIds,
    );
    { ok; error = err; logId };
  };

  /// Returns paginated command history for the calling user.
  public query ({ caller }) func getCommandHistory(
    offset : Nat,
    limit  : Nat,
  ) : async [VOATypes.CommandLogEntry] {
    let userId = caller.toText();
    VOALib.getCommandHistory(voaState, userId, offset, limit);
  };

  /// Returns current session state for the calling user.
  public query ({ caller }) func getAgentSession() : async ?VOATypes.AgentSessionState {
    let userId = caller.toText();
    voaState.sessions.get(userId);
  };

  /// Returns the caller's current daily bulk send quota.
  public query ({ caller }) func getAgentQuota() : async {
    dailyCount : Nat;
    dailyLimit : Nat;
    remaining  : Nat;
  } {
    let userId = caller.toText();
    let q = VOALib.getOrCreateQuota(voaState, userId);
    let remaining : Nat = if (q.dailyLimit >= q.dailyCount) q.dailyLimit - q.dailyCount else 0;
    { dailyCount = q.dailyCount; dailyLimit = q.dailyLimit; remaining };
  };

}
