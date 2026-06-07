import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat  "mo:core/Nat";
import T    "../types/dripCampaigns";
import FunnelLib "../lib/funnelTracking";
import FT        "../types/funnelTracking";

module {

  public type TrackingIndex = {
    /// token → (queueId, logId)
    tokenMap : Map.Map<Text, (Text, Text)>;
  };

  public func emptyIndex() : TrackingIndex = {
    tokenMap = Map.empty<Text, (Text, Text)>();
  };

  /// Build a deterministic tracking token from leadId + emailIndex.
  public func generateTrackingToken(leadId : Text, emailIndex : Nat) : Text {
    "brftrk-" # leadId # "-" # emailIndex.toText();
  };

  /// Register a sent email log entry in the tracking index.
  public func registerToken(
    idx     : TrackingIndex,
    token   : Text,
    queueId : Text,
    logId   : Text,
  ) : () {
    idx.tokenMap.add(token, (queueId, logId));
  };

  /// Record an email open event.  Looks up the log by token, sets openedAt, increments openCount.
  /// Also logs FunnelEvent EmailOpened using the leadId embedded in the token.
  public func recordEmailOpen(
    idx          : TrackingIndex,
    dripEmailLogs : Map.Map<Text, List.List<T.DripQueueEmailLog>>,
    funnelState  : FunnelLib.State,
    token        : Text,
  ) : () {
    let now = Time.now();
    switch (idx.tokenMap.get(token)) {
      case null {};
      case (?(queueId, logId)) {
        switch (dripEmailLogs.get(queueId)) {
          case null {};
          case (?logs) {
            logs.mapInPlace(func(entry : T.DripQueueEmailLog) : T.DripQueueEmailLog {
              if (entry.id == logId) {
                // Extract leadId from token: brftrk-<leadId>-<index>
                let leadId = extractLeadId(token);
                FunnelLib.logStep(funnelState, leadId, #EmailOpened, null);
                {
                  entry with
                  openedAt   = if (entry.openedAt == null) ?now else entry.openedAt;
                  openCount  = entry.openCount + 1;
                }
              } else { entry };
            });
          };
        };
      };
    };
  };

  /// Record an email click event.
  public func recordEmailClick(
    idx          : TrackingIndex,
    dripEmailLogs : Map.Map<Text, List.List<T.DripQueueEmailLog>>,
    funnelState  : FunnelLib.State,
    token        : Text,
  ) : () {
    let now = Time.now();
    switch (idx.tokenMap.get(token)) {
      case null {};
      case (?(queueId, logId)) {
        switch (dripEmailLogs.get(queueId)) {
          case null {};
          case (?logs) {
            logs.mapInPlace(func(entry : T.DripQueueEmailLog) : T.DripQueueEmailLog {
              if (entry.id == logId) {
                let leadId = extractLeadId(token);
                FunnelLib.logStep(funnelState, leadId, #EmailClicked, null);
                {
                  entry with
                  clickedAt  = if (entry.clickedAt == null) ?now else entry.clickedAt;
                  clickCount = entry.clickCount + 1;
                }
              } else { entry };
            });
          };
        };
      };
    };
  };

  /// Return aggregate email stats for a lead across all queues.
  public func getEmailStats(
    dripEmailLogs : Map.Map<Text, List.List<T.DripQueueEmailLog>>,
    leadId        : Text,
  ) : { sent : Nat; opened : Nat; clicked : Nat } {
    var sent   = 0;
    var opened = 0;
    var clicked = 0;
    for ((_, logs) in dripEmailLogs.entries()) {
      for (entry in logs.values()) {
        if (entry.recipientEmail == leadId or entry.id.contains(#text leadId)) {
          sent += 1;
          if (entry.openCount > 0)  { opened  += 1 };
          if (entry.clickCount > 0) { clicked += 1 };
        };
      };
    };
    { sent; opened; clicked };
  };

  // ---- Private helper ----

  /// Extract the leadId from token format: brftrk-<leadId>-<index>
  func extractLeadId(token : Text) : Text {
    // Strip the "brftrk-" prefix
    let withoutPrefix = token.trimStart(#text "brftrk-");
    // Remove the trailing "-<index>" suffix by finding the last '-'
    let chars = withoutPrefix.toArray();
    var lastDash = chars.size();
    var i = chars.size();
    while (i > 0) {
      i -= 1;
      if (chars[i] == '-' and lastDash == chars.size()) {
        lastDash := i;
      };
    };
    if (lastDash == chars.size()) {
      withoutPrefix
    } else {
      // Reconstruct from chars[0..lastDash)
      var result = "";
      var j = 0;
      while (j < lastDash) {
        result := result # Text.fromChar(chars[j]);
        j += 1;
      };
      result
    };
  };

};
