import SJS "./StableJsonStore";
import JS "./JsonSerializer";

import VP "../types/verticalProfile";
import WS "../types/warmSequences";
import ET "../types/emailTemplate";
import CB "../types/campaignBuilder";
import BP "../types/bookedPipeline";
import CRM "../types/crmObjects";
import AQ "../types/approvalQueue";
import WL "../types/workflowLog";
import FR "../types/fundedReadiness";
import Result "mo:core/Result";

module {

  // ── VerticalProfile ───────────────────────────────────────────────────────

  public func saveVerticalProfile(jsonState : SJS.State, profile : VP.VerticalProfileExt) : () {
    let key = "vp:" # profile.id;
    let json = JS.encodeVerticalProfile(profile);
    SJS.save(jsonState, key, json);
  };

  public func getVerticalProfile(jsonState : SJS.State, id : Text) : ?VP.VerticalProfileExt {
    let key = "vp:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { null };
      case (?json) { ?JS.decodeVerticalProfile(json) };
    };
  };

  public func listVerticalProfiles(jsonState : SJS.State) : [VP.VerticalProfileExt] {
    let keys = SJS.listKeys(jsonState, "vp:");
    var result : [VP.VerticalProfileExt] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeVerticalProfile(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeVerticalProfile(jsonState : SJS.State, id : Text) : () {
    let key = "vp:" # id;
    SJS.remove(jsonState, key);
  };

  // ── WarmSequence ────────────────────────────────────────────────────────────

  public func saveWarmSequence(jsonState : SJS.State, seq : WS.WarmSequenceExt) : () {
    let key = "ws:" # seq.id;
    let json = JS.encodeWarmSequence(seq);
    SJS.save(jsonState, key, json);
  };

  public func getWarmSequence(jsonState : SJS.State, id : Text) : ?WS.WarmSequenceExt {
    let key = "ws:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { null };
      case (?json) { ?JS.decodeWarmSequence(json) };
    };
  };

  public func listWarmSequences(jsonState : SJS.State) : [WS.WarmSequenceExt] {
    let keys = SJS.listKeys(jsonState, "ws:");
    var result : [WS.WarmSequenceExt] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeWarmSequence(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeWarmSequence(jsonState : SJS.State, id : Text) : () {
    let key = "ws:" # id;
    SJS.remove(jsonState, key);
  };

  // ── EmailTemplate ───────────────────────────────────────────────────────────

  public func saveEmailTemplate(jsonState : SJS.State, tpl : ET.EmailTemplateExt) : () {
    let key = "et:" # Nat.toText(tpl.id);
    let json = JS.encodeEmailTemplate(tpl);
    SJS.save(jsonState, key, json);
  };

  public func getEmailTemplate(jsonState : SJS.State, id : Nat) : ?ET.EmailTemplateExt {
    let key = "et:" # Nat.toText(id);
    switch (SJS.get(jsonState, key)) {
      case null { null };
      case (?json) { ?JS.decodeEmailTemplate(json) };
    };
  };

  public func listEmailTemplates(jsonState : SJS.State) : [ET.EmailTemplateExt] {
    let keys = SJS.listKeys(jsonState, "et:");
    var result : [ET.EmailTemplateExt] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeEmailTemplate(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeEmailTemplate(jsonState : SJS.State, id : Nat) : () {
    let key = "et:" # Nat.toText(id);
    SJS.remove(jsonState, key);
  };

  // ── Campaign ──────────────────────────────────────────────────────────────

  public func saveCampaign(jsonState : SJS.State, campaign : CB.CampaignBuilderState) : () {
    let key = "campaign:" # campaign.id;
    let json = JS.encodeCampaign(campaign);
    SJS.save(jsonState, key, json);
  };

  public func getCampaign(jsonState : SJS.State, id : Text) : Result.Result<CB.CampaignBuilderState, Text> {
    let key = "campaign:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Campaign not found") };
      case (?json) { #ok(JS.decodeCampaign(json)) };
    };
  };

  public func listCampaigns(jsonState : SJS.State) : [CB.CampaignBuilderState] {
    let keys = SJS.listKeys(jsonState, "campaign:");
    var result : [CB.CampaignBuilderState] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeCampaign(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeCampaign(jsonState : SJS.State, id : Text) : () {
    let key = "campaign:" # id;
    SJS.remove(jsonState, key);
  };

  // ── Lead (BookedPipelineState) ────────────────────────────────────────────

  public func saveLead(jsonState : SJS.State, lead : BP.BookedPipelineState) : () {
    let key = "lead:" # lead.id;
    let json = JS.encodeLead(lead);
    SJS.save(jsonState, key, json);
  };

  public func getLead(jsonState : SJS.State, id : Text) : Result.Result<BP.BookedPipelineState, Text> {
    let key = "lead:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Lead not found") };
      case (?json) { #ok(JS.decodeLead(json)) };
    };
  };

  public func listLeads(jsonState : SJS.State) : [BP.BookedPipelineState] {
    let keys = SJS.listKeys(jsonState, "lead:");
    var result : [BP.BookedPipelineState] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeLead(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeLead(jsonState : SJS.State, id : Text) : () {
    let key = "lead:" # id;
    SJS.remove(jsonState, key);
  };

  // ── Contact ─────────────────────────────────────────────────────────────────

  public func saveContact(jsonState : SJS.State, contact : CRM.Contact) : () {
    let key = "contact:" # contact.id;
    let json = JS.encodeContact(contact);
    SJS.save(jsonState, key, json);
  };

  public func getContact(jsonState : SJS.State, id : Text) : Result.Result<CRM.Contact, Text> {
    let key = "contact:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Contact not found") };
      case (?json) { #ok(JS.decodeContact(json)) };
    };
  };

  public func listContacts(jsonState : SJS.State) : [CRM.Contact] {
    let keys = SJS.listKeys(jsonState, "contact:");
    var result : [CRM.Contact] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeContact(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeContact(jsonState : SJS.State, id : Text) : () {
    let key = "contact:" # id;
    SJS.remove(jsonState, key);
  };

  // ── Opportunity ─────────────────────────────────────────────────────────────

  public func saveOpportunity(jsonState : SJS.State, opp : CRM.Opportunity) : () {
    let key = "opportunity:" # opp.id;
    let json = JS.encodeOpportunity(opp);
    SJS.save(jsonState, key, json);
  };

  public func getOpportunity(jsonState : SJS.State, id : Text) : Result.Result<CRM.Opportunity, Text> {
    let key = "opportunity:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Opportunity not found") };
      case (?json) { #ok(JS.decodeOpportunity(json)) };
    };
  };

  public func listOpportunities(jsonState : SJS.State) : [CRM.Opportunity] {
    let keys = SJS.listKeys(jsonState, "opportunity:");
    var result : [CRM.Opportunity] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeOpportunity(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeOpportunity(jsonState : SJS.State, id : Text) : () {
    let key = "opportunity:" # id;
    SJS.remove(jsonState, key);
  };

  // ── Task ────────────────────────────────────────────────────────────────────

  public func saveTask(jsonState : SJS.State, task : CRM.Task) : () {
    let key = "task:" # task.id;
    let json = JS.encodeTask(task);
    SJS.save(jsonState, key, json);
  };

  public func getTask(jsonState : SJS.State, id : Text) : Result.Result<CRM.Task, Text> {
    let key = "task:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Task not found") };
      case (?json) { #ok(JS.decodeTask(json)) };
    };
  };

  public func listTasks(jsonState : SJS.State) : [CRM.Task] {
    let keys = SJS.listKeys(jsonState, "task:");
    var result : [CRM.Task] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeTask(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeTask(jsonState : SJS.State, id : Text) : () {
    let key = "task:" # id;
    SJS.remove(jsonState, key);
  };

  // ── Note ────────────────────────────────────────────────────────────────────

  public func saveNote(jsonState : SJS.State, note : CRM.Note) : () {
    let key = "note:" # note.id;
    let json = JS.encodeNote(note);
    SJS.save(jsonState, key, json);
  };

  public func getNote(jsonState : SJS.State, id : Text) : Result.Result<CRM.Note, Text> {
    let key = "note:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Note not found") };
      case (?json) { #ok(JS.decodeNote(json)) };
    };
  };

  public func listNotes(jsonState : SJS.State) : [CRM.Note] {
    let keys = SJS.listKeys(jsonState, "note:");
    var result : [CRM.Note] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeNote(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeNote(jsonState : SJS.State, id : Text) : () {
    let key = "note:" # id;
    SJS.remove(jsonState, key);
  };

  // ── ApprovalRequest ─────────────────────────────────────────────────────────

  public func saveApprovalRequest(jsonState : SJS.State, item : AQ.ApprovalItem) : () {
    let key = "approval:" # item.id;
    let json = JS.encodeApprovalRequest(item);
    SJS.save(jsonState, key, json);
  };

  public func getApprovalRequest(jsonState : SJS.State, id : Text) : Result.Result<AQ.ApprovalItem, Text> {
    let key = "approval:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Approval request not found") };
      case (?json) { #ok(JS.decodeApprovalRequest(json)) };
    };
  };

  public func listApprovalRequests(jsonState : SJS.State) : [AQ.ApprovalItem] {
    let keys = SJS.listKeys(jsonState, "approval:");
    var result : [AQ.ApprovalItem] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeApprovalRequest(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func listPendingApprovals(jsonState : SJS.State) : [AQ.ApprovalItem] {
    let all = listApprovalRequests(jsonState);
    Array.filter(all, func(item : AQ.ApprovalItem) : Bool {
      switch (item.status) {
        case (#pending) { true };
        case _ { false };
      };
    });
  };

  public func removeApprovalRequest(jsonState : SJS.State, id : Text) : () {
    let key = "approval:" # id;
    SJS.remove(jsonState, key);
  };

  // ── WorkflowLog ─────────────────────────────────────────────────────────────

  public func saveWorkflowLog(jsonState : SJS.State, entry : WL.WorkflowLogEntry) : () {
    let key = "workflow:" # entry.id;
    let json = JS.encodeWorkflowLog(entry);
    SJS.save(jsonState, key, json);
  };

  public func getWorkflowLog(jsonState : SJS.State, id : Text) : Result.Result<WL.WorkflowLogEntry, Text> {
    let key = "workflow:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Workflow log not found") };
      case (?json) { #ok(JS.decodeWorkflowLog(json)) };
    };
  };

  public func listWorkflowLogs(jsonState : SJS.State) : [WL.WorkflowLogEntry] {
    let keys = SJS.listKeys(jsonState, "workflow:");
    var result : [WL.WorkflowLogEntry] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeWorkflowLog(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func listWorkflowLogsByAgent(jsonState : SJS.State, agentId : Text) : [WL.WorkflowLogEntry] {
    let all = listWorkflowLogs(jsonState);
    Array.filter(all, func(entry : WL.WorkflowLogEntry) : Bool {
      entry.agentType == agentId;
    });
  };

  public func removeWorkflowLog(jsonState : SJS.State, id : Text) : () {
    let key = "workflow:" # id;
    SJS.remove(jsonState, key);
  };

  // ── FundingReadinessProfile ─────────────────────────────────────────────────

  public func saveFundingReadinessProfile(jsonState : SJS.State, profile : FR.FundedReadinessState) : () {
    let key = "funding:" # profile.id;
    let json = JS.encodeFundingReadiness(profile);
    SJS.save(jsonState, key, json);
  };

  public func getFundingReadinessProfile(jsonState : SJS.State, id : Text) : Result.Result<FR.FundedReadinessState, Text> {
    let key = "funding:" # id;
    switch (SJS.get(jsonState, key)) {
      case null { #err("Funding readiness profile not found") };
      case (?json) { #ok(JS.decodeFundingReadiness(json)) };
    };
  };

  public func listFundingReadinessProfiles(jsonState : SJS.State) : [FR.FundedReadinessState] {
    let keys = SJS.listKeys(jsonState, "funding:");
    var result : [FR.FundedReadinessState] = [];
    for (k in keys.vals()) {
      switch (SJS.get(jsonState, k)) {
        case (?json) {
          result := Array.concat(result, [JS.decodeFundingReadiness(json)]);
        };
        case null {};
      };
    };
    result;
  };

  public func removeFundingReadinessProfile(jsonState : SJS.State, id : Text) : () {
    let key = "funding:" # id;
    SJS.remove(jsonState, key);
  };

}
