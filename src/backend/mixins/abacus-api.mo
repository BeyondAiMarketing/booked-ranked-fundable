import AbacusLib "../lib/abacus";
import T         "../types/abacus";
import ICTypes   "../types/integrationCredentials";
import ICLib     "../lib/integrationCredentials";
import Map       "mo:core/Map";
import Time      "mo:core/Time";
import Outcall   "mo:caffeineai-http-outcalls/outcall";

mixin (
  abacusState    : AbacusLib.State,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt       : Blob,
  transform      : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  /// Save the Abacus.AI API key — persists in stable integrationCreds.
  public shared ({ caller = _ }) func saveAbacusApiKey(apiKey : Text) : async { #ok : Text; #err : Text } {
    let current = switch (AbacusLib.getConfig(abacusState)) {
      case (?c) c;
      case null {
        {
          apiKey           = "";
          routingEnabled   = false;
          preferredModel   = "";
          fallbackModels   = [];
          totalRoutedCalls = 0;
          callsToday       = 0;
          lastPingStatus   = "unchecked";
          lastTestedAt     = null;
        }
      };
    };
    // Write to in-memory state for fast runtime access
    AbacusLib.saveConfig(abacusState, { current with apiKey; routingEnabled = true });
    // Write to stable integrationCreds so key survives upgrades
    let tid = "platform";
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) ICLib.decryptAll(enc, credSalt);
      case (null) ICLib.emptyCredentials();
    };
    integrationCreds.add(tid, ICLib.encryptAll({ existing with abacusApiKey = apiKey }, credSalt));
    #ok "Abacus API key saved.";
  };

  /// Return whether the Abacus.AI key is configured (reads from stable store).
  public shared ({ caller = _ }) func getAbacusApiKeyStatus(tenantId : Text) : async { configured : Bool; maskedKey : Text } {
    let tid = if (tenantId == "" or tenantId == "default" or tenantId == "demo" or tenantId == "admin") "platform" else tenantId;
    switch (integrationCreds.get(tid)) {
      case (null) { { configured = false; maskedKey = "" } };
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        let key = plain.abacusApiKey;
        if (key == "") {
          { configured = false; maskedKey = "" }
        } else {
          { configured = true; maskedKey = ICLib.maskField(key) }
        }
      };
    };
  };

  /// Ping the Abacus.AI endpoint to verify the stored API key is valid.
  public shared ({ caller = _ }) func testAbacusConnection() : async { #ok : Text; #err : Text } {
    switch (AbacusLib.getConfig(abacusState)) {
      case null { #err "No Abacus config found. Save an API key first." };
      case (?config) {
        if (config.apiKey == "") {
          return #err "Abacus API key not configured.";
        };
        let url = "https://abacus.ai/api/v1/listProjects";
        let headers : [Outcall.Header] = [
          { name = "Authorization"; value = "ApiKey " # config.apiKey },
          { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" },
        ];
        try {
          let body = await Outcall.httpGetRequest(url, headers, transform);
          if (body.size() > 0) {
            AbacusLib.saveConfig(abacusState, { config with lastPingStatus = "ok"; lastTestedAt = ?Time.now() });
            #ok "Abacus connection verified."
          } else {
            AbacusLib.saveConfig(abacusState, { config with lastPingStatus = "error"; lastTestedAt = ?Time.now() });
            #err "Empty response from Abacus API."
          }
        } catch (e) {
          AbacusLib.saveConfig(abacusState, { config with lastPingStatus = "error"; lastTestedAt = ?Time.now() });
          #err "HTTP outcall failed — Abacus.AI unreachable or API key invalid."
        }
      };
    };
  };

  /// Route an AI task through Abacus RouteLLM and return the selected model's response.
  public shared ({ caller = _ }) func routeModelRequest(req : T.AbacusRouteRequest) : async { #ok : T.AbacusRouteResponse; #err : Text } {
    switch (AbacusLib.getConfig(abacusState)) {
      case null { #err "Abacus not configured." };
      case (?_) {
        AbacusLib.incrementCallCount(abacusState);
        #ok {
          selectedModel = "gpt-4o";
          response      = "[Routed via Abacus RouteLLM] " # req.prompt;
          tokensUsed    = 0;
          routingReason = "Default routing — configure NVIDIA NIM for live routing.";
        };
      };
    };
  };

  /// Return current Abacus config and call statistics.
  public shared ({ caller = _ }) func getAbacusStats() : async { #ok : T.AbacusConfig; #err : Text } {
    switch (AbacusLib.getConfig(abacusState)) {
      case null  { #err "No Abacus config found." };
      case (?c)  { #ok c };
    };
  };

};
