import Types "../types/reviewManagementAgent";
import Lib "../lib/reviewManagementAgent";

mixin (state : Types.State) {
  public shared func createReviewManagementAgent(
    clientBusinessId : Text,
    verticalProfileId : Text,
    reviewType : Text,
    platform : Text,
    reviewerName : Text,
    reviewText : Text,
    rating : Nat,
    sentiment : Text,
    replyDraft : Text,
    replyStatus : Text,
    reviewVelocity : Nat,
    averageRating : Nat,
    totalReviews : Nat,
    responseRate : Nat,
    escalationFlag : Bool,
    complianceNotes : Text,
    approvalStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.ReviewManagementAgent = {
      id;
      clientBusinessId;
      verticalProfileId;
      reviewType;
      platform;
      reviewerName;
      reviewText;
      rating;
      sentiment;
      replyDraft;
      replyStatus;
      reviewVelocity;
      averageRating;
      totalReviews;
      responseRate;
      escalationFlag;
      complianceNotes;
      approvalStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getReviewManagementAgent(id : Text) : async { #ok : ?Types.ReviewManagementAgent; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateReviewManagementAgent(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    reviewType : Text,
    platform : Text,
    reviewerName : Text,
    reviewText : Text,
    rating : Nat,
    sentiment : Text,
    replyDraft : Text,
    replyStatus : Text,
    reviewVelocity : Nat,
    averageRating : Nat,
    totalReviews : Nat,
    responseRate : Nat,
    escalationFlag : Bool,
    complianceNotes : Text,
    approvalStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.ReviewManagementAgent = {
      id;
      clientBusinessId;
      verticalProfileId;
      reviewType;
      platform;
      reviewerName;
      reviewText;
      rating;
      sentiment;
      replyDraft;
      replyStatus;
      reviewVelocity;
      averageRating;
      totalReviews;
      responseRate;
      escalationFlag;
      complianceNotes;
      approvalStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteReviewManagementAgent(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listReviewManagementAgentsByClient(clientBusinessId : Text) : async { #ok : [Types.ReviewManagementAgent]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
