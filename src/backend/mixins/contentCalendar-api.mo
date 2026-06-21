import ContentCalendarLib "../lib/contentCalendar";
import T                 "../types/contentCalendar";

mixin (contentCalendarState : ContentCalendarLib.State) {

  /// Create or replace a content calendar. Admin/owner callers only.
  public shared ({ caller = _ }) func saveContentCalendar(calendar : T.ContentCalendar) : async { #ok : Text; #err : Text } {
    ContentCalendarLib.saveCalendar(contentCalendarState, calendar);
    #ok "Content calendar saved.";
  };

  /// Retrieve a content calendar by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getContentCalendar(id : Text) : async { #ok : T.ContentCalendar; #err : Text } {
    switch (ContentCalendarLib.getCalendar(contentCalendarState, id)) {
      case (?c)  { #ok c };
      case null  { #err ("No content calendar found for id: " # id) };
    };
  };

  /// Get all content calendars for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getContentCalendarsByTenant(tenantId : Text) : async { #ok : [T.ContentCalendar]; #err : Text } {
    #ok (ContentCalendarLib.getCalendarsByTenant(contentCalendarState, tenantId));
  };

  /// Update calendar approval status. Admin/owner callers only.
  public shared ({ caller = _ }) func updateContentCalendarStatus(id : Text, status : T.CalendarApprovalStatus) : async { #ok : Text; #err : Text } {
    if (ContentCalendarLib.updateCalendarStatus(contentCalendarState, id, status)) {
      #ok "Content calendar status updated.";
    } else {
      #err ("No content calendar found for id: " # id);
    };
  };

  /// Create or replace a calendar entry. Admin/owner callers only.
  public shared ({ caller = _ }) func saveContentCalendarEntry(entry : T.ContentCalendarEntry) : async { #ok : Text; #err : Text } {
    ContentCalendarLib.saveEntry(contentCalendarState, entry);
    #ok "Content calendar entry saved.";
  };

  /// Retrieve a calendar entry by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getContentCalendarEntry(id : Text) : async { #ok : T.ContentCalendarEntry; #err : Text } {
    switch (ContentCalendarLib.getEntry(contentCalendarState, id)) {
      case (?e)  { #ok e };
      case null  { #err ("No content calendar entry found for id: " # id) };
    };
  };

  /// Get all entries for a calendar. Admin/owner callers only.
  public shared ({ caller = _ }) func getContentCalendarEntriesByCalendar(calendarId : Text) : async { #ok : [T.ContentCalendarEntry]; #err : Text } {
    #ok (ContentCalendarLib.getEntriesByCalendar(contentCalendarState, calendarId));
  };

  /// Get all entries for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getContentCalendarEntriesByTenant(tenantId : Text) : async { #ok : [T.ContentCalendarEntry]; #err : Text } {
    #ok (ContentCalendarLib.getEntriesByTenant(contentCalendarState, tenantId));
  };

  /// Apply a partial update to a calendar entry. Admin/owner callers only.
  public shared ({ caller = _ }) func updateContentCalendarEntry(id : Text, update : T.ContentCalendarEntryUpdate) : async { #ok : Text; #err : Text } {
    if (ContentCalendarLib.updateEntry(contentCalendarState, id, update)) {
      #ok "Content calendar entry updated.";
    } else {
      #err ("No content calendar entry found for id: " # id);
    };
  };

  /// Remove a calendar entry. Admin/owner callers only.
  public shared ({ caller = _ }) func removeContentCalendarEntry(id : Text) : async { #ok : Text; #err : Text } {
    if (ContentCalendarLib.removeEntry(contentCalendarState, id)) {
      #ok "Content calendar entry removed.";
    } else {
      #err ("No content calendar entry found for id: " # id);
    };
  };

};
