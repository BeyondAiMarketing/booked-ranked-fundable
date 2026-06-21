import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "mo:caffeineai-authorization/access-control";

import FundingProfileTypes "../types/fundingProfile";
import FundingProfileLib "../lib/fundingProfile";

module FundingProfileMixin {
  public func Mixin(state : FundingProfileLib.State) : actor {
    // ---- FUNDING PROFILE CRUD ----

    public shared ({ caller }) func createFundingProfile(
      req : FundingProfileTypes.CreateFundingProfileRequest,
    ) : async FundingProfileTypes.FundingProfileResult {
      FundingProfileLib.createProfile(state, req);
    };

    public shared ({ caller }) func getFundingProfile(
      id : Text,
    ) : async FundingProfileTypes.FundingProfileResult {
      FundingProfileLib.getProfile(state, id);
    };

    public shared ({ caller }) func getFundingProfileByClientBusinessId(
      clientBusinessId : Text,
    ) : async FundingProfileTypes.FundingProfileResult {
      FundingProfileLib.getProfileByClientBusinessId(state, clientBusinessId);
    };

    public shared ({ caller }) func updateFundingProfile(
      id : Text,
      req : FundingProfileTypes.UpdateFundingProfileRequest,
    ) : async FundingProfileTypes.FundingProfileResult {
      FundingProfileLib.updateProfile(state, id, req);
    };

    public shared ({ caller }) func deleteFundingProfile(
      id : Text,
    ) : async FundingProfileTypes.FundingProfileResult {
      FundingProfileLib.deleteProfile(state, id);
    };

    public shared query ({ caller }) func listFundingProfiles() : async FundingProfileTypes.FundingProfileListResult {
      #ok(FundingProfileLib.listProfiles(state));
    };

    // ---- FUNDING DOCUMENTS ----

    public shared ({ caller }) func addFundingDocument(
      profileId : Text,
      documentType : Text,
      documentName : Text,
      documentUrl : ?Text,
    ) : async FundingProfileTypes.FundingDocumentResult {
      FundingProfileLib.addDocument(state, profileId, documentType, documentName, documentUrl);
    };

    // ---- FUNDING READINESS SNAPSHOTS ----

    public shared ({ caller }) func createFundingReadinessSnapshot(
      profileId : Text,
      overallScore : Nat,
      creditScore : Nat,
      revenueScore : Nat,
      documentationScore : Nat,
      businessAgeScore : Nat,
      recommendations : [Text],
    ) : async FundingProfileTypes.FundingReadinessSnapshotResult {
      FundingProfileLib.createSnapshot(state, profileId, overallScore, creditScore, revenueScore, documentationScore, businessAgeScore, recommendations);
    };

    public shared query ({ caller }) func getFundingReadinessSnapshots(
      profileId : Text,
    ) : async [FundingProfileTypes.FundingReadinessSnapshot] {
      FundingProfileLib.getSnapshotsForProfile(state, profileId);
    };
  };
}
