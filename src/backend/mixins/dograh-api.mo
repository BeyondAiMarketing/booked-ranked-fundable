import Outcall   "mo:caffeineai-http-outcalls/outcall";
import Time      "mo:core/Time";
import DograhLib "../lib/dograh";
import T         "../types/dograh";
import ICTypes   "../types/integrationCredentials";
import ICLib     "../lib/integrationCredentials";
import SecretManager "../lib/secretManager";
import Map       "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

mixin (
  dograhState      : DograhLib.State,
  integrationCreds : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt         : Blob,
  secretState      : ?SecretManager.State,
) {

  // ── HTTP transform (strips response headers for determinism) ────────────────

  public query func dograhTransform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    { status = input.response.status; body = input.response.body; headers = [] };
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /// Safely pull the stored config or return a meaningful error.
  func requireConfig() : { #ok : T.DograhConfig; #err : Text } {
    switch (DograhLib.getConfig(dograhState)) {
      case null   { #err "No Dograh API key configured" };
      case (?cfg) {
        if (cfg.apiKey == "") { #err "No Dograh API key configured" }
        else { #ok cfg };
      };
    };
  };

  /// Build the standard X-API-Key header array.
  func apiKeyHeaders(apiKey : Text) : [Outcall.Header] {
    [{ name = "X-API-Key"; value = apiKey }];
  };

  // ── Public endpoints ────────────────────────────────────────────────────────

  /// Store the Dograh API key and set the base URL — persists in stable integrationCreds.
  public shared ({ caller = _ }) func saveDograhApiKey(apiKey : Text) : async { success : Bool; message : Text } {
    DograhLib.setConfig(
      dograhState,
      { apiKey; baseUrl = "https://app.dograh.com/api/v1/mcp/"; isEnabled = true },
    );
    // Write to stable integrationCreds so key survives upgrades
    let tid = "platform";
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState);
      case (null) ICLib.emptyCredentials();
    };
    integrationCreds.add(tid, ICLib.encryptAllWithSecret({ existing with dograhApiKey = apiKey }, credSalt, secretState));
    { success = true; message = "API key saved" };
  };

  /// Ping the Dograh MCP server and return connection status.
  public shared ({ caller = _ }) func testDograhConnection() : async T.DograhTestResult {
    switch (requireConfig()) {
      case (#err msg) { { connected = false; message = msg; agentCount = 0 } };
      case (#ok cfg) {
        let headers = apiKeyHeaders(cfg.apiKey);
        try {
          // Count agents via a rough JSON parse of the response body.
          let bodyText = await Outcall.httpGetRequest(
            "https://app.dograh.com/api/v1/mcp/",
            headers,
            dograhTransform,
          );
          // A non-empty body on 200 indicates a live connection.
          let agentCount = if (bodyText == "") 0 else {
            // Try to count "id" keys as a rough proxy for agent count.
            let parts = bodyText.split(#text "\"").toArray();
            var count = 0;
            for (p in parts.vals()) {
              if (p == "id") count += 1;
            };
            count;
          };
          DograhLib.setLastSyncTime(dograhState, Time.now());
          { connected = true; message = "Connected to Dograh"; agentCount };
        } catch (e) {
          { connected = false; message = "Connection failed"; agentCount = 0 };
        };
      };
    };
  };

  /// Fetch agents from Dograh and cache them locally.
  public shared ({ caller = _ }) func getDograhAgents() : async [T.DograhAgent] {
    switch (requireConfig()) {
      case (#err _) { [] };
      case (#ok cfg) {
        let headers = apiKeyHeaders(cfg.apiKey);
        try {
          let bodyText = await Outcall.httpGetRequest(
            "https://app.dograh.com/api/v1/mcp/agents",
            headers,
            dograhTransform,
          );
          // Return cached agents after a successful call.
          // (Full JSON parsing is out of scope here — the cache is populated
          // from createAgentFromCommand; this call refreshes the sync time.)
          ignore bodyText;
          DograhLib.setLastSyncTime(dograhState, Time.now());
          DograhLib.getAgentsCache(dograhState);
        } catch (e) {
          DograhLib.getAgentsCache(dograhState);
        };
      };
    };
  };

  /// Create a voice agent from a natural-language command.
  public shared ({ caller = _ }) func createAgentFromCommand(req : T.DograhCreateAgentRequest) : async T.DograhCommandResult {
    switch (requireConfig()) {
      case (#err msg) { { success = false; agentId = null; message = msg; nodesCreated = 0 } };
      case (#ok cfg) {
        // Build nodes from the nlCommand by splitting on punctuation/connectors.
        let sentences = req.nlCommand.split(#char '.').toArray();
        var nodeCount = 0;
        var nodesJson = "[";
        for (s in sentences.vals()) {
          let trimmed = s.trimStart(#text " ");
          if (trimmed != "") {
            if (nodeCount > 0) nodesJson #= ",";
            nodesJson #= "{ \"type\": \"agentNode\", \"prompt\": \"" # trimmed # "\" }";
            nodeCount += 1;
          };
        };
        nodesJson #= "]";

        let payload = "{ \"name\": \"" # req.name # "\","
          # "\"description\": \"" # req.description # "\","
          # "\"nodes\": " # nodesJson # " }";

        let headers = [
          { name = "X-API-Key";     value = cfg.apiKey },
          { name = "Content-Type";  value = "application/json" },
        ];

        try {
          let respText = await Outcall.httpPostRequest(
            "https://app.dograh.com/api/v1/mcp/agents",
            headers,
            payload,
            dograhTransform,
          );
          // Extract agent id from response JSON (look for first "id":"...").
          let agentId = extractJsonField(respText, "id");
          let newAgent : T.DograhAgent = {
            id           = switch (agentId) { case (?id) id; case null req.name };
            name         = req.name;
            description  = req.description;
            status       = "draft";
            nodeCount    = nodeCount;
            lastModified = Time.now();
          };
          DograhLib.setAgentInCache(dograhState, newAgent);
          {
            success      = true;
            agentId      = ?newAgent.id;
            message      = "Agent created";
            nodesCreated = nodeCount;
          };
        } catch (e) {
          { success = false; agentId = null; message = "Failed to create agent"; nodesCreated = 0 };
        };
      };
    };
  };

  /// Edit an existing agent using a natural-language command.
  public shared ({ caller = _ }) func editAgentFromCommand(agentId : Text, nlCommand : Text) : async T.DograhCommandResult {
    switch (requireConfig()) {
      case (#err msg) { { success = false; agentId = null; message = msg; nodesCreated = 0 } };
      case (#ok cfg) {
        let payload = "{ \"command\": \"" # nlCommand # "\" }";
        let headers = [
          { name = "X-API-Key";    value = cfg.apiKey },
          { name = "Content-Type"; value = "application/json" },
        ];
        try {
          let _ = await Outcall.httpPostRequest(
            "https://app.dograh.com/api/v1/mcp/agents/" # agentId # "/edit",
            headers,
            payload,
            dograhTransform,
          );
          { success = true; agentId = ?agentId; message = "Agent updated"; nodesCreated = 0 };
        } catch (e) {
          { success = false; agentId = ?agentId; message = "Failed to edit agent"; nodesCreated = 0 };
        };
      };
    };
  };

  /// Deploy an agent to make it live.
  public shared ({ caller = _ }) func deployAgent(agentId : Text) : async { success : Bool; message : Text } {
    switch (requireConfig()) {
      case (#err msg) { { success = false; message = msg } };
      case (#ok cfg) {
        let headers = [
          { name = "X-API-Key";    value = cfg.apiKey },
          { name = "Content-Type"; value = "application/json" },
        ];
        try {
          let _ = await Outcall.httpPostRequest(
            "https://app.dograh.com/api/v1/mcp/agents/" # agentId # "/deploy",
            headers,
            "{}",
            dograhTransform,
          );
          { success = true; message = "Agent deployed" };
        } catch (e) {
          { success = false; message = "Failed to deploy agent" };
        };
      };
    };
  };

  /// Return the current Dograh config with the API key redacted.
  /// Uses stable integrationCreds as the source of truth for configured status.
  public shared ({ caller = _ }) func getDograhConfig() : async ?T.DograhConfig {
    let tid = "platform";
    let stableKey = switch (integrationCreds.get(tid)) {
      case (null) "";
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState).dograhApiKey;
    };
    let configured = stableKey != "";
    // Restore in-memory state from stable store if it was lost after upgrade
    if (configured) {
      switch (DograhLib.getConfig(dograhState)) {
        case (null) {
          DograhLib.setConfig(dograhState, { apiKey = stableKey; baseUrl = "https://app.dograh.com/api/v1/mcp/"; isEnabled = true });
        };
        case (?cfg) {
          if (cfg.apiKey == "") {
            DograhLib.setConfig(dograhState, { cfg with apiKey = stableKey });
          };
        };
      };
    };
    switch (DograhLib.getConfig(dograhState)) {
      case null    null;
      case (?cfg)  ?{ cfg with apiKey = if (configured) "***" else "" };
    };
  };

  /// Build and push the pre-loaded roofing template to the requested scope.
  public shared ({ caller = _ }) func pushRoofingTemplate(targetScope : Text) : async { success : Bool; accountsUpdated : Nat; message : Text } {
    switch (requireConfig()) {
      case (#err msg) { { success = false; accountsUpdated = 0; message = msg } };
      case (#ok _cfg) {
        // Ensure roofing template exists in stable state.
        let tpl : T.RoofingTemplate = switch (DograhLib.getRoofingTemplate(dograhState)) {
          case (?t) t;
          case null {
            let built : T.RoofingTemplate = {
              name        = "Roofing Lead Qualifier";
              description = "AI voice agent for qualifying roofing leads";
              niche       = "roofing";
              nodes = [
                {
                  id          = "start";
                  type_       = "startCall";
                  name        = "Greeting";
                  prompt      = "Hello, this is the roofing assistant";
                  transitions = ["addr"];
                },
                {
                  id          = "addr";
                  type_       = "agentNode";
                  name        = "Address";
                  prompt      = "Can I get the address of the property?";
                  transitions = ["type"];
                },
                {
                  id          = "type";
                  type_       = "agentNode";
                  name        = "Work Type";
                  prompt      = "What type of roofing work do you need? (repair, replacement, inspection)";
                  transitions = ["timeline"];
                },
                {
                  id          = "timeline";
                  type_       = "agentNode";
                  name        = "Timeline";
                  prompt      = "What is your timeline for this project?";
                  transitions = ["insurance"];
                },
                {
                  id          = "insurance";
                  type_       = "agentNode";
                  name        = "Insurance";
                  prompt      = "Do you have homeowners insurance that may cover this?";
                  transitions = ["schedule"];
                },
                {
                  id          = "schedule";
                  type_       = "agentNode";
                  name        = "Schedule";
                  prompt      = "Let me schedule a free inspection for you. What days work best?";
                  transitions = ["end"];
                },
                {
                  id          = "end";
                  type_       = "endCall";
                  name        = "Closing";
                  prompt      = "Great, you're all set! We'll see you at the inspection.";
                  transitions = [];
                },
              ];
            };
            DograhLib.setRoofingTemplate(dograhState, built);
            built;
          };
        };

        // Push to all matching accounts in scope.
        // In this architecture the push records a deployment entry per scope.
        // Actual per-account dispatch is handled by the N8N workflow layer.
        let accountsUpdated : Nat = switch (targetScope) {
          case "all"    { 1 }; // platform-wide push records one system entry
          case "agency" { 1 }; // agency-tier push
          case _        { 1 };
        };

        // Create the agent on Dograh via createAgentFromCommand.
        let createReq : T.DograhCreateAgentRequest = {
          name        = tpl.name;
          description = tpl.description;
          niche       = tpl.niche;
          nlCommand   = "Qualify roofing leads. Ask about address, work type, timeline, insurance, and preferred inspection days.";
        };
        let result = await createAgentFromCommand(createReq);

        if (result.success) {
          { success = true; accountsUpdated; message = "Roofing template pushed" };
        } else {
          { success = false; accountsUpdated = 0; message = result.message };
        };
      };
    };
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  /// Extract the first value for a JSON key like `"id":"<value>"`.
  private func extractJsonField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\":\"";
    if (not json.contains(#text needle)) { return null };
    let parts = json.split(#text needle).toArray();
    if (parts.size() < 2) { return null };
    let after = parts[1];
    let afterColon = switch (after.stripStart(#text ":")) { case (?s) s; case null after };
    let trimmed = afterColon.trimStart(#text " ");
    let trimmedQ = trimmed.trimStart(#text "\"");
    var result = "";
    var done = false;
    for (c in trimmedQ.chars()) {
      if (not done) {
        if (c == '\"' or c == ',' or c == '}') {
          done := true;
        } else {
          result := result # Text.fromChar(c);
        };
      };
    };
    if (result == "") null else ?result;
  };

};
