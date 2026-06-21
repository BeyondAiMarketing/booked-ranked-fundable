import WebhookContractsLib "../lib/webhookContracts";
import T                     "../types/webhookContracts";

mixin (webhookContractsState : WebhookContractsLib.State) {

  /// Upsert a webhook contract definition
  public shared ({ caller = _ }) func upsertWebhookContract(contract : T.WebhookContract) : async { #ok : Text; #err : Text } {
    WebhookContractsLib.upsertContract(webhookContractsState, contract);
    #ok "Webhook contract upserted.";
  };

  /// Get a webhook contract by id
  public shared ({ caller = _ }) func getWebhookContract(id : Text) : async { #ok : T.WebhookContract; #err : Text } {
    switch (WebhookContractsLib.getContract(webhookContractsState, id)) {
      case (?c)  { #ok c };
      case null  { #err ("No webhook contract found for id: " # id) };
    };
  };

  /// Get all webhook contracts
  public shared ({ caller = _ }) func getAllWebhookContracts() : async { #ok : [T.WebhookContract]; #err : Text } {
    #ok (WebhookContractsLib.getAllContracts(webhookContractsState));
  };

  /// Get webhook contracts by category
  public shared ({ caller = _ }) func getWebhookContractsByCategory(category : T.WebhookCategory) : async { #ok : [T.WebhookContract]; #err : Text } {
    #ok (WebhookContractsLib.getContractsByCategory(webhookContractsState, category));
  };

  /// Get webhook contract summaries for listing
  public shared ({ caller = _ }) func getWebhookContractSummaries() : async { #ok : [T.ContractSummary]; #err : Text } {
    #ok (WebhookContractsLib.getContractSummaries(webhookContractsState));
  };

  /// Delete a webhook contract
  public shared ({ caller = _ }) func deleteWebhookContract(id : Text) : async { #ok : Text; #err : Text } {
    if (WebhookContractsLib.deleteContract(webhookContractsState, id)) {
      #ok "Webhook contract deleted.";
    } else {
      #err ("No webhook contract found for id: " # id);
    };
  };

  /// Execute a webhook contract (create execution record)
  public shared ({ caller = _ }) func executeWebhookContract(request : T.ExecutionRequest) : async { #ok : T.ExecutionResponse; #err : Text } {
    switch (WebhookContractsLib.getContract(webhookContractsState, request.contractId)) {
      case (?contract) {
        // Check if approval is required but not provided
        if (contract.requiresApproval and request.approvalRequestId == null and not request.isDryRun) {
          return #err "This contract requires an approved approvalRequestId for non-dryRun execution.";
        };
        let execution = WebhookContractsLib.createExecution(webhookContractsState, request);
        #ok {
          executionId = execution.id;
          status = execution.status;
          result = execution.result;
          errorMsg = execution.errorMsg;
          isDryRun = execution.isDryRun;
        };
      };
      case null {
        #err ("No webhook contract found for id: " # request.contractId);
      };
    };
  };

  /// Update webhook execution status
  public shared ({ caller = _ }) func updateWebhookExecutionStatus(id : Text, status : { #pending; #success; #failed; #cancelled }, result : ?Text, errorMsg : ?Text) : async { #ok : Text; #err : Text } {
    if (WebhookContractsLib.updateExecutionStatus(webhookContractsState, id, status, result, errorMsg)) {
      #ok "Webhook execution status updated.";
    } else {
      #err ("No webhook execution found for id: " # id);
    };
  };

  /// Get webhook execution by id
  public shared ({ caller = _ }) func getWebhookExecution(id : Text) : async { #ok : T.WebhookExecution; #err : Text } {
    switch (WebhookContractsLib.getExecution(webhookContractsState, id)) {
      case (?e)  { #ok e };
      case null  { #err ("No webhook execution found for id: " # id) };
    };
  };

  /// Get executions by contract
  public shared ({ caller = _ }) func getWebhookExecutionsByContract(contractId : Text) : async { #ok : [T.WebhookExecution]; #err : Text } {
    #ok (WebhookContractsLib.getExecutionsByContract(webhookContractsState, contractId));
  };

  /// Get executions by client business
  public shared ({ caller = _ }) func getWebhookExecutionsByClient(clientBusinessId : Text) : async { #ok : [T.WebhookExecution]; #err : Text } {
    #ok (WebhookContractsLib.getExecutionsByClient(webhookContractsState, clientBusinessId));
  };

  /// Get all webhook executions
  public shared ({ caller = _ }) func getAllWebhookExecutions() : async { #ok : [T.WebhookExecution]; #err : Text } {
    #ok (WebhookContractsLib.getAllExecutions(webhookContractsState));
  };

  /// Seed default BRF webhook contracts
  public shared ({ caller = _ }) func seedDefaultWebhookContracts() : async { #ok : Text; #err : Text } {
    WebhookContractsLib.seedDefaultContracts(webhookContractsState);
    #ok "Default webhook contracts seeded.";
  };

};
