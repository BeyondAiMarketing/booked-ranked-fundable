module {

  /// Result type for all email send operations.
  public type EmailSendResult = {
    #ok  : Text; // message id or "queued"
    #err : Text; // human-readable error
  };

  /// A persisted record of every email send attempt, keyed by id.
  public type EmailLogRecord = {
    id          : Text;
    emailType   : Text; // "review_request" | "booking_confirmation" | "health_score_alert" | "client_report" | "onboarding" | "warm_sequence"
    tenantId    : Text;
    recipient   : Text; // email address
    subject     : Text;
    status      : Text; // "queued" | "sent" | "failed"
    sentAt      : Int;
    errorMsg    : Text; // "" when successful
  };

  /// Scheduled warm-sequence email — stored so the frontend knows what is pending.
  public type WarmSequenceEmailSchedule = {
    id           : Text;
    enrollmentId : Text;
    touchIndex   : Nat;
    delayHours   : Nat;
    recipient    : Text;
    subject      : Text;
    body         : Text;
    scheduledAt  : Int; // canister time when schedule was recorded
    sendAfter    : Int; // canister time when it should be sent (scheduledAt + delayHours*3_600_000_000_000)
    status       : Text; // "pending" | "sent" | "cancelled"
  };

  /// Event emitted when something interesting happens to a warm-sequence touch.
  public type WarmSequenceEmailEvent = {
    id           : Text;
    enrollmentId : Text;
    touchIndex   : Nat;
    eventType    : Text; // "scheduled" | "sent" | "opened" | "clicked" | "replied" | "bounced" | "unsubscribed"
    occurredAt   : Int;
  };

};
