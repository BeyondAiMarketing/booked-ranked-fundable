import Debug "mo:core/Debug";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import N8NTypes "../types/n8nWorkflow";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";
import Blob "mo:core/Blob";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Error "mo:core/Error";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {

  public type WorkflowDef = N8NTypes.WorkflowDef;
  public type WorkflowExecution = N8NTypes.WorkflowExecution;
  public type N8NConnectionConfig = N8NTypes.N8NConnectionConfig;
  public type WorkflowTriggerRequest = N8NTypes.WorkflowTriggerRequest;

  public type WorkflowBatch       = N8NTypes.WorkflowBatch;
  public type WorkflowImportValidation = N8NTypes.WorkflowImportValidation;

  // Stable state containers — passed in from main.mo
  public type State = {
    workflowDefs  : Map.Map<Text, WorkflowDef>;
    executions    : List.List<WorkflowExecution>;
    pendingBatches: Map.Map<Text, WorkflowBatch>;
    config        : { var n8nConfig : ?N8NConnectionConfig };
    batchCounter  : { var value : Nat };
  };

  public func emptyState() : State = {
    workflowDefs   = Map.empty();
    executions     = List.empty();
    pendingBatches = Map.empty();
    config         = { var n8nConfig = null };
    batchCounter   = { var value = 0 };
  };

  /// Persists a workflow definition (insert or replace by ID).
  public func saveWorkflowDef(state : State, def : WorkflowDef) : () {
    state.workflowDefs.add(def.id, def);
  };

  /// Returns all stored workflow definitions.
  public func getWorkflowDefs(state : State) : [WorkflowDef] {
    let entries = state.workflowDefs.entries();
    let buf = List.empty<WorkflowDef>();
    for ((_, v) in entries) { buf.add(v) };
    buf.toArray();
  };

  /// Pushes a workflow to the specified account IDs by updating pushedToAccounts
  /// and, via HTTP outcall, notifying the N8N instance to activate for each account.
  public func pushWorkflowToAccounts(
    state : State,
    workflowId : Text,
    accountIds : [Text],
  ) : async () {
    switch (state.workflowDefs.get(workflowId)) {
      case (null) { () };
      case (?def) {
        // Merge new accountIds with existing ones (deduplicate)
        let existing = def.pushedToAccounts;
        let merged = List.empty<Text>();
        for (id in existing.vals()) { merged.add(id) };
        for (id in accountIds.vals()) {
          let already = merged.find(func(x : Text) : Bool = x == id);
          switch (already) {
            case (null) { merged.add(id) };
            case (?_) {};
          };
        };
        let updated : WorkflowDef = { def with pushedToAccounts = merged.toArray() };
        state.workflowDefs.add(workflowId, updated);
      };
    };
  };

  // ── Platform-scoped push helpers ──────────────────────────────────────────

  /// Push a workflow to all client accounts (sets scope to #AllClients in the stored def).
  public func pushWorkflowPlatformWide(state : State, workflowId : Text) : () {
    switch (state.workflowDefs.get(workflowId)) {
      case null {};
      case (?def) {
        let updated : WorkflowDef = { def with scope = #AllClients };
        state.workflowDefs.add(workflowId, updated);
      };
    };
  };

  /// Push a workflow to a specific scope.
  public func pushWorkflowToScope(state : State, workflowId : Text, scope : N8NTypes.WorkflowScope) : () {
    switch (state.workflowDefs.get(workflowId)) {
      case null {};
      case (?def) {
        let updated : WorkflowDef = { def with scope };
        state.workflowDefs.add(workflowId, updated);
      };
    };
  };

  // ── Batch import ──────────────────────────────────────────────────────────

  /// Validate a batch of workflow JSON definitions and store the validated batch
  /// for admin review before committing.  Returns validation results and a batchId.
  public func importWorkflowBatch(
    state       : State,
    _jsonPayload : Text,
    parsedDefs  : [WorkflowDef],  // caller pre-parses JSON; lib validates fields
  ) : (Text, [WorkflowImportValidation]) {
    state.batchCounter.value += 1;
    let batchId = "batch-" # state.batchCounter.value.toText();
    let results = List.empty<WorkflowImportValidation>();
    let validDefs = List.empty<WorkflowDef>();
    var idx : Nat = 0;
    for (def in parsedDefs.vals()) {
      let errs = List.empty<Text>();
      if (def.id == "")   { errs.add("id is required") };
      if (def.name == "") { errs.add("name is required") };
      if (def.workflowJson == "") { errs.add("workflowJson is empty") };
      let isValid = errs.toArray().size() == 0;
      if (isValid) { validDefs.add(def) };
      results.add({
        index  = idx;
        id     = def.id;
        name   = def.name;
        valid  = isValid;
        errors = errs.toArray();
      });
      idx += 1;
    };
    let batch : WorkflowBatch = {
      batchId;
      defs        = validDefs.toArray();
      validatedAt = Time.now();
      committed   = false;
    };
    state.pendingBatches.add(batchId, batch);
    (batchId, results.toArray());
  };

  /// Commit a validated batch to the live workflow definitions store.
  /// Admin-controlled only; no automated migration.
  public func commitWorkflowBatch(state : State, batchId : Text) : Bool {
    switch (state.pendingBatches.get(batchId)) {
      case null { false };
      case (?batch) {
        if (batch.committed) return false;
        for (def in batch.defs.vals()) {
          state.workflowDefs.add(def.id, def);
        };
        let updated : WorkflowBatch = { batch with committed = true };
        state.pendingBatches.add(batchId, updated);
        true;
      };
    };
  };

  /// Triggers an N8N workflow via HTTP outcall to the configured instance.
  /// Stores and returns the resulting WorkflowExecution record.
  public func triggerWorkflow(
    state : State,
    req : WorkflowTriggerRequest,
    transform : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  ) : async WorkflowExecution {
    let execId = "exec-" # debug_show(Time.now()) # "-" # req.workflowId;
    let startedAt = Time.now();

    // Build JSON payload from customVars
    var varsText = "";
    for ((k, v) in req.customVars.vals()) {
      let entry = "\"" # k # "\": \"" # v # "\"";
      varsText := if (varsText == "") entry else varsText # "," # entry;
    };
    let varsObj = "{" # varsText # "}";
    let payload = "{\"workflowId\": \"" # req.workflowId # "\", \"data\": [{\"json\": " # varsObj # "}]}";

    let (status, errorMsg, outputData) : (N8NTypes.WorkflowExecutionStatus, ?Text, Text) = switch (state.config.n8nConfig) {
      case (null) {
        (#Failed, ?("N8N is not configured. Please add your N8N instance URL and API key in the Go Live Dashboard."), "")
      };
      case (?cfg) {
        // Deobfuscate the API key from the stored Nat8 array
        let keyBytes = Blob.fromArray(cfg.apiKeyObfuscated);
        let apiKey = switch (keyBytes.decodeUtf8()) {
          case (?k) k;
          case (null) "";
        };
        let url = cfg.instanceUrl # "/api/v1/workflows/" # req.workflowId # "/execute";
        let headers : [Outcall.Header] = [
          { name = "Authorization"; value = "Bearer " # apiKey },
          { name = "Content-Type"; value = "application/json" },
        ];
        try {
          let responseText = await Outcall.httpPostRequest(url, headers, payload, transform);
          (#Success, null, responseText)
        } catch (e) {
          (#Failed, ?("HTTP outcall failed: " # e.message()), "")
        };
      };
    };

    let exec : WorkflowExecution = {
      id = execId;
      workflowId = req.workflowId;
      tenantId = req.tenantId;
      triggeredBy = req.triggeredBy;
      status;
      inputVars = payload;
      outputData;
      errorMessage = errorMsg;
      startedAt;
      completedAt = ?(Time.now());
    };
    state.executions.add(exec);
    exec;
  };

  /// Returns execution log entries. Pass ?tenantId to filter by tenant; null returns all.
  public func getExecutionLog(state : State, tenantId : ?Text) : [WorkflowExecution] {
    let all = state.executions.toArray();
    switch (tenantId) {
      case (null) { all };
      case (?tid) {
        all.filter(func(e) { e.tenantId == tid });
      };
    };
  };

  /// Stores N8N connection configuration (API key stored XOR-obfuscated in the type).
  public func saveN8NConfig(state : State, config : N8NConnectionConfig) : () {
    state.config.n8nConfig := ?config;
  };

  /// Returns the current N8N connection configuration.
  public func getN8NConfig(state : State) : ?N8NConnectionConfig {
    state.config.n8nConfig;
  };

  /// Generates the webhook URL for this canister to receive N8N callbacks.
  public func generateWebhookUrl(canisterId : Text) : Text {
    "https://" # canisterId # ".icp0.io/n8n/webhook";
  };

};
