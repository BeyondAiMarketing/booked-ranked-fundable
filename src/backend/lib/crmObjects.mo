import Array "mo:core/Array";
import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/crmObjects";

module {

  public type State = {
    contacts        : Map.Map<Text, T.Contact>;
    companies       : Map.Map<Text, T.Company>;
    opportunities   : Map.Map<Text, T.Opportunity>;
    tasks           : Map.Map<Text, T.Task>;
    notes           : Map.Map<Text, T.Note>;
    customFields    : Map.Map<Text, T.CustomField>;
    customFieldValues: Map.Map<Text, T.CustomFieldValue>;
  };

  public func emptyState() : State = {
    contacts         = Map.empty<Text, T.Contact>();
    companies        = Map.empty<Text, T.Company>();
    opportunities    = Map.empty<Text, T.Opportunity>();
    tasks            = Map.empty<Text, T.Task>();
    notes            = Map.empty<Text, T.Note>();
    customFields     = Map.empty<Text, T.CustomField>();
    customFieldValues= Map.empty<Text, T.CustomFieldValue>();
  };

  // ── Contact CRUD ──────────────────────────────────────────────────────────
  public func saveContact(state : State, contact : T.Contact) : () {
    state.contacts.add(contact.id, contact);
  };

  public func getContact(state : State, id : Text) : ?T.Contact {
    state.contacts.get(id);
  };

  public func updateContact(state : State, id : Text, update : T.ContactUpdate) : Bool {
    switch (state.contacts.get(id)) {
      case (?existing) {
        let updated : T.Contact = {
          existing with
          firstName     = switch (update.firstName)     { case (?v) v; case null existing.firstName     };
          lastName      = switch (update.lastName)      { case (?v) v; case null existing.lastName      };
          email         = switch (update.email)         { case (?v) v; case null existing.email         };
          phone         = switch (update.phone)         { case (?v) v; case null existing.phone         };
          title         = switch (update.title)         { case (?v) v; case null existing.title         };
          leadSource    = switch (update.leadSource)    { case (?v) v; case null existing.leadSource    };
          industry      = switch (update.industry)      { case (?v) v; case null existing.industry      };
          nurtureStatus = switch (update.nurtureStatus) { case (?v) v; case null existing.nurtureStatus };
          notes         = switch (update.notes)         { case (?v) v; case null existing.notes         };
          updatedAt     = Time.now();
        };
        state.contacts.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeContact(state : State, id : Text) : Bool {
    switch (state.contacts.get(id)) {
      case (?_) { state.contacts.remove(id); true };
      case null false;
    };
  };

  public func listContactsByClient(state : State, clientBusinessId : Text) : [T.Contact] {
    let all = state.contacts.toArray();
    all.filterMap(func ((_, c) : (Text, T.Contact)) : ?T.Contact {
      if (c.clientBusinessId == clientBusinessId) ?c else null;
    });
  };

  // ── Company CRUD ──────────────────────────────────────────────────────────
  public func saveCompany(state : State, company : T.Company) : () {
    state.companies.add(company.id, company);
  };

  public func getCompany(state : State, id : Text) : ?T.Company {
    state.companies.get(id);
  };

  public func updateCompany(state : State, id : Text, update : T.CompanyUpdate) : Bool {
    switch (state.companies.get(id)) {
      case (?existing) {
        let updated : T.Company = {
          existing with
          name     = switch (update.name)     { case (?v) v; case null existing.name     };
          size     = switch (update.size)     { case (?v) v; case null existing.size     };
          vertical = switch (update.vertical) { case (?v) v; case null existing.vertical };
          website  = switch (update.website)  { case (?v) v; case null existing.website  };
          address  = switch (update.address)  { case (?v) v; case null existing.address  };
          phone    = switch (update.phone)    { case (?v) v; case null existing.phone    };
          email    = switch (update.email)    { case (?v) v; case null existing.email    };
          notes    = switch (update.notes)    { case (?v) v; case null existing.notes    };
          updatedAt = Time.now();
        };
        state.companies.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeCompany(state : State, id : Text) : Bool {
    switch (state.companies.get(id)) {
      case (?_) { state.companies.remove(id); true };
      case null false;
    };
  };

  public func listCompaniesByClient(state : State, clientBusinessId : Text) : [T.Company] {
    let all = state.companies.toArray();
    all.filterMap(func ((_, c) : (Text, T.Company)) : ?T.Company {
      if (c.clientBusinessId == clientBusinessId) ?c else null;
    });
  };

  // ── Opportunity CRUD ──────────────────────────────────────────────────────
  public func saveOpportunity(state : State, opp : T.Opportunity) : () {
    state.opportunities.add(opp.id, opp);
  };

  public func getOpportunity(state : State, id : Text) : ?T.Opportunity {
    state.opportunities.get(id);
  };

  public func updateOpportunity(state : State, id : Text, update : T.OpportunityUpdate) : Bool {
    switch (state.opportunities.get(id)) {
      case (?existing) {
        let updated : T.Opportunity = {
          existing with
          contactId   = switch (update.contactId)   { case (?v) v; case null existing.contactId   };
          companyId   = switch (update.companyId)   { case (?v) v; case null existing.companyId   };
          title       = switch (update.title)       { case (?v) v; case null existing.title       };
          value       = switch (update.value)       { case (?v) v; case null existing.value       };
          stage       = switch (update.stage)       { case (?v) v; case null existing.stage       };
          closeDate   = switch (update.closeDate)   { case (?v) v; case null existing.closeDate   };
          probability = switch (update.probability) { case (?v) v; case null existing.probability };
          notes       = switch (update.notes)       { case (?v) v; case null existing.notes       };
          updatedAt   = Time.now();
        };
        state.opportunities.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeOpportunity(state : State, id : Text) : Bool {
    switch (state.opportunities.get(id)) {
      case (?_) { state.opportunities.remove(id); true };
      case null false;
    };
  };

  public func listOpportunitiesByClient(state : State, clientBusinessId : Text) : [T.Opportunity] {
    let all = state.opportunities.toArray();
    all.filterMap(func ((_, o) : (Text, T.Opportunity)) : ?T.Opportunity {
      if (o.clientBusinessId == clientBusinessId) ?o else null;
    });
  };

  // ── Task CRUD ─────────────────────────────────────────────────────────────
  public func saveTask(state : State, task : T.Task) : () {
    state.tasks.add(task.id, task);
  };

  public func getTask(state : State, id : Text) : ?T.Task {
    state.tasks.get(id);
  };

  public func updateTask(state : State, id : Text, update : T.TaskUpdate) : Bool {
    switch (state.tasks.get(id)) {
      case (?existing) {
        let updated : T.Task = {
          existing with
          assignedTo   = switch (update.assignedTo)   { case (?v) v; case null existing.assignedTo   };
          title        = switch (update.title)        { case (?v) v; case null existing.title        };
          description  = switch (update.description)  { case (?v) v; case null existing.description  };
          priority     = switch (update.priority)     { case (?v) v; case null existing.priority     };
          status       = switch (update.status)       { case (?v) v; case null existing.status       };
          dueDate      = switch (update.dueDate)      { case (?v) v; case null existing.dueDate      };
          taskType     = switch (update.taskType)     { case (?v) v; case null existing.taskType     };
          relatedToId  = switch (update.relatedToId)  { case (?v) v; case null existing.relatedToId  };
          relatedToType= switch (update.relatedToType){ case (?v) v; case null existing.relatedToType};
          updatedAt    = Time.now();
        };
        state.tasks.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeTask(state : State, id : Text) : Bool {
    switch (state.tasks.get(id)) {
      case (?_) { state.tasks.remove(id); true };
      case null false;
    };
  };

  public func listTasksByClient(state : State, clientBusinessId : Text) : [T.Task] {
    let all = state.tasks.toArray();
    all.filterMap(func ((_, t) : (Text, T.Task)) : ?T.Task {
      if (t.clientBusinessId == clientBusinessId) ?t else null;
    });
  };

  // ── Note CRUD ─────────────────────────────────────────────────────────────
  public func saveNote(state : State, note : T.Note) : () {
    state.notes.add(note.id, note);
  };

  public func getNote(state : State, id : Text) : ?T.Note {
    state.notes.get(id);
  };

  public func updateNote(state : State, id : Text, update : T.NoteUpdate) : Bool {
    switch (state.notes.get(id)) {
      case (?existing) {
        let updated : T.Note = {
          existing with
          authorId     = switch (update.authorId)     { case (?v) v; case null existing.authorId     };
          title        = switch (update.title)        { case (?v) v; case null existing.title        };
          body         = switch (update.body)         { case (?v) v; case null existing.body         };
          category     = switch (update.category)     { case (?v) v; case null existing.category     };
          relatedToId  = switch (update.relatedToId)  { case (?v) v; case null existing.relatedToId  };
          relatedToType= switch (update.relatedToType){ case (?v) v; case null existing.relatedToType};
          updatedAt    = Time.now();
        };
        state.notes.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeNote(state : State, id : Text) : Bool {
    switch (state.notes.get(id)) {
      case (?_) { state.notes.remove(id); true };
      case null false;
    };
  };

  public func listNotesByClient(state : State, clientBusinessId : Text) : [T.Note] {
    let all = state.notes.toArray();
    all.filterMap(func ((_, n) : (Text, T.Note)) : ?T.Note {
      if (n.clientBusinessId == clientBusinessId) ?n else null;
    });
  };

  // ── CustomField CRUD ────────────────────────────────────────────────────
  public func saveCustomField(state : State, field : T.CustomField) : () {
    state.customFields.add(field.id, field);
  };

  public func getCustomField(state : State, id : Text) : ?T.CustomField {
    state.customFields.get(id);
  };

  public func updateCustomField(state : State, id : Text, update : T.CustomFieldUpdate) : Bool {
    switch (state.customFields.get(id)) {
      case (?existing) {
        let updated : T.CustomField = {
          existing with
          name         = switch (update.name)         { case (?v) v; case null existing.name         };
          fieldType    = switch (update.fieldType)    { case (?v) v; case null existing.fieldType    };
          targetEntity = switch (update.targetEntity){ case (?v) v; case null existing.targetEntity};
          options      = switch (update.options)      { case (?v) v; case null existing.options      };
          isRequired   = switch (update.isRequired)   { case (?v) v; case null existing.isRequired   };
          updatedAt    = Time.now();
        };
        state.customFields.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeCustomField(state : State, id : Text) : Bool {
    switch (state.customFields.get(id)) {
      case (?_) { state.customFields.remove(id); true };
      case null false;
    };
  };

  public func listCustomFieldsByClient(state : State, clientBusinessId : Text) : [T.CustomField] {
    let all = state.customFields.toArray();
    all.filterMap(func ((_, f) : (Text, T.CustomField)) : ?T.CustomField {
      if (f.clientBusinessId == clientBusinessId) ?f else null;
    });
  };

  // ── CustomFieldValue CRUD ─────────────────────────────────────────────────
  public func saveCustomFieldValue(state : State, value : T.CustomFieldValue) : () {
    state.customFieldValues.add(value.id, value);
  };

  public func getCustomFieldValue(state : State, id : Text) : ?T.CustomFieldValue {
    state.customFieldValues.get(id);
  };

  public func updateCustomFieldValue(state : State, id : Text, update : T.CustomFieldValueUpdate) : Bool {
    switch (state.customFieldValues.get(id)) {
      case (?existing) {
        let updated : T.CustomFieldValue = {
          existing with
          value     = switch (update.value) { case (?v) v; case null existing.value };
          updatedAt = Time.now();
        };
        state.customFieldValues.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removeCustomFieldValue(state : State, id : Text) : Bool {
    switch (state.customFieldValues.get(id)) {
      case (?_) { state.customFieldValues.remove(id); true };
      case null false;
    };
  };

  public func listCustomFieldValuesByClient(state : State, clientBusinessId : Text) : [T.CustomFieldValue] {
    let all = state.customFieldValues.toArray();
    all.filterMap(func ((_, v) : (Text, T.CustomFieldValue)) : ?T.CustomFieldValue {
      if (v.clientBusinessId == clientBusinessId) ?v else null;
    });
  };

  public func listCustomFieldValuesByEntity(state : State, entityId : Text, entityType : Text) : [T.CustomFieldValue] {
    let all = state.customFieldValues.toArray();
    all.filterMap(func ((_, v) : (Text, T.CustomFieldValue)) : ?T.CustomFieldValue {
      if (v.entityId == entityId and v.entityType == entityType) ?v else null;
    });
  };

};
