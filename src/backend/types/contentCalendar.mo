module {

  /// Content pillar categories for calendar planning.
  public type ContentPillar = {
    #education;
    #promotion;
    #community;
    #authority;
    #entertainment;
  };

  /// Post format types.
  public type PostFormat = {
    #carousel;
    #single_image;
    #video;
    #story;
    #reel;
    #text_only;
    #poll;
    #live;
  };

  /// Marketing objective for a calendar entry.
  public type ContentObjective = {
    #awareness;
    #engagement;
    #conversion;
    #retention;
    #authority;
  };

  /// Approval status for a calendar entry before it moves to drafts.
  public type CalendarApprovalStatus = {
    #draft;
    #pending_review;
    #approved;
    #rejected;
    #needs_revision;
  };

  /// A single day entry in the 30-day content calendar.
  public type ContentCalendarEntry = {
    id              : Text;
    tenantId        : Text;
    calendarId      : Text;
    day             : Nat;
    platform        : Text;
    pillar          : ContentPillar;
    format          : PostFormat;
    objective       : ContentObjective;
    topic           : Text;
    angle           : Text;
    visualDirection : Text;
    cta             : Text;
    approvalStatus  : CalendarApprovalStatus;
    createdAt       : Int;
    updatedAt       : Int;
  };

  /// A 30-day content calendar container.
  public type ContentCalendar = {
    id          : Text;
    tenantId    : Text;
    month       : Text;
    year        : Nat;
    niche       : Text;
    entries     : [Text]; // entry IDs
    status      : CalendarApprovalStatus;
    createdAt   : Int;
    updatedAt   : Int;
  };

  /// Partial update for a calendar entry.
  public type ContentCalendarEntryUpdate = {
    platform        : ?Text;
    pillar          : ?ContentPillar;
    format          : ?PostFormat;
    objective       : ?ContentObjective;
    topic           : ?Text;
    angle           : ?Text;
    visualDirection : ?Text;
    cta             : ?Text;
    approvalStatus  : ?CalendarApprovalStatus;
  };

};
