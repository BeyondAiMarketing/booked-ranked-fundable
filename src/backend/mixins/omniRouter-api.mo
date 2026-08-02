/// OmniRouter public API mixin.
///
/// Exposes four public functions:
///   omniRoute             — main entry point: classify, route, execute, log.
///   getOmniRouterMetrics  — metrics snapshot for the dashboard.
///   getOmniRoutingHistory — recent routing decisions for the history panel.
///   resetOmniRouterMetrics — admin: clear all metrics and history.
///
/// The mixin wraps the existing LLM fallback chain exactly as
/// mixins/llm-fallback-api.mo does, so the two entry points (routeLLMCall
/// and omniRoute) share the same credential resolution, provider health
/// tracking, cost-aware selection, retry, and observability.
///
/// Mixin parameters are all stabilizable (no function closures) to avoid
/// the moc 1.10.1 stable-signature crash (desugar.ml:1083 List.map2).
import T       "../types/omniRouter";
import ORT     "../types/openRouter";
import LLMFb   "../lib/llm-fallback";
import LLMTypes "../types/llm-fallback";
import OmniLib "../lib/omniRouter";
import ICTypes "../types/integrationCredentials";
import ICLib   "../lib/integrationCredentials";
import SecMgr  "../lib/secretManager";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Map     "mo:core/Map";
import Array   "mo:core/Array";
import Time    "mo:core/Time";
import Int     "mo:core/Int";
import Text    "mo:core/Text";

mixin (
  omniRouterState  : OmniLib.State,
  llmFallbackState : LLMFb.State,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
  transform        : LLMFb.Transform,
  secretState      : ?SecMgr.State,
) {

  // ── Candid type re-exports ───────────────────────────────────────────────

  public type OmniResult        = T.OmniResult;
  public type OmniRequest       = T.OmniRequest;
  public type RoutingDecision   = T.RoutingDecision;
  public type OmniRouterMetrics = T.OmniRouterMetrics;
  public type OmniRouteLogEntry = T.RouteLogEntry;

  // ── Main entry point ────────────────────────────────────────────────────

  /// Universal AI dispatch entry point.
  ///
  /// 1. Classifies intent from the goal + optional context hint.
  /// 2. Selects routing target (llm_direct | orchestrator).
  /// 3. Maps intent → OpenRouter TaskType for cost-aware model selection.
  /// 4. Builds a BRF-branded system prompt grounding the LLM response.
  /// 5. Executes via the existing LLM fallback chain (Nemotron → OpenRouter →
  ///    OpenAI → Anthropic → Generic).
  /// 6. Records metrics and appends a route log entry.
  /// 7. Returns a structured OmniResult with routing metadata.
  ///
  /// Existing call sites (routeLLMCall, testNemotronPrompt, etc.) are
  /// unmodified — omniRoute is a new entry point alongside them.
  public shared ({ caller = _ }) func omniRoute(
    request : T.OmniRequest,
  ) : async T.OmniResult {
    let startNs  = Time.now();
    let corrId   = OmniLib.generateCorrelationId(request.tenantId, startNs);

    // 1. Classify intent.
    let (intentClass, confidence) = OmniLib.classifyIntent(request.goal, request.contextHint);

    // 2. Select routing target.
    let (target, reasoning) = OmniLib.selectTarget(intentClass, request.goal);

    // 3. Map intent to TaskType.
    let taskTypeText = OmniLib.intentToTaskType(intentClass);
    let taskType     = omni_textToTaskType(taskTypeText);

    // 4. Resolve provider keys.
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState);
    };
    let keys  = LLMFb.resolveKeys(creds);
    let flags : LLMFb.FeatureFlags = {
      leadEngineEnabled = true;
      twilioEnabled      = true;
      sendgridEnabled    = true;
    };

    // 5. Build messages.
    let msgPairs = OmniLib.buildMessages(request.goal, intentClass);
    let orMessages : [ORT.OpenRouterMessage] = Array.tabulate(
      msgPairs.size(),
      func(i) { let (r, c) = msgPairs[i]; { role = r; content = c } },
    );

    let capability : LLMTypes.TaskCapability = {
      maxTokens   = 2000;
      temperature = 0.7;
      modelFamily = null;
    };

    // 6. Execute.
    var output       : Text   = "";
    var success      : Bool   = false;
    var providerText : ?Text  = null;
    var modelText    : ?Text  = null;
    var errorMsg     : ?Text  = null;
    var estCost      : Float  = 0.0;

    try {
      output := await LLMFb.route(
        llmFallbackState,
        taskType,
        orMessages,
        keys,
        flags,
        capability,
        transform,
        omni_legacyFallback(taskType, orMessages, keys),
      );
      success := output != "";

      // Read provider/model from the most recent route log entry.
      let log = LLMFb.recentRouteLog(llmFallbackState, 1);
      if (log.size() > 0) {
        providerText := ?omni_providerToText(log[0].provider);
        modelText    := ?log[0].model;
        estCost      := log[0].estimatedCost;
      };

      if (not success and errorMsg == null) {
        errorMsg := ?"All providers exhausted — check API key configuration";
      };
    } catch (e) {
      errorMsg := ?("OmniRouter error: " # e.message());
      success  := false;
    };

    let endNs    = Time.now();
    let duration = endNs - startNs;

    // 7. Record metrics.
    let logEntry : T.RouteLogEntry = {
      correlationId = corrId;
      tenantId      = request.tenantId;
      goalSummary   = OmniLib.summarizeGoal(request.goal);
      intentClass;
      target;
      provider      = providerText;
      model         = modelText;
      success;
      durationNs    = duration;
      timestampNs   = endNs;
    };
    OmniLib.recordRequest(omniRouterState, logEntry, success, duration);

    {
      output;
      routingDecision = {
        intentClass;
        target;
        taskType    = taskTypeText;
        confidence;
        reasoning;
      };
      provider      = providerText;
      model         = modelText;
      estimatedCost = estCost;
      correlationId = corrId;
      durationNs    = duration;
      success;
      errorMessage  = errorMsg;
    }
  };

  // ── Observability ────────────────────────────────────────────────────────

  /// Return current OmniRouter metrics for the dashboard.
  public shared query ({ caller = _ }) func getOmniRouterMetrics() : async T.OmniRouterMetrics {
    OmniLib.getMetrics(omniRouterState)
  };

  /// Return the most recent `limit` routing history entries.
  public shared query ({ caller = _ }) func getOmniRoutingHistory(
    limit : Nat,
  ) : async [T.RouteLogEntry] {
    OmniLib.recentLog(omniRouterState, limit)
  };

  /// Admin: reset all OmniRouter metrics and routing history.
  public shared ({ caller = _ }) func resetOmniRouterMetrics() : async () {
    OmniLib.resetMetrics(omniRouterState)
  };

  // ── Private helpers ──────────────────────────────────────────────────────

  /// Legacy fallback for the Generic tier: OpenRouter (gpt-4o-mini) → Gemini.
  /// Mirrors the identical helper in mixins/llm-fallback-api.mo.
  private func omni_legacyFallback(
    _task    : ORT.TaskType,
    _msgs    : [ORT.OpenRouterMessage],
    keys     : LLMFb.ProviderKeys,
  ) : (ORT.TaskType, [ORT.OpenRouterMessage]) -> async Text {
    func(_t, msgs) : async Text {
      let llmMsgs = Array.tabulate(msgs.size(), func(i) : LLMTypes.LLMMessage {
        { role = msgs[i].role; content = msgs[i].content }
      });
      if (keys.openRouterKey != "") {
        let r = await LLMFb.callOpenRouter(
          keys.openRouterKey, "openai/gpt-4o-mini", llmMsgs, transform,
        );
        if (r != "") return r;
      };
      if (keys.geminiKey != "") {
        let r = await omni_callGemini(keys.geminiKey, msgs);
        if (r != "") return r;
      };
      ""
    }
  };

  /// Direct Gemini call (API key in URL query param).
  /// Mirrors the identical helper in mixins/llm-fallback-api.mo.
  private func omni_callGemini(
    geminiKey : Text,
    messages  : [ORT.OpenRouterMessage],
  ) : async Text {
    var prompt = "";
    for (m in messages.vals()) {
      prompt := if (prompt == "") m.content else prompt # "\n" # m.content;
    };
    let body = "{\"contents\":[{\"parts\":[{\"text\":\""
             # omni_escapeJson(prompt)
             # "\"}]}],\"generationConfig\":{\"maxOutputTokens\":2000}}";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/"
            # "gemini-1.5-flash:generateContent?key=" # geminiKey;
    try {
      let resp = await Outcall.httpPostRequest(
        url,
        [{ name = "Content-Type"; value = "application/json" }],
        body,
        transform,
      );
      omni_extractGemini(resp)
    } catch (_) { "" }
  };

  /// Extract candidates[0].content.parts[0].text from a Gemini JSON response.
  private func omni_extractGemini(raw : Text) : Text {
    let marker  = "\"text\":\"";
    let mChars  = marker.toArray();
    let rChars  = raw.toArray();
    let mLen    = mChars.size();
    let rLen    = rChars.size();
    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= rLen) {
      var ok = true;
      var j  = 0;
      label matchLoop while (j < mLen) {
        if (rChars[i + j] != mChars[j]) { ok := false; break matchLoop };
        j += 1;
      };
      if (ok) { startIdx := ?(i + mLen); break findMarker };
      i += 1;
    };
    switch startIdx {
      case null "";
      case (?after) {
        var end = after;
        var esc = false;
        label scan while (end < rLen) {
          let c = rChars[end];
          if (esc)            { esc := false }
          else if (c == '\\') { esc := true }
          else if (c == '\u{22}') { break scan };
          end += 1;
        };
        let len : Nat = end - after;
        Text.fromIter(Array.tabulate(len, func(k) { rChars[after + k] }).vals())
      };
    }
  };

  /// Escape a Text value for safe inclusion in a JSON string literal.
  private func omni_escapeJson(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      if      (c == '\u{22}') { out #= "\\\"" }
      else if (c == '\\')     { out #= "\\\\" }
      else if (c == '\n')     { out #= "\\n"  }
      else if (c == '\r')     { out #= "\\r"  }
      else if (c == '\t')     { out #= "\\t"  }
      else                    { out #= Text.fromChar(c) };
    };
    out
  };

  /// Convert a Text TaskType key to the ORT.TaskType variant.
  private func omni_textToTaskType(s : Text) : ORT.TaskType {
    if (s == "EmailGeneration")  return #EmailGeneration;
    if (s == "ProposalWriting")  return #ProposalWriting;
    if (s == "ReviewResponse")   return #ReviewResponse;
    if (s == "RAGAnswer")        return #RAGAnswer;
    if (s == "OutreachCopy")     return #OutreachCopy;
    if (s == "FollowUpDraft")    return #FollowUpDraft;
    if (s == "MorningDigest")    return #MorningDigest;
    #Summarization
  };

  /// Convert a ProviderId variant to a human-readable Text for logging.
  private func omni_providerToText(p : LLMTypes.ProviderId) : Text {
    switch (p) {
      case (#Nemotron)   "Nemotron";
      case (#OpenRouter) "OpenRouter";
      case (#OpenAI)     "OpenAI";
      case (#Anthropic)  "Anthropic";
      case (#Generic)    "Generic";
    }
  };

};
