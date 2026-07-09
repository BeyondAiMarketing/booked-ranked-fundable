import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int  "mo:core/Int";

module {

  /// 1 ms in nanoseconds (Time.now() returns ns).
  let NS_PER_MS : Int = 1_000_000;

  /// In-memory sliding-window rate-limit state: key -> request timestamps (ns).
  /// Resets on canister upgrade. Acceptable per user decision — no stable state.
  /// Threaded through call sites as a State record (project pattern) to avoid
  /// module-level mutable non-static expressions (M0014).
  public type State = {
    var counters : Map.Map<Text, List.List<Int>>;
  };

  /// Construct an empty rate-limit state. Call once per actor and pass the
  /// same ref to every RateLimiter function.
  public func emptyState() : State = {
    var counters = Map.empty();
  };

  /// Prune timestamps older than the window cutoff from a key's list.
  /// Returns the pruned list (in insertion order, oldest first).
  func pruneOld(list : List.List<Int>, cutoff : Int) : List.List<Int> {
    list.filter(func(ts : Int) : Bool { ts >= cutoff });
  };

  /// Returns true if the request is allowed under the sliding window,
  /// false if rate-limited. When allowed, records the current timestamp.
  /// `windowMs` is the window size in milliseconds.
  public func checkRateLimit(state : State, key : Text, maxRequests : Nat, windowMs : Int) : Bool {
    let now : Int = Time.now();
    let cutoff : Int = now - (windowMs * NS_PER_MS);
    let m = state.counters;
    let pruned = switch (m.get(key)) {
      case (?list) pruneOld(list, cutoff);
      case (null) List.empty<Int>();
    };
    if (pruned.size() >= maxRequests) {
      // Rate-limited — do NOT record this attempt.
      return false;
    };
    pruned.add(now);
    m.add(key, pruned);
    true;
  };

  /// Returns milliseconds until the caller can retry, or 0 if allowed now.
  /// Computed from the oldest in-window timestamp: retryAfter = oldest + window - now.
  public func getRetryAfterMs(state : State, key : Text, windowMs : Int) : Int {
    let now : Int = Time.now();
    let cutoff : Int = now - (windowMs * NS_PER_MS);
    let m = state.counters;
    let pruned = switch (m.get(key)) {
      case (?list) pruneOld(list, cutoff);
      case (null) return 0;
    };
    switch (pruned.first()) {
      case (?oldest) {
        let retryNs : Int = (oldest + (windowMs * NS_PER_MS)) - now;
        if (retryNs <= 0) 0 else retryNs / NS_PER_MS;
      };
      case (null) 0;
    };
  };

  /// Clears the counter for a key. For testing/admin use.
  public func resetCounter(state : State, key : Text) : () {
    state.counters.remove(key);
  };

  /// Current rate-limit status for a key: count of in-window requests and
  /// ms until the window resets (oldest timestamp expires). For observability.
  public type RateLimitStatus = {
    count          : Nat;
    retryAfterMs   : Int;
  };

  public func getStatus(state : State, key : Text, windowMs : Int) : RateLimitStatus {
    let now : Int = Time.now();
    let cutoff : Int = now - (windowMs * NS_PER_MS);
    let m = state.counters;
    let pruned = switch (m.get(key)) {
      case (?list) pruneOld(list, cutoff);
      case (null) List.empty<Int>();
    };
    let retryAfterMs : Int = switch (pruned.first()) {
      case (?oldest) {
        let r : Int = (oldest + (windowMs * NS_PER_MS)) - now;
        if (r <= 0) 0 else r / NS_PER_MS;
      };
      case (null) 0;
    };
    { count = pruned.size(); retryAfterMs };
  };

};
