import Time "mo:core/Time";

module {

  /// Pipeline stage for the Booked Pipeline Agent.
  public type PipelineStage = {
    #new_lead;
    #contact_attempted;
    #appointment_scheduled;
    #discovery_completed;
    #proposal_sent;
    #financing_pending;
    #follow_up_needed;
    #won;
    #lost;
    #nurture;
  };

  /// The Booked Pipeline Agent manages lead flow and pipeline stages.
  public type BookedPipelineState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    leadId : Text;
    currentStage : PipelineStage;
    stageHistory : [(PipelineStage, Int)];
    nextAction : Text;
    nextActionDue : ?Int;
    assignedAgent : Text;
    followUpCount : Nat;
    lastContactAt : ?Int;
    notes : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create a pipeline entry.
  public type BookedPipelineInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    leadId : Text;
    initialStage : PipelineStage;
  };

  /// Update for pipeline progression.
  /// Generic aliases for lib/mixin compatibility
  public type Record = BookedPipelineState;
  public type CreateRequest = BookedPipelineInput;
  public type UpdateRequest = BookedPipelineUpdate;

  public type BookedPipelineUpdate = {
    currentStage : ?PipelineStage;
    nextAction : ?Text;
    nextActionDue : ??Int;
    assignedAgent : ?Text;
    followUpCount : ?Nat;
    lastContactAt : ??Int;
    notes : ?[Text];
    updatedAt : ?Int;
  };

}
