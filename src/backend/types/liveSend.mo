module {

  /// Structured result returned by both live SMS and live email send methods.
  /// `ok` is true on success; on success `messageId` carries the provider
  /// message identifier (Twilio Message SID / SendGrid message id) and `error`
  /// is null. On failure `ok` is false, `messageId` is null, and `error`
  /// carries a human-readable message that NEVER includes raw secrets.
  public type LiveSendResult = {
    ok        : Bool;
    messageId : ?Text;
    error     : ?Text;
  };

};
