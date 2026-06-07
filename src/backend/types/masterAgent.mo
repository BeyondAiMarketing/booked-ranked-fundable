import Time "mo:core/Time";
import List "mo:core/List";

module {

  public type MessageRole = {
    #User;
    #Assistant;
    #System;
  };

  public type MasterAgentMessage = {
    role      : MessageRole;
    content   : Text;
    timestamp : Int;
  };

  public type MasterAgentSession = {
    sessionId     : Text;
    messages      : [MasterAgentMessage];
    startedAt     : Int;
    lastActiveAt  : Int;
    platformContext : ?Text;
  };

  public type MasterAgentState = {
    sessions        : List.List<MasterAgentSession>;
    activeSessionId : { var value : ?Text };
  };

  public type MasterAgentContextSnapshot = {
    totalAccounts   : Nat;
    totalLeads      : Nat;
    totalCampaigns  : Nat;
    activeTrials    : Nat;
    recentActivity  : [Text];
    timestamp       : Int;
  };

};
