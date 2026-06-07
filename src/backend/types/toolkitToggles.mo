module {

  /// A single on/off toggle for a named toolkit within a tier.
  public type ToolkitToggle = {
    tierId       : Text;
    toolkitName  : Text;
    enabled      : Bool;
    appliedAt    : Int;
  };

  /// Request to bulk-apply the same enabled state to multiple toolkits in one tier.
  public type BulkToggleRequest = {
    tierId       : Text;
    toolkitNames : [Text];
    enabled      : Bool;
  };

  /// Scope discriminator for toggle operations.
  public type ToggleScope = {
    #All;
    #Tier    : Text;
    #Account : Text;
  };

};
