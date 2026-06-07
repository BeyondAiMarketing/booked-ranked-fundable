module {

  /// Per-provider webhook event log and failure counters.
  public type WebhookState = {
    twilioWebhookLogs   : [{ provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text }];
    vapiWebhookLogs     : [{ provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text }];
    stripeWebhookLogs   : [{ provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text }];
    sendgridWebhookLogs : [{ provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text }];
    composioWebhookLogs : [{ provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text }];
    failedCounts        : [(Text, Nat)];  // (provider, count) — updated on each failed event
  };

  /// Returns an empty WebhookState for initial canister state.
  public func empty() : WebhookState = {
    twilioWebhookLogs   = [];
    vapiWebhookLogs     = [];
    stripeWebhookLogs   = [];
    sendgridWebhookLogs = [];
    composioWebhookLogs = [];
    failedCounts        = [];
  };

};
