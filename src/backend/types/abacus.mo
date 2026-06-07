module {

  /// Configuration and runtime stats for the Abacus.AI RouteLLM integration.
  public type AbacusConfig = {
    apiKey          : Text;
    routingEnabled  : Bool;
    preferredModel  : Text;
    fallbackModels  : [Text];
    totalRoutedCalls : Nat;
    callsToday       : Nat;
    lastPingStatus   : Text;
    lastTestedAt     : ?Int;
  };

  /// A task routing request sent to Abacus RouteLLM.
  public type AbacusRouteRequest = {
    taskType    : Text;
    prompt      : Text;
    maxTokens   : ?Nat;
    temperature : ?Float;
  };

  /// The response returned after model routing.
  public type AbacusRouteResponse = {
    selectedModel  : Text;
    response       : Text;
    tokensUsed     : Nat;
    routingReason  : Text;
  };

};
