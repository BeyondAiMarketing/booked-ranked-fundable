module {

  // ── Contact ───────────────────────────────────────────────────────────────
  public type Contact = {
    id              : Text;
    clientBusinessId: Text;
    firstName       : Text;
    lastName        : Text;
    email           : Text;
    phone           : Text;
    title           : Text;
    leadSource      : Text;
    industry        : Text;
    nurtureStatus   : Text;
    notes           : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type ContactUpdate = {
    firstName       : ?Text;
    lastName        : ?Text;
    email           : ?Text;
    phone           : ?Text;
    title           : ?Text;
    leadSource      : ?Text;
    industry        : ?Text;
    nurtureStatus   : ?Text;
    notes           : ?Text;
  };

  // ── Company ───────────────────────────────────────────────────────────────
  public type Company = {
    id              : Text;
    clientBusinessId: Text;
    name            : Text;
    size            : Text;
    vertical        : Text;
    website         : Text;
    address         : Text;
    phone           : Text;
    email           : Text;
    notes           : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type CompanyUpdate = {
    name            : ?Text;
    size            : ?Text;
    vertical        : ?Text;
    website         : ?Text;
    address         : ?Text;
    phone           : ?Text;
    email           : ?Text;
    notes           : ?Text;
  };

  // ── Opportunity ─────────────────────────────────────────────────────────────
  public type OpportunityStage = {
    #New;
    #Qualified;
    #Proposal;
    #Negotiation;
    #ClosedWon;
    #ClosedLost;
  };

  public type Opportunity = {
    id              : Text;
    clientBusinessId: Text;
    contactId       : Text;
    companyId       : Text;
    title           : Text;
    value           : Nat;
    stage           : OpportunityStage;
    closeDate       : Int;
    probability     : Nat;
    notes           : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type OpportunityUpdate = {
    contactId       : ?Text;
    companyId       : ?Text;
    title           : ?Text;
    value           : ?Nat;
    stage           : ?OpportunityStage;
    closeDate       : ?Int;
    probability     : ?Nat;
    notes           : ?Text;
  };

  // ── Task ──────────────────────────────────────────────────────────────────
  public type TaskPriority = {
    #Low;
    #Medium;
    #High;
    #Urgent;
  };

  public type TaskStatus = {
    #NotStarted;
    #InProgress;
    #Completed;
    #Cancelled;
  };

  public type Task = {
    id              : Text;
    clientBusinessId: Text;
    assignedTo      : Text;
    title           : Text;
    description     : Text;
    priority        : TaskPriority;
    status          : TaskStatus;
    dueDate         : Int;
    taskType        : Text;
    relatedToId     : Text;
    relatedToType   : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type TaskUpdate = {
    assignedTo      : ?Text;
    title           : ?Text;
    description     : ?Text;
    priority        : ?TaskPriority;
    status          : ?TaskStatus;
    dueDate         : ?Int;
    taskType        : ?Text;
    relatedToId     : ?Text;
    relatedToType   : ?Text;
  };

  // ── Note ──────────────────────────────────────────────────────────────────
  public type NoteCategory = {
    #General;
    #Call;
    #Meeting;
    #Email;
    #System;
  };

  public type Note = {
    id              : Text;
    clientBusinessId: Text;
    authorId        : Text;
    title           : Text;
    body            : Text;
    category        : NoteCategory;
    relatedToId     : Text;
    relatedToType   : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type NoteUpdate = {
    authorId        : ?Text;
    title           : ?Text;
    body            : ?Text;
    category        : ?NoteCategory;
    relatedToId     : ?Text;
    relatedToType   : ?Text;
  };

  // ── CustomField ───────────────────────────────────────────────────────────
  public type CustomField = {
    id              : Text;
    clientBusinessId: Text;
    name            : Text;
    fieldType       : Text;
    targetEntity    : Text;
    options         : [Text];
    isRequired      : Bool;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type CustomFieldUpdate = {
    name            : ?Text;
    fieldType       : ?Text;
    targetEntity    : ?Text;
    options         : ?[Text];
    isRequired      : ?Bool;
  };

  // ── CustomFieldValue ──────────────────────────────────────────────────────
  public type CustomFieldValue = {
    id              : Text;
    clientBusinessId: Text;
    customFieldId   : Text;
    entityId        : Text;
    entityType      : Text;
    value           : Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  public type CustomFieldValueUpdate = {
    value           : ?Text;
  };

};
