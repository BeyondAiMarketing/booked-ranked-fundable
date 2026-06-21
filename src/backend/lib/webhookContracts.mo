import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import T    "../types/webhookContracts";

module {

  public type State = {
    contracts   : Map.Map<Text, T.WebhookContract>;
    executions  : Map.Map<Text, T.WebhookExecution>;
  };

  public func emptyState() : State = {
    contracts  = Map.empty<Text, T.WebhookContract>();
    executions = Map.empty<Text, T.WebhookExecution>();
  };

  // ---------------------------------------------------------------------------
  // Contract management
  // ---------------------------------------------------------------------------

  /// Create or update a webhook contract
  public func upsertContract(state : State, contract : T.WebhookContract) : () {
    state.contracts.add(contract.id, contract);
  };

  /// Get a contract by id
  public func getContract(state : State, id : Text) : ?T.WebhookContract {
    state.contracts.get(id);
  };

  /// Get all contracts
  public func getAllContracts(state : State) : [T.WebhookContract] {
    let result = List.empty<T.WebhookContract>();
    for (contract in state.contracts.values()) { result.add(contract) };
    result.toArray();
  };

  /// Get contracts by category
  public func getContractsByCategory(state : State, category : T.WebhookCategory) : [T.WebhookContract] {
    let result = List.empty<T.WebhookContract>();
    for (contract in state.contracts.values()) {
      if (contract.category == category) { result.add(contract) };
    };
    result.toArray();
  };

  /// Get contract summaries for listing
  public func getContractSummaries(state : State) : [T.ContractSummary] {
    let result = List.empty<T.ContractSummary>();
    for (contract in state.contracts.values()) {
      result.add({
        id = contract.id;
        endpoint = contract.endpoint;
        method = switch (contract.method) {
          case (#post) "POST";
          case (#get) "GET";
          case (#put) "PUT";
          case (#patch) "PATCH";
          case (#delete) "DELETE";
        };
        purpose = contract.purpose;
        category = switch (contract.category) {
          case (#crm) "CRM";
          case (#gbp) "GBP";
          case (#social) "Social";
          case (#email_sms) "Email/SMS";
          case (#reports) "Reports";
          case (#funding) "Funding";
          case (#voice) "Voice";
          case (#general) "General";
        };
        requiresApproval = contract.requiresApproval;
        supportsDryRun = contract.supportsDryRun;
      });
    };
    result.toArray();
  };

  /// Delete a contract
  public func deleteContract(state : State, id : Text) : Bool {
    switch (state.contracts.get(id)) {
      case (?_) { state.contracts.remove(id); true };
      case null { false };
    };
  };

  // ---------------------------------------------------------------------------
  // Execution management
  // ---------------------------------------------------------------------------

  /// Create a new execution record
  public func createExecution(state : State, request : T.ExecutionRequest) : T.WebhookExecution {
    let now = Time.now();
    let execution : T.WebhookExecution = {
      id = "exec-" # now.toText() # "-" # Int.toText(state.executions.size());
      contractId = request.contractId;
      clientBusinessId = request.clientBusinessId;
      verticalProfileId = request.verticalProfileId;
      recordId = request.recordId;
      approvalRequestId = request.approvalRequestId;
      isDryRun = request.isDryRun;
      approvedBy = null;
      approvedAt = null;
      payload = request.payload;
      status = #pending;
      result = null;
      errorMsg = null;
      callbackUrl = request.callbackUrl;
      createdAt = now;
      completedAt = null;
    };
    state.executions.add(execution.id, execution);
    execution;
  };

  /// Update execution status
  public func updateExecutionStatus(state : State, id : Text, status : { #pending; #success; #failed; #cancelled }, result : ?Text, errorMsg : ?Text) : Bool {
    switch (state.executions.get(id)) {
      case (?execution) {
        state.executions.add(id, {
          execution with
          status = status;
          result = result;
          errorMsg = errorMsg;
          completedAt = ?Time.now();
        });
        true;
      };
      case null { false };
    };
  };

  /// Get execution by id
  public func getExecution(state : State, id : Text) : ?T.WebhookExecution {
    state.executions.get(id);
  };

  /// Get executions by contract
  public func getExecutionsByContract(state : State, contractId : Text) : [T.WebhookExecution] {
    let result = List.empty<T.WebhookExecution>();
    for (execution in state.executions.values()) {
      if (execution.contractId == contractId) { result.add(execution) };
    };
    result.toArray();
  };

  /// Get executions by client business
  public func getExecutionsByClient(state : State, clientBusinessId : Text) : [T.WebhookExecution] {
    let result = List.empty<T.WebhookExecution>();
    for (execution in state.executions.values()) {
      if (execution.clientBusinessId == clientBusinessId) { result.add(execution) };
    };
    result.toArray();
  };

  /// Get all executions
  public func getAllExecutions(state : State) : [T.WebhookExecution] {
    let result = List.empty<T.WebhookExecution>();
    for (execution in state.executions.values()) { result.add(execution) };
    result.toArray();
  };

  // ---------------------------------------------------------------------------
  // Predefined BRF webhook contracts
  // ---------------------------------------------------------------------------

  /// Seed the standard BRF webhook contracts
  public func seedDefaultContracts(state : State) : () {
    let now = Time.now();

    let contracts : [T.WebhookContract] = [
      {
        id = "brf-create-lead";
        endpoint = "/webhook/brf/create-lead";
        method = #post;
        purpose = "Create a new lead in the CRM pipeline";
        category = #crm;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "name"; fieldType = "Text"; required = true; description = "Lead name" },
          { name = "email"; fieldType = "Text"; required = true; description = "Lead email" },
        ];
        optionalFields = [
          { name = "phone"; fieldType = "Text"; required = false; description = "Lead phone" },
          { name = "source"; fieldType = "Text"; required = false; description = "Lead source" },
          { name = "notes"; fieldType = "Text"; required = false; description = "Additional notes" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = null;
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"lead_created";
        successResponse = "{ \"status\": \"ok\", \"leadId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-update-pipeline-stage";
        endpoint = "/webhook/brf/update-pipeline-stage";
        method = #post;
        purpose = "Update a lead's pipeline stage";
        category = #crm;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "leadId"; fieldType = "Text"; required = true; description = "Lead ID to update" },
          { name = "stage"; fieldType = "Text"; required = true; description = "New pipeline stage" },
        ];
        optionalFields = [
          { name = "notes"; fieldType = "Text"; required = false; description = "Stage change notes" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = null;
        recordIdField = ?"leadId";
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"pipeline_updated";
        successResponse = "{ \"status\": \"ok\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-create-gbp-post";
        endpoint = "/webhook/brf/create-gbp-post";
        method = #post;
        purpose = "Create a Google Business Profile post draft";
        category = #gbp;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "title"; fieldType = "Text"; required = true; description = "Post title" },
          { name = "body"; fieldType = "Text"; required = true; description = "Post body content" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "cta"; fieldType = "Text"; required = false; description = "Call to action" },
          { name = "ctaUrl"; fieldType = "Text"; required = false; description = "CTA URL" },
          { name = "photoAsset"; fieldType = "Text"; required = false; description = "Photo asset reference" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"gbp_post_created";
        successResponse = "{ \"status\": \"ok\", \"postId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-reply-to-gbp-review";
        endpoint = "/webhook/brf/reply-to-gbp-review";
        method = #post;
        purpose = "Reply to a GBP review";
        category = #gbp;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "reviewId"; fieldType = "Text"; required = true; description = "Review ID to reply to" },
          { name = "replyText"; fieldType = "Text"; required = true; description = "Reply text content" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = ?"reviewId";
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"gbp_review_replied";
        successResponse = "{ \"status\": \"ok\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-pull-gbp-reviews";
        endpoint = "/webhook/brf/pull-gbp-reviews";
        method = #post;
        purpose = "Pull latest GBP reviews";
        category = #gbp;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "limit"; fieldType = "Nat"; required = false; description = "Max reviews to pull" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"gbp_reviews_pulled";
        successResponse = "{ \"status\": \"ok\", \"reviews\": [...] }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-create-social-post";
        endpoint = "/webhook/brf/create-social-post";
        method = #post;
        purpose = "Create a social media post draft";
        category = #social;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "platform"; fieldType = "Text"; required = true; description = "Social platform (facebook, instagram, linkedin, x, threads, tiktok)" },
          { name = "content"; fieldType = "Text"; required = true; description = "Post content" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "mediaUrl"; fieldType = "Text"; required = false; description = "Media attachment URL" },
          { name = "scheduledAt"; fieldType = "Int"; required = false; description = "Scheduled publish time" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"social_post_created";
        successResponse = "{ \"status\": \"ok\", \"postId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-send-email-campaign";
        endpoint = "/webhook/brf/send-email-campaign";
        method = #post;
        purpose = "Send an email campaign";
        category = #email_sms;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "campaignId"; fieldType = "Text"; required = true; description = "Campaign ID" },
          { name = "recipientEmail"; fieldType = "Text"; required = true; description = "Recipient email address" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "templateId"; fieldType = "Text"; required = false; description = "Email template ID" },
          { name = "personalization"; fieldType = "Text"; required = false; description = "JSON personalization data" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = ?"campaignId";
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"email_campaign_sent";
        successResponse = "{ \"status\": \"ok\", \"messageId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-send-sms-followup";
        endpoint = "/webhook/brf/send-sms-followup";
        method = #post;
        purpose = "Send an SMS follow-up message";
        category = #email_sms;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "phone"; fieldType = "Text"; required = true; description = "Recipient phone number" },
          { name = "message"; fieldType = "Text"; required = true; description = "SMS message content" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "leadId"; fieldType = "Text"; required = false; description = "Associated lead ID" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = ?"leadId";
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"sms_followup_sent";
        successResponse = "{ \"status\": \"ok\", \"messageId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-missed-call-text-back";
        endpoint = "/webhook/brf/missed-call-text-back";
        method = #post;
        purpose = "Send missed call text-back SMS";
        category = #voice;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "callerPhone"; fieldType = "Text"; required = true; description = "Caller phone number" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "message"; fieldType = "Text"; required = false; description = "Custom message (default used if empty)" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"missed_call_textback_sent";
        successResponse = "{ \"status\": \"ok\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"immediate";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-request-review";
        endpoint = "/webhook/brf/request-review";
        method = #post;
        purpose = "Send review request to customer";
        category = #gbp;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "customerEmail"; fieldType = "Text"; required = true; description = "Customer email" },
          { name = "platform"; fieldType = "Text"; required = true; description = "Review platform (google, yelp, facebook)" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "customerName"; fieldType = "Text"; required = false; description = "Customer name" },
          { name = "serviceCompleted"; fieldType = "Text"; required = false; description = "Service completed description" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"review_requested";
        successResponse = "{ \"status\": \"ok\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-create-monthly-report";
        endpoint = "/webhook/brf/create-monthly-report";
        method = #post;
        purpose = "Generate monthly BRF report";
        category = #reports;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "month"; fieldType = "Text"; required = true; description = "Report month (YYYY-MM)" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "includeSections"; fieldType = "Text[]"; required = false; description = "Sections to include" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"monthly_report_created";
        successResponse = "{ \"status\": \"ok\", \"reportId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-create-proposal";
        endpoint = "/webhook/brf/create-proposal";
        method = #post;
        purpose = "Generate client proposal";
        category = #general;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "proposalType"; fieldType = "Text"; required = true; description = "Type of proposal" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "auditId"; fieldType = "Text"; required = false; description = "Associated audit ID" },
          { name = "investmentTier"; fieldType = "Text"; required = false; description = "Investment tier" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = ?"auditId";
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = true;
        workflowLogUpdateType = ?"proposal_created";
        successResponse = "{ \"status\": \"ok\", \"proposalId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-generate-marketing-audit";
        endpoint = "/webhook/brf/generate-marketing-audit";
        method = #post;
        purpose = "Generate marketing audit scorecard";
        category = #general;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "website"; fieldType = "Text"; required = true; description = "Website URL to audit" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "competitors"; fieldType = "Text[]"; required = false; description = "Competitor URLs" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"marketing_audit_generated";
        successResponse = "{ \"status\": \"ok\", \"auditId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-funding-readiness-report";
        endpoint = "/webhook/brf/funding-readiness-report";
        method = #post;
        purpose = "Generate funding readiness report";
        category = #funding;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "includeActionPlan"; fieldType = "Bool"; required = false; description = "Include action plan" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"funding_report_generated";
        successResponse = "{ \"status\": \"ok\", \"reportId\": \"<id>\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-notify-approval-needed";
        endpoint = "/webhook/brf/notify-approval-needed";
        method = #post;
        purpose = "Notify that approval is needed for an action";
        category = #general;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "approvalRequestId"; fieldType = "Text"; required = true; description = "Approval request ID" },
          { name = "actionType"; fieldType = "Text"; required = true; description = "Type of action awaiting approval" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "preview"; fieldType = "Text"; required = false; description = "Preview of the content awaiting approval" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = null;
        approvalRequestIdField = ?"approvalRequestId";
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"approval_notification_sent";
        successResponse = "{ \"status\": \"ok\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"3 retries with backoff";
        createdAt = now;
        updatedAt = now;
      },
      {
        id = "brf-update-workflow-log";
        endpoint = "/webhook/brf/update-workflow-log";
        method = #post;
        purpose = "Update workflow log with action result";
        category = #general;
        requiredFields = [
          { name = "clientBusinessId"; fieldType = "Text"; required = true; description = "ID of the client business" },
          { name = "workflowId"; fieldType = "Text"; required = true; description = "Workflow ID" },
          { name = "status"; fieldType = "Text"; required = true; description = "New status" },
        ];
        optionalFields = [
          { name = "verticalProfileId"; fieldType = "Text"; required = false; description = "Vertical profile ID" },
          { name = "notes"; fieldType = "Text"; required = false; description = "Status notes" },
          { name = "stepIndex"; fieldType = "Nat"; required = false; description = "Current step index" },
        ];
        clientBusinessIdField = ?"clientBusinessId";
        verticalProfileIdField = ?"verticalProfileId";
        recordIdField = ?"workflowId";
        approvalRequestIdField = null;
        supportsDryRun = true;
        requiresApproval = false;
        workflowLogUpdateType = ?"workflow_log_updated";
        successResponse = "{ \"status\": \"ok\" }";
        errorResponse = "{ \"status\": \"error\", \"message\": \"<error>\" }";
        retryStrategy = ?"none";
        createdAt = now;
        updatedAt = now;
      },
    ];

    for (contract in contracts.vals()) {
      state.contracts.add(contract.id, contract);
    };
  };

};
