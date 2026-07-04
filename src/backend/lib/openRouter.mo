import T      "../types/openRouter";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Array   "mo:core/Array";
import Time    "mo:core/Time";
import Text    "mo:core/Text";

module {

  // ── State ─────────────────────────────────────────────────────────────────

  public type State = { var config : ?T.OpenRouterConfig };

  public func emptyState() : State { { var config = null } };

  private let defaultModel : Text = "openrouter/owl-alpha";
  private let baseUrl      : Text = "https://openrouter.ai/api/v1";

  // Transform type alias for convenience
  public type Transform = shared query (Outcall.TransformationInput) -> async Outcall.TransformationOutput;

  // ── Config helpers ────────────────────────────────────────────────────────

  /// Persist or replace the API key; resets connection status.
  public func saveApiKey(state : State, key : Text) : () {
    let current : T.OpenRouterConfig = switch (state.config) {
      case (?c) c;
      case null {
        {
          apiKey             = "";
          defaultModel;
          taskModelOverrides = [];
          lastPingTime       = null;
          isConnected        = false;
        }
      };
    };
    state.config := ?{ current with apiKey = key; isConnected = false };
  };

  /// Return config, creating a default if none saved yet.
  public func getConfig(state : State) : T.OpenRouterConfig {
    switch (state.config) {
      case (?c) c;
      case null {
        {
          apiKey             = "";
          defaultModel;
          taskModelOverrides = [];
          lastPingTime       = null;
          isConnected        = false;
        }
      };
    };
  };

  /// Map a TaskType to its configured model, falling back to the default.
  public func getModelForTask(state : State, task : T.TaskType) : Text {
    let cfg     = getConfig(state);
    let taskKey = taskTypeToText(task);
    let overrides = cfg.taskModelOverrides;
    // Linear scan — overrides list is small (≤ 8 entries)
    for ((k, v) in overrides.vals()) {
      if (k == taskKey) return v;
    };
    if (cfg.defaultModel == "") defaultModel else cfg.defaultModel;
  };

  /// Persist a per-task model override.
  public func saveTaskModelOverride(state : State, task : Text, model : Text) : () {
    let cfg = getConfig(state);
    let filtered = cfg.taskModelOverrides.filter(
      func((k, _v) : (Text, Text)) : Bool { k != task },
    );
    let updated = [(task, model)].concat(filtered);
    state.config := ?{ cfg with taskModelOverrides = updated };
  };

  /// Return current per-task overrides.
  public func getTaskModelOverrides(state : State) : [(Text, Text)] {
    getConfig(state).taskModelOverrides;
  };

  // ── HTTP helpers ──────────────────────────────────────────────────────────

  private func authHeader(key : Text) : [Outcall.Header] {
    [
      { name = "Authorization"; value = "Bearer " # key },
      { name = "Content-Type";  value = "application/json" },
      { name = "HTTP-Referer";  value = "https://bookedrankedfunded.org" },
      { name = "X-Title";       value = "BRF-Platform" },
    ];
  };

  // ── Connection test ───────────────────────────────────────────────────────

  /// Ping the models endpoint. Returns true if key is valid.
  public func testConnection(state : State, transform : Transform) : async Bool {
    let cfg = getConfig(state);
    if (cfg.apiKey == "") { return false };
    try {
      let resp = await Outcall.httpGetRequest(
        baseUrl # "/models",
        authHeader(cfg.apiKey),
        transform,
      );
      let ok = resp.size() > 10;
      let now = Time.now();
      state.config := ?{ cfg with isConnected = ok; lastPingTime = ?now };
      ok;
    } catch (_) {
      state.config := ?{ cfg with isConnected = false; lastPingTime = ?Time.now() };
      false;
    };
  };

  // ── Chat completion ────────────────────────────────────────────────────────

  /// Send a non-streaming chat completion to OpenRouter.
  /// Returns the assistant message content, or empty Text on any failure.
  public func callOpenRouter(
    state     : State,
    task      : T.TaskType,
    messages  : [T.OpenRouterMessage],
    transform : Transform,
  ) : async Text {
    let cfg = getConfig(state);
    if (cfg.apiKey == "") return "";

    let model    = getModelForTask(state, task);
    let bodyJson = "{\"model\":\"" # model # "\"," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "," #
                   "\"stream\":false}";

    try {
      let resp = await Outcall.httpPostRequest(
        baseUrl # "/chat/completions",
        authHeader(cfg.apiKey),
        bodyJson,
        transform,
      );
      extractContent(resp);
    } catch (_) {
      "";
    };
  };

  /// Try OpenRouter first; if empty, return empty so caller triggers fallback.
  /// The calling mixin / lib handles the NVIDIA → OpenAI fallback chain.
  /// Try OpenRouter (Owl Alpha) first; if empty, try OpenAI; if still empty,
  /// try Google Gemini; if still empty, try NVIDIA NIM.
  /// Accepts extra provider keys so the caller can inject them from stable storage.
  public func callWithFallback(
    state        : State,
    task         : T.TaskType,
    messages     : [T.OpenRouterMessage],
    transform    : Transform,
    openaiKey    : Text,
    geminiApiKey : Text,
  ) : async Text {
    // 1. Try OpenRouter / Owl Alpha
    let result = await callOpenRouter(state, task, messages, transform);
    if (result != "") return result;

    // 2. Fallback: OpenAI
    if (openaiKey != "") {
      let openaiResult = await callOpenAI(openaiKey, messages, transform);
      if (openaiResult != "") return openaiResult;
    };

    // 3. Fallback: Google Gemini (API key in URL query param — no Authorization header)
    if (geminiApiKey != "") {
      let geminiResult = await callGemini(geminiApiKey, messages, transform);
      if (geminiResult != "") return geminiResult;
    };

    // All providers exhausted
    "";
  };

  /// Try OpenRouter first, then Claude (Anthropic), then OpenAI, then Gemini.
  /// Use this variant when a Claude key is available for the secondary fallback.
  /// NOTE: Claude uses x-api-key header + anthropic-version — NOT Authorization: Bearer.
  public func callWithClaudeFallback(
    state        : State,
    task         : T.TaskType,
    messages     : [T.OpenRouterMessage],
    transform    : Transform,
    claudeKey    : Text,
    openaiKey    : Text,
    geminiApiKey : Text,
  ) : async Text {
    // 1. Try OpenRouter / Owl Alpha
    let result = await callOpenRouter(state, task, messages, transform);
    if (result != "") return result;

    // 2. Fallback: Claude (Anthropic)
    // Claude uses x-api-key header + anthropic-version, NOT Authorization: Bearer
    if (claudeKey != "") {
      let claudeResult = await callClaude(claudeKey, messages, transform);
      if (claudeResult != "") return claudeResult;
    };

    // 3. Fallback: OpenAI
    if (openaiKey != "") {
      let openaiResult = await callOpenAI(openaiKey, messages, transform);
      if (openaiResult != "") return openaiResult;
    };

    // 4. Fallback: Google Gemini (API key in URL query param)
    if (geminiApiKey != "") {
      let geminiResult = await callGemini(geminiApiKey, messages, transform);
      if (geminiResult != "") return geminiResult;
    };

    // All providers exhausted
    "";
  };


  // ── Claude (Anthropic) fallback ─────────────────────────────────────────────────────────────
  // IMPORTANT: Claude uses x-api-key header + anthropic-version: 2023-06-01.
  // It does NOT use Authorization: Bearer — that is a common mistake.
  private func callClaude(
    apiKey    : Text,
    messages  : [T.OpenRouterMessage],
    transform : Transform,
  ) : async Text {
    let bodyJson = "{\"model\":\"claude-3-5-sonnet-20241022\"," #
                   "\"max_tokens\":2000," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://api.anthropic.com/v1/messages",
        [
          { name = "x-api-key";         value = apiKey },
          { name = "anthropic-version"; value = "2023-06-01" },
          { name = "Content-Type";      value = "application/json" },
        ],
        bodyJson,
        transform,
      );
      // Claude response has content[].text, try extractContent first then text field
      let extracted = extractContent(resp);
      if (extracted != "") return extracted;
      // Try the nested text field in Claude's content array format
      extractClaudeContent(resp)
    } catch (_) { "" };
  };

  // ── OpenAI fallback ───────────────────────────────────────────────────────

  private func callOpenAI(
    apiKey    : Text,
    messages  : [T.OpenRouterMessage],
    transform : Transform,
  ) : async Text {
    // OpenAI endpoint: Authorization: Bearer header, Content-Type: application/json
    let bodyJson = "{\"model\":\"gpt-4o\"," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "," #
                   "\"temperature\":0.7,\"max_tokens\":2000}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        [
          { name = "Authorization"; value = "Bearer " # apiKey },
          { name = "Content-Type";  value = "application/json" },
        ],
        bodyJson,
        transform,
      );
      extractContent(resp);
    } catch (_) { "" };
  };

  // ── Gemini fallback ───────────────────────────────────────────────────────

  private func callGemini(
    geminiKey : Text,
    messages  : [T.OpenRouterMessage],
    transform : Transform,
  ) : async Text {
    // Gemini uses API key as URL query param — NOT Authorization header.
    // Body format differs from OpenAI: contents[].parts[].text
    let combinedPrompt = messages.vals().foldLeft("", func(acc : Text, m : T.OpenRouterMessage) : Text {
      if (acc == "") m.content else acc # "\n" # m.content
    });
    let bodyJson = "{\"contents\":[{\"parts\":[{\"text\":\"" # escapeJson(combinedPrompt) # "\"}]}]," #
                   "\"generationConfig\":{\"maxOutputTokens\":2000}}";
    // API key goes in the URL — no Authorization header for Gemini
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # geminiKey;
    try {
      let resp = await Outcall.httpPostRequest(
        url,
        [
          { name = "Content-Type"; value = "application/json" },
        ],
        bodyJson,
        transform,
      );
      extractGeminiContent(resp);
    } catch (_) { "" };
  };

  /// Extract the text from Claude's response format.
  /// Claude returns: {"content":[{"type":"text","text":"..."}],...}
  private func extractClaudeContent(json : Text) : Text {
    // Find "text":" pattern in Claude's content array
    let marker      = "\"text\":\"";
    let markerChars = marker.toArray();
    let jsonChars   = json.toArray();
    let mLen        = markerChars.size();
    let jLen        = jsonChars.size();

    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= jLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (jsonChars[i + j] != markerChars[j]) {
          matched := false;
          break matchLoop;
        };
        j += 1;
      };
      if (matched) {
        startIdx := ?(i + mLen);
        break findMarker;
      };
      i += 1;
    };

    switch startIdx {
      case null "";
      case (?afterMarker) {
        var end     = afterMarker;
        var escaped = false;
        label scan while (end < jLen) {
          let c = jsonChars[end];
          if (escaped) {
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == '\u{22}') {
            break scan;
          };
          end += 1;
        };
        let len : Nat = end - afterMarker;
        Text.fromIter(Array.tabulate(len, func(k) { jsonChars[afterMarker + k] }).vals());
      };
    };
  };

  /// Extract `candidates[0].content.parts[0].text` from a Gemini JSON response.
  public func extractGeminiContent(raw : Text) : Text {
    // Look for "text":" marker which appears inside the parts array
    let marker      = "\"text\":\"";
    let markerChars = marker.toArray();
    let rawChars    = raw.toArray();
    let mLen        = markerChars.size();
    let rLen        = rawChars.size();

    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= rLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (rawChars[i + j] != markerChars[j]) {
          matched := false;
          break matchLoop;
        };
        j += 1;
      };
      if (matched) {
        startIdx := ?(i + mLen);
        break findMarker;
      };
      i += 1;
    };

    switch startIdx {
      case null "";
      case (?afterMarker) {
        var end     = afterMarker;
        var escaped = false;
        label scan while (end < rLen) {
          let c = rawChars[end];
          if (escaped) {
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == '\u{22}') {
            break scan;
          };
          end += 1;
        };
        let len : Nat = end - afterMarker;
        Text.fromIter(Array.tabulate(len, func(k) { rawChars[afterMarker + k] }).vals());
      };
    };
  };

  // ── JSON helpers ──────────────────────────────────────────────────────────

  private func buildMessagesJsonArray(msgs : [T.OpenRouterMessage]) : Text {
    var json = "[";
    var i = 0;
    for (m in msgs.vals()) {
      if (i > 0) json #= ",";
      json #= "{\"role\":\"" # escapeJson(m.role) # "\",\"content\":\"" # escapeJson(m.content) # "\"}";
      i += 1;
    };
    json # "]";
  };

  // legacy overload kept for internal use
  private func _buildMessagesJson(msgs : [T.OpenRouterMessage]) : Text {
    buildMessagesJsonArray(msgs);
  };

  /// Extract the `content` field from a raw OpenRouter JSON response.
  public func extractContent(raw : Text) : Text {
    let marker     = "\"content\":\"";
    let markerChars = marker.toArray();
    let rawChars    = raw.toArray();
    let mLen        = markerChars.size();
    let rLen        = rawChars.size();

    // Manual scan to find the marker (Text.indexOf unavailable in mo:core)
    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= rLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (rawChars[i + j] != markerChars[j]) {
          matched := false;
          break matchLoop;
        };
        j += 1;
      };
      if (matched) {
        startIdx := ?(i + mLen);
        break findMarker;
      };
      i += 1;
    };

    switch startIdx {
      case null "";
      case (?afterMarker) {
        var end     = afterMarker;
        var escaped = false;
        label scan while (end < rLen) {
          let c = rawChars[end];
          if (escaped) {
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == '\u{22}') {
            break scan;
          };
          end += 1;
        };
        let len : Nat = end - afterMarker;
        Text.fromIter(Array.tabulate(len, func(k) { rawChars[afterMarker + k] }).vals());
      };
    };
  };

  private func escapeJson(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      if (c == '\u{22}') {
        out #= "\\\"";
      } else if (c == '\\') {
        out #= "\\\\";
      } else if (c == '\n') {
        out #= "\\n";
      } else if (c == '\r') {
        out #= "\\r";
      } else if (c == '\t') {
        out #= "\\t";
      } else {
        out #= Text.fromChar(c);
      };
    };
    out;
  };

  // ── Task name helpers ──────────────────────────────────────────────────────

  public func taskTypeToText(t : T.TaskType) : Text {
    switch t {
      case (#EmailGeneration) "EmailGeneration";
      case (#ProposalWriting) "ProposalWriting";
      case (#ReviewResponse)  "ReviewResponse";
      case (#RAGAnswer)       "RAGAnswer";
      case (#Summarization)   "Summarization";
      case (#OutreachCopy)    "OutreachCopy";
      case (#FollowUpDraft)   "FollowUpDraft";
      case (#MorningDigest)   "MorningDigest";
    };
  };

  public func textToTaskType(s : Text) : T.TaskType {
    if      (s == "EmailGeneration") #EmailGeneration
    else if (s == "ProposalWriting") #ProposalWriting
    else if (s == "ReviewResponse")  #ReviewResponse
    else if (s == "RAGAnswer")       #RAGAnswer
    else if (s == "Summarization")   #Summarization
    else if (s == "OutreachCopy")    #OutreachCopy
    else if (s == "FollowUpDraft")   #FollowUpDraft
    else                             #MorningDigest;
  };

};
