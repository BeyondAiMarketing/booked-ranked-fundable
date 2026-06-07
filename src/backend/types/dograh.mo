module {
  public type DograhConfig = {
    apiKey : Text;
    baseUrl : Text;
    isEnabled : Bool;
  };

  public type DograhNode = {
    id : Text;
    type_ : Text;
    name : Text;
    prompt : Text;
    transitions : [Text];
  };

  public type DograhAgent = {
    id : Text;
    name : Text;
    description : Text;
    status : Text;
    nodeCount : Nat;
    lastModified : Int;
  };

  public type DograhWorkflow = {
    agentId : Text;
    nodes : [DograhNode];
    webhookUrl : ?Text;
  };

  public type DograhCreateAgentRequest = {
    name : Text;
    description : Text;
    niche : Text;
    nlCommand : Text;
  };

  public type DograhCommandResult = {
    success : Bool;
    agentId : ?Text;
    message : Text;
    nodesCreated : Nat;
  };

  public type DograhTestResult = {
    connected : Bool;
    message : Text;
    agentCount : Nat;
  };

  public type RoofingTemplate = {
    name : Text;
    description : Text;
    nodes : [DograhNode];
    niche : Text;
  };
};
