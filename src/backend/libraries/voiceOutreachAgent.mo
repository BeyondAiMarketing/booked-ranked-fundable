import Map           "mo:core/Map";
import List          "mo:core/List";
import Time          "mo:core/Time";
import Text          "mo:core/Text";
import Nat           "mo:core/Nat";
import Int           "mo:core/Int";
import Types         "../types/voiceOutreachAgent";
import OpenRouterLib "../lib/openRouter";
import ORT           "../types/openRouter";

module {

  // ── Public type aliases ─────────────────────────────────────────────────────

  public type CommandLogEntry  = Types.CommandLogEntry;
  public type PendingAction    = Types.PendingAction;
  public type BulkSendQuota    = Types.BulkSendQuota;
  public type AgentSessionState = Types.AgentSessionState;
  public type AgentCommandResult = Types.AgentCommandResult;
  public type AgentActionKind  = Types.AgentActionKind;

  // ── State container ──────────────────────────────────────────────────────────

  public type State = {
    commandLog      : List.List<CommandLogEntry>;
    pendingActions  : Map.Map<Text, PendingAction>;
    quotas          : Map.Map<Text, BulkSendQuota>;
    sessions        : Map.Map<Text, AgentSessionState>;
    idCounter       : { var value : Nat };
    openRouterState : OpenRouterLib.State;
  };

  public func emptyState() : State = {
    commandLog      = List.empty<CommandLogEntry>();
    pendingActions  = Map.empty<Text, PendingAction>();
    quotas          = Map.empty<Text, BulkSendQuota>();
    sessions        = Map.empty<Text, AgentSessionState>();
    idCounter       = { var value = 0 };
    openRouterState = OpenRouterLib.emptyState();
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  private func nextId(state : State) : Text {
    state.idCounter.value += 1;
    "voa-" # state.idCounter.value.toText();
  };

  private let oneDayNs : Int = 86_400_000_000_000;

  private func defaultDailyLimit() : Nat = 200;

  // ── Marketing framework labels ───────────────────────────────────────────────
  // Map action keywords to proven marketing frameworks for the confirmation preview.

  private func frameworkLabel(cmd : Text) : Text {
    let lower = cmd.toLower();
    if      (lower.contains(#text "subject") or lower.contains(#text "headline")) "Halbert Hook"
    else if (lower.contains(#text "offer")  or lower.contains(#text "bonus"))    "Hormozi Value Equation"
    else if (lower.contains(#text "story")  or lower.contains(#text "journey"))  "Brunson Hook-Story-Offer"
    else if (lower.contains(#text "urgency") or lower.contains(#text "deadline")) "Kennedy Deadline Mechanic"
    else if (lower.contains(#text "pain")   or lower.contains(#text "problem"))  "Kennedy Pain-Agitate-Solve"
    else if (lower.contains(#text "result") or lower.contains(#text "outcome"))  "Hormozi Proof Stack"
    else                                                               "Brunson Epiphany Bridge";
  };

  // ── Command parsing ──────────────────────────────────────────────────────────

  public func parseCommand(commandText : Text) : (AgentActionKind, Text) {
    let lower = commandText.toLower();
    let kind : AgentActionKind =
      if      (lower.contains(#text "send") and (lower.contains(#text "email") or lower.contains(#text "leads")))
        #FireBulkSend
      else if (lower.contains(#text "edit")   or lower.contains(#text "rewrite") or lower.contains(#text "change"))
        #EditSequence
      else if (lower.contains(#text "find")   or lower.contains(#text "query")  or lower.contains(#text "show"))
        #QueryLeads
      else if (lower.contains(#text "step")   or lower.contains(#text "day ")   or lower.contains(#text "follow-up"))
        #ModifyStep
      else
        #Unknown;

    let fwLabel = frameworkLabel(commandText);

    let preview : Text = switch kind {
      case (#FireBulkSend)  {
        "[" # fwLabel # "] Preparing bulk send. BRF will queue emails within your daily limit. " #
        "Review the lead list and confirm to fire.";
      };
      case (#EditSequence)  {
        "[" # fwLabel # "] Sequence update detected. BRF will apply your copy change to the " #
        "matching sequence steps. Confirm to save.";
      };
      case (#QueryLeads)    {
        "[" # fwLabel # "] Querying your CRM for matching leads. Results will appear below.";
      };
      case (#ModifyStep)    {
        "[" # fwLabel # "] Step modification ready. BRF will update the specified step. " #
        "Confirm to apply.";
      };
      case (#Unknown)       {
        "[" # fwLabel # "] Command received. BRF needs a bit more detail to execute. " #
        "Try: \"Send 50 emails to HVAC leads\" or \"Edit subject line of day 3 step\".";
      };
    };
    (kind, preview);
  };

  /// Generate AI-powered outreach copy for a given command using OpenRouter.
  /// Falls back to the static preview if OpenRouter is not configured.
  public func generateOutreachCopy(
    state        : State,
    commandText  : Text,
    framework    : Text,
    transform    : OpenRouterLib.Transform,
    openaiKey    : Text,
    geminiApiKey : Text,
  ) : async Text {
    let messages : [ORT.OpenRouterMessage] = [
      {
        role = "system";
        content = "You are an expert direct-response copywriter trained on the " # framework #
                  " marketing framework. Write compelling, conversion-focused outreach copy.";
      },
      { role = "user"; content = commandText },
    ];
    let aiResult = await OpenRouterLib.callWithFallback(state.openRouterState, #OutreachCopy, messages, transform, openaiKey, geminiApiKey);
    if (aiResult != "") aiResult else commandText;
  };

  // ── Quota enforcement ────────────────────────────────────────────────────────

  /// Returns the current quota record for a user, creating one if absent.
  public func getOrCreateQuota(state : State, userId : Text) : BulkSendQuota {
    switch (state.quotas.get(userId)) {
      case (?q) {
        let now = Time.now();
        // Reset daily count if a new day has started
        if (now - q.lastReset >= oneDayNs) {
          let fresh : BulkSendQuota = { q with dailyCount = 0; lastReset = now };
          state.quotas.add(userId, fresh);
          fresh;
        } else q;
      };
      case null {
        let fresh : BulkSendQuota = {
          userId;
          dailyCount = 0;
          dailyLimit = defaultDailyLimit();
          lastReset  = Time.now();
        };
        state.quotas.add(userId, fresh);
        fresh;
      };
    };
  };

  /// Returns true if the user is within their daily sending limit.
  public func isWithinQuota(state : State, userId : Text, count : Nat) : Bool {
    let q = getOrCreateQuota(state, userId);
    q.dailyCount + count <= q.dailyLimit;
  };

  /// Increments the daily send counter for a user by `count`.
  public func incrementQuota(state : State, userId : Text, count : Nat) : () {
    let q = getOrCreateQuota(state, userId);
    let updated : BulkSendQuota = { q with dailyCount = q.dailyCount + count };
    state.quotas.add(userId, updated);
  };

  // ── Command submission ───────────────────────────────────────────────────────

  /// Parse command, create a pending action, and return a preview result.
  public func submitCommand(
    state     : State,
    userId    : Text,
    sessionId : Text,
    commandText : Text,
  ) : AgentCommandResult {
    let (kind, preview) = parseCommand(commandText);
    let actionId = nextId(state);
    let action : PendingAction = {
      actionId;
      userId;
      sessionId;
      commandText;
      actionKind = kind;
      preview;
      createdAt  = Time.now();
      payload    = "{}";
    };
    state.pendingActions.add(actionId, action);
    {
      actionId;
      preview;
      requiresConfirmation = kind != #QueryLeads;
      error = null;
    };
  };

  // ── Action execution ─────────────────────────────────────────────────────────

  /// Execute a pending action after confirmation, enforcing quota for bulk sends.
  /// Returns (ok : Bool, errorMsg : ?Text, logId : Text).
  public func executeAction(
    state      : State,
    actionId   : Text,
    userId     : Text,
    // CRM note appender — called when a bulk send fires so leads are logged
    appendNote : (leadId : Text, note : Text) -> (),
    // Lead query function — returns all lead IDs matching the session context
    getLeadIds : () -> [Text],
  ) : (Bool, ?Text, Text) {
    switch (state.pendingActions.get(actionId)) {
      case null {
        (false, ?("Action not found: " # actionId), "");
      };
      case (?action) {
        let now = Time.now();
        // Enforce quota for bulk sends
        switch (action.actionKind) {
          case (#FireBulkSend) {
            let leadIds = getLeadIds();
            let sendCount = leadIds.size();
            if (not isWithinQuota(state, userId, sendCount)) {
              let q = getOrCreateQuota(state, userId);
              let errMsg = "Daily sending limit reached (" # q.dailyCount.toText() #
                           "/" # q.dailyLimit.toText() # " sends used today). " #
                           "Limit resets at midnight.";
              return (false, ?errMsg, "");
            };
            incrementQuota(state, userId, sendCount);
            // Append a CRM note to each affected lead
            let noteText = "[Outreach Agent] Bulk send triggered by: \"" # action.commandText #
                           "\" | Action: FireBulkSend | Sends: " # sendCount.toText() #
                           " | Agent: " # userId;
            for (lid in leadIds.vals()) {
              appendNote(lid, noteText);
            };
          };
          case (#EditSequence or #ModifyStep) {
            let noteText = "[Outreach Agent] Sequence edit: \"" # action.commandText #
                           "\" | Action: " # actionKindText(action.actionKind) #
                           " | Agent: " # userId;
            for (lid in getLeadIds().vals()) {
              appendNote(lid, noteText);
            };
          };
          case _ {};
        };

        // Log the execution
        let logId = nextId(state);
        let entry : CommandLogEntry = {
          id          = logId;
          userId      = action.userId;
          sessionId   = action.sessionId;
          commandText = action.commandText;
          timestamp   = action.createdAt;
          agentAction = action.actionKind;
          confirmationPreview = action.preview;
          executedAt  = ?now;
          executionResult = ?("executed");
        };
        state.commandLog.add(entry);
        state.pendingActions.remove(actionId);
        (true, null, logId);
      };
    };
  };

  private func actionKindText(k : AgentActionKind) : Text {
    switch k {
      case (#EditSequence)  "EditSequence";
      case (#QueryLeads)    "QueryLeads";
      case (#FireBulkSend)  "FireBulkSend";
      case (#ModifyStep)    "ModifyStep";
      case (#Unknown)       "Unknown";
    };
  };

  // ── Session management ───────────────────────────────────────────────────────

  public func upsertSession(state : State, userId : Text, sessionId : Text, isActive : Bool) : () {
    let now = Time.now();
    switch (state.sessions.get(userId)) {
      case (?existing) {
        let updated : AgentSessionState = { existing with
          sessionId;
          isActive;
          lastSeenAt = now;
        };
        state.sessions.add(userId, updated);
      };
      case null {
        let s : AgentSessionState = {
          userId;
          sessionId;
          isActive;
          startedAt  = now;
          lastSeenAt = now;
        };
        state.sessions.add(userId, s);
      };
    };
  };

  // ── History retrieval ────────────────────────────────────────────────────────

  public func getCommandHistory(
    state  : State,
    userId : Text,
    offset : Nat,
    limit  : Nat,
  ) : [CommandLogEntry] {
    let all = state.commandLog.toArray();
    // Filter by userId
    let filtered = all.filter(func(e) { e.userId == userId });
    let total = filtered.size();
    if (offset >= total) return [];
    let end = Nat.min(offset + limit, total);
    filtered.sliceToArray(offset, end);
  };

};
