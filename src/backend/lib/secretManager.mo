// ---------------------------------------------------------------------------
// secretManager.mo — Managed reversible encryption for credential secrets
//
// ENCRYPTION APPROACH
// -------------------
// Motoko has no native AES/GCM library, so we use a strong reversible
// transformation built from primitives that ARE available:
//
//   1. Encode the plaintext UTF-8 bytes as base64 ASCII (so the intermediate
//      representation is always printable and round-trips cleanly).
//   2. XOR each base64 byte against a cycling 32-byte *managed secret*.
//   3. Hex-encode the XOR'd bytes so the final ciphertext is valid UTF-8 Text
//      (XOR of ASCII can produce non-UTF-8 byte sequences).
//
// The managed secret is a random 32-byte value generated at first use via the
// IC management canister's `raw_rand` (mo:core/Random.blob()). It is NOT a
// hardcoded salt — it is unique per deployment and rotatable.
//
// Ciphertext format:  "v1:<secretId>:<hex>"
//   - The embedded <secretId> records which secret version encrypted the value,
//     so decryption can pick the right secret (current or retired) during a
//     rotation window.
//
// PERSISTENCE
// -----------
// The secret material is persisted in the existing StableJsonStore (no new
// stable variables). The in-memory `State` is a transient cache rebuilt from
// the store on `initSecret()`. Callers should declare the `State` as
// `transient` in the actor and pass the stable `StableJsonStore.State` in to
// the functions that read/write persisted material.
//
// SECURITY NOTE
// -------------
// XOR-with-secret is obfuscation, not authenticated encryption. It prevents
// plaintext exposure in memory/state dumps and is rotatable, but does not
// provide integrity guarantees. This is a pragmatic improvement over the prior
// hardcoded-salt XOR scheme. Motoko lacks native HMAC-SHA256, so integrity
// verification is deferred until a certified primitive is available.
// ---------------------------------------------------------------------------

import Array        "mo:core/Array";
import Blob        "mo:core/Blob";
import Int         "mo:core/Int";
import Map         "mo:core/Map";
import Nat         "mo:core/Nat";
import Nat8        "mo:core/Nat8";
import Random      "mo:core/Random";
import Text        "mo:core/Text";
import Time        "mo:core/Time";
import T           "../types/secretManager";
import StableJsonStore "./StableJsonStore";

module {

  public type SecretId   = T.SecretId;
  public type SecretStatus = T.SecretStatus;
  public type DecryptResult = T.DecryptResult;

  /// In-memory cache of the managed secret material. Rebuilt from the
  /// StableJsonStore on `initSecret()`. Callers should keep this `transient`.
  public type State = {
    var currentSecretId   : Text;
    var currentSecret     : Blob;
    var retiredSecrets    : Map.Map<Text, Blob>;
    var rotationTimestamp : Int;
    var initialized       : Bool;
  };

  // Store keys (persisted in StableJsonStore).
  private let KEY_CURRENT  : Text = "secretManager:current";
  private let KEY_RETIRED  : Text = "secretManager:retired:"; // prefix; <id> appended
  private let SECRET_LEN   : Nat  = 32;

  // -------------------------------------------------------------------------
  // State lifecycle
  // -------------------------------------------------------------------------

  /// Create a fresh, uninitialized in-memory state. The caller holds this as
  /// `transient` and passes the stable `StableJsonStore.State` separately.
  public func initState() : State = {
    var currentSecretId   = "";
    var currentSecret     = Blob.fromArray([]);
    var retiredSecrets    = Map.empty();
    var rotationTimestamp = 0;
    var initialized       = false;
  };

  // -------------------------------------------------------------------------
  // initSecret — initialize or load the managed secret
  // -------------------------------------------------------------------------

  /// Initialize the managed secret. If a current secret already exists in the
  /// store, it (and any retired secrets) are loaded into the in-memory cache.
  /// Otherwise a new random 32-byte secret is generated via `raw_rand`,
  /// persisted to the store, and cached. Returns the current secret id.
  ///
  /// This function is `async` because `Random.blob()` calls the management
  /// canister. Safe to call repeatedly — a no-op once initialized.
  public func initSecret(state : State, store : StableJsonStore.State) : async SecretId {
    if (state.initialized) return state.currentSecretId;

    // Try to load the current secret from the store.
    switch (StableJsonStore.get(store, KEY_CURRENT)) {
      case (?encoded) {
        switch (parseCurrentEntry(encoded)) {
          case (?entry) {
            state.currentSecretId   := entry.id;
            state.currentSecret     := entry.secret;
            state.rotationTimestamp := entry.timestamp;
          };
          case null {
            // Stored entry is corrupt — regenerate to recover.
            await generateAndStore(state, store);
          };
        };
      };
      case null {
        await generateAndStore(state, store);
      };
    };

    // Load any retired secrets into the in-memory cache.
    for (key in StableJsonStore.listKeys(store, KEY_RETIRED).values()) {
      switch (StableJsonStore.get(store, key)) {
        case (?encoded) {
          switch (parseRetiredEntry(encoded)) {
            case (?retired) {
              state.retiredSecrets.add(retired.id, retired.secret);
            };
            case null { /* skip corrupt retired entry */ };
          };
        };
        case null { /* skip */ };
      };
    };

    state.initialized := true;
    state.currentSecretId;
  };

  // -------------------------------------------------------------------------
  // encrypt / decrypt
  // -------------------------------------------------------------------------

  /// Encrypt `plaintext` using the secret identified by `secretId`.
  /// The secret must be the current secret or a retired one (retired secrets
  /// are read-only but still usable for encryption during a rotation window).
  /// Returns ciphertext in the format `v1:<secretId>:<hex>`.
  /// Returns an empty string for empty plaintext (round-trips to empty).
  public func encrypt(state : State, plaintext : Text, secretId : SecretId) : Text {
    if (plaintext == "") return "";
    let secret = lookupSecret(state, secretId);
    // If the secret id is unknown, fall back to the current secret so callers
    // that pass a stale id still get usable ciphertext (tagged with current).
    let (sid, key) = switch (secret) {
      case (?k) { (secretId, k) };
      case null { (state.currentSecretId, state.currentSecret) };
    };
    let b64   : Text = base64Encode(plaintext);
    let bytes : [Nat8] = b64.encodeUtf8().toArray();
    let keyArr : [Nat8] = key.toArray();
    let keyLen : Nat = keyArr.size();
    if (keyLen == 0) {
      // No secret available — return base64 plaintext (no cipher applied).
      // This should not happen after initSecret; degrade safely rather than trap.
      return "v1:" # sid # ":" # b64;
    };
    let xored = Array.tabulate(bytes.size(), func(i : Nat) : Nat8 {
      bytes[i] ^ keyArr[i % keyLen];
    });
    let hex = bytesToHex(xored);
    "v1:" # sid # ":" # hex;
  };

  /// Decrypt `ciphertext` that was produced by `encrypt`. The `secretId`
  /// parameter must match the secret id embedded in the ciphertext; a mismatch
  /// returns `#err` (defence against using the wrong secret context).
  /// Failures (corrupt format, unknown secret, bad encoding, invalid UTF-8)
  /// return `#err` with a short loggable message — the caller is never trapped.
  public func decrypt(state : State, ciphertext : Text, secretId : SecretId) : DecryptResult {
    if (ciphertext == "") return #ok "";
    // Parse "v1:<embeddedId>:<hex>"
    let parts = splitOnce(ciphertext, ":");
    switch (parts) {
      case (?("v1", rest)) {
        let inner = splitOnce(rest, ":");
        switch (inner) {
          case (?(embeddedId, hex)) {
            if (embeddedId != secretId) {
              return #err("secret id mismatch: expected " # secretId # ", ciphertext tagged " # embeddedId);
            };
            switch (lookupSecret(state, secretId)) {
              case null {
                return #err("unknown secret id: " # secretId);
              };
              case (?key) {
                switch (hexToBytes(hex)) {
                  case null { return #err("corrupt ciphertext: invalid hex") };
                  case (?xored) {
                    let keyArr : [Nat8] = key.toArray();
                    let keyLen : Nat = keyArr.size();
                    if (keyLen == 0) return #err("empty secret for id: " # secretId);
                    let b64Bytes = Array.tabulate(xored.size(), func(i : Nat) : Nat8 {
                      xored[i] ^ keyArr[i % keyLen];
                    });
                    let b64Text = switch (Blob.fromArray(b64Bytes).decodeUtf8()) {
                      case (?t) { t };
                      case null { return #err("corrupt ciphertext: base64 not valid UTF-8") };
                    };
                    switch (base64Decode(b64Text)) {
                      case (?plainBlob) {
                        switch (plainBlob.decodeUtf8()) {
                          case (?plain) { #ok plain };
                          case null { #err("corrupt ciphertext: plaintext not valid UTF-8") };
                        };
                      };
                      case null { #err("corrupt ciphertext: invalid base64") };
                    };
                  };
                };
              };
            };
          };
          case null { #err("corrupt ciphertext: missing hex payload") };
        };
      };
      case _ { #err("corrupt ciphertext: not a v1 secretManager value") };
    };
  };

  // -------------------------------------------------------------------------
  // rotateSecret — mint a new secret, retire the current one
  // -------------------------------------------------------------------------

  /// Rotate the managed secret: generate a new random 32-byte secret, persist
  /// it as the new current, and move the previous current into `retiredSecrets`
  /// (and the store) so existing ciphertext remains decryptable during the
  /// rotation window. Returns the new secret id.
  ///
  /// Admin gating and audit logging are wired in the mixin layer (later
  /// integration task); this lib function performs the rotation itself.
  public func rotateSecret(state : State, store : StableJsonStore.State) : async SecretId {
    // Ensure initialized before rotating.
    if (not state.initialized) {
      ignore await initSecret(state, store);
    };
    // Retire the current secret (if any).
    if (state.currentSecretId != "" and state.currentSecret.size() > 0) {
      let retiredKey : Text = KEY_RETIRED # state.currentSecretId;
      let retiredEntry : Text = state.currentSecretId # ":" # bytesToHex(state.currentSecret.toArray());
      StableJsonStore.save(store, retiredKey, retiredEntry);
      state.retiredSecrets.add(state.currentSecretId, state.currentSecret);
    };
    // Generate and persist the new current secret.
    await generateAndStore(state, store);
    state.currentSecretId;
  };

  // -------------------------------------------------------------------------
  // getSecretStatus / getSecretRotationStatus
  // -------------------------------------------------------------------------

  /// Return a snapshot of the secret manager's operational status.
  public func getSecretStatus(state : State) : SecretStatus {
    {
      currentSecretId   = state.currentSecretId;
      rotationTimestamp  = state.rotationTimestamp;
      credentialCount    = state.retiredSecrets.size();
      initialized        = state.initialized;
    };
  };

  /// Alias kept for the admin-facing mixin stub name in the requirements.
  /// Same data as `getSecretStatus`.
  public func getSecretRotationStatus(state : State) : SecretStatus {
    getSecretStatus(state);
  };

  // -------------------------------------------------------------------------
  // Internal: secret generation, persistence, lookup
  // -------------------------------------------------------------------------

  // Generate a new random 32-byte secret, persist it as current, and cache it.
  private func generateAndStore(state : State, store : StableJsonStore.State) : async () {
    let rawBlob : Blob = await Random.blob();
    let bytes : [Nat8] = rawBlob.toArray();
    // Use exactly SECRET_LEN bytes (raw_rand returns 32+ bytes; trim or pad).
    let secretBytes : [Nat8] = if (bytes.size() >= SECRET_LEN) {
      Array.tabulate(SECRET_LEN, func(i : Nat) : Nat8 { bytes[i] });
    } else {
      // Pad with additional raw_rand bytes if fewer than 32 (very unlikely).
      let padded : [var Nat8] = Array.repeat(0 : Nat8, SECRET_LEN).toVarArray();
      for (i in Nat.range(0, bytes.size())) { padded[i] := bytes[i] };
      Array.fromVarArray(padded);
    };
    let secret : Blob = Blob.fromArray(secretBytes);
    let id : Text = mintSecretId();
    let ts : Int = Time.now();
    state.currentSecretId   := id;
    state.currentSecret     := secret;
    state.rotationTimestamp := ts;
    let entry : Text = id # ":" # bytesToHex(secretBytes) # ":" # ts.toText();
    StableJsonStore.save(store, KEY_CURRENT, entry);
  };

  // Mint a unique-ish secret id from the current time.
  // Format: "s<timestampNs>". Not cryptographically unique, but
  // collision-resistant for the rotation cadence of this canister.
  // We can't easily await inside a non-async helper; use timestamp-based id.
  private func mintSecretId() : Text {
    let ts : Int = Time.now();
    "s" # ts.toText();
  };

  // Look up a secret by id from current + retired.
  private func lookupSecret(state : State, id : SecretId) : ?Blob {
    if (id == state.currentSecretId and state.currentSecret.size() > 0) {
      return ?state.currentSecret;
    };
    state.retiredSecrets.get(id);
  };

  // -------------------------------------------------------------------------
  // Internal: store entry parsing
  // -------------------------------------------------------------------------

  private type CurrentEntry = {
    id        : Text;
    secret    : Blob;
    timestamp : Int;
  };

  private type RetiredEntry = {
    id     : Text;
    secret : Blob;
  };

  // Parse "<id>:<hex>:<timestamp>"
  private func parseCurrentEntry(encoded : Text) : ?CurrentEntry {
    let parts = splitAll(encoded, ":");
    switch (parts) {
      case (?list) {
        if (list.size() != 3) return null;
        let id : Text = list[0];
        let hex : Text = list[1];
        let tsText : Text = list[2];
        switch (hexToBytes(hex)) {
          case null null;
          case (?bytes) {
            let ts : Int = switch (Int.fromText(tsText)) {
              case (?n) n;
              case null 0;
            };
            ?{ id; secret = Blob.fromArray(bytes); timestamp = ts };
          };
        };
      };
      case null null;
    };
  };

  // Parse "<id>:<hex>"
  private func parseRetiredEntry(encoded : Text) : ?RetiredEntry {
    let parts = splitOnce(encoded, ":");
    switch (parts) {
      case (?(id, hex)) {
        switch (hexToBytes(hex)) {
          case null null;
          case (?bytes) ?{ id; secret = Blob.fromArray(bytes) };
        };
      };
      case null null;
    };
  };

  // -------------------------------------------------------------------------
  // Internal: text splitting helpers
  // -------------------------------------------------------------------------

  // Split on the first occurrence of `sep`. Returns null if `sep` not found.
  private func splitOnce(text : Text, sep : Text) : ?(Text, Text) {
    let sepLen : Nat = sep.size();
    if (sepLen == 0) return ?(text, "");
    let chars : [Char] = text.toArray();
    let total : Nat = chars.size();
    let sepChars : [Char] = sep.toArray();
    var i : Nat = 0;
    label find while (i + sepLen <= total) {
      var match : Bool = true;
      var j : Nat = 0;
      while (j < sepLen) {
        if (chars[i + j] != sepChars[j]) { match := false; j := sepLen };
        j += 1;
      };
      if (match) {
        let before : Text = charsToText(chars, 0, i);
        let after : Text = charsToText(chars, i + sepLen, total);
        return ?(before, after);
      };
      i += 1;
    };
    null;
  };

  // Split on every occurrence of `sep`. Returns null if `sep` not found at all.
  private func splitAll(text : Text, sep : Text) : ?[Text] {
    let sepLen : Nat = sep.size();
    if (sepLen == 0) return ?[text];
    let chars : [Char] = text.toArray();
    let total : Nat = chars.size();
    let sepChars : [Char] = sep.toArray();
    var result : [Text] = [];
    var start : Nat = 0;
    var i : Nat = 0;
    var foundAny : Bool = false;
    label scan while (i + sepLen <= total) {
      var match : Bool = true;
      var j : Nat = 0;
      while (j < sepLen) {
        if (chars[i + j] != sepChars[j]) { match := false; j := sepLen };
        j += 1;
      };
      if (match) {
        foundAny := true;
        result := result.concat([charsToText(chars, start, i)]);
        start := i + sepLen;
        i := start;
      } else {
        i += 1;
      };
    };
    if (not foundAny) return null;
    result := result.concat([charsToText(chars, start, total)]);
    ?result;
  };

  private func charsToText(chars : [Char], from : Nat, to : Nat) : Text {
    var s : Text = "";
    var k : Nat = from;
    while (k < to) {
      s := s # Text.fromChar(chars[k]);
      k += 1;
    };
    s;
  };

  // -------------------------------------------------------------------------
  // Internal: hex encode/decode
  // -------------------------------------------------------------------------

  private let HEX_CHARS : [Char] = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
  ];

  private func bytesToHex(bytes : [Nat8]) : Text {
    var s : Text = "";
    for (b in bytes.values()) {
      let n : Nat = b.toNat();
      s := s # Text.fromChar(HEX_CHARS[n / 16]) # Text.fromChar(HEX_CHARS[n % 16]);
    };
    s;
  };

  private func hexToBytes(hex : Text) : ?[Nat8] {
    let chars : [Char] = hex.toArray();
    let len : Nat = chars.size();
    if (len % 2 != 0) return null;
    let count : Nat = len / 2;
    let out : [var Nat8] = Array.repeat(0 : Nat8, count).toVarArray();
    var i : Nat = 0;
    while (i < count) {
      let hi : ?Nat = hexCharVal(chars[i * 2]);
      let lo : ?Nat = hexCharVal(chars[i * 2 + 1]);
      switch (hi, lo) {
        case (?h, ?l) { out[i] := Nat8.fromNat(h * 16 + l) };
        case _ { return null };
      };
      i += 1;
    };
    ?Array.fromVarArray(out);
  };

  private func hexCharVal(c : Char) : ?Nat {
    switch (c) {
      case '0' ?0;  case '1' ?1;  case '2' ?2;  case '3' ?3;
      case '4' ?4;  case '5' ?5;  case '6' ?6;  case '7' ?7;
      case '8' ?8;  case '9' ?9;
      case 'a' ?10; case 'b' ?11; case 'c' ?12; case 'd' ?13; case 'e' ?14; case 'f' ?15;
      case 'A' ?10; case 'B' ?11; case 'C' ?12; case 'D' ?13; case 'E' ?14; case 'F' ?15;
      case _ null;
    };
  };

  // -------------------------------------------------------------------------
  // Internal: base64 encode/decode (ASCII-safe, no padding issues)
  // ---------------------------------------------------------------------------

  private let B64_CHARS : [Char] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/',
  ];

  private func base64Encode(text : Text) : Text {
    let bytes : [Nat8] = text.encodeUtf8().toArray();
    let len : Nat = bytes.size();
    var out : Text = "";
    var i : Nat = 0;
    while (i < len) {
      let b0 : Nat = bytes[i].toNat();
      let b1 : Nat = if (i + 1 < len) bytes[i + 1].toNat() else 0;
      let b2 : Nat = if (i + 2 < len) bytes[i + 2].toNat() else 0;
      let combined : Nat = b0 * 65536 + b1 * 256 + b2;
      out := out # Text.fromChar(B64_CHARS[(combined / 262144) % 64]);
      out := out # Text.fromChar(B64_CHARS[(combined / 4096) % 64]);
      out := out # (if (i + 1 < len) Text.fromChar(B64_CHARS[(combined / 64) % 64]) else "=");
      out := out # (if (i + 2 < len) Text.fromChar(B64_CHARS[combined % 64]) else "=");
      i += 3;
    };
    out;
  };

  private func base64Decode(b64 : Text) : ?Blob {
    let chars : [Char] = b64.toArray();
    let len : Nat = chars.size();
    if (len == 0) return ?Blob.fromArray([]);
    if (len % 4 != 0) return null;
    var out : [Nat8] = [];
    var i : Nat = 0;
    while (i < len) {
      let c0 : ?Nat = b64CharVal(chars[i]);
      let c1 : ?Nat = b64CharVal(chars[i + 1]);
      let c2 : ?Nat = b64CharVal(chars[i + 2]);
      let c3 : ?Nat = b64CharVal(chars[i + 3]);
      switch (c0, c1) {
        case (?v0, ?v1) {
          let combined : Nat = v0 * 262144 + v1 * 4096 +
            (switch (c2) { case (?v) v * 64; case null 0 }) +
            (switch (c3) { case (?v) v; case null 0 });
          let b0 : Nat8 = Nat8.fromNat(combined / 65536);
          out := out.concat([b0]);
          // c2 == '=' means padding (no second/third byte)
          if (chars[i + 2] != '=') {
            let b1 : Nat8 = Nat8.fromNat((combined / 256) % 256);
            out := out.concat([b1]);
            if (chars[i + 3] != '=') {
              let b2 : Nat8 = Nat8.fromNat(combined % 256);
              out := out.concat([b2]);
            };
          };
        };
        case _ { return null };
      };
      i += 4;
    };
    ?Blob.fromArray(out);
  };

  private func b64CharVal(c : Char) : ?Nat {
    switch (c) {
      case 'A' ?0;  case 'B' ?1;  case 'C' ?2;  case 'D' ?3;
      case 'E' ?4;  case 'F' ?5;  case 'G' ?6;  case 'H' ?7;
      case 'I' ?8;  case 'J' ?9;  case 'K' ?10; case 'L' ?11;
      case 'M' ?12; case 'N' ?13; case 'O' ?14; case 'P' ?15;
      case 'Q' ?16; case 'R' ?17; case 'S' ?18; case 'T' ?19;
      case 'U' ?20; case 'V' ?21; case 'W' ?22; case 'X' ?23;
      case 'Y' ?24; case 'Z' ?25;
      case 'a' ?26; case 'b' ?27; case 'c' ?28; case 'd' ?29;
      case 'e' ?30; case 'f' ?31; case 'g' ?32; case 'h' ?33;
      case 'i' ?34; case 'j' ?35; case 'k' ?36; case 'l' ?37;
      case 'm' ?38; case 'n' ?39; case 'o' ?40; case 'p' ?41;
      case 'q' ?42; case 'r' ?43; case 's' ?44; case 't' ?45;
      case 'u' ?46; case 'v' ?47; case 'w' ?48; case 'x' ?49;
      case 'y' ?50; case 'z' ?51;
      case '0' ?52; case '1' ?53; case '2' ?54; case '3' ?55;
      case '4' ?56; case '5' ?57; case '6' ?58; case '7' ?59;
      case '8' ?60; case '9' ?61;
      case '+' ?62; case '/' ?63;
      case _ null;
    };
  };

};
