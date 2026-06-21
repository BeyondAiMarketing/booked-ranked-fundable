import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";

import FundingProfileTypes "../types/fundingProfile";

module FundingProfileLib {
  public type State = {
    profiles : Map.Map<Text, FundingProfileTypes.FundingProfile>;
    documents : Map.Map<Text, FundingProfileTypes.FundingDocument>;
    snapshots : Map.Map<Text, FundingProfileTypes.FundingReadinessSnapshot>;
    var nextId : Nat;
  };

  public func emptyState() : State {
    {
      profiles = Map.empty<Text, FundingProfileTypes.FundingProfile>();
      documents = Map.empty<Text, FundingProfileTypes.FundingDocument>();
      snapshots = Map.empty<Text, FundingProfileTypes.FundingReadinessSnapshot>();
      var nextId = 0;
    };
  };

  public func generateId(state : State) : Text {
    state.nextId += 1;
    "fp-" # Nat.toText(state.nextId);
  };

  public func generateDocId(state : State) : Text {
    state.nextId += 1;
    "fd-" # Nat.toText(state.nextId);
  };

  public func generateSnapshotId(state : State) : Text {
    state.nextId += 1;
    "fs-" # Nat.toText(state.nextId);
  };

  public func createProfile(
    state : State,
    req : FundingProfileTypes.CreateFundingProfileRequest,
  ) : FundingProfileTypes.FundingProfileResult {
    let id = generateId(state);
    let now = Time.now();
    let profile : FundingProfileTypes.FundingProfile = {
      id = id;
      clientBusinessId = req.clientBusinessId;
      legalBusinessName = req.legalBusinessName;
      ein = req.ein;
      entityType = req.entityType;
      yearsInBusiness = req.yearsInBusiness;
      monthlyRevenue = req.monthlyRevenue;
      bankStatementsAvailable = req.bankStatementsAvailable;
      creditScoreRange = req.creditScoreRange;
      businessBankAccount = req.businessBankAccount;
      businessAddress = req.businessAddress;
      website = req.website;
      emailDomain = req.emailDomain;
      dunsStatus = req.dunsStatus;
      experianBusinessStatus = req.experianBusinessStatus;
      equifaxBusinessStatus = req.equifaxBusinessStatus;
      tradeLines = req.tradeLines;
      existingDebt = req.existingDebt;
      equipmentNeeds = req.equipmentNeeds;
      marketingCapitalNeed = req.marketingCapitalNeed;
      taxReturnsAvailable = req.taxReturnsAvailable;
      documentsUploaded = [];
      industrySpecificFundingNeeds = req.industrySpecificFundingNeeds;
      readinessScore = null;
      status = "draft";
      createdAt = now;
      updatedAt = now;
    };
    state.profiles.add(id, profile);
    #ok(profile);
  };

  public func getProfile(
    state : State,
    id : Text,
  ) : FundingProfileTypes.FundingProfileResult {
    switch (state.profiles.get(id)) {
      case (?profile) { #ok(profile) };
      case (null) { #err("Funding profile not found") };
    };
  };

  public func getProfileByClientBusinessId(
    state : State,
    clientBusinessId : Text,
  ) : FundingProfileTypes.FundingProfileResult {
    for ((_, profile) in state.profiles.entries()) {
      if (profile.clientBusinessId == clientBusinessId) {
        return #ok(profile);
      };
    };
    #err("Funding profile not found for client business");
  };

  public func updateProfile(
    state : State,
    id : Text,
    req : FundingProfileTypes.UpdateFundingProfileRequest,
  ) : FundingProfileTypes.FundingProfileResult {
    switch (state.profiles.get(id)) {
      case (?existing) {
        let updated : FundingProfileTypes.FundingProfile = {
          id = existing.id;
          clientBusinessId = existing.clientBusinessId;
          legalBusinessName = switch (req.legalBusinessName) { case (?v) v; case (null) existing.legalBusinessName };
          ein = switch (req.ein) { case (?v) ?v; case (null) existing.ein };
          entityType = switch (req.entityType) { case (?v) ?v; case (null) existing.entityType };
          yearsInBusiness = switch (req.yearsInBusiness) { case (?v) ?v; case (null) existing.yearsInBusiness };
          monthlyRevenue = switch (req.monthlyRevenue) { case (?v) ?v; case (null) existing.monthlyRevenue };
          bankStatementsAvailable = switch (req.bankStatementsAvailable) { case (?v) v; case (null) existing.bankStatementsAvailable };
          creditScoreRange = switch (req.creditScoreRange) { case (?v) ?v; case (null) existing.creditScoreRange };
          businessBankAccount = switch (req.businessBankAccount) { case (?v) v; case (null) existing.businessBankAccount };
          businessAddress = switch (req.businessAddress) { case (?v) ?v; case (null) existing.businessAddress };
          website = switch (req.website) { case (?v) ?v; case (null) existing.website };
          emailDomain = switch (req.emailDomain) { case (?v) ?v; case (null) existing.emailDomain };
          dunsStatus = switch (req.dunsStatus) { case (?v) ?v; case (null) existing.dunsStatus };
          experianBusinessStatus = switch (req.experianBusinessStatus) { case (?v) ?v; case (null) existing.experianBusinessStatus };
          equifaxBusinessStatus = switch (req.equifaxBusinessStatus) { case (?v) ?v; case (null) existing.equifaxBusinessStatus };
          tradeLines = switch (req.tradeLines) { case (?v) ?v; case (null) existing.tradeLines };
          existingDebt = switch (req.existingDebt) { case (?v) ?v; case (null) existing.existingDebt };
          equipmentNeeds = switch (req.equipmentNeeds) { case (?v) ?v; case (null) existing.equipmentNeeds };
          marketingCapitalNeed = switch (req.marketingCapitalNeed) { case (?v) ?v; case (null) existing.marketingCapitalNeed };
          taxReturnsAvailable = switch (req.taxReturnsAvailable) { case (?v) v; case (null) existing.taxReturnsAvailable };
          documentsUploaded = existing.documentsUploaded;
          industrySpecificFundingNeeds = switch (req.industrySpecificFundingNeeds) { case (?v) ?v; case (null) existing.industrySpecificFundingNeeds };
          readinessScore = existing.readinessScore;
          status = existing.status;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        state.profiles.add(id, updated);
        #ok(updated);
      };
      case (null) { #err("Funding profile not found") };
    };
  };

  public func deleteProfile(
    state : State,
    id : Text,
  ) : FundingProfileTypes.FundingProfileResult {
    switch (state.profiles.get(id)) {
      case (?profile) {
        ignore state.profiles.remove(id);
        #ok(profile);
      };
      case (null) { #err("Funding profile not found") };
    };
  };

  public func listProfiles(
    state : State,
  ) : [FundingProfileTypes.FundingProfile] {
    let buffer = List.empty<FundingProfileTypes.FundingProfile>();
    for ((_, profile) in state.profiles.entries()) {
      buffer.add(profile);
    };
    buffer.toArray();
  };

  public func addDocument(
    state : State,
    profileId : Text,
    documentType : Text,
    documentName : Text,
    documentUrl : ?Text,
  ) : FundingProfileTypes.FundingDocumentResult {
    let id = generateDocId(state);
    let doc : FundingProfileTypes.FundingDocument = {
      id = id;
      profileId = profileId;
      documentType = documentType;
      documentName = documentName;
      documentUrl = documentUrl;
      status = "uploaded";
      uploadedAt = Time.now();
    };
    state.documents.add(id, doc);
    #ok(doc);
  };

  public func createSnapshot(
    state : State,
    profileId : Text,
    overallScore : Nat,
    creditScore : Nat,
    revenueScore : Nat,
    documentationScore : Nat,
    businessAgeScore : Nat,
    recommendations : [Text],
  ) : FundingProfileTypes.FundingReadinessSnapshotResult {
    let id = generateSnapshotId(state);
    let snapshot : FundingProfileTypes.FundingReadinessSnapshot = {
      id = id;
      profileId = profileId;
      snapshotDate = Time.now();
      overallScore = overallScore;
      creditScore = creditScore;
      revenueScore = revenueScore;
      documentationScore = documentationScore;
      businessAgeScore = businessAgeScore;
      recommendations = recommendations;
    };
    state.snapshots.add(id, snapshot);
    #ok(snapshot);
  };

  public func getSnapshotsForProfile(
    state : State,
    profileId : Text,
  ) : [FundingProfileTypes.FundingReadinessSnapshot] {
    let buffer = List.empty<FundingProfileTypes.FundingReadinessSnapshot>();
    for ((_, snapshot) in state.snapshots.entries()) {
      if (snapshot.profileId == profileId) {
        buffer.add(snapshot);
      };
    };
    buffer.toArray();
  };
}
