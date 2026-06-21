import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

module {

  public type State = {
    store : Map.Map<Text, Text>;
  };

  public func init() : State = {
    store = Map.empty<Text, Text>();
  };

  /// Save a JSON string value under a key.
  public func save(state : State, key : Text, value : Text) : () {
    state.store.add(key, value);
  };

  /// Retrieve a JSON string by key.
  public func get(state : State, key : Text) : ?Text {
    state.store.get(key);
  };

  /// Remove a key from the store.
  public func remove(state : State, key : Text) : () {
    ignore state.store.remove(key);
  };

  /// List all keys matching a prefix.
  public func listKeys(state : State, prefix : Text) : [Text] {
    let all = state.store.entries();
    var result : [Text] = [];
    for ((k, v) in all) {
      if (Text.startsWith(k, #text(prefix))) {
        result := Array.concat(result, [k]);
      };
    };
    result;
  };

  /// List all entries as (key, value) pairs.
  public func listAll(state : State) : [(Text, Text)] {
    Iter.toArray(state.store.entries());
  };

  /// Count total entries.
  public func count(state : State) : Nat {
    state.store.size();
  };

  /// Clear all entries.
  public func clear(state : State) : () {
    for ((k, v) in state.store.entries()) {
      ignore state.store.remove(k);
    };
  };

}
