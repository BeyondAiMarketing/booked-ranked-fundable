module {

  /// Which AI task is being performed — drives model selection.
  public type TaskType = {
    #EmailGeneration;
    #ProposalWriting;
    #ReviewResponse;
    #RAGAnswer;
    #Summarization;
    #OutreachCopy;
    #FollowUpDraft;
    #MorningDigest;
  };

  /// Persisted configuration for the OpenRouter integration.
  public type OpenRouterConfig = {
    apiKey              : Text;
    defaultModel        : Text; // "openrouter/owl-alpha"
    taskModelOverrides  : [(Text, Text)]; // [(taskName, modelId)]
    lastPingTime        : ?Int;
    isConnected         : Bool;
  };

  /// A single message in a chat completion request.
  public type OpenRouterMessage = {
    role    : Text; // "system" | "user" | "assistant"
    content : Text;
  };

  /// Request payload sent to OpenRouter.
  public type OpenRouterRequest = {
    model    : Text;
    messages : [OpenRouterMessage];
    stream   : Bool;
  };

  /// Simplified response returned from OpenRouter.
  public type OpenRouterResponse = {
    content : Text;
    model   : Text;
  };

};
