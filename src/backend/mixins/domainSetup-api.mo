import Map         "mo:core/Map";
import List        "mo:core/List";
import Principal   "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import DSTypes     "../types/domainSetup";
import DSLib       "../lib/domainSetup";

mixin (
  accessControlState : AccessControl.AccessControlState,
  domainSetupStore   : Map.Map<Text, DSTypes.DomainSetupState>,
  auditReportStore   : List.List<DSTypes.DemoAuditReport>,
) {

  // ── Auth helpers ────────────────────────────────────────────────────────────

  func isDomainSetupAuthenticated(caller : Principal) : Bool {
    not caller.isAnonymous()
  };

  func isAdminOrSuperAdmin(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller)
  };

  // ── Domain Setup State ──────────────────────────────────────────────────────

  /// Persist a domain-setup wizard state for a client.
  /// Requires authenticated admin or super-admin.
  public shared ({ caller }) func saveDomainSetupState(
    clientId : Text,
    state    : DSTypes.DomainSetupState,
  ) : async { #ok; #err : Text } {
    if (not isDomainSetupAuthenticated(caller)) {
      return #err "Unauthorized: anonymous principals cannot save domain setup state";
    };
    if (not isAdminOrSuperAdmin(caller)) {
      return #err "Unauthorized: admin access required to save domain setup state";
    };
    DSLib.saveDomainSetupState(domainSetupStore, clientId, state);
  };

  /// Retrieve the domain-setup wizard state for a client.
  /// Requires authenticated admin or super-admin.
  public query ({ caller }) func getDomainSetupState(
    clientId : Text,
  ) : async { #ok : ?DSTypes.DomainSetupState; #err : Text } {
    if (not isDomainSetupAuthenticated(caller)) {
      return #err "Unauthorized: anonymous principals cannot read domain setup state";
    };
    if (not isAdminOrSuperAdmin(caller)) {
      return #err "Unauthorized: admin access required to read domain setup state";
    };
    #ok (DSLib.getDomainSetupState(domainSetupStore, clientId));
  };

  // ── Demo Audit Reports ──────────────────────────────────────────────────────

  /// Append a personalized demo audit report.
  /// Requires authenticated admin or super-admin.
  public shared ({ caller }) func saveDemoAuditReport(
    report : DSTypes.DemoAuditReport,
  ) : async { #ok; #err : Text } {
    if (not isDomainSetupAuthenticated(caller)) {
      return #err "Unauthorized: anonymous principals cannot save audit reports";
    };
    if (not isAdminOrSuperAdmin(caller)) {
      return #err "Unauthorized: admin access required to save audit reports";
    };
    DSLib.saveDemoAuditReport(auditReportStore, report);
  };

  /// Return all stored demo audit reports.
  /// Requires authenticated admin or super-admin.
  public query ({ caller }) func getDemoAuditReports() : async { #ok : [DSTypes.DemoAuditReport]; #err : Text } {
    if (not isDomainSetupAuthenticated(caller)) {
      return #err "Unauthorized: anonymous principals cannot read audit reports";
    };
    if (not isAdminOrSuperAdmin(caller)) {
      return #err "Unauthorized: admin access required to read audit reports";
    };
    #ok (DSLib.getDemoAuditReports(auditReportStore));
  };

};
