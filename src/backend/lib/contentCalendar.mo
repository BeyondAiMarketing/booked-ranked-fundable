import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/contentCalendar";

module {

  public type State = {
    calendars : Map.Map<Text, T.ContentCalendar>;
    entries   : Map.Map<Text, T.ContentCalendarEntry>;
  };

  public func emptyState() : State = {
    calendars = Map.empty<Text, T.ContentCalendar>();
    entries   = Map.empty<Text, T.ContentCalendarEntry>();
  };

  // ---- CALENDAR ----

  public func saveCalendar(state : State, calendar : T.ContentCalendar) : () {
    state.calendars.add(calendar.id, calendar);
  };

  public func getCalendar(state : State, id : Text) : ?T.ContentCalendar {
    state.calendars.get(id);
  };

  public func getCalendarsByTenant(state : State, tenantId : Text) : [T.ContentCalendar] {
    let result = List.empty<T.ContentCalendar>();
    for (c in state.calendars.values()) {
      if (c.tenantId == tenantId) { result.add(c) };
    };
    result.toArray();
  };

  public func updateCalendarStatus(state : State, id : Text, status : T.CalendarApprovalStatus) : Bool {
    switch (state.calendars.get(id)) {
      case (?c) {
        state.calendars.add(id, { c with status; updatedAt = Time.now() });
        true;
      };
      case null false;
    };
  };

  // ---- ENTRIES ----

  public func saveEntry(state : State, entry : T.ContentCalendarEntry) : () {
    state.entries.add(entry.id, entry);
  };

  public func getEntry(state : State, id : Text) : ?T.ContentCalendarEntry {
    state.entries.get(id);
  };

  public func getEntriesByCalendar(state : State, calendarId : Text) : [T.ContentCalendarEntry] {
    let result = List.empty<T.ContentCalendarEntry>();
    for (e in state.entries.values()) {
      if (e.calendarId == calendarId) { result.add(e) };
    };
    result.toArray();
  };

  public func getEntriesByTenant(state : State, tenantId : Text) : [T.ContentCalendarEntry] {
    let result = List.empty<T.ContentCalendarEntry>();
    for (e in state.entries.values()) {
      if (e.tenantId == tenantId) { result.add(e) };
    };
    result.toArray();
  };

  public func updateEntry(state : State, id : Text, update : T.ContentCalendarEntryUpdate) : Bool {
    switch (state.entries.get(id)) {
      case (?existing) {
        let updated : T.ContentCalendarEntry = {
          existing with
          platform        = switch (update.platform)        { case (?v) v; case null existing.platform        };
          pillar          = switch (update.pillar)          { case (?v) v; case null existing.pillar          };
          format          = switch (update.format)          { case (?v) v; case null existing.format          };
          objective       = switch (update.objective)       { case (?v) v; case null existing.objective       };
          topic           = switch (update.topic)           { case (?v) v; case null existing.topic           };
          angle           = switch (update.angle)           { case (?v) v; case null existing.angle           };
          visualDirection = switch (update.visualDirection) { case (?v) v; case null existing.visualDirection };
          cta             = switch (update.cta)             { case (?v) v; case null existing.cta             };
          approvalStatus  = switch (update.approvalStatus)  { case (?v) v; case null existing.approvalStatus  };
          updatedAt       = Time.now();
        };
        state.entries.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeEntry(state : State, id : Text) : Bool {
    switch (state.entries.get(id)) {
      case (?_) { state.entries.remove(id); true };
      case null false;
    };
  };

};
