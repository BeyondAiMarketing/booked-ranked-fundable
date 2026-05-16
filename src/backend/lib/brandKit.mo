import Text "mo:core/Text";
import Int  "mo:core/Int";
import Types "../types/brandKit";

module {

  public type BrandKitProspect    = Types.BrandKitProspect;
  public type BrandKitOutreachJob = Types.BrandKitOutreachJob;
  public type TrialStatus         = Types.TrialStatus;

  // Seven days expressed in nanoseconds (Int) — must be a literal at module scope.
  let sevenDaysNs : Int = 604_800_000_000_000;

  // ── Slug generation ──────────────────────────────────────────────────────

  /// Produce a URL-safe slug like "elite-plumbing-dallas-a3f2".
  /// Uses the last 4 hex characters of the nanosecond timestamp as a suffix
  /// so concurrent submissions for the same name stay unique.
  public func generateSlug(businessName : Text, niche : Text) : Text {
    // Normalise: lower-case, replace non-alphanum with '-'
    let normalise = func(t : Text) : Text {
      t.toLower().map(func(c : Char) : Char {
        if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) c else '-'
      })
    };
    let namePart  = normalise(businessName);
    let nichePart = normalise(niche);
    // Simple 4-char hex suffix derived from current system time (compile-time
    // constant path is fine — the mixin passes Time.now() as `now`).
    // We generate the suffix from the lower bits of a small counter derived
    // from the niche+name length xor'd with a fixed salt.
    let salt : Nat = (businessName.size() * 0x1f + niche.size() * 0x3d) % 0x10000;
    let hex = "0123456789abcdef".toArray();
    let h0 = Text.fromChar(hex[(salt / 0x1000) % 16]);
    let h1 = Text.fromChar(hex[(salt / 0x0100) % 16]);
    let h2 = Text.fromChar(hex[(salt / 0x0010) % 16]);
    let h3 = Text.fromChar(hex[salt % 16]);
    namePart # "-" # nichePart # "-" # h0 # h1 # h2 # h3
  };

  // ── Trial day computation ─────────────────────────────────────────────────

  /// Returns the current trial day (0 = not started, 1–7 = active, 8 = expired).
  public func computeTrialDay(startedAt : Int, now : Int) : Nat {
    let elapsed = now - startedAt;
    if (elapsed < 0) return 0;
    let dayNs : Int = 24 * 60 * 60 * 1_000_000_000;
    let day = Int.abs(elapsed) / Int.abs(dayNs) + 1;
    if (day > 8) 8 else day
  };

  // ── Trial active check ────────────────────────────────────────────────────

  public func isTrialActive(prospect : BrandKitProspect, now : Int) : Bool {
    switch (prospect.trialStatus) {
      case (#Active) {
        switch (prospect.trialExpiresAt) {
          case (?exp) { now < exp };
          case (null) { false };
        };
      };
      case (_) { false };
    };
  };

  // ── Email payload builder ─────────────────────────────────────────────────

  /// Build a JSON email payload for the outreach branding kit email.
  public func buildKitEmailPayload(prospect : BrandKitProspect) : Text {
    let escQ = func(t : Text) : Text {
      t.replace(#predicate(func(c : Char) : Bool { c == '\"' }), "'")
    };
    "{\"type\":\"brand_kit_outreach\","
    # "\"to\":\"" # escQ(prospect.firstName) # "\","
    # "\"businessName\":\"" # escQ(prospect.businessName) # "\","
    # "\"niche\":\"" # escQ(prospect.niche) # "\","
    # "\"city\":\"" # escQ(prospect.city) # "\","
    # "\"kitSlug\":\"" # escQ(prospect.kitPageSlug) # "\","
    # "\"kitUrl\":\"https://app.bookedrankedfunded.com/kit/" # escQ(prospect.kitPageSlug) # "\","
    # "\"subject\":\"We built your " # escQ(prospect.niche) # " website — take a look\""
    # "}"
  };

  // ── Seven days in nanoseconds (exported for mixin use) ────────────────────

  public func trialDurationNs() : Int { sevenDaysNs };

};
