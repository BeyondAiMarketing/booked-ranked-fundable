/// OmniRouter — universal AI dispatch layer.
///
/// Sits ABOVE the existing LLM fallback chain and AI Orchestrator.  For each
/// incoming goal it:
///   1. Classifies intent (keyword-based, zero LLM tokens consumed).
///   2. Selects a routing target: "llm_direct" for single-pass calls or
///      "orchestrator" for multi-step goals.
///   3. Maps the intent to the appropriate OpenRouter TaskType so the
///      cost-aware model selector in LLMFallbackLib picks the best provider.
///   4. Builds a BRF-branded system prompt that grounds the LLM response.
///   5. Maintains an in-memory metrics ring (counts, durations, intent &
///      provider breakdowns) for the OmniRouter dashboard.
///
/// The module intentionally reuses existing lib functions:
///   - LLMFallbackLib.route for provider selection and execution.
///   - AIOrchestratorLib.plan for multi-step goal decomposition hint.
///
/// No new stable state beyond what is declared in OmniLib.State.
import T     "../types/omniRouter";
import Array "mo:core/Array";
import Time  "mo:core/Time";
import Text  "mo:core/Text";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Char  "mo:core/Char";

module OmniRouterLib {

  // ── State ─────────────────────────────────────────────────────────────────

  public type State = {
    var totalRequests      : Nat;
    var successfulRequests : Nat;
    var failedRequests     : Nat;
    var totalDurationNs    : Int;
    var routeLog           : [T.RouteLogEntry];
    var intentCounts       : [(Text, Nat)];
    var providerCounts     : [(Text, Nat)];
  };

  public func emptyState() : State {
    {
      var totalRequests      = 0;
      var successfulRequests = 0;
      var failedRequests     = 0;
      var totalDurationNs    = 0;
      var routeLog           = [];
      var intentCounts       = [];
      var providerCounts     = [];
    }
  };

  // ── Constants ──────────────────────────────────────────────────────────────

  let maxRouteLogSize : Nat = 200;
  let goalSummaryLen  : Nat = 120;

  // ── Intent classification ─────────────────────────────────────────────────

  /// Keyword-based intent classification.  Zero LLM tokens consumed.
  /// Returns (intentClass, confidence) where confidence is 0.4–0.95.
  public func classifyIntent(goal : Text, contextHint : ?Text) : (T.IntentClass, Float) {
    // 1. Honour explicit context hint (highest confidence).
    switch (contextHint) {
      case (?"lead")      return ("lead_management",   0.95);
      case (?"email")     return ("email_outreach",    0.95);
      case (?"seo")       return ("seo_optimization",  0.95);
      case (?"review")    return ("review_management", 0.95);
      case (?"content")   return ("content_creation",  0.95);
      case (?"analytics" | ?"report") return ("analytics",        0.95);
      case (?"funding")   return ("funding_readiness", 0.95);
      case (?"voice")     return ("voice_outreach",    0.95);
      case _              {};
    };

    // 2. Lowercase the goal for case-insensitive matching.
    let lower = toLower(goal);

    // 3. Score each intent by keyword hits.
    let scoreSets : [(T.IntentClass, [Text])] = [
      ("lead_management",   ["lead", "import leads", "enrich", "dedup", "prospect",
                             "contact", "crm", "csv", "pipeline", "import"]),
      ("email_outreach",    ["email", "outreach", "follow-up", "follow up",
                             "sequence", "drip", "newsletter", "reply", "inbox",
                             "send email", "campaign"]),
      ("content_creation",  ["content", "post", "social", "copy", "caption",
                             "landing page", "blog", "proposal", "write",
                             "create", "generate text"]),
      ("review_management", ["review", "reputation", "respond", "rating",
                             "star", "gbp", "google business", "feedback"]),
      ("seo_optimization",  ["seo", "ranking", "local seo", "keyword", "citation",
                             "nap", "search", "audit", "rank", "google"]),
      ("analytics",         ["analytics", "report", "performance", "insight",
                             "metrics", "dashboard", "monthly", "summary",
                             "data", "stats"]),
      ("funding_readiness", ["funding", "loan", "credit", "fundability", "lender",
                             "capital", "finance", "money", "fund"]),
      ("voice_outreach",    ["voice", "call", "phone", "script", "vapi",
                             "audio", "outbound call", "cold call", "speak"]),
    ];

    var bestIntent : T.IntentClass = "general_assistant";
    var bestScore  : Nat = 0;

    for ((intent, keywords) in scoreSets.vals()) {
      var score : Nat = 0;
      for (kw in keywords.vals()) {
        if (Text.contains(lower, #text kw)) { score += 1 };
      };
      if (score > bestScore) {
        bestScore  := score;
        bestIntent := intent;
      };
    };

    let conf : Float =
      if      (bestScore == 0) 0.4
      else if (bestScore == 1) 0.65
      else if (bestScore == 2) 0.80
      else                     0.92;

    (bestIntent, conf)
  };

  // ── Routing target selection ─────────────────────────────────────────────

  /// Select the routing target and a human-readable reasoning string.
  ///
  /// Multi-step goals (detected by sequencing keywords or length > 300 chars)
  /// are routed through the AI Orchestrator.  All other goals go llm_direct.
  public func selectTarget(intent : T.IntentClass, goal : Text) : (T.RoutingTarget, Text) {
    let lower = toLower(goal);
    let isMultiStep =
         Text.contains(lower, #text " then ")
      or Text.contains(lower, #text " and then ")
      or Text.contains(lower, #text " after that")
      or Text.contains(lower, #text " followed by ")
      or Text.contains(lower, #text " next, ")
      or goal.size() > 300;

    if (isMultiStep) {
      return ("orchestrator",
              "Multi-step goal decomposed through AI Orchestrator");
    };

    // Analytics always benefits from orchestrator's multi-source assembly.
    if (intent == "analytics") {
      return ("orchestrator",
              "Analytics goal assembled by AI Orchestrator across data sources");
    };

    // Single-step intents → direct LLM call with tuned system prompt.
    let reason = "Single-pass " # intent # " call through the LLM fallback chain";
    ("llm_direct", reason)
  };

  // ── TaskType mapping ─────────────────────────────────────────────────────

  /// Map an IntentClass to the most appropriate OpenRouter TaskType key.
  /// The key is used by the cost-aware model selector.
  public func intentToTaskType(intent : T.IntentClass) : Text {
    if (intent == "lead_management")    return "Summarization";
    if (intent == "email_outreach")     return "OutreachCopy";
    if (intent == "content_creation")   return "EmailGeneration";
    if (intent == "review_management")  return "ReviewResponse";
    if (intent == "seo_optimization")   return "Summarization";
    if (intent == "analytics")          return "MorningDigest";
    if (intent == "funding_readiness")  return "ProposalWriting";
    if (intent == "voice_outreach")     return "OutreachCopy";
    "Summarization" // general_assistant fallback
  };

  // ── Message builder ───────────────────────────────────────────────────────

  /// Build the system + user message pair for the LLM call, enriched with a
  /// BRF-specific system prompt tailored to the classified intent.
  public func buildMessages(goal : Text, intent : T.IntentClass) : [(Text, Text)] {
    let system = buildSystemPrompt(intent);
    [("system", system), ("user", goal)]
  };

  private func buildSystemPrompt(intent : T.IntentClass) : Text {
    let base = "You are an AI assistant for Booked Ranked Fundable (BRF), a platform "
             # "that helps local service businesses get booked, ranked, and funded. "
             # "Respond with clear, actionable output. Be concise and professional.";
    if (intent == "lead_management") {
      base # " You specialize in lead management, CRM enrichment, and pipeline "
           # "optimization for local service businesses."
    } else if (intent == "email_outreach") {
      base # " You specialize in high-converting email outreach sequences and "
           # "follow-up copy for local service businesses."
    } else if (intent == "content_creation") {
      base # " You specialize in compelling marketing content, social posts, "
           # "proposals, and landing page copy for local service businesses."
    } else if (intent == "review_management") {
      base # " You specialize in reputation management and crafting professional, "
           # "empathetic responses to customer reviews for local businesses."
    } else if (intent == "seo_optimization") {
      base # " You specialize in local SEO strategy, Google Business Profile "
           # "optimization, and citation building for local service businesses."
    } else if (intent == "analytics") {
      base # " You specialize in analyzing business performance data and creating "
           # "clear, actionable monthly review summaries for local businesses."
    } else if (intent == "funding_readiness") {
      base # " You specialize in assessing and improving business fundability, "
           # "credit profiles, and loan readiness for local service businesses."
    } else if (intent == "voice_outreach") {
      base # " You specialize in writing effective voice agent scripts and "
           # "cold-call sequences for local service businesses."
    } else {
      base # " You provide strategic guidance across booking, ranking, and "
           # "funding for local service businesses."
    }
  };

  // ── State management ──────────────────────────────────────────────────────

  /// Append a route log entry and update all metrics counters.
  public func recordRequest(
    state    : State,
    entry    : T.RouteLogEntry,
    success  : Bool,
    duration : Int,
  ) : () {
    state.totalRequests += 1;
    if (success) { state.successfulRequests += 1 }
    else         { state.failedRequests     += 1 };
    state.totalDurationNs += duration;

    // Increment intent counter.
    state.intentCounts := incrementCounter(state.intentCounts, entry.intentClass);

    // Increment provider counter.
    let prov = switch (entry.provider) { case (?p) p; case null "unknown" };
    state.providerCounts := incrementCounter(state.providerCounts, prov);

    // Append to ring log, dropping the oldest entry when full.
    let updated = state.routeLog.concat([entry]);
    state.routeLog :=
      if (updated.size() > maxRouteLogSize) {
        let drop = updated.size() - maxRouteLogSize;
        Array.tabulate(maxRouteLogSize, func(i) { updated[i + drop] })
      } else {
        updated
      };
  };

  /// Return a metrics snapshot for the dashboard.
  public func getMetrics(state : State) : T.OmniRouterMetrics {
    let avgDur : Int =
      if (state.totalRequests == 0) 0
      else state.totalDurationNs / Int.fromNat(state.totalRequests);
    {
      totalRequests      = state.totalRequests;
      successfulRequests = state.successfulRequests;
      failedRequests     = state.failedRequests;
      avgDurationNs      = avgDur;
      intentBreakdown    = state.intentCounts;
      providerBreakdown  = state.providerCounts;
    }
  };

  /// Return the most recent `limit` route log entries.
  public func recentLog(state : State, limit : Nat) : [T.RouteLogEntry] {
    let log = state.routeLog;
    let len = log.size();
    if (len <= limit) { log }
    else {
      let start = len - limit;
      Array.tabulate(limit, func(i) { log[start + i] })
    }
  };

  /// Reset all metrics and clear the route log.
  public func resetMetrics(state : State) : () {
    state.totalRequests      := 0;
    state.successfulRequests := 0;
    state.failedRequests     := 0;
    state.totalDurationNs    := 0;
    state.routeLog           := [];
    state.intentCounts       := [];
    state.providerCounts     := [];
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Generate a unique correlation ID for an OmniRouter request.
  public func generateCorrelationId(tenantId : Text, ts : Int) : Text {
    "omni-" # tenantId # "-" # Int.toText(ts)
  };

  /// Truncate a goal to at most `goalSummaryLen` characters for logging.
  public func summarizeGoal(goal : Text) : Text {
    let chars = goal.toArray();
    if (chars.size() <= goalSummaryLen) {
      goal
    } else {
      Text.fromIter(
        Array.tabulate(goalSummaryLen, func(i) { chars[i] }).vals()
      ) # "..."
    }
  };

  // ── Private helpers ───────────────────────────────────────────────────────

  private func toLower(t : Text) : Text {
    var out = "";
    for (c in t.chars()) {
      let code = Char.toNat32(c);
      let lc = if (code >= 65 and code <= 90) Char.fromNat32(code + 32) else c;
      out #= Text.fromChar(lc);
    };
    out
  };

  private func incrementCounter(counts : [(Text, Nat)], key : Text) : [(Text, Nat)] {
    var found = false;
    let updated = Array.tabulate(counts.size(), func(i) : (Text, Nat) {
      let (k, v) = counts[i];
      if (k == key) { found := true; (k, v + 1) } else (k, v)
    });
    if (found) updated
    else updated.concat([(key, 1)])
  };

};
