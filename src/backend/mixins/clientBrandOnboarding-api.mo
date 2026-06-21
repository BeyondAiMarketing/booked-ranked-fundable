import Types "../types/clientBrandOnboarding";
import Lib "../lib/clientBrandOnboarding";

mixin (state : Types.State) {
  public shared func createClientBrandOnboarding(
    clientBusinessId : Text,
    brandVoiceId : Text,
    targetAudience : Text,
    services : Text,
    positioning : Text,
    differentiators : Text,
    brandTone : Text,
    doRules : Text,
    doNotRules : Text,
    assumptions : Text,
    confirmedFacts : Text,
    onboardingStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.ClientBrandOnboarding = {
      id;
      clientBusinessId;
      brandVoiceId;
      targetAudience;
      services;
      positioning;
      differentiators;
      brandTone;
      doRules;
      doNotRules;
      assumptions;
      confirmedFacts;
      onboardingStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getClientBrandOnboarding(id : Text) : async { #ok : ?Types.ClientBrandOnboarding; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateClientBrandOnboarding(
    id : Text,
    clientBusinessId : Text,
    brandVoiceId : Text,
    targetAudience : Text,
    services : Text,
    positioning : Text,
    differentiators : Text,
    brandTone : Text,
    doRules : Text,
    doNotRules : Text,
    assumptions : Text,
    confirmedFacts : Text,
    onboardingStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.ClientBrandOnboarding = {
      id;
      clientBusinessId;
      brandVoiceId;
      targetAudience;
      services;
      positioning;
      differentiators;
      brandTone;
      doRules;
      doNotRules;
      assumptions;
      confirmedFacts;
      onboardingStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteClientBrandOnboarding(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listClientBrandOnboardingsByClient(clientBusinessId : Text) : async { #ok : [Types.ClientBrandOnboarding]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
