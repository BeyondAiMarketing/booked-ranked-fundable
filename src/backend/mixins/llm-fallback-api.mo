import LLMFb  "../lib/llm-fallback";
import T       "../types/llm-fallback";
import ORT     "../types/openRouter";
import ICTypes "../types/integrationCredentials";
import ICLib   "../lib/integrationCredentials";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Map     "mo:core/Map";
import Array   "mo:core/Array";
import Time    "mo:core/Time";
import Int     "mo:core/Int";
import Text    "mo:core/Text";
import Error   "mo:core/Error";

mixin (
  llmFallbackState : LLMFb.State,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
  transform        : LLMFb.Transform,
) {

  /// Return health snapshots for all providers in the chain.
  /// Surfaces to the existing GoLivePage IntegrationHealthPanel as an extension.
  public shared ({ caller = _ }) func getLLMProviderHealth() : async [T.ProviderHealthSnapshot] {
    LLMFb.healthSnapshots(llmFallbackState)
  };

  /// Manually reset a provider's skip state on demand (UI action).
  public shared ({ caller = _ }) func resetLLMProviderHealth(provider : T.ProviderId) : async () {
    LLMFb.resetProviderHealth(llmFallbackState, provider)
  };

  /// Return recent route log entries for observability.
  public shared ({ caller = _ }) func getLLMRouteLog(limit : Nat) : async [T.RouteLogEntry] {
    LLMFb.recentRouteLog(llmFallbackState, limit)
  };

  /// Single LLM entry point reachable through the existing
  /// callOpenRouterForTask and callWithFallback entry points so existing
  /// callers upgrade transparently. Resolves keys from the credentials store,
  /// walks the priority chain with cost-aware selection, retry, and health.
  public shared ({ caller = _ }) func routeLLMCall(
    task       : ORT.TaskType,
    messages   : [ORT.OpenRouterMessage],
    capability : T.TaskCapability,
  ) : async Text {
    // Resolve keys from the platform credentials store
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAll(enc, credSalt);
    };
    let keys = LLMFb.resolveKeys(creds);

    // Feature flags: LLM calls are gated only by API key presence (per project
    // convention). The app-level flags are passed as all-true here since they
    // gate non-LLM integrations (Twilio, SendGrid) and the Lead Engine, not
    // individual LLM providers.
    let flags : LLMFb.FeatureFlags = {
      leadEngineEnabled  = true;
      twilioEnabled       = true;
      sendgridEnabled     = true;
    };

    // Legacy fallback for the Generic tier: tries OpenRouter adapter with the
    // stored key, then Gemini via a direct call. This preserves the existing
    // callWithFallback behavior as the final fallback tier.
    await LLMFb.route(
      llmFallbackState,
      task,
      messages,
      keys,
      flags,
      capability,
      transform,
      llmFbLegacyFallback(task, messages, keys),
    )
  };

  /// Send a fixed test prompt ("Reply with the single word: READY") through the
  /// live LLM fallback router using the stored nvidiaNimApiKey, so the request
  /// flows through the full Nemotron → OpenRouter → OpenAI → Anthropic → Generic
  /// fallback chain. Returns a structured NemotronTestResult containing the
  /// response text, success flag, the provider that ultimately answered (read
  /// from the most recent route log entry after the call), the model name, and
  /// a timestamp. Does NOT modify routeLLMCall or any existing LLM fallback
  /// function — only delegates to the existing router and reads the route log.
  public shared ({ caller = _ }) func testNemotronPrompt() : async T.NemotronTestResult {
    // Resolve keys from the platform credentials store — same pattern as
    // routeLLMCall.
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAll(enc, credSalt);
    };
    let keys = LLMFb.resolveKeys(creds);

    // Feature flags: LLM calls are gated only by API key presence (per project
    // convention). The app-level flags are passed as all-true here since they
    // gate non-LLM integrations (Twilio, SendGrid) and the Lead Engine, not
    // individual LLM providers.
    let flags : LLMFb.FeatureFlags = {
      leadEngineEnabled  = true;
      twilioEnabled       = true;
      sendgridEnabled     = true;
    };

    // Default capability for the test prompt: a small maxTokens budget, a
    // neutral temperature, and no required model family so any provider in
    // the chain can answer.
    let capability : T.TaskCapability = {
      maxTokens    = 256;
      temperature  = 0.7;
      modelFamily  = null;
    };

    // Delegate to the lib-level testNemotronPrompt, reusing the same legacy
    // fallback closure (OpenRouter → Gemini) used by routeLLMCall for the
    // Generic tier. Wrap in a try/catch so a thrown error is surfaced as a
    // structured NemotronTestResult with success=false rather than trapping
    // the canister.
    try {
      await LLMFb.testNemotronPrompt(
        llmFallbackState,
        keys,
        flags,
        capability,
        transform,
        llmFbLegacyFallback(#Summarization, [], keys),
      )
    } catch (e) {
      {
        responseText  = "";
        success       = false;
        provider      = "Unknown";
        model         = "";
        timestampNs   = Int.abs(Time.now());
        errorMessage   = ?Text.concat("testNemotronPrompt failed: ", e.message());
      }
    }
  };

  // ── Private helpers ──────────────────────────────────────────────────────

  /// Build the legacy fallback closure that mirrors the existing
  /// callWithFallback behavior: OpenRouter adapter → Gemini direct call.
  /// This is the Generic tier of the new chain.
  private func llmFbLegacyFallback(
    task     : ORT.TaskType,
    messages : [ORT.OpenRouterMessage],
    keys     : LLMFb.ProviderKeys,
  ) : (ORT.TaskType, [ORT.OpenRouterMessage]) -> async Text {
    func(_t : ORT.TaskType, msgs : [ORT.OpenRouterMessage]) : async Text {
      // Convert to LLMMessage for the adapter
      let llmMessages = msgs.map(
        func(m) { { role = m.role; content = m.content } }
      );
      // 1. Try OpenRouter adapter directly
      if (keys.openRouterKey != "") {
        let r = await LLMFb.callOpenRouter(
          keys.openRouterKey, "openai/gpt-4o-mini", llmMessages, transform
        );
        if (r != "") return r;
      };
      // 2. Try Gemini direct (API key in URL query param)
      if (keys.geminiKey != "") {
        let r = await callGeminiDirect(keys.geminiKey, msgs);
        if (r != "") return r;
      };
      ""
    }
  };

  /// Direct Gemini call mirroring the existing callGemini in openRouter.mo.
  /// Gemini uses API key as URL query param, not Authorization header.
  private func callGeminiDirect(
    geminiKey : Text,
    messages  : [ORT.OpenRouterMessage],
  ) : async Text {
    // Combine messages into a single prompt (Gemini's contents[].parts[].text)
    var combinedPrompt = "";
    for (m in messages.vals()) {
      if (combinedPrompt == "") {
        combinedPrompt := m.content;
      } else {
        combinedPrompt := combinedPrompt # "\n" # m.content;
      };
    };
    let bodyJson = "{\"contents\":[{\"parts\":[{\"text\":\"" # escapeJson(combinedPrompt) # "\"}]}]," #
                   "\"generationConfig\":{\"maxOutputTokens\":2000}}";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # geminiKey;
    try {
      let resp = await Outcall.httpPostRequest(
        url,
        [{ name = "Content-Type"; value = "application/json" }],
        bodyJson,
        transform,
      );
      extractGeminiContent(resp)
    } catch (_) { "" }
  };

  /// Extract `candidates[0].content.parts[0].text` from a Gemini JSON response.
  private func extractGeminiContent(raw : Text) : Text {
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

  /// Escape a Text value for safe inclusion in a JSON string literal.
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
    out
  };

};
