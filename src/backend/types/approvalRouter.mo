import Time "mo:core/Time";

module {

  /// Approval tier for routing decisions.
  public type ApprovalTier = {
    #tier1_autonomous;
    #tier2_queue;
    #tier3_notify_confirm;
  };

  /// The Approval Router Agent routes actions to the correct approval tier.
  public type ApprovalRouterState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    actionType : Text;
    sourceObjectType : Text;
    sourceObjectId : Text;
    assignedTier : ApprovalTier;
    riskLevel : Text;
    complianceNotes : [Text];
    autoApproved : Bool;
    routedAt : Int;
    approvalRequestId : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to route an action for approval.
  public type ApprovalRouterInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    actionType : Text;
    sourceObjectType : Text;
    sourceObjectId : Text;
    contentPreview : Text;
  };

  /// Update for approval routing.
  /// Generic aliases for lib/mixin compatibility
  public type Record = ApprovalRouterState;
  public type CreateRequest = ApprovalRouterInput;
  public type UpdateRequest = ApprovalRouterUpdate;

  public type ApprovalRouterUpdate = {
    assignedTier : ?ApprovalTier;
    riskLevel : ?Text;
    complianceNotes : ?[Text];
    autoApproved : ?Bool;
    approvalRequestId : ??Text;
    updatedAt : ?Int;
  };

}
