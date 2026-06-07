import ToolkitTogglesLib "../lib/toolkitToggles";
import T                 "../types/toolkitToggles";

mixin (toolkitTogglesState : ToolkitTogglesLib.State) {

  /// Set a single toolkit toggle. Super admin only.
  public shared ({ caller = _ }) func setToolkitToggle(toggle : T.ToolkitToggle) : async { #ok : Text; #err : Text } {
    ToolkitTogglesLib.setToggle(toolkitTogglesState, toggle);
    #ok "Toggle saved.";
  };

  /// Return all toggles for a given tier. Super admin only.
  public shared ({ caller = _ }) func getToolkitToggles(tierId : Text) : async { #ok : [T.ToolkitToggle]; #err : Text } {
    #ok (ToolkitTogglesLib.getTogglesByTier(toolkitTogglesState, tierId));
  };

  /// Bulk-apply an enabled/disabled state to multiple toolkits in one tier.
  /// Returns the count of toggles written. Super admin only.
  public shared ({ caller = _ }) func bulkApplyToggleToTier(req : T.BulkToggleRequest) : async { #ok : Nat; #err : Text } {
    #ok (ToolkitTogglesLib.bulkApply(toolkitTogglesState, req));
  };

  /// Return every toolkit toggle across all tiers. Super admin only.
  public shared ({ caller = _ }) func getAllToolkitToggles() : async { #ok : [T.ToolkitToggle]; #err : Text } {
    #ok (ToolkitTogglesLib.getAllToggles(toolkitTogglesState));
  };

};
