import List "mo:core/List";
import Map  "mo:core/Map";
import T    "../types/composio";

module {

  // Default platform-level toolkit — these apps are available to all accounts.
  public let defaultPlatformToolkit : [Text] = ["gmail", "google_calendar", "stripe", "companycam"];

  public type State = {
    configStore          : { var value : ?T.ComposioConfig };
    toolRegistry         : Map.Map<Text, List.List<T.ComposioTool>>;
    accountToolkits      : Map.Map<Text, [Text]>; // accountId -> enabled tool ids
    composioRouteEnabled : { var value : Bool };  // whether Composio is primary MCP
  };

  public func emptyState() : State = {
    configStore          = { var value = null };
    toolRegistry         = Map.empty();
    accountToolkits      = Map.empty();
    composioRouteEnabled = { var value = false };
  };

  /// Save or replace the platform-level Composio config.
  public func savePlatformConfig(state : State, config : T.ComposioConfig) : () {
    state.configStore.value := ?config;
  };

  /// Retrieve the current platform Composio config.
  public func getPlatformConfig(state : State) : ?T.ComposioConfig {
    state.configStore.value;
  };

  /// Register a newly-connected tool for an account.
  public func addConnectedTool(state : State, tool : T.ComposioTool) : () {
    let existing = switch (state.toolRegistry.get(tool.accountId)) {
      case (?lst) lst;
      case null   List.empty<T.ComposioTool>();
    };
    existing.add(tool);
    state.toolRegistry.add(tool.accountId, existing);
  };

  /// Remove a connected tool by toolId and accountId.
  public func removeConnectedTool(state : State, toolId : Text, accountId : Text) : () {
    switch (state.toolRegistry.get(accountId)) {
      case (?lst) {
        let filtered = List.empty<T.ComposioTool>();
        for (t in lst.values()) {
          if (t.id != toolId) { filtered.add(t) };
        };
        state.toolRegistry.add(accountId, filtered);
      };
      case null {};
    };
  };

  /// Return all tools connected for a specific account.
  public func getToolsByAccount(state : State, accountId : Text) : [T.ComposioTool] {
    switch (state.toolRegistry.get(accountId)) {
      case (?lst) lst.toArray();
      case null   [];
    };
  };

  // ── Per-account toolkit management ────────────────────────────────────────

  /// Set the enabled toolkit for an account (replaces existing).
  public func setAccountToolkit(state : State, accountId : Text, tools : [Text]) : () {
    state.accountToolkits.add(accountId, tools);
  };

  /// Get the enabled toolkit for an account, falling back to platform defaults.
  public func getAccountToolkit(state : State, accountId : Text) : [Text] {
    switch (state.accountToolkits.get(accountId)) {
      case (?tools) tools;
      case null     defaultPlatformToolkit;
    };
  };

  /// Return toolkit status: which tools are enabled per account.
  /// Returns the platform toolkit for accounts with no custom config.
  public func getToolkitStatus(state : State, accountId : Text) : { accountId : Text; tools : [Text]; usingDefault : Bool } {
    switch (state.accountToolkits.get(accountId)) {
      case (?tools) { { accountId; tools; usingDefault = false } };
      case null     { { accountId; tools = defaultPlatformToolkit; usingDefault = true } };
    };
  };

  /// Check whether Composio is configured and this action should route through it.
  /// Returns true only when the platform config has an API key AND routing is enabled.
  public func shouldRouteThrough(state : State, accountId : Text, action : Text) : Bool {
    if (not state.composioRouteEnabled.value) return false;
    let toolkit = getAccountToolkit(state, accountId);
    // Check if this action maps to an enabled tool
    toolkit.vals().find(func(t : Text) : Bool { t == action or action.startsWith(#text t) }) != null
  };

  /// Enable or disable Composio as the primary MCP routing layer.
  public func setComposioRoutingEnabled(state : State, enabled : Bool) : () {
    state.composioRouteEnabled.value := enabled;
  };

  /// Whether Composio routing is currently enabled.
  public func isRoutingEnabled(state : State) : Bool {
    state.composioRouteEnabled.value
  };

  /// Return every connected tool across all accounts.
  public func getAllConnectedTools(state : State) : [T.ComposioTool] {
    let all = List.empty<T.ComposioTool>();
    for ((_, lst) in state.toolRegistry.entries()) {
      for (t in lst.values()) {
        all.add(t);
      };
    };
    all.toArray();
  };

};
