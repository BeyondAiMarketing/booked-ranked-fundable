import Map "mo:core/Map";

module {

  // ── 8-level memory scope ───────────────────────────────────────────────────
  //
  // The memory layer is organized into 8 hierarchical scopes. Hot tiers
  // (Conversation, Agent, Lead) live in fast in-memory Map storage for
  // real-time AI response speed and survive via orthogonal persistence
  // (acceptable transient loss on redeploy for hot data). Durable tiers
  // (Global, Platform, Tenant, Organization, Campaign) live in
  // StableJsonStore with namespaced keys so they survive canister upgrades.
  //
  // Organization vs Tenant matters for franchises/white-label: a Tenant is
  // the operational workspace, an Organization is the parent entity that may
  // own multiple Tenants (franchise/white-label model).

  // ── MemoryScope / MemoryTier ─────────────────────────────────────────────
  //
  // DIAGNOSTIC: simplified from 8-variant and 2-variant tagged types to plain
  // Text aliases. The original payload-less variant forms triggered a moc
  // 1.10.1 stable-signature crash (desugar.ml:1083 List.map2) when
  // MemoryScope — embedded in MemoryEntry and MemoryContextBlock — appeared in
  // public function return types (getOrchestratorMemory, listOrchestratorMemory,
  // readMemory, listMemory, buildMemoryContext). Even payload-less variants
  // can trigger the bug when in public return types. Encoded scope values:
  //   "global", "platform", "tenant", "org", "campaign",
  //   "lead", "conversation", "agent".
  // Encoded tier values: "hot", "durable".

  public type MemoryScope = Text;
  public type MemoryTier  = Text;

  /// A single memory entry. `scopeId` carries the tenantId / orgId /
  /// campaignId / leadId / conversationId / agentId as applicable for the
  /// chosen scope (empty Text for #Global and #Platform).
  public type MemoryEntry = {
    id         : Text;
    scope      : MemoryScope;
    scopeId    : Text;
    key        : Text;
    content    : Text;
    metadata   : [(Text, Text)];
    createdAt  : Int;
    updatedAt  : Int;
    importance : Nat;
    tags       : [Text];
  };

  /// Filter applied when listing memory entries for context assembly.
  public type MemoryFilter = {
    minImportance : ?Nat;
    tags          : ?[Text];
    limit         : ?Nat;
  };

  /// A merged context block for a single scope, ready for prompt injection.
  public type MemoryContextBlock = {
    scope         : MemoryScope;
    scopeId       : Text;
    entries       : [MemoryEntry];
    assembledText : Text;
  };

  // ── Compatible local scaffolding types ─────────────────────────────────────
  //
  // main.mo already defines ConversationEntry, AgentMemory, AgentMemoryRecord,
  // and MemoryMode as scaffolding for the memory layers. We do NOT import from
  // main.mo (it is the composition root); instead we define structurally
  // compatible local types here. The composition task bridges these to the
  // main.mo definitions where applicable.

  public type ConversationEntry = {
    role      : Text;
    content   : Text;
    timestamp : Int;
  };

  // MemoryMode — original variant type. The moc 1.10.1 stable-signature crash
  // (desugar.ml:1083) was caused by mixin parameters becoming stable actor
  // fields, NOT by this variant. Now that the mixin is removed and public
  // functions are defined directly in main.mo, the variant is safe again.
  public type MemoryMode = {
    #none_;
    #conversation_only;
    #with_summary;
    #with_notes;
  };

  public type AgentMemory = {
    threadId            : Text;
    tenantId            : Text;
    conversationHistory : [ConversationEntry];
    summary             : ?Text;
    agentNotes          : ?Text;
    lastUpdated         : Int;
  };

  public type AgentMemoryRecord = {
    id         : Text;
    threadId   : Text;
    tenantId   : Text;
    agentId    : Text;
    memoryType : Text;
    content    : Text;
    createdAt  : Int;
    expiresAt  : ?Int;
    importance : Nat;
  };

  // ── Memory state ───────────────────────────────────────────────────────────
  //
  // `hotStore` is the in-memory Map keyed by composite `hotKey(scope, scopeId, key)`.
  //
  // The durable tier (StableJsonStore) is NOT stored in MemoryState. Earlier
  // attempts nested `durableStore : SJS.State` (an immutable record field
  // `{ store : Map.Map<Text, Text> }`) inside this stable record with a `var`
  // field, which crashed moc 1.10.1's stable-signature generation
  // (desugar.ml:1083 List.map2). The working `llmFallbackState` pattern keeps
  // only `var` fields of plain Map/array types — no nested record types.
  //
  // Instead, the durable store reference is passed separately to each memory
  // function that needs it (writeMemory, readMemory, listMemory, deleteMemory,
  // buildContext, buildContextText, entryCount, durableTierCount, preupgrade,
  // postupgrade). The mixin layer (mixins/ai-memory-api.mo) receives the
  // durableStore alongside `state` and forwards it to the lib functions.
  //
  // The total entry count is derived on demand from `Map.size(hotStore)` +
  // `SJS.count(durableStore)` rather than maintained as a separate counter,
  // keeping the state shape minimal (1 var field) and avoiding drift between
  // the counter and the actual store sizes.

  /// Memory state. DIAGNOSTIC: simplified to a single `var` field with a
  /// primitive type to isolate the moc 1.10.1 stable-signature crash
  /// (desugar.ml:1083 List.map2). The full `hotStore : Map.Map<Text, MemoryEntry>`
  /// is temporarily removed; restored once the crash root cause is identified.
  public type MemoryState = {
    var entryCount : Nat;
  };

  // ── Scope → tier helpers ───────────────────────────────────────────────────

  /// Map a scope to its storage tier.
  /// "conversation", "agent", "lead" → "hot"
  /// "global", "platform", "tenant", "org", "campaign" → "durable"
  public func tierForScope(scope : MemoryScope) : MemoryTier {
    if (scope == "conversation" or scope == "agent" or scope == "lead") {
      "hot";
    } else {
      "durable";
    };
  };

  /// True when the scope routes to the hot (in-memory) tier.
  public func isHotScope(scope : MemoryScope) : Bool {
    tierForScope(scope) == "hot";
  };

  /// True when the scope routes to the durable (StableJsonStore) tier.
  public func isDurableScope(scope : MemoryScope) : Bool {
    tierForScope(scope) == "durable";
  };

  /// Namespaced key prefix for durable-tier entries.
  /// Returns:
  ///   "global"     → "ai-memory:global:"
  ///   "platform"   → "ai-memory:platform:"
  ///   "tenant"     → "ai-memory:tenant:<scopeId>:"
  ///   "org"        → "ai-memory:org:<scopeId>:"
  ///   "campaign"   → "ai-memory:campaign:<scopeId>:"
  /// Hot-tier scopes ("conversation", "agent", "lead") have no durable prefix;
  /// callers should route via tierForScope before calling this.
  public func durableKeyPrefix(scope : MemoryScope, scopeId : Text) : Text {
    if (scope == "global") {
      "ai-memory:global:";
    } else if (scope == "platform") {
      "ai-memory:platform:";
    } else if (scope == "tenant") {
      "ai-memory:tenant:" # scopeId # ":";
    } else if (scope == "org") {
      "ai-memory:org:" # scopeId # ":";
    } else if (scope == "campaign") {
      "ai-memory:campaign:" # scopeId # ":";
    } else if (scope == "conversation") {
      "ai-memory:conversation:" # scopeId # ":";
    } else if (scope == "agent") {
      "ai-memory:agent:" # scopeId # ":";
    } else if (scope == "lead") {
      "ai-memory:lead:" # scopeId # ":";
    } else {
      // Unknown scope — fall back to a generic prefix.
      "ai-memory:" # scope # ":" # scopeId # ":";
    };
  };

  /// Composite key for the in-memory hot-tier Map: "<scope>:<scopeId>:<key>".
  public func hotKey(scope : MemoryScope, scopeId : Text, key : Text) : Text {
    scope # ":" # scopeId # ":" # key;
  };

  /// Textual tag for a scope. With MemoryScope now a Text alias, this is an
  /// identity function retained for backward compatibility with callers that
  /// normalize scope tags.
  public func scopeToText(scope : MemoryScope) : Text {
    scope;
  };

};
