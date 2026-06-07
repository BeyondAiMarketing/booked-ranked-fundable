module {

  // ── Canonical niche variant ──────────────────────────────────────────────

  /// Canonical niche type — pattern-matched everywhere, never raw Text.
  public type Niche = {
    #plumber;
    #medSpa;
    #hvac;
    #restoration;
    #carpetCleaning;
    #roofing;
    #realEstate;
    #mortgage;
    #chiropractic;
    #dental;
    #unknown : Text; // passthrough for unrecognised values
  };

  /// Normalise a raw user-supplied niche string to the canonical variant.
  /// Handles case, hyphens, underscores, and common aliases.
  public func fromText(raw : Text) : Niche {
    // normalise: lower-case, strip hyphens and underscores
    let lower = raw.toLower();
    let stripped = lower.replace(#text "-", "").replace(#text "_", "").replace(#text " ", "");
    switch (stripped) {
      case ("plumber")        { #plumber };
      case ("medspa")         { #medSpa };
      case ("hvac")           { #hvac };
      case ("restoration")    { #restoration };
      case ("carpetcleaning") { #carpetCleaning };
      case ("carpet")         { #carpetCleaning };
      case ("roofing")        { #roofing };
      case ("realestate")     { #realEstate };
      case ("realestateagent")         { #realEstate };
      case ("realestateagentsbrokers") { #realEstate };
      case ("mortgage")        { #mortgage };
      case ("mortgagebroker")  { #mortgage };
      case ("chiropractic")    { #chiropractic };
      case ("chiropractor")    { #chiropractic };
      case ("dental")          { #dental };
      case ("dentalpractice")  { #dental };
      case (_)                 { #unknown raw };
    };
  };

  /// Convert the canonical Niche back to its canonical text key (matches
  /// script / gap switch-case keys everywhere).
  public func toText(niche : Niche) : Text {
    switch (niche) {
      case (#plumber)        "plumber";
      case (#medSpa)         "med-spa";
      case (#hvac)           "hvac";
      case (#restoration)    "restoration";
      case (#carpetCleaning) "carpet-cleaning";
      case (#roofing)        "roofing";
      case (#realEstate)     "real-estate";
      case (#mortgage)       "mortgage";
      case (#chiropractic)   "chiropractor";
      case (#dental)         "dental";
      case (#unknown t)      t;
    };
  };

  // ── Voice / script types ─────────────────────────────────────────────────

  /// A single line of dialogue in a niche voice script.
  public type ScriptLine = {
    speaker     : Text;        // "agent" | "customer"
    text        : Text;        // dialogue — use {{businessName}} as injection point
    pauseAfterMs: Nat;         // milliseconds to pause after this line plays
  };

  /// A fully scripted niche voice conversation, hardcoded as a stable constant.
  public type NicheScript = {
    nicheId          : Text;   // matches niche key: "plumber", "med-spa", etc.
    voiceName        : Text;   // ElevenLabs voice character name
    elevenLabsVoiceId: Text;   // real ElevenLabs voice ID
    lines            : [ScriptLine];
  };

  // ── Demo session types ────────────────────────────────────────────────────

  /// A demo session — created when a prospect starts the demo.
  /// All fields are immutable; mutable state is handled by replacing the record in the Map.
  /// IMPORTANT: This type must remain backward-compatible with the on-chain stable storage.
  /// The on-chain schema has exactly these fields (do not add new fields without a migration):
  ///   sessionId, businessName, niche, auditScore, trialActivatedAt,
  ///   socialContentLockedAt, createdAt, step
  public type DemoSession = {
    sessionId            : Text;
    businessName         : Text;
    niche                : Text;
    step                 : Nat;         // 0-9 — current demo step
    auditScore           : Nat;         // 0-100 computed during demo
    trialActivatedAt     : ?Int;        // nanoseconds since epoch, set on trial signup
    socialContentLockedAt: ?Int;        // set on day 7 to lock social content generation
    createdAt            : Int;         // nanoseconds since epoch
  };

  /// Prospect contact data captured at trial activation — stored separately
  /// to preserve backward-compat with the DemoSession stable schema.
  public type ProspectData = {
    sessionId  : Text;
    email      : Text;
    firstName  : ?Text;
    city       : ?Text;
    niche      : ?Text;
    phone      : ?Text;
    capturedAt : Int;
  };

  /// Audit report generated on demo completion — emailed + stored.
  public type AuditReport = {
    sessionId    : Text;
    businessName : Text;
    niche        : Text;
    email        : Text;
    overallScore : Nat;       // 0-100
    topGaps      : [Text];    // exactly 3 niche-specific gap items
    narrative    : ?Text;     // 3-4 sentence niche-specific narrative (optional for backward compat)
    generatedAt  : Int;
  };

  /// Stats returned by getCacheStats().
  public type AudioCacheStats = {
    entryCount      : Nat;
    estimatedSizeKB : Nat;
  };

  public type FeatureFlags = {
    crm: Bool;
    social: Bool;
    reputation: Bool;
    voiceAgent: Bool;
    creditBuilder: Bool;
    analytics: Bool;
  };

  public type TrialAccount = {
    trialAccountId: Text;
    sessionId: Text;
    firstName: Text;
    businessName: Text;
    city: Text;
    niche: Text;
    phone: Text;
    email: Text;
    website: Text;
    activatedAt: Int;
    expiresAt: Int;
    features: FeatureFlags;
    activityScore: Nat;
    day5ReminderSent: Bool;
    convertedAt: ?Int;
  };


};
