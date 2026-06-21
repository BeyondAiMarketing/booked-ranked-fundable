import Time "mo:core/Time";

module {

  /// The GBP Optimization Agent manages Google Business Profile optimization.
  public type GBPOptimizationState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    gbpUrl : Text;
    optimizationScore : Nat;
    categoryMatch : Nat;
    descriptionQuality : Nat;
    photoCount : Nat;
    photoQualityScore : Nat;
    qAndACount : Nat;
    attributeCompleteness : Nat;
    serviceListings : [Text];
    openHoursComplete : Bool;
    bookingLinkSet : Bool;
    pendingOptimizations : [Text];
    completedOptimizations : [Text];
    lastOptimizedAt : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to start GBP optimization.
  public type GBPOptimizationInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    gbpUrl : Text;
    businessName : Text;
    primaryCategory : Text;
  };

  /// Update for GBP optimization progress.
  public type GBPOptimizationUpdate = {
    optimizationScore : ?Nat;
    categoryMatch : ?Nat;
    descriptionQuality : ?Nat;
    photoCount : ?Nat;
    photoQualityScore : ?Nat;
    qAndACount : ?Nat;
    attributeCompleteness : ?Nat;
    serviceListings : ?[Text];
    openHoursComplete : ?Bool;
    bookingLinkSet : ?Bool;
    pendingOptimizations : ?[Text];
    completedOptimizations : ?[Text];
    lastOptimizedAt : ??Int;
    updatedAt : ?Int;
  };

}
