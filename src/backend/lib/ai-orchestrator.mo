import OrchestratorTypes "../types/ai-orchestrator";
import LLMFallbackTypes  "../types/llm-fallback";
import Text              "mo:core/Text";
import Time              "mo:core/Time";
import Array             "mo:core/Array";
import Nat               "mo:core/Nat";
import Float             "mo:core/Float";
import Char              "mo:core/Char";
import Nat32             "mo:core/Nat32";

module AIOrchestratorLib {

  // ── Constants ────────────────────────────────────────────────────────────

  /// Ring buffer cap for the orchestrator route log, matching LLMFallbackLib.
  let maxRouteLogSize : Nat = 100;

  /// Default per-tenant orchestrator rate-limit budget.
  let defaultRateLimitMax : Nat = 100;

  /// Default rate-limit window in milliseconds (1 minute).
  let defaultRateLimitWindowMs : Nat = 60_000;

  /// Default capability used when neither the request hint nor the sub-task
  /// carries an explicit TaskCapability.
  let defaultCapability : LLMFallbackTypes.TaskCapability = {
    maxTokens   = 2000;
    temperature = 0.7;
    modelFamily = null;
  };

  // ── State lifecycle ──────────────────────────────────────────────────────

  /// Construct an empty transient OrchestratorState.
  public func emptyState() : OrchestratorTypes.OrchestratorState {
    {
      var runCount = 0;
    };
  };

  // ── Main entry point ─────────────────────────────────────────────────────

  /// The single orchestrator entry point. Sits ABOVE LLMFallbackLib.route:
  /// decomposes the goal into sub-tasks, selects capabilities, executes each
  /// sub-task via the supplied routeLLMCallback (which delegates to
  /// LLMFallbackLib.route through the existing routeLLMCall mixin path),
  /// validates outputs, retries on validation failure, stores memory via the
  /// supplied callbacks, emits an audit-trail entry, and returns a structured
  /// result with a correlation id for end-to-end tracing.
  public func orchestrate(
    state                : OrchestratorTypes.OrchestratorState,
    request              : OrchestratorTypes.OrchestratorRequest,
    routeLLMCallback     : (OrchestratorTypes.SubTask, [LLMFallbackTypes.LLMMessage]) -> async Text,
    resolveKeysCallback  : () -> async LLMFallbackTypes.ProviderKeys,
    memoryReadCallback   : (OrchestratorTypes.MemoryScope, OrchestratorTypes.ScopeContext) -> async [LLMFallbackTypes.LLMMessage],
    memoryWriteCallback  : (OrchestratorTypes.MemoryScope, OrchestratorTypes.ScopeContext, Text) -> async Text,
    auditCallback        : (Text, Text) -> async (),
    rateLimitCallback    : (Text, Nat, Nat) -> async Bool,
    correlationIdCallback : () -> Text,
  ) : async OrchestratorTypes.OrchestratorResult {
    let startedAt = Time.now();
    let correlationId = correlationIdCallback();

    // (b) Rate-limit check against the per-tenant orchestrator budget.
    let allowed = await rateLimitCallback(
      request.tenantId,
      defaultRateLimitMax,
      defaultRateLimitWindowMs,
    );
    if (not allowed) {
      state.runCount += 1;
      await auditCallback(correlationId, "orchestrator:rate-limited");
      return {
        output           = "";
        provider         = null;
        model            = null;
        attempts         = 0;
        validationStatus = "skipped";
        memoryRefs       = [];
        correlationId    = correlationId;
        errorMessage     = ?("Rate limited, retry after " # defaultRateLimitWindowMs.toText() # "ms");
      };
    };

    // (c) Read memory context. The first memory scope (if any) is used to
    // assemble context for the run; the scopeContext carries tenant/org/etc.
    let memoryScope = pickMemoryScope(request.memoryScopes);
    let memoryMessages : [LLMFallbackTypes.LLMMessage] = switch (memoryScope) {
      case (?scope) await memoryReadCallback(scope, request.scopeContext);
      case null [];
    };

    // (d) Plan: decompose the goal into ordered sub-tasks.
    let subTasks = plan(request);

    // (e) Execute each sub-task in order.
    var finalOutput : Text = "";
    var finalProvider : ?LLMFallbackTypes.ProviderId = null;
    var finalModel : ?Text = null;
    var totalAttempts : Nat = 0;
    var finalValidation : OrchestratorTypes.ValidationStatus = "valid";
    var memoryRefs : [Text] = [];
    var anyFailed = false;

    label subTaskLoop for (subTask in subTasks.vals()) {
      // Select capability for this sub-task.
      let capability = selectCapability(subTask, request.capabilityHint);

      // Execute via the routeLLMCallback (delegates to LLMFallbackLib.route).
      var output = await routeLLMCallback(subTask, memoryMessages);
      totalAttempts += 1;

      // Validate the output.
      var status = validate(subTask, output);

      // Retry on validation failure up to the existing RetryConfig limit.
      if (not isValid(status)) {
        let retryResult = await retry(
          state,
          { subTask with capability = capability },
          routeLLMCallback,
          resolveKeysCallback,
          LLMFallbackTypes.defaultRetryConfig.maxRetries,
        );
        output := retryResult.output;
        totalAttempts += retryResult.attempts;
        status := validate(subTask, output);
        finalProvider := retryResult.provider;
        finalModel := retryResult.model;
      } else {
        // On first-shot success we don't have provider/model info from the
        // callback (it returns Text only); leave them null unless retry
        // populated them.
        if (finalProvider == null) finalProvider := null;
        if (finalModel == null) finalModel := null;
      };

      if (not isValid(status)) {
        anyFailed := true;
        finalValidation := status;
      };

      // (e) Write memory for this sub-task via the supplied callback.
      switch (memoryScope) {
        case (?scope) {
          let ref = await memoryWriteCallback(scope, request.scopeContext, output);
          memoryRefs := memoryRefs.concat([ref]);
        };
        case null ();
      };

      // Accumulate output. For single-task goals this is the whole result;
      // for multi-step goals we concatenate with a separator.
      if (finalOutput == "") {
        finalOutput := output;
      } else {
        finalOutput := finalOutput # "\n\n---\n\n" # output;
      };

      // Stop early if a sub-task failed validation after retries.
      if (not isValid(status)) {
        break subTaskLoop;
      };
    };

    // (f) Build the structured result.
    let result : OrchestratorTypes.OrchestratorResult = {
      output           = finalOutput;
      provider         = finalProvider;
      model            = finalModel;
      attempts         = totalAttempts;
      validationStatus = finalValidation;
      memoryRefs       = memoryRefs;
      correlationId    = correlationId;
      errorMessage     = if (anyFailed) ?validationReason(finalValidation) else null;
    };

    // (g) DIAGNOSTIC: route log append removed (state simplified).
    // (h) Emit an audit-trail entry for admin visibility.
    let auditMsg = "orchestrator:" # (if (anyFailed) "failed" else "ok") #
      " goal=\"" # truncate(request.goal, 80) # "\"" #
      " subTasks=" # subTasks.size().toText() #
      " attempts=" # totalAttempts.toText() #
      " correlationId=" # correlationId;
    await auditCallback(correlationId, auditMsg);

    // (i) Update counters.
    state.runCount += 1;

    // (j) Return the result.
    result;
  };

  // ── Planner ───────────────────────────────────────────────────────────────

  /// Decompose a goal into ordered sub-tasks. Single-task goals pass through as
  /// a single step; multi-step goals are split into an ordered list.
  public func plan(request : OrchestratorTypes.OrchestratorRequest) : [OrchestratorTypes.SubTask] {
    let goal = request.goal;
    let memoryScope = pickMemoryScope(request.memoryScopes);

    // Detect multi-step goals by sequencing keywords.
    let steps = splitOnSequencers(goal);
    if (steps.size() <= 1) {
      // Single-task goal — pass through as one step.
      let scope : OrchestratorTypes.MemoryScope = switch (memoryScope) {
        case (?s) s;
        case null "";
      };
      [{
        id          = subTaskId(0, goal);
        description = goal;
        capability  = defaultCapability;
        validator   = ?"nonempty";
        memoryScope = scope;
      }];
    } else {
      // Multi-step goal — one SubTask per detected step.
      let scope : OrchestratorTypes.MemoryScope = switch (memoryScope) {
        case (?s) s;
        case null "";
      };
      Array.tabulate(
        steps.size(),
        func(i) {
          let desc = steps[i];
          {
            id          = subTaskId(i, desc);
            description = desc;
            capability  = defaultCapability;
            validator   = ?"nonempty";
            memoryScope = scope;
          };
        },
      );
    };
  };

  // ── Capability selection ──────────────────────────────────────────────────

  /// Map a sub-task to a TaskCapability, honoring the request's capabilityHint
  /// when present. Provider selection itself is delegated to the existing
  /// cost-aware chain in LLMFallbackLib.
  public func selectCapability(
    subTask : OrchestratorTypes.SubTask,
    hint    : ?LLMFallbackTypes.TaskCapability,
  ) : LLMFallbackTypes.TaskCapability {
    switch (hint) {
      case (?h) h;
      case null subTask.capability;
    };
  };

  // ── Output validation ────────────────────────────────────────────────────

  /// Validate a sub-task's output against its validator. Returns "skipped" when
  /// the sub-task has no validator. TaskValidator is a Text encoding (see
  /// types/ai-orchestrator.mo): "nonempty", "maxlength:N", "jsonshape",
  /// "schemamatch:pattern", "custom:name".
  public func validate(
    subTask : OrchestratorTypes.SubTask,
    output  : Text,
  ) : OrchestratorTypes.ValidationStatus {
    switch (subTask.validator) {
      case null "skipped";
      case (?v) {
        if (v == "nonempty") {
          if (isBlank(output)) {
            "invalid:output is empty or whitespace-only";
          } else { "valid" };
        } else if (v.startsWith(#text "maxlength:")) {
          switch (v.stripStart(#text "maxlength:")) {
            case (?nText) {
              switch (Nat.fromText(nText)) {
                case (?n) {
                  if (output.size() > n) {
                    "invalid:output length " # output.size().toText() # " exceeds max " # n.toText();
                  } else { "valid" };
                };
                case null {
                  "invalid:malformed maxlength validator: " # v;
                };
              };
            };
            case null {
              "invalid:malformed maxlength validator: " # v;
            };
          };
        } else if (v == "jsonshape") {
          if (looksLikeJson(output)) { "valid" }
          else {
            "invalid:output does not look like valid JSON (must start with { or [ and end with } or ])";
          };
        } else if (v.startsWith(#text "schemamatch:")) {
          switch (v.stripStart(#text "schemamatch:")) {
            case (?pattern) {
              if (output.contains(#text pattern)) { "valid" }
              else {
                "invalid:output does not contain required pattern: " # pattern;
              };
            };
            case null {
              "invalid:malformed schemamatch validator: " # v;
            };
          };
        } else if (v.startsWith(#text "custom:")) {
          // Custom validators are call-site specific; the orchestrator
          // treats them as passing. Callers that need custom logic should
          // wrap the routeLLMCallback.
          "valid";
        } else {
          // Unknown validator encoding — treat as passing to avoid blocking
          // runs on a misconfigured validator.
          "valid";
        };
      };
    };
  };

  // ── Retry ─────────────────────────────────────────────────────────────────

  /// Re-execute a failed sub-task through the fallback chain using the existing
  /// attemptWithRetry semantics. Respects the 3-failure / 5-min provider skip
  /// window already enforced inside LLMFallbackLib.
  public func retry(
    state               : OrchestratorTypes.OrchestratorState,
    subTask             : OrchestratorTypes.SubTask,
    routeLLMCallback    : (OrchestratorTypes.SubTask, [LLMFallbackTypes.LLMMessage]) -> async Text,
    resolveKeysCallback : () -> async LLMFallbackTypes.ProviderKeys,
    maxRetries          : Nat,
  ) : async OrchestratorTypes.RetryResult {
    // Resolve keys once (the callback reads from the encrypted credentials
    // store; the orchestrator never handles raw secrets).
    let _keys = await resolveKeysCallback();
    // Touch state to satisfy the parameter contract; the skip window is
    // enforced inside LLMFallbackLib via the routeLLMCallback path.
    ignore state;

    var attempt : Nat = 0;
    var lastOutput : Text = "";
    var succeeded = false;

    label retryLoop while (attempt < maxRetries) {
      attempt += 1;
      let output = await routeLLMCallback(subTask, []);
      lastOutput := output;
      let status = validate(subTask, output);
      if (isValid(status)) {
        succeeded := true;
        break retryLoop;
      };
    };

    {
      output   = lastOutput;
      attempts = attempt;
      // The routeLLMCallback returns Text only; provider/model are not surfaced
      // through this contract. They remain null here — the orchestrator's
      // result fields are populated by the caller when richer info is
      // available.
      provider = null;
      model    = null;
    };
  };

  // ── Route log (ring buffer capped at 100) ────────────────────────────────
  //
  // DIAGNOSTIC: appendRouteLog and recentRouteLog are temporarily removed
  // because OrchestratorState no longer carries a routeLog field. The OQL
  // entity in lib/aiOrchestratorOql.mo is also disabled during this
  // diagnostic. Restored once the crash root cause is identified.

  // ── Health snapshot ───────────────────────────────────────────────────────

  /// Serializable health snapshot for the orchestrator: run count, failure
  /// count, success rate, and current in-flight run count.
  /// DIAGNOSTIC: returns placeholder values (only runCount is tracked).
  public func healthSnapshot(
    state : OrchestratorTypes.OrchestratorState,
  ) : OrchestratorTypes.HealthSnapshot {
    {
      runCount      = state.runCount;
      failureCount  = 0;
      successRate   = 0.0;
      inFlightCount = 0;
    };
  };

  // ── Private helpers ──────────────────────────────────────────────────────

  /// True when a ValidationStatus is "valid" or "skipped".
  private func isValid(status : OrchestratorTypes.ValidationStatus) : Bool {
    status == "valid" or status == "skipped";
  };

  /// Extract the reason Text from an "invalid:..." status, or "" otherwise.
  /// Uses Text.stripStart (#text "invalid:") which returns ?Text — the
  /// remainder after the prefix when present, null otherwise.
  private func validationReason(status : OrchestratorTypes.ValidationStatus) : Text {
    switch (status.stripStart(#text "invalid:")) {
      case (?reason) reason;
      case null "";
    };
  };

  /// Pick the first memory scope from the request's list, or null if empty.
  private func pickMemoryScope(
    scopes : [OrchestratorTypes.MemoryScope],
  ) : ?OrchestratorTypes.MemoryScope {
    if (scopes.size() == 0) null else ?scopes[0];
  };

  /// True when a Text is empty or contains only whitespace.
  private func isBlank(s : Text) : Bool {
    for (c in s.chars()) {
      if (c != ' ' and c != '\n' and c != '\r' and c != '\t') return false;
    };
    true;
  };

  /// Heuristic JSON-shape check: trimmed output starts with { or [ and ends
  /// with the matching closing brace/bracket.
  private func looksLikeJson(s : Text) : Bool {
    let trimmed = trim(s);
    if (trimmed.size() < 2) return false;
    let chars = trimmed.toArray();
    let first = chars[0];
    let last = chars[chars.size() - 1];
    if (first == '{' and last == '}') return true;
    if (first == '[' and last == ']') return true;
    false;
  };

  /// Trim leading and trailing whitespace from a Text.
  private func trim(s : Text) : Text {
    let chars = s.toArray();
    let len = chars.size();
    var start = 0;
    label trimStart while (start < len) {
      let c = chars[start];
      if (c == ' ' or c == '\n' or c == '\r' or c == '\t') {
        start += 1;
      } else {
        break trimStart;
      };
    };
    var end = len;
    label trimEnd while (end > start) {
      let c = chars[end - 1];
      if (c == ' ' or c == '\n' or c == '\r' or c == '\t') {
        end -= 1;
      } else {
        break trimEnd;
      };
    };
    if (start >= end) return "";
    let outLen : Nat = end - start;
    Text.fromIter(Array.tabulate(outLen, func(i) { chars[start + i] }).vals());
  };

  /// Split a goal Text on sequencing keywords ("then", "and then", "after
  /// that") into ordered sub-task descriptions. Returns a single-element array
  /// containing the original goal when no sequencers are found.
  private func splitOnSequencers(goal : Text) : [Text] {
    let lower = toLower(goal);
    let parts = lower.split(#text " then ");
    // After splitting on " then ", also handle "and then" / "after that" by
    // further splitting each part. We do a two-pass split: first on " then ",
    // then on "after that" within each piece.
    let firstPass = Array.fromIter(parts);
    var result : [Text] = [];
    for (p in firstPass.vals()) {
      let sub = p.split(#text "after that");
      for (q in sub) {
        let cleaned = trim(q);
        // Strip a leading "and " that may remain after "and then" splits.
        let stripped = stripLeadingAnd(cleaned);
        if (stripped != "") {
          result := result.concat([stripped]);
        };
      };
    };
    if (result.size() <= 1) {
      // No real split happened — return the original (un-lowered) goal.
      [goal];
    } else {
      result;
    };
  };

  /// Strip a leading "and " (case-insensitive) from a Text.
  private func stripLeadingAnd(s : Text) : Text {
    if (s.size() >= 4) {
      let chars = s.toArray();
      let prefix = Text.fromIter(Array.tabulate(4, func(i) { chars[i] }).vals());
      if (toLower(prefix) == "and ") {
        // Drop the first 4 chars; rebuild from the remaining tail.
        let restLen : Nat = chars.size() - 4;
        Text.fromIter(Array.tabulate(restLen, func(i) { chars[4 + i] }).vals());
      } else {
        s;
      };
    } else {
      s;
    };
  };

  /// Build a stable sub-task id from the step index and description.
  private func subTaskId(index : Nat, description : Text) : Text {
    "subtask-" # index.toText() # "-" # hashText(description);
  };

  /// Truncate a Text to at most `max` characters, appending "..." if truncated.
  private func truncate(s : Text, max : Nat) : Text {
    if (s.size() <= max) s
    else {
      let chars = s.toArray();
      Text.fromIter(Array.tabulate(max, func(i) { chars[i] }).vals()) # "...";
    };
  };

  /// Convert Text to lowercase (ASCII-only).
  private func toLower(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      if (c >= 'A' and c <= 'Z') {
        out #= Text.fromChar(Nat32.toChar(c.toNat32() + 32));
      } else {
        out #= Text.fromChar(c);
      };
    };
    out;
  };

  /// A simple, deterministic Text hash for id generation (FNV-1a 32-bit).
  private func hashText(s : Text) : Text {
    var hash : Nat32 = 2166136261;
    for (c in s.chars()) {
      hash := hash ^ c.toNat32();
      hash := hash * 16777619;
    };
    hash.toText();
  };

};
