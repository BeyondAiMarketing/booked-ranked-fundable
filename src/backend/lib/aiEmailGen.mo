import AbacusLib      "../lib/abacus";
import ORT            "../types/openRouter";

module {

  public type LeadContext = {
    businessName : Text;
    city         : Text;
    niche        : Text;
    ownerName    : ?Text;
  };

  /// Route callback type: routes an LLM task through the unified fallback
  /// chain. Lib modules cannot call actor methods directly, so the caller
  /// (a mixin with access to routeLLMCall) passes this closure in. The
  /// callback is a flat (task, messages) -> async Text function — NOT curried —
  /// so the caller can define it at the top level of a public shared func body
  /// where the sibling routeLLMCall method is in scope (matching the working
  /// leadAI-api.mo pattern). A curried callback forced the call site into a
  /// nested local closure where routeLLMCall could not be resolved.
  public type RouteCallback = (ORT.TaskType, [ORT.OpenRouterMessage]) -> async Text;

  /// Build and dispatch an AI-tailored email body via the unified LLM fallback
  /// chain, with an Abacus-style placeholder fallback when the chain returns
  /// empty. Returns the tailored email text.
  public func generateTailoredEmail(
    abacusState      : AbacusLib.State,
    route            : RouteCallback,
    template         : Text,
    ctx              : LeadContext,
  ) : async Text {
    let ownerPart = switch (ctx.ownerName) {
      case (?n) " (owner: " # n # ")";
      case null "";
    };
    let systemPrompt =
      "You are an expert direct-response copywriter trained on Brunson, Hormozi, Kennedy, and Halbert frameworks. " #
      "Rewrite this email template for " # ctx.businessName # ownerPart # ", a " # ctx.niche #
      " company in " # ctx.city # ". Keep the structure but make the copy specific to their business context. " #
      "Be concise, punchy, and conversion-focused.";
    let messages : [ORT.OpenRouterMessage] = [
      { role = "system"; content = systemPrompt },
      { role = "user";   content = "Template to rewrite:\n\n" # template },
    ];

    // Route through the unified fallback chain
    let aiResult = await route(#EmailGeneration, messages);
    if (aiResult != "") return aiResult;

    // Fallback: Abacus-style placeholder enrichment
    switch (AbacusLib.getConfig(abacusState)) {
      case null {
        "[AI-tailored for " # ctx.businessName # ", " # ctx.city # "]\n\n" # template;
      };
      case (?_) {
        AbacusLib.incrementCallCount(abacusState);
        "[AI-tailored for " # ctx.businessName # ", " # ctx.city # "]\n\n" # template;
      };
    };
  };

};
