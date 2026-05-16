import Map   "mo:core/Map";
import Time  "mo:core/Time";
import Text  "mo:core/Text";
import Types "../types/nicheVoice";
import DSLib "../lib/demoSession";

module {

  public type NicheVoiceAssignment = Types.NicheVoiceAssignment;

  // ── Default voice assignments mirroring the hardcoded constants ─────────

  /// Return the default NicheVoiceAssignment for a niche, sourced from the
  /// hardcoded NicheScript constants in lib/demoSession.
  public func defaultAssignment(nicheId : Text) : ?NicheVoiceAssignment {
    switch (DSLib.getScript(nicheId)) {
      case (null)    { null };
      case (?script) {
        ?{
          nicheId;
          voiceId    = script.elevenLabsVoiceId;
          voiceName  = script.voiceName;
          assignedAt = Time.now();
        }
      };
    }
  };

  /// Seed the nicheVoiceAssignments map with all 10 default assignments if they
  /// are not already present.  Safe to call on every canister init or upgrade.
  public func seedDefaults(store : Map.Map<Text, NicheVoiceAssignment>) {
    let niches = [
      "plumber", "med-spa", "hvac", "restoration", "carpet-cleaning",
      "roofing", "real-estate", "mortgage", "chiropractor", "dental",
    ];
    for (nicheId in niches.values()) {
      if (store.get(nicheId) == null) {
        switch (defaultAssignment(nicheId)) {
          case (?a) { store.add(nicheId, a) };
          case null {};
        };
      };
    };
  };

  // ── Voice assignment helpers ─────────────────────────────────────────────

  /// Upsert a voice assignment for a niche.
  public func setAssignment(
    store     : Map.Map<Text, NicheVoiceAssignment>,
    nicheId   : Text,
    voiceId   : Text,
    voiceName : Text,
  ) {
    let entry : NicheVoiceAssignment = {
      nicheId;
      voiceId;
      voiceName;
      assignedAt = Time.now();
    };
    store.add(nicheId, entry);
  };

  /// Return all current voice assignments as an array.
  public func listAssignments(store : Map.Map<Text, NicheVoiceAssignment>) : [NicheVoiceAssignment] {
    store.values().toArray()
  };

  /// Look up the ElevenLabs voice ID for a niche.
  /// Falls back to the hardcoded default if no override exists.
  public func getVoiceId(store : Map.Map<Text, NicheVoiceAssignment>, nicheId : Text) : ?Text {
    switch (store.get(nicheId)) {
      case (?a) { ?a.voiceId };
      case null {
        switch (defaultAssignment(nicheId)) {
          case (?a) { ?a.voiceId };
          case null { null };
        }
      };
    }
  };

  // ── Script override helpers ──────────────────────────────────────────────

  /// Set (or replace) the editable script lines for a niche.
  public func setScriptLines(
    store   : Map.Map<Text, [Text]>,
    nicheId : Text,
    lines   : [Text],
  ) {
    store.add(nicheId, lines);
  };

  /// Return the effective script lines for a niche.
  /// If an override exists, returns it.  Otherwise returns the hardcoded lines
  /// extracted from the NicheScript constants in lib/demoSession.
  public func getEffectiveScriptLines(
    store   : Map.Map<Text, [Text]>,
    nicheId : Text,
  ) : ?[Text] {
    switch (store.get(nicheId)) {
      case (?lines) { ?lines };
      case null {
        switch (DSLib.getScript(nicheId)) {
          case (null)    { null };
          case (?script) {
            ?script.lines.map(func(l) { l.text })
          };
        }
      };
    }
  };

  /// Remove the script override for a niche (resets to hardcoded default).
  public func resetScriptLines(store : Map.Map<Text, [Text]>, nicheId : Text) {
    store.remove(nicheId);
  };

  // ── Audio cache helpers ──────────────────────────────────────────────────

  /// Store a base64-encoded audio blob under a cache key.
  public func setCachedAudio(
    store      : Map.Map<Text, Text>,
    key        : Text,
    base64Audio: Text,
  ) {
    store.add(key, base64Audio);
  };

  /// Retrieve a cached audio blob by key.
  public func getCachedAudio(store : Map.Map<Text, Text>, key : Text) : ?Text {
    store.get(key)
  };

  /// Remove all cache entries whose keys start with "<nicheId>:".
  public func clearNicheAudioCache(store : Map.Map<Text, Text>, nicheId : Text) {
    let prefix = nicheId # ":";
    let toRemove = store.keys().toArray().filter(func(k) { k.startsWith(#text prefix) });
    for (k in toRemove.values()) { store.remove(k) };
  };

  /// Return all keys currently in the audio cache.
  public func getAudioCacheKeys(store : Map.Map<Text, Text>) : [Text] {
    store.keys().toArray()
  };

};
