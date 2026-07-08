import OpenRouterLib "../lib/openRouter";
import T             "../types/openRouter";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";
import Map           "mo:core/Map";
import Text          "mo:core/Text";

mixin (
  openRouterState  : OpenRouterLib.State,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
  transform        : OpenRouterLib.Transform,
) {

  /// Persist the OpenRouter API key into stable canister storage.
  public shared ({ caller = _ }) func saveOpenRouterApiKey(key : Text) : async () {
    OpenRouterLib.saveApiKey(openRouterState, key);
    // Persist in stable integrationCreds so the key survives canister upgrades
    let tid = "platform";
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case (null) ICLib.emptyCredentials();
    };
    integrationCreds.add(tid, ICLib.encryptAll({ existing with openRouterApiKey = key }, credSalt));
  };

  /// Ping the OpenRouter /models endpoint and update connection status.
  public shared ({ caller = _ }) func testOpenRouterConnection() : async Bool {
    await OpenRouterLib.testConnection(openRouterState, transform);
  };

  /// Return Go Live Dashboard status for the OpenRouter panel.
  public shared ({ caller = _ }) func getOpenRouterStatus() : async {
    isConnected   : Bool;
    lastPingTime  : ?Int;
    defaultModel  : Text;
    contextWindow : Nat;
    costPerMillion : Text;
  } {
    // Restore in-memory state from stable store if lost after upgrade
    let stableKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).openRouterApiKey;
    };
    if (stableKey != "") {
      let cfg = OpenRouterLib.getConfig(openRouterState);
      if (not cfg.isConnected and cfg.apiKey == "") {
        OpenRouterLib.saveApiKey(openRouterState, stableKey);
      };
    };
    let cfg = OpenRouterLib.getConfig(openRouterState);
    {
      isConnected    = cfg.isConnected or stableKey != "";
      lastPingTime   = cfg.lastPingTime;
      defaultModel   = if (cfg.defaultModel == "") "openrouter/owl-alpha" else cfg.defaultModel;
      contextWindow  = 1_000_000;
      costPerMillion = "$0.00 (free tier)";
    };
  };

  /// Return current per-task model overrides.
  public shared ({ caller = _ }) func getOpenRouterTaskOverrides() : async [(Text, Text)] {
    OpenRouterLib.getTaskModelOverrides(openRouterState);
  };

  /// Set which model to use for a specific task type.
  /// task: one of EmailGeneration | ProposalWriting | ReviewResponse | RAGAnswer |
  ///              Summarization | OutreachCopy | FollowUpDraft | MorningDigest
  public shared ({ caller = _ }) func setOpenRouterTaskModel(task : Text, model : Text) : async () {
    OpenRouterLib.saveTaskModelOverride(openRouterState, task, model);
  };

  /// Call OpenRouter for a given task with a prompt and optional context.
  /// Returns the AI-generated text, or empty string if not configured.
  /// Call OpenRouter for a given task with a prompt and optional context.
  /// Returns the AI-generated text, or empty string if not configured.
  public shared ({ caller = _ }) func callOpenRouterForTask(task : Text, prompt : Text, context : Text) : async Text {
    let taskType = OpenRouterLib.textToTaskType(task);
    let messages : [T.OpenRouterMessage] = if (context == "") {
      [{ role = "user"; content = prompt }]
    } else {
      [
        { role = "system"; content = context },
        { role = "user";   content = prompt  },
      ]
    };
    let geminiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).geminiApiKey;
    };
    let openaiKey = switch (integrationCreds.get("platform")) {
      case (null) "";
      case (?enc) ICLib.decryptAll(enc, credSalt).openaiKey;
    };
    await OpenRouterLib.callWithFallback(openRouterState, taskType, messages, transform, openaiKey, geminiKey);
  };

  /// Save the Google Gemini API key to stable storage.
  public shared ({ caller = _ }) func setGeminiApiKey(key : Text) : async () {
    let tid = "platform";
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case (null) ICLib.emptyCredentials();
    };
    integrationCreds.add(tid, ICLib.encryptAll({ existing with geminiApiKey = key }, credSalt));
  };

  /// Return whether the Google Gemini API key has been configured.
  public query ({ caller = _ }) func getGeminiKeyStatus() : async { configured : Bool } {
    let configured = switch (integrationCreds.get("platform")) {
      case (null) false;
      case (?enc) ICLib.decryptAll(enc, credSalt).geminiApiKey != "";
    };
    { configured };
  };
};
