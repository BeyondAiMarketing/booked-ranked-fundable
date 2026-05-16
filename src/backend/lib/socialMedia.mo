import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/socialMedia";

module {

  // ---- TYPE ALIASES ----

  public type BrandVoiceProfile    = Types.BrandVoiceProfile;
  public type SocialPost           = Types.SocialPost;
  public type SocialComment        = Types.SocialComment;
  public type SocialListeningAlert = Types.SocialListeningAlert;
  public type SocialROIMetrics     = Types.SocialROIMetrics;
  public type ScheduledPost        = Types.ScheduledPost;
  public type EngagementApproval   = Types.EngagementApproval;
  public type CompetitorIntelReport = Types.CompetitorIntelReport;
  public type SocialLead           = Types.SocialLead;
  public type DemoFunnelEntry      = Types.DemoFunnelEntry;

  // ---- BRAND VOICE ----

  /// Retrieve the brand voice profile for a tenant, or null if not yet calibrated.
  public func getBrandVoiceProfile(
    brandVoiceProfiles : Map.Map<Text, BrandVoiceProfile>,
    tenantId : Text
  ) : ?BrandVoiceProfile {
    brandVoiceProfiles.get(tenantId);
  };

  /// Upsert the brand voice profile for a tenant.
  public func setBrandVoiceProfile(
    brandVoiceProfiles : Map.Map<Text, BrandVoiceProfile>,
    tenantId : Text,
    profile  : BrandVoiceProfile
  ) : () {
    brandVoiceProfiles.add(tenantId, profile);
  };

  // ---- SOCIAL POSTS ----

  /// Return all posts for a tenant, optionally filtered by a time range.
  public func getPostsByTenant(
    posts     : Map.Map<Text, SocialPost>,
    tenantId  : Text,
    startDate : ?Int,
    endDate   : ?Int
  ) : [SocialPost] {
    let result = List.empty<SocialPost>();
    for (post in posts.values()) {
      if (post.tenantId == tenantId) {
        let afterStart = switch (startDate) {
          case (?s) { post.createdAt >= s };
          case (null) { true };
        };
        let beforeEnd = switch (endDate) {
          case (?e) { post.createdAt <= e };
          case (null) { true };
        };
        if (afterStart and beforeEnd) { result.add(post) };
      };
    };
    result.toArray();
  };

  /// Persist a new social post.
  public func createPost(
    posts : Map.Map<Text, SocialPost>,
    post  : SocialPost
  ) : () {
    posts.add(post.id, post);
  };

  /// Update an existing social post by postId.
  public func updatePost(
    posts    : Map.Map<Text, SocialPost>,
    tenantId : Text,
    postId   : Text,
    post     : SocialPost
  ) : () {
    switch (posts.get(postId)) {
      case (?existing) {
        if (existing.tenantId != tenantId) {
          Runtime.trap("Post not found for tenant");
        };
        posts.add(postId, post);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  /// Delete a social post by postId.
  public func deletePost(
    posts    : Map.Map<Text, SocialPost>,
    tenantId : Text,
    postId   : Text
  ) : () {
    switch (posts.get(postId)) {
      case (?existing) {
        if (existing.tenantId != tenantId) {
          Runtime.trap("Post not found for tenant");
        };
        posts.remove(postId);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  // ---- SOCIAL COMMENTS ----

  /// Return all comments for a tenant; if postId provided, filter to that post.
  public func getCommentsByTenant(
    comments : Map.Map<Text, SocialComment>,
    tenantId : Text,
    postId   : ?Text
  ) : [SocialComment] {
    let result = List.empty<SocialComment>();
    for (comment in comments.values()) {
      if (comment.tenantId == tenantId) {
        let matchesPost = switch (postId) {
          case (?pid) { comment.postId == pid };
          case (null) { true };
        };
        if (matchesPost) { result.add(comment) };
      };
    };
    result.toArray();
  };

  /// Set the AI-drafted response text for a comment.
  public func setCommentResponse(
    comments  : Map.Map<Text, SocialComment>,
    tenantId  : Text,
    commentId : Text,
    response  : Text
  ) : () {
    switch (comments.get(commentId)) {
      case (?c) {
        if (c.tenantId != tenantId) { Runtime.trap("Comment not found for tenant") };
        comments.add(commentId, { c with aiDraftResponse = response });
      };
      case (null) { Runtime.trap("Comment not found") };
    };
  };

  /// Mark a comment as responded (sets responded = true, respondedAt = now).
  public func markCommentResponded(
    comments  : Map.Map<Text, SocialComment>,
    tenantId  : Text,
    commentId : Text
  ) : () {
    switch (comments.get(commentId)) {
      case (?c) {
        if (c.tenantId != tenantId) { Runtime.trap("Comment not found for tenant") };
        comments.add(commentId, { c with responded = true; respondedAt = ?Time.now() });
      };
      case (null) { Runtime.trap("Comment not found") };
    };
  };

  // ---- SOCIAL LISTENING ----

  /// Return all non-dismissed social listening alerts for a tenant.
  public func getSocialListeningAlerts(
    alerts   : Map.Map<Text, SocialListeningAlert>,
    tenantId : Text
  ) : [SocialListeningAlert] {
    let result = List.empty<SocialListeningAlert>();
    for (alert in alerts.values()) {
      if (alert.tenantId == tenantId and not alert.dismissed) {
        result.add(alert);
      };
    };
    result.toArray();
  };

  /// Persist a new social listening alert.
  public func addSocialListeningAlert(
    alerts : Map.Map<Text, SocialListeningAlert>,
    alert  : SocialListeningAlert
  ) : () {
    alerts.add(alert.id, alert);
  };

  /// Mark a social listening alert as dismissed.
  public func dismissSocialListeningAlert(
    alerts   : Map.Map<Text, SocialListeningAlert>,
    tenantId : Text,
    alertId  : Text
  ) : () {
    switch (alerts.get(alertId)) {
      case (?a) {
        if (a.tenantId != tenantId) { Runtime.trap("Alert not found for tenant") };
        alerts.add(alertId, { a with dismissed = true });
      };
      case (null) { Runtime.trap("Alert not found") };
    };
  };

  // ---- SOCIAL ROI METRICS ----

  /// Return the ROI metrics record for a tenant and period.
  public func getSocialROIMetrics(
    roiMetrics : Map.Map<Text, SocialROIMetrics>,
    tenantId   : Text,
    period     : Text
  ) : ?SocialROIMetrics {
    roiMetrics.get(tenantId # "#" # period);
  };

  /// Upsert the ROI metrics for a tenant and period.
  public func upsertSocialROIMetrics(
    roiMetrics : Map.Map<Text, SocialROIMetrics>,
    metrics    : SocialROIMetrics
  ) : () {
    roiMetrics.add(metrics.tenantId # "#" # metrics.period, metrics);
  };

  // ---- POST-TO-LEAD PIPELINE ----

  /// Mark a comment as having generated a CRM lead; returns the comment id.
  public func markCommentLeadCreated(
    comments  : Map.Map<Text, SocialComment>,
    tenantId  : Text,
    commentId : Text
  ) : () {
    switch (comments.get(commentId)) {
      case (?c) {
        if (c.tenantId != tenantId) { Runtime.trap("Comment not found for tenant") };
        comments.add(commentId, { c with leadCreated = true });
      };
      case (null) { Runtime.trap("Comment not found") };
    };
  };

  // ---- SCHEDULED POSTS ----

  /// Persist a new scheduled post.
  public func createScheduledPost(
    scheduledPosts : Map.Map<Text, ScheduledPost>,
    post           : ScheduledPost
  ) : () {
    scheduledPosts.add(post.id, post);
  };

  /// Return all scheduled posts for a tenant.
  public func getScheduledPostsByTenant(
    scheduledPosts : Map.Map<Text, ScheduledPost>,
    tenantId       : Text
  ) : [ScheduledPost] {
    let result = List.empty<ScheduledPost>();
    for (post in scheduledPosts.values()) {
      if (post.tenantId == tenantId) { result.add(post) };
    };
    result.toArray();
  };

  /// Update a scheduled post's content, timing, or status.
  public func updateScheduledPost(
    scheduledPosts : Map.Map<Text, ScheduledPost>,
    tenantId       : Text,
    postId         : Text,
    updated        : ScheduledPost
  ) : () {
    switch (scheduledPosts.get(postId)) {
      case (?existing) {
        if (existing.tenantId != tenantId) {
          Runtime.trap("Scheduled post not found for tenant");
        };
        scheduledPosts.add(postId, { updated with updatedAt = Time.now() });
      };
      case (null) { Runtime.trap("Scheduled post not found") };
    };
  };

  // ---- ENGAGEMENT APPROVALS ----

  /// Return all pending engagement approvals for a tenant.
  public func getEngagementApprovals(
    approvals : Map.Map<Text, EngagementApproval>,
    tenantId  : Text
  ) : [EngagementApproval] {
    let result = List.empty<EngagementApproval>();
    for (a in approvals.values()) {
      if (a.tenantId == tenantId) { result.add(a) };
    };
    result.toArray();
  };

  /// Approve a pending engagement response — unblocks publication.
  public func approveEngagement(
    approvals  : Map.Map<Text, EngagementApproval>,
    tenantId   : Text,
    approvalId : Text
  ) : () {
    switch (approvals.get(approvalId)) {
      case (?a) {
        if (a.tenantId != tenantId) { Runtime.trap("Approval not found for tenant") };
        approvals.add(approvalId, {
          a with
          approvalStatus = #approved;
          resolvedAt = ?Time.now();
        });
      };
      case (null) { Runtime.trap("Approval not found") };
    };
  };

  /// Reject a pending engagement response.
  public func rejectEngagement(
    approvals  : Map.Map<Text, EngagementApproval>,
    tenantId   : Text,
    approvalId : Text
  ) : () {
    switch (approvals.get(approvalId)) {
      case (?a) {
        if (a.tenantId != tenantId) { Runtime.trap("Approval not found for tenant") };
        approvals.add(approvalId, {
          a with
          approvalStatus = #rejected;
          resolvedAt = ?Time.now();
        });
      };
      case (null) { Runtime.trap("Approval not found") };
    };
  };

  /// Flag an approval for manual review with a reason.
  public func flagEngagement(
    approvals  : Map.Map<Text, EngagementApproval>,
    tenantId   : Text,
    approvalId : Text,
    reason     : Text
  ) : () {
    switch (approvals.get(approvalId)) {
      case (?a) {
        if (a.tenantId != tenantId) { Runtime.trap("Approval not found for tenant") };
        approvals.add(approvalId, { a with flagged = true; flagReason = ?reason });
      };
      case (null) { Runtime.trap("Approval not found") };
    };
  };

  // ---- COMPETITOR INTELLIGENCE ----

  /// Return the latest competitor intel report for a tenant.
  public func getCompetitorIntelReport(
    competitorReports : Map.Map<Text, CompetitorIntelReport>,
    tenantId          : Text
  ) : ?CompetitorIntelReport {
    competitorReports.get(tenantId);
  };

  /// Upsert (refresh) the competitor intelligence report for a tenant.
  public func refreshCompetitorIntel(
    competitorReports : Map.Map<Text, CompetitorIntelReport>,
    report            : CompetitorIntelReport
  ) : () {
    competitorReports.add(report.tenantId, { report with generatedAt = Time.now() });
  };

  // ---- SOCIAL LEADS ----

  /// Return all social leads for a tenant.
  public func getSocialLeads(
    socialLeads : Map.Map<Text, SocialLead>,
    tenantId    : Text
  ) : [SocialLead] {
    let result = List.empty<SocialLead>();
    for (lead in socialLeads.values()) {
      if (lead.tenantId == tenantId) { result.add(lead) };
    };
    result.toArray();
  };

  /// Persist a new social lead.
  public func createSocialLead(
    socialLeads : Map.Map<Text, SocialLead>,
    lead        : SocialLead
  ) : () {
    socialLeads.add(lead.id, lead);
  };

  /// Link a social lead to an existing CRM lead record by id.
  public func linkSocialLeadToCRM(
    socialLeads : Map.Map<Text, SocialLead>,
    tenantId    : Text,
    socialLeadId : Text,
    crmLeadId   : Text
  ) : () {
    switch (socialLeads.get(socialLeadId)) {
      case (?lead) {
        if (lead.tenantId != tenantId) { Runtime.trap("Social lead not found for tenant") };
        socialLeads.add(socialLeadId, { lead with crmLeadId = ?crmLeadId });
      };
      case (null) { Runtime.trap("Social lead not found") };
    };
  };

  // ---- DEMO FUNNEL ENTRIES ----

  /// Return all demo funnel entries for a tenant.
  public func getDemoFunnelEntries(
    funnelEntries : Map.Map<Text, DemoFunnelEntry>,
    tenantId      : Text
  ) : [DemoFunnelEntry] {
    let result = List.empty<DemoFunnelEntry>();
    for (entry in funnelEntries.values()) {
      if (entry.tenantId == tenantId) { result.add(entry) };
    };
    result.toArray();
  };

  /// Persist a new demo funnel entry.
  public func addDemoFunnelEntry(
    funnelEntries : Map.Map<Text, DemoFunnelEntry>,
    entry         : DemoFunnelEntry
  ) : () {
    funnelEntries.add(entry.id, entry);
  };

  /// Update engagement count, email sequence status, or trial activation.
  public func updateDemoFunnelEntry(
    funnelEntries : Map.Map<Text, DemoFunnelEntry>,
    tenantId      : Text,
    entryId       : Text,
    updated       : DemoFunnelEntry
  ) : () {
    switch (funnelEntries.get(entryId)) {
      case (?existing) {
        if (existing.tenantId != tenantId) {
          Runtime.trap("Funnel entry not found for tenant");
        };
        funnelEntries.add(entryId, updated);
      };
      case (null) { Runtime.trap("Funnel entry not found") };
    };
  };

};
