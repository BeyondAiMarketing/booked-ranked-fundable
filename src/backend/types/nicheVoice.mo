module {

  /// A per-niche ElevenLabs voice assignment, stored in stable Maps.
  /// assignedAt is stored as nanoseconds since epoch (Time.now()).
  public type NicheVoiceAssignment = {
    nicheId    : Text;
    voiceId    : Text;   // ElevenLabs voice ID (e.g. "EXAVITQu4vr4xnSDxMaL")
    voiceName  : Text;   // Human-readable label (e.g. "Bella")
    assignedAt : Int;    // Time.now() at assignment
  };

  /// A cache entry keying (nicheId + ":" + lineIndex) -> base64-encoded audio blob.
  /// Stored flat in a Map so individual lines can be fetched without decoding the whole script.
  public type AudioCacheEntry = {
    key        : Text;   // "<nicheId>:<lineIndex>"
    base64Audio: Text;   // base64-encoded audio blob from ElevenLabs
    cachedAt   : Int;    // Time.now() at cache time
  };

};
