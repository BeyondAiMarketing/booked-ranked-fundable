import Time "mo:core/Time";

module {

  /// The Vertical Profile Router Agent selects the right vertical profile and templates.
  public type VerticalProfileRouterState = {
    id : Text;
    clientBusinessId : Text;
    selectedVerticalId : Text;
    detectedVerticalHints : [Text];
    confidenceScore : Nat;
    appliedTemplates : [Text];
    appliedComplianceRules : [Text];
    lastRoutedAt : Int;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to route a client to the right vertical profile.
  public type VerticalProfileRouterInput = {
    clientBusinessId : Text;
    businessName : Text;
    industry : Text;
    services : [Text];
    website : Text;
    location : Text;
  };

  /// Update for the Vertical Profile Router state.
  public type VerticalProfileRouterUpdate = {
    selectedVerticalId : ?Text;
    detectedVerticalHints : ?[Text];
    confidenceScore : ?Nat;
    appliedTemplates : ?[Text];
    appliedComplianceRules : ?[Text];
    lastRoutedAt : ?Int;
    updatedAt : ?Int;
  };

}
