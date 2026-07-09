import OQL "mo:caffeineai-oql";

import T "../types/ai-orchestrator";

/// Builds the OQL entity list for the AI orchestrator's in-memory
/// observability data.
///
/// DIAGNOSTIC: the `ai_orchestrator_runs` entity is temporarily disabled
/// because `OrchestratorState` was simplified to `{ var runCount : Nat }`
/// (no `routeLog` field) to isolate the moc 1.10.1 stable-signature crash.
/// `entities()` returns an empty array until the crash root cause is
/// identified and the route log is restored.
module {

  /// Build the OQL entity list for the orchestrator. DIAGNOSTIC: returns
  /// an empty array (no entities) while `OrchestratorState.routeLog` is
  /// temporarily removed.
  public func entities(
    orchestratorState : T.OrchestratorState,
  ) : [OQL.Decl] {
    ignore orchestratorState;
    [];
  };

};
