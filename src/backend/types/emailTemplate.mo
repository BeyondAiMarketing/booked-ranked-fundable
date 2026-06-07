module {

  /// A single pre-written campaign email template with merge fields and a fallback.
  public type EmailTemplate = {
    id             : Nat;
    day            : Nat;
    subject        : Text;       // May contain {{merge_fields}}
    body           : Text;       // May contain {{merge_fields}}
    fallbackSubject : Text;      // Plain version, no audit-specific fields
    fallbackBody   : Text;       // Plain version, no audit-specific fields
    updatedAt      : Int;
  };

  /// Admin-editable fields for updating a template.
  public type TemplateUpdate = {
    subject        : Text;
    body           : Text;
    fallbackSubject : Text;
    fallbackBody   : Text;
  };

  /// Per-lead send log entry — records which template version was used.
  public type SendLogEntry = {
    day            : Nat;
    sentAt         : Int;
    templateId     : Nat;
    usedFallback   : Bool;
  };

};
