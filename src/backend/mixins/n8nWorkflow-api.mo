import Time "mo:core/Time";
import List "mo:core/List";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import N8NWorkflowLib "../src/libraries/n8nWorkflow";
import N8NTypes "../src/types/n8nWorkflow";

mixin (n8nState : N8NWorkflowLib.State) {

  // ── helpers ────────────────────────────────────────────────────────────────

  private func scopeToText(s : N8NTypes.WorkflowScope) : Text {
    switch s {
      case (#AdminOnly)         "AdminOnly";
      case (#AllClients)        "AllClients";
      case (#BasicTier)         "BasicTier";
      case (#ProTier)           "ProTier";
      case (#AgencyTier)        "AgencyTier";
      case (#PlatformWide)      "PlatformWide";
      case (#SpecificAgency(a)) "SpecificAgency:" # a;
    };
  };

  private func textToScope(s : Text) : N8NTypes.WorkflowScope {
    if      (s == "AllClients")      #AllClients
    else if (s == "BasicTier")       #BasicTier
    else if (s == "ProTier")         #ProTier
    else if (s == "AgencyTier")      #AgencyTier
    else if (s == "PlatformWide")    #PlatformWide
    else if (s.startsWith(#text "SpecificAgency:")) {
      let agency = s.trimStart(#text "SpecificAgency:");
      #SpecificAgency(agency);
    }
    else #AdminOnly;
  };

  private func statusToText(s : N8NTypes.WorkflowExecutionStatus) : Text {
    switch s {
      case (#Running) "Running";
      case (#Success) "Success";
      case (#Failed) "Failed";
      case (#Timeout) "Timeout";
    };
  };

  // XOR obfuscation
  private func xorObfuscate(bytes : [Nat8]) : [Nat8] {
    let key : [Nat8] = [0x42, 0x52, 0x46, 0x4B, 0x45, 0x59, 0x21, 0x40];
    let keyLen = key.size();
    if (keyLen == 0) return bytes;
    var i = 0;
    let result = List.empty<Nat8>();
    for (b in bytes.vals()) {
      result.add(b ^ key[i % keyLen]);
      i += 1;
    };
    result.toArray();
  };

  private func decodeXorKey(obfuscated : [Nat8]) : Text {
    let decoded = xorObfuscate(obfuscated);
    switch (Blob.fromArray(decoded).decodeUtf8()) {
      case (?t) t;
      case null "";
    };
  };

  // ── transform for HTTP outcalls ────────────────────────────────────────────

  public query func n8nTransform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    { status = input.response.status; body = input.response.body; headers = [] };
  };

  // ── workflow definitions ───────────────────────────────────────────────────

  /// Save or update a workflow definition
  public func saveWorkflowDef(
    id : Text,
    name : Text,
    description : Text,
    tags : [Text],
    scope : Text,
    workflowJson : Text,
  ) : async () {
    let scopeVariant : N8NTypes.WorkflowScope = switch scope {
      case "AllClients" #AllClients;
      case "BasicTier" #BasicTier;
      case "ProTier" #ProTier;
      case "AgencyTier" #AgencyTier;
      case _ #AdminOnly;
    };
    let def : N8NTypes.WorkflowDef = {
      id;
      name;
      description;
      tags;
      scope = scopeVariant;
      workflowJson;
      isActive = true;
      createdAt = Time.now();
      createdBy = "admin";
      pushedToAccounts = [];
    };
    N8NWorkflowLib.saveWorkflowDef(n8nState, def);
  };

  /// Returns all stored workflow definitions
  public query func getWorkflowDefs() : async [{
    id : Text;
    name : Text;
    description : Text;
    tags : [Text];
    scope : Text;
    isActive : Bool;
    createdAt : Int;
    pushedToAccounts : [Text];
  }] {
    let defs = N8NWorkflowLib.getWorkflowDefs(n8nState);
    defs.map<N8NTypes.WorkflowDef, { id : Text; name : Text; description : Text; tags : [Text]; scope : Text; isActive : Bool; createdAt : Int; pushedToAccounts : [Text] }>(
      func(d) {
        {
          id = d.id;
          name = d.name;
          description = d.description;
          tags = d.tags;
          scope = scopeToText(d.scope);
          isActive = d.isActive;
          createdAt = d.createdAt;
          pushedToAccounts = d.pushedToAccounts;
        };
      },
    );
  };

  /// Delete a workflow definition by ID
  public func deleteWorkflowDef(workflowId : Text) : async Bool {
    switch (n8nState.workflowDefs.get(workflowId)) {
      case (null) false;
      case (?_) {
        n8nState.workflowDefs.remove(workflowId);
        true;
      };
    };
  };

  /// Push a workflow to specified account IDs
  public func pushWorkflowToAccounts(workflowId : Text, accountIds : [Text]) : async () {
    await N8NWorkflowLib.pushWorkflowToAccounts(n8nState, workflowId, accountIds);
  };

  // ── platform-scoped push ──────────────────────────────────────────────────

  /// Push a workflow platform-wide (all client accounts).
  public func pushWorkflowPlatformWide(workflowId : Text) : async () {
    N8NWorkflowLib.pushWorkflowPlatformWide(n8nState, workflowId);
  };

  /// Push a workflow to a specific scope.
  public func pushWorkflowToScope(workflowId : Text, scopeText : Text) : async () {
    let scope = textToScope(scopeText);
    N8NWorkflowLib.pushWorkflowToScope(n8nState, workflowId, scope);
  };

  // ── batch import ──────────────────────────────────────────────────────────

  /// Validate a batch of workflow definitions (admin-controlled dry run).
  /// Pass workflow definitions as JSON; returns batchId and per-item validation results.
  public func importWorkflowBatch(
    defsJson : [{ id : Text; name : Text; description : Text; tags : [Text];
                  scope : Text; workflowJson : Text }],
  ) : async {
    batchId  : Text;
    results  : [{ index : Nat; id : Text; name : Text; valid : Bool; errors : [Text] }];
  } {
    let now = Time.now();
    let parsed = defsJson.map<
      { id : Text; name : Text; description : Text; tags : [Text]; scope : Text; workflowJson : Text },
      N8NWorkflowLib.WorkflowDef
    >(func(d) {
      {
        id           = d.id;
        name         = d.name;
        description  = d.description;
        tags         = d.tags;
        scope        = textToScope(d.scope);
        workflowJson = d.workflowJson;
        isActive     = false;
        createdAt    = now;
        createdBy    = "batch-import";
        pushedToAccounts = [];
      };
    });
    let (batchId, validations) = N8NWorkflowLib.importWorkflowBatch(n8nState, "", parsed);
    {
      batchId;
      results = validations.map<
        N8NWorkflowLib.WorkflowImportValidation,
        { index : Nat; id : Text; name : Text; valid : Bool; errors : [Text] }
      >(func(v) { { index = v.index; id = v.id; name = v.name; valid = v.valid; errors = v.errors } });
    };
  };

  /// Commit a validated batch to the live workflow store. Admin-controlled only.
  public func commitWorkflowBatch(batchId : Text) : async Bool {
    N8NWorkflowLib.commitWorkflowBatch(n8nState, batchId);
  };

  // ── execution ──────────────────────────────────────────────────────────────

  /// Trigger a workflow execution for a given tenant
  public func triggerWorkflow(
    workflowId : Text,
    tenantId : Text,
    triggeredBy : Text,
    customVars : [(Text, Text)],
  ) : async {
    id : Text;
    workflowId : Text;
    status : Text;
    outputData : Text;
    errorMessage : ?Text;
    startedAt : Int;
  } {
    let req : N8NTypes.WorkflowTriggerRequest = {
      workflowId;
      tenantId;
      triggeredBy;
      customVars;
    };
    let exec = await N8NWorkflowLib.triggerWorkflow(n8nState, req, n8nTransform);
    {
      id = exec.id;
      workflowId = exec.workflowId;
      status = statusToText(exec.status);
      outputData = exec.outputData;
      errorMessage = exec.errorMessage;
      startedAt = exec.startedAt;
    };
  };

  /// Returns execution log, optionally filtered by tenant
  public query func getExecutionLog(tenantId : ?Text) : async [{
    id : Text;
    workflowId : Text;
    tenantId : Text;
    status : Text;
    outputData : Text;
    errorMessage : ?Text;
    startedAt : Int;
    completedAt : ?Int;
  }] {
    let execs = N8NWorkflowLib.getExecutionLog(n8nState, tenantId);
    execs.map<N8NTypes.WorkflowExecution, { id : Text; workflowId : Text; tenantId : Text; status : Text; outputData : Text; errorMessage : ?Text; startedAt : Int; completedAt : ?Int }>(
      func(e) {
        {
          id = e.id;
          workflowId = e.workflowId;
          tenantId = e.tenantId;
          status = statusToText(e.status);
          outputData = e.outputData;
          errorMessage = e.errorMessage;
          startedAt = e.startedAt;
          completedAt = e.completedAt;
        };
      },
    );
  };

  // ── configuration ──────────────────────────────────────────────────────────

  /// Save N8N instance URL and XOR-obfuscated API key
  public func saveN8NConfig(instanceUrl : Text, apiKey : Text) : async () {
    let keyBytes = apiKey.encodeUtf8().toArray();
    let obfuscated = xorObfuscate(keyBytes);
    let cfg : N8NTypes.N8NConnectionConfig = {
      instanceUrl;
      apiKeyObfuscated = obfuscated;
      webhookBaseUrl = "";
      isConnected = false;
      lastTestedAt = null;
      activeWorkflowCount = 0;
      totalExecutionsToday = 0;
    };
    N8NWorkflowLib.saveN8NConfig(n8nState, cfg);
  };

  /// Returns N8N connection config status (never exposes raw API key)
  public query func getN8NConfig() : async {
    instanceUrl : Text;
    isConnected : Bool;
    lastTestedAt : ?Int;
    activeWorkflowCount : Nat;
    totalExecutionsToday : Nat;
  } {
    switch (N8NWorkflowLib.getN8NConfig(n8nState)) {
      case (null) {
        {
          instanceUrl = "";
          isConnected = false;
          lastTestedAt = null;
          activeWorkflowCount = 0;
          totalExecutionsToday = 0;
        };
      };
      case (?cfg) {
        let defs = N8NWorkflowLib.getWorkflowDefs(n8nState);
        var activeCount : Nat = 0;
        for (d in defs.vals()) {
          if (d.isActive) { activeCount += 1 };
        };
        let oneDayNs : Int = 86_400_000_000_000;
        let cutoff : Int = Time.now() - oneDayNs;
        let allExecs = N8NWorkflowLib.getExecutionLog(n8nState, null);
        var todayCount : Nat = 0;
        for (e in allExecs.vals()) {
          if (e.startedAt >= cutoff) { todayCount += 1 };
        };
        {
          instanceUrl = cfg.instanceUrl;
          isConnected = cfg.isConnected;
          lastTestedAt = cfg.lastTestedAt;
          activeWorkflowCount = activeCount;
          totalExecutionsToday = todayCount;
        };
      };
    };
  };

  /// Test the N8N connection using the stored config
  public func testN8NConnection() : async Bool {
    switch (N8NWorkflowLib.getN8NConfig(n8nState)) {
      case (null) false;
      case (?cfg) {
        let apiKey = decodeXorKey(cfg.apiKeyObfuscated);
        let url = cfg.instanceUrl # "/api/v1/workflows";
        let headers : [Outcall.Header] = [
          { name = "Authorization"; value = "Bearer " # apiKey },
          { name = "Content-Type"; value = "application/json" },
        ];
        try {
          let _resp = await Outcall.httpGetRequest(url, headers, n8nTransform);
          let updated : N8NTypes.N8NConnectionConfig = { cfg with isConnected = true; lastTestedAt = ?(Time.now()) };
          N8NWorkflowLib.saveN8NConfig(n8nState, updated);
          true;
        } catch (_e) {
          let updated : N8NTypes.N8NConnectionConfig = { cfg with isConnected = false; lastTestedAt = ?(Time.now()) };
          N8NWorkflowLib.saveN8NConfig(n8nState, updated);
          false;
        };
      };
    };
  };

  /// Returns the webhook URL for receiving N8N callbacks
  public query func getWebhookUrl() : async Text {
    N8NWorkflowLib.generateWebhookUrl("<canisterId>");
  };

  /// Receives an incoming N8N webhook and updates the matching execution record
  public func receiveN8NWebhook(payload : Text, executionId : Text) : async () {
    n8nState.executions.mapInPlace(
      func(e : N8NTypes.WorkflowExecution) : N8NTypes.WorkflowExecution {
        if (e.id == executionId) {
          { e with outputData = payload; status = #Success; completedAt = ?(Time.now()) };
        } else { e };
      },
    );
  };

}
