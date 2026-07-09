import Map   "mo:core/Map";
import List  "mo:core/List";
import Text  "mo:core/Text";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Array "mo:core/Array";
import Iter  "mo:core/Iter";
import Time  "mo:core/Time";
import OQL   "mo:caffeineai-oql";

import SJS  "./StableJsonStore";
import T    "../types/auditLog";

/// Centralized Admin Audit Trail
///
/// A generalized, append-only audit log for admin actions, persisted via the
/// existing `StableJsonStore` (no new stable state). This generalizes the
/// compliance-scoped `appendAuditLog` in `autopilotCompliance-api.mo` to all
/// admin operations across the platform.
///
/// Storage namespace: keys are prefixed `admin-audit:` and structured as
/// `admin-audit:<tenantId>:<timestamp>:<nonce>` so entries are globally unique
/// and naturally ordered by tenant then time.
///
/// Entries are append-only — this module exposes NO update or delete path.
module {

  /// Key prefix for all admin-audit entries in the StableJsonStore.
  public let KEY_PREFIX : Text = "admin-audit:";

  // ── JSON encoding / decoding (minimal, hand-rolled — no external dep) ──────

  func esc(s : Text) : Text {
    s.replace(#char '\\', "\\\\")
     .replace(#text "\"", "\\\"")
     .replace(#char '\n', "\\n")
     .replace(#char '\r', "\\r")
     .replace(#char '\t', "\\t");
  };

  func jstr(s : Text) : Text { "\"" # esc(s) # "\"" };

  /// Encode an `AuditAction` variant to its JSON tag text.
  public func actionTypeToText(a : T.AuditAction) : Text {
    switch (a) {
      case (#secretRotation)     "secretRotation";
      case (#featureFlagChange)  "featureFlagChange";
      case (#adminCommand)        "adminCommand";
      case (#credentialUpdate)    "credentialUpdate";
      case (#leadEdit)            "leadEdit";
      case (#webhookConfigChange) "webhookConfigChange";
      case (#other t)             t;
    };
  };

  /// Encode an `AdminAuditEntry` to a compact JSON string.
  public func encodeEntry(e : T.AdminAuditEntry) : Text {
    "{"
    # "\"actor\":"           # jstr(e.actorPrincipal.toText()) # ","
    # "\"tenantId\":"        # jstr(e.tenantId) # ","
    # "\"actionType\":"      # jstr(actionTypeToText(e.actionType)) # ","
    # "\"timestamp\":"       # e.timestamp.toText() # ","
    # "\"redactedPayload\":" # jstr(e.redactedPayload)
    # "}"
  };

  /// Extract the value of a JSON string field `"name":"value"` from a flat
  /// JSON object. Returns the unescaped value, or "" if not found.
  func extractStringField(json : Text, name : Text) : Text {
    let needle = "\"" # name # "\":\"";
    let chars = json.toArray();
    let nChars = needle.toArray();
    let nLen = nChars.size();
    let hLen = chars.size();
    var i = 0;
    label search while (i + nLen <= hLen) {
      var matched = true;
      var j = 0;
      label cmp while (j < nLen) {
        if (chars[i + j] != nChars[j]) {
          matched := false;
          break cmp;
        };
        j += 1;
      };
      if (matched) {
        // value starts at i + nLen, read until the next unescaped quote
        var k = i + nLen;
        var buf : [Char] = [];
        label read while (k < hLen) {
          let c = chars[k];
          if (c == '\\') {
            // escaped char — take next literally
            if (k + 1 < hLen) {
              buf := buf.concat([chars[k + 1]]);
              k += 2;
            } else {
              k += 1;
            };
          } else {
            if (c == '\"') {
              break read;
            } else {
              buf := buf.concat([c]);
              k += 1;
            };
          };
        };
        return Text.fromIter(buf.values());
      };
      i += 1;
    };
    "";
  };

  /// Extract the value of a JSON numeric field `"name":<number>`.
  func extractIntField(json : Text, name : Text) : Int {
    let needle = "\"" # name # "\":";
    let chars = json.toArray();
    let nChars = needle.toArray();
    let nLen = nChars.size();
    let hLen = chars.size();
    var i = 0;
    label search while (i + nLen <= hLen) {
      var matched = true;
      var j = 0;
      label cmp while (j < nLen) {
        if (chars[i + j] != nChars[j]) {
          matched := false;
          break cmp;
        };
        j += 1;
      };
      if (matched) {
        var k = i + nLen;
        var buf : [Char] = [];
        // skip leading whitespace
        label skip while (k < hLen and (chars[k] == ' ' or chars[k] == '\t')) {
          k += 1;
        };
        label read while (k < hLen) {
          let c = chars[k];
          if (c == '-' or c == '+' or (c >= '0' and c <= '9')) {
            buf := buf.concat([c]);
            k += 1;
          } else {
            break read;
          };
        };
        let txt = Text.fromIter(buf.values());
        if (txt == "") { return 0 };
        switch (Int.fromText(txt)) {
          case (?n) { return n };
          case null { return 0 };
        };
      };
      i += 1;
    };
    0;
  };

  /// Decode a JSON string back into an `AdminAuditEntry`.
  public func decodeEntry(json : Text) : T.AdminAuditEntry {
    let actorText = extractStringField(json, "actor");
    let tenantId = extractStringField(json, "tenantId");
    let actionText = extractStringField(json, "actionType");
    let timestamp = extractIntField(json, "timestamp");
    let redactedPayload = extractStringField(json, "redactedPayload");
    let actorPrincipal = Principal.fromText(actorText);
    let actionType : T.AuditAction = switch (actionText) {
      case ("secretRotation")     { #secretRotation };
      case ("featureFlagChange")  { #featureFlagChange };
      case ("adminCommand")        { #adminCommand };
      case ("credentialUpdate")    { #credentialUpdate };
      case ("leadEdit")            { #leadEdit };
      case ("webhookConfigChange") { #webhookConfigChange };
      case _                       { #other actionText };
    };
    {
      actorPrincipal;
      tenantId;
      actionType;
      timestamp;
      redactedPayload;
    };
  };

  // ── Secret redaction helper ────────────────────────────────────────────────

  /// Replaces common secret patterns (API keys, bearer tokens, passwords)
  /// in `text` with `[REDACTED]`. Callers MUST pass already-redacted payloads
  /// when possible; this helper is a defensive backstop for common patterns.
  ///
  /// Patterns redacted:
  ///   - `Bearer <token>`        → `Bearer [REDACTED]`
  ///   - `password=...` / `pass=...` → `password=[REDACTED]`
  ///   - `api_key=...` / `apikey=...` → `api_key=[REDACTED]`
  ///   - `secret=...`            → `secret=[REDACTED]`
  ///   - `token=...`             → `token=[REDACTED]`
  ///   - `Authorization: <scheme> <value>` → `Authorization: [REDACTED]`
  public func redactSecrets(text : Text) : Text {
    let REDACTED : Text = "[REDACTED]";
    var out = text;
    // Bearer tokens (case-insensitive-ish: cover "Bearer " prefix)
    out := redactAfterPrefix(out, "Bearer ", REDACTED);
    // key=value style secrets
    out := redactAfterPrefix(out, "password=", REDACTED);
    out := redactAfterPrefix(out, "pass=", REDACTED);
    out := redactAfterPrefix(out, "api_key=", REDACTED);
    out := redactAfterPrefix(out, "apikey=", REDACTED);
    out := redactAfterPrefix(out, "secret=", REDACTED);
    out := redactAfterPrefix(out, "token=", REDACTED);
    out := redactAfterPrefix(out, "Authorization: ", REDACTED);
    out;
  };

  /// Replace the value following `prefix` (up to the next whitespace, comma,
  /// quote, or end-of-string) with `replacement`. Case-sensitive prefix match.
  func redactAfterPrefix(text : Text, prefix : Text, replacement : Text) : Text {
    let chars = text.toArray();
    let pChars = prefix.toArray();
    let pLen = pChars.size();
    let hLen = chars.size();
    if (pLen == 0 or pLen > hLen) { return text };
    var i = 0;
    var result : Text = "";
    var consumed = 0;
    label outer while (i + pLen <= hLen) {
      var matched = true;
      var j = 0;
      label cmp while (j < pLen) {
        if (chars[i + j] != pChars[j]) {
          matched := false;
          break cmp;
        };
        j += 1;
      };
      if (matched) {
        // append everything before the match
        result := result # Text.fromIter(chars.sliceToArray(consumed, i).values());
        // append prefix + replacement
        result := result # prefix # replacement;
        // skip past the matched value: advance until whitespace/comma/quote/end
        var k = i + pLen;
        label skip while (k < hLen) {
          let c = chars[k];
          if (c == ' ' or c == '\t' or c == '\n' or c == '\r' or c == ',' or c == '\"' or c == '}' or c == ']') {
            break skip;
          };
          k += 1;
        };
        consumed := k;
        i := k;
      } else {
        i += 1;
      };
    };
    if (consumed == 0) { return text };
    // append the remainder
    result := result # Text.fromIter(chars.sliceToArray(consumed, hLen).values());
    result;
  };

  // ── Key construction ───────────────────────────────────────────────────────

  /// Build a globally-unique storage key for an audit entry.
  /// Format: `admin-audit:<tenantId>:<timestamp>:<nonce>`
  public func makeKey(tenantId : Text, timestamp : Int, nonce : Nat) : Text {
    KEY_PREFIX # tenantId # ":" # timestamp.toText() # ":" # nonce.toText();
  };

  // ── Append (the ONLY mutation path) ─────────────────────────────────────────

  /// Append an immutable admin audit entry to the store.
  ///
  /// The entry is JSON-encoded and saved under a globally-unique key derived
  /// from the tenant, timestamp, and a per-call nonce. There is no update or
  /// delete path — entries are append-only by design.
  public func appendAdminAudit(state : SJS.State, entry : T.AdminAuditEntry, nonce : Nat) : () {
    let key = makeKey(entry.tenantId, entry.timestamp, nonce);
    let json = encodeEntry(entry);
    SJS.save(state, key, json);
  };

  // ── Reads ──────────────────────────────────────────────────────────────────

  /// Internal: collect all entries for a tenant, sorted by timestamp ascending.
  func collectForTenant(state : SJS.State, tenantId : Text) : [T.AdminAuditEntry] {
    let tenantPrefix = KEY_PREFIX # tenantId # ":";
    let keys = SJS.listKeys(state, tenantPrefix);
    let acc = List.empty<T.AdminAuditEntry>();
    for (k in keys.values()) {
      switch (SJS.get(state, k)) {
        case (?json) { acc.add(decodeEntry(json)) };
        case null {};
      };
    };
    let arr = acc.toArray();
    // Sort ascending by timestamp (stable for equal timestamps)
    arr.sort(func(a, b) = Int.compare(a.timestamp, b.timestamp));
  };

  /// Return a paginated slice of admin audit entries for a tenant, optionally
  /// filtered by action type. Entries are returned newest-first (descending
  /// timestamp); `offset` and `limit` apply to that ordering.
  public func getAdminAuditLog(
    state : SJS.State,
    tenantId : Text,
    actionFilter : ?T.AuditAction,
    offset : Nat,
    limit : Nat,
  ) : [T.AdminAuditEntry] {
    let all = collectForTenant(state, tenantId);
    // Apply optional action filter
    let filtered : [T.AdminAuditEntry] = switch (actionFilter) {
      case (null) { all };
      case (?filter) {
        all.filter(func(e : T.AdminAuditEntry) : Bool {
          actionTypeEq(e.actionType, filter);
        });
      };
    };
    // Reverse to newest-first
    let newestFirst = filtered.reverse();
    // Paginate
    let total = newestFirst.size();
    let end = if (offset + limit > total) { total } else { offset + limit };
    if (offset >= total) { return [] };
    newestFirst.sliceToArray(offset, end);
  };

  /// Count the total number of admin audit entries for a tenant.
  /// Honors an optional action filter.
  public func getAdminAuditCount(
    state : SJS.State,
    tenantId : Text,
    actionFilter : ?T.AuditAction,
  ) : Nat {
    let all = collectForTenant(state, tenantId);
    switch (actionFilter) {
      case (null) { all.size() };
      case (?filter) {
        all.foldLeft(0, func(acc, e) {
          if (actionTypeEq(e.actionType, filter)) { acc + 1 } else { acc };
        });
      };
    };
  };

  /// Structural equality for `AuditAction` variants (including the `#other`
  /// text payload).
  func actionTypeEq(a : T.AuditAction, b : T.AuditAction) : Bool {
    switch (a, b) {
      case (#secretRotation, #secretRotation)         true;
      case (#featureFlagChange, #featureFlagChange)  true;
      case (#adminCommand, #adminCommand)             true;
      case (#credentialUpdate, #credentialUpdate)     true;
      case (#leadEdit, #leadEdit)                     true;
      case (#webhookConfigChange, #webhookConfigChange) true;
      case (#other ta, #other tb)                     { ta == tb };
      case _                                          false;
    };
  };

  // ── OQL entity builder ─────────────────────────────────────────────────────

  /// Build the OQL entity declaration for the admin audit log, exposing it to
  /// the Data Intelligence agent. Controller-only — audit logs are private
  /// admin data; no end user reads them directly.
  ///
  /// The entity iterates all `admin-audit:` keys in the store, decodes each
  /// to an `AdminAuditEntry`, and projects the fields as columns. The
  /// `actionType` variant is flattened to its tag text for queryability.
  public func oqlEntity(state : SJS.State) : OQL.Decl {
    OQL.Entity.manual<T.AdminAuditEntry>(
      "adminAuditEntry",
      func() = allEntries(state).values(),
      "AdminAuditEntry",
      "key",
    )
      .payload("key",             func(e) = makeKey(e.tenantId, e.timestamp, 0))
      .payload("actor",          func(e) = e.actorPrincipal.toText())
      .payload("tenantId",        func(e) = e.tenantId)
      .payload("actionType",      func(e) = actionTypeToText(e.actionType))
      .payload("timestamp",       func(e) = e.timestamp)
      .payload("redactedPayload", func(e) = e.redactedPayload)
      .controllerOnly()
      .build();
  };

  /// Internal: decode every `admin-audit:` entry in the store, across all
  /// tenants, sorted ascending by timestamp.
  func allEntries(state : SJS.State) : [T.AdminAuditEntry] {
    let keys = SJS.listKeys(state, KEY_PREFIX);
    let acc = List.empty<T.AdminAuditEntry>();
    for (k in keys.values()) {
      switch (SJS.get(state, k)) {
        case (?json) { acc.add(decodeEntry(json)) };
        case null {};
      };
    };
    let arr = acc.toArray();
    arr.sort(func(a, b) = Int.compare(a.timestamp, b.timestamp));
  };

};
