import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int  "mo:core/Int";
import Nat  "mo:core/Nat";
import T    "../types/scheduledWorkflow";

module {

  public type State = {
    workflows : Map.Map<Text, T.ScheduledWorkflow>;
  };

  public func emptyState() : State = {
    workflows = Map.empty();
  };

  /// Validate frequency string.
  public func isValidFrequency(freq : Text) : Bool {
    let f = freq.toLower();
    for (v in T.validFrequencies.values()) {
      if (f == v) { return true };
    };
    false;
  };

  /// Calculate next run timestamp based on frequency and current time.
  public func calculateNextRun(frequency : Text, fromTime : Int) : Int {
    let f = frequency.toLower();
    let oneDay : Int = 86_400_000_000_000; // nanoseconds
    if (f == "daily") {
      fromTime + oneDay;
    } else if (f == "weekly") {
      fromTime + (oneDay * 7);
    } else if (f == "bi_weekly") {
      fromTime + (oneDay * 14);
    } else if (f == "monthly") {
      // Approximate 30 days
      fromTime + (oneDay * 30);
    } else if (f == "quarterly") {
      // Approximate 90 days
      fromTime + (oneDay * 90);
    } else {
      // on_demand or unknown — no next scheduled run
      fromTime;
    };
  };

  /// Create a new scheduled workflow.
  public func create(state : State, input : T.CreateInput, id : Text) : T.ScheduledWorkflow {
    let now = Time.now();
    let workflow : T.ScheduledWorkflow = {
      id                = id;
      clientBusinessId  = input.clientBusinessId;
      verticalProfileId = input.verticalProfileId;
      taskType          = input.taskType;
      frequency         = input.frequency;
      tier              = input.tier;
      lastRun           = null;
      nextRun           = ?calculateNextRun(input.frequency, now);
      isActive          = true;
      n8nWebhookId      = input.n8nWebhookId;
      config            = input.config;
      status            = #active;
      createdAt         = now;
    };
    state.workflows.add(id, workflow);
    workflow;
  };

  /// Retrieve a workflow by id.
  public func getById(state : State, id : Text) : ?T.ScheduledWorkflow {
    state.workflows.get(id);
  };

  /// Get all workflows for a client business.
  public func getByClient(state : State, clientBusinessId : Text) : [T.ScheduledWorkflow] {
    let result = List.empty<T.ScheduledWorkflow>();
    for (w in state.workflows.values()) {
      if (w.clientBusinessId == clientBusinessId) { result.add(w) };
    };
    result.toArray();
  };

  /// Get all workflows for a vertical profile.
  public func getByVertical(state : State, verticalProfileId : Text) : [T.ScheduledWorkflow] {
    let result = List.empty<T.ScheduledWorkflow>();
    for (w in state.workflows.values()) {
      if (w.verticalProfileId == verticalProfileId) { result.add(w) };
    };
    result.toArray();
  };

  /// Get all active workflows.
  public func getActive(state : State) : [T.ScheduledWorkflow] {
    let result = List.empty<T.ScheduledWorkflow>();
    for (w in state.workflows.values()) {
      if (w.isActive) { result.add(w) };
    };
    result.toArray();
  };

  /// Get workflows that are due to run (nextRun <= now and active).
  public func getDueWorkflows(state : State) : [T.ScheduledWorkflow] {
    let now = Time.now();
    let result = List.empty<T.ScheduledWorkflow>();
    for (w in state.workflows.values()) {
      if (w.isActive) {
        switch (w.nextRun) {
          case (?next) {
            if (next <= now) { result.add(w) };
          };
          case null {};
        };
      };
    };
    result.toArray();
  };

  /// Update an existing workflow.
  public func update(state : State, input : T.UpdateInput) : ?T.ScheduledWorkflow {
    switch (state.workflows.get(input.id)) {
      case (?existing) {
        let updated : T.ScheduledWorkflow = {
          existing with
          frequency = switch (input.frequency) { case (?f) f; case null existing.frequency };
          tier = switch (input.tier) { case (?t) t; case null existing.tier };
          n8nWebhookId = switch (input.n8nWebhookId) { case (?n) n; case null existing.n8nWebhookId };
          config = switch (input.config) { case (?c) c; case null existing.config };
          status = switch (input.status) { case (?s) s; case null existing.status };
        };
        state.workflows.add(input.id, updated);
        ?updated;
      };
      case null null;
    };
  };

  /// Toggle workflow active/inactive.
  public func toggle(state : State, id : Text) : ?T.ScheduledWorkflow {
    switch (state.workflows.get(id)) {
      case (?existing) {
        let updated : T.ScheduledWorkflow = {
          existing with
          isActive = not existing.isActive;
          status = if (not existing.isActive) #active else #paused;
        };
        state.workflows.add(id, updated);
        ?updated;
      };
      case null null;
    };
  };

  /// Mark a workflow as run and recalculate nextRun.
  public func markRun(state : State, id : Text) : ?T.ScheduledWorkflow {
    switch (state.workflows.get(id)) {
      case (?existing) {
        let now = Time.now();
        let updated : T.ScheduledWorkflow = {
          existing with
          lastRun = ?now;
          nextRun = ?calculateNextRun(existing.frequency, now);
        };
        state.workflows.add(id, updated);
        ?updated;
      };
      case null null;
    };
  };

  /// Delete a workflow.
  public func delete(state : State, id : Text) : Bool {
    switch (state.workflows.get(id)) {
      case (?_) { state.workflows.remove(id); true };
      case null false;
    };
  };

  /// Get all workflows (for admin/debug).
  public func getAll(state : State) : [T.ScheduledWorkflow] {
    let result = List.empty<T.ScheduledWorkflow>();
    for (w in state.workflows.values()) { result.add(w) };
    result.toArray();
  };

}
