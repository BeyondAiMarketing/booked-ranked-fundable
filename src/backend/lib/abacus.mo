import T     "../types/abacus";

module {

  public type State = { var config : ?T.AbacusConfig };

  public func emptyState() : State { { var config = null } };

  /// Persist or replace the Abacus config.
  public func saveConfig(state : State, config : T.AbacusConfig) : () {
    state.config := ?config;
  };

  /// Retrieve the current Abacus config, or null if never saved.
  public func getConfig(state : State) : ?T.AbacusConfig {
    state.config;
  };

  /// Increment both total and today call counters.
  public func incrementCallCount(state : State) : () {
    switch (state.config) {
      case (?config) {
        state.config := ?{ config with callsToday = config.callsToday + 1; totalRoutedCalls = config.totalRoutedCalls + 1 };
      };
      case null {};
    };
  };

  /// Reset the daily call counter (called at midnight / cron).
  public func resetDailyCount(state : State) : () {
    switch (state.config) {
      case (?config) {
        state.config := ?{ config with callsToday = 0 };
      };
      case null {};
    };
  };

};
