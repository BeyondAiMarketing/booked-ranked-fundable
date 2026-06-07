import Map      "mo:core/Map";
import List     "mo:core/List";
import Time     "mo:core/Time";
import Text     "mo:core/Text";
import ICTypes  "../types/integrationCredentials";

mixin (
  apiPingState : Map.Map<Text, List.List<ICTypes.ApiPingRecord>>,
) {

  /// Returns the most recent ping record for every service that has been pinged.
  public query func getPingStatus() : async [ICTypes.ApiPingRecord] {
    let result = List.empty<ICTypes.ApiPingRecord>();
    for ((_, history) in apiPingState.entries()) {
      switch (history.last()) {
        case (?latest) { result.add(latest) };
        case (null) {};
      };
    };
    result.toArray()
  };

  /// Records a ping result for a service, keeping the last 10 per service.
  public shared func recordPingResult(
    serviceId    : Text,
    status       : Text,
    latencyMs    : Nat,
    errorMessage : ?Text,
  ) : async () {
    let record : ICTypes.ApiPingRecord = {
      serviceId;
      status;
      lastPingTime = Time.now();
      latencyMs;
      errorMessage;
    };
    let history = switch (apiPingState.get(serviceId)) {
      case (?h) { h };
      case (null) { List.empty<ICTypes.ApiPingRecord>() };
    };
    history.add(record);
    // Keep only the last 10 entries
    if (history.size() > 10) {
      history.truncate(10);
    };
    apiPingState.add(serviceId, history);
  };

  /// Returns the last 10 ping records for a specific service.
  public query func getPingHistory(serviceId : Text) : async [ICTypes.ApiPingRecord] {
    switch (apiPingState.get(serviceId)) {
      case (?h) { h.toArray() };
      case (null) { [] };
    }
  };

};
