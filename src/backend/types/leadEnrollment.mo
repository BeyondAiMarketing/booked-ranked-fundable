module {

  /// Result of a bulk lead enrollment operation.
  public type EnrollmentResult = {
    enrolledCount : Nat;
    skippedCount  : Nat;
    errors        : [Text];
  };

  /// Request to enroll roofing leads into a campaign.
  public type RoofingLeadEnrollRequest = {
    campaignId  : Text;
    dailyLimit  : Nat;
    nicheFilter : Text;
  };

};
