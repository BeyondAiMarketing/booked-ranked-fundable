module {

  public type WorkflowScope = {
    #AdminOnly;
    #AllClients;        // push to all client accounts platform-wide
    #BasicTier;
    #ProTier;
    #AgencyTier;
    #PlatformWide;      // alias: same as AllClients, explicit intent
    #SpecificAgency : Text; // push to a single named agency
  };

  public type WorkflowDef = {
    id : Text;
    name : Text;
    description : Text;
    tags : [Text];
    scope : WorkflowScope;
    workflowJson : Text;
    isActive : Bool;
    createdAt : Int;
    createdBy : Text;
    pushedToAccounts : [Text];
  };

  public type WorkflowExecutionStatus = {
    #Running;
    #Success;
    #Failed;
    #Timeout;
  };

  public type WorkflowExecution = {
    id : Text;
    workflowId : Text;
    tenantId : Text;
    triggeredBy : Text;
    status : WorkflowExecutionStatus;
    inputVars : Text;
    outputData : Text;
    errorMessage : ?Text;
    startedAt : Int;
    completedAt : ?Int;
  };

  public type N8NConnectionConfig = {
    instanceUrl : Text;
    apiKeyObfuscated : [Nat8];
    webhookBaseUrl : Text;
    isConnected : Bool;
    lastTestedAt : ?Int;
    activeWorkflowCount : Nat;
    totalExecutionsToday : Nat;
  };

  // ── Batch import types ────────────────────────────────────────────────────

  public type WorkflowImportValidation = {
    index   : Nat;
    id      : Text;
    name    : Text;
    valid   : Bool;
    errors  : [Text];
  };

  public type WorkflowBatch = {
    batchId     : Text;
    defs        : [WorkflowDef];
    validatedAt : Int;
    committed   : Bool;
  };

  public type WorkflowTriggerRequest = {
    workflowId : Text;
    tenantId : Text;
    triggeredBy : Text;
    customVars : [(Text, Text)];
  };

};
