module {

  public type AttributionTouch = {
    channel : Text;
    source : Text;
    timestamp : Int;
    campaignId : Text;
    utmParams : Text;
  };

  public type LeadAttributionRecord = {
    id : Text;
    tenantId : Text;
    leadId : Text;
    channels : [AttributionTouch];
    bookingId : Text;
    closedDealValue : Float;
    finalConversionChannel : Text;
    attributionModel : Text; // first_touch | last_touch | linear | time_decay
    createdAt : Int;         // nanosecond timestamp
  };

};
