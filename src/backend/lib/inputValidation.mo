import Text    "mo:core/Text";
import Char    "mo:core/Char";
import Nat     "mo:core/Nat";
import Runtime "mo:core/Runtime";

/// Typed input validators for common input types used by all public endpoints.
///
/// Every validator returns a Result-like variant `{ #ok; #err : Text }` so
/// callers can pattern-match and return the appropriate HTTP error code. The
/// validators are intentionally pragmatic — Motoko lacks regex, so they use
/// character scanning. They reject obviously malformed input without trying to
/// be RFC-strict.
module {

  /// Result-like type returned by every validator. `#ok` carries no payload;
  /// `#err` carries a human-readable reason suitable for surfacing as an HTTP
  /// error body.
  public type ValidationResult = { #ok; #err : Text };

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  /// RFC 5321 caps the local-part at 64 and the domain at 255; the full address
  /// (local@domain) must not exceed 254 octets per RFC 5321 §4.5.3.1.
  let MAX_EMAIL_LEN : Nat = 254;

  /// Reasonable upper bound for URL length. Browsers commonly cap around 2000;
  /// 2048 is a safe, generous ceiling.
  let MAX_URL_LEN : Nat = 2048;

  /// E.164 phone numbers are at most 15 digits. We also accept a 7-digit
  /// minimum to allow short local numbers.
  let MIN_PHONE_DIGITS : Nat = 7;
  let MAX_PHONE_DIGITS : Nat = 15;

  // ---------------------------------------------------------------------------
  // Email
  // ---------------------------------------------------------------------------

  /// Validate an email address.
  ///
  /// Checks: non-empty, length <= 254, contains exactly one '@', the local
  /// part is non-empty, the domain part is non-empty and contains at least
  /// one '.' that is not the first or last character of the domain.
  ///
  /// This is deliberately not RFC-strict — it rejects obviously malformed
  /// addresses without trying to validate the full grammar.
  public func validateEmail(email : Text) : ValidationResult {
    let len = email.size();
    if (len == 0) {
      return #err("email must not be empty");
    };
    if (len > MAX_EMAIL_LEN) {
      return #err("email must not exceed " # MAX_EMAIL_LEN.toText() # " characters");
    };

    // Count '@' and split into local / domain in a single pass.
    var atCount : Nat = 0;
    var localPart : Text = "";
    var domainPart : Text = "";
    let iter = email.split(#char '@');
    let i = iter;
    switch (i.next()) {
      case (?l) { localPart := l };
      case null { return #err("email must contain '@'") };
    };
    switch (i.next()) {
      case (?d) { domainPart := d; atCount := 1 };
      case null { return #err("email must contain '@'") };
    };
    // If there is a third segment, there was more than one '@'.
    switch (i.next()) {
      case (?_) { return #err("email must contain exactly one '@'") };
      case null {};
    };

    if (localPart.size() == 0) {
      return #err("email local part must not be empty");
    };
    if (domainPart.size() == 0) {
      return #err("email domain must not be empty");
    };

    // Domain must contain at least one '.' that is not at the start or end.
    if (not domainPart.contains(#char '.')) {
      return #err("email domain must contain a '.'");
    };
    if (domainPart.startsWith(#char '.') or domainPart.endsWith(#char '.')) {
      return #err("email domain must not start or end with '.'");
    };

    #ok;
  };

  // ---------------------------------------------------------------------------
  // URL
  // ---------------------------------------------------------------------------

  /// Validate a URL.
  ///
  /// Checks: non-empty, length <= 2048, starts with "http://" or "https://",
  /// and has a non-empty host (the part immediately after the scheme, up to
  /// the next '/', '?', or '#').
  public func validateUrl(url : Text) : ValidationResult {
    let len = url.size();
    if (len == 0) {
      return #err("url must not be empty");
    };
    if (len > MAX_URL_LEN) {
      return #err("url must not exceed 2048 characters");
    };

    let lower = url.toLower();
    let rest : Text = if (lower.startsWith(#text "https://")) {
      // 8 = "https://".size()
      url.trimStart(#text "https://");
    } else if (lower.startsWith(#text "http://")) {
      // 7 = "http://".size()
      url.trimStart(#text "http://");
    } else {
      return #err("url must start with http:// or https://");
    };

    if (rest.size() == 0) {
      return #err("url must have a host after the scheme");
    };

    // The host is everything up to the first '/', '?', or '#'. It must be
    // non-empty and contain at least one '.' (a bare hostname like "localhost"
    // is rejected to keep the check simple and avoid false positives on
    // arbitrary text).
    let host = hostFromRest(rest);
    if (host.size() == 0) {
      return #err("url host must not be empty");
    };
    if (not host.contains(#char '.')) {
      return #err("url host must contain a '.'");
    };

    #ok;
  };

  /// Extract the host portion from the text that follows the scheme. The host
  /// ends at the first '/', '?', or '#'.
  func hostFromRest(rest : Text) : Text {
    var result = "";
    for (c in rest.chars()) {
      if (c == '/' or c == '?' or c == '#') {
        return result;
      };
      result := result # Text.fromChar(c);
    };
    result;
  };

  // ---------------------------------------------------------------------------
  // Phone
  // ---------------------------------------------------------------------------

  /// Validate a phone number.
  ///
  /// Strips common separators (spaces, dashes, parentheses, '+', dots), then
  /// checks that the remaining characters are all digits and that the digit
  /// count is between 7 and 15 (E.164 maximum).
  public func validatePhone(phone : Text) : ValidationResult {
    if (phone.size() == 0) {
      return #err("phone must not be empty");
    };

    var digits : Nat = 0;
    for (c in phone.chars()) {
      if (c == ' ' or c == '-' or c == '(' or c == ')' or c == '+' or c == '.') {
        // separator — skip
        ignore c;
      } else if (c.isDigit()) {
        digits += 1;
      } else {
        return #err("phone contains invalid character: '" # Text.fromChar(c) # "'");
      };
    };

    if (digits < MIN_PHONE_DIGITS) {
      return #err("phone must contain at least " # MIN_PHONE_DIGITS.toText() # " digits");
    };
    if (digits > MAX_PHONE_DIGITS) {
      return #err("phone must not exceed " # MAX_PHONE_DIGITS.toText() # " digits");
    };

    #ok;
  };

  // ---------------------------------------------------------------------------
  // Bounded string
  // ---------------------------------------------------------------------------

  /// Validate that a string's length falls within [minLen, maxLen] inclusive.
  ///
  /// Both bounds are inclusive. `minLen` must be <= `maxLen`; this is a
  /// programmer error and traps rather than returning a validation error.
  public func validateBoundedString(text : Text, minLen : Nat, maxLen : Nat) : ValidationResult {
    if (minLen > maxLen) {
      Runtime.trap("validateBoundedString: minLen > maxLen");
    };
    let len = text.size();
    if (len < minLen) {
      return #err("text length " # len.toText() # " is below minimum " # minLen.toText());
    };
    if (len > maxLen) {
      return #err("text length " # len.toText() # " exceeds maximum " # maxLen.toText());
    };
    #ok;
  };

  // ---------------------------------------------------------------------------
  // Sanitize string
  // ---------------------------------------------------------------------------

  /// Strip control characters and null bytes from a string.
  ///
  /// Control characters (Char code < 32) are removed, EXCEPT for tab (9),
  /// newline (10), and carriage return (13), which are preserved. Null bytes
  /// (Char code 0) are always removed. The cleaned string is returned.
  public func sanitizeString(text : Text) : Text {
    var result = "";
    for (c in text.chars()) {
      let code = Nat32.toNat(c.toNat32());
      if (code == 0) {
        // null byte — strip
        ignore c;
      } else if (code < 32 and code != 9 and code != 10 and code != 13) {
        // control char (not tab/newline/CR) — strip
        ignore c;
      } else {
        result := result # Text.fromChar(c);
      };
    };
    result;
  };

  // ---------------------------------------------------------------------------
  // Max body size
  // ---------------------------------------------------------------------------

  /// Validate that a request body size does not exceed a maximum.
  ///
  /// Simple comparison. Returns `#err` with a descriptive message when the
  /// body size exceeds the configured maximum.
  public func validateMaxBodySize(bodySize : Nat, maxSize : Nat) : ValidationResult {
    if (bodySize > maxSize) {
      return #err("body size " # bodySize.toText() # " exceeds maximum " # maxSize.toText());
    };
    #ok;
  };

};
