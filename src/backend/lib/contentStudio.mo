import Types   "../types/contentStudio";
import List    "mo:core/List";
import Time    "mo:core/Time";
import Text    "mo:core/Text";

module {

  public type State = Types.ContentStudioState;

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Return a mutable working list seeded from the stable state array.
  public func resultList(state : State) : List.List<Types.ContentGenerationResult> {
    let l = List.empty<Types.ContentGenerationResult>();
    for (r in state.generatedContent.vals()) { l.add(r) };
    l;
  };

  public func toggleList(state : State) : List.List<Types.ContentTierToggle> {
    let l = List.empty<Types.ContentTierToggle>();
    for (t in state.tierToggles.vals()) { l.add(t) };
    l;
  };

  // ── Content result CRUD ────────────────────────────────────────────────────

  /// Add or replace a generation result (keyed by id).
  public func upsertResult(
    results : List.List<Types.ContentGenerationResult>,
    result  : Types.ContentGenerationResult,
  ) : () {
    // Replace existing entry if id matches, otherwise append
    var replaced = false;
    results.mapInPlace(
      func(r : Types.ContentGenerationResult) : Types.ContentGenerationResult {
        if (r.id == result.id) { replaced := true; result } else r
      }
    );
    if (not replaced) { results.add(result) };
  };

  /// Return all results for a given accountId.
  public func getResultsByAccount(
    results   : List.List<Types.ContentGenerationResult>,
    accountId : Text,
  ) : [Types.ContentGenerationResult] {
    results.filter(func(r : Types.ContentGenerationResult) : Bool { r.accountId == accountId }).toArray()
  };

  /// Return a single result by id.
  public func getResultById(
    results : List.List<Types.ContentGenerationResult>,
    id      : Text,
  ) : ?Types.ContentGenerationResult {
    results.find(func(r : Types.ContentGenerationResult) : Bool { r.id == id })
  };

  /// Delete a result by id.
  public func deleteResult(
    results : List.List<Types.ContentGenerationResult>,
    id      : Text,
  ) : () {
    // List has no filterInPlace — collect kept items, truncate, re-add
    let kept = results.toArray();
    results.truncate(0);
    for (r in kept.vals()) {
      if (r.id != id) { results.add(r) };
    };
  };

  /// Mark a result status (e.g. Generating → Complete | Failed).
  public func updateResultStatus(
    results  : List.List<Types.ContentGenerationResult>,
    id       : Text,
    status   : Types.GenerationStatus,
    output   : Text,
    mediaUrl : ?Text,
    errorMsg : ?Text,
  ) : () {
    results.mapInPlace(
      func(r : Types.ContentGenerationResult) : Types.ContentGenerationResult {
        if (r.id == id) {
          { r with status; output; mediaUrl; errorMsg }
        } else r
      }
    );
  };

  // ── Tier toggle helpers ───────────────────────────────────────────────────

  /// Upsert a tier toggle entry.
  public func setTierToggle(
    toggles : List.List<Types.ContentTierToggle>,
    tier    : Text,
    enabled : Bool,
  ) : () {
    var replaced = false;
    toggles.mapInPlace(
      func(t : Types.ContentTierToggle) : Types.ContentTierToggle {
        if (t.tier == tier) {
          replaced := true;
          { t with contentCreationEnabled = enabled }
        } else t
      }
    );
    if (not replaced) {
      toggles.add({ tier; contentCreationEnabled = enabled });
    };
  };

  /// Return whether content creation is enabled for a tier.
  public func isTierEnabled(
    toggles : List.List<Types.ContentTierToggle>,
    tier    : Text,
  ) : Bool {
    switch (toggles.find(func(t : Types.ContentTierToggle) : Bool { t.tier == tier })) {
      case (?t) { t.contentCreationEnabled };
      case null  { true }; // default enabled
    };
  };

  /// Return all tier toggles.
  public func getAllTierToggles(
    toggles : List.List<Types.ContentTierToggle>,
  ) : [Types.ContentTierToggle] {
    toggles.toArray()
  };

  // ── State serialisation helpers ───────────────────────────────────────────

  /// Snapshot working lists back into an immutable ContentStudioState.
  public func snapshotState(
    results : List.List<Types.ContentGenerationResult>,
    toggles : List.List<Types.ContentTierToggle>,
  ) : State {
    {
      generatedContent = results.toArray();
      tierToggles      = toggles.toArray();
    };
  };

  /// Generate a stable unique id for a new result.
  public func newId(contentType : Types.ContentType, accountId : Text) : Text {
    let typeTag = switch (contentType) {
      case (#Video)  "vid";
      case (#Image)  "img";
      case (#AdCopy) "ad";
      case (#Blog)   "blog";
    };
    typeTag # "-" # accountId # "-" # debug_show(Time.now());
  };

  /// Build a stub Pending result for a new generation request.
  public func pendingResult(
    req : Types.ContentGenerationRequest,
    id  : Text,
  ) : Types.ContentGenerationResult {
    {
      id;
      contentType       = req.contentType;
      prompt            = req.prompt;
      niche             = req.niche;
      output            = "";
      mediaUrl          = null;
      generatedAt       = Time.now();
      accountId         = req.accountId;
      status            = #Pending;
      errorMsg          = null;
    };
  };

};
