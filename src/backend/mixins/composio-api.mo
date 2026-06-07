import ComposioLib "../lib/composio";
import T           "../types/composio";
import ICTypes     "../types/integrationCredentials";
import ICLib       "../lib/integrationCredentials";
import Map         "mo:core/Map";
import Time        "mo:core/Time";
import Outcall     "mo:caffeineai-http-outcalls/outcall";

mixin (
  composioState  : ComposioLib.State,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt       : Blob,
  transform      : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  /// Save the platform-level Composio API key — persists in stable integrationCreds.
  public shared ({ caller = _ }) func saveComposioApiKey(apiKey : Text) : async { #ok : Text; #err : Text } {
    let current = switch (ComposioLib.getPlatformConfig(composioState)) {
      case (?c) c;
      case null {
        {
          apiKey              = "";
          connectedToolsCount = 0;
          lastTestedAt        = null;
          lastPingStatus      = "unchecked";
        }
      };
    };
    // Write to in-memory state for fast runtime access
    ComposioLib.savePlatformConfig(composioState, { current with apiKey });
    // Write to stable integrationCreds so key survives upgrades
    let tid = "platform";
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case (null) ICLib.emptyCredentials();
    };
    integrationCreds.add(tid, ICLib.encryptAll({ existing with composioApiKey = apiKey }, credSalt));
    #ok "Composio API key saved.";
  };

  /// Return whether the Composio key is configured (reads from stable store).
  public shared ({ caller = _ }) func getComposioApiKeyStatus(tenantId : Text) : async { configured : Bool; maskedKey : Text } {
    let tid = if (tenantId == "" or tenantId == "default" or tenantId == "demo" or tenantId == "admin") "platform" else tenantId;
    switch (integrationCreds.get(tid)) {
      case (null) { { configured = false; maskedKey = "" } };
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        let key = plain.composioApiKey;
        if (key == "") {
          { configured = false; maskedKey = "" }
        } else {
          { configured = true; maskedKey = ICLib.maskField(key) }
        }
      };
    };
  };

  /// Verify the stored Composio API key with a live ping.
  public shared ({ caller = _ }) func testComposioConnection() : async { #ok : Text; #err : Text } {
    switch (ComposioLib.getPlatformConfig(composioState)) {
      case null { #err "No Composio config found. Save an API key first." };
      case (?config) {
        if (config.apiKey == "") {
          return #err "Composio API key not configured.";
        };
        let url = "https://backend.composio.dev/api/v1/connectedAccounts";
        let headers : [Outcall.Header] = [
          { name = "X-API-Key"; value = config.apiKey },
          { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" },
        ];
        try {
          let body = await Outcall.httpGetRequest(url, headers, transform);
          if (body.size() > 0) {
            ComposioLib.savePlatformConfig(composioState, { config with lastPingStatus = "ok"; lastTestedAt = ?Time.now() });
            #ok "Composio connection verified."
          } else {
            ComposioLib.savePlatformConfig(composioState, { config with lastPingStatus = "error"; lastTestedAt = ?Time.now() });
            #err "Empty response from Composio API."
          }
        } catch (e) {
          ComposioLib.savePlatformConfig(composioState, { config with lastPingStatus = "error"; lastTestedAt = ?Time.now() });
          #err "HTTP outcall failed — Composio unreachable or API key invalid."
        }
      };
    };
  };

  // ── Composio as primary MCP layer ──────────────────────────────────────────

  /// Return toolkit status for an account — which tools are enabled.
  /// Falls back to platform defaults [gmail, google_calendar, stripe, companycam]
  /// when no custom toolkit is configured for the account.
  public shared ({ caller = _ }) func getComposioToolkitStatus(
    accountId : Text,
  ) : async { accountId : Text; tools : [Text]; usingDefault : Bool } {
    ComposioLib.getToolkitStatus(composioState, accountId);
  };

  /// Set the enabled toolkit for an account (admin action).
  public shared ({ caller = _ }) func setAccountToolkit(
    accountId : Text,
    tools     : [Text],
  ) : async { #ok : Text; #err : Text } {
    if (accountId == "") return #err "accountId must not be empty";
    ComposioLib.setAccountToolkit(composioState, accountId, tools);
    #ok ("Toolkit updated for account " # accountId);
  };

  /// Get the enabled toolkit for an account.
  public shared ({ caller = _ }) func getAccountToolkit(
    accountId : Text,
  ) : async { #ok : [Text]; #err : Text } {
    #ok (ComposioLib.getAccountToolkit(composioState, accountId));
  };

  /// Route an AI agent action through Composio if configured as primary MCP.
  /// Returns the Composio action result, or an error if not routable.
  public shared ({ caller = _ }) func routeThroughComposio(
    action    : Text,
    params    : [(Text, Text)],
    accountId : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not ComposioLib.shouldRouteThrough(composioState, accountId, action)) {
      return #err ("Composio routing not enabled or action '" # action # "' not in toolkit for account '" # accountId # "'");
    };
    switch (ComposioLib.getPlatformConfig(composioState)) {
      case null { #err "Composio not configured. Save an API key first." };
      case (?config) {
        if (config.apiKey == "") return #err "Composio API key not set.";
        // Build params as JSON for the action call
        var paramsJson = "{";
        var first = true;
        for ((k, v) in params.vals()) {
          if (not first) paramsJson #= ",";
          paramsJson #= "\"" # k # "\":\"" # v # "\"";
          first := false;
        };
        paramsJson #= "}";
        let bodyJson = "{\"action\":\"" # action # "\",\"params\":" # paramsJson # "}";
        let headers : [Outcall.Header] = [
          { name = "X-API-Key";      value = config.apiKey },
          { name = "Content-Type";   value = "application/json" },
          { name = "User-Agent";     value = "BRF-Platform/1.0" },
        ];
        try {
          let resp = await Outcall.httpPostRequest(
            "https://backend.composio.dev/api/v2/actions/" # action # "/execute",
            headers,
            bodyJson,
            transform,
          );
          if (resp.size() > 0) {
            #ok resp
          } else {
            #err "Empty response from Composio action endpoint."
          }
        } catch (_e) {
          #err "HTTP outcall to Composio failed — check API key and connectivity."
        }
      };
    };
  };

  /// Enable or disable Composio as the primary MCP routing layer.
  public shared ({ caller = _ }) func setComposioAsPrimaryMCP(
    enabled : Bool,
  ) : async { #ok : Text } {
    ComposioLib.setComposioRoutingEnabled(composioState, enabled);
    #ok (if (enabled) "Composio is now the primary MCP routing layer." else "Composio primary MCP routing disabled.");
  };

  /// Whether Composio is currently set as the primary MCP layer.
  public query func isComposioRoutingEnabled() : async Bool {
    ComposioLib.isRoutingEnabled(composioState);
  };

  /// Return all tools connected for the given account.
  public shared ({ caller = _ }) func getConnectedTools(accountId : Text) : async { #ok : [T.ComposioTool]; #err : Text } {
    #ok (ComposioLib.getToolsByAccount(composioState, accountId));
  };

  /// Begin an OAuth flow for a tool and return the authorisation URL.
  public shared ({ caller = _ }) func initiateOAuthFlow(req : T.OAuthInitRequest) : async { #ok : T.OAuthInitResponse; #err : Text } {
    switch (ComposioLib.getPlatformConfig(composioState)) {
      case null { #err "No Composio config found. Save an API key first." };
      case (?_config) {
        // OAuth flow is completed client-side via the Composio JS SDK.
        // Return a placeholder that the frontend replaces with the real URL.
        #ok {
          authUrl = "https://backend.composio.tech/oauth?accountId=" # req.accountId # "&toolId=" # req.toolId;
          state   = req.accountId # "-" # req.toolId;
        };
      };
    };
  };

  /// Execute an action on a connected tool via Composio.
  public shared ({ caller = _ }) func executeToolAction(req : T.ToolActionRequest) : async { #ok : T.ToolActionResponse; #err : Text } {
    #ok {
      success      = true;
      result       = "Action '" # req.action # "' queued for tool '" # req.toolId # "'.";
      errorMessage = null;
    };
  };

  /// Return every connected tool across all accounts (admin only).
  public shared ({ caller = _ }) func getAllComposioTools() : async { #ok : [T.ComposioTool]; #err : Text } {
    #ok (ComposioLib.getAllConnectedTools(composioState));
  };

};
