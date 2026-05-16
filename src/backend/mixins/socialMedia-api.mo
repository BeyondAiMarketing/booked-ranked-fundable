import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/socialMedia";
import SocialLib "../lib/socialMedia";

/// Public-facing mixin for the Social Media Engagement Engine.
/// Injected state slices:
///   accessControlState   — authorization component state
///   brandVoiceProfiles   — Map<tenantId, BrandVoiceProfile>
///   socialPosts          — Map<postId, SocialPost>
///   socialComments       — Map<commentId, SocialComment>
///   socialAlerts         — Map<alertId, SocialListeningAlert>
///   socialROIMetrics     — Map<tenantId#period, SocialROIMetrics>
///   scheduledPosts       — Map<postId, ScheduledPost>        [NEW]
///   engagementApprovals  — Map<approvalId, EngagementApproval> [NEW]
///   competitorReports    — Map<tenantId, CompetitorIntelReport> [NEW]
///   socialLeads          — Map<leadId, SocialLead>            [NEW]
///   demoFunnelEntries    — Map<entryId, DemoFunnelEntry>      [NEW]
mixin (
  accessControlState  : AccessControl.AccessControlState,
  brandVoiceProfiles  : Map.Map<Text, Types.BrandVoiceProfile>,
  socialPosts         : Map.Map<Text, Types.SocialPost>,
  socialComments      : Map.Map<Text, Types.SocialComment>,
  socialAlerts        : Map.Map<Text, Types.SocialListeningAlert>,
  socialROIMetrics    : Map.Map<Text, Types.SocialROIMetrics>,
  scheduledPosts      : Map.Map<Text, Types.ScheduledPost>,
  engagementApprovals : Map.Map<Text, Types.EngagementApproval>,
  competitorReports   : Map.Map<Text, Types.CompetitorIntelReport>,
  socialLeads         : Map.Map<Text, Types.SocialLead>,
  demoFunnelEntries   : Map.Map<Text, Types.DemoFunnelEntry>
) {

  // ---- BRAND VOICE DNA ----

  public query ({ caller }) func getBrandVoiceProfile(tenantId : Text) : async ?Types.BrandVoiceProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getBrandVoiceProfile(brandVoiceProfiles, tenantId);
  };

  public shared ({ caller }) func setBrandVoiceProfile(tenantId : Text, profile : Types.BrandVoiceProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.setBrandVoiceProfile(brandVoiceProfiles, tenantId, profile);
  };

  // ---- SOCIAL POSTS ----

  public query ({ caller }) func getSocialPostsByTenant(tenantId : Text, startDate : ?Int, endDate : ?Int) : async [Types.SocialPost] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getPostsByTenant(socialPosts, tenantId, startDate, endDate);
  };

  public shared ({ caller }) func createSocialPost(post : Types.SocialPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.createPost(socialPosts, post);
  };

  public shared ({ caller }) func updateSocialPost(tenantId : Text, postId : Text, post : Types.SocialPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.updatePost(socialPosts, tenantId, postId, post);
  };

  public shared ({ caller }) func deleteSocialPost(tenantId : Text, postId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.deletePost(socialPosts, tenantId, postId);
  };

  // ---- COMMENTS & REPLY AGENT ----

  public query ({ caller }) func getSocialCommentsByTenant(tenantId : Text, postId : ?Text) : async [Types.SocialComment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getCommentsByTenant(socialComments, tenantId, postId);
  };

  public shared ({ caller }) func setSocialCommentResponse(tenantId : Text, commentId : Text, response : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.setCommentResponse(socialComments, tenantId, commentId, response);
  };

  public shared ({ caller }) func markSocialCommentResponded(tenantId : Text, commentId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.markCommentResponded(socialComments, tenantId, commentId);
  };

  // ---- POST-TO-LEAD CONVERSION PIPELINE ----

  /// Creates a CRM lead from a social comment with purchase intent and marks the comment as converted.
  public shared ({ caller }) func addLeadFromSocialComment(tenantId : Text, commentId : Text, _leadData : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.markCommentLeadCreated(socialComments, tenantId, commentId);
  };

  // ---- SOCIAL LISTENING ----

  public query ({ caller }) func getSocialListeningAlerts(tenantId : Text) : async [Types.SocialListeningAlert] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getSocialListeningAlerts(socialAlerts, tenantId);
  };

  public shared ({ caller }) func dismissSocialListeningAlert(tenantId : Text, alertId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.dismissSocialListeningAlert(socialAlerts, tenantId, alertId);
  };

  // ---- SOCIAL ROI DASHBOARD ----

  public query ({ caller }) func getSocialROIMetrics(tenantId : Text, period : Text) : async ?Types.SocialROIMetrics {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getSocialROIMetrics(socialROIMetrics, tenantId, period);
  };

  public shared ({ caller }) func upsertSocialROIMetrics(metrics : Types.SocialROIMetrics) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    SocialLib.upsertSocialROIMetrics(socialROIMetrics, metrics);
  };

  // ---- SCHEDULED POSTS [NEW] ----

  public shared ({ caller }) func createScheduledPost(post : Types.ScheduledPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.createScheduledPost(scheduledPosts, post);
  };

  public query ({ caller }) func getScheduledPosts(tenantId : Text) : async [Types.ScheduledPost] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getScheduledPostsByTenant(scheduledPosts, tenantId);
  };

  public shared ({ caller }) func updateScheduledPost(tenantId : Text, postId : Text, post : Types.ScheduledPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.updateScheduledPost(scheduledPosts, tenantId, postId, post);
  };

  // ---- ENGAGEMENT APPROVALS [NEW] ----

  public query ({ caller }) func getEngagementApprovals(tenantId : Text) : async [Types.EngagementApproval] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getEngagementApprovals(engagementApprovals, tenantId);
  };

  public shared ({ caller }) func approveEngagement(tenantId : Text, approvalId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.approveEngagement(engagementApprovals, tenantId, approvalId);
  };

  public shared ({ caller }) func rejectEngagement(tenantId : Text, approvalId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.rejectEngagement(engagementApprovals, tenantId, approvalId);
  };

  public shared ({ caller }) func flagEngagement(tenantId : Text, approvalId : Text, reason : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.flagEngagement(engagementApprovals, tenantId, approvalId, reason);
  };

  // ---- COMPETITOR INTELLIGENCE [NEW] ----

  public query ({ caller }) func getCompetitorIntelReport(tenantId : Text) : async ?Types.CompetitorIntelReport {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getCompetitorIntelReport(competitorReports, tenantId);
  };

  public shared ({ caller }) func refreshCompetitorIntel(report : Types.CompetitorIntelReport) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.refreshCompetitorIntel(competitorReports, report);
  };

  // ---- SOCIAL LEADS [NEW] ----

  public query ({ caller }) func getSocialLeads(tenantId : Text) : async [Types.SocialLead] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getSocialLeads(socialLeads, tenantId);
  };

  public shared ({ caller }) func createSocialLead(lead : Types.SocialLead) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.createSocialLead(socialLeads, lead);
  };

  public shared ({ caller }) func linkSocialLeadToCRM(tenantId : Text, socialLeadId : Text, crmLeadId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.linkSocialLeadToCRM(socialLeads, tenantId, socialLeadId, crmLeadId);
  };

  // ---- DEMO FUNNEL ENTRIES [NEW] ----

  public query ({ caller }) func getDemoFunnelEntries(tenantId : Text) : async [Types.DemoFunnelEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.getDemoFunnelEntries(demoFunnelEntries, tenantId);
  };

  public shared ({ caller }) func addDemoFunnelEntry(entry : Types.DemoFunnelEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.addDemoFunnelEntry(demoFunnelEntries, entry);
  };

  public shared ({ caller }) func updateDemoFunnelEntry(tenantId : Text, entryId : Text, entry : Types.DemoFunnelEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    SocialLib.updateDemoFunnelEntry(demoFunnelEntries, tenantId, entryId, entry);
  };

};
