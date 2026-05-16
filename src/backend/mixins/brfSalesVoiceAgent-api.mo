import List   "mo:core/List";
import Time   "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import T   "../types/brfSalesVoiceAgent";
import Lib "../lib/brfSalesVoiceAgent";

mixin (
  accessControlState      : AccessControl.AccessControlState,
  brfVoiceAgentConfig     : { var v : ?T.BrfVoiceAgentConfig },
  brfOutboundCallAttempts : List.List<T.BrfOutboundCallAttempt>,
  brfCallIdCounter        : { var n : Nat },
) {

  // ── Internal helpers ───────────────────────────────────────────────────────

  func assertBrfAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  func currentConfig() : T.BrfVoiceAgentConfig {
    switch (brfVoiceAgentConfig.v) {
      case (?c) c;
      case (null) Lib.defaultConfig();
    }
  };

  // ── Config management ──────────────────────────────────────────────────────

  /// Upsert the platform-level BRF voice agent configuration.
  /// Admin-only. inbound and outbound agents are independently toggled.
  public shared ({ caller }) func upsertBrfVoiceAgentConfig(
    config : T.BrfVoiceAgentConfig
  ) : async { #ok : T.BrfVoiceAgentConfig; #err : Text } {
    assertBrfAdmin(caller);
    brfVoiceAgentConfig.v := ?config;
    #ok config
  };

  /// Retrieve the current BRF voice agent configuration.
  /// Returns null if not yet configured.
  public query ({ caller }) func getBrfVoiceAgentConfig() : async ?T.BrfVoiceAgentConfig {
    assertBrfAdmin(caller);
    brfVoiceAgentConfig.v
  };

  // ── Outbound call scheduling ───────────────────────────────────────────────

  /// Schedule an outbound call attempt for a brand-kit prospect.
  /// Creates attempt #1 with status #Pending.
  /// Returns an error if outbound is disabled or prospect slug is empty.
  public shared ({ caller }) func scheduleBrfOutboundCall(
    prospectSlug : Text
  ) : async { #ok : T.BrfOutboundCallAttempt; #err : Text } {
    assertBrfAdmin(caller);
    let cfg = currentConfig();
    if (not cfg.outboundEnabled) {
      return #err "Outbound agent disabled"
    };
    if (prospectSlug == "") {
      return #err "Prospect slug required"
    };
    brfCallIdCounter.n += 1;
    let id = Lib.genId("brfcall", brfCallIdCounter.n);
    let attempt = Lib.newCallAttempt(id, prospectSlug, 1);
    brfOutboundCallAttempts.add(attempt);
    #ok attempt
  };

  /// Record the result of an outbound call attempt.
  /// - If #Connected: marks attempt as connected.
  /// - If #NoAnswer or #Failed and attempts remain: creates a retry attempt.
  /// - If all attempts exhausted: marks the final attempt with #SmsFallbackSent
  ///   and records smsFallbackSentAt.
  public shared ({ caller }) func recordBrfCallAttemptResult(
    id       : Text,
    status   : { #Connected; #NoAnswer; #Failed },
    vapiCallId : ?Text,
  ) : async { #ok; #err : Text } {
    assertBrfAdmin(caller);
    let cfg = currentConfig();

    // Find the attempt
    let attemptOpt = brfOutboundCallAttempts.find(func (a : T.BrfOutboundCallAttempt) : Bool {
      a.id == id
    });
    switch (attemptOpt) {
      case (null) { #err "Call attempt not found" };
      case (?attempt) {
        let newCallStatus : T.BrfCallStatus = switch (status) {
          case (#Connected) #Connected;
          case (#NoAnswer)  #NoAnswer;
          case (#Failed)    #Failed;
        };
        // Update this attempt
        brfOutboundCallAttempts.mapInPlace(func (a : T.BrfOutboundCallAttempt) : T.BrfOutboundCallAttempt {
          if (a.id == id) {
            { a with callStatus = newCallStatus; vapiCallId }
          } else { a }
        });

        // If not connected and retries remain, schedule a retry
        switch (status) {
          case (#Connected) {}; // no retry needed
          case (#NoAnswer or #Failed) {
            if (attempt.attemptNumber < cfg.maxOutboundAttempts) {
              // Create next attempt
              brfCallIdCounter.n += 1;
              let retryId = Lib.genId("brfcall", brfCallIdCounter.n);
              // Note: retryDelayMinutes scheduling is handled by the frontend/timer layer;
              // we record the attempt here so it can be dispatched by the caller.
              let retryAttempt = Lib.newCallAttempt(retryId, attempt.prospectSlug, attempt.attemptNumber + 1);
              brfOutboundCallAttempts.add(retryAttempt);
            } else {
              // All attempts exhausted — mark SMS fallback on the final attempt
              let now = Time.now();
              brfOutboundCallAttempts.mapInPlace(func (a : T.BrfOutboundCallAttempt) : T.BrfOutboundCallAttempt {
                if (a.id == id) {
                  { a with callStatus = #SmsFallbackSent; smsFallbackSentAt = ?now }
                } else { a }
              });
            };
          };
        };
        #ok
      };
    }
  };

  /// Mark a call attempt as converted to a trial.
  public shared ({ caller }) func markBrfCallConverted(id : Text) : async { #ok; #err : Text } {
    assertBrfAdmin(caller);
    let found = brfOutboundCallAttempts.find(func (a : T.BrfOutboundCallAttempt) : Bool { a.id == id });
    switch (found) {
      case (null) { #err "Call attempt not found" };
      case (?_) {
        brfOutboundCallAttempts.mapInPlace(func (a : T.BrfOutboundCallAttempt) : T.BrfOutboundCallAttempt {
          if (a.id == id) { { a with convertedToTrial = true } } else { a }
        });
        #ok
      };
    }
  };

  // ── Admin read endpoints ───────────────────────────────────────────────────

  /// Return the most recent N outbound call attempts (across all prospects).
  public query ({ caller }) func getBrfOutboundCallAttempts(limit : Nat) : async [T.BrfOutboundCallAttempt] {
    assertBrfAdmin(caller);
    let total = brfOutboundCallAttempts.size();
    if (limit == 0 or total == 0) { return [] };
    let start : Int = if (total > limit) { total - limit } else { 0 };
    brfOutboundCallAttempts.sliceToArray(start, total)
  };

  /// Return all outbound call attempts for a specific prospect slug.
  public query ({ caller }) func getBrfCallAttemptsByProspect(prospectSlug : Text) : async [T.BrfOutboundCallAttempt] {
    assertBrfAdmin(caller);
    brfOutboundCallAttempts.filter(func (a : T.BrfOutboundCallAttempt) : Bool {
      a.prospectSlug == prospectSlug
    }).toArray()
  };

  /// Aggregate conversion stats for the admin dashboard.
  public query ({ caller }) func getBrfCallConversionStats() : async T.BrfCallConversionStats {
    assertBrfAdmin(caller);
    Lib.computeStats(brfOutboundCallAttempts.toArray())
  };

};
