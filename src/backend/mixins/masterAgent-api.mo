import MasterAgentTypes "../types/masterAgent";
import ORTypes          "../types/openRouter";
import ORLib            "../lib/openRouter";
import AccessControl    "mo:caffeineai-authorization/access-control";
import Outcall          "mo:caffeineai-http-outcalls/outcall";
import Array            "mo:core/Array";
import Time             "mo:core/Time";
import Text             "mo:core/Text";
import Map              "mo:core/Map";
import List             "mo:core/List";
import ICTypes "../types/integrationCredentials";
import ICLib "../lib/integrationCredentials";

/// Master Agent API — full Super Admin omniscient view across all accounts.
/// Owl Alpha is the primary model. All AI calls go through OpenRouter HTTP outcall.
mixin (
  masterAgentState   : MasterAgentTypes.MasterAgentState,
  openRouterState    : ORLib.State,
  accessControlState : AccessControl.AccessControlState,
  totalLeadsCount    : { value : Nat },
  totalCampaignsCount: { value : Nat },
  totalTrialsCount   : { var value : Nat },
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
) {

  // ── Private helpers ───────────────────────────────────────────────────────

  /// Build the system prompt for the Master Agent, embedding the platform snapshot.
  private func buildSystemPrompt(snap : MasterAgentTypes.MasterAgentContextSnapshot) : Text {
    let activitySummary = if (snap.recentActivity.size() == 0) {
      "No recent activity recorded."
    } else {
      snap.recentActivity.vals().foldLeft("", func(acc : Text, item : Text) : Text {
        if (acc == "") item else acc # "; " # item
      })
    };
    "You are the Master Agent for the BRF (Booked, Ranked & Fundable) platform. " #
    "You have full Super Admin visibility across ALL accounts, leads, campaigns, clients, and agency partners. " #
    "You can orchestrate all other agents, run platform-wide tasks, generate reports, and monitor activity. " #
    "Today's platform snapshot: " #
    "Total accounts: " # debug_show(snap.totalAccounts) # ", " #
    "Total leads: " # debug_show(snap.totalLeads) # ", " #
    "Active campaigns: " # debug_show(snap.totalCampaigns) # ", " #
    "Active trials: " # debug_show(snap.activeTrials) # ", " #
    "Recent activity: " # activitySummary # ". " #
    "Respond helpfully and concisely. When asked for reports or data, provide structured summaries. " #
    "Always prioritise actionable insights for the platform owner."
  };

  /// Convert a MasterAgentMessage to an OpenRouterMessage.
  private func toORMessage(m : MasterAgentTypes.MasterAgentMessage) : ORTypes.OpenRouterMessage {
    let roleText = switch (m.role) {
      case (#System)    "system";
      case (#User)      "user";
      case (#Assistant) "assistant";
    };
    { role = roleText; content = m.content };
  };

  /// Collect the current platform context snapshot from live state.
  private func collectSnapshot() : MasterAgentTypes.MasterAgentContextSnapshot {
    let totalAccounts = accessControlState.userRoles.size();
    let recentActivity : [Text] = [
      "Platform is operational",
      "Leads: " # debug_show(totalLeadsCount.value),
      "Campaigns: " # debug_show(totalCampaignsCount.value),
      "Active trials: " # debug_show(totalTrialsCount.value),
    ];
    {
      totalAccounts;
      totalLeads     = totalLeadsCount.value;
      totalCampaigns = totalCampaignsCount.value;
      activeTrials   = totalTrialsCount.value;
      recentActivity;
      timestamp      = Time.now();
    };
  };

  // ── Session management ─────────────────────────────────────────────────────

  /// Start a new Master Agent session. Injects a System message with the live
  /// platform context snapshot so Owl Alpha has full situational awareness.
  public shared ({ caller = _ }) func masterAgentStartSession(
    platformContext : ?Text
  ) : async Text {
    let now = Time.now();
    let sid = "mas-" # debug_show(now);

    // Collect live platform snapshot
    let snap = collectSnapshot();
    let systemContent = buildSystemPrompt(snap);
    let systemMsg : MasterAgentTypes.MasterAgentMessage = {
      role      = #System;
      content   = systemContent;
      timestamp = now;
    };

    // Optional extra context passed by caller
    let initMsgs : [MasterAgentTypes.MasterAgentMessage] = switch (platformContext) {
      case (null) { [systemMsg] };
      case (?ctx) {
        let ctxMsg : MasterAgentTypes.MasterAgentMessage = {
          role      = #System;
          content   = ctx;
          timestamp = now;
        };
        [systemMsg, ctxMsg]
      };
    };

    let session : MasterAgentTypes.MasterAgentSession = {
      sessionId       = sid;
      messages        = initMsgs;
      startedAt       = now;
      lastActiveAt    = now;
      platformContext = ?("totalAccounts:" # debug_show(snap.totalAccounts) # ",leads:" # debug_show(snap.totalLeads));
    };
    masterAgentState.sessions.add(session);
    masterAgentState.activeSessionId.value := ?sid;
    sid;
  };

  /// Return the active session id (null when none is active).
  public query func masterAgentGetActiveSession() : async ?Text {
    masterAgentState.activeSessionId.value;
  };

  /// List all sessions (most recent first).
  public query func masterAgentListSessions() : async [MasterAgentTypes.MasterAgentSession] {
    let arr = masterAgentState.sessions.toArray();
    let size = arr.size();
    if (size == 0) { return [] };
    Array.tabulate(size, func j { arr[size - 1 - j] });
  };

  /// Get all messages for a session.
  public query func masterAgentGetMessages(
    sessionId : Text
  ) : async [MasterAgentTypes.MasterAgentMessage] {
    switch (masterAgentState.sessions.find(func(s : MasterAgentTypes.MasterAgentSession) : Bool { s.sessionId == sessionId })) {
      case (?s) { s.messages };
      case null { [] };
    };
  };

  /// Append a user message and — if role is #User — call Owl Alpha via
  /// OpenRouter and append the assistant reply. Returns the assistant reply
  /// text (or empty string if the role was not #User or the call failed).
  public shared ({ caller = _ }) func masterAgentAppendMessage(
    sessionId : Text,
    role      : MasterAgentTypes.MessageRole,
    content   : Text
  ) : async Text {
    let now = Time.now();

    // Find the session
    let sessionOpt = masterAgentState.sessions.find(
      func(s : MasterAgentTypes.MasterAgentSession) : Bool { s.sessionId == sessionId }
    );
    let session = switch (sessionOpt) {
      case (null) { return "" };
      case (?s)   { s };
    };

    // Append the incoming message
    let newMsg : MasterAgentTypes.MasterAgentMessage = {
      role      = role;
      content   = content;
      timestamp = now;
    };
    let updatedMsgs = session.messages.concat([newMsg]);

    // If not a user turn, just persist and return
    if (role != #User) {
      masterAgentState.sessions.mapInPlace(
        func(s : MasterAgentTypes.MasterAgentSession) : MasterAgentTypes.MasterAgentSession {
          if (s.sessionId == sessionId) {
            { s with messages = updatedMsgs; lastActiveAt = now }
          } else { s }
        }
      );
      return "";
    };

    // Build OpenRouter messages from full session history (system + all prior + new user msg)
    let orMessages : [ORTypes.OpenRouterMessage] = updatedMsgs.map(
      func(m) { toORMessage(m) }
    );

    // Resolve provider keys from stable storage for the fallback chain
    let geminiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).geminiApiKey;
    };
    let openaiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).openaiKey;
    };

    // Call Owl Alpha via OpenRouter with fallback chain: OpenRouter → OpenAI → Gemini
    let assistantReply = await ORLib.callWithFallback(
      openRouterState,
      #RAGAnswer,
      orMessages,
      transform,
      openaiKey,
      geminiKey,
    );

    // Append the assistant response to the session
    let replyText = if (assistantReply == "") {
      "I'm here and ready to help. Please check that your OpenRouter API key is configured in the Go Live Dashboard."
    } else {
      assistantReply
    };

    let assistantMsg : MasterAgentTypes.MasterAgentMessage = {
      role      = #Assistant;
      content   = replyText;
      timestamp = Time.now();
    };
    let finalMsgs = updatedMsgs.concat([assistantMsg]);

    masterAgentState.sessions.mapInPlace(
      func(s : MasterAgentTypes.MasterAgentSession) : MasterAgentTypes.MasterAgentSession {
        if (s.sessionId == sessionId) {
          { s with messages = finalMsgs; lastActiveAt = Time.now() }
        } else { s }
      }
    );

    replyText;
  };

  /// Deactivate the current session (preserves history).
  public shared ({ caller = _ }) func masterAgentEndSession(sessionId : Text) : async Bool {
    switch (masterAgentState.activeSessionId.value) {
      case (?active) {
        if (active == sessionId) {
          masterAgentState.activeSessionId.value := null;
          true;
        } else { false };
      };
      case null { false };
    };
  };

  /// Delete a session by id.
  public shared ({ caller = _ }) func masterAgentDeleteSession(sessionId : Text) : async Bool {
    let before = masterAgentState.sessions.size();
    let kept = masterAgentState.sessions.toArray();
    masterAgentState.sessions.truncate(0);
    for (s in kept.vals()) {
      if (s.sessionId != sessionId) { masterAgentState.sessions.add(s) };
    };
    let after = masterAgentState.sessions.size();
    // If active session was deleted, clear the activeSessionId
    switch (masterAgentState.activeSessionId.value) {
      case (?active) {
        if (active == sessionId) {
          masterAgentState.activeSessionId.value := null;
        };
      };
      case null {};
    };
    before != after;
  };

  /// Collect and return a live platform context snapshot.
  public query func masterAgentGetContextSnapshot() : async MasterAgentTypes.MasterAgentContextSnapshot {
    collectSnapshot();
  };
};
