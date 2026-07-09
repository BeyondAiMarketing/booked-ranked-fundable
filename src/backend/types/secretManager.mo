module {

  /// Identifier for a managed secret version. A new id is minted on every
  /// rotation so ciphertext tagged with an old id can still be decrypted
  /// during the rotation window (the old secret is kept in `retiredSecrets`).
  public type SecretId = Text;

  /// Result of a decryption attempt. Failures (corrupt ciphertext, unknown
  /// secret id, secret-id mismatch, invalid encoding) return `#err` with a
  /// short loggable message instead of trapping the caller.
  public type DecryptResult = {
    #ok  : Text;
    #err : Text;
  };

  /// Snapshot of the secret manager's operational status, returned by
  /// `getSecretStatus()`.
  public type SecretStatus = {
    currentSecretId    : SecretId;
    rotationTimestamp  : Int;   // nanoseconds since epoch (Time.now)
    credentialCount    : Nat;   // number of retired secrets still held
    initialized        : Bool;
  };

};
