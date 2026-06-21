import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";

import OutreachTypes "../types/outreach";

module OutreachLib {
  public type State = {
    campaigns : Map.Map<Text, OutreachTypes.Campaign>;
    sequences : Map.Map<Text, OutreachTypes.Sequence>;
    emailTemplates : Map.Map<Text, OutreachTypes.EmailTemplate>;
    smsTemplates : Map.Map<Text, OutreachTypes.SMSTemplate>;
    outreachTasks : Map.Map<Text, OutreachTypes.OutreachTask>;
    var nextId : Nat;
  };

  public func emptyState() : State {
    {
      campaigns = Map.empty<Text, OutreachTypes.Campaign>();
      sequences = Map.empty<Text, OutreachTypes.Sequence>();
      emailTemplates = Map.empty<Text, OutreachTypes.EmailTemplate>();
      smsTemplates = Map.empty<Text, OutreachTypes.SMSTemplate>();
      outreachTasks = Map.empty<Text, OutreachTypes.OutreachTask>();
      var nextId = 0;
    };
  };

  public func generateId(state : State) : Text {
    state.nextId += 1;
    "oc-" # Nat.toText(state.nextId);
  };

  public func generateSequenceId(state : State) : Text {
    state.nextId += 1;
    "os-" # Nat.toText(state.nextId);
  };

  public func generateTemplateId(state : State) : Text {
    state.nextId += 1;
    "ot-" # Nat.toText(state.nextId);
  };

  public func generateTaskId(state : State) : Text {
    state.nextId += 1;
    "otk-" # Nat.toText(state.nextId);
  };

  // ---- CAMPAIGNS ----

  public func createCampaign(
    state : State,
    req : OutreachTypes.CreateCampaignRequest,
  ) : OutreachTypes.CampaignResult {
    let id = generateId(state);
    let now = Time.now();
    let campaign : OutreachTypes.Campaign = {
      id = id;
      clientBusinessId = req.clientBusinessId;
      campaignName = req.campaignName;
      campaignType = req.campaignType;
      status = "draft";
      targetAudience = req.targetAudience;
      verticalProfileId = req.verticalProfileId;
      goal = req.goal;
      startDate = req.startDate;
      endDate = req.endDate;
      budget = req.budget;
      createdAt = now;
      updatedAt = now;
    };
    state.campaigns.add(id, campaign);
    #ok(campaign);
  };

  public func getCampaign(
    state : State,
    id : Text,
  ) : OutreachTypes.CampaignResult {
    switch (state.campaigns.get(id)) {
      case (?campaign) { #ok(campaign) };
      case (null) { #err("Campaign not found") };
    };
  };

  public func updateCampaign(
    state : State,
    id : Text,
    req : OutreachTypes.UpdateCampaignRequest,
  ) : OutreachTypes.CampaignResult {
    switch (state.campaigns.get(id)) {
      case (?existing) {
        let updated : OutreachTypes.Campaign = {
          id = existing.id;
          clientBusinessId = existing.clientBusinessId;
          campaignName = switch (req.campaignName) { case (?v) v; case (null) existing.campaignName };
          campaignType = switch (req.campaignType) { case (?v) v; case (null) existing.campaignType };
          status = switch (req.status) { case (?v) v; case (null) existing.status };
          targetAudience = switch (req.targetAudience) { case (?v) ?v; case (null) existing.targetAudience };
          verticalProfileId = existing.verticalProfileId;
          goal = switch (req.goal) { case (?v) ?v; case (null) existing.goal };
          startDate = switch (req.startDate) { case (?v) ?v; case (null) existing.startDate };
          endDate = switch (req.endDate) { case (?v) ?v; case (null) existing.endDate };
          budget = switch (req.budget) { case (?v) ?v; case (null) existing.budget };
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        state.campaigns.add(id, updated);
        #ok(updated);
      };
      case (null) { #err("Campaign not found") };
    };
  };

  public func deleteCampaign(
    state : State,
    id : Text,
  ) : OutreachTypes.CampaignResult {
    switch (state.campaigns.get(id)) {
      case (?campaign) {
        ignore state.campaigns.remove(id);
        #ok(campaign);
      };
      case (null) { #err("Campaign not found") };
    };
  };

  public func listCampaigns(
    state : State,
  ) : [OutreachTypes.Campaign] {
    let buffer = List.empty<OutreachTypes.Campaign>();
    for ((_, campaign) in state.campaigns.entries()) {
      buffer.add(campaign);
    };
    buffer.toArray();
  };

  public func listCampaignsByClientBusinessId(
    state : State,
    clientBusinessId : Text,
  ) : [OutreachTypes.Campaign] {
    let buffer = List.empty<OutreachTypes.Campaign>();
    for ((_, campaign) in state.campaigns.entries()) {
      if (campaign.clientBusinessId == clientBusinessId) {
        buffer.add(campaign);
      };
    };
    buffer.toArray();
  };

  // ---- SEQUENCES ----

  public func createSequence(
    state : State,
    req : OutreachTypes.CreateSequenceRequest,
  ) : OutreachTypes.SequenceResult {
    let id = generateSequenceId(state);
    let now = Time.now();
    let sequence : OutreachTypes.Sequence = {
      id = id;
      campaignId = req.campaignId;
      sequenceName = req.sequenceName;
      sequenceType = req.sequenceType;
      status = "draft";
      steps = req.steps;
      verticalProfileId = req.verticalProfileId;
      createdAt = now;
      updatedAt = now;
    };
    state.sequences.add(id, sequence);
    #ok(sequence);
  };

  public func getSequence(
    state : State,
    id : Text,
  ) : OutreachTypes.SequenceResult {
    switch (state.sequences.get(id)) {
      case (?sequence) { #ok(sequence) };
      case (null) { #err("Sequence not found") };
    };
  };

  public func updateSequence(
    state : State,
    id : Text,
    req : OutreachTypes.UpdateSequenceRequest,
  ) : OutreachTypes.SequenceResult {
    switch (state.sequences.get(id)) {
      case (?existing) {
        let updated : OutreachTypes.Sequence = {
          id = existing.id;
          campaignId = existing.campaignId;
          sequenceName = switch (req.sequenceName) { case (?v) v; case (null) existing.sequenceName };
          sequenceType = switch (req.sequenceType) { case (?v) v; case (null) existing.sequenceType };
          status = switch (req.status) { case (?v) v; case (null) existing.status };
          steps = switch (req.steps) { case (?v) v; case (null) existing.steps };
          verticalProfileId = existing.verticalProfileId;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        state.sequences.add(id, updated);
        #ok(updated);
      };
      case (null) { #err("Sequence not found") };
    };
  };

  public func deleteSequence(
    state : State,
    id : Text,
  ) : OutreachTypes.SequenceResult {
    switch (state.sequences.get(id)) {
      case (?sequence) {
        ignore state.sequences.remove(id);
        #ok(sequence);
      };
      case (null) { #err("Sequence not found") };
    };
  };

  public func listSequences(
    state : State,
  ) : [OutreachTypes.Sequence] {
    let buffer = List.empty<OutreachTypes.Sequence>();
    for ((_, sequence) in state.sequences.entries()) {
      buffer.add(sequence);
    };
    buffer.toArray();
  };

  public func listSequencesByCampaignId(
    state : State,
    campaignId : Text,
  ) : [OutreachTypes.Sequence] {
    let buffer = List.empty<OutreachTypes.Sequence>();
    for ((_, sequence) in state.sequences.entries()) {
      if (sequence.campaignId == campaignId) {
        buffer.add(sequence);
      };
    };
    buffer.toArray();
  };

  // ---- EMAIL TEMPLATES ----

  public func createEmailTemplate(
    state : State,
    req : OutreachTypes.CreateEmailTemplateRequest,
  ) : OutreachTypes.EmailTemplateResult {
    let id = generateTemplateId(state);
    let now = Time.now();
    let template : OutreachTypes.EmailTemplate = {
      id = id;
      templateName = req.templateName;
      templateType = req.templateType;
      subject = req.subject;
      body = req.body;
      verticalProfileId = req.verticalProfileId;
      variables = req.variables;
      complianceChecked = false;
      createdAt = now;
      updatedAt = now;
    };
    state.emailTemplates.add(id, template);
    #ok(template);
  };

  public func getEmailTemplate(
    state : State,
    id : Text,
  ) : OutreachTypes.EmailTemplateResult {
    switch (state.emailTemplates.get(id)) {
      case (?template) { #ok(template) };
      case (null) { #err("Email template not found") };
    };
  };

  public func deleteEmailTemplate(
    state : State,
    id : Text,
  ) : OutreachTypes.EmailTemplateResult {
    switch (state.emailTemplates.get(id)) {
      case (?template) {
        ignore state.emailTemplates.remove(id);
        #ok(template);
      };
      case (null) { #err("Email template not found") };
    };
  };

  public func listEmailTemplates(
    state : State,
  ) : [OutreachTypes.EmailTemplate] {
    let buffer = List.empty<OutreachTypes.EmailTemplate>();
    for ((_, template) in state.emailTemplates.entries()) {
      buffer.add(template);
    };
    buffer.toArray();
  };

  // ---- SMS TEMPLATES ----

  public func createSMSTemplate(
    state : State,
    req : OutreachTypes.CreateSMSTemplateRequest,
  ) : OutreachTypes.SMSTemplateResult {
    let id = generateTemplateId(state);
    let now = Time.now();
    let template : OutreachTypes.SMSTemplate = {
      id = id;
      templateName = req.templateName;
      templateType = req.templateType;
      body = req.body;
      verticalProfileId = req.verticalProfileId;
      variables = req.variables;
      complianceChecked = false;
      createdAt = now;
      updatedAt = now;
    };
    state.smsTemplates.add(id, template);
    #ok(template);
  };

  public func getSMSTemplate(
    state : State,
    id : Text,
  ) : OutreachTypes.SMSTemplateResult {
    switch (state.smsTemplates.get(id)) {
      case (?template) { #ok(template) };
      case (null) { #err("SMS template not found") };
    };
  };

  public func deleteSMSTemplate(
    state : State,
    id : Text,
  ) : OutreachTypes.SMSTemplateResult {
    switch (state.smsTemplates.get(id)) {
      case (?template) {
        ignore state.smsTemplates.remove(id);
        #ok(template);
      };
      case (null) { #err("SMS template not found") };
    };
  };

  public func listSMSTemplates(
    state : State,
  ) : [OutreachTypes.SMSTemplate] {
    let buffer = List.empty<OutreachTypes.SMSTemplate>();
    for ((_, template) in state.smsTemplates.entries()) {
      buffer.add(template);
    };
    buffer.toArray();
  };

  // ---- OUTREACH TASKS ----

  public func createOutreachTask(
    state : State,
    req : OutreachTypes.CreateOutreachTaskRequest,
  ) : OutreachTypes.OutreachTaskResult {
    let id = generateTaskId(state);
    let now = Time.now();
    let task : OutreachTypes.OutreachTask = {
      id = id;
      campaignId = req.campaignId;
      taskType = req.taskType;
      status = "pending";
      recipientEmail = req.recipientEmail;
      recipientPhone = req.recipientPhone;
      scheduledAt = req.scheduledAt;
      sentAt = null;
      content = req.content;
      subject = req.subject;
      approvalRequestId = null;
      verticalProfileId = req.verticalProfileId;
      createdAt = now;
      updatedAt = now;
    };
    state.outreachTasks.add(id, task);
    #ok(task);
  };

  public func getOutreachTask(
    state : State,
    id : Text,
  ) : OutreachTypes.OutreachTaskResult {
    switch (state.outreachTasks.get(id)) {
      case (?task) { #ok(task) };
      case (null) { #err("Outreach task not found") };
    };
  };

  public func updateOutreachTaskStatus(
    state : State,
    id : Text,
    status : Text,
  ) : OutreachTypes.OutreachTaskResult {
    switch (state.outreachTasks.get(id)) {
      case (?existing) {
        let updated : OutreachTypes.OutreachTask = {
          id = existing.id;
          campaignId = existing.campaignId;
          taskType = existing.taskType;
          status = status;
          recipientEmail = existing.recipientEmail;
          recipientPhone = existing.recipientPhone;
          scheduledAt = existing.scheduledAt;
          sentAt = if (status == "sent") { ?Time.now() } else { existing.sentAt };
          content = existing.content;
          subject = existing.subject;
          approvalRequestId = existing.approvalRequestId;
          verticalProfileId = existing.verticalProfileId;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        state.outreachTasks.add(id, updated);
        #ok(updated);
      };
      case (null) { #err("Outreach task not found") };
    };
  };

  public func deleteOutreachTask(
    state : State,
    id : Text,
  ) : OutreachTypes.OutreachTaskResult {
    switch (state.outreachTasks.get(id)) {
      case (?task) {
        ignore state.outreachTasks.remove(id);
        #ok(task);
      };
      case (null) { #err("Outreach task not found") };
    };
  };

  public func listOutreachTasks(
    state : State,
  ) : [OutreachTypes.OutreachTask] {
    let buffer = List.empty<OutreachTypes.OutreachTask>();
    for ((_, task) in state.outreachTasks.entries()) {
      buffer.add(task);
    };
    buffer.toArray();
  };

  public func listOutreachTasksByCampaignId(
    state : State,
    campaignId : Text,
  ) : [OutreachTypes.OutreachTask] {
    let buffer = List.empty<OutreachTypes.OutreachTask>();
    for ((_, task) in state.outreachTasks.entries()) {
      if (task.campaignId == campaignId) {
        buffer.add(task);
      };
    };
    buffer.toArray();
  };
}
