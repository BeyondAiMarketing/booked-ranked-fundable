import Map  "mo:core/Map";
import Text "mo:core/Text";
import T    "../types/nicheVoice";
import NVLib "../lib/nicheVoice";

mixin (
  nicheVoiceAssignments : Map.Map<Text, T.NicheVoiceAssignment>,
  nicheScriptOverrides  : Map.Map<Text, [Text]>,
  elevenLabsAudioCache  : Map.Map<Text, Text>,
) {

  // ── Voice assignment API ─────────────────────────────────────────────────

  /// Assign an ElevenLabs voice to a niche.  Persists permanently in stable
  /// storage so the assignment survives canister upgrades.
  public func setNicheVoiceAssignment(
    nicheId   : Text,
    voiceId   : Text,
    voiceName : Text,
  ) : async () {
    NVLib.setAssignment(nicheVoiceAssignments, nicheId, voiceId, voiceName);
  };

  /// Return all current niche voice assignments (all 10 niches).
  public query func getNicheVoiceAssignments() : async [T.NicheVoiceAssignment] {
    NVLib.listAssignments(nicheVoiceAssignments)
  };

  /// Return the ElevenLabs voice ID assigned to a niche.
  /// Useful for Vapi provisioning — falls back to hardcoded default if no
  /// override has been set.
  public query func getVapiNicheVoiceId(nicheId : Text) : async ?Text {
    NVLib.getVoiceId(nicheVoiceAssignments, nicheId)
  };

  // ── Script override API ──────────────────────────────────────────────────

  /// Store editable script lines for a niche.  Each element in `lines` is a
  /// dialogue line that replaces the corresponding hardcoded line when the
  /// frontend renders the demo.  Use {{businessName}} as the injection token.
  public func setNicheScriptLines(nicheId : Text, lines : [Text]) : async () {
    NVLib.setScriptLines(nicheScriptOverrides, nicheId, lines);
  };

  /// Return the effective script lines for a niche:
  ///   - If an admin override exists, returns it.
  ///   - Otherwise falls back to the hardcoded NicheScript constants.
  /// Returns null for unknown niche IDs.
  public query func getNicheScriptLines(nicheId : Text) : async ?[Text] {
    NVLib.getEffectiveScriptLines(nicheScriptOverrides, nicheId)
  };

  /// Reset the script for a niche back to the hardcoded default by removing
  /// the stored override.
  public func resetNicheScript(nicheId : Text) : async () {
    NVLib.resetScriptLines(nicheScriptOverrides, nicheId);
  };

  // ── Audio cache API ──────────────────────────────────────────────────────

  /// Cache a base64-encoded audio blob from ElevenLabs.
  /// `key` should be formatted as "<nicheId>:<lineIndex>" (e.g. "plumber:0").
  public func setCachedAudio(key : Text, base64Audio : Text) : async () {
    NVLib.setCachedAudio(elevenLabsAudioCache, key, base64Audio);
  };

  /// Retrieve a previously cached audio blob.
  /// Returns null if the key is not in the cache.
  public query func getCachedAudio(key : Text) : async ?Text {
    NVLib.getCachedAudio(elevenLabsAudioCache, key)
  };

  /// Clear all cached audio lines for a specific niche (e.g. after updating
  /// the script or swapping the voice).
  public func clearNicheAudioCache(nicheId : Text) : async () {
    NVLib.clearNicheAudioCache(elevenLabsAudioCache, nicheId);
  };

  /// Return every key currently stored in the audio cache — useful for the
  /// admin panel to show pre-loading progress.
  public query func getAudioCacheKeys() : async [Text] {
    NVLib.getAudioCacheKeys(elevenLabsAudioCache)
  };

};
