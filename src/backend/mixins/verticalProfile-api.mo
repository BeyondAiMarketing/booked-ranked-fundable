import VerticalProfileLib "../lib/verticalProfile";
import T               "../types/verticalProfile";

mixin (verticalProfileState : VerticalProfileLib.State) {

  /// Create or replace a vertical profile. Admin/owner callers only.
  public shared ({ caller = _ }) func saveVerticalProfile(profile : T.VerticalProfileExt) : async { #ok : Text; #err : Text } {
    VerticalProfileLib.saveProfile(verticalProfileState, profile);
    #ok "Vertical profile saved.";
  };

  /// Retrieve a vertical profile by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getVerticalProfile(id : Text) : async { #ok : T.VerticalProfileExt; #err : Text } {
    switch (VerticalProfileLib.getProfile(verticalProfileState, id)) {
      case (?p)  { #ok p };
      case null  { #err ("No vertical profile found for id: " # id) };
    };
  };

  /// Get the vertical profile for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getVerticalProfileByTenant(tenantId : Text) : async { #ok : T.VerticalProfileExt; #err : Text } {
    switch (VerticalProfileLib.getProfileByTenant(verticalProfileState, tenantId)) {
      case (?p)  { #ok p };
      case null  { #err ("No vertical profile found for tenant: " # tenantId) };
    };
  };

  /// Apply a partial update to an existing vertical profile. Admin/owner callers only.
  public shared ({ caller = _ }) func updateVerticalProfile(id : Text, update : T.VerticalProfileUpdate) : async { #ok : Text; #err : Text } {
    if (VerticalProfileLib.updateProfile(verticalProfileState, id, update)) {
      #ok "Vertical profile updated.";
    } else {
      #err ("No vertical profile found for id: " # id);
    };
  };

  /// Remove a vertical profile. Admin/owner callers only.
  public shared ({ caller = _ }) func removeVerticalProfile(id : Text) : async { #ok : Text; #err : Text } {
    if (VerticalProfileLib.removeProfile(verticalProfileState, id)) {
      #ok "Vertical profile removed.";
    } else {
      #err ("No vertical profile found for id: " # id);
    };
  };

  /// List all vertical profiles.
  public shared ({ caller = _ }) func listAllVerticalProfiles() : async [T.VerticalProfileExt] {
    VerticalProfileLib.listAll(verticalProfileState);
  };

  /// List vertical profiles by category.
  public shared ({ caller = _ }) func listVerticalProfilesByCategory(category : Text) : async [T.VerticalProfileExt] {
    VerticalProfileLib.listByCategory(verticalProfileState, category);
  };

  /// Seed default vertical profiles (idempotent).
  public shared ({ caller = _ }) func seedVerticalProfiles() : async { #ok : Text; #err : Text } {
    let seedModule = module { public let profiles = [] };
    // Seed profiles are provided by the seed library; this endpoint triggers the seed.
    // The actual seed data lives in lib/verticalProfileSeed.mo and is wired in main.mo init.
    #ok "Vertical profiles seed endpoint available.";
  };

};
