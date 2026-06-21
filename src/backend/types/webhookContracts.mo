module {

  /// Category of webhook contract for grouping and routing
  public type WebhookCategory = {
    #crm;
    #gbp;
    #social;
    #email_sms;
    #reports;
    #funding;
    #voice;
    #general;
  };

  /// HTTP method for the webhook endpoint
  public type HttpMethod = {
    #post;
    #get;
    #put;
    #patch;
    #delete;
  };

  /// Field definition for webhook contract schema
  public type ContractField = {
    name        : Text;
    fieldType   : Text;  // "Text", "Nat", "Int", "Bool", "Text[]", "Nat?", etc.
    required    : Bool;
    description : Text;
  };

  /// A single webhook contract definition
  public type WebhookContract = {
    id              : Text;
    endpoint        : Text;
    method          : HttpMethod;
    purpose         : Text;
    category        : WebhookCategory;
    requiredFields  : [ContractField];
    optionalFields  : [ContractField];
    clientBusinessIdField : ?Text;  // field name that holds clientBusinessId
    verticalProfileIdField : ?Text; // field name that holds verticalProfileId
    recordIdField   : ?Text;        // field name that holds recordId
    approvalRequestIdField : ?Text; // field name that holds approvalRequestId
    supportsDryRun  : Bool;
    requiresApproval : Bool;
    workflowLogUpdateType : ?Text;  // type of workflow log entry to create
    successResponse : Text;
    errorResponse   : Text;
    retryStrategy   : ?Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  /// Instance of a webhook execution (dry run or actual)
  public type WebhookExecution = {
    id              : Text;
    contractId      : Text;
    clientBusinessId : Text;
    verticalProfileId : ?Text;
    recordId        : ?Text;
    approvalRequestId : ?Text;
    isDryRun        : Bool;
    approvedBy      : ?Text;
    approvedAt      : ?Int;
    payload         : [(Text, Text)];
    status          : { #pending; #success; #failed; #cancelled };
    result          : ?Text;
    errorMsg        : ?Text;
    callbackUrl     : ?Text;
    createdAt       : Int;
    completedAt     : ?Int;
  };

  /// Summary of a contract for listing
  public type ContractSummary = {
    id          : Text;
    endpoint    : Text;
    method      : Text;
    purpose     : Text;
    category    : Text;
    requiresApproval : Bool;
    supportsDryRun   : Bool;
  };

  /// Request to execute a webhook contract
  public type ExecutionRequest = {
    contractId       : Text;
    clientBusinessId : Text;
    verticalProfileId : ?Text;
    recordId         : ?Text;
    approvalRequestId : ?Text;
    isDryRun         : Bool;
    payload          : [(Text, Text)];
    callbackUrl      : ?Text;
  };

  /// Response from executing a webhook contract
  public type ExecutionResponse = {
    executionId : Text;
    status      : { #pending; #success; #failed; #cancelled };
    result      : ?Text;
    errorMsg    : ?Text;
    isDryRun    : Bool;
  };

};
