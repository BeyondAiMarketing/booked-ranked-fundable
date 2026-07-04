import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

module StableJsonStoreCore {
  public class Core() {
    private var store = Map.empty<Text, Text>();
    private var entries : [(Text, Text)] = [];

    public func getStore() : Map.Map<Text, Text> { store };

    public func preupgrade() : () {
      entries := store.entries().toArray();
    };

    public func postupgrade() : () {
      store := Map.empty();
      for ((k, v) in entries.vals()) {
        store.add(k, v);
      };
      if (entries.size() == 0) {
        seedDemoData();
      };
    };

    private func seedDemoData() : () {
      // TODO: populate initial demo data
      // This will be implemented in a follow-up build
    };
  };
}
