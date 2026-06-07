import Debug "mo:core/Debug";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Types "../types/outreachPipeline";

mixin (
  pipelineLeadsStore       : Map.Map<Text, Types.PipelineLead>,
  inboundRepliesStore      : Map.Map<Text, Types.InboundReply>,
  trialActivityEventsStore : Map.Map<Text, Types.TrialActivityEvent>,
  queuedActionsStore       : Map.Map<Text, Types.OutreachQueuedAction>,
) {

  let funnelRecordStore = Map.empty<Text, Types.FunnelRecord>();

  // === PIPELINE LEADS ===

  public shared func getPipelineLeads() : async [Types.PipelineLead] {
    pipelineLeadsStore.values().toArray()
  };

  public shared func addPipelineLead(lead : Types.PipelineLead) : async () {
    pipelineLeadsStore.add(lead.id, lead);
  };

  public shared func movePipelineLead(leadId : Text, newLane : Text) : async () {
    switch (pipelineLeadsStore.get(leadId)) {
      case null { Debug.print("Lead not found: " # leadId) };
      case (?existing) {
        let now = Time.now();
        let entry : Types.PipelineActivityEntry = {
          timestamp = now;
          action = "lane_change";
          details = "Moved to " # newLane;
        };
        let updated : Types.PipelineLead = {
          existing with
          laneStatus = newLane;
          laneMoveTimestamp = now;
          autoTriggerScheduledAt = if (newLane == "new") ?(now + 1_800_000_000_000) else existing.autoTriggerScheduledAt;
          activityLog = existing.activityLog.concat([entry]);
        };
        pipelineLeadsStore.add(leadId, updated);
      };
    };
  };

  public shared func cancelAutoTrigger(leadId : Text) : async () {
    switch (pipelineLeadsStore.get(leadId)) {
      case null { };
      case (?existing) {
        let updated : Types.PipelineLead = { existing with autoTriggerCancelled = true };
        pipelineLeadsStore.add(leadId, updated);
      };
    };
  };

  // === INBOUND REPLIES ===

  public shared func getInboundReplies(leadId : ?Text) : async [Types.InboundReply] {
    let all = inboundRepliesStore.values().toArray();
    switch (leadId) {
      case null { all };
      case (?id) { all.filter(func(r : Types.InboundReply) : Bool { r.leadId == id }) };
    };
  };

  public shared func addInboundReply(reply : Types.InboundReply) : async () {
    inboundRepliesStore.add(reply.id, reply);
  };

  public shared func markReplyActionComplete(replyId : Text) : async () {
    switch (inboundRepliesStore.get(replyId)) {
      case null { };
      case (?existing) {
        let updated : Types.InboundReply = { existing with actionStatus = "completed" };
        inboundRepliesStore.add(replyId, updated);
      };
    };
  };

  // === TRIAL ACTIVITY ===

  public shared func recordTrialActivity(trialId : Text, eventType : Text) : async Nat {
    let points : Nat = switch (eventType) {
      case "login" { 5 };
      case "crm_usage" { 2 };
      case "social_usage" { 3 };
      case _ { 1 };
    };
    let now = Time.now();
    let event : Types.TrialActivityEvent = {
      id = trialId # "_" # now.toText();
      trialId = trialId;
      eventType = eventType;
      occurredAt = now;
      pointsAwarded = points;
    };
    trialActivityEventsStore.add(event.id, event);
    points
  };

  public shared func getTrialActivityScore(trialId : Text) : async Nat {
    var total : Nat = 0;
    for (e in trialActivityEventsStore.values()) {
      if (e.trialId == trialId) { total += e.pointsAwarded };
    };
    total
  };

  // === QUEUED OUTREACH ACTIONS ===

  public shared func getPendingQueuedActions() : async [Types.OutreachQueuedAction] {
    let all = queuedActionsStore.values().toArray();
    all.filter(func(a : Types.OutreachQueuedAction) : Bool { a.status == "pending" })
  };

  public shared func approveQueuedAction(actionId : Text) : async () {
    switch (queuedActionsStore.get(actionId)) {
      case null { };
      case (?existing) {
        let updated : Types.OutreachQueuedAction = { existing with status = "approved" };
        queuedActionsStore.add(actionId, updated);
      };
    };
  };

  public shared func cancelQueuedAction(actionId : Text) : async () {
    switch (queuedActionsStore.get(actionId)) {
      case null { };
      case (?existing) {
        let updated : Types.OutreachQueuedAction = { existing with status = "cancelled" };
        queuedActionsStore.add(actionId, updated);
      };
    };
  };

  // === FUNNEL TRACKING ===

  public shared func enrollLeadInFunnel(leadId : Text, campaignId : Text, niche : Text) : async { #ok : Text; #err : Text } {
    let now = Time.now();
    let record : Types.FunnelRecord = {
      leadId;
      campaignId;
      niche;
      emailSentAt = ?now;
      openedAt = null;
      clickedAt = null;
      demoStartedAt = null;
      demoCompletedAt = null;
      trialProvisionedAt = null;
      funnelStep = "email_sent";
      enrolledAt = now;
    };
    funnelRecordStore.add(leadId, record);
    #ok "Lead enrolled in funnel"
  };

  public shared func updateFunnelStep(leadId : Text, step : Text) : async { #ok : Text; #err : Text } {
    switch (funnelRecordStore.get(leadId)) {
      case null { #err "Lead not in funnel" };
      case (?r) {
        let now = Time.now();
        let updated : Types.FunnelRecord = {
          r with
          funnelStep = step;
          openedAt = if (step == "opened") ?now else r.openedAt;
          clickedAt = if (step == "clicked") ?now else r.clickedAt;
          demoStartedAt = if (step == "demo_started") ?now else r.demoStartedAt;
          demoCompletedAt = if (step == "demo_completed") ?now else r.demoCompletedAt;
        };
        funnelRecordStore.add(leadId, updated);
        #ok "Funnel step updated"
      };
    }
  };

  public query func getFunnelRecord(leadId : Text) : async { #ok : Types.FunnelRecord; #err : Text } {
    switch (funnelRecordStore.get(leadId)) {
      case null { #err "No funnel record for lead" };
      case (?r) { #ok r };
    }
  };

  public shared func completeDemoAndProvisionTrial(leadId : Text) : async { #ok : Text; #err : Text } {
    switch (funnelRecordStore.get(leadId)) {
      case null { #err "Lead not in funnel" };
      case (?r) {
        let now = Time.now();
        let updated : Types.FunnelRecord = {
          r with
          demoCompletedAt = ?now;
          trialProvisionedAt = ?now;
          funnelStep = "trial_provisioned";
        };
        funnelRecordStore.add(leadId, updated);
        #ok "Demo completed, trial provisioned, status upgraded to Client"
      };
    }
  };
}
