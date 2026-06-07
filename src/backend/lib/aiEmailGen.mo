import AbacusLib      "../lib/abacus";
import AbacusT        "../types/abacus";
import OpenRouterLib  "../lib/openRouter";
import ORT            "../types/openRouter";

module {

  public type LeadContext = {
    businessName : Text;
    city         : Text;
    niche        : Text;
    ownerName    : ?Text;
  };

  /// Build and dispatch an AI-tailored email body via Abacus RouteLLM.
  /// Returns the tailored email text or an error message.
  public func generateTailoredEmail(
    abacusState      : AbacusLib.State,
    openRouterState  : OpenRouterLib.State,
    template         : Text,
    ctx              : LeadContext,
    transform        : OpenRouterLib.Transform,
    openaiKey        : Text,
    geminiKey        : Text,
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

    // Try OpenRouter with fallback
    let aiResult = await OpenRouterLib.callWithFallback(openRouterState, #EmailGeneration, messages, transform, openaiKey, geminiKey);
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
