module {

  /// Platform-level Composio credentials and health state.
  public type ComposioConfig = {
    apiKey             : Text;
    connectedToolsCount : Nat;
    lastTestedAt       : ?Int;
    lastPingStatus     : Text;
  };

  /// A single tool (app integration) connected via Composio.
  public type ComposioTool = {
    id          : Text;
    name        : Text;
    category    : Text;
    description : Text;
    connected   : Bool;
    accountId   : Text;
  };

  /// Request to initiate an OAuth flow for a tool.
  public type OAuthInitRequest = {
    toolId      : Text;
    accountId   : Text;
    redirectUri : Text;
  };

  /// Response with the OAuth authorisation URL and state token.
  public type OAuthInitResponse = {
    authUrl : Text;
    state   : Text;
  };

  /// Request to execute an action on a connected tool.
  public type ToolActionRequest = {
    toolId    : Text;
    accountId : Text;
    action    : Text;
    params    : [(Text, Text)];
  };

  /// Result of a tool action execution.
  public type ToolActionResponse = {
    success      : Bool;
    result       : Text;
    errorMessage : ?Text;
  };

};
