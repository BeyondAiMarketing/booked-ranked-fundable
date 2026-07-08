import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/domainSetup";

module {

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Returns the current time as an Int (nanoseconds, same unit as Time.now()).
  func now() : Int { Time.now() };

  // ── DomainSetupState ───────────────────────────────────────────────────────

  /// Persist a domain-setup state record for a client.
  /// If an entry for `clientId` already exists its `createdAt` is preserved.
  public func saveDomainSetupState(
    store    : Map.Map<Text, Types.DomainSetupState>,
    clientId : Text,
    incoming : Types.DomainSetupState,
  ) : { #ok; #err : Text } {
    let ts = now();
    let createdAt = switch (store.get(clientId)) {
      case (?existing) { existing.createdAt };
      case (null)       { ts };
    };
    let record : Types.DomainSetupState = {
      incoming with
      clientId;
      createdAt;
      updatedAt = ts;
    };
    store.add(clientId, record);
    // Read-back verification
    switch (store.get(clientId)) {
      case (null) { #err "Persistence verification failed for domain setup state" };
      case (?_)   { #ok };
    };
  };

  /// Retrieve the domain-setup state for a client. Returns null if not found.
  public func getDomainSetupState(
    store    : Map.Map<Text, Types.DomainSetupState>,
    clientId : Text,
  ) : ?Types.DomainSetupState {
    store.get(clientId);
  };

  // ── DemoAuditReport ────────────────────────────────────────────────────────

  /// Append a demo audit report to the list.
  public func saveDemoAuditReport(
    store  : List.List<Types.DemoAuditReport>,
    report : Types.DemoAuditReport,
  ) : { #ok; #err : Text } {
    let stamped : Types.DemoAuditReport = { report with createdAt = now() };
    store.add(stamped);
    #ok;
  };

  /// Return all stored demo audit reports as an immutable array.
  public func getDemoAuditReports(
    store : List.List<Types.DemoAuditReport>,
  ) : [Types.DemoAuditReport] {
    store.toArray();
  };

};
