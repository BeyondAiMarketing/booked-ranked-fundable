import Debug "mo:core/Debug";
import Time "mo:core/Time";
import Text "mo:core/Text";
import T    "../types/crmObjects";
import Lib  "../lib/crmObjects";
import Int "mo:core/Int";

mixin (state : Lib.State) {

  // ── Contact API ───────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func createContact(
    clientBusinessId : Text,
    firstName        : Text,
    lastName         : Text,
    email            : Text,
    phone            : Text,
    title            : Text,
    leadSource       : Text,
    industry         : Text,
    nurtureStatus    : Text,
    notes            : Text,
  ) : async { #ok : T.Contact; #err : Text } {
    let id = "contact-" # Time.now().toText();
    let now = Time.now();
    let contact : T.Contact = {
      id; clientBusinessId; firstName; lastName; email; phone; title;
      leadSource; industry; nurtureStatus; notes;
      createdAt = now; updatedAt = now;
    };
    Lib.saveContact(state, contact);
    #ok contact;
  };

  public shared query ({ caller = _ }) func getContact(id : Text) : async { #ok : T.Contact; #err : Text } {
    switch (Lib.getContact(state, id)) {
      case (?c) #ok c;
      case null #err "Contact not found";
    };
  };

  public shared ({ caller = _ }) func updateContact(id : Text, update : T.ContactUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateContact(state, id, update)) {
      #ok "Updated";
    } else {
      #err "Contact not found";
    };
  };

  public shared ({ caller = _ }) func deleteContact(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeContact(state, id)) {
      #ok "Deleted";
    } else {
      #err "Contact not found";
    };
  };

  public shared query ({ caller = _ }) func listContactsByClient(clientBusinessId : Text) : async { #ok : [T.Contact]; #err : Text } {
    #ok (Lib.listContactsByClient(state, clientBusinessId));
  };

  // ── Company API ───────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func createCompany(
    clientBusinessId : Text,
    name             : Text,
    size             : Text,
    vertical         : Text,
    website          : Text,
    address          : Text,
    phone            : Text,
    email            : Text,
    notes            : Text,
  ) : async { #ok : T.Company; #err : Text } {
    let id = "company-" # Time.now().toText();
    let now = Time.now();
    let company : T.Company = {
      id; clientBusinessId; name; size; vertical; website; address; phone; email; notes;
      createdAt = now; updatedAt = now;
    };
    Lib.saveCompany(state, company);
    #ok company;
  };

  public shared query ({ caller = _ }) func getCompany(id : Text) : async { #ok : T.Company; #err : Text } {
    switch (Lib.getCompany(state, id)) {
      case (?c) #ok c;
      case null #err "Company not found";
    };
  };

  public shared ({ caller = _ }) func updateCompany(id : Text, update : T.CompanyUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateCompany(state, id, update)) {
      #ok "Updated";
    } else {
      #err "Company not found";
    };
  };

  public shared ({ caller = _ }) func deleteCompany(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeCompany(state, id)) {
      #ok "Deleted";
    } else {
      #err "Company not found";
    };
  };

  public shared query ({ caller = _ }) func listCompaniesByClient(clientBusinessId : Text) : async { #ok : [T.Company]; #err : Text } {
    #ok (Lib.listCompaniesByClient(state, clientBusinessId));
  };

  // ── Opportunity API ───────────────────────────────────────────────────────
  public shared ({ caller = _ }) func createOpportunity(
    clientBusinessId : Text,
    contactId        : Text,
    companyId        : Text,
    title            : Text,
    value            : Nat,
    stage            : T.OpportunityStage,
    closeDate        : Int,
    probability      : Nat,
    notes            : Text,
  ) : async { #ok : T.Opportunity; #err : Text } {
    let id = "opportunity-" # Time.now().toText();
    let now = Time.now();
    let opp : T.Opportunity = {
      id; clientBusinessId; contactId; companyId; title; value; stage; closeDate; probability; notes;
      createdAt = now; updatedAt = now;
    };
    Lib.saveOpportunity(state, opp);
    #ok opp;
  };

  public shared query ({ caller = _ }) func getOpportunity(id : Text) : async { #ok : T.Opportunity; #err : Text } {
    switch (Lib.getOpportunity(state, id)) {
      case (?o) #ok o;
      case null #err "Opportunity not found";
    };
  };

  public shared ({ caller = _ }) func updateOpportunity(id : Text, update : T.OpportunityUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateOpportunity(state, id, update)) {
      #ok "Updated";
    } else {
      #err "Opportunity not found";
    };
  };

  public shared ({ caller = _ }) func deleteOpportunity(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeOpportunity(state, id)) {
      #ok "Deleted";
    } else {
      #err "Opportunity not found";
    };
  };

  public shared query ({ caller = _ }) func listOpportunitiesByClient(clientBusinessId : Text) : async { #ok : [T.Opportunity]; #err : Text } {
    #ok (Lib.listOpportunitiesByClient(state, clientBusinessId));
  };

  // ── Task API ──────────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func createTask(
    clientBusinessId : Text,
    assignedTo       : Text,
    title            : Text,
    description      : Text,
    priority         : T.TaskPriority,
    status           : T.TaskStatus,
    dueDate          : Int,
    taskType         : Text,
    relatedToId      : Text,
    relatedToType    : Text,
  ) : async { #ok : T.Task; #err : Text } {
    let id = "task-" # Time.now().toText();
    let now = Time.now();
    let task : T.Task = {
      id; clientBusinessId; assignedTo; title; description; priority; status; dueDate; taskType; relatedToId; relatedToType;
      createdAt = now; updatedAt = now;
    };
    Lib.saveTask(state, task);
    #ok task;
  };

  public shared query ({ caller = _ }) func getTask(id : Text) : async { #ok : T.Task; #err : Text } {
    switch (Lib.getTask(state, id)) {
      case (?t) #ok t;
      case null #err "Task not found";
    };
  };

  public shared ({ caller = _ }) func updateTask(id : Text, update : T.TaskUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateTask(state, id, update)) {
      #ok "Updated";
    } else {
      #err "Task not found";
    };
  };

  public shared ({ caller = _ }) func deleteTask(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeTask(state, id)) {
      #ok "Deleted";
    } else {
      #err "Task not found";
    };
  };

  public shared query ({ caller = _ }) func listTasksByClient(clientBusinessId : Text) : async { #ok : [T.Task]; #err : Text } {
    #ok (Lib.listTasksByClient(state, clientBusinessId));
  };

  // ── Note API ──────────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func createNote(
    clientBusinessId : Text,
    authorId         : Text,
    title            : Text,
    body             : Text,
    category         : T.NoteCategory,
    relatedToId      : Text,
    relatedToType    : Text,
  ) : async { #ok : T.Note; #err : Text } {
    let id = "note-" # Time.now().toText();
    let now = Time.now();
    let note : T.Note = {
      id; clientBusinessId; authorId; title; body; category; relatedToId; relatedToType;
      createdAt = now; updatedAt = now;
    };
    Lib.saveNote(state, note);
    #ok note;
  };

  public shared query ({ caller = _ }) func getNote(id : Text) : async { #ok : T.Note; #err : Text } {
    switch (Lib.getNote(state, id)) {
      case (?n) #ok n;
      case null #err "Note not found";
    };
  };

  public shared ({ caller = _ }) func updateNote(id : Text, update : T.NoteUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateNote(state, id, update)) {
      #ok "Updated";
    } else {
      #err "Note not found";
    };
  };

  public shared ({ caller = _ }) func deleteNote(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeNote(state, id)) {
      #ok "Deleted";
    } else {
      #err "Note not found";
    };
  };

  public shared query ({ caller = _ }) func listNotesByClient(clientBusinessId : Text) : async { #ok : [T.Note]; #err : Text } {
    #ok (Lib.listNotesByClient(state, clientBusinessId));
  };

  // ── CustomField API ─────────────────────────────────────────────────────
  public shared ({ caller = _ }) func createCustomField(
    clientBusinessId : Text,
    name             : Text,
    fieldType        : Text,
    targetEntity     : Text,
    options          : [Text],
    isRequired       : Bool,
  ) : async { #ok : T.CustomField; #err : Text } {
    let id = "customfield-" # Time.now().toText();
    let now = Time.now();
    let field : T.CustomField = {
      id; clientBusinessId; name; fieldType; targetEntity; options; isRequired;
      createdAt = now; updatedAt = now;
    };
    Lib.saveCustomField(state, field);
    #ok field;
  };

  public shared query ({ caller = _ }) func getCustomField(id : Text) : async { #ok : T.CustomField; #err : Text } {
    switch (Lib.getCustomField(state, id)) {
      case (?f) #ok f;
      case null #err "CustomField not found";
    };
  };

  public shared ({ caller = _ }) func updateCustomField(id : Text, update : T.CustomFieldUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateCustomField(state, id, update)) {
      #ok "Updated";
    } else {
      #err "CustomField not found";
    };
  };

  public shared ({ caller = _ }) func deleteCustomField(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeCustomField(state, id)) {
      #ok "Deleted";
    } else {
      #err "CustomField not found";
    };
  };

  public shared query ({ caller = _ }) func listCustomFieldsByClient(clientBusinessId : Text) : async { #ok : [T.CustomField]; #err : Text } {
    #ok (Lib.listCustomFieldsByClient(state, clientBusinessId));
  };

  // ── CustomFieldValue API ────────────────────────────────────────────────
  public shared ({ caller = _ }) func createCustomFieldValue(
    clientBusinessId : Text,
    customFieldId    : Text,
    entityId         : Text,
    entityType       : Text,
    value            : Text,
  ) : async { #ok : T.CustomFieldValue; #err : Text } {
    let id = "cfv-" # Time.now().toText();
    let now = Time.now();
    let cfv : T.CustomFieldValue = {
      id; clientBusinessId; customFieldId; entityId; entityType; value;
      createdAt = now; updatedAt = now;
    };
    Lib.saveCustomFieldValue(state, cfv);
    #ok cfv;
  };

  public shared query ({ caller = _ }) func getCustomFieldValue(id : Text) : async { #ok : T.CustomFieldValue; #err : Text } {
    switch (Lib.getCustomFieldValue(state, id)) {
      case (?v) #ok v;
      case null #err "CustomFieldValue not found";
    };
  };

  public shared ({ caller = _ }) func updateCustomFieldValue(id : Text, update : T.CustomFieldValueUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.updateCustomFieldValue(state, id, update)) {
      #ok "Updated";
    } else {
      #err "CustomFieldValue not found";
    };
  };

  public shared ({ caller = _ }) func deleteCustomFieldValue(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.removeCustomFieldValue(state, id)) {
      #ok "Deleted";
    } else {
      #err "CustomFieldValue not found";
    };
  };

  public shared query ({ caller = _ }) func listCustomFieldValuesByClient(clientBusinessId : Text) : async { #ok : [T.CustomFieldValue]; #err : Text } {
    #ok (Lib.listCustomFieldValuesByClient(state, clientBusinessId));
  };

  public shared query ({ caller = _ }) func listCustomFieldValuesByEntity(entityId : Text, entityType : Text) : async { #ok : [T.CustomFieldValue]; #err : Text } {
    #ok (Lib.listCustomFieldValuesByEntity(state, entityId, entityType));
  };

};
