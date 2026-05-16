module {

  public type CompetitorProfile = {
    id : Text;
    tenantId : Text;
    competitorName : Text;
    website : Text;
    googleRating : Float;
    ratingChangePrevious : Float;
    reviewCount : Nat;
    reviewVelocityTrend : Text; // up | down | flat
    gbpLastUpdated : Text;      // ISO date
    adPresenceDetected : Bool;
    lastAuditedAt : Int;        // nanosecond timestamp
    alertThreshold : Float;
  };

  public type CompetitorAlert = {
    id : Text;
    tenantId : Text;
    competitorId : Text;
    alertType : Text; // rating_drop | review_spike | new_ads | gbp_update
    severity : Text;  // low | medium | high
    triggeredAt : Int;
    dismissed : Bool;
  };

};
