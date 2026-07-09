import Map          "mo:core/Map";
import List         "mo:core/List";
import T            "../types/dripCampaigns";
import ETLib        "../lib/emailTracking";
import FunnelLib    "../lib/funnelTracking";
import RateLimiter  "../lib/rateLimiter";

mixin (
  emailTrackingIdx : ETLib.TrackingIndex,
  dripEmailLogs    : Map.Map<Text, List.List<T.DripQueueEmailLog>>,
  funnelState      : FunnelLib.State,
  rateLimiterState : RateLimiter.State,
) {

  /// Called by the tracking pixel — records an email open.
  public shared ({ caller = _ }) func trackEmailOpen(token : Text) : async () {
    // Rate limit: 1000 requests per 60 seconds per tracking token (high-volume).
    if (not RateLimiter.checkRateLimit(rateLimiterState, "track:open:" # token, 1000, 60_000)) {
      return;
    };
    ETLib.recordEmailOpen(emailTrackingIdx, dripEmailLogs, funnelState, token);
  };

  /// Called by redirect links — records an email click.
  public shared ({ caller = _ }) func trackEmailClick(token : Text) : async () {
    // Rate limit: 1000 requests per 60 seconds per tracking token (high-volume).
    if (not RateLimiter.checkRateLimit(rateLimiterState, "track:click:" # token, 1000, 60_000)) {
      return;
    };
    ETLib.recordEmailClick(emailTrackingIdx, dripEmailLogs, funnelState, token);
  };

  /// Return aggregate sent/opened/clicked stats for a lead identifier.
  public query ({ caller = _ }) func getEmailStats(
    leadId : Text,
  ) : async { #ok : { sent : Nat; opened : Nat; clicked : Nat }; #err : Text } {
    #ok (ETLib.getEmailStats(dripEmailLogs, leadId));
  };

};
