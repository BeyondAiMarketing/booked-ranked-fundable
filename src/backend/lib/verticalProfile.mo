import Map   "mo:core/Map";
import Time  "mo:core/Time";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import Array "mo:core/Array";
import T    "../types/verticalProfile";

module {

  public type State = {
    profiles : Map.Map<Text, T.VerticalProfileExt>;
  };

  public func emptyState() : State = {
    profiles = Map.empty();
  };

  /// Persist or replace a vertical profile.
  public func saveProfile(state : State, profile : T.VerticalProfileExt) : () {
    state.profiles.add(profile.id, profile);
  };

  /// Retrieve a vertical profile by id.
  public func getProfile(state : State, id : Text) : ?T.VerticalProfileExt {
    state.profiles.get(id);
  };

  /// Get the profile for a tenant (returns first match, or null).
  public func getProfileByTenant(state : State, tenantId : Text) : ?T.VerticalProfileExt {
    for (p in state.profiles.values()) {
      if (p.tenantId == tenantId) { return ?p };
    };
    null;
  };

  /// Merge a partial update into an existing profile.
  public func updateProfile(state : State, id : Text, update : T.VerticalProfileUpdate) : Bool {
    switch (state.profiles.get(id)) {
      case (?existing) {
        let updated : T.VerticalProfileExt = {
          existing with
          niche                   = switch (update.niche)                   { case (?v) v; case null existing.niche                   };
          category                = switch (update.category)                { case (?v) v; case null existing.category                };
          subNiches               = switch (update.subNiches)               { case (?v) v; case null existing.subNiches               };
          services                = switch (update.services)                { case (?v) v; case null existing.services                };
          commonLeadTypes         = switch (update.commonLeadTypes)         { case (?v) v; case null existing.commonLeadTypes         };
          targetAudience          = switch (update.targetAudience)          { case (?v) v; case null existing.targetAudience          };
          positioning             = switch (update.positioning)             { case (?v) v; case null existing.positioning             };
          differentiators         = switch (update.differentiators)         { case (?v) v; case null existing.differentiators         };
          brandVoice              = switch (update.brandVoice)              { case (?v) v; case null existing.brandVoice              };
          doRules                 = switch (update.doRules)                 { case (?v) v; case null existing.doRules                 };
          doNotRules              = switch (update.doNotRules)              { case (?v) v; case null existing.doNotRules              };
          competitors             = switch (update.competitors)             { case (?v) v; case null existing.competitors             };
          serviceArea             = switch (update.serviceArea)             { case (?v) v; case null existing.serviceArea             };
          keywords                = switch (update.keywords)                { case (?v) v; case null existing.keywords                };
          contentPillars          = switch (update.contentPillars)          { case (?v) v; case null existing.contentPillars          };
          localSEOKeywordPatterns = switch (update.localSEOKeywordPatterns) { case (?v) v; case null existing.localSEOKeywordPatterns };
          commonGBPPostTypes      = switch (update.commonGBPPostTypes)      { case (?v) v; case null existing.commonGBPPostTypes      };
          commonReviewThemes      = switch (update.commonReviewThemes)      { case (?v) v; case null existing.commonReviewThemes      };
          complianceNotes         = switch (update.complianceNotes)         { case (?v) v; case null existing.complianceNotes         };
          defaultPipelineLabels   = switch (update.defaultPipelineLabels)   { case (?v) v; case null existing.defaultPipelineLabels   };
          commonOffers            = switch (update.commonOffers)            { case (?v) v; case null existing.commonOffers            };
          commonCampaignTypes     = switch (update.commonCampaignTypes)     { case (?v) v; case null existing.commonCampaignTypes     };
          fundingNeeds            = switch (update.fundingNeeds)             { case (?v) v; case null existing.fundingNeeds            };
          emailTone               = switch (update.emailTone)               { case (?v) v; case null existing.emailTone              };
          smsTone                 = switch (update.smsTone)                 { case (?v) v; case null existing.smsTone                };
          prohibitedClaims        = switch (update.prohibitedClaims)        { case (?v) v; case null existing.prohibitedClaims       };
          recommendedDisclaimers  = switch (update.recommendedDisclaimers)  { case (?v) v; case null existing.recommendedDisclaimers  };
          exampleContentAngles    = switch (update.exampleContentAngles)    { case (?v) v; case null existing.exampleContentAngles    };
          exampleEmailTemplates   = switch (update.exampleEmailTemplates)   { case (?v) v; case null existing.exampleEmailTemplates   };
          exampleSMSFollowUps     = switch (update.exampleSMSFollowUps)     { case (?v) v; case null existing.exampleSMSFollowUps    };
          proposalDeliverables    = switch (update.proposalDeliverables)    { case (?v) v; case null existing.proposalDeliverables    };
          leadFormFields          = switch (update.leadFormFields)          { case (?v) v; case null existing.leadFormFields          };
          updatedAt               = Int.abs(Time.now());
        };
        state.profiles.add(id, updated);
        true;
      };
      case null false;
    };
  };

  /// Remove a vertical profile.
  public func removeProfile(state : State, id : Text) : Bool {
    switch (state.profiles.get(id)) {
      case (?_) { state.profiles.remove(id); true };
      case null false;
    };
  };

  /// List all vertical profiles.
  public func listAll(state : State) : [T.VerticalProfileExt] {
    let arr = state.profiles.toArray();
    Array.tabulate(arr.size(), func (n : Nat) : T.VerticalProfileExt { arr[n].1 });
  };

  /// List vertical profiles filtered by category.
  public func listByCategory(state : State, category : Text) : [T.VerticalProfileExt] {
    let arr = state.profiles.toArray();
    var count : Nat = 0;
    for ((_, p) in arr.vals()) {
      if (p.category == category) { count += 1 };
    };
    var i : Nat = 0;
    var j : Nat = 0;
    Array.tabulate(count, func (n : Nat) : T.VerticalProfileExt {
      while (i < arr.size()) {
        let (_, p) = arr[i];
        i += 1;
        if (p.category == category) {
          j += 1;
          return p;
        };
      };
      { id = ""; tenantId = ""; niche = ""; category = ""; commonServices = [] : [Text]; subNiches = [] : [Text]; services = [] : [Text]; commonLeadTypes = [] : [Text]; targetAudience = ""; positioning = ""; differentiators = [] : [Text]; brandVoice = ""; doRules = [] : [Text]; doNotRules = [] : [Text]; competitors = [] : [Text]; serviceArea = [] : [Text]; keywords = [] : [Text]; contentPillars = [] : [Text]; localSEOKeywordPatterns = [] : [Text]; commonGBPPostTypes = [] : [Text]; commonReviewThemes = [] : [Text]; complianceNotes = ""; defaultPipelineLabels = [] : [Text]; commonOffers = [] : [Text]; commonCampaignTypes = [] : [Text]; fundingNeeds = [] : [Text]; emailTone = ""; smsTone = ""; prohibitedClaims = [] : [Text]; recommendedDisclaimers = [] : [Text]; exampleContentAngles = [] : [Text]; exampleEmailTemplates = [] : [Text]; exampleSMSFollowUps = [] : [Text]; proposalDeliverables = [] : [Text]; leadFormFields = [] : [Text]; createdAt = 0; updatedAt = 0 }
    });
  };

  /// Seed multiple profiles into state (skips existing ids).
  public func seedProfiles(state : State, profiles : [T.VerticalProfileExt]) : Nat {
    var count : Nat = 0;
    for (p in profiles.values()) {
      switch (state.profiles.get(p.id)) {
        case null { state.profiles.add(p.id, p); count += 1 };
        case (?_) {};
      };
    };
    count;
  };

};
