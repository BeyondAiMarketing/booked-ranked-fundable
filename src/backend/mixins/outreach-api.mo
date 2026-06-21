import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "mo:caffeineai-authorization/access-control";

import OutreachTypes "../types/outreach";
import OutreachLib "../lib/outreach";

module OutreachMixin {
  public func Mixin(state : OutreachLib.State) : actor {
    // ---- CAMPAIGN CRUD ----

    public shared ({ caller }) func createCampaign(
      req : OutreachTypes.CreateCampaignRequest,
    ) : async OutreachTypes.CampaignResult {
      OutreachLib.createCampaign(state, req);
    };

    public shared ({ caller }) func getCampaign(
      id : Text,
    ) : async OutreachTypes.CampaignResult {
      OutreachLib.getCampaign(state, id);
    };

    public shared ({ caller }) func updateCampaign(
      id : Text,
      req : OutreachTypes.UpdateCampaignRequest,
    ) : async OutreachTypes.CampaignResult {
      OutreachLib.updateCampaign(state, id, req);
    };

    public shared ({ caller }) func deleteCampaign(
      id : Text,
    ) : async OutreachTypes.CampaignResult {
      OutreachLib.deleteCampaign(state, id);
    };

    public shared query ({ caller }) func listCampaigns() : async OutreachTypes.CampaignListResult {
      #ok(OutreachLib.listCampaigns(state));
    };

    public shared query ({ caller }) func listCampaignsByClientBusinessId(
      clientBusinessId : Text,
    ) : async OutreachTypes.CampaignListResult {
      #ok(OutreachLib.listCampaignsByClientBusinessId(state, clientBusinessId));
    };

    // ---- SEQUENCE CRUD ----

    public shared ({ caller }) func createSequence(
      req : OutreachTypes.CreateSequenceRequest,
    ) : async OutreachTypes.SequenceResult {
      OutreachLib.createSequence(state, req);
    };

    public shared ({ caller }) func getSequence(
      id : Text,
    ) : async OutreachTypes.SequenceResult {
      OutreachLib.getSequence(state, id);
    };

    public shared ({ caller }) func updateSequence(
      id : Text,
      req : OutreachTypes.UpdateSequenceRequest,
    ) : async OutreachTypes.SequenceResult {
      OutreachLib.updateSequence(state, id, req);
    };

    public shared ({ caller }) func deleteSequence(
      id : Text,
    ) : async OutreachTypes.SequenceResult {
      OutreachLib.deleteSequence(state, id);
    };

    public shared query ({ caller }) func listSequences() : async OutreachTypes.SequenceListResult {
      #ok(OutreachLib.listSequences(state));
    };

    public shared query ({ caller }) func listSequencesByCampaignId(
      campaignId : Text,
    ) : async OutreachTypes.SequenceListResult {
      #ok(OutreachLib.listSequencesByCampaignId(state, campaignId));
    };

    // ---- EMAIL TEMPLATE CRUD ----

    public shared ({ caller }) func createEmailTemplate(
      req : OutreachTypes.CreateEmailTemplateRequest,
    ) : async OutreachTypes.EmailTemplateResult {
      OutreachLib.createEmailTemplate(state, req);
    };

    public shared ({ caller }) func getEmailTemplate(
      id : Text,
    ) : async OutreachTypes.EmailTemplateResult {
      OutreachLib.getEmailTemplate(state, id);
    };

    public shared ({ caller }) func deleteEmailTemplate(
      id : Text,
    ) : async OutreachTypes.EmailTemplateResult {
      OutreachLib.deleteEmailTemplate(state, id);
    };

    public shared query ({ caller }) func listEmailTemplates() : async OutreachTypes.EmailTemplateListResult {
      #ok(OutreachLib.listEmailTemplates(state));
    };

    // ---- SMS TEMPLATE CRUD ----

    public shared ({ caller }) func createSMSTemplate(
      req : OutreachTypes.CreateSMSTemplateRequest,
    ) : async OutreachTypes.SMSTemplateResult {
      OutreachLib.createSMSTemplate(state, req);
    };

    public shared ({ caller }) func getSMSTemplate(
      id : Text,
    ) : async OutreachTypes.SMSTemplateResult {
      OutreachLib.getSMSTemplate(state, id);
    };

    public shared ({ caller }) func deleteSMSTemplate(
      id : Text,
    ) : async OutreachTypes.SMSTemplateResult {
      OutreachLib.deleteSMSTemplate(state, id);
    };

    public shared query ({ caller }) func listSMSTemplates() : async OutreachTypes.SMSTemplateListResult {
      #ok(OutreachLib.listSMSTemplates(state));
    };

    // ---- OUTREACH TASK CRUD ----

    public shared ({ caller }) func createOutreachTask(
      req : OutreachTypes.CreateOutreachTaskRequest,
    ) : async OutreachTypes.OutreachTaskResult {
      OutreachLib.createOutreachTask(state, req);
    };

    public shared ({ caller }) func getOutreachTask(
      id : Text,
    ) : async OutreachTypes.OutreachTaskResult {
      OutreachLib.getOutreachTask(state, id);
    };

    public shared ({ caller }) func updateOutreachTaskStatus(
      id : Text,
      status : Text,
    ) : async OutreachTypes.OutreachTaskResult {
      OutreachLib.updateOutreachTaskStatus(state, id, status);
    };

    public shared ({ caller }) func deleteOutreachTask(
      id : Text,
    ) : async OutreachTypes.OutreachTaskResult {
      OutreachLib.deleteOutreachTask(state, id);
    };

    public shared query ({ caller }) func listOutreachTasks() : async OutreachTypes.OutreachTaskListResult {
      #ok(OutreachLib.listOutreachTasks(state));
    };

    public shared query ({ caller }) func listOutreachTasksByCampaignId(
      campaignId : Text,
    ) : async OutreachTypes.OutreachTaskListResult {
      #ok(OutreachLib.listOutreachTasksByCampaignId(state, campaignId));
    };
  };
}
